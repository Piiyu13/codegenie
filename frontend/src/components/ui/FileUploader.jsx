import { useRef, useState } from 'react';
import { ImageUp, UploadCloud, X, FileImage } from 'lucide-react';
import { formatBytes } from '../../utils/helpers.js';

const ACCEPTED = ['image/png', 'image/jpeg', 'image/jpg'];
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB

/**
 * Drag & drop / click-to-upload image picker with preview + validation.
 * onFile(file, dataUrl) is called with a base64 data URL for AI requests.
 */
export default function FileUploader({
  file,
  previewUrl,
  onFile,
  onRemove,
  hint = 'PNG, JPG or JPEG — up to 8 MB',
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const validate = (candidate) => {
    if (!candidate) return;
    if (!ACCEPTED.includes(candidate.type)) {
      setError('Unsupported format. Please use PNG, JPG or JPEG.');
      return;
    }
    if (candidate.size > MAX_SIZE) {
      setError('File is too large. Maximum size is 8 MB.');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = () => onFile?.(candidate, reader.result);
    reader.onerror = () => setError('Could not read that file. Please try another one.');
    reader.readAsDataURL(candidate);
  };

  const handleChange = (event) => {
    validate(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    validate(event.dataTransfer.files?.[0]);
  };

  if (file && previewUrl) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-3 dark:border-ink-700 dark:bg-ink-900">
        <div className="relative overflow-hidden rounded-xl bg-ink-50 dark:bg-ink-950">
          <img src={previewUrl} alt="Uploaded handwritten code" className="max-h-80 w-full object-contain" />
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            aria-label="Remove image"
            className="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 text-ink-600 shadow-soft transition hover:bg-white hover:text-red-500 disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 px-1 pb-1">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-genie-blue dark:bg-brand-500/15">
              <FileImage size={16} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-700 dark:text-ink-200">{file.name}</p>
              <p className="text-xs text-ink-400">{formatBytes(file.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="shrink-0 text-xs font-semibold text-genie-blue hover:underline disabled:opacity-50"
          >
            Replace
          </button>
        </div>

        <input ref={inputRef} type="file" accept={ACCEPTED.join(',')} onChange={handleChange} className="hidden" />
        {error ? <p className="mt-1 px-1 text-xs font-medium text-red-500">{error}</p> : null}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        disabled={disabled}
        className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all duration-300
          ${
            dragging
              ? 'border-genie-blue bg-brand-50 scale-[1.01]'
              : 'border-ink-200 bg-white hover:border-brand-300 hover:bg-brand-50/50'
          }
          dark:border-ink-700 dark:bg-ink-900/60 dark:hover:border-brand-400/50 dark:hover:bg-ink-800
          disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-genie-blue transition-transform duration-300 group-hover:scale-105 dark:bg-brand-500/15">
          {dragging ? <ImageUp size={28} /> : <UploadCloud size={28} />}
        </span>
        <p className="mt-4 text-sm font-bold text-genie-navy dark:text-white sm:text-base">
          {dragging ? 'Drop it right here' : 'Click to upload image'}
        </p>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">or drag and drop image here</p>
        <p className="mt-4 rounded-full border border-ink-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-400 dark:border-ink-700 dark:bg-ink-800">
          {hint}
        </p>
      </button>

      <input ref={inputRef} type="file" accept={ACCEPTED.join(',')} onChange={handleChange} className="hidden" />
      {error ? <p className="mt-2 text-xs font-medium text-red-500">{error}</p> : null}
    </div>
  );
}
