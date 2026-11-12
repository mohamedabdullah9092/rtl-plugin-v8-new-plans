const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function setup({ sizes = [16, 20, 24], textSizes = [17, 23], mixed = false, nested = false, empty = false } = {}) {
    const messages = [];
    const storage = new Map([['isPro', false], ['trialCount', 3]]);
    const bindings = [];
    const mixedValue = Symbol('mixed');
    const nodes = (mixed ? [mixedValue] : textSizes).map((size, i) => ({
        id: `text-${i}`, type: 'TEXT', characters: empty ? '' : 'Hello!', fontSize: size,
        textStyleId: `original-style-${i}`, fontWeight: 600, lineHeight: { unit: 'PIXELS', value: 30 },
        fontName: { family: 'Inter', style: 'Regular' }, boundVariables: { fontFamily: [{ id: 'family' }] },
        getRangeAllFontNames() { return [this.fontName]; },
        getStyledTextSegments() { return [{ start: 0, end: 2, fontSize: 15 }, { start: 2, end: 6, fontSize: 23 }]; },
        setTextStyleIdAsync() { assert.fail('Must preserve text styles'); },
        setBoundVariable(property, variable) { bindings.push({ node: this.id, property, variable: variable.id }); },
        setRangeBoundVariable(start, end, property, variable) { bindings.push({ node: this.id, start, end, property, variable: variable.id }); },
        setExplicitVariableModeForCollection(collection, modeId) { this.modeId = modeId; this.fontSize = 99; }
    }));
    const root = { id: 'frame', type: 'FRAME', children: nodes,
        setExplicitVariableModeForCollection(collection, modeId) {
            for (const node of nodes) { node.modeId = modeId; node.fontSize = 99; }
        }
    };
    if (nested) for (const node of nodes) node.parent = root;
    const collection = { id: 'typography', name: 'Typography', modes: [{ name: 'Arabic', modeId: 'ar' }] };
    const variables = sizes.map((value, i) => ({
        id: `size-${i}`, name: `font size/${i}`, resolvedType: 'FLOAT', scopes: [],
        valuesByMode: { ar: value },
        resolveForConsumer(node) {
            assert.equal(node.modeId, 'ar', 'Resolve sizes after applying the mode');
            return { value, resolvedType: 'FLOAT' };
        }
    }));
    collection.variableIds = variables.map(variable => variable.id);
    const figma = {
        mixed: mixedValue, currentPage: { selection: nested ? [root, nodes[0]] : nodes },
        ui: { postMessage: message => messages.push(message) }, showUI() {}, on() {},
        clientStorage: { getAsync: async key => storage.get(key), setAsync: async (key, value) => storage.set(key, value) },
        variables: { getLocalVariableCollectionsAsync: async () => [collection],
            getVariableByIdAsync: async id => variables.find(variable => variable.id === id) },
        listAvailableFontsAsync: async () => [{ fontName: { family: 'Inter', style: 'Regular' } }],
        loadFontAsync: async () => {}
    };
    const runtime = vm.createContext({ figma, __html__: '', setTimeout() {}, console: { log() {}, warn() {}, error() {} } });
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../code.js'), 'utf8'), runtime);
    runtime.getSelectionTelemetry = async () => ({});
    runtime.sendTelemetryEvent = async () => {};
    return { runtime, nodes, variables, messages, storage, bindings,
        send: () => figma.ui.onmessage({ type: 'change-font', payload: { variableMode: { collectionName: 'Typography', modeId: 'ar' } } }) };
}

test('each text binds to the nearest variable using its size before switching modes', async () => {
    const f = setup();
    await f.send();
    assert.equal(f.bindings[0].variable, 'size-0');
    assert.equal(f.bindings[1].variable, 'size-2');
    assert(f.bindings.every(binding => binding.property === 'fontSize'));
    assert.equal(f.nodes[0].textStyleId, 'original-style-0');
    assert.equal(f.nodes[0].fontWeight, 600);
    assert.equal(f.nodes[0].lineHeight.value, 30);
    assert.equal(f.messages.find(message => message.type === 'font-change-complete').payload.sizeBoundCount, 2);
    assert.equal(f.storage.get('trialCount'), 2);
});

test('exact match wins and equal distances prefer the smaller size', async () => {
    const f = setup({ sizes: [20, 16, 24], textSizes: [20, 18] });
    await f.send();
    assert.equal(f.bindings[0].variable, 'size-0');
    assert.equal(f.bindings[1].variable, 'size-1');
});

test('mixed sizes bind each original text run independently', async () => {
    const f = setup({ mixed: true });
    await f.send();
    assert.deepEqual(f.bindings, [
        { node: 'text-0', start: 0, end: 2, property: 'fontSize', variable: 'size-0' },
        { node: 'text-0', start: 2, end: 6, property: 'fontSize', variable: 'size-2' }
    ]);
});

test('nested selection binds each text once', async () => {
    const f = setup({ nested: true });
    await f.send();
    assert.equal(f.bindings.length, 2);
    assert.equal(f.messages.find(message => message.type === 'font-change-complete').payload.sizeBoundCount, 2);
});

test('aliases use the resolved value rather than the raw mode value', async () => {
    const f = setup({ sizes: [16, 24], textSizes: [23] });
    f.variables[1].valuesByMode.ar = { type: 'VARIABLE_ALIAS', id: 'remote-size' };
    await f.send();
    assert.equal(f.bindings[0].variable, 'size-1');
});

test('font-size scoped variables with arbitrary names are included; spacing variables are excluded', async () => {
    const f = setup({ sizes: [16, 23], textSizes: [23] });
    f.variables[0].name = 'Body Medium';
    f.variables[0].scopes = ['FONT_SIZE'];
    f.variables[1].name = 'Spacing/large';
    f.variables[1].scopes = ['GAP'];
    await f.send();
    assert.equal(f.bindings[0].variable, 'size-0');
});

test('unusable candidates are skipped when another valid size exists', async () => {
    const f = setup({ sizes: [0, -1, NaN, Infinity, 16, 24], textSizes: [23] });
    f.variables[0].resolveForConsumer = () => { throw new Error('Broken alias'); };
    await f.send();
    assert.equal(f.bindings[0].variable, 'size-5');
});

test('no size variables leaves size bindings alone and reports the absence', async () => {
    const f = setup({ sizes: [] });
    await f.send();
    assert.equal(f.bindings.length, 0);
    assert.match(f.messages.find(message => message.type === 'font-change-complete').payload.message, /No font size variables found/);
});

test('no valid sizes reports failure and preserves the free trial', async () => {
    const f = setup({ sizes: [0, -1] });
    await f.send();
    assert.equal(f.bindings.length, 0);
    assert.equal(f.messages.find(message => message.type === 'font-change-error').payload.sizeBindingFailures.length, 2);
    assert.equal(f.storage.get('trialCount'), 3);
});

test('size binding errors are reported without claiming success or charging', async () => {
    const f = setup();
    f.nodes[0].setBoundVariable = () => { throw new Error('Binding failed'); };
    await f.send();
    const error = f.messages.find(message => message.type === 'font-change-error').payload;
    assert.equal(error.sizeBoundCount, 1);
    assert.equal(error.sizeBindingFailures[0].nodeId, 'text-0');
    assert(!f.messages.some(message => message.type === 'font-change-complete'));
    assert.equal(f.storage.get('trialCount'), 3);
});

test('empty text binds its node size without creating an invalid text range', async () => {
    const f = setup({ empty: true, textSizes: [17] });
    await f.send();
    assert.deepEqual(f.bindings, [{ node: 'text-0', property: 'fontSize', variable: 'size-0' }]);
});
