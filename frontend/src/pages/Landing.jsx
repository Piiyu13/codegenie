import { ArrowRight, Check, Mic, ScanLine, Sparkles, Wand2, Braces, FolderTree, BookOpenText, Star } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Button from '../components/ui/Button.jsx';
import FeatureCard from '../components/ui/FeatureCard.jsx';
import CodeEditor from '../components/ui/CodeEditor.jsx';

const FEATURES = [
  {
    icon: Wand2,
    title: 'AI Code Generator',
    description: 'Generate code from natural-language requirements in 10+ languages, ready to copy and run.',
    to: '/code-generator',
  },
  {
    icon: BookOpenText,
    title: 'Code Explanation',
    description: 'Understand complex code with simple, beginner-friendly step-by-step explanations.',
    to: '/code-explanation',
  },
  {
    icon: Mic,
    title: 'Voice to Code',
    description: 'Speak your idea out loud and watch it turn into structured, working code.',
    to: '/voice-to-code',
  },
  {
    icon: ScanLine,
    title: 'Handwritten OCR',
    description: 'Extract editable source code from handwritten notes, whiteboards or photos.',
    to: '/handwritten-ocr',
  },
  {
    icon: FolderTree,
    title: 'Project Generator',
    description: 'Generate complete project structures with folders, config files and docs.',
    to: '/project-generator',
  },
];

const STEPS = [
  {
    title: 'Describe your idea',
    text: 'Type a requirement, paste some code, upload a sketch — or simply say it out loud.',
  },
  {
    title: 'Let AI generate the solution',
    text: 'Code Genie writes clean, structured code in seconds, in the language you choose.',
  },
  {
    title: 'Review and understand the result',
    text: 'Get a plain-English breakdown, key functions, and improvement tips next to your code.',
  },
  {
    title: 'Build your project',
    text: 'Copy, download, or scaffold an entire project structure and start shipping.',
  },
];

const HERO_CODE = `from genie import CodeGenie

genie = CodeGenie(model="codegenie-v2")
idea = "Build a task manager REST API"

code = genie.generate(idea, language="Python")
print(code.explain())`;

