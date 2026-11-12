const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '../code.js'), 'utf8');

function setup() {
    const modes = [{ name: 'English', modeId: 'en' }, { name: 'Arabic', modeId: 'ar' }];
    const collections = new Map();
    const variables = new Map();
    const libraries = [];
    const libraryVariables = new Map();
    const localCollections = [];
    const imports = [];
    const events = [];
    const messages = [];

    function addCollection(id, { remote = false, libraryName = 'Design Library', name = 'Typography', familyName = 'font/family', scopes = ['FONT_FAMILY'], values = { en: 'Inter', ar: 'Cairo' }, type = 'STRING' } = {}) {
        const collection = { id, key: `${id}-key`, name, remote, defaultModeId: 'en', modes: modes.map(mode => ({ ...mode })), variableIds: [`${id}-family`] };
        const variable = { id: `${id}-family`, key: `${id}-family-key`, name: familyName, remote, resolvedType: type, scopes, variableCollectionId: id, valuesByMode: values };
        collections.set(id, collection);
        variables.set(variable.id, variable);
        if (remote) {
            libraries.push({ key: collection.key, name, libraryName });
            libraryVariables.set(collection.key, [{ key: variable.key, name: variable.name, resolvedType: type }]);
        } else {
            localCollections.push(collection);
        }
        return { collection, variable };
    }

    const local = addCollection('local');
    const remote = addCollection('remote', { remote: true, familyName: 'Body' });
    const figma = {
        mixed: Symbol('mixed'), currentPage: { selection: [] }, showUI() {}, on() {},
        ui: { postMessage(message) { messages.push(message); } },
        variables: {
            getLocalVariableCollectionsAsync: async () => [...localCollections],
            getVariableByIdAsync: async id => variables.get(id) || null,
            getVariableCollectionByIdAsync: async id => collections.get(id) || null,
            importVariableByKeyAsync: async key => {
                imports.push(key);
                const variable = [...variables.values()].find(item => item.key === key);
                if (!variable) throw new Error(`Unavailable variable ${key}`);
                return variable;
            }
        },
        teamLibrary: {
            getAvailableLibraryVariableCollectionsAsync: async () => [...libraries],
            getVariablesInLibraryCollectionAsync: async key => {
                const result = libraryVariables.get(key);
                if (result instanceof Error) throw result;
                return result || [];
            }
        },
        getLocalTextStylesAsync: async () => [],
        listAvailableFontsAsync: async () => ['Inter', 'Cairo', 'Noto Sans Arabic'].map(family => ({ fontName: { family, style: 'Regular' } })),
        loadFontAsync: async font => events.push(`load:${font.family}:${font.style}`)
    };
    const runtime = vm.createContext({ figma, __html__: '', console: { log() {}, warn() {}, error() {} }, setTimeout() {} });
    vm.runInContext(source, runtime);
    return { runtime, figma, collections, variables, libraries, libraryVariables, imports, events, messages, addCollection, local, remote };
}

test('manifest permits access to enabled team libraries', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../manifest.json'), 'utf8'));
    assert.ok(manifest.permissions.includes('currentuser'));
    assert.ok(manifest.permissions.includes('teamlibrary'));
});

test('local and library collections with identical names keep distinct mode identities', async () => {
    const { runtime } = setup();
    const { modes, warnings } = await runtime.getAvailableVariableModes();
    assert.equal(warnings.length, 0);
    assert.equal(modes.length, 4);
    assert.equal(new Set(modes.map(mode => `${mode.collectionKey || mode.collectionId}:${mode.modeId}`)).size, 4);
    const remote = modes.find(mode => mode.collectionId === 'remote' && mode.modeId === 'ar');
    assert.equal(remote.collectionKey, 'remote-key');
    assert.equal(remote.libraryName, 'Design Library');
    assert.equal(remote.remote, true);
    assert.ok(remote.fonts.includes('Cairo'));
});

test('library font scopes are discovered even when the variable name is only Body', async () => {
    const { runtime, imports } = setup();
    const { entries } = await runtime.getAvailableTypographyCollections();
    const remote = entries.find(entry => entry.collection.id === 'remote');
    assert.ok(remote);
    assert.ok(imports.includes('remote-family-key'));
    assert.equal(remote.variables[0].name, 'Body');
});

