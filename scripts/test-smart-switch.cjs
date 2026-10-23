const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const pluginSource = fs.readFileSync(path.join(__dirname, '..', 'code.js'), 'utf8');
const baselineSource = process.env.RTL_SMART_SWITCH_BASELINE
    ? fs.readFileSync(process.env.RTL_SMART_SWITCH_BASELINE, 'utf8') : null;

test('Smart Switch introduction is remembered across plugin launches', async () => {
    const storage = new Map([['hasCompletedOnboarding', true], ['isPro', true]]);
    async function launch() {
        const runtime = loadPlugin();
        const messages = [];
        runtime.figma.clientStorage = {
            getAsync: async key => storage.get(key),
            setAsync: async (key, value) => { storage.set(key, value); }
        };
        runtime.figma.ui.postMessage = message => messages.push(message);
        await runtime.figma.ui.onmessage({ type: 'get-smart-switch-announcement-status' });
        return { runtime, status: messages.find(message => message.type === 'smart-switch-announcement-status') };
    }
    const first = await launch();
    assert.equal(first.status.payload.seen, false);
    await first.runtime.figma.ui.onmessage({ type: 'dismiss-smart-switch-announcement' });
    const second = await launch();
    assert.equal(second.status.payload.seen, true);
    assert.equal(storage.get('hasCompletedOnboarding'), true);
    assert.equal(storage.get('isPro'), true);
});

function loadPlugin(source = pluginSource) {
    const calls = { generated: [], translated: [], swaps: [], locale: [], warnings: [] };
    const figma = { currentPage: { selection: [] }, ui: { postMessage() {} }, showUI() {}, notify() {}, on() {} };
    const plugin = vm.createContext({
        figma, __html__: '', setTimeout() {},
        console: { log() {}, error() {}, warn(message) { calls.warnings.push(message); } }
    });
    vm.runInContext(source, plugin);
    // Isolate external font/translation services and the existing generation path.
    plugin.ensureFontLoaded = async () => true;
    plugin.processTextNodesForTranslation = async nodes => calls.translated.push(...nodes.map(node => node.id));
    plugin.ensureTargetVariant = async main => { calls.generated.push(main.id); return main; };
    return { plugin, figma, calls };
}

function text(id, characters = 'English default') {
    return { id, name: 'Label', type: 'TEXT', characters, textAlignHorizontal: 'LEFT',
        getRangeAllFontNames() { return []; } };
}

function frame(id, children = []) {
    const node = { id, name: 'Container', type: 'FRAME', children, layoutMode: 'HORIZONTAL',
        primaryAxisAlignItems: 'MIN', paddingLeft: 4, paddingRight: 12, width: 200,
        insertChild(index, child) {
            this.children.splice(this.children.indexOf(child), 1);
            this.children.splice(index, 0, child);
        } };
    children.forEach(child => { child.parent = node; });
    return node;
}

const sourceProps = { Language: 'English', RTL: 'False', Size: 'Large', State: 'Disabled', Type: 'Primary' };
const arabicProps = { ...sourceProps, Language: 'Arabic', RTL: 'True' };

function fixture(calls, candidates = [arabicProps], options = {}) {
    const makeComponent = (id, props) => ({ id, name: 'Unrelated display name', type: 'COMPONENT',
        variantProperties: props, remote: !!options.remote,
        defaultText: id === 'source' ? 'English default' : (options.targetText || 'النص العربي') });
    const source = makeComponent('source', { ...(options.sourceProps || sourceProps) });
    const targets = candidates.map((props, i) => makeComponent(`target-${i}`, { ...props }));
    const set = { id: 'set', name: 'Button', type: 'COMPONENT_SET', children: [source, ...targets] };
    set.children.forEach(component => { component.parent = set; });
    let main = options.alreadyArabic || options.alreadyTarget ? targets[0] : source;
    const node = frame('instance', [text('old-label')]);
    node.type = 'INSTANCE';
    node.name = 'Button';
    node.getMainComponentAsync = async () => main;
    Object.defineProperty(node, 'componentProperties', { get() {
        return Object.fromEntries(Object.entries(main.variantProperties || {}).map(([key, value]) =>
            [key, { type: 'VARIANT', value }]));
    } });
    node.setProperties = props => {
        calls.locale.push({ id: node.id, props: { ...props } });
        if (options.localeChoosesTarget) main = targets[0];
    };
    node.swapComponent = target => {
        calls.swaps.push(target.id);
        if (options.swapThrows) throw new Error('Swap rejected');
        main = target;
        // Simulate native preservation of a compatible user override, while
        // untouched defaults come from the target. This is not a Figma emulator.
        const previous = node.children[0];
        node.children = [text('new-label', previous.userOverride ? previous.characters : target.defaultText)];
        node.children[0].parent = node;
    };
    return { node, source, targets, set, get main() { return main; } };
}

