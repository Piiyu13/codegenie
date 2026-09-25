import { useState } from 'react';
import {
  BookOpenText,
  Braces,
  ChevronRight,
  Inbox,
  Lightbulb,
  ListChecks,
  Play,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Card, { CardHeader } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Select from '../components/ui/Select.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import CodeEditor from '../components/ui/CodeEditor.jsx';
import { explainCode, LOADING_MESSAGES, notifyResult } from '../services/ai.js';
import { LANGUAGES } from '../utils/helpers.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const SAMPLE = `function calculateTotal(items, taxRate = 0.08) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number((subtotal + tax).toFixed(2)),
  };
}`;

const EXPECTED = [
  { icon: Sparkles, text: 'A plain-English summary of what the code does' },
  { icon: ListChecks, text: 'A step-by-step breakdown of the logic' },
  { icon: Braces, text: 'The important functions and their roles' },
  { icon: Inbox, text: 'Inputs and outputs explained clearly' },
  { icon: TrendingUp, text: 'Suggestions to improve the code' },
];

export default function CodeExplanation() {
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState(SAMPLE);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const { bumpStat } = useAuth();
  const toast = useToast();

  const handleExplain = async (event) => {
    event?.preventDefault?.();

    if (!code.trim()) {
      setError('Paste some code before asking for an explanation.');
      toast.error('Please paste some code first.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await explainCode({ language, code });
      setResult(response);
      bumpStat('explanations');
      notifyResult(toast, response, 'Explanation ready!');
    } catch (err) {
      setError(err.message || 'We could not explain that code.');
      toast.error(err.message || 'Explanation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Code Explanation"
        subtitle="Paste your code and get a simple explanation."
        icon={BookOpenText}
      />

      {/* Input */}
      <Card className="overflow-hidden">
        <CardHeader title="Your Code" subtitle="Select a language and paste the snippet" icon={Braces} />
        <form className="grid gap-5 p-5 sm:p-6" onSubmit={handleExplain}>
          <div className="grid gap-5 sm:grid-cols-[240px_1fr]">
            <Select
              label="Programming Language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              options={LANGUAGES}
            />
            <div className="hidden items-end sm:flex">
              <p className="mb-2.5 text-xs text-ink-400">
                Sample code is pre-filled — replace it with your own to try it out.
              </p>
            </div>
          </div>

          <Textarea
            label="Code"
            rows={9}
            spellCheck={false}
            className="font-mono text-[13px] leading-relaxed"
            placeholder="Paste your code here..."
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              if (error) setError('');
            }}
            error={error}
            hint={`${code.split('\n').length} lines selected for analysis`}
          />

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" icon={Play} loading={loading} size="lg">
              {loading ? LOADING_MESSAGES.explain : 'Explain Code'}
            </Button>
            <Button variant="ghost" onClick={() => { setCode(''); setResult(null); }}>
              Clear
            </Button>
          </div>
        </form>
      </Card>

      {/* Results */}
      <section className="mt-6" aria-live="polite">
        {loading ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {[0, 1].map((index) => (
              <div key={index} className="surface p-6">
                <div className="h-4 w-1/3 animate-pulse rounded bg-ink-100 dark:bg-ink-700" />
                <div className="mt-4 space-y-2.5">
                  <div className="h-3 w-full animate-pulse rounded bg-ink-100 dark:bg-ink-700" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-ink-100 dark:bg-ink-700" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-ink-100 dark:bg-ink-700" />
                </div>
              </div>
            ))}
            <p className="text-sm font-semibold text-genie-blue lg:col-span-2">
              {LOADING_MESSAGES.explain}
            </p>
          </div>
        ) : result ? (
          <div className="grid gap-6">
            <div>
              <div className="mb-3 flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-genie-navy text-white">
                  <Braces size={16} />
                </span>
                <h2 className="text-lg font-extrabold text-genie-navy dark:text-white">Analyzed Code</h2>
                <span className="rounded-lg border border-ink-200 bg-white px-2.5 py-1 text-xs font-semibold text-ink-500 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300">
                  {language}
                </span>
              </div>
              <CodeEditor code={code} language={language} title="analyzed-input" maxHeight="16rem" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Summary + steps */}
              <Card className="lg:col-span-2">
                <CardHeader title="Explanation" subtitle="What this code does, in plain English" icon={Lightbulb} />
                <div className="p-5 sm:p-6">
                  <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300">{result.summary}</p>

                  <h4 className="mt-6 text-sm font-extrabold uppercase tracking-wider text-genie-blue">
                    Step-by-step breakdown
                  </h4>
                  <ol className="mt-3 space-y-3">
                    {result.steps.map((step, index) => (
                      <li key={step.title} className="flex gap-3.5">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-50 text-xs font-extrabold text-genie-blue dark:bg-brand-500/15 dark:text-brand-300">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-ink-800 dark:text-white">{step.title}</p>
                          <p className="mt-0.5 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
                            {step.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </Card>

              {/* Important functions */}
              <Card>
                <CardHeader title="Important Functions" icon={ListChecks} />
                <ul className="divide-y divide-ink-100 dark:divide-ink-700">
                  {result.functions.map((fn) => (
                    <li key={fn.name} className="px-5 py-3.5">
                      <p className="font-mono text-[13px] font-semibold text-genie-blue">{fn.name}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
                        {fn.purpose}
                      </p>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Inputs & outputs */}
              <Card>
                <CardHeader title="Inputs & Outputs" icon={Inbox} />
                <div className="space-y-4 p-5">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-ink-400">Inputs</p>
                    <ul className="mt-2 space-y-2">
                      {result.io.inputs.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-ink-600 dark:text-ink-300">
                          <ChevronRight size={15} className="mt-0.5 shrink-0 text-genie-blue" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-ink-400">Outputs</p>
                    <ul className="mt-2 space-y-2">
                      {result.io.outputs.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-ink-600 dark:text-ink-300">
                          <ChevronRight size={15} className="mt-0.5 shrink-0 text-genie-blue" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Improvements */}
              <Card className="lg:col-span-2">
                <CardHeader title="Potential Improvements" subtitle="How to make it production-ready" icon={TrendingUp} />
                <ul className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
                  {result.improvements.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 rounded-xl border border-ink-100 bg-ink-50/70 px-3.5 py-3 text-sm text-ink-600 dark:border-ink-700 dark:bg-ink-900/60 dark:text-ink-300"
                    >
                      <Lightbulb size={15} className="mt-0.5 shrink-0 text-amber-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="p-6">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-genie-blue dark:bg-brand-500/15">
                  <Sparkles size={22} />
                </span>
                <div>
                  <h3 className="text-base font-bold">You&apos;ll get a beginner-friendly breakdown</h3>
                  <p className="text-sm text-ink-500 dark:text-ink-400">
                    Hit <span className="font-semibold text-genie-blue">Explain Code</span> to see it.
                  </p>
                </div>
              </div>
              <ul className="grid gap-2 text-sm text-ink-500 dark:text-ink-400">
                {EXPECTED.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2.5">
                    <Icon size={15} className="text-genie-blue" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}
