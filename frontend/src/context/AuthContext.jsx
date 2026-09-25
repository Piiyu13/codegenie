import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  apiChangePassword,
  apiLogin,
  apiMe,
  apiSignup,
  apiUpdateMe,
  clearToken,
  getToken,
  setToken,
} from '../services/auth.js';

const AuthContext = createContext(null);
const STATS_KEY = 'code-genie-stats';

const DEFAULT_STATS = {
  code: 12,
  explanations: 8,
  voice: 5,
  projects: 3,
};

function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(() => readJSON(STATS_KEY, DEFAULT_STATS));
  const [authLoading, setAuthLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    try {
      window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {
      /* storage unavailable */
    }
  }, [stats]);

  // Restore the JWT session against the backend on reload.
  useEffect(() => {
    if (!getToken()) {
      setAuthLoading(false);
      return;
    }
    let cancelled = false;
    apiMe()
      .then((profile) => {
        if (!cancelled) setUser(profile);
      })
      .catch(() => {
        if (!cancelled) {
          clearToken();
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setAuthLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (identifier, { password = '', remember = true } = {}) => {
    const { token, user: profile } = await apiLogin({ identifier, password });
    setToken(token, { remember });
    setUser(profile);
    return profile;
  }, []);

  const signup = useCallback(async ({ name, email, password = '' }) => {
    const { token, user: profile } = await apiSignup({ name, email, password });
    setToken(token, { remember: true });
    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const updateUser = useCallback(async (patch) => {
    const profile = await apiUpdateMe(patch);
    setUser(profile);
    return profile;
  }, []);

  const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
    return apiChangePassword({ currentPassword, newPassword });
  }, []);

  const bumpStat = useCallback((key) => {
    setStats((current) => ({ ...current, [key]: (current[key] || 0) + 1 }));
  }, []);

  const resetStats = useCallback(() => setStats(DEFAULT_STATS), []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      authLoading,
      stats,
      login,
      signup,
      logout,
      updateUser,
      changePassword,
      bumpStat,
      resetStats,
    }),
    [user, authLoading, stats, login, signup, logout, updateUser, changePassword, bumpStat, resetStats]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