test('numeric typography scopes are discovered without collection or variable name hints', async () => {
    const { runtime, imports, addCollection } = setup();
    addCollection('responsive', { remote: true, name: 'Responsive', familyName: 'Body', scopes: ['FONT_SIZE'], type: 'FLOAT', values: { en: 16, ar: 18 } });
    const { modes } = await runtime.getAvailableVariableModes();
    assert.ok(imports.includes('responsive-family-key'));
    assert.equal(modes.filter(mode => mode.collectionId === 'responsive').length, 2);
});

test('all candidate library font variables are imported before reading sibling values', async () => {
    const { runtime, figma, imports, remote, variables, libraryVariables } = setup();
    const heading = { ...remote.variable, id: 'remote-heading', key: 'remote-heading-key', name: 'Heading', valuesByMode: { en: 'Inter', ar: 'Noto Sans Arabic' } };
    variables.set(heading.id, heading);
    remote.collection.variableIds.push(heading.id);
    libraryVariables.get('remote-key').push({ key: heading.key, name: heading.name, resolvedType: heading.resolvedType });
    const getVariableByIdAsync = figma.variables.getVariableByIdAsync;
    figma.variables.getVariableByIdAsync = async id => id === heading.id && !imports.includes(heading.key) ? null : getVariableByIdAsync(id);
    const { modes } = await runtime.getAvailableVariableModes();
    const arabic = modes.find(mode => mode.collectionId === 'remote' && mode.modeId === 'ar');
    assert.ok(imports.includes('remote-family-key'));
    assert.ok(imports.includes('remote-heading-key'));
    assert.ok(arabic.fonts.includes('Cairo'));
    assert.ok(arabic.fonts.includes('Noto Sans Arabic'));
});

test('color-only libraries are not imported or offered as font modes', async () => {
    const { runtime, imports, addCollection } = setup();
    addCollection('colors', { remote: true, name: 'Colors', familyName: 'Primary', scopes: ['ALL_SCOPES'], type: 'COLOR', values: { en: { r: 0, g: 0, b: 0 }, ar: { r: 1, g: 1, b: 1 } } });
    const { modes } = await runtime.getAvailableVariableModes();
    assert.ok(modes.every(mode => mode.collectionId !== 'colors'));
    assert.ok(!imports.includes('colors-family-key'));
});

test('one inaccessible library leaves local and other library modes usable with a warning', async () => {
    const { runtime, addCollection, libraryVariables } = setup();
    addCollection('unavailable', { remote: true, libraryName: 'Unavailable Library' });
    libraryVariables.set('unavailable-key', new Error('Library access was revoked'));
    const { modes, warnings } = await runtime.getAvailableVariableModes();
    assert.ok(modes.some(mode => mode.collectionId === 'local'));
    assert.ok(modes.some(mode => mode.collectionId === 'remote'));
    assert.ok(modes.every(mode => mode.collectionId !== 'unavailable'));
    assert.ok(warnings.length > 0);
});

test('a refresh discovers a library enabled after the previous query', async () => {
    const { runtime, addCollection } = setup();
    await runtime.getAvailableVariableModes();
    addCollection('new-library', { remote: true, libraryName: 'New Library' });
    const { modes } = await runtime.getAvailableVariableModes();
    assert.ok(modes.some(mode => mode.collectionId === 'new-library'));
});

test('stable library key selects the remote collection and an ambiguous legacy name is rejected', async () => {
    const { runtime } = setup();
    const exact = await runtime.resolveVariableModeCollection({ collectionKey: 'remote-key', collectionName: 'Typography', modeId: 'ar' });
    assert.equal(exact.collection.id, 'remote');
    const ambiguous = await runtime.resolveVariableModeCollection({ collectionName: 'Typography', modeId: 'ar' });
    assert.equal(ambiguous, null);
    const missing = await runtime.resolveVariableModeCollection({ collectionKey: 'deleted-key', collectionName: 'Typography', modeId: 'ar' });
    assert.equal(missing, null);
});

