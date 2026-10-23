const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { test } = require('node:test');
const html = fs.readFileSync(require('node:path').join(__dirname, '../index.html'), 'utf8');
function batchRuntime() {
    const calls = [];
    const cache = new Map();
    const runtime = vm.createContext({ console, SESSION_TRANSLATION_CACHE: cache,
        rememberTranslation(prefix, key, value) { cache.set(prefix + key, value); }, isProviderBlocked: () => false, blockProvider() {},
        translateWithGoogle: async text => { calls.push('google'); return text; },
        translateBatchWithAI: async (texts, from, to, provider, key, contexts, pageContext) => {
            calls.push({ texts, contexts, pageContext });
            return texts.map((text, i) => contexts[i].meaning === 'company' ? 'Apple' : 'تفاحة');
        }
    });
    const start = html.indexOf('async function translateBatch(texts,');
    vm.runInContext(html.slice(start, html.indexOf('\n}', start) + 2), runtime);
    return { runtime, calls };
}
test('one string honors configured AI instead of forcing Google', async () => {
    const { runtime, calls } = batchRuntime();
    const result = await runtime.translateBatch(['Apple'], 'en', 'ar', { openai: 'test' }, null, [{ meaning: 'company' }]);
    assert.equal(result.provider, 'OpenAI');
    assert.equal(result.texts[0], 'Apple');
    assert.equal(calls.length, 1);
});
test('identical words in different contexts remain separate and retain output order', async () => {
    const { runtime, calls } = batchRuntime();
    const result = await runtime.translateBatch(['Apple', 'Apple', 'Apple'], 'en', 'ar', { openai: 'test' }, null,
        [{ meaning: 'company' }, { meaning: 'fruit' }, { meaning: 'company' }]);
    assert.deepEqual(Array.from(result.texts), ['Apple', 'تفاحة', 'Apple']);
    assert.equal(calls[0].texts.length, 2);
});
test('free fallback protects brand phrases and addresses', async () => {
    const runtime = vm.createContext({ console, fetch() { throw new Error('Must not send protected name'); } });
    const start = html.indexOf('function getProtectedNamePhrase(');
    vm.runInContext(html.slice(start, html.indexOf('// Translations reused', start)), runtime);
    assert.equal(await runtime.translateWithGoogle('Wakeb location', 'en', 'ar'), 'موقع واكب');
    assert.equal(await runtime.translateWithGoogle('Acme location', 'en', 'ar'), 'موقع Acme');
    assert.equal(await runtime.translateWithGoogle('https://wakeb.example', 'en', 'ar'), 'https://wakeb.example');
    assert.equal(await runtime.translateWithGoogle('info@wakeb.example', 'en', 'ar'), 'info@wakeb.example');
    assert.equal(runtime.getProtectedNamePhrase('Current location', 'ar'), null);
    assert.equal(runtime.getProtectedNamePhrase('Departure Point', 'ar'), null);
});

test('page summary reaches AI and changed page content invalidates cached translations', async () => {
    const { runtime, calls } = batchRuntime();
    const page = { page: 'Store', screens: [{ id: 'screen', texts: ['Fruit', 'Price'] }] };
    const context = [{ meaning: 'fruit', dictionaryTranslation: 'اقتراح' }];
    const run = summary => runtime.translateBatch(['Apple'], 'en', 'ar', { openai: 'test' }, null, context, summary);
    const result = await run(page);
    assert.equal(result.texts[0], 'تفاحة');
    assert.equal(calls[0].pageContext, page);
    await run(page);
    assert.equal(calls.length, 1);
    await run({ ...page, page: 'Technology' });
    assert.equal(calls.length, 2);
});

test('free fallback uses dictionary suggestions without network calls', async () => {
    const { runtime, calls } = batchRuntime();
    const result = await runtime.translateBatch(['Distance'], 'en', 'ar', {}, null,
        [{ dictionaryTranslation: 'المسافة' }]);
    assert.equal(result.texts[0], 'المسافة');
    assert.equal(calls.length, 0);
});
