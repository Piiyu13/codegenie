import { useState } from 'react';
import { Code2, Eraser, FileCode2, Lightbulb, Play, Terminal } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Card, { CardHeader } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Select from '../components/ui/Select.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import CodeEditor from '../components/ui/CodeEditor.jsx';
import { generateCode, LOADING_MESSAGES, notifyResult } from '../services/ai.js';
import { demoCode } from '../services/demoData.js';
import { LANGUAGES, copyText } from '../utils/helpers.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function CodeGenerator() {
  const [language, setLanguage] = useState('Python');
  const [requirement, setRequirement] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(() => demoCode('Python', 'calculator'));
  const [isDemoResult, setIsDemoResult] = useState(true);

  const { bumpStat } = useAuth();
  const toast = useToast();

  const handleGenerate = async (event) => {
    event?.preventDefault?.();

    if (!requirement.trim()) {
      setError('Describe what you want to build before generating.');
      toast.error('Please describe what you want to build.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await generateCode({ language, requirement });
      setResult(response.code);
      setIsDemoResult(response.source === 'demo-fallback');
      bumpStat('code');
      notifyResult(toast, response, 'Your code is ready!');
    } catch (err) {
      setError(err.message || 'Something went wrong while generating code.');
      toast.error(err.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (!requirement.trim()) {
      toast.info('Add a requirement first, then regenerate.');
      return;
    }
    handleGenerate();
  };

  const handleClear = () => {
    setRequirement('');
    setError('');
    setResult('');
    setIsDemoResult(false);
    toast.info('Cleared the workspace.');
  };

  const handleCopy = async () => {
    const ok = await copyText(result);
    toast[ok ? 'success' : 'error'](ok ? 'Code copied to clipboard.' : 'Could not copy the code.');
  };

  const lineCount = result ? result.split('\n').length : 0;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Code Generator"
        subtitle="Write your requirements and get code instantly."
        icon={Code2}
        actions={
          <Button variant="secondary" icon={Eraser} onClick={handleClear}>
            Clear
          </Button>
        }
      />

      {/* Input */}
      <Card className="overflow-hidden">
        <CardHeader title="Requirements" subtitle="Choose a language and describe what to build" icon={Terminal} />
        <form className="grid gap-5 p-5 sm:p-6" onSubmit={handleGenerate}>
          <div className="grid gap-5 sm:grid-cols-[240px_1fr] sm:items-end">
            <Select
              label="Programming Language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              options={LANGUAGES}
            />

            <div className="hidden sm:block">
              <p className="mb-1.5 text-sm font-semibold text-ink-700 dark:text-ink-200">Prompt</p>
              <p className="text-xs text-ink-400">
                Be specific: mention inputs, outputs and any constraints.
              </p>
            </div>
          </div>

          <Textarea
            label="Requirement"
            rows={5}
            placeholder="Describe what you want to build... e.g. Create a simple calculator program with add, subtract, multiply and divide"
            value={requirement}
            onChange={(event) => {
              setRequirement(event.target.value);
              if (error) setError('');
            }}
            error={error}
            hint={`${requirement.length} characters · The clearer the prompt, the better the code.`}
          />

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" icon={Play} loading={loading} size="lg">
              {loading ? LOADING_MESSAGES.generate : 'Generate Code'}
            </Button>
            <Button variant="ghost" onClick={handleRegenerate} disabled={loading}>
              Regenerate
            </Button>
          </div>
        </form>
      </Card>

      {/* Result */}
      <section className="mt-6" aria-live="polite">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-genie-navy text-white">
              <FileCode2 size={16} />
            </span>
            <h2 className="text-lg font-extrabold text-genie-navy dark:text-white">Generated Code</h2>
            {isDemoResult && result ? (
              <span className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-genie-blue dark:border-brand-400/30 dark:bg-brand-500/10 dark:text-brand-300">
                Example
              </span>
            ) : null}
          </div>

          {result ? (
            <span className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-500 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300">
              {language} · {lineCount} lines
            </span>
          ) : null}
        </div>

        {loading ? (
          <div className="grid gap-3 rounded-2xl border border-ink-200 bg-white p-6 dark:border-ink-700 dark:bg-ink-800">
            <div className="h-4 w-1/3 animate-pulse rounded bg-ink-100 dark:bg-ink-700" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-ink-100 dark:bg-ink-700" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-ink-100 dark:bg-ink-700" />
            <p className="pt-1 text-sm font-semibold text-genie-blue">{LOADING_MESSAGES.generate}</p>
          </div>
        ) : (
          <CodeEditor
            code={result}
            language={language}
            title="generated-output"
            onRegenerate={handleRegenerate}
            emptyMessage="Your generated code will appear here. Describe a requirement to begin."
          />
        )}

        {result && !isDemoResult ? (
          <div className="mt-4 flex flex-wrap items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50/70 px-4 py-3.5 dark:border-brand-400/20 dark:bg-brand-500/10">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white text-genie-blue shadow-soft dark:bg-ink-800">
              <Lightbulb size={15} />
            </span>
            <p className="flex-1 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              Tip: open the <span className="font-semibold text-genie-blue">Code Explanation</span>{' '}
              tool to get a beginner-friendly breakdown of this code, or refine your requirement and
              hit <span className="font-semibold text-genie-blue">Regenerate</span>.
            </p>
            <Button size="sm" variant="outline" onClick={handleCopy}>
              Copy Code
            </Button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
