/**
 * Final responsive sweep: checks horizontal overflow on every route at
 * desktop / laptop / tablet / mobile widths, and captures fresh screenshots.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = 'http://localhost:5173';
const USER = JSON.stringify({ name: 'Ada Lovelace', email: 'ada@codegenie.dev' });

const ROUTES = ['/', '/login', '/signup', '/dashboard', '/code-generator', '/code-explanation', '/voice-to-code', '/handwritten-ocr', '/project-generator', '/settings', '/missing'];
const VIEWPORTS = [
  ['desktop', 1440, 900],
  ['laptop', 1180, 800],
  ['tablet', 820, 1180],
  ['mobile', 390, 844],
];

const problems = [];

const browser = await chromium.launch();
await mkdir('shots-final', { recursive: true });

for (const [label, width, height] of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => problems.push(`[${label}] pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') problems.push(`[${label}] console: ${m.text()}`);
  });
  await page.addInitScript((u) => localStorage.setItem('code-genie-user', u), USER);

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    const result = await page.evaluate(() => {
      const de = document.documentElement;
      const overflow = de.scrollWidth > de.clientWidth + 1;
      let widest = '';
      if (overflow) {
        for (const el of document.querySelectorAll('*')) {
          if (el.getBoundingClientRect().right > de.clientWidth + 1) {
            widest = `${el.tagName}.${String(el.className).slice(0, 60)}`;
            break;
          }
        }
      }
      return { overflow, widest, scrollWidth: de.scrollWidth, clientWidth: de.clientWidth };
    });
    if (result.overflow) {
      problems.push(`[${label}] ${route} horizontal overflow ${result.scrollWidth}>${result.clientWidth} → ${result.widest}`);
    }
  }
  console.log(`  ok  ${label.padEnd(8)} ${width}px  (${ROUTES.length} routes checked)`);
  await ctx.close();
}

// Fresh screenshots (unique dir avoids any stale previews)
const shots = [
  ['final-landing', '/', 1440, 900, false],
  ['final-signup', '/signup', 1440, 900, false],
  ['final-voice', '/voice-to-code', 1440, 900, true],
  ['final-project', '/project-generator', 1440, 900, true],
  ['final-mobile-landing', '/', 390, 844, false],
  ['final-mobile-dashboard', '/dashboard', 390, 844, true],
  ['final-tablet-dashboard', '/dashboard', 820, 1180, true],
];

for (const [name, route, width, height, authed] of shots) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  if (authed) await page.addInitScript((u) => localStorage.setItem('code-genie-user', u), USER);
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `shots-final/${name}.png`, fullPage: true });
  await ctx.close();
  console.log(`  shot ${name}`);
}

// Mobile menu open
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.addInitScript((u) => localStorage.setItem('code-genie-user', u), USER);
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'shots-final/final-mobile-menu.png' });
  await ctx.close();
  console.log('  shot final-mobile-menu');
}

// Code explanation result state
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript((u) => localStorage.setItem('code-genie-user', u), USER);
  await page.goto(`${BASE}/code-explanation`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Explain Code' }).click();
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'shots-final/final-explanation-result.png', fullPage: true });
  await ctx.close();
  console.log('  shot final-explanation-result');
}

// Project generation result + modal
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript((u) => localStorage.setItem('code-genie-user', u), USER);
  await page.goto(`${BASE}/project-generator`, { waitUntil: 'networkidle' });
  await page.getByLabel('Project Name').fill('TaskFlow React');
  await page.getByLabel('Features').fill('User authentication\nDashboard with charts\nREST API backend');
  await page.getByRole('button', { name: 'Generate Project' }).click();
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'shots-final/final-project-result.png', fullPage: true });
  await ctx.close();
  console.log('  shot final-project-result');
}

await browser.close();

console.log('\n--- problems ---');
if (!problems.length) console.log('none');
else problems.forEach((p) => console.log(p));

process.exit(problems.length ? 1 : 0);
