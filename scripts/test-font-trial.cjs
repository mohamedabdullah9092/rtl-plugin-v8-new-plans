const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function setup({ trialCount = 3, isPro = false, selection = [], loadFails = false } = {}) {
    const storage = new Map([['trialCount', trialCount], ['isPro', isPro]]);
    const messages = [];
    const events = [];
    const figma = {
        currentPage: { selection }, mixed: Symbol(),
        ui: { postMessage: message => messages.push(message) }, showUI() {}, on() {},
        clientStorage: {
            getAsync: async key => storage.get(key),
            setAsync: async (key, value) => storage.set(key, value)
        },
        listAvailableFontsAsync: async () => [{ fontName: { family: 'Cairo', style: 'Regular' } }],
        loadFontAsync: async () => { if (loadFails) throw new Error('Font unavailable'); }
    };
    const runtime = vm.createContext({ figma, __html__: '', setTimeout() {}, console: { log() {}, warn() {}, error() {} } });
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../code.js'), 'utf8'), runtime);
    runtime.getSelectionTelemetry = async () => ({});
    runtime.sendTelemetryEvent = async (type, payload) => events.push({ type, payload });
    return { runtime, storage, messages, events,
        send: (payload = { fontFamily: 'Cairo' }) => figma.ui.onmessage({ type: 'change-font', payload }) };
}

function textNode(overrides = {}) {
    return { type: 'TEXT', characters: 'Hello', fontName: { family: 'Inter', style: 'Regular' }, ...overrides };
}

for (const [name, options, payload] of [
    ['empty selection', {}],
    ['selection without text', { selection: [{ type: 'RECTANGLE' }] }],
    ['missing fonts on every text layer', { selection: [textNode({ hasMissingFont: true })] }],
    ['font loading failure on every text layer', { selection: [textNode()], loadFails: true }],
    ['unavailable target family', { selection: [textNode()] }, { fontFamily: 'Unavailable' }]
]) {
    test(`${name} does not consume a trial`, async () => {
        const f = setup(options);
        await f.send(payload);
        assert.equal(f.storage.get('trialCount'), 3);
        assert(!f.events.some(event => event.type === 'trial_used'));
        assert(!f.messages.some(message => message.type === 'user-status-updated'));
        assert(f.messages.some(message => message.type === 'font-change-error'));
        assert(!f.messages.some(message => message.type === 'font-change-complete'));
    });
}

test('a thrown operation does not consume a trial', async () => {
    const f = setup();
    f.runtime.handleChangeFont = async () => { throw new Error('Unexpected failure'); };
    await f.send();
    assert.equal(f.storage.get('trialCount'), 3);
    assert(!f.events.some(event => event.type === 'trial_used'));
});

test('a successful font change consumes exactly one trial after completion', async () => {
    const node = textNode();
    const f = setup({ selection: [node] });
    f.runtime.figma.loadFontAsync = async () => assert.equal(f.storage.get('trialCount'), 3);
    await f.send();
    assert.equal(node.fontName.family, 'Cairo');
    assert.equal(f.storage.get('trialCount'), 2);
    assert.equal(f.events.filter(event => event.type === 'trial_used').length, 1);
    assert.equal(f.messages.find(message => message.type === 'user-status-updated').payload.trialCount, 2);
});

test('a successful variable mode operation charges only after completion', async () => {
    const f = setup();
    f.runtime.handleChangeFont = async () => {
        assert.equal(f.storage.get('trialCount'), 3);
        assert(!f.events.some(event => event.type === 'trial_used'));
        return { success: true };
    };
    await f.send({ variableMode: { collectionName: 'Typography', modeId: 'ar' } });
    assert.equal(f.storage.get('trialCount'), 2);
});

test('exhausted trials block execution', async () => {
    const f = setup({ trialCount: 0 });
    f.runtime.handleChangeFont = async () => assert.fail('Must not execute');
    await f.send();
    assert.equal(f.storage.get('trialCount'), 0);
    assert(f.events.some(event => event.type === 'trial_exhausted'));
});

test('Pro users are never charged', async () => {
    const f = setup({ isPro: true, trialCount: 0, selection: [textNode()] });
    await f.send();
    assert.equal(f.storage.get('trialCount'), 0);
    assert(f.messages.some(message => message.type === 'font-change-complete'));
    assert(!f.events.some(event => event.type === 'trial_used'));
});
