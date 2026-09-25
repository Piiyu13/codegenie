/**
 * End-to-end interaction assertions (no screenshots needed).
 *   npm run test:ui
 */
import { chromium } from 'playwright';
import { writeFile, mkdir } from 'node:fs/promises';

const BASE = 'http://localhost:5173';
const USER = JSON.stringify({ name: 'Ada Lovelace', email: 'ada@codegenie.dev' });

let passed = 0;
let failed = 0;
const check = (label, ok, extra = '') => {
  if (ok) {
    passed += 1;
    console.log(`  ok   ${label}`);
  } else {
    failed += 1;
    console.log(`  FAIL ${label} ${extra}`);
  }
};

const browser = await chromium.launch();
const errors = [];

async function newPage({ width = 1440, height = 900, authed = true } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, acceptDownloads: true });
  // Headless Chromium denies the async clipboard API unless it is granted.
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: BASE });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`);
  });
  if (authed) await page.addInitScript((u) => localStorage.setItem('code-genie-user', u), USER);
  return { ctx, page };
}

/* ---------------- auth: validation, signup, logout ---------------- */
{
  const { ctx, page } = await newPage({ authed: false });
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });

  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForTimeout(300);
  check('login blocks empty submit', await page.getByText('Enter your email or username.').isVisible());

  await page.getByLabel('Email or Username').fill('ada@example.com');
  await page.getByLabel('Password', { exact: true }).fill('short');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForTimeout(300);
  check('login enforces min password length', await page.getByText('Password must be at least 6 characters.').isVisible());

  await page.getByLabel('Password', { exact: true }).fill('secret123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/dashboard');
  check('valid login redirects to dashboard', page.url().includes('/dashboard'));

  // deep-link protection
  await page.goto(`${BASE}/settings`, { waitUntil: 'networkidle' });
  check('authenticated user can open /settings', page.url().includes('/settings'));

  await ctx.close();
}

/* ---------------- guard: anonymous redirect ---------------- */
{
  const { ctx, page } = await newPage({ authed: false });
  await page.goto(`${BASE}/code-generator`, { waitUntil: 'networkidle' });
  check('anonymous /code-generator redirects to /login', page.url().includes('/login'));
  await ctx.close();
}

/* ---------------- signup ---------------- */
{
  const { ctx, page } = await newPage({ authed: false });
  await page.goto(`${BASE}/signup`, { waitUntil: 'networkidle' });

  await page.getByLabel('Full Name').fill('Grace Hopper');
  await page.getByLabel('Email').fill('not-an-email');
  await page.getByLabel('Password', { exact: true }).fill('abc123');
  await page.getByLabel('Confirm Password').fill('abc124');
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await page.waitForTimeout(300);
  check('signup flags invalid email', await page.getByText('Enter a valid email address.').isVisible());
  check('signup flags mismatched passwords', await page.getByText('Passwords do not match.').isVisible());

  await page.getByLabel('Email').fill('grace@navy.mil');
  await page.getByLabel('Password', { exact: true }).fill('Compiler1!');
  await page.getByLabel('Confirm Password').fill('Compiler1!');
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await page.waitForURL('**/dashboard');
  check('valid signup lands on dashboard', page.url().includes('/dashboard'));
  await ctx.close();
}

/* ---------------- code generator ---------------- */
{
  const { ctx, page } = await newPage();
  await page.goto(`${BASE}/code-generator`, { waitUntil: 'networkidle' });
  check('generator shows an example result initially', await page.getByText('EXAMPLE').isVisible());

  await page.getByLabel('Requirement').fill('Build a todo list app with localStorage');
  await page.getByLabel('Programming Language').selectOption('JavaScript');
  await page.getByRole('button', { name: 'Generate Code' }).click();
  await page.waitForTimeout(2400);

  const hasCode = await page.locator('pre code').first().isVisible();
  check('generator renders code after request', hasCode);
  check('example badge cleared after real request', !(await page.getByText('EXAMPLE').isVisible()));

  // copy button state change
  await page.getByRole('button', { name: 'Copy', exact: true }).first().click();
  await page.waitForTimeout(400);
  check('copy button confirms', await page.getByRole('button', { name: 'Copied' }).count() > 0);

  await ctx.close();
}

/* ---------------- code explanation ---------------- */
{
  const { ctx, page } = await newPage();
  await page.goto(`${BASE}/code-explanation`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Explain Code' }).click();
  await page.waitForTimeout(2400);
  check('explanation summary shown', await page.getByText('Step-by-step breakdown').isVisible());
  check('improvements section shown', await page.getByText('Potential Improvements').isVisible());
  await ctx.close();
}

/* ---------------- voice to code ---------------- */
{
  const { ctx, page } = await newPage();
  await page.goto(`${BASE}/voice-to-code`, { waitUntil: 'networkidle' });

  await page.getByRole('button', { name: 'Start Recording', exact: true }).click();
  await page.waitForTimeout(700);
  check('recording status active', (await page.getByText('Recording…').count()) > 0);
  check('stop control appears', (await page.getByRole('button', { name: 'Stop Recording' }).count()) > 0);

  await page.waitForTimeout(3200);
  // The mic button and the secondary action share an accessible name — target the mic.
  await page.locator('button[aria-label="Stop recording"]').click();
  await page.waitForTimeout(400);

  const transcript = await page.getByLabel('What we heard').inputValue();
  check('transcript captured', transcript.length > 10, `got "${transcript.slice(0, 40)}"`);

  await page.getByRole('button', { name: 'Convert to Code' }).click();
  await page.waitForTimeout(2400);
  check('voice produced code', (await page.locator('pre code').count()) > 0);
  await ctx.close();
}

/* ---------------- handwritten OCR ---------------- */
{
  await mkdir('tmp', { recursive: true });
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAKklEQVR42mNkYPhfz0AEYBxVSF+F/6DZ'+
      'q4E4JwB/A8F/AcF/AcB/AcB/AcB/AcB/AcB/AcB/AcD9fwMBMQ8AAwEA/1E5VQAAAABJRU5ErkJggg==',
    'base64'
  );
  const file = 'tmp/sample.png';
  await writeFile(file, png);

  const { ctx, page } = await newPage();
  await page.goto(`${BASE}/handwritten-ocr`, { waitUntil: 'networkidle' });

  await page.setInputFiles('input[type="file"]', file);
  await page.waitForTimeout(600);
  check('uploaded image preview shown', await page.getByText('sample.png').isVisible());

  await page.getByRole('button', { name: 'Extract Code' }).click();
  await page.waitForTimeout(2400);
  check('OCR returns extracted code', (await page.locator('pre code').count()) > 0);
  check('confidence badge shown', (await page.getByText('Recognition confidence:').count()) > 0);

  await page.getByRole('button', { name: 'Clear' }).last().click();
  await page.waitForTimeout(400);
  check('clear resets the workspace', (await page.locator('pre code').count()) === 0);

  await ctx.close();
}

/* ---------------- project generator + zip download ---------------- */
{
  const { ctx, page } = await newPage();
  await page.goto(`${BASE}/project-generator`, { waitUntil: 'networkidle' });

  await page.getByRole('button', { name: 'Generate Project' }).click();
  await page.waitForTimeout(500);
  check('project requires a name', await page.getByText('Give your project a name to continue.').isVisible());

  await page.getByLabel('Project Name').fill('TaskFlow React');
  await page.getByLabel('Project Type').selectOption('React Project');
  await page.getByLabel('Features').fill('Authentication\nDashboard\nREST API');
  await page.getByRole('button', { name: 'Generate Project' }).click();
  await page.waitForTimeout(2400);

  const structure = await page.getByRole('heading', { name: 'Project Structure' }).isVisible();
  check('project structure rendered', structure);
  check('tree contains src folder', (await page.getByText('├── src/').count()) > 0);

  // preview a generated file in the modal
  await page.getByRole('button', { name: /package\.json/ }).click();
  await page.waitForTimeout(500);
  check('file preview modal opens', (await page.getByRole('dialog').count()) > 0);
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.waitForTimeout(300);

  // real zip download
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 20000 }),
    page.getByRole('button', { name: 'Download Project' }).first().click(),
  ]);
  const name = download.suggestedFilename();
  check('project downloads as zip', name.endsWith('.zip'), `got ${name}`);
  await ctx.close();
}

/* ---------------- settings: theme, modals ---------------- */
{
  const { ctx, page } = await newPage();
  await page.goto(`${BASE}/settings`, { waitUntil: 'networkidle' });

  await page.getByRole('button', { name: 'Dark mode' }).click();
  await page.waitForTimeout(300);
  check(
    'dark mode toggles html class',
    await page.evaluate(() => document.documentElement.classList.contains('dark'))
  );

  await page.reload({ waitUntil: 'networkidle' });
  check(
    'dark mode persists after reload',
    await page.evaluate(() => document.documentElement.classList.contains('dark'))
  );

  await page.getByRole('button', { name: 'Change password', exact: true }).click();
  await page.waitForTimeout(400);
  check('change password modal opens', (await page.getByRole('dialog').count()) > 0);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  check('escape closes modal', (await page.getByRole('dialog').count()) === 0);

  await page.getByRole('button', { name: 'Save preferences' }).click();
  await page.waitForTimeout(400);
  check('preferences toast shown', (await page.getByText('Preferences saved.').count()) > 0);

  await ctx.close();
}

/* ---------------- mobile navigation ---------------- */
{
  const { ctx, page } = await newPage({ width: 390, height: 844 });
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });

  check('desktop sidebar hidden on mobile', (await page.getByRole('navigation', { name: 'Application' }).count()) === 0 || !(await page.getByRole('navigation', { name: 'Application' }).first().isVisible()));
  check('hamburger visible on mobile', await page.getByRole('button', { name: 'Open menu' }).isVisible());

  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(500);
  const drawerLink = page.getByRole('link', { name: 'Code Generator' });
  check('mobile drawer opens', await drawerLink.isVisible());

  await drawerLink.click();
  await page.waitForTimeout(600);
  check('drawer navigates to the tool', page.url().includes('/code-generator'));
  check('drawer auto-closes after navigation', !(await page.getByRole('link', { name: 'Code Explanation' }).isVisible()));
  await ctx.close();
}

/* ---------------- tablet: sidebar collapse ---------------- */
{
  const { ctx, page } = await newPage({ width: 1440, height: 900 });
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });

  const nav = page.getByRole('navigation', { name: 'Application' });
  const full = await nav.getByText('Workspace').isVisible();
  await page.getByRole('button', { name: 'Collapse sidebar' }).click();
  await page.waitForTimeout(500);
  const collapsedLabelHidden = (await nav.getByText('Handwritten OCR').count()) === 0;
  check('sidebar full width by default', full);
  check('collapse hides labels', collapsedLabelHidden);
  await ctx.close();
}

await browser.close();

console.log(`\n${passed} passed, ${failed} failed`);
if (errors.length) {
  console.log('\n--- runtime errors ---');
  errors.forEach((e) => console.log(e));
}
process.exit(failed || errors.length ? 1 : 0);
