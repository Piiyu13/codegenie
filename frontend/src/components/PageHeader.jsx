export default function PageHeader({ title, subtitle, actions, icon: Icon }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3.5">
        {Icon ? (
          <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-xl bg-genie-blue text-white shadow-glow sm:grid">
            <Icon size={20} />
          </span>
        ) : null}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-genie-navy dark:text-white sm:text-[28px]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-400 sm:text-[15px]">{subtitle}</p>
          ) : null}
        </div>
      </div>

      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div> : null}
    </div>
  );
}