async function convert(runtime, selection, options = {}) {
    runtime.figma.currentPage.selection = selection;
    await runtime.plugin.processNodesInPlace({ fromLanguage: 'en', toLanguage: 'ar',
        translateText: false, mirrorInstances: false, smartSwitchComponents: true, ...options }, options.shouldMirror !== false);
}

for (const mirrorInstances of [false, true]) {
    test(`reuses an exact Arabic variant, preserving the instance (mirrorInstances=${mirrorInstances})`, async () => {
        const runtime = loadPlugin();
        const f = fixture(runtime.calls);
        const componentSnapshot = JSON.stringify(f.set.children.map(node => node.variantProperties));
        await convert(runtime, [f.node], { mirrorInstances });
        assert.equal(f.main, f.targets[0]);
        assert.equal(f.node.type, 'INSTANCE');
        assert.equal(f.node.primaryAxisAlignItems, 'MIN');
        assert.equal(f.node.paddingLeft, 4);
        assert.equal(f.node.children[0].textAlignHorizontal, 'LEFT');
        assert.equal(f.node.children[0].characters, 'النص العربي');
        assert.deepEqual(runtime.calls.swaps, ['target-0']);
        assert.deepEqual(runtime.calls.locale, []);
        assert.deepEqual(runtime.calls.generated, []);
        assert.equal(JSON.stringify(f.set.children.map(node => node.variantProperties)), componentSnapshot);
    });
}

test('selects the matching size, state and type among multiple Arabic variants', async () => {
    const runtime = loadPlugin();
    const f = fixture(runtime.calls, [
        { ...arabicProps, Size: 'Small' }, { ...arabicProps, State: 'Enabled' },
        { ...arabicProps, Type: 'Secondary' }, arabicProps
    ]);
    await convert(runtime, [f.node]);
    assert.equal(f.main, f.targets[3]);
});

test('uses native swap without replaying source properties or text defaults', async () => {
    const runtime = loadPlugin();
    const f = fixture(runtime.calls);
    f.node.children[0].characters = 'Custom label';
    f.node.children[0].userOverride = true;
    f.node.iconOverride = 'custom-icon';
    f.node.booleanOverride = false;
    await convert(runtime, [f.node]);
    assert.equal(f.node.children[0].characters, 'Custom label');
    assert.equal(f.node.iconOverride, 'custom-icon');
    assert.equal(f.node.booleanOverride, false);
    assert.deepEqual(runtime.calls.locale, []);
});

test('accepts the existing ar locale alias and a Direction variant dimension', async () => {
    const runtime = loadPlugin();
    const f = fixture(runtime.calls, [{ Language: ' AR ', Direction: 'RTL', Size: 'Large' }],
        { sourceProps: { Language: 'English', Direction: 'LTR', Size: 'Large' } });
    await convert(runtime, [f.node]);
    assert.equal(f.main, f.targets[0]);
});

test('supports Language-only sets and accessible remote component sets', async () => {
    const runtime = loadPlugin();
    const f = fixture(runtime.calls, [{ Language: 'Arabic', Size: 'Large' }],
        { remote: true, sourceProps: { Language: 'English', Size: 'Large' } });
    await convert(runtime, [f.node]);
    assert.equal(f.main, f.targets[0]);
});

for (const alreadyArabic of [false, true]) {
    test(`repeated conversion never mirrors an Arabic instance (initially Arabic=${alreadyArabic})`, async () => {
        const runtime = loadPlugin();
        const f = fixture(runtime.calls, [arabicProps], { alreadyArabic });
        await convert(runtime, [f.node]);
        await convert(runtime, [f.node]);
        assert.equal(runtime.calls.swaps.length, alreadyArabic ? 0 : 1);
        assert.equal(f.node.primaryAxisAlignItems, 'MIN');
        assert.deepEqual(runtime.calls.generated, []);
    });
}

test('mixed selection translates and mirrors other nodes while protecting prepared Arabic content', async () => {
    const runtime = loadPlugin();
    const f = fixture(runtime.calls);
    const otherText = text('other-label');
    const root = frame('root', [f.node, otherText]);
    await convert(runtime, [root], { translateText: true });
    assert.equal(f.main, f.targets[0]);
    assert.equal(otherText.textAlignHorizontal, 'RIGHT');
    assert.deepEqual(runtime.calls.translated, ['other-label']);
    assert.equal(root.primaryAxisAlignItems, 'MAX');
});

