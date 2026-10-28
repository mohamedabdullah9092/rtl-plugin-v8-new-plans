const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function setup({ readOnlyUI = false } = {}) {
    const messages = [];
    const state = { value: 'previous success', undos: 0, commits: 0, markers: [] };
    let snapshot;
    const figma = {
        currentPage: { selection: [] }, ui: { postMessage: m => messages.push(m) },
        showUI() {}, on() {}, notify() {},
        commitUndo() { snapshot = state.value; state.commits++; },
        createFrame() { const marker = { removed: false, remove() { this.removed = true; } }; state.markers.push(marker); return marker; },
        triggerUndo() { state.value = snapshot; state.undos++; state.markers.at(-1).removed = true; }
    };
    if (readOnlyUI) Object.defineProperty(figma.ui, 'postMessage', { value: figma.ui.postMessage, writable: false, configurable: false });
    const runtime = vm.createContext({ figma, __html__: '', setTimeout() {}, console });
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../code.js'), 'utf8'), runtime);
    const send = (type, id) => figma.ui.onmessage({ type, payload: { operationId: id } });
    return { runtime, figma, messages, state, send };
}

test('cancelling while awaiting translation rolls back only this run and ignores late responses', async () => {
    const f = setup();
    f.runtime.handlePluginMessage = async msg => {
        f.state.value = msg.type === 'run-action' ? 'mirrored' : 'translated';
        f.runtime.sendUIMessage({ type: 'text-nodes-found', payload: {} });
    };
    await f.send('run-action', 'a');
    assert.equal(f.messages.at(-1).operationId, 'a');
    await f.send('cancel-action', 'a');
    assert.equal(f.state.value, 'previous success');
    assert.equal(f.state.undos, 1);
    assert.equal(f.messages.at(-1).type, 'action-cancelled');
    await f.send('apply-translations', 'a');
    await f.send('cancel-action', 'a');
    assert.equal(f.state.value, 'previous success');
    assert.equal(f.state.undos, 1);
});
test('undo waits for an in-flight writer before restoring the document', async () => {
    const f = setup();
    let resume;
    f.runtime.handlePluginMessage = async () => {
        f.state.value = 'partial';
        await new Promise(resolve => { resume = resolve; });
        f.state.value = 'last write';
        f.runtime.sendUIMessage({ type: 'action-complete' });
    };
    const running = f.send('run-action', 'a');
    await f.send('cancel-action', 'a');
    assert.equal(f.state.undos, 0);
    resume();
    await running;
    assert.equal(f.state.value, 'previous success');
    assert.equal(f.state.undos, 1);
    assert(!f.messages.some(m => m.type === 'action-complete'));
});
test('cancellation before any edit cannot undo an earlier success', async () => {
    const f = setup();
    f.runtime.handlePluginMessage = async () => {};
    await f.send('run-action', 'a');
    await f.send('cancel-action', 'a');
    assert.equal(f.state.value, 'previous success');
    assert.equal(f.state.undos, 1);
    assert(f.state.markers[0].removed);
});
test('completion removes the checkpoint and makes the result its own undo entry', async () => {
    const f = setup();
    f.runtime.handlePluginMessage = async () => {
        f.state.value = 'success';
        f.runtime.sendUIMessage({ type: 'action-complete' });
    };
    await f.send('run-action', 'a');
    assert.equal(f.state.commits, 2);
    assert(f.state.markers[0].removed);
    await f.send('cancel-action', 'a');
    assert.equal(f.state.undos, 0);
    assert.equal(f.messages.at(-1).type, 'action-cancel-too-late');
});
test('an old response cannot mutate a newer operation', async () => {
    const f = setup();
    let applies = 0;
    f.runtime.handlePluginMessage = async msg => { if (msg.type === 'apply-translations') applies++; };
    await f.send('run-action', 'a');
    await f.send('cancel-action', 'a');
    await f.send('run-action', 'b');
    await f.send('apply-translations', 'a');
    await f.send('cancel-action', 'a');
    assert.equal(applies, 0);
    await f.send('apply-translations', 'b');
    assert.equal(applies, 1);
});
test('undo failures report the failure instead of claiming changes were restored', async () => {
    const f = setup();
    f.runtime.handlePluginMessage = async () => {};
    f.figma.triggerUndo = () => { throw new Error('undo unavailable'); };
    await f.send('run-action', 'a');
    await f.send('cancel-action', 'a');
    assert.equal(f.messages.at(-1).type, 'plugin-error');
    assert(!f.messages.some(m => m.type === 'action-cancelled'));
});

test('read-only Figma postMessage supports startup, tagged progress and cancellation', async () => {
    const f = setup({ readOnlyUI: true });
    const original = f.figma.ui.postMessage;
    f.runtime.handlePluginMessage = async () => {
        f.state.value = 'mirrored';
        f.runtime.sendUIMessage({ type: 'progress-update', payload: { processed: 1 } });
    };
    await f.send('run-action', 'readonly');
    assert.equal(f.messages.at(-1).operationId, 'readonly');
    await f.send('cancel-action', 'readonly');
    assert.equal(f.messages.at(-1).type, 'action-cancelled');
    assert.equal(f.state.value, 'previous success');
    assert.equal(f.figma.ui.postMessage, original);
});
