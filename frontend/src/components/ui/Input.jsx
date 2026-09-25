import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, trailing, id, className = '', required = false, ...rest },
  ref
) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).slice(2)}`;

  return (
    <div className="w-full">
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

      <div className="relative">
        {Icon ? (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-ink-400">
            <Icon size={17} />
          </span>
        ) : null}

        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-label={label || undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`field ${Icon ? 'pl-11' : ''} ${trailing ? 'pr-11' : ''} ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15' : ''} ${className}`}
          {...rest}
        />

        {trailing ? (
          <span className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-ink-400">
            {trailing}
          </span>
        ) : null}
      </div>

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

export default Input;