test('switching an outer instance protects its nested and separately selected descendants', async () => {
    const runtime = loadPlugin();
    const outer = fixture(runtime.calls);
    const nested = fixture(runtime.calls);
    nested.node.id = 'nested-instance';
    outer.node.children.push(nested.node);
    nested.node.parent = outer.node;
    await convert(runtime, [nested.node, outer.node], { translateText: true });
    assert.deepEqual(runtime.calls.swaps, ['target-0']);
    assert.deepEqual(runtime.calls.translated, []);
    assert.deepEqual(runtime.calls.locale, []);
});

test('an unmatched parent retains its flow while a nested instance switches once', async () => {
    const runtime = loadPlugin();
    const outer = fixture(runtime.calls, []);
    const nested = fixture(runtime.calls);
    nested.node.id = 'nested-instance';
    outer.node.children.push(nested.node);
    nested.node.parent = outer.node;
    await convert(runtime, [outer.node]);
    assert.equal(outer.node.primaryAxisAlignItems, 'MAX');
    assert.equal(nested.main, nested.targets[0]);
    assert.deepEqual(runtime.calls.swaps, ['target-0']);
    assert.equal(nested.node.primaryAxisAlignItems, 'MIN');
});

test('direct mirror traversal used by generated variants also protects prepared nested instances', async () => {
    const runtime = loadPlugin();
    const f = fixture(runtime.calls);
    const root = frame('generated-variant', [f.node]);
    const context = runtime.plugin.createMirrorContext({ fromLanguage: 'en', toLanguage: 'ar', smartSwitchComponents: true });
    await runtime.plugin.mirrorNode(root, false, context, true);
    assert.equal(f.main, f.targets[0]);
    assert.equal(runtime.plugin.findTextNodes([root], context.smartSwitchedNodeIds).length, 0);
    assert.deepEqual(runtime.calls.generated, []);
});

const fallbackCases = [
    ['no Arabic variant', []],
    ['wrong size', [{ ...arabicProps, Size: 'Small' }]],
    ['wrong state', [{ ...arabicProps, State: 'Enabled' }]],
    ['wrong type', [{ ...arabicProps, Type: 'Secondary' }]],
    ['missing dimension', [{ Language: 'Arabic', RTL: 'True', Size: 'Large', State: 'Disabled' }]],
    ['extra dimension', [{ ...arabicProps, Extra: 'value' }]],
    ['ambiguous Arabic variants', [arabicProps, { ...arabicProps, Language: 'ar' }]],
    ['RTL alone', [{ ...arabicProps, Language: 'English' }]],
    ['Arabic label substring', [{ ...arabicProps, Language: 'Arabic 2' }]],
    ['Arabic LTR variant', [{ ...arabicProps, RTL: 'False' }]],
    ['no actual language dimension', [{ RTL: 'True', Size: 'Large' }],
        { sourceProps: { RTL: 'False', Size: 'Large' } }],
    ['swap failure', [arabicProps], { swapThrows: true }],
    ['locale pass changes an ambiguous source', [arabicProps, { ...arabicProps, Language: 'ar' }],
        { localeChoosesTarget: true }]
];

for (const [name, candidates, fixtureOptions] of fallbackCases) {
    for (const mirrorInstances of [false, true]) {
        test(`unchanged fallback: ${name} (mirrorInstances=${mirrorInstances})`, async () => {
            async function run(source) {
                const runtime = loadPlugin(source);
                const f = fixture(runtime.calls, candidates, fixtureOptions);
                await convert(runtime, [f.node], { mirrorInstances, translateText: true });
                return { main: f.main.id, alignment: f.node.primaryAxisAlignItems,
                    paddingLeft: f.node.paddingLeft, text: f.node.children[0].characters,
                    textAlignment: f.node.children[0].textAlignHorizontal,
                    generated: runtime.calls.generated, locale: runtime.calls.locale,
                    translated: runtime.calls.translated };
            }
            const actual = await run(pluginSource);
            if (baselineSource) assert.deepEqual(actual, await run(baselineSource));
            assert.equal(actual.alignment, mirrorInstances ? 'MIN' : 'MAX');
            assert.equal(actual.translated.length, 1);
        });
    }
}

for (const options of [{ shouldMirror: false },
    { smartSwitchComponents: false }, { smartSwitchComponents: undefined },
    { smartSwitchComponents: false, mirrorInstances: true }]) {
    test(`unrelated conversion path remains unchanged: ${JSON.stringify(options)}`, async () => {
        async function run(source) {
            const runtime = loadPlugin(source);
            const f = fixture(runtime.calls);
            await convert(runtime, [f.node], { translateText: true, ...options });
            return { swaps: runtime.calls.swaps, locale: runtime.calls.locale,
                translated: runtime.calls.translated, alignment: f.node.primaryAxisAlignItems };
        }
        const actual = await run(pluginSource);
        assert.deepEqual(actual.swaps, []);
        if (baselineSource) assert.deepEqual(actual, await run(baselineSource));
    });
}

