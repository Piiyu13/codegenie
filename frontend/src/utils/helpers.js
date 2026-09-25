/**
 * Small shared client helpers — clipboard, downloads and formatting.
 */

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.focus();
    area.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

export function downloadText(filename, content, mime = 'text/plain') {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function formatDuration(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
}

export function formatBytes(bytes) {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const LANGUAGES = [
  'Python',
  'JavaScript',
  'Java',
  'C',
  'C++',
  'C#',
  'HTML',
  'CSS',
  'SQL',
  'PHP',
];

export const VOICE_LANGUAGES = ['Python', 'Java', 'JavaScript', 'HTML', 'CSS', 'C++', 'C#'];

export const FILE_EXTENSIONS = {
  Python: 'py',
  JavaScript: 'js',
  Java: 'java',
  C: 'c',
  'C++': 'cpp',
  'C#': 'cs',
  HTML: 'html',
  CSS: 'css',
  SQL: 'sql',
  PHP: 'php',
};
