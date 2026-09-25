import { useState } from 'react';
import {
  Check,
  ClipboardPaste,
  Download,
  FileCode2,
  ScanLine,
  Trash2,
  Upload,
} from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Card, { CardHeader } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Select from '../components/ui/Select.jsx';
import CodeEditor from '../components/ui/CodeEditor.jsx';
import FileUploader from '../components/ui/FileUploader.jsx';
import { extractCodeFromImage, LOADING_MESSAGES, notifyResult } from '../services/ai.js';
import { LANGUAGES, copyText, downloadText } from '../utils/helpers.js';
import { useToast } from '../context/ToastContext.jsx';

const LANGUAGE_OPTIONS = ['Auto detect', ...LANGUAGES];

export default function HandwrittenOCR() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [language, setLanguage] = useState('Auto detect');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [confidence, setConfidence] = useState(null);
  const toast = useToast();

  const handleFile = (nextFile, dataUrl) => {
    setFile(nextFile);
    setPreview(dataUrl);
    setCode('');
    setConfidence(null);
    setError('');
    toast.info('Image uploaded. Hit Extract Code to continue.');
  };

  const handleClear = () => {
    setFile(null);
    setPreview('');
    setCode('');
    setConfidence(null);
    setError('');
  };

  const handleExtract = async () => {
    if (!file || !preview) {
      setError('Upload an image first.');
      toast.error('Please upload a handwritten code image.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await extractCodeFromImage({
        imageDataUrl: preview,
        language,
        fileName: file.name,
      });
      setCode(response.code);
      setConfidence(response.confidence ?? null);
      notifyResult(toast, response, 'Code extracted from your image!');
    } catch (err) {
      setError(err.message || 'We could not read that image.');
      toast.error(err.message || 'Extraction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const ok = await copyText(code);
    toast[ok ? 'success' : 'error'](ok ? 'Extracted code copied.' : 'Could not copy the code.');
  };

  const handleDownload = () => {
    downloadText('extracted-code.txt', code);
    toast.success('Downloaded extracted-code.txt');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Handwritten OCR"
        subtitle="Upload your handwritten code and convert it into editable code."
        icon={ScanLine}
        actions={
          code ? (
            <Button variant="secondary" icon={Trash2} onClick={handleClear}>
              Clear
            </Button>
          ) : null
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload */}
        <Card className="overflow-hidden">
          <CardHeader title="Upload Image" subtitle="PNG, JPG or JPEG · max 8 MB" icon={Upload} />
          <div className="p-5 sm:p-6">
            <FileUploader file={file} previewUrl={preview} onFile={handleFile} onRemove={handleClear} />

            <div className="mt-5">
              <Select
                label="Recognition Language"
                hint="Auto detect works best for most notes."
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                options={LANGUAGE_OPTIONS}
              />
            </div>

            {error ? (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                {error}
              </p>
            ) : null}

            <Button
              className="mt-5"
              fullWidth
              size="lg"
              icon={ScanLine}
              loading={loading}
              onClick={handleExtract}
            >
              {loading ? LOADING_MESSAGES.ocr : 'Extract Code'}
            </Button>

            {loading ? (
              <div className="mt-4 space-y-2.5" aria-hidden="true">
                <div className="h-3 w-full animate-pulse rounded bg-ink-100 dark:bg-ink-700" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-ink-100 dark:bg-ink-700" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-ink-100 dark:bg-ink-700" />
              </div>
            ) : null}
          </div>
        </Card>

        {/* Extracted code */}
        <Card className="overflow-hidden">
          <CardHeader
            title="Extracted Code"
            subtitle={
              confidence
                ? `Recognition confidence: ${Math.round(confidence * 100)}%`
                : 'Your extracted code will appear here.'
            }
            icon={FileCode2}
            action={
              code ? (
                <span className="hidden rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-600 sm:inline dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                  Extracted
                </span>
              ) : null
            }
          />

          <div className="p-5 sm:p-6">
            {code ? (
              <>
                <CodeEditor
                  code={code}
                  language={language === 'Auto detect' ? 'Python' : language}
                  title="extracted-output"
                  emptyMessage="Your extracted code will appear here."
                />

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button variant="secondary" icon={Check} onClick={handleCopy}>
                    Copy Code
                  </Button>
                  <Button variant="secondary" icon={Download} onClick={handleDownload}>
                    Download Code
                  </Button>
                  <Button variant="ghost" icon={Trash2} onClick={handleClear}>
                    Clear
                  </Button>
                </div>
              </>
            ) : (
              <div className="grid min-h-[280px] place-items-center rounded-2xl border border-dashed border-ink-300 bg-ink-50/60 p-8 text-center dark:border-ink-700 dark:bg-ink-900/50">
                <div>
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-ink-300 shadow-soft dark:bg-ink-800 dark:text-ink-600">
                    <ClipboardPaste size={24} />
                  </span>
                  <p className="mt-4 text-sm font-semibold text-ink-500 dark:text-ink-400">
                    Your extracted code will appear here.
                  </p>
                  <p className="mx-auto mt-1.5 max-w-xs text-xs leading-relaxed text-ink-400">
                    Upload a photo of handwritten code on the left, then press{' '}
                    <span className="font-semibold text-genie-blue">Extract Code</span>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Tips */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { title: 'Good lighting', text: 'Avoid shadows across the page for cleaner recognition.' },
          { title: 'Flat surface', text: 'Place the notebook on a table and shoot straight down.' },
          { title: 'Clear handwriting', text: 'Leave space between lines and avoid heavy strike-throughs.' },
        ].map((tip) => (
          <div key={tip.title} className="surface p-4 sm:p-5">
            <p className="text-sm font-bold text-genie-navy dark:text-white">{tip.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-500 dark:text-ink-400">{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
