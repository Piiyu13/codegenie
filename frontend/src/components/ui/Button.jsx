import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:
    'bg-genie-blue text-white shadow-glow hover:bg-brand-600 hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'bg-white text-genie-navy border border-ink-200 hover:border-genie-blue hover:text-genie-blue shadow-soft dark:bg-ink-800 dark:text-white dark:border-ink-700 dark:hover:border-brand-400 dark:hover:text-brand-300',
  dark: 'bg-genie-navy text-white hover:bg-ink-800 hover:-translate-y-0.5',
  ghost:
    'bg-transparent text-ink-600 hover:bg-ink-100 hover:text-genie-navy dark:text-ink-300 dark:hover:bg-ink-700 dark:hover:text-white',
  'ghost-light': 'bg-white/10 text-white hover:bg-white/20 border border-white/15',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-glow',
  outline:
    'border border-genie-blue/40 text-genie-blue bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 dark:text-brand-300',
};

const SIZES = {
  sm: 'px-3.5 py-2 text-xs gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2.5',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon: Icon,
  trailingIcon: TrailingIcon,
  className = '',
  children,
  disabled,
  to,
  href,
  type = 'button',
  ...rest
}) {
  const classes = [
    'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-genie-blue/30',
    'disabled:cursor-not-allowed disabled:opacity-60 disabled:translate-y-0 disabled:shadow-none',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.md,
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = loading ? (
    <>
      <Loader2 size={size === 'sm' ? 14 : 16} className="animate-spin" />
      <span>{children}</span>
    </>
  ) : (
    <>
      {Icon ? <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} /> : null}
      <span>{children}</span>
      {TrailingIcon ? <TrailingIcon size={size === 'sm' ? 14 : 16} /> : null}
    </>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled || loading} {...rest}>
      {content}
    </button>
  );
}