const ABOUT_STATS = [
  { value: '12k+', label: 'Developers' },
  { value: '4.2M', label: 'Lines generated' },
  { value: '10+', label: 'Languages' },
  { value: '4.9/5', label: 'Average rating' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-genie-off dark:bg-ink-900">
      <Navbar />

      {/* ------------------------------ HERO ------------------------------ */}
      <section id="top" className="relative overflow-hidden pt-[74px]">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-32 -top-20 h-[420px] w-[420px] rounded-full bg-brand-200/40 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-40 top-40 h-[320px] w-[320px] rounded-full bg-genie-blue/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="page-shell relative grid items-center gap-14 py-16 lg:grid-cols-2 lg:gap-10 lg:py-24">
          <div className="animate-fade-up text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-genie-blue shadow-soft dark:border-brand-400/30 dark:bg-ink-800 dark:text-brand-300">
              <Sparkles size={13} />
              AI-Powered Developer Assistant
            </span>

            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-genie-navy sm:text-5xl lg:text-6xl dark:text-white">
              Turn Your Ideas{' '}
              <span className="relative whitespace-nowrap text-genie-blue">
                Into Code
                <svg
                  className="absolute -bottom-2 left-0 h-3 w-full text-brand-200"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8c40-6 90-6 196-3"
                    stroke="currentColor"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-xl text-balance text-base leading-relaxed text-ink-500 sm:text-lg dark:text-ink-400 lg:mx-0">
              Your AI-powered coding assistant for generating, explaining, and transforming code
              faster — from a sentence, a sketch, or your voice.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3.5 sm:flex-row sm:justify-center lg:justify-start">
              <Button to="/signup" size="lg" trailingIcon={ArrowRight}>
                Get Started
              </Button>
              <Button href="#features" size="lg" variant="secondary">
                Explore Features
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-ink-500 dark:text-ink-400 lg:justify-start">
              <span className="inline-flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check size={12} />
                </span>
                No credit card required
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check size={12} />
                </span>
                100 free AI credits
              </span>
              <span className="inline-flex items-center gap-1 text-amber-400">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
                <span className="ml-1 font-semibold text-ink-600 dark:text-ink-300">4.9/5</span>
              </span>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative animate-fade-up lg:pl-6" style={{ animationDelay: '120ms' }}>
            <div
              className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-brand-200/50 via-transparent to-genie-blue/10 blur-xl"
              aria-hidden="true"
            />

            <div className="relative overflow-hidden rounded-2xl border border-ink-200/80 bg-white shadow-lift dark:border-ink-700 dark:bg-ink-800">
              <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3 dark:border-ink-700">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-400">
                  genie.py
                </span>
              </div>
              <div className="p-2.5">
                <CodeEditor code={HERO_CODE} language="Python" title="Code Genie" actions={false} maxHeight="17rem" />
              </div>
            </div>

            {/* Floating card: generation time */}
            <div className="absolute -right-3 -top-6 hidden animate-bounce-slow rounded-xl border border-ink-200 bg-white px-4 py-3 shadow-lift sm:flex sm:items-center sm:gap-3 dark:border-ink-700 dark:bg-ink-800">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-500">
                <Check size={17} />
              </span>
              <span className="text-left">
                <span className="block text-xs font-bold text-genie-navy dark:text-white">Generated in 1.2s</span>
                <span className="block text-[11px] text-ink-400">42 lines · Python</span>
              </span>
            </div>

            {/* Floating card: voice */}
            <div className="absolute -bottom-7 -left-2 hidden animate-bounce-slow rounded-xl border border-ink-200 bg-white px-4 py-3 shadow-lift sm:flex sm:items-center sm:gap-3 dark:border-ink-700 dark:bg-ink-800" style={{ animationDelay: '1.4s' }}>
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-genie-blue dark:bg-brand-500/15">
                <Mic size={16} />
              </span>
              <span className="text-left">
                <span className="block text-xs font-bold text-genie-navy dark:text-white">Voice to Code</span>
                <span className="block text-[11px] text-ink-400">Listening…</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------- FEATURES ---------------------------- */}
      <section id="features" className="scroll-mt-24 py-16 sm:py-20">
        <div className="page-shell">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-genie-blue">Features</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Everything you need to ship faster
            </h2>
            <p className="mt-4 text-ink-500 dark:text-ink-400">
              Five focused AI tools that cover the full developer workflow — from a blank page to a
              complete project.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}

            <div className="flex flex-col justify-between rounded-2xl bg-genie-navy p-6 text-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
              <div>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-brand-300">
                  <Braces size={22} />
                </span>
                <h3 className="mt-5 text-lg font-bold">Built for real workflows</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  Reusable services, clean architecture and an AI-ready API layer — Code Genie is
                  designed to grow with your product.
                </p>
              </div>
              <Button to="/dashboard" variant="ghost-light" className="mt-6 self-start" trailingIcon={ArrowRight}>
                Open Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------- HOW IT WORKS -------------------------- */}
      <section id="how" className="scroll-mt-24 border-y border-ink-200/70 bg-white py-16 sm:py-20 dark:border-ink-700 dark:bg-ink-950/40">
        <div className="page-shell">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-genie-blue">How it works</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              How Code Genie Works
            </h2>
            <p className="mt-4 text-ink-500 dark:text-ink-400">
              From idea to working code in four simple steps.
            </p>
          </div>

          <div className="relative mt-14">
            <div
              className="pointer-events-none absolute left-0 right-0 top-7 hidden border-t-2 border-dashed border-brand-200 lg:block"
              aria-hidden="true"
            />
            <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, index) => (
                <li key={step.title} className="relative">
                  <div className="flex items-center gap-4">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-genie-blue font-display text-xl font-extrabold text-white shadow-glow">
                      {index + 1}
                    </span>
                    {index < STEPS.length - 1 ? (
                      <span className="h-px flex-1 bg-brand-100 lg:hidden" aria-hidden="true" />
                    ) : null}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-genie-navy dark:text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-400">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ------------------------------ ABOUT ------------------------------ */}
      <section id="about" className="scroll-mt-24 py-16 sm:py-20">
        <div className="page-shell grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-genie-blue">About</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              A professional workspace for modern developers
            </h2>
            <p className="mt-4 leading-relaxed text-ink-500 dark:text-ink-400">
              Code Genie combines five AI tools into one calm, focused interface. Whether you are
              learning your first language or shipping a production service, it helps you move from
              intention to implementation without breaking your flow.
            </p>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                'Clean, reusable components',
                'Responsive on every device',
                'Loading, empty & error states',
                'AI-ready service layer',
                'Accessible, labelled forms',
                'Toast notifications built in',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm font-medium text-ink-700 dark:text-ink-200">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-genie-blue/10 text-genie-blue dark:bg-brand-500/20 dark:text-brand-300">
                    <Check size={12} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {ABOUT_STATS.map((stat) => (
              <div
                key={stat.label}
                className="surface p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <p className="font-display text-3xl font-extrabold text-genie-blue">{stat.value}</p>
                <p className="mt-1.5 text-sm font-semibold text-ink-500 dark:text-ink-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------- CTA ------------------------------- */}
      <section id="cta" className="scroll-mt-24 pb-20">
        <div className="page-shell">
          <div className="relative overflow-hidden rounded-3xl bg-genie-navy px-6 py-14 text-center shadow-lift sm:px-12 sm:py-16">
            <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-genie-blue/30 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-brand-300">
                <Sparkles size={26} />
              </span>
              <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Ready to turn your ideas into code?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/70">
                Join thousands of developers using Code Genie to generate, understand and ship code
                faster.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button to="/signup" size="lg" trailingIcon={ArrowRight}>
                  Start Coding
                </Button>
                <Button to="/login" size="lg" variant="ghost-light">
                  I already have an account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
