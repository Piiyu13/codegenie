import { useState } from 'react';
import {
  Camera,
  KeyRound,
  Laptop,
  LogOut,
  MonitorSmartphone,
  Palette,
  Save,
  ShieldCheck,
  Sparkles,
  SunMoon,
  UserRound,
} from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Card, { CardHeader } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Modal from '../components/ui/Modal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { LANGUAGES } from '../utils/helpers.js';

const PREFS_KEY = 'code-genie-preferences';
const RESPONSE_STYLES = [
  { value: 'concise', label: 'Concise — short and to the point' },
  { value: 'detailed', label: 'Detailed — thorough with examples' },
  { value: 'beginner', label: 'Beginner-friendly — simple language' },
  { value: 'expert', label: 'Expert — advanced, production-focused' },
];

function readPrefs() {
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Settings() {
  const { user, updateUser, changePassword, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const toast = useToast();

  const saved = readPrefs() || {};
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [profileError, setProfileError] = useState({});
  const [prefs, setPrefs] = useState({
    language: saved.language || 'JavaScript',
    style: saved.style || 'detailed',
  });

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');

  const initials =
    profile.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || 'U';

  const handleAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error('Image must be smaller than 4 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
      updateUser({ avatar: reader.result });
      toast.success('Profile picture updated.');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!profile.name.trim()) errors.name = 'Name cannot be empty.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(profile.email.trim()))
      errors.email = 'Enter a valid email address.';
    setProfileError(errors);
    if (Object.keys(errors).length) {
      toast.error('Please fix the highlighted fields.');
      return;
    }
    try {
      await updateUser({ name: profile.name.trim(), email: profile.email.trim() });
      toast.success('Profile saved successfully.');
    } catch (err) {
      toast.error(err.message || 'Could not save your profile.');
    }
  };

  const savePrefs = () => {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    toast.success('Preferences saved.');
  };

  const changePasswordSubmit = async (event) => {
    event.preventDefault();
    if (!passwords.current) {
      setPasswordError('Enter your current password.');
      return;
    }
    if (passwords.next.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordError('Passwords do not match.');
      return;
    }
    try {
      await changePassword({ currentPassword: passwords.current, newPassword: passwords.next });
      setPasswordOpen(false);
      setPasswords({ current: '', next: '', confirm: '' });
      setPasswordError('');
      toast.success('Password changed successfully.');
    } catch (err) {
      setPasswordError(err.message || 'Could not change your password.');
    }
  };

  const logoutAll = () => {
    setLogoutOpen(false);
    logout();
    toast.success('Logged out from all devices.');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Settings" subtitle="Manage your profile, appearance and preferences." />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile */}
        <Card className="overflow-hidden lg:col-span-2">
          <CardHeader title="Profile" subtitle="How you appear across Code Genie" icon={UserRound} />
          <form className="grid gap-6 p-5 sm:p-6 md:grid-cols-[220px_1fr]" onSubmit={saveProfile} noValidate>
            <div className="flex flex-col items-center gap-3">
              <span className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-genie-blue text-2xl font-extrabold text-white shadow-glow">
                {avatar ? <img src={avatar} alt="Profile" className="h-full w-full object-cover" /> : initials}
              </span>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-ink-200 bg-white px-3.5 py-2 text-xs font-semibold text-ink-600 transition hover:border-genie-blue hover:text-genie-blue dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300">
                <Camera size={14} />
                Change picture
                <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
              </label>
              <p className="text-center text-[11px] text-ink-400">JPG or PNG · up to 4 MB</p>
            </div>

            <div className="grid gap-4">
              <Input
                label="Full Name"
                value={profile.name}
                onChange={(event) => setProfile({ ...profile, name: event.target.value })}
                error={profileError.name}
                icon={UserRound}
                required
              />
              <Input
                label="Email"
                type="email"
                value={profile.email}
                onChange={(event) => setProfile({ ...profile, email: event.target.value })}
                error={profileError.email}
                icon={UserRound}
                required
              />
              <div className="flex justify-end">
                <Button type="submit" icon={Save}>
                  Save changes
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Appearance */}
        <Card className="overflow-hidden">
          <CardHeader title="Appearance" subtitle="Choose how Code Genie looks" icon={Palette} />
          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
            {[
              { id: 'light', label: 'Light mode', icon: SunMoon, preview: 'bg-white', bar: 'bg-ink-200' },
              { id: 'dark', label: 'Dark mode', icon: Laptop, preview: 'bg-ink-900', bar: 'bg-ink-700' },
            ].map((option) => {
              const active = theme === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setTheme(option.id);
                    toast.success(`Switched to ${option.label}.`);
                  }}
                  aria-pressed={active}
                  className={`rounded-2xl border p-3 text-left transition-all duration-200 ${
                    active
                      ? 'border-genie-blue ring-4 ring-genie-blue/15'
                      : 'border-ink-200 hover:border-brand-300 dark:border-ink-700'
                  }`}
                >
                  <span className={`block h-20 w-full overflow-hidden rounded-xl border border-ink-100 ${option.preview} dark:border-ink-700`}>
                    <span className={`mt-3 ml-3 block h-2 w-10 rounded ${option.bar}`} />
                    <span className={`mt-2 ml-3 block h-2 w-16 rounded ${option.bar}`} />
                    <span className="mt-2 ml-3 block h-4 w-14 rounded bg-genie-blue" />
                  </span>
                  <span className="mt-3 flex items-center gap-2 text-sm font-bold text-genie-navy dark:text-white">
                    <option.icon size={15} className={active ? 'text-genie-blue' : 'text-ink-400'} />
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Preferences */}
        <Card className="overflow-hidden">
          <CardHeader title="Preferences" subtitle="Defaults for new sessions" icon={Sparkles} />
          <div className="grid gap-5 p-5 sm:p-6">
            <Select
              label="Default Programming Language"
              value={prefs.language}
              onChange={(event) => setPrefs({ ...prefs, language: event.target.value })}
              options={LANGUAGES}
            />
            <Select
              label="Default AI Response Style"
              value={prefs.style}
              onChange={(event) => setPrefs({ ...prefs, style: event.target.value })}
              options={RESPONSE_STYLES}
            />
            <div className="flex justify-end">
              <Button icon={Save} onClick={savePrefs}>
                Save preferences
              </Button>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="overflow-hidden lg:col-span-2">
          <CardHeader title="Security" subtitle="Keep your account safe" icon={ShieldCheck} />
          <div className="divide-y divide-ink-100 dark:divide-ink-700">
            <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-start gap-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-genie-blue dark:bg-brand-500/15">
                  <KeyRound size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink-800 dark:text-white">Change password</p>
                  <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">
                    Update the password you use to sign in.
                  </p>
                </div>
              </div>
              <Button variant="secondary" onClick={() => setPasswordOpen(true)}>
                Change password
              </Button>
            </div>

            <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-start gap-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-500 dark:bg-red-500/10">
                  <MonitorSmartphone size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink-800 dark:text-white">Logout from all devices</p>
                  <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">
                    End every active session, including this one.
                  </p>
                </div>
              </div>
              <Button variant="danger" icon={LogOut} onClick={() => setLogoutOpen(true)}>
                Logout everywhere
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Change password modal */}
      <Modal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        title="Change Password"
        subtitle="Choose a strong password you don't use elsewhere."
        footer={
          <>
            <Button variant="secondary" onClick={() => setPasswordOpen(false)}>
              Cancel
            </Button>
            <Button onClick={changePasswordSubmit}>Update password</Button>
          </>
        }
      >
        <form className="grid gap-4" onSubmit={changePasswordSubmit} noValidate>
          <Input
            label="Current Password"
            type="password"
            autoComplete="current-password"
            placeholder="Your current password"
            value={passwords.current}
            onChange={(event) => setPasswords({ ...passwords, current: event.target.value })}
            required
          />
          <Input
            label="New Password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={passwords.next}
            onChange={(event) => setPasswords({ ...passwords, next: event.target.value })}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat the new password"
            value={passwords.confirm}
            onChange={(event) => setPasswords({ ...passwords, confirm: event.target.value })}
            error={passwordError}
            required
          />
          <button type="submit" className="hidden" />
        </form>
      </Modal>

      {/* Logout modal */}
      <Modal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Logout from all devices?"
        subtitle="You will need to sign in again on every device."
        footer={
          <>
            <Button variant="secondary" onClick={() => setLogoutOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" icon={LogOut} onClick={logoutAll}>
              Yes, logout
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300">
          Any unsaved work in open tabs will be lost. Your generated code stays safe in your
          account history.
        </p>
      </Modal>
    </div>
  );
}