const uiSource = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const supportedLanguages = Array.from(vm.runInNewContext(uiSource.match(/const LANGUAGES = (\[[\s\S]*?\]);/)[1]))
    .filter(language => language.code !== 'auto');

for (const { code, name } of supportedLanguages) {
    for (const variantLanguage of [name, code]) {
        test(`Smart Switch supports ${name} using Language=${variantLanguage}`, async () => {
            for (const mirrorInstances of [false, true]) {
                const runtime = loadPlugin();
                const targetProps = { ...sourceProps, Language: variantLanguage, RTL: code === 'ar' ? 'True' : 'False' };
                const fromLanguage = code === 'ar' ? 'en' : 'ar';
                const f = fixture(runtime.calls, [targetProps], {
                    sourceProps: code === 'ar' ? sourceProps : arabicProps,
                    targetText: `Prepared ${name} content`
                });
                await convert(runtime, [f.node], { fromLanguage, toLanguage: code, mirrorInstances, translateText: true });
                assert.equal(f.main, f.targets[0]);
                assert.equal(f.node.type, 'INSTANCE');
                assert.equal(f.node.children[0].characters, `Prepared ${name} content`);
                assert.equal(f.node.primaryAxisAlignItems, 'MIN');
                for (const key of ['Size', 'State', 'Type']) assert.equal(f.main.variantProperties[key], sourceProps[key]);
                assert.deepEqual(runtime.calls.locale, []);
                assert.deepEqual(runtime.calls.generated, []);
                assert.deepEqual(runtime.calls.translated, []);
                await convert(runtime, [f.node], { fromLanguage, toLanguage: code, mirrorInstances });
                assert.deepEqual(runtime.calls.swaps, ['target-0']);
                assert.equal(f.node.primaryAxisAlignItems, 'MIN');
            }
        });
    }

    test(`missing ${name} variant retains the previous fallback`, async () => {
        async function run(source, mirrorInstances) {
            const runtime = loadPlugin(source);
            const f = fixture(runtime.calls, [], { sourceProps: code === 'ar' ? sourceProps : arabicProps });
            await convert(runtime, [f.node], { fromLanguage: code === 'ar' ? 'en' : 'ar', toLanguage: code,
                mirrorInstances, translateText: true });
            assert.deepEqual(runtime.calls.swaps, []);
            return { locale: runtime.calls.locale, generated: runtime.calls.generated,
                translated: runtime.calls.translated, alignment: f.node.primaryAxisAlignItems };
        }
        for (const mirrorInstances of [false, true]) {
            const actual = await run(pluginSource, mirrorInstances);
            assert.equal(actual.alignment, mirrorInstances ? 'MIN' : 'MAX');
            assert.equal(actual.translated.length, 1);
            if (baselineSource) assert.deepEqual(actual, await run(baselineSource, mirrorInstances));
        }
    });
}

test('non-Arabic target matching preserves nested content and compatible overrides', async () => {
    const runtime = loadPlugin();
    const f = fixture(runtime.calls, [{ ...sourceProps, Language: 'French' }]);
    f.node.children[0].characters = 'Custom label';
    f.node.children[0].userOverride = true;
    f.node.iconOverride = 'custom-icon';
    const otherText = text('other-label');
    await convert(runtime, [frame('root', [f.node, otherText])], { toLanguage: 'fr', translateText: true });
    assert.equal(f.main, f.targets[0]);
    assert.equal(f.node.children[0].characters, 'Custom label');
    assert.equal(f.node.iconOverride, 'custom-icon');
    assert.deepEqual(runtime.calls.translated, ['other-label']);
});

test('non-Arabic Direction sets select LTR and reject prepared RTL variants', async () => {
    for (const direction of ['LTR', 'RTL']) {
        const runtime = loadPlugin();
        const f = fixture(runtime.calls, [{ Language: 'French', Direction: direction, Size: 'Large' }], {
            sourceProps: { Language: 'Arabic', Direction: 'RTL', Size: 'Large' }
        });
        await convert(runtime, [f.node], { fromLanguage: 'ar', toLanguage: 'fr' });
        assert.equal(runtime.calls.swaps.length, direction === 'LTR' ? 1 : 0);
        assert.equal(f.node.primaryAxisAlignItems, direction === 'LTR' ? 'MIN' : 'MAX');
    }
});

test('non-Arabic target ambiguity and failed swaps retain the existing fallback', async () => {
    for (const { candidates, options } of [
        { candidates: [{ ...sourceProps, Language: 'French' }, { ...sourceProps, Language: 'fr' }] },
        { candidates: [{ ...sourceProps, Language: 'French' }], options: { swapThrows: true } },
        { candidates: [{ ...sourceProps, Language: 'French', State: 'Enabled' }] }
    ]) {
        const runtime = loadPlugin();
        const f = fixture(runtime.calls, candidates, options);
        await convert(runtime, [f.node], { toLanguage: 'fr', translateText: true });
        assert.equal(f.main, f.source);
        assert.equal(f.node.primaryAxisAlignItems, 'MAX');
        assert.deepEqual(runtime.calls.translated, ['old-label']);
    }
});

