const TONES = {
  blue: 'bg-brand-50 text-genie-blue dark:bg-brand-500/15 dark:text-brand-300',
  navy: 'bg-ink-100 text-genie-navy dark:bg-white/10 dark:text-white',
  teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
};

export default function StatCard({ icon: Icon, label, value, trend, tone = 'blue', className = '' }) {
  return (
    <div
      className={`group surface flex items-center gap-4 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-5 ${className}`}
    >
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${TONES[tone] || TONES.blue}`}
      >
        {Icon ? <Icon size={21} /> : null}
      </span>

      <div className="min-w-0">
        <p className="truncate text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
          {label}
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-display text-2xl font-extrabold leading-none text-genie-navy dark:text-white">
            {value}
          </span>
          {trend ? (
            <span className="text-[11px] font-semibold text-emerald-500">{trend}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
