const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

function setup({ missing = false, mixed = false, alias = false, mode = 'Arabic' } = {}) {
    const collection = { id: 'fonts', name: 'Typography', defaultModeId: 'en', modes: [{ name: 'English', modeId: 'en' }, { name: mode, modeId: 'ar' }] };
    const variable = { variableCollectionId: 'fonts', valuesByMode: { en: 'Inter', ar: alias ? { type: 'VARIABLE_ALIAS', id: 'real' } : 'Cairo' } };
    const node = {
        id: 'text', type: 'TEXT', name: 'Label', characters: 'Hello', textStyleId: 'style', explicitVariableModes: {}, resolvedVariableModes: { fonts: 'en' },
        getStyledTextSegments() { return [{ characters: this.characters, start: 0, end: this.characters.length, textStyleId: 'style', fontName: { family: this.explicitVariableModes.fonts === 'ar' ? 'Cairo' : 'Inter', style: 'Regular' }, fontSize: 16, fills: [] }, ...(mixed ? [{ textStyleId: 'other', fontSize: 20 }] : [])]; },
        getRangeAllFontNames() { return [this.getStyledTextSegments()[0].fontName]; },
        setExplicitVariableModeForCollection(c, id) { this.explicitVariableModes[c.id] = id; },
        clearExplicitVariableModeForCollection(c) { delete this.explicitVariableModes[c.id]; },
        setRangeFontName() { throw new Error('Must not overwrite linked typography'); },
        setRangeFontSize() { throw new Error('Must not overwrite linked typography'); },
        setRangeFills() {}
    };
    const runtime = vm.createContext({ figma: { mixed: Symbol(), currentPage: { selection: [] }, showUI() {}, on() {}, ui: { postMessage() {} },
        getNodeByIdAsync: async () => node,
        getStyleByIdAsync: async () => ({ boundVariables: { fontFamily: { type: 'VARIABLE_ALIAS', id: 'family' } } }),
        variables: { getVariableByIdAsync: async id => id === 'real' ? { ...variable, valuesByMode: { en: 'Inter', ar: 'Cairo' } } : variable,
            getVariableCollectionByIdAsync: async () => collection, getLocalVariableCollectionsAsync: async () => [] },
        listAvailableFontsAsync: async () => [] }, __html__: '', console, setTimeout() {} });
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../code.js'), 'utf8'), runtime);
    runtime.ensureFontLoaded = async font => !(missing && font.family === 'Cairo');
    return { runtime, node, collection };
}

test('translation changes only the text mode and preserves linked typography', async () => {
    const { runtime, node } = setup();
    const result = await runtime.applyTranslationsToNodes([{ id: 'text', newCharacters: 'مرحبا' }], null, { toLanguage: 'ar', smartSwitchTextStyles: true });
    assert.equal(result.successCount, 1);
    assert.equal(node.characters, 'مرحبا');
    assert.equal(node.textStyleId, 'style');
    assert.equal(node.explicitVariableModes.fonts, 'ar');
});
test('missing font restores inherited mode and leaves text unchanged', async () => {
    const { runtime, node } = setup({ missing: true });
    await assert.rejects(runtime.prepareTextStyleLanguageMode(node, 'ar'), /Unavailable/);
    assert.deepEqual(node.explicitVariableModes, {});
    assert.equal(node.characters, 'Hello');
});
test('missing font restores an existing explicit override', async () => {
    const { runtime, node } = setup({ missing: true });
    node.explicitVariableModes.fonts = 'en';
    await assert.rejects(runtime.prepareTextStyleLanguageMode(node, 'ar'));
    assert.equal(node.explicitVariableModes.fonts, 'en');
});
test('aliases and repeated operations preserve style identity', async () => {
    const { runtime, node } = setup({ alias: true });
    await runtime.prepareTextStyleLanguageMode(node, 'ar');
    await runtime.prepareTextStyleLanguageMode(node, 'ar');
    assert.equal(node.explicitVariableModes.fonts, 'ar');
    assert.equal(node.textStyleId, 'style');
});
test('ambiguous mixed typography is left untouched', async () => {
    const { runtime, node } = setup({ mixed: true });
    await assert.rejects(runtime.prepareTextStyleLanguageMode(node, 'ar'), /Mixed typography/);
    assert.deepEqual(node.explicitVariableModes, {});
});
test('unknown mode preserves bindings without selecting an arbitrary mode', async () => {
    const { runtime, node } = setup({ mode: 'Other' });
    const result = await runtime.prepareTextStyleLanguageMode(node, 'ar');
    assert.equal(result.protected, true);
    assert.equal(result.changed, false);
    assert.deepEqual(node.explicitVariableModes, {});
});
test('duplicate language modes are rejected before mutation', async () => {
    const { runtime, node, collection } = setup();
    collection.modes.push({ name: 'AR', modeId: 'duplicate' });
    await assert.rejects(runtime.prepareTextStyleLanguageMode(node, 'ar'), /Ambiguous/);
    assert.deepEqual(node.explicitVariableModes, {});
});

