import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  { label, error, hint, id, options = [], placeholder, className = '', required = false, ...rest },
  ref
) {
  const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).slice(2)}`;

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={selectId} className="label">
          {label}
          {required ? (
            <span className="ml-0.5 text-genie-blue" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-label={label || undefined}
          aria-invalid={Boolean(error)}
          className={`field appearance-none pr-10 ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15' : ''} ${className}`}
          {...rest}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => {
            const value = typeof option === 'object' ? option.value : option;
            const text = typeof option === 'object' ? option.label : option;
            return (
              <option key={value} value={value}>
                {text}
              </option>
            );
          })}
        </select>

        <span className="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-center text-ink-400">
          <ChevronDown size={17} />
        </span>
      </div>

      {error ? (
        <p id={`${selectId}-error`} className="mt-1.5 text-xs font-medium text-red-500" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-400">{hint}</p>
      ) : null}
    </div>
  );
});

export default Select;
