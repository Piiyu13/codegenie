import { useMemo, useState } from 'react';
import { Check, Copy, Download, RefreshCw } from 'lucide-react';
import { tokenizeLine, TOKEN_STYLES } from '../../utils/highlight.js';
import { copyText, downloadText } from '../../utils/helpers.js';

/**
 * Dark, editor-style code panel with line numbers, lightweight syntax
 * highlighting and copy / download / regenerate actions.
 */
export default function CodeEditor({
  code = '',
  language = 'JavaScript',
  title = 'Code',
  filename,
  maxHeight = '26rem',
  actions = true,
  onRegenerate,
  emptyMessage = 'Your generated code will appear here.',
  className = '',
}) {
  const [copied, setCopied] = useState(false);

  const lines = useMemo(() => code.split('\n'), [code]);

  const handleCopy = async () => {
    const ok = await copyText(code);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleDownload = () => {
    const ext = {
      Python: 'py',
      JavaScript: 'js',
      Java: 'java',
      C: 'c',
      'C++': 'cpp',
      'C#': 'cs',
      HTML: 'html',
      CSS: 'css',
      SQL: 'sql',
      PHP: 'php',
      JSON: 'json',
      Markdown: 'md',
      Text: 'txt',
    }[language] || 'txt';
    downloadText(filename || `code-genie.${ext}`, code);
  };

  if (!code) {
    return (
      <div
        className={`grid place-items-center rounded-2xl border border-dashed border-ink-300 bg-white/60 px-6 py-14 text-center dark:border-ink-700 dark:bg-ink-900/40 ${className}`}
      >
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-genie-blue dark:bg-brand-500/15">
          <Copy size={20} />
        </div>
        <p className="mt-3 text-sm font-medium text-ink-500 dark:text-ink-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[#0B2139] shadow-lift ${className}`}
      style={{ backgroundColor: '#0E2946' }}
    >
      {/* Editor chrome */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0B2139] px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex shrink-0 gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          </span>
          <span className="truncate text-xs font-semibold text-white/80">{title}</span>
          <span className="shrink-0 rounded-md border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-300">
            {language}
          </span>
        </div>

        {actions ? (
          <div className="flex items-center gap-1.5">
            <EditorAction onClick={handleCopy} active={copied}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy'}
            </EditorAction>
            <EditorAction onClick={handleDownload}>
              <Download size={13} />
              Download
            </EditorAction>
            {onRegenerate ? (
              <EditorAction onClick={onRegenerate}>
                <RefreshCw size={13} />
                Regenerate
              </EditorAction>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Code */}
      <div className="code-scroll overflow-auto" style={{ maxHeight }}>
        <pre className="min-w-full py-3 font-mono text-[12.5px] leading-6 sm:text-[13px]">
          {lines.map((line, index) => (
            <div key={index} className="flex hover:bg-white/[0.04]">
              <span
                className="w-11 shrink-0 select-none pr-3 text-right text-white/25"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <code className="whitespace-pre pr-6">
                {tokenizeLine(line, language).map((token, i) => (
                  <span key={i} className={TOKEN_STYLES[token.type] || TOKEN_STYLES.plain}>
                    {token.text}
                  </span>
                ))}
                {line.length === 0 ? ' ' : null}
              </code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

function EditorAction({ children, onClick, active = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition
        ${
          active
            ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
            : 'border-white/15 bg-white/5 text-white/70 hover:border-brand-400/50 hover:bg-white/10 hover:text-white'
        }`}
    >
      {children}
    </button>
  );
}
