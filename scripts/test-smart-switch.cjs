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