test('turning Smart Switch off also preserves the previous non-Arabic conversion', async () => {
    const runtime = loadPlugin();
    const f = fixture(runtime.calls, [{ ...sourceProps, Language: 'French' }]);
    await convert(runtime, [f.node], { toLanguage: 'fr', smartSwitchComponents: false });
    assert.deepEqual(runtime.calls.swaps, []);
    assert.equal(f.node.primaryAxisAlignItems, 'MAX');
});

test('interface language is restored independently from design translation settings', async () => {
    const runtime = loadPlugin();
    const messages = [];
    runtime.figma.clientStorage = { getAsync: async key => key === 'uiLanguage' ? 'ar' : undefined };
    runtime.figma.ui.postMessage = message => messages.push(message);
    await runtime.figma.ui.onmessage({ type: 'get-ui-language' });
    assert.equal(messages[0].type, 'ui-language');
    assert.equal(messages[0].payload.language, 'ar');
});

test('interface language stores only supported values', async () => {
    const runtime = loadPlugin();
    const writes = [];
    runtime.figma.clientStorage = { setAsync: async (key, value) => writes.push([key, value]) };
    await runtime.figma.ui.onmessage({ type: 'set-ui-language', payload: { language: 'ar' } });
    await runtime.figma.ui.onmessage({ type: 'set-ui-language', payload: { language: 'unsupported' } });
    assert.deepEqual(writes, [['uiLanguage', 'ar'], ['uiLanguage', 'en']]);
});

test('broken nested variants are skipped while siblings continue', async () => {
    const { plugin, calls } = loadPlugin();
    // Restore real generation so validation happens before any mutation.
    vm.runInContext(pluginSource.slice(pluginSource.indexOf('async function ensureTargetVariant(mainComponent,')), plugin);
    const bad = fixture(calls);
    Object.defineProperty(bad.source, 'variantProperties', { get() {
        throw new Error('The component set for node has existing errors');
    } });
    const good = fixture(calls);
    good.node.id = 'healthy-instance';
    good.source.remote = true;
    const container = frame('root', [bad.node, good.node]);
    const context = plugin.createMirrorContext({ toLanguage: 'ar' });
    await plugin.mirrorNode(container, false, context, true);
    assert.equal(bad.node.children[0].textAlignHorizontal, 'LEFT');
    assert.equal(good.node.children[0].textAlignHorizontal, 'RIGHT');
    assert.equal(context.createdVariants.size, 0);
    assert.equal(bad.source.name, 'Unrelated display name');
});

test('broken component property reads do not abort locale traversal', async () => {
    const { plugin, calls } = loadPlugin();
    const bad = fixture(calls);
    Object.defineProperty(bad.source, 'variantProperties', { get() {
        throw new Error('variant set with invalid properties');
    } });
    const good = fixture(calls);
    good.node.id = 'healthy-instance';
    await plugin.applyLocalePropertiesToNodes([bad.node, good.node], 'ar');
    assert.equal(calls.locale.length, 1);
    assert.equal(calls.locale[0].id, 'healthy-instance');
});

test('unrelated variant creation failures still surface', async () => {
    const { plugin, calls } = loadPlugin();
    const { node } = fixture(calls);
    plugin.ensureTargetVariant = async () => { throw new Error('Unexpected failure'); };
    await assert.rejects(plugin.mirrorNode(node, false, plugin.createMirrorContext(), true), /Unexpected failure/);
});

for (const type of ['COMPONENT', 'COMPONENT_SET', 'INSTANCE']) {
    test(`skips broken ${type} with labels and preserves healthy siblings`, async () => {
        const { plugin } = loadPlugin();
        const bad = frame('broken', [text('broken-label')]);
        bad.type = type;
        const property = type === 'COMPONENT' ? 'variantProperties' :
            type === 'COMPONENT_SET' ? 'componentPropertyDefinitions' : 'componentProperties';
        Object.defineProperty(bad, property, { get() {
            throw new Error('The component set for node has existing errors');
        } });
        const healthy = text('healthy-label');
        const context = plugin.createMirrorContext({ toLanguage: 'ar' });
        await plugin.mirrorNode(frame('root', [bad, healthy]), false, context, false);
        assert.equal(bad.children[0].textAlignHorizontal, 'LEFT');
        assert.equal(healthy.textAlignHorizontal, 'RIGHT');
        assert.equal(context.smartSwitchedNodeIds.has(bad.children[0].id), true);
        assert.deepEqual(Array.from(plugin.findTextNodes([bad, healthy], context.smartSwitchedNodeIds), n => n.id), ['healthy-label']);
    });
}