test('font changing applies the chosen remote mode after loading fonts and preserves existing bindings', async () => {
    const { runtime, figma, events, remote } = setup();
    const bindings = { fontFamily: { type: 'VARIABLE_ALIAS', id: remote.variable.id } };
    const text = {
        id: 'text', type: 'TEXT', characters: 'Hello', textStyleId: 'linked-style', fontSize: 16,
        fontName: { family: 'Inter', style: 'Regular' }, boundVariables: bindings,
        getRangeAllFontNames: () => [{ family: 'Inter', style: 'Regular' }],
        setBoundVariable() { throw new Error('Existing font bindings must be preserved'); }
    };
    const frame = {
        id: 'frame', type: 'FRAME', children: [text],
        setExplicitVariableModeForCollection(collection, modeId) {
            assert.equal(collection.id, 'remote');
            assert.equal(modeId, 'ar');
            assert.ok(events.includes('load:Cairo:Regular'));
            events.push(`apply:${collection.id}:${modeId}`);
        }
    };
    text.parent = frame;
    figma.currentPage.selection = [frame];
    const result = await runtime.handleChangeFont({ variableMode: { collectionId: 'remote', collectionKey: 'remote-key', collectionName: 'Typography', modeId: 'ar' } });
    assert.equal(result.success, true);
    assert.ok(events.includes('apply:remote:ar'));
    assert.equal(text.boundVariables, bindings);
    assert.equal(text.textStyleId, 'linked-style');
    assert.equal(text.fontName.family, 'Inter');
});

for (const kind of ['style-linked', 'mixed-style', 'direct-bound']) {
    test(`font mode application preserves ${kind} text without fallback style or binding overrides`, async () => {
        const { runtime, figma, remote } = setup();
        const forbiddenCalls = [];
        const textStyleId = kind === 'style-linked' ? 'remote-style' : kind === 'mixed-style' ? figma.mixed : '';
        const boundVariables = kind === 'direct-bound' ? { fontFamily: { type: 'VARIABLE_ALIAS', id: remote.variable.id } } : {};
        figma.getLocalTextStylesAsync = async () => [{ id: 'arbitrary-local-style', fontSize: 16 }];
        const text = {
            id: 'text', type: 'TEXT', characters: 'Hello', textStyleId, boundVariables, fontSize: 16,
            fontName: { family: 'Inter', style: 'Regular' },
            getRangeAllFontNames: () => [{ family: 'Inter', style: 'Regular' }],
            async setTextStyleIdAsync(id) { forbiddenCalls.push(`style:${id}`); throw new Error('Existing typography must not receive a fallback style'); },
            setBoundVariable(field) { forbiddenCalls.push(`binding:${field}`); throw new Error('Existing typography must not receive a fallback binding'); },
            setExplicitVariableModeForCollection(collection, modeId) {
                assert.equal(collection.id, 'remote');
                assert.equal(modeId, 'ar');
            }
        };
        figma.currentPage.selection = [text];
        const result = await runtime.handleChangeFont({ variableMode: { collectionId: 'remote', collectionKey: 'remote-key', collectionName: 'Typography', modeId: 'ar' } });
        assert.equal(result.success, true);
        assert.deepEqual(forbiddenCalls, []);
        assert.equal(text.textStyleId, textStyleId);
        assert.equal(text.boundVariables, boundVariables);
    });
}

test('library font aliases resolve for mode previews and locale font discovery', async () => {
    const { runtime, remote, variables } = setup();
    remote.variable.valuesByMode.ar = { type: 'VARIABLE_ALIAS', id: 'alias-target' };
    variables.set('alias-target', { id: 'alias-target', key: 'alias-target-key', name: 'Actual family', resolvedType: 'STRING', scopes: ['FONT_FAMILY'], variableCollectionId: 'remote', valuesByMode: { en: 'Inter', ar: 'Noto Sans Arabic' } });
    const { modes } = await runtime.getAvailableVariableModes();
    assert.ok(modes.find(mode => mode.collectionId === 'remote' && mode.modeId === 'ar').fonts.includes('Noto Sans Arabic'));
    const localeVariables = await runtime.getLocaleFontVariables('ar');
    assert.ok(localeVariables.some(variable => variable.fontFamily === 'Noto Sans Arabic'));
});

