import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const root = resolve('.');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg' };
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
      .replace(/^\/linux-nexus-preview\//, '/');
    const file = resolve(root, '.' + (path === '/' ? '/index.html' : path));
    if (file !== root && !file.startsWith(root + sep)) throw Error('Invalid path');
    const ext = file.slice(file.lastIndexOf('.'));
    const bytes = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(bytes);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
const base = `http://127.0.0.1:${address.port}/linux-nexus-preview/`;
let browser;
try {
  browser = await chromium.launch({ headless: true });
  for (const [label, viewport] of [
    ['desktop', { width: 1366, height: 768 }],
    ['mobile', { width: 390, height: 844 }]
  ]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    const failedAssets = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.status() >= 400 && new URL(response.url()).origin === new URL(base).origin) {
        failedAssets.push(`${response.status()} ${response.url()}`);
      }
    });
    await page.goto(base, { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('#app')?.textContent?.trim().length > 100, null, { timeout: 10000 });
    assert.ok((await page.locator('#nav').innerText()).trim().length > 0, `${label}: navigation empty`);
    assert.ok((await page.locator('#domains').innerText()).trim().length > 0, `${label}: domains empty`);
    assert.ok((await page.locator('#app').innerText()).trim().length > 100, `${label}: content empty`);
    assert.deepEqual(errors, [], `${label}: JavaScript errors`);
    assert.deepEqual(failedAssets, [], `${label}: missing files`);
    const key = await page.evaluate(() => {
      localStorage.setItem('linux_nexus_preview_complete_2026', JSON.stringify({ done: [] }));
      return localStorage.getItem('linux_nexus_preview_complete_2026');
    });
    assert.ok(key, `${label}: preview storage unavailable`);
    await page.reload({ waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('#app')?.textContent?.trim().length > 100, null, { timeout: 10000 });
    assert.deepEqual(errors, [], `${label}: errors after reload`);
    await page.evaluate(() => goto('sim'));
    await page.waitForFunction(() => document.querySelector('#simcontent')?.textContent?.includes('Ordonnancement CPU'));
    assert.equal(await page.locator('[data-sim]').count(), 4, `${label}: four simulator choices`);
    for (const kind of ['permissions', 'memory', 'network', 'process']) {
      await page.locator(`[data-sim="${kind}"]`).click();
      assert.ok((await page.locator('#simcontent').innerText()).trim().length > 100, `${label}: ${kind} simulator empty`);
    }
    assert.deepEqual(errors, [], `${label}: simulator JavaScript errors`);
    console.log(`PASS browser startup, navigation, assets and reload: ${label}`);
    await page.close();
  }
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
