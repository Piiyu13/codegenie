import { Compass, Home } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import Button from '../components/ui/Button.jsx';

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-genie-off px-6 py-16 text-center dark:bg-ink-900">
      <div className="animate-fade-up">
        <Logo size="md" className="justify-center" />

        <p className="mt-10 font-display text-7xl font-extrabold text-genie-blue sm:text-8xl">404</p>
        <h1 className="mt-4 text-2xl font-extrabold text-genie-navy dark:text-white sm:text-3xl">
          This page floated away
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-500 dark:text-ink-400">
          The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back
          to building.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button to="/" icon={Home}>
            Back to Home
          </Button>
          <Button to="/dashboard" variant="secondary" icon={Compass}>
            Open Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