test('direct variant action completes without plugin-error for a broken component set', async () => {
    const { plugin, figma } = loadPlugin();
    const messages = [];
    const bad = { id: 'broken-set', name: 'Card', type: 'COMPONENT_SET', children: [] };
    Object.defineProperty(bad, 'componentPropertyDefinitions', { get() {
        throw new Error('variant set with invalid properties');
    } });
    figma.currentPage.selection = [bad];
    figma.ui.postMessage = message => messages.push(message);
    await plugin.handleCreateVariant({ toLanguage: 'ar' });
    assert.equal(messages.some(message => message.type === 'plugin-error'), false);
    assert.equal(messages.some(message => message.type === 'action-complete'), true);
});

function mapComposition() {
    const route = { id: 'route', name: 'Vector', type: 'VECTOR', x: 20, y: 30, width: 280, height: 300 };
    const bitmap = { id: 'map-image', name: 'Rectangle', type: 'RECTANGLE', x: 0, y: 0, width: 400, height: 500,
        fills: [{ type: 'IMAGE' }] };
    const markers = [50, 140, 260].map((x, i) => ({ id: `marker-${i}`, name: 'Drone', type: 'INSTANCE',
        x, y: 50 + i * 100, width: 20, height: 20,
        relativeTransform: [[1, 0, x], [0, 1, 50 + i * 100]],
        children: [{ id: `marker-vector-${i}`, type: 'VECTOR', name: 'Vector', width: 16, height: 16 }],
        getMainComponentAsync() { throw new Error('Artwork marker must remain untouched'); },
        setProperties() { throw new Error('Artwork marker locale must remain untouched'); } }));
    const group = frame('map-composition', [bitmap, route, ...markers]);
    group.type = 'GROUP';
    delete group.layoutMode;
    group.name = 'Group 42';
    group.x = 10;
    group.y = 20;
    group.width = 400;
    group.height = 500;
    return group;
}

for (const mirrorInstances of [false, true]) {
    test(`map composition retains route and marker geometry (mirrorInstances=${mirrorInstances})`, async () => {
        const { plugin, calls } = loadPlugin();
        const map = mapComposition();
        const before = JSON.stringify(map.children, (key, value) => key === 'parent' ? undefined : value);
        const label = text('outside-label');
        const root = frame('screen', [map, label]);
        const context = plugin.createMirrorContext({ toLanguage: 'ar', smartSwitchComponents: true });
        await plugin.applyLocalePropertiesToNodes([root], 'ar', context);
        await plugin.mirrorNode(root, false, context, mirrorInstances);
        assert.equal(JSON.stringify(map.children, (key, value) => key === 'parent' ? undefined : value),
            JSON.stringify(JSON.parse(before), (key, value) => key === 'parent' ? undefined : value));
        assert.equal(label.textAlignHorizontal, 'RIGHT');
        assert.deepEqual(calls.generated, []);
    });
}

test('graphic path plus nested markers is preserved without image fill or semantic layer names', () => {
    const { plugin } = loadPlugin();
    const map = mapComposition();
    map.children.shift();
    assert.equal(plugin.isSpatialComposition(map), true);
});

test('text-bearing UI and auto-layout icon rows retain normal mirroring', () => {
    const { plugin } = loadPlugin();
    const map = mapComposition();
    map.children.push(text('label'));
    assert.equal(plugin.isSpatialComposition(map), false);
    const row = mapComposition();
    row.type = 'FRAME';
    row.layoutMode = 'HORIZONTAL';
    assert.equal(plugin.isSpatialComposition(row), false);
});

test('Arabic dashboard labels use natural definite phrases without changing action labels', () => {
    const { plugin } = loadPlugin();
    const actual = vm.runInContext(`({
        details: enToLangLookup.ar.details,
        distance: enToLangLookup.ar.distance,
        altitude: enToLangLookup.ar.altitude,
        progress: enToLangLookup.ar.progress,
        waypoints: enToLangLookup.ar.waypoints,
        departure: enToLangLookup.ar['departure point'],
        arrival: enToLangLookup.ar['arrival point'],
        save: enToLangLookup.ar.save,
        cancel: enToLangLookup.ar.cancel
    })`, plugin);
    assert.deepEqual({ ...actual }, {
        details: 'التفاصيل', distance: 'المسافة', altitude: 'الارتفاع', progress: 'التقدّم',
        waypoints: 'نقاط المسار', departure: 'نقطة الانطلاق', arrival: 'نقطة الوصول',
        save: 'حفظ', cancel: 'إلغاء'
    });
});

