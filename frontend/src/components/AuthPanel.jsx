import { CheckCircle2 } from 'lucide-react';
import Logo from './Logo.jsx';

/**
 * Left-hand brand panel shared by the Login and Signup screens.
 */
export default function AuthPanel({ title, subtitle, items }) {
  return (
    <div className="relative flex flex-col justify-center overflow-hidden bg-genie-off px-6 py-12 sm:px-12 lg:px-16 dark:bg-ink-900">
      {/* Decorative shapes */}
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-genie-blue/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-brand-300/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="relative w-full max-w-md">
        <Logo size="md" />

        <h1 className="mt-10 text-3xl font-extrabold tracking-tight text-genie-navy dark:text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2.5 text-[15px] leading-relaxed text-ink-500 dark:text-ink-400">{subtitle}</p>

        <ul className="mt-8 space-y-3.5">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-3 text-[15px] font-medium text-ink-700 dark:text-ink-200">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-genie-blue/10 text-genie-blue dark:bg-brand-500/20 dark:text-brand-300">
                <CheckCircle2 size={15} />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex items-center gap-6 border-t border-ink-200/70 pt-6 text-xs font-semibold uppercase tracking-wider text-ink-400 dark:border-ink-700">
          <span>Clean</span>
          <span className="h-1 w-1 rounded-full bg-genie-blue" />
          <span>Modern</span>
          <span className="h-1 w-1 rounded-full bg-genie-blue" />
          <span>Developer Friendly</span>
        </div>
      </div>
    </div>
  );
}

export const AUTH_FEATURES = [
  'Generate Code Instantly',
  'Get Code Explanations',
  'Turn Voice to Code',
  'OCR for Handwritten Code',
  'Create Full Projects',
];
