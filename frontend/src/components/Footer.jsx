import { Link } from 'react-router-dom';
import { Zap, MousePointerClick, Sparkles, Hammer, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import Logo from './Logo.jsx';

const VALUE_PROPS = [
  { icon: Zap, label: 'Fast Generation' },
  { icon: MousePointerClick, label: 'Easy to Use' },
  { icon: Sparkles, label: 'AI Powered' },
  { icon: Hammer, label: 'Build Anything' },
];

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Code Generator', to: '/code-generator' },
      { label: 'Code Explanation', to: '/code-explanation' },
      { label: 'Project Generator', to: '/project-generator' },
    ],
  },
  {
    title: 'Features',
    links: [
      { label: 'AI Code Generator', to: '/code-generator' },
      { label: 'Voice to Code', to: '/voice-to-code' },
      { label: 'Handwritten OCR', to: '/handwritten-ocr' },
      { label: 'Settings', to: '/settings' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#cta' },
      { label: 'Privacy Policy', href: '#cta' },
      { label: 'Terms of Service', href: '#cta' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink-200/70 bg-white dark:border-ink-700 dark:bg-ink-900">
      {/* Value props */}
      <div className="page-shell">
        <div className="grid grid-cols-2 gap-4 border-b border-ink-100 py-8 lg:grid-cols-4 dark:border-ink-700">
          {VALUE_PROPS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center justify-center gap-3 lg:justify-start">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-genie-blue dark:bg-brand-500/15">
                <Icon size={18} />
              </span>
              <span className="text-sm font-bold text-genie-navy dark:text-white">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Link columns */}
      <div className="page-shell grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo size="sm" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500 dark:text-ink-400">
            Your AI-powered coding assistant for generating, explaining and transforming code — from
            a sentence, a sketch or your voice.
          </p>
          <div className="mt-5 flex items-center gap-2.5">
            {[Github, Twitter, Linkedin, Mail].map((Icon, index) => (
              <a
                key={index}
                href="#top"
                aria-label="Code Genie social link"
                className="grid h-9 w-9 place-items-center rounded-lg border border-ink-200 text-ink-500 transition hover:border-genie-blue hover:bg-brand-50 hover:text-genie-blue dark:border-ink-700 dark:text-ink-400"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-genie-navy dark:text-white">
              {column.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link
                      to={link.to}
                      className="text-sm text-ink-500 transition hover:text-genie-blue dark:text-ink-400"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-ink-500 transition hover:text-genie-blue dark:text-ink-400"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="bg-genie-navy">
        <div className="page-shell flex flex-col items-center justify-between gap-3 py-5 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-white/70">
            © {new Date().getFullYear()} Code Genie. All rights reserved.
          </p>
          <p className="text-sm text-white/70">
            Made with <span className="text-red-400">♥</span> for{' '}
            <span className="font-semibold text-white">Developers</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
