import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo.jsx';
import Button from './ui/Button.jsx';
import ThemeToggle from './ui/ThemeToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how' },
  { label: 'About', href: '#about' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'border-b border-ink-200/70 bg-white/90 shadow-soft backdrop-blur-lg dark:border-ink-700 dark:bg-ink-900/90'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="page-shell flex h-[74px] items-center justify-between gap-6">
        <Logo size="sm" showTagline={false} />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="link-underline text-sm font-semibold text-ink-600 transition-colors hover:text-genie-blue dark:text-ink-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            to="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-600 transition hover:text-genie-blue dark:text-ink-300"
          >
            Login
          </Link>
          <Button to={isAuthenticated ? '/dashboard' : '/signup'} size="md">
            Get Started
          </Button>
        </div>

        {/* Mobile triggers */}
        <div className="flex items-center gap-2.5 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-xl border border-ink-200 bg-white text-genie-navy transition hover:border-genie-blue hover:text-genie-blue dark:border-ink-700 dark:bg-ink-800 dark:text-white"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open ? (
        <div className="animate-fade-up border-t border-ink-200/70 bg-white px-4 pb-6 pt-3 md:hidden dark:border-ink-700 dark:bg-ink-900">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-ink-700 transition hover:bg-brand-50 hover:text-genie-blue dark:text-ink-200 dark:hover:bg-ink-800"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-2.5">
            <Button to="/login" variant="secondary" fullWidth>
              Login
            </Button>
            <Button to={isAuthenticated ? '/dashboard' : '/signup'} fullWidth>
              Get Started
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
