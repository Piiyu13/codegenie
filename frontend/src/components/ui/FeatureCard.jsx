import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FeatureCard({ icon: Icon, title, description, to, accent = 'blue' }) {
  const accents = {
    blue: 'bg-brand-50 text-genie-blue group-hover:bg-genie-blue group-hover:text-white dark:bg-brand-500/15',
    navy: 'bg-ink-100 text-genie-navy group-hover:bg-genie-navy group-hover:text-white dark:bg-white/10',
  };

  const body = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span
          className={`grid h-12 w-12 place-items-center rounded-xl transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-glow ${accents[accent] || accents.blue}`}
        >
          {Icon ? <Icon size={22} /> : null}
        </span>
        <ArrowRight
          size={18}
          className="translate-x-0 text-ink-300 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-genie-blue group-hover:opacity-100"
        />
      </div>

      <h3 className="mt-5 text-lg font-bold text-genie-navy dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-400">{description}</p>

      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-genie-blue">
        Open tool
        <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </>
  );

  const classes =
    'group surface block h-full p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-lift dark:hover:border-brand-400/40';

  if (to) {
    return (
      <Link to={to} className={classes}>
        {body}
      </Link>
    );
  }

  return <div className={classes}>{body}</div>;
}
