/**
 * ------------------------------------------------------------------
 * Code Genie — AI service layer
 * ------------------------------------------------------------------
 * Every AI feature goes through this module so the UI never needs to
 * know which provider is behind it.
 *
 * Configuration (see .env.example):
 *   VITE_AI_API_BASE_URL  -> your backend/proxy that talks to the AI
 *                            provider. Leave empty to run in demo mode.
 *   VITE_AI_API_KEY       -> optional public "client" token issued by
 *                            YOUR backend. Never put a real provider
 *                            secret here: anything in VITE_* is baked
 *                            into the browser bundle and is public.
 *
 * When no base URL is configured the service returns realistic demo
 * responses after a short delay, so the product is fully explorable.
 *
 * When a base URL IS configured but the AI request fails (backend down,
 * missing GEMINI_API_KEY, provider error, timeout), the service falls
 * back to the same demo responses with `source: 'demo-fallback'` so the
 * UI keeps working. Auth errors (401/403) are never swallowed — they
 * are re-thrown so the user is sent back to login.
 */

import { demoCode, demoExplanation, demoProject } from './demoData.js';
import { authHeaders } from './auth.js';
import { wait } from '../utils/helpers.js';

const API_BASE = (import.meta.env.VITE_AI_API_BASE_URL || '').replace(/\/$/, '');
const MODEL = import.meta.env.VITE_AI_MODEL || 'code-genie-default';

export const LOADING_MESSAGES = {
  generate: 'Generating your code...',
  explain: 'Analyzing your code...',
  voice: 'Converting speech to code...',
  ocr: 'Processing image...',
  project: 'Creating your project...',
};

export const isDemoMode = !API_BASE;

export function isFallback(response) {
  return response?.source === 'demo-fallback';
}

/** Success toast normally, info toast when a demo fallback filled in. */
export function notifyResult(toast, response, successMessage) {
  if (isFallback(response)) {
    toast.info('AI service is unavailable — showing a demo response instead.');
  } else {
    toast.success(successMessage);
  }
}

/** Resolve the demo fallback and tag it so the UI can tell it apart. */
function useFallback(fallback) {
  const result = typeof fallback === 'function' ? fallback() : fallback;
  if (result && typeof result === 'object') return { ...result, source: 'demo-fallback' };
  return result;
}

/**
 * Low level transport. Add auth headers, retries, timeouts, etc. here.
 * @param {string} path e.g. "/generate-code"
 * @param {object} payload
 */
async function callAI(path, payload, fallback) {
  if (!API_BASE) {
    await wait(1100 + Math.random() * 700);
    return typeof fallback === 'function' ? fallback() : fallback;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        'X-Client': 'code-genie-web',
      },
      body: JSON.stringify({ model: MODEL, ...payload }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      const message = `AI request failed (${response.status})${detail ? `: ${detail.slice(0, 200)}` : ''}`;
      if (response.status === 401 || response.status === 403) {
        // Auth problems must surface (re-login), never silently demo.
        const authError = new Error(detail || 'Session expired. Please log in again.');
        authError.code = 'AUTH';
        throw authError;
      }
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') return useFallback(fallback);
    if (error.code === 'AUTH') throw error;
    // AI service failed (down, no key, provider error) -> demo response.
    return useFallback(fallback);
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Generate source code from a natural-language requirement.
 * @returns {Promise<{code:string, language:string, explanation?:string}>}
 */
export function generateCode({ language, requirement }) {
  if (!requirement?.trim()) {
    return Promise.reject(new Error('Please describe what you want to build.'));
  }
  return callAI('/generate-code', { language, requirement }, () => ({
    code: demoCode(language, requirement),
    language,
    explanation: `Generated a ${language} solution for: "${requirement.trim()}"`,
    source: isDemoMode ? 'demo' : 'live',
  }));
}

/**
 * Explain pasted source code in beginner-friendly language.
 * @returns {Promise<{summary:string, steps:Array, functions:Array, io:object, improvements:Array}>}
 */
export function explainCode({ language, code }) {
  if (!code?.trim()) {
    return Promise.reject(new Error('Please paste some code to explain.'));
  }
  return callAI('/explain-code', { language, code }, () => ({
    ...demoExplanation(language, code),
    source: isDemoMode ? 'demo' : 'live',
  }));
}

/**
 * Convert a voice transcript (already transcribed by the browser)
 * into runnable code.
 */
export function generateFromVoice({ transcript, language }) {
  if (!transcript?.trim()) {
    return Promise.reject(new Error('No transcript available. Record your voice first.'));
  }
  return callAI('/voice-to-code', { transcript, language }, () => ({
    code: demoCode(language, transcript),
    language,
    transcript,
    source: isDemoMode ? 'demo' : 'live',
  }));
}

/**
 * OCR: extract editable source code from a handwritten image.
 * The image is sent as a base64 data URL to your backend.
 */
export function extractCodeFromImage({ imageDataUrl, language = 'Auto detect', fileName = 'image.png' }) {
  if (!imageDataUrl) {
    return Promise.reject(new Error('Please upload an image first.'));
  }
  return callAI('/extract-code', { image: imageDataUrl, language, fileName }, () => ({
    code: demoCode(language === 'Auto detect' ? 'Python' : language, 'handwritten notes calculator'),
    language: language === 'Auto detect' ? 'Python' : language,
    confidence: 0.94,
    source: isDemoMode ? 'demo' : 'live',
  }));
}

/**
 * Generate a full project structure + starter files.
 */
export function generateProject({ projectType, projectName, technology, description, features }) {
  if (!projectName?.trim()) {
    return Promise.reject(new Error('Please give your project a name.'));
  }
  return callAI(
    '/generate-project',
    { projectType, projectName, technology, description, features },
    () => ({
      ...demoProject({ projectType, projectName, technology, description, features }),
      source: isDemoMode ? 'demo' : 'live',
    })
  );
}

export default {
  generateCode,
  explainCode,
  generateFromVoice,
  extractCodeFromImage,
  generateProject,
  LOADING_MESSAGES,
  isDemoMode,
};