test('translation context includes original nearby labels and container names', () => {
    const { plugin } = loadPlugin();
    const value = text('location-value', 'Wakeb location');
    value.name = 'Location value';
    const parent = frame('point-card', [text('label', 'Departure Point'), value]);
    parent.name = 'Route details';
    const context = plugin.getTranslationContext(value);
    assert.equal(context.layer, 'Location value');
    assert.deepEqual(Array.from(context.containers), ['Route details']);
    assert.deepEqual(Array.from(context.nearby), ['Departure Point']);
});

test('page analysis prioritizes selected screen, includes page context, and ignores hidden content', () => {
    const { plugin, figma } = loadPlugin();
    const selected = frame('drone-screen', [text('altitude', 'Altitude'), text('route', 'Departure Point')]);
    selected.name = 'Drone tracking';
    const other = frame('other-screen', [text('shopping', 'Shopping cart')]);
    const hidden = text('hidden', 'Hidden internal note');
    hidden.visible = false;
    const page = { id: 'page', type: 'PAGE', name: 'Dashboard', children: [other, selected, hidden] };
    page.children.forEach(node => { node.parent = page; });
    figma.currentPage = page;
    const summary = plugin.analyzePageForTranslation([selected.children[0]]);
    assert.equal(summary.page, 'Dashboard');
    assert.equal(summary.screens[0].name, 'Drone tracking');
    assert.deepEqual(Array.from(summary.screens[0].texts), ['Altitude', 'Departure Point']);
    assert.equal(summary.pageSamples.includes('Shopping cart'), true);
    assert.equal(JSON.stringify(summary).includes('Hidden internal note'), false);
});

test('page analysis bounds work on large designs', () => {
    const { plugin, figma } = loadPlugin();
    const large = frame('large', Array.from({ length: 10000 }, (_, i) => ({ id: `v${i}`, type: 'VECTOR' })));
    figma.currentPage.children = [large];
    const summary = plugin.analyzePageForTranslation([]);
    assert.equal(summary.scannedNodes <= 2500, true);
    assert.equal(summary.truncated, true);
});

test('dictionary candidates reach AI with original page content instead of being applied first', async () => {
    const { plugin, figma } = loadPlugin();
    const messages = [];
    const root = frame('screen', [text('distance', 'Distance')]);
    figma.currentPage.children = [root];
    figma.ui.postMessage = message => messages.push(message);
    const start = pluginSource.indexOf('async function processTextNodesForTranslation(');
    vm.runInContext(pluginSource.slice(start, pluginSource.indexOf('\nfunction sendProgress(', start)), plugin);
    await plugin.processTextNodesForTranslation(root.children, 'en', 'ar', 1, 4);
    const payload = messages.find(message => message.type === 'text-nodes-found').payload;
    assert.equal(payload.texts[0].dictionaryTranslation, 'المسافة');
    assert.equal(payload.texts[0].characters, 'Distance');
    assert.equal(payload.pageContext.screens[0].texts[0], 'Distance');
    assert.equal(root.children[0].characters, 'Distance');
});

function progressFixture(layoutMode = 'NONE') {
    const track = { id: 'track', name: 'Background', type: 'RECTANGLE', x: 30, y: 40, width: 440, height: 20 };
    const fill = { id: 'fill', name: 'Rectangle 2', type: 'RECTANGLE', x: 34, y: 42, width: 220, height: 16,
        layoutPositioning: 'ABSOLUTE', constraints: { horizontal: 'LEFT', vertical: 'TOP' } };
    const label = text('caption', 'Mission Progress');
    label.x = 30; label.y = 0; label.width = 200; label.height = 20;
    const root = frame('progress-card', [track, fill, label]);
    root.layoutMode = layoutMode;
    root.width = 560; root.height = 120;
    return { root, track, fill, label };
}
for (const layout of ['NONE', 'HORIZONTAL', 'VERTICAL']) {
    test(`progress fill remains inset inside its track after mirroring (${layout})`, async () => {
        const { plugin } = loadPlugin();
        const { root, track, fill, label } = progressFixture(layout);
        await plugin.mirrorNode(root);
        assert.equal(fill.x, track.x + track.width - 4 - fill.width);
        assert.equal(fill.y, track.y + 2);
        assert.equal(fill.width, 220);
        assert.equal(fill.x >= track.x && fill.x + fill.width <= track.x + track.width, true);
        assert.equal(label.textAlignHorizontal, 'RIGHT');
        await plugin.mirrorNode(root);
        assert.equal(fill.x, track.x + 4);
    });
}

