/**
 * Visual + interaction verification.
 *   npm run shots
 * Captures screenshots into ./shots and reports console/page errors.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.BASE_URL || 'http://localhost:5173';
const OUT = 'shots';

const USER = JSON.stringify({ name: 'Ada Lovelace', email: 'ada@codegenie.dev' });

const ROUTES = [
  ['landing', '/'],
  ['login', '/login'],
  ['signup', '/signup'],
  ['dashboard', '/dashboard'],
  ['code-generator', '/code-generator'],
  ['code-explanation', '/code-explanation'],
  ['voice-to-code', '/voice-to-code'],
  ['handwritten-ocr', '/handwritten-ocr'],
  ['project-generator', '/project-generator'],
  ['settings', '/settings'],
  ['not-found', '/nope'],
];

const errors = [];

async function shoot(browser, { route, name, width, height, authenticated, fullPage = true, prep }) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();

  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`[console:${name}] ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`[pageerror:${name}] ${error.message}`));

  if (authenticated) {
    await page.addInitScript((user) => {
      window.localStorage.setItem('code-genie-user', user);
    }, USER);
  }

  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  if (prep) await prep(page);
  await page.waitForTimeout(400);

  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  );
  if (overflow) errors.push(`[layout:${name}] horizontal scroll detected`);

  await context.close();
  return overflow;
}

const main = async () => {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();

  // Desktop pass
  for (const [name, route] of ROUTES) {
    const authed = route !== '/' && route !== '/login' && route !== '/signup' && route !== '/nope';
    const overflow = await shoot(browser, { route, name, width: 1440, height: 900, authenticated: authed });
    console.log(`  ok  desktop ${name}${overflow ? '  (HORIZONTAL SCROLL!)' : ''}`);
  }

  // Mobile pass
  for (const [name, route] of [
    ['mobile-landing', '/'],
    ['mobile-login', '/login'],
    ['mobile-dashboard', '/dashboard'],
    ['mobile-code-generator', '/code-generator'],
  ]) {
    const authed = route !== '/' && route !== '/login';
    const overflow = await shoot(browser, { route, name, width: 390, height: 844, authenticated: authed });
    console.log(`  ok  mobile  ${name}${overflow ? '  (HORIZONTAL SCROLL!)' : ''}`);
  }

  // Interaction: real login flow
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    page.on('pageerror', (error) => errors.push(`[pageerror:login-flow] ${error.message}`));

    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });

    // Validation first
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/login-validation.png` });
    const hasError = await page.getByText('Enter your email or username.').isVisible();
    console.log(`  ${hasError ? 'ok ' : 'FAIL'} login validation message`);

    await page.getByLabel('Email or Username').fill('ada@example.com');
    await page.getByLabel('Password', { exact: true }).fill('secret123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('**/dashboard', { timeout: 8000 });
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/login-success.png`, fullPage: true });
    console.log('  ok  login flow reached /dashboard');

    await context.close();
  }

  // Interaction: generate code
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    page.on('pageerror', (error) => errors.push(`[pageerror:generate] ${error.message}`));
    await page.addInitScript((user) => window.localStorage.setItem('code-genie-user', user), USER);

    await page.goto(`${BASE}/code-generator`, { waitUntil: 'networkidle' });
    await page.getByLabel('Requirement').fill('Create a simple calculator program with validation');
    await page.getByRole('button', { name: 'Generate Code' }).click();
    await page.waitForTimeout(2600);
    await page.screenshot({ path: `${OUT}/code-generator-result.png`, fullPage: true });
    const copied = await page.getByText('Generated in', { exact: false }).count();
    console.log(`  ok  code generation ran (nodes: ${copied})`);

    // Dark mode
    await page.goto(`${BASE}/settings`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Dark mode' }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/settings-dark.png`, fullPage: true });
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/dashboard-dark.png`, fullPage: true });
    console.log('  ok  dark mode screenshots');

    await context.close();
  }

  await browser.close();

  console.log('\n--- issues ---');
  if (errors.length === 0) console.log('none');
  else errors.forEach((line) => console.log(line));

  process.exit(errors.length ? 1 : 0);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
