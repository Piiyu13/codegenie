import { Link } from 'react-router-dom';

/** The Code Genie robot mark — drawn as SVG so it stays crisp at any size. */
export function GenieMark({ size = 40, badge = true }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="Code Genie"
      className="shrink-0"
    >
      {badge ? <rect width="64" height="64" rx="17" fill="#173B63" /> : null}
      <path d="M32 13.5v5.5" stroke="#168DF5" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="32" cy="11" r="3.6" fill="#168DF5" />
      <rect x="15" y="21.5" width="34" height="25" rx="11" fill="#168DF5" />
      <rect x="21.5" y="28" width="21" height="12" rx="6" fill="#FFFFFF" />
      <circle cx="27.5" cy="34" r="2.9" fill="#173B63" />
      <circle cx="36.5" cy="34" r="2.9" fill="#173B63" />
      <rect x="7.5" y="28" width="5" height="12" rx="2.5" fill="#168DF5" />
      <rect x="51.5" y="28" width="5" height="12" rx="2.5" fill="#168DF5" />
    </svg>
  );
}

const SIZES = {
  sm: { mark: 32, title: 'text-lg', tagline: 'text-[10px]' },
  md: { mark: 42, title: 'text-2xl', tagline: 'text-xs' },
  lg: { mark: 64, title: 'text-4xl sm:text-5xl', tagline: 'text-sm sm:text-base' },
};

/**
 * Logo lockup: robot mark + "Code Genie" + tagline.
 * variant: 'light' (dark text) | 'dark' (white text)
 */
export default function Logo({
  variant = 'light',
  size = 'md',
  showTagline = true,
  badge = true,
  to = '/',
  className = '',
  compact = false,
}) {
  const s = SIZES[size] || SIZES.md;
  const isDark = variant === 'dark';

  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-3 transition-opacity hover:opacity-90 ${className}`}
    >
      <GenieMark size={s.mark} badge={badge} />
      <span className={compact ? 'hidden sm:inline flex-col' : 'flex flex-col'}>
        <span
          className={`${s.title} font-display font-extrabold leading-none tracking-tight ${
            isDark ? 'text-white' : 'text-genie-navy dark:text-white'
          }`}
        >
          Code <span className="text-genie-blue">Genie</span>
        </span>
        {showTagline ? (
          <span
            className={`${s.tagline} mt-1 font-medium italic tracking-wide ${
              isDark ? 'text-white/70' : 'text-ink-500 dark:text-ink-400'
            }`}
          >
            Turn Your Ideas Into Code
          </span>
        ) : null}
      </span>
    </Link>
  );
}
