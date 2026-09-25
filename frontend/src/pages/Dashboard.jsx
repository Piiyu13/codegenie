import { Link } from 'react-router-dom';
import {
  Code2,
  BookOpenText,
  Mic,
  FolderTree,
  Zap,
  FolderKanban,
  ScanLine,
  ArrowRight,
  Sparkles,
  Clock3,
  ChevronRight,
} from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import Button from '../components/ui/Button.jsx';
import Card, { CardHeader } from '../components/ui/Card.jsx';
import { GenieMark } from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const QUICK_ACTIONS = [
  { to: '/code-generator', label: 'Generate Code', icon: Code2, tone: 'bg-brand-50 text-genie-blue dark:bg-brand-500/15' },
  { to: '/code-explanation', label: 'Explain Code', icon: BookOpenText, tone: 'bg-indigo-50 text-indigo-500 dark:bg-indigo-500/15' },
  { to: '/voice-to-code', label: 'Voice to Code', icon: Mic, tone: 'bg-rose-50 text-rose-500 dark:bg-rose-500/15' },
  { to: '/handwritten-ocr', label: 'Handwritten OCR', icon: ScanLine, tone: 'bg-amber-50 text-amber-500 dark:bg-amber-500/15' },
  { to: '/project-generator', label: 'Project Generator', icon: FolderTree, tone: 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/15' },
];

const ACTIVITY = [
  { icon: Code2, title: 'Generated a Python REST API', time: '12 minutes ago', tone: 'text-genie-blue bg-brand-50 dark:bg-brand-500/15' },
  { icon: BookOpenText, title: 'Explained a React custom hook', time: '2 hours ago', tone: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/15' },
  { icon: ScanLine, title: 'Extracted code from handwritten notes', time: 'Yesterday', tone: 'text-amber-500 bg-amber-50 dark:bg-amber-500/15' },
  { icon: FolderTree, title: 'Created “taskflow-react” project', time: '2 days ago', tone: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/15' },
];

export default function Dashboard() {
  const { user, stats } = useAuth();
  const toast = useToast();

  const firstName = user?.name?.split(' ')[0] || 'Developer';

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${firstName}! Here's what you can do today.`}
        actions={
          <Button to="/code-generator" icon={Sparkles}>
            New Generation
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Code2} label="Code Generated" value={stats.code} trend="+3 this week" tone="blue" />
        <StatCard icon={BookOpenText} label="Explanations" value={stats.explanations} trend="+2 this week" tone="navy" />
        <StatCard icon={Mic} label="Voice to Code" value={stats.voice} trend="+1 this week" tone="teal" />
        <StatCard icon={FolderKanban} label="Projects Created" value={stats.projects} tone="amber" />
      </div>

      {/* Welcome + quick actions */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-2xl bg-genie-navy p-6 shadow-card sm:p-8 lg:col-span-2">
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -right-14 -top-16 h-56 w-56 rounded-full bg-genie-blue/35 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-3">
                <GenieMark size={52} />
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    Code <span className="text-brand-300">Genie</span>
                  </h2>
                  <p className="text-sm font-semibold text-brand-300">Your AI-Powered Coding Assistant</p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-white/70 sm:text-[15px]">
                Generate code, explain complex code, convert voice instructions into code, and create
                full projects in seconds.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button to="/code-generator" trailingIcon={ArrowRight}>
                  Start Coding
                </Button>
                <Button to="/project-generator" variant="ghost-light">
                  Create a Project
                </Button>
              </div>
            </div>

            <div className="hidden shrink-0 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center sm:block">
              <p className="font-display text-3xl font-extrabold text-white">10+</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-white/50">
                Languages
              </p>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardHeader title="Quick Actions" subtitle="Jump straight into a tool" icon={Zap} />
          <ul className="divide-y divide-ink-100 dark:divide-ink-700">
            {QUICK_ACTIONS.map(({ to, label, icon: Icon, tone }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="group flex items-center gap-3 px-5 py-3 transition hover:bg-brand-50/60 dark:hover:bg-ink-700/50"
                >
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${tone}`}>
                    <Icon size={17} />
                  </span>
                  <span className="flex-1 text-sm font-semibold text-ink-700 transition group-hover:text-genie-blue dark:text-ink-200">
                    {label}
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-ink-300 transition group-hover:translate-x-1 group-hover:text-genie-blue"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Activity + credits */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Recent Activity" subtitle="Everything you have generated lately" icon={Clock3} />
          <ul className="divide-y divide-ink-100 dark:divide-ink-700">
            {ACTIVITY.map(({ icon: Icon, title, time, tone }) => (
              <li key={title} className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${tone}`}>
                  <Icon size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink-700 dark:text-ink-200">
                    {title}
                  </span>
                  <span className="block text-xs text-ink-400">{time}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-genie-blue dark:bg-brand-500/15">
              <Sparkles size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold">AI Credits</h3>
              <p className="text-xs text-ink-400">Resets in 18 days</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-bold text-genie-navy dark:text-white">42 / 100 used</span>
              <span className="text-xs text-ink-400">Free plan</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
              <div className="h-full w-[42%] rounded-full bg-genie-blue" />
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
            You have plenty of credits left for this month. Need more? Upgrade any time.
          </p>

          <Button
            variant="outline"
            className="mt-auto w-full"
            onClick={() => toast.info('Plans & billing will be connected to your payment provider.')}
          >
            View Plans
          </Button>
        </Card>
      </div>
    </div>
  );
}
