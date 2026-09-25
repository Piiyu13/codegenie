import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

/**
 * One-click light/dark switch. Lives in the app header and landing navbar
 * so the theme is reachable without opening Settings.
 */
export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-ink-200 bg-white text-ink-500 shadow-soft transition hover:border-brand-300 hover:text-genie-blue dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300 dark:hover:border-brand-400/50 dark:hover:text-brand-300 ${className}`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
