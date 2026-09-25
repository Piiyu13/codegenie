/**
 * ------------------------------------------------------------------
 * Code Genie — auth service layer (Postgres + JWT backend)
 * ------------------------------------------------------------------
 * When VITE_AI_API_BASE_URL is set, login/signup/profile calls go to
 * the FastAPI backend and a JWT is stored for subsequent requests.
 * When it is empty (demo mode) AuthContext falls back to local-only
 * fake auth, so the UI stays fully explorable offline.
 */

const API_BASE = (import.meta.env.VITE_AI_API_BASE_URL || '').replace(/\/$/, '');
const API_KEY = import.meta.env.VITE_AI_API_KEY || '';

export const isBackendAuth = Boolean(API_BASE);

const TOKEN_KEY = 'code-genie-token';

export function getToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY) || window.sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token, { remember = true } = {}) {
  try {
    if (remember) {
      window.localStorage.setItem(TOKEN_KEY, token);
      window.sessionStorage.removeItem(TOKEN_KEY);
    } else {
      window.sessionStorage.setItem(TOKEN_KEY, token);
      window.localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    /* storage unavailable — memory-only session */
  }
}

export function clearToken() {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* no-op */
  }
}

/** Authorization header: login JWT wins, else the optional shared BACKEND_API_KEY. */
export function authHeaders() {
  const token = getToken();
  if (token) return { Authorization: `Bearer ${token}` };
  if (API_KEY) return { Authorization: `Bearer ${API_KEY}` };
  return {};
}

function errorMessage(status, payload) {
  const detail = payload?.detail;
  if (Array.isArray(detail)) {
    // FastAPI validation errors: [{ loc, msg, ... }]
    const first = detail[0];
    if (first?.msg) return String(first.msg).replace(/^Value error,\s*/i, '');
  }
  if (typeof detail === 'string' && detail) return detail;
  if (typeof payload?.message === 'string' && payload.message) return payload.message;
  return `Request failed (${status}).`;
}

async function request(path, { method = 'GET', body } = {}) {
  if (!API_BASE) {
    throw new Error('Backend not configured. Set VITE_AI_API_BASE_URL in frontend/.env.');
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(errorMessage(response.status, payload));
    return payload;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('The request timed out. Please try again.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function apiSignup({ name, email, password }) {
  return request('/auth/signup', { method: 'POST', body: { name, email, password } });
}

export function apiLogin({ identifier, password }) {
  return request('/auth/login', { method: 'POST', body: { identifier, password } });
}

export function apiMe() {
  return request('/auth/me');
}

export function apiUpdateMe(patch) {
  return request('/auth/me', { method: 'PATCH', body: patch });
}

export function apiChangePassword({ currentPassword, newPassword }) {
  return request('/auth/change-password', {
    method: 'POST',
    body: { currentPassword, newPassword },
  });
}