test('a purely graphical progress group mirrors without relying on layer names', async () => {
    const { plugin } = loadPlugin();
    const { root, track, fill } = progressFixture();
    root.children.pop();
    root.type = 'GROUP';
    delete root.layoutMode;
    track.name = 'Rectangle 1';
    await plugin.mirrorNode(root);
    assert.equal(fill.x - track.x, track.width - 4 - fill.width);
    assert.equal(fill.width / track.width, 0.5);
});

test('constraint-induced movement is overwritten using the captured position', () => {
    const { plugin } = loadPlugin();
    const { root, fill } = progressFixture();
    let constraints = fill.constraints;
    Object.defineProperty(fill, 'constraints', { get: () => constraints, set(value) {
        constraints = value; fill.x += 70;
    } });
    const geometry = plugin.captureChildGeometry(root);
    plugin.mirrorChildGeometry(root, geometry, 560, null, false);
    assert.equal(fill.x, 560 - 34 - 220);
    assert.equal(fill.constraints.horizontal, 'RIGHT');
});

test('group origin changes do not shift subsequent planned child positions', () => {
    const { plugin } = loadPlugin();
    const root = { type: 'GROUP', children: [], absoluteTransform: [[1, 0, 100], [0, 1, 50]] };
    const original = [[1, 0, 100], [0, 1, 50]];
    function child(id, x, width) {
        let transform = [[1, 0, x], [0, 1, 0]];
        const result = { id, name: id, type: 'RECTANGLE', parent: root, width, height: 10, x, y: 0 };
        Object.defineProperty(result, 'relativeTransform', { get: () => transform, set(value) {
            result.worldX = root.absoluteTransform[0][2] + value[0][2];
            transform = value;
            // Model Figma recalculating the group's origin after a child moves.
            root.absoluteTransform[0][2] += 25;
        } });
        return result;
    }
    root.children = [child('first', 10, 20), child('second', 60, 30)];
    const geometry = plugin.captureChildGeometry(root);
    plugin.mirrorChildGeometry(root, geometry, 200, original, false);
    assert.equal(root.children[0].worldX, 100 + 200 - 10 - 20);
    assert.equal(root.children[1].worldX, 100 + 200 - 60 - 30);
});

test('progress fill inside a painted track frame aligns to the right without clipping', async () => {
    const { plugin } = loadPlugin();
    const fill = { id: 'fill', name: 'Rectangle', type: 'RECTANGLE', x: 4, y: 2, width: 220, height: 16 };
    const track = frame('track', [fill]);
    track.layoutMode = 'NONE';
    track.width = 440; track.height = 20;
    track.fills = [{ type: 'SOLID' }];
    await plugin.mirrorNode(track);
    assert.equal(fill.x, 216);
    assert.equal(fill.width, 220);
    assert.equal(track.clipsContent, undefined);
});

for (const layoutMode of ['HORIZONTAL', 'VERTICAL']) {
    test(`graphic-only Fill/Hug frame mirrors alignment (${layoutMode})`, async () => {
        const { plugin } = loadPlugin();
        const shape = { id: 'bar', name: 'Rectangle', type: 'RECTANGLE', x: 0, y: 0, width: 120, height: 12 };
        const wrapper = frame('fill-wrapper', [shape]);
        wrapper.layoutMode = layoutMode;
        wrapper.layoutSizingHorizontal = 'FILL';
        wrapper.layoutSizingVertical = 'HUG';
        wrapper.counterAxisAlignItems = 'MIN';
        const property = layoutMode === 'HORIZONTAL' ? 'primaryAxisAlignItems' : 'counterAxisAlignItems';
        await plugin.mirrorNode(wrapper);
        assert.equal(wrapper[property], 'MAX');
        assert.equal(shape.x, 0);
        assert.equal(shape.width, 120);
        await plugin.mirrorNode(wrapper);
        assert.equal(wrapper[property], 'MIN');
    });
}

test('nested graphic-only wrappers mirror alignment without moving internal vectors', async () => {
    const { plugin } = loadPlugin();
    const shape = { id: 'bar', name: 'Rectangle', type: 'RECTANGLE', x: 0, y: 0, width: 120, height: 12 };
    const wrapper = frame('inner', [shape]);
    const outer = frame('outer', [wrapper]);
    await plugin.mirrorNode(outer);
    assert.equal(outer.primaryAxisAlignItems, 'MAX');
    assert.equal(wrapper.primaryAxisAlignItems, 'MAX');
    assert.equal(shape.x, 0);
});

test('centered graphic-only frames retain centered alignment', async () => {
    const { plugin } = loadPlugin();
    const wrapper = frame('center', [{ id: 'graphic', name: 'Graphic', type: 'VECTOR' }]);
    wrapper.primaryAxisAlignItems = 'CENTER';
    await plugin.mirrorNode(wrapper);
    assert.equal(wrapper.primaryAxisAlignItems, 'CENTER');
});
