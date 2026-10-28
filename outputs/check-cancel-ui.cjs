const { chromium } = require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
    const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 400, height: 820 } });
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.addInitScript(() => {
            window.sentMessages = [];
            window.addEventListener('message', e => { if (e.data.pluginMessage) window.sentMessages.push(e.data.pluginMessage); });
        });
        await page.goto('file:///E:/figma%20flugins/rtl%20plugin/v8%20new%20plans/index.html');
        await page.locator('header').waitFor({ timeout: 60000 });
        const send = async (type, payload, operationId) => page.evaluate(args => window.postMessage({ pluginMessage: args }, '*'), { type, payload, operationId });
        for (const [type, payload] of [['user-status', { isPro: true, trialCount: 8 }], ['onboarding-status', { hasCompleted: true }], ['smart-switch-announcement-status', { seen: true }], ['selection-state', { hasSelection: true }]]) await send(type, payload);
        await page.getByRole('contentinfo').getByRole('button', { name: 'Mirror & Translate', exact: true }).click();
        const cancel = page.getByRole('button', { name: 'Cancel operation and undo changes', exact: true });
        await cancel.waitFor();
        await page.waitForFunction(() => window.sentMessages.some(m => m.type === 'run-action'));
        const run = await page.evaluate(() => window.sentMessages.find(m => m.type === 'run-action'));
        assert(run.payload.operationId);
        await page.screenshot({ path: 'outputs/cancel-operation-running.png' });
        await cancel.click();
        await page.getByText('Cancelling and restoring changes...', { exact: true }).waitFor();
        assert(await cancel.isDisabled());
        await page.waitForFunction(() => window.sentMessages.some(m => m.type === 'cancel-action'));
        const request = await page.evaluate(() => window.sentMessages.find(m => m.type === 'cancel-action'));
        assert.equal(request.payload.operationId, run.payload.operationId);
        await send('progress-update', { stepLabel: 'Stale progress' }, run.payload.operationId);
        await send('action-complete', {}, run.payload.operationId);
        assert(await cancel.isDisabled());
        await send('action-cancelled', {}, run.payload.operationId);
        await cancel.waitFor({ state: 'hidden' });
        assert.equal(await page.getByText('Progress', { exact: true }).count(), 0);
        assert(await page.getByRole('contentinfo').getByRole('button', { name: 'Mirror & Translate', exact: true }).isEnabled());
        await page.screenshot({ path: 'outputs/cancel-operation-restored.png' });
        await page.getByRole('contentinfo').getByRole('button', { name: 'Mirror & Translate', exact: true }).click();
        await send('action-complete', {}, run.payload.operationId);
        assert(await cancel.isVisible());
        assert.deepEqual(errors, []);
        console.log('PASS cancel control, cancellation acknowledgement, stale progress/completion isolation, restart and no UI errors');
    } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
