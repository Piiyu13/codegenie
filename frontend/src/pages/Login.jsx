import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, UserRound, AlertCircle } from 'lucide-react';
import AuthPanel, { AUTH_FEATURES } from '../components/AuthPanel.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Login() {
  const [form, setForm] = useState({ identifier: '', password: '', remember: true });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const update = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.identifier.trim()) next.identifier = 'Enter your email or username.';
    if (!form.password) next.password = 'Enter your password.';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters.';
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
      const profile = await login(form.identifier.trim(), {
        password: form.password,
        remember: form.remember,
      });
      toast.success(`Welcome back, ${profile.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Unable to log you in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const hasError = Boolean(errors.identifier || errors.password);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthPanel
        title="Welcome Back!"
        subtitle="Login to continue your coding journey."
        items={AUTH_FEATURES}
      />

      <div className="flex items-center justify-center bg-white px-5 py-12 sm:px-10 dark:bg-ink-950">
        <div className="w-full max-w-md animate-fade-up">
          <div className="rounded-3xl border border-ink-200 bg-white p-7 shadow-card sm:p-9 dark:border-ink-700 dark:bg-ink-900">
            <h2 className="text-2xl font-extrabold tracking-tight text-genie-navy dark:text-white">Login</h2>
            <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">
              Enter your credentials to access your account.
            </p>

            {hasError ? (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
              >
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                Some fields need your attention before you can continue.
              </div>
            ) : null}

            <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
              <Input
                label="Email or Username"
                type="text"
                name="identifier"
                autoComplete="username"
                placeholder="you@example.com"
                icon={UserRound}
                value={form.identifier}
                onChange={update('identifier')}
                error={errors.identifier}
                required
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                icon={Lock}
                value={form.password}
                onChange={update('password')}
                error={errors.password}
                required
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-genie-blue dark:hover:bg-ink-800"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              <div className="flex items-center justify-between gap-3 pt-1">
                <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-ink-600 dark:text-ink-300">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={update('remember')}
                    className="h-4 w-4 rounded border-ink-300 text-genie-blue accent-genie-blue"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => toast.info('Password reset links are sent by the backend in production.')}
                  className="text-sm font-semibold text-genie-blue transition hover:text-brand-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" fullWidth size="lg" loading={loading}>
                {loading ? 'Signing you in...' : 'Login'}
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-bold text-genie-blue hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
