import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import Sidebar from '../components/Sidebar.jsx';
import UserProfile from '../components/UserProfile.jsx';
import ThemeToggle from '../components/ui/ThemeToggle.jsx';
import { isDemoMode } from '../services/ai.js';

const TITLES = {
  '/dashboard': 'Dashboard',
  '/code-generator': 'Code Generator',
  '/code-explanation': 'Code Explanation',
  '/voice-to-code': 'Voice to Code',
  '/handwritten-ocr': 'Handwritten OCR',
  '/project-generator': 'Project Generator',
  '/settings': 'Settings',
};

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-genie-off dark:bg-ink-900">
      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden transition-all duration-300 lg:block ${
          collapsed ? 'lg:w-[78px]' : 'lg:w-[264px]'
        }`}
      >
        <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((value) => !value)} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 animate-fade-in bg-ink-900/55 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-[272px] animate-fade-in shadow-lift">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 z-10 grid h-8 w-8 place-items-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      {/* Main column */}
      <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-[78px]' : 'lg:ml-[264px]'}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-ink-200/70 bg-white/85 px-4 backdrop-blur-lg sm:px-6 lg:px-8 dark:border-ink-700 dark:bg-ink-900/85">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-ink-200 bg-white text-genie-navy transition hover:border-genie-blue hover:text-genie-blue lg:hidden dark:border-ink-700 dark:bg-ink-800 dark:text-white"
            >
              <Menu size={19} />
            </button>

            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-genie-navy dark:text-white">
                {TITLES[pathname] || 'Code Genie'}
              </p>
              <p className="hidden truncate text-xs text-ink-400 sm:block">
                Turn Your Ideas Into Code
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            {isDemoMode ? (
              <span className="hidden items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-genie-blue md:inline-flex dark:border-brand-400/30 dark:bg-brand-500/10 dark:text-brand-300">
                <Zap size={12} />
                Demo mode
              </span>
            ) : null}
            <UserProfile />
            <ThemeToggle />
          </div>
        </header>

        <main className="px-4 pb-24 pt-6 sm:px-6 sm:pt-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
