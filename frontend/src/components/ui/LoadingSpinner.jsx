export default function LoadingSpinner({ size = 20, label, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} role="status" aria-live="polite">
      <span
        className="inline-block animate-spin rounded-full border-2 border-genie-blue/25 border-t-genie-blue"
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      {label ? <span className="text-sm font-medium text-ink-500 dark:text-ink-400">{label}</span> : null}
    </span>
  );
}