for (const name of ['Norsal (arabic)', 'Arabic Typography', 'Fonts / AR / Main', 'Norsal_ARABIC', 'الخط العربي / عربي', 'Norsal (العربية)']) {
    test(`recognizes language anywhere in mode name: ${name}`, async () => {
        const { runtime, node } = setup({ mode: name });
        await runtime.prepareTextStyleLanguageMode(node, 'ar');
        assert.equal(node.explicitVariableModes.fonts, 'ar');
    });
}
test('recognizes English and other supported language names inside full names', () => {
    const { runtime } = setup();
    for (const [name, code] of [['Inter (english)', 'en'], ['Font / French / Regular', 'fr'], ['Japanese Typography', 'ja']]) {
        assert.deepEqual(Array.from(runtime.getTypographyModeLanguages(name)), [code]);
    }
    for (const name of ['Inter', 'Norsal', 'Regular', 'Arabicish', 'Modern']) {
        assert.deepEqual(Array.from(runtime.getTypographyModeLanguages(name)), []);
    }
});
test('a mode naming multiple languages is rejected without mutation', async () => {
    const { runtime, node } = setup({ mode: 'Arabic / English' });
    await assert.rejects(runtime.prepareTextStyleLanguageMode(node, 'ar'), /Ambiguous languages/);
    assert.deepEqual(node.explicitVariableModes, {});
});
test('multiple full names for the target language remain ambiguous', async () => {
    const { runtime, node, collection } = setup({ mode: 'Norsal (arabic)' });
    collection.modes.push({ name: 'Cairo Arabic', modeId: 'other-ar' });
    await assert.rejects(runtime.prepareTextStyleLanguageMode(node, 'ar'), /Ambiguous language modes/);
    assert.deepEqual(node.explicitVariableModes, {});
});

test('expanded mode names support locales, native names, codes and typography naming conventions', () => {
    const { runtime } = setup();
    const cases = {
        ar: ['ar-EG', 'Font ar_SA', 'ArabicMode', 'NorsalArabic', 'ARABICFont', 'Arabic2', '2Arabic', 'Norsalعربي', 'الخط العربي', 'العَرَبِيَّة', 'عـربـي', 'عربى', 'ARA', 'Ｆｏｎｔ（Ａｒａｂｉｃ）'],
        en: ['en-US', 'en-AR', 'ENG', 'EnglishMode', 'الإنجليزية', 'إنجليزي', 'الانكليزية'],
        fr: ['Français', 'fr-CA', 'FRA', 'Française'],
        es: ['Español', 'es-MX', 'SPA'],
        de: ['Deutsch', 'de-DE', 'DEU'],
        pt: ['Português', 'pt-BR', 'POR'],
        tr: ['Türkçe', 'tr-TR', 'TUR'],
        ru: ['Русский', 'ru-RU', 'RUS'],
        ja: ['日本語', 'ja-JP', 'JPN'],
        ko: ['한국어', 'ko-KR', 'KOR'],
        zh: ['中文', '简体中文', '繁體中文', 'zh-Hant-TW', 'zh_CN', 'ZHO']
    };
    for (const [code, names] of Object.entries(cases)) {
        for (const name of names) assert.deepEqual(Array.from(runtime.getTypographyModeLanguages(name)), [code], name);
    }
});
test('font names, direction and country alone do not infer a language', () => {
    const { runtime } = setup();
    for (const name of ['Inter', 'Norsal', 'Cairo', 'Regular', 'Modern', 'Arabicish', 'Englishness', 'RTL', 'LTR', 'Default', 'Mode 2', 'Egypt', 'Saudi', 'SA', 'US', 'JP', 'CN']) {
        assert.deepEqual(Array.from(runtime.getTypographyModeLanguages(name)), [], name);
    }
});
test('expanded aliases still report multiple languages', async () => {
    const { runtime, node } = setup({ mode: 'عربي / ENG' });
    assert.deepEqual(Array.from(runtime.getTypographyModeLanguages('ArabicMode / EnglishMode')), ['ar', 'en']);
    await assert.rejects(runtime.prepareTextStyleLanguageMode(node, 'ar'), /Ambiguous languages/);
    assert.deepEqual(node.explicitVariableModes, {});
});
