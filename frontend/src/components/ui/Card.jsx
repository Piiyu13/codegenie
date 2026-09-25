export function Card({ className = '', children, as: Tag = 'div', ...rest }) {
  return (
    <Tag className={`surface transition-shadow duration-300 hover:shadow-card ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export function CardHeader({ title, subtitle, action, icon: Icon, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 border-b border-ink-100 px-5 py-4 dark:border-ink-700 sm:px-6 ${className}`}>
      <div className="flex items-start gap-3">
        {Icon ? (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-genie-blue dark:bg-brand-500/15">
            <Icon size={17} />
          </span>
        ) : null}
        <div>
          <h3 className="text-base font-bold leading-tight">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">{subtitle}</p> : null}
        </div>
      </div>
      {action}
    </div>
  );
}

export default Card;
