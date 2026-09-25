import { useState } from 'react';
import JSZip from 'jszip';
import {
  Check,
  Download,
  FileCode2,
  FolderTree,
  Package,
  Play,
  ScrollText,
  Sparkles,
} from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Card, { CardHeader } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import CodeEditor from '../components/ui/CodeEditor.jsx';
import Modal from '../components/ui/Modal.jsx';
import { generateProject, LOADING_MESSAGES, notifyResult } from '../services/ai.js';
import { copyText } from '../utils/helpers.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const PROJECT_TYPES = [
  'Web Application',
  'Mobile Application',
  'AI Project',
  'Python Project',
  'React Project',
  'Java Project',
  'Other',
];

const EMPTY_FORM = {
  projectType: 'Web Application',
  projectName: '',
  technology: 'React + Vite + Tailwind CSS',
  description: '',
  features: '',
};

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ProjectGenerator() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [result, setResult] = useState(null);
  const [activeFile, setActiveFile] = useState(null);

  const { bumpStat } = useAuth();
  const toast = useToast();

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    if (error) setError('');
  };

  const handleGenerate = async (event) => {
    event?.preventDefault?.();

    if (!form.projectName.trim()) {
      setError('Give your project a name to continue.');
      toast.error('Please enter a project name.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await generateProject(form);
      setResult(response);
      bumpStat('projects');
      notifyResult(toast, response, 'Project structure generated!');
    } catch (err) {
      setError(err.message || 'We could not generate that project.');
      toast.error(err.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyStructure = async () => {
    if (!result) return;
    const ok = await copyText(result.structure);
    toast[ok ? 'success' : 'error'](ok ? 'Project structure copied.' : 'Could not copy the structure.');
  };

  const handleDownloadProject = async () => {
    if (!result) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      const root = result.slug || 'project';
      result.files.forEach((file) => zip.file(`${root}/${file.path}`, file.content));
      zip.file(`${root}/PROJECT_STRUCTURE.txt`, result.structure);

      const blob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(blob, `${root}.zip`);
      toast.success('Project bundle downloaded.');
    } catch {
      toast.error('Could not create the zip file.');
    } finally {
      setZipping(false);
    }
  };

  const folderCount = result ? (result.structure.match(/└──|├──/g) || []).length : 0;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Project Generator"
        subtitle="Generate complete projects with AI."
        icon={FolderTree}
        actions={
          result ? (
            <Button variant="secondary" icon={Download} loading={zipping} onClick={handleDownloadProject}>
              Download Project
            </Button>
          ) : null
        }
      />

      {/* Form */}
      <Card className="overflow-hidden">
        <CardHeader title="Project Details" subtitle="Tell Code Genie what you want to build" icon={Sparkles} />
        <form className="grid gap-5 p-5 sm:p-6" onSubmit={handleGenerate} noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="Project Type"
              value={form.projectType}
              onChange={update('projectType')}
              options={PROJECT_TYPES}
            />
            <Input
              label="Project Name"
              placeholder="e.g. Student Management System"
              value={form.projectName}
              onChange={update('projectName')}
              error={error}
              required
            />
          </div>

          <Input
            label="Technology / Framework"
            placeholder="e.g. React, Node.js, Tailwind CSS, MongoDB"
            value={form.technology}
            onChange={update('technology')}
          />

          <Textarea
            label="Project Description"
            rows={3}
            placeholder="Describe your project in a few sentences…"
            value={form.description}
            onChange={update('description')}
            hint="What problem does it solve and who is it for?"
          />

          <Textarea
            label="Features"
            rows={4}
            placeholder={"One feature per line, e.g.\nUser authentication\nDashboard with charts\nREST API backend"}
            value={form.features}
            onChange={update('features')}
            hint="Each line becomes a module in the generated structure."
          />

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" icon={Play} loading={loading} size="lg">
              {loading ? LOADING_MESSAGES.project : 'Generate Project'}
            </Button>
            <Button variant="ghost" onClick={() => { setForm(EMPTY_FORM); setResult(null); setError(''); }}>
              Reset
            </Button>
          </div>
        </form>
      </Card>

      {/* Result */}
      <section className="mt-6" aria-live="polite">
        {loading ? (
          <div className="surface p-6">
            <div className="h-4 w-1/4 animate-pulse rounded bg-ink-100 dark:bg-ink-700" />
            <div className="mt-4 space-y-2.5">
              {[90, 75, 60, 80, 50].map((width) => (
                <div
                  key={width}
                  className="h-3 animate-pulse rounded bg-ink-100 dark:bg-ink-700"
                  style={{ width: `${width}%` }}
                />
              ))}
            </div>
            <p className="mt-4 text-sm font-semibold text-genie-blue">{LOADING_MESSAGES.project}</p>
          </div>
        ) : result ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Structure */}
            <div className="lg:col-span-2">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-genie-navy text-white">
                    <FolderTree size={16} />
                  </span>
                  <h2 className="text-lg font-extrabold text-genie-navy dark:text-white">
                    Project Structure
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <Button size="sm" variant="secondary" icon={Check} onClick={handleCopyStructure}>
                    Copy Structure
                  </Button>
                  <Button size="sm" variant="secondary" icon={Download} loading={zipping} onClick={handleDownloadProject}>
                    Download Project
                  </Button>
                </div>
              </div>

              <CodeEditor
                code={result.structure}
                language="Text"
                title={`${result.slug}/`}
                actions={false}
                maxHeight="30rem"
              />

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="surface flex items-center gap-3 p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-genie-blue dark:bg-brand-500/15">
                    <Package size={18} />
                  </span>
                  <span>
                    <span className="block text-lg font-extrabold text-genie-navy dark:text-white">
                      {result.files.length}
                    </span>
                    <span className="block text-xs text-ink-400">Files generated</span>
                  </span>
                </div>
                <div className="surface flex items-center gap-3 p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-500 dark:bg-emerald-500/15">
                    <FolderTree size={18} />
                  </span>
                  <span>
                    <span className="block text-lg font-extrabold text-genie-navy dark:text-white">
                      {folderCount}
                    </span>
                    <span className="block text-xs text-ink-400">Tree entries</span>
                  </span>
                </div>
                <div className="surface flex items-center gap-3 p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-500/15">
                    <ScrollText size={18} />
                  </span>
                  <span>
                    <span className="block text-lg font-extrabold text-genie-navy dark:text-white">
                      {form.projectType.split(' ')[0]}
                    </span>
                    <span className="block text-xs text-ink-400">Project type</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Generated files */}
            <Card className="overflow-hidden">
              <CardHeader title="Key Files" subtitle="Click to preview the source" icon={FileCode2} />
              <ul className="divide-y divide-ink-100 dark:divide-ink-700">
                {result.files.map((file) => (
                  <li key={file.path}>
                    <button
                      type="button"
                      onClick={() => setActiveFile(file)}
                      className="group flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-brand-50/60 dark:hover:bg-ink-700/50"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-500 transition group-hover:bg-genie-blue group-hover:text-white dark:bg-ink-700 dark:text-ink-300">
                        <FileCode2 size={16} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink-700 dark:text-ink-200">
                          {file.path}
                        </span>
                        <span className="block text-[11px] uppercase tracking-wide text-ink-400">
                          {file.language}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        ) : (
          <div className="grid place-items-center rounded-2xl border border-dashed border-ink-300 bg-white/60 px-6 py-14 text-center dark:border-ink-700 dark:bg-ink-800/40">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-genie-blue dark:bg-brand-500/15">
              <FolderTree size={26} />
            </span>
            <p className="mt-4 text-sm font-semibold text-ink-500 dark:text-ink-400">
              Your project structure will appear here.
            </p>
            <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-ink-400">
              Fill in the details above and press{' '}
              <span className="font-semibold text-genie-blue">Generate Project</span> to scaffold
              folders, config files and starter code.
            </p>
          </div>
        )}
      </section>

      {/* File preview */}
      <Modal
        open={Boolean(activeFile)}
        onClose={() => setActiveFile(null)}
        title={activeFile?.path}
        subtitle={activeFile ? `${activeFile.language} · generated by Code Genie` : ''}
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setActiveFile(null)}>
            Close
          </Button>
        }
      >
        <CodeEditor
          code={activeFile?.content || ''}
          language={activeFile?.language === 'Markdown' ? 'Text' : activeFile?.language}
          title={activeFile?.path}
          maxHeight="50vh"
        />
      </Modal>
    </div>
  );
}
