import { chromium } from 'playwright';

const USER = JSON.stringify({ name: 'Ada Lovelace', email: 'ada@codegenie.dev' });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
page.on('pageerror', (e) => console.log('pageerror:', e.message));

await page.addInitScript((u) => window.localStorage.setItem('code-genie-user', u), USER);
await page.goto('http://localhost:5173/settings', { waitUntil: 'networkidle' });

const before = await page.evaluate(() => document.documentElement.className);
await page.getByRole('button', { name: 'Dark mode' }).click();
await page.waitForTimeout(400);
const after = await page.evaluate(() => document.documentElement.className);
const stored = await page.evaluate(() => window.localStorage.getItem('code-genie-theme'));
console.log('html class before:', JSON.stringify(before));
console.log('html class after :', JSON.stringify(after));
console.log('stored theme     :', stored);

await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const afterReload = await page.evaluate(() => document.documentElement.className);
console.log('after reload     :', JSON.stringify(afterReload));

await page.screenshot({ path: `shots/dark-check-${Date.now()}.png`, fullPage: true });
await browser.close();
