import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const STYLES = {
  success: {
    icon: CheckCircle2,
    className: 'border-emerald-200 bg-white text-ink-800 dark:bg-ink-800 dark:border-emerald-500/30',
    iconClass: 'text-emerald-500',
  },
  error: {
    icon: AlertTriangle,
    className: 'border-red-200 bg-white text-ink-800 dark:bg-ink-800 dark:border-red-500/30',
    iconClass: 'text-red-500',
  },
  info: {
    icon: Info,
    className: 'border-brand-200 bg-white text-ink-800 dark:bg-ink-800 dark:border-brand-400/30',
    iconClass: 'text-brand-500',
  },
};

let counter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const push = useCallback(
    (message, type = 'info', duration = 3800) => {
      const id = ++counter;
      setToasts((list) => [...list.slice(-3), { id, message, type }]);
      timers.current[id] = setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      push,
      dismiss,
      success: (msg, opts) => push(msg, 'success', opts?.duration),
      error: (msg, opts) => push(msg, 'error', opts?.duration),
      info: (msg, opts) => push(msg, 'info', opts?.duration),
    }),
    [push, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 top-4 z-[100] flex flex-col items-center gap-2.5 sm:inset-x-auto sm:right-5 sm:top-5 sm:items-end"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const style = STYLES[toast.type] || STYLES.info;
          const Icon = style.icon;
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex w-full max-w-sm animate-slide-in-right items-start gap-3 rounded-xl border px-4 py-3 shadow-lift backdrop-blur ${style.className}`}
            >
              <Icon size={18} className={`mt-0.5 shrink-0 ${style.iconClass}`} />
              <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="rounded-md p-0.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-600 dark:hover:bg-ink-700"
                aria-label="Dismiss notification"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
