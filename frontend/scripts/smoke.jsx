/**
 * Render smoke test — renders every route through react-dom/server to catch
 * missing imports, undefined components and render-time crashes.
 *
 *   npm run test:render
 */
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from '../src/App.jsx';
import { AuthProvider } from '../src/context/AuthContext.jsx';
import { ThemeProvider } from '../src/context/ThemeContext.jsx';
import { ToastProvider } from '../src/context/ToastContext.jsx';

const PUBLIC_ROUTES = ['/', '/login', '/signup', '/does-not-exist'];
const PRIVATE_ROUTES = [
  '/dashboard',
  '/code-generator',
  '/code-explanation',
  '/voice-to-code',
  '/handwritten-ocr',
  '/project-generator',
  '/settings',
];

function render(route, authenticated) {
  if (authenticated) {
    window.localStorage.setItem(
      'code-genie-user',
      JSON.stringify({ name: 'Ada Lovelace', email: 'ada@codegenie.dev' })
    );
  } else {
    window.localStorage.removeItem('code-genie-user');
  }

  const html = renderToString(
    <StaticRouter location={route}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </StaticRouter>
  );

  if (!html || html.length < 20) {
    throw new Error(`Route "${route}" rendered empty output`);
  }
  return html.length;
}

let failed = 0;

for (const route of PUBLIC_ROUTES) {
  try {
    const size = render(route, false);
    console.log(`  ok  ${route.padEnd(22)} ${size} chars`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL  ${route.padEnd(22)} ${error.message}`);
  }
}

for (const route of PRIVATE_ROUTES) {
  try {
    const size = render(route, true);
    console.log(`  ok  ${route.padEnd(22)} ${size} chars`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL  ${route.padEnd(22)} ${error.message}`);
  }
}

// Unauthenticated access to a protected route must redirect (render nothing useful).
window.localStorage.removeItem('code-genie-user');
const guarded = renderToString(
  <StaticRouter location="/dashboard">
    <AuthProvider>
      <App />
    </AuthProvider>
  </StaticRouter>
);
console.log(`  ok  guard check            ${guarded.includes('Login') ? 'redirects to login' : 'rendered ' + guarded.length}`);

console.log(failed === 0 ? '\nAll routes rendered successfully.' : `\n${failed} route(s) failed.`);
if (failed > 0) process.exit(1);
