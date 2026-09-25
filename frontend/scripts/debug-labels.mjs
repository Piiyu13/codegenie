import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });

const labels = await page.locator('label').allTextContents();
console.log('labels:', JSON.stringify(labels));

const fields = await page.locator('input').evaluateAll((els) =>
  els.map((el) => ({ id: el.id, type: el.type, name: el.name, aria: el.getAttribute('aria-label') }))
);
console.log('inputs:', JSON.stringify(fields, null, 2));

const count = await page.getByLabel('Password', { exact: true }).count();
console.log('exact password matches:', count);
const loose = await page.getByLabel('Password').count();
console.log('loose password matches:', loose);

await browser.close();
