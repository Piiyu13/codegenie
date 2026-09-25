import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Code2,
  BookOpenText,
  Mic,
  ScanLine,
  FolderTree,
  Settings,
  LogOut,
  ChevronsLeft,
} from 'lucide-react';
import Logo from './Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/code-generator', label: 'Code Generator', icon: Code2 },
  { to: '/code-explanation', label: 'Code Explanation', icon: BookOpenText },
  { to: '/voice-to-code', label: 'Voice to Code', icon: Mic },
  { to: '/handwritten-ocr', label: 'Handwritten OCR', icon: ScanLine },
  { to: '/project-generator', label: 'Project Generator', icon: FolderTree },
];

export default function Sidebar({ collapsed = false, onToggleCollapse, onNavigate }) {
  const { logout, user } = useAuth();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast.success('You have been logged out.');
    onNavigate?.();
  };

  const itemClass = ({ isActive }) =>
    [
      'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200',
      isActive
        ? 'bg-genie-blue text-white shadow-[0_8px_20px_rgba(22,141,245,0.35)]'
        : 'text-white/65 hover:bg-white/10 hover:text-white',
    ].join(' ');

  return (
    <div className="flex h-full flex-col bg-genie-navy">
      {/* Brand */}
      <div className="flex items-center justify-between gap-2 px-4 py-5">
        <Logo variant="dark" size="sm" showTagline={false} badge={false} to="/dashboard" />
        {onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden h-8 w-8 shrink-0 place-items-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white lg:grid"
          >
            <ChevronsLeft size={17} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        ) : null}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4 pt-2" aria-label="Application">
        {!collapsed ? (
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
            Workspace
          </p>
        ) : null}

        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={onNavigate} className={itemClass} title={collapsed ? label : undefined}>
            <span className="grid h-7 w-7 shrink-0 place-items-center">
              <Icon size={18} />
            </span>
            {!collapsed ? <span className="truncate">{label}</span> : null}
          </NavLink>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <NavLink to="/settings" onClick={onNavigate} className={itemClass} title={collapsed ? 'Settings' : undefined}>
          <span className="grid h-7 w-7 shrink-0 place-items-center">
            <Settings size={18} />
          </span>
          {!collapsed ? <span>Settings</span> : null}
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/65 transition hover:bg-red-500/15 hover:text-red-300"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center">
            <LogOut size={18} />
          </span>
          {!collapsed ? <span>Logout</span> : null}
        </button>

        {!collapsed && user ? (
          <div className="mt-3 rounded-xl bg-white/5 px-3 py-2.5">
            <p className="truncate text-xs font-semibold text-white/85">{user.name}</p>
            <p className="truncate text-[11px] text-white/45">Free plan · 100 AI credits</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
