import { forwardRef } from 'react';

const Textarea = forwardRef(function Textarea(
  { label, error, hint, id, className = '', wrapperClassName = '', rows = 5, required = false, ...rest },
  ref
) {
  const inputId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).slice(2)}`;

  return (
    <div className={`flex w-full flex-col ${wrapperClassName}`}>
      {label ? (
        <label htmlFor={inputId} className="label">
          {label}
          {required ? (
            <span className="ml-0.5 text-genie-blue" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        required={required}
        aria-label={label || undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`field resize-y flex-1 ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15' : ''} ${className}`}
        {...rest}
      />

      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs font-medium text-red-500" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-400">{hint}</p>
      ) : null}
    </div>
  );
});

export default Textarea;