test('cross-collection aliases use the consumer mode or the referenced collection default', async () => {
    const { runtime, remote, collections, variables } = setup();
    collections.set('primitives', { id: 'primitives', key: 'primitives-key', name: 'Primitives', defaultModeId: 'base', modes: [{ name: 'Base', modeId: 'base' }, { name: 'Override', modeId: 'override' }], variableIds: ['primitive-family'] });
    variables.set('primitive-family', { id: 'primitive-family', name: 'font/family', resolvedType: 'STRING', variableCollectionId: 'primitives', valuesByMode: { base: 'Cairo', override: 'Noto Sans Arabic' } });
    remote.variable.valuesByMode.ar = { type: 'VARIABLE_ALIAS', id: 'primitive-family' };
    assert.equal(await runtime.resolveTypographyVariableValue(remote.variable, 'ar'), 'Cairo');
    assert.equal(await runtime.resolveTypographyVariableValue(remote.variable, 'ar', { resolvedVariableModes: { primitives: 'override' } }), 'Noto Sans Arabic');
});

test('mode application preloads a descendant alias font using its own referenced collection mode', async () => {
    const { runtime, figma, remote, collections, variables, events } = setup();
    collections.set('primitives', { id: 'primitives', key: 'primitives-key', name: 'Primitives', defaultModeId: 'base', modes: [{ name: 'Base', modeId: 'base' }, { name: 'Override', modeId: 'override' }], variableIds: ['primitive-family'] });
    variables.set('primitive-family', { id: 'primitive-family', name: 'font/family', resolvedType: 'STRING', variableCollectionId: 'primitives', valuesByMode: { base: 'Cairo', override: 'Noto Sans Arabic' } });
    remote.variable.valuesByMode.ar = { type: 'VARIABLE_ALIAS', id: 'primitive-family' };
    const text = {
        id: 'text', type: 'TEXT', characters: 'Hello', textStyleId: 'linked-style',
        fontName: { family: 'Inter', style: 'Regular' },
        boundVariables: { fontFamily: { type: 'VARIABLE_ALIAS', id: remote.variable.id } },
        resolvedVariableModes: { primitives: 'override' },
        getRangeAllFontNames: () => [{ family: 'Inter', style: 'Regular' }]
    };
    const frame = {
        id: 'frame', type: 'FRAME', children: [text], resolvedVariableModes: { primitives: 'base' },
        setExplicitVariableModeForCollection(collection, modeId) {
            assert.equal(collection.id, 'remote');
            assert.equal(modeId, 'ar');
            assert.ok(events.includes('load:Noto Sans Arabic:Regular'));
            events.push('apply:descendant-alias-mode');
        }
    };
    text.parent = frame;
    figma.currentPage.selection = [frame];
    const result = await runtime.handleChangeFont({ variableMode: { collectionId: 'remote', collectionKey: 'remote-key', collectionName: 'Typography', modeId: 'ar' } });
    assert.equal(result.success, true);
    assert.ok(events.includes('apply:descendant-alias-mode'));
});

test('an alias returning through another collection retains the selected source mode', async () => {
    const { runtime, remote, collections, variables } = setup();
    collections.set('primitives', { id: 'primitives', key: 'primitives-key', name: 'Primitives', defaultModeId: 'base', modes: [{ name: 'Base', modeId: 'base' }], variableIds: ['bridge-family'] });
    variables.set('bridge-family', { id: 'bridge-family', name: 'Bridge', resolvedType: 'STRING', variableCollectionId: 'primitives', valuesByMode: { base: { type: 'VARIABLE_ALIAS', id: 'source-family-value' } } });
    variables.set('source-family-value', { id: 'source-family-value', name: 'Actual family', resolvedType: 'STRING', variableCollectionId: 'remote', valuesByMode: { en: 'Inter', ar: 'Cairo' } });
    remote.variable.valuesByMode.ar = { type: 'VARIABLE_ALIAS', id: 'bridge-family' };
    const consumer = { resolvedVariableModes: { remote: 'en', primitives: 'base' } };
    assert.equal(await runtime.resolveTypographyVariableValue(remote.variable, 'ar', consumer), 'Cairo');
});
