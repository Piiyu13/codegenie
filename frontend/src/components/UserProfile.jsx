import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LogOut, Settings, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function UserProfile({ compact = false }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const toast = useToast();
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!user) return null;

  const initials =
    user.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || 'U';

  const handleLogout = () => {
    setOpen(false);
    logout();
    toast.success('You have been logged out.');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-full border border-ink-200 bg-white py-1 pl-1 pr-2.5 shadow-soft transition hover:border-brand-300 hover:shadow-card dark:border-ink-700 dark:bg-ink-800"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-genie-blue text-xs font-bold text-white">
          {initials}
        </span>
        {!compact ? (
          <span className="hidden text-left leading-tight sm:block">
            <span className="block max-w-[140px] truncate text-xs font-bold text-genie-navy dark:text-white">
              {user.name}
            </span>
            <span className="block text-[10px] font-medium text-ink-400">Developer</span>
          </span>
        ) : null}
        <ChevronDown size={15} className={`text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] w-60 animate-fade-up overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-lift dark:border-ink-700 dark:bg-ink-800"
        >
          <div className="border-b border-ink-100 px-4 py-3.5 dark:border-ink-700">
            <p className="truncate text-sm font-bold text-genie-navy dark:text-white">{user.name}</p>
            <p className="truncate text-xs text-ink-400">{user.email}</p>
          </div>

          <div className="p-1.5">
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-brand-50 hover:text-genie-blue dark:text-ink-300 dark:hover:bg-ink-700"
            >
              <Settings size={15} />
              Settings
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>

          <div className="flex items-center gap-2 border-t border-ink-100 px-4 py-2.5 text-[11px] text-ink-400 dark:border-ink-700">
            <UserRound size={12} />
            Signed in to Code Genie
          </div>
        </div>
      ) : null}
    </div>
  );
}
