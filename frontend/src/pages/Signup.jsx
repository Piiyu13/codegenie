import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, UserRound, AlertCircle } from 'lucide-react';
import AuthPanel, { AUTH_FEATURES } from '../components/AuthPanel.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const STRENGTH = [
  { label: 'Weak', bar: 'bg-red-400', width: 'w-1/4' },
  { label: 'Fair', bar: 'bg-amber-400', width: 'w-2/4' },
  { label: 'Good', bar: 'bg-brand-400', width: 'w-3/4' },
  { label: 'Strong', bar: 'bg-emerald-500', width: 'w-full' },
];

function scorePassword(password) {
  if (!password) return -1;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 3);
}

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState({ password: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const { signup, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please tell us your name.';
    else if (form.name.trim().length < 2) next.name = 'Name must be at least 2 characters.';

    if (!form.email.trim()) next.email = 'Email address is required.';
    else if (!EMAIL_RE.test(form.email.trim())) next.email = 'Enter a valid email address.';

    if (!form.password) next.password = 'Create a password.';
    else if (form.password.length < 8) next.password = 'Use at least 8 characters.';
    else if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password))
      next.password = 'Include at least one letter and one number.';

    if (!form.confirm) next.confirm = 'Confirm your password.';
    else if (form.confirm !== form.password) next.confirm = 'Passwords do not match.';

    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error('Please fix the highlighted fields.');
      return;
    }

    setLoading(true);
    try {
      await signup({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      toast.success('Account created — welcome to Code Genie!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err.message || 'Something went wrong while creating your account.';
      if (/email.*exist|already/i.test(message)) {
        setErrors((current) => ({ ...current, email: message }));
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const strengthIndex = scorePassword(form.password);
  const hasError = Object.values(errors).some(Boolean);

  const toggle = (key) => () => setVisible((current) => ({ ...current, [key]: !current[key] }));

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthPanel
        title="Join Code Genie"
        subtitle="Create your account and start building."
        items={AUTH_FEATURES}
      />

      <div className="flex items-center justify-center bg-white px-5 py-12 sm:px-10 dark:bg-ink-950">
        <div className="w-full max-w-md animate-fade-up">
          <div className="rounded-3xl border border-ink-200 bg-white p-7 shadow-card sm:p-9 dark:border-ink-700 dark:bg-ink-900">
            <h2 className="text-2xl font-extrabold tracking-tight text-genie-navy dark:text-white">
              Create Account
            </h2>
            <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">
              Fill in your details to get started — it only takes a minute.
            </p>

            {hasError ? (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
              >
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                Please review the highlighted fields and try again.
              </div>
            ) : null}

            <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
              <Input
                label="Full Name"
                type="text"
                autoComplete="name"
                placeholder="Ada Lovelace"
                icon={UserRound}
                value={form.name}
                onChange={update('name')}
                error={errors.name}
                required
              />

              <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                icon={Mail}
                value={form.email}
                onChange={update('email')}
                error={errors.email}
                required
              />

              <div>
                <Input
                  label="Password"
                  type={visible.password ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  icon={Lock}
                  value={form.password}
                  onChange={update('password')}
                  error={errors.password}
                  required
                  trailing={
                    <button
                      type="button"
                      onClick={toggle('password')}
                      aria-label={visible.password ? 'Hide password' : 'Show password'}
                      className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-genie-blue dark:hover:bg-ink-800"
                    >
                      {visible.password ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />

                {form.password ? (
                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          STRENGTH[Math.max(strengthIndex, 0)].bar
                        } ${STRENGTH[Math.max(strengthIndex, 0)].width}`}
                      />
                    </div>
                    <span className="w-14 text-right text-[11px] font-bold uppercase tracking-wide text-ink-400">
                      {STRENGTH[Math.max(strengthIndex, 0)].label}
                    </span>
                  </div>
                ) : null}
              </div>

              <Input
                label="Confirm Password"
                type={visible.confirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repeat your password"
                icon={Lock}
                value={form.confirm}
                onChange={update('confirm')}
                error={errors.confirm}
                required
                trailing={
                  <button
                    type="button"
                    onClick={toggle('confirm')}
                    aria-label={visible.confirm ? 'Hide password' : 'Show password'}
                    className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-genie-blue dark:hover:bg-ink-800"
                  >
                    {visible.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              <Button type="submit" fullWidth size="lg" loading={loading}>
                {loading ? 'Creating your account...' : 'Sign Up'}
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-genie-blue hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
