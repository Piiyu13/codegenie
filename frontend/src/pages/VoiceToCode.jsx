import { useCallback, useEffect, useRef, useState } from 'react';
import { AudioLines, CheckCircle2, Clock3, FileCode2, Mic, Radio, Wand2 } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Card, { CardHeader } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Select from '../components/ui/Select.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import MicrophoneButton from '../components/ui/MicrophoneButton.jsx';
import CodeEditor from '../components/ui/CodeEditor.jsx';
import { generateFromVoice, LOADING_MESSAGES, notifyResult } from '../services/ai.js';
import { VOICE_LANGUAGES, formatDuration } from '../utils/helpers.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const DEMO_TRANSCRIPT =
  'Create a Python function that takes a list of numbers and returns the average of the even numbers.';

const STATUS_META = {
  idle: { label: 'Ready to record', tone: 'bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300', dot: 'bg-ink-400' },
  recording: { label: 'Recording…', tone: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300', dot: 'bg-red-500 animate-pulse' },
  processing: { label: 'Converting…', tone: 'bg-brand-50 text-genie-blue dark:bg-brand-500/15 dark:text-brand-300', dot: 'bg-genie-blue animate-pulse' },
  done: { label: 'Code ready', tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300', dot: 'bg-emerald-500' },
};

export default function VoiceToCode() {
  const [status, setStatus] = useState('idle');
  const [seconds, setSeconds] = useState(0);
  const [language, setLanguage] = useState('Python');
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const recognitionRef = useRef(null);
  const simulationRef = useRef(null);
  const timerRef = useRef(null);
  const fallbackRef = useRef(false);
  const transcriptRef = useRef('');
  const recordingRef = useRef(false);

  const { bumpStat } = useAuth();
  const toast = useToast();

  transcriptRef.current = transcript || interim;

  const clearSimulation = useCallback(() => {
    if (simulationRef.current) {
      clearInterval(simulationRef.current);
      simulationRef.current = null;
    }
  }, []);

  const startSimulation = useCallback(() => {
    if (fallbackRef.current) return;
    fallbackRef.current = true;
    clearSimulation();
    const words = DEMO_TRANSCRIPT.split(' ');
    let index = 0;
    simulationRef.current = setInterval(() => {
      index += 1;
      setInterim(words.slice(0, index).join(' '));
      if (index >= words.length) {
        clearInterval(simulationRef.current);
        simulationRef.current = null;
        setTranscript(DEMO_TRANSCRIPT);
        setInterim('');
      }
    }, 300);
  }, [clearSimulation]);

  const handleStart = () => {
    setStatus('recording');
    recordingRef.current = true;
    setSeconds(0);
    setTranscript('');
    setInterim('');
    setCode('');
    setError('');
    fallbackRef.current = false;

    const SpeechRecognition =
      typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          if (fallbackRef.current) return;
          let finalText = '';
          let interimText = '';
          for (let i = event.resultIndex; i < event.results.length; i += 1) {
            const chunk = event.results[i][0].transcript;
            if (event.results[i].isFinal) finalText += chunk;
            else interimText += chunk;
          }
          if (finalText) setTranscript((current) => `${current} ${finalText}`.trim());
          if (interimText) setInterim(interimText);
        };

        recognition.onerror = () => startSimulation();
        recognition.onend = () => {
          // Keep the transcript if the engine closes on its own.
          if (!fallbackRef.current) setInterim('');
        };

        recognition.start();
        recognitionRef.current = recognition;

        // If nothing arrives quickly (offline / unsupported language), fall back.
        setTimeout(() => {
          if (recordingRef.current && !transcriptRef.current && !fallbackRef.current) {
            startSimulation();
          }
        }, 2500);
      } catch {
        startSimulation();
      }
    } else {
      startSimulation();
    }

    toast.info('Listening… speak clearly about what you want to build.');
  };

  const handleStop = () => {
    setStatus('idle');
    recordingRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch {
      /* no-op */
    }
    clearSimulation();
    // Keep whatever we heard so far (including live/partial text).
    const pending = interim;
    setInterim('');
    if (pending) {
      setTranscript((current) => (current ? `${current} ${pending}`.trim() : pending));
    }
  };

  const handleGenerate = async () => {
    recordingRef.current = false;
    clearSimulation();
    try {
      recognitionRef.current?.stop();
    } catch {
      /* no-op */
    }
    setInterim('');

    const text = (transcript || interim).trim();
    if (!text) {
      setError('Record your voice first — we need a transcript to generate code.');
      toast.error('No transcript found. Please record your voice.');
      return;
    }

    setError('');
    setStatus('processing');
    try {
      const response = await generateFromVoice({ transcript: text, language });
      setCode(response.code);
      setStatus('done');
      bumpStat('voice');
      notifyResult(toast, response, 'Voice converted to code!');
    } catch (err) {
      setStatus('idle');
      setError(err.message || 'We could not convert that transcript.');
      toast.error(err.message || 'Conversion failed. Please try again.');
    }
  };

  // Recording duration timer
  useEffect(() => {
    if (status === 'recording') {
      timerRef.current = setInterval(() => setSeconds((value) => value + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
    return undefined;
  }, [status]);

  // Cleanup
  useEffect(
    () => () => {
      clearSimulation();
      if (timerRef.current) clearInterval(timerRef.current);
      try {
        recognitionRef.current?.stop();
      } catch {
        /* no-op */
      }
    },
    [clearSimulation]
  );

  const meta =
    status === 'idle' && transcript && !code
      ? { ...STATUS_META.idle, label: 'Transcript ready', tone: 'bg-brand-50 text-genie-blue dark:bg-brand-500/15 dark:text-brand-300', dot: 'bg-genie-blue' }
      : STATUS_META[status];
  const isRecording = status === 'recording';

  return (
    <div className="animate-fade-in">
      <PageHeader title="Voice to Code" subtitle="Speak your ideas and get code." icon={Mic} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recorder */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader
            title="Voice Recorder"
            subtitle="Click the microphone and describe what you want to build"
            icon={AudioLines}
            action={
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${meta.tone}`}
              >
                <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
            }
          />

          <div className="relative flex flex-col items-center px-5 py-10 text-center sm:py-12">
            <div
              className="grid-bg pointer-events-none absolute inset-0 opacity-50"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-50 blur-2xl dark:bg-brand-500/10"
              aria-hidden="true"
            />

            <div className="relative">
              <MicrophoneButton
                recording={isRecording}
                disabled={status === 'processing'}
                onClick={isRecording ? handleStop : handleStart}
              />
            </div>

            <p className="relative mt-7 text-lg font-bold text-genie-navy dark:text-white">
              {isRecording
                ? 'Listening… click to stop'
                : status === 'processing'
                  ? 'Converting your speech…'
                  : 'Click to start recording'}
            </p>
            <p className="relative mt-1.5 max-w-md text-sm text-ink-500 dark:text-ink-400">
              Speak clearly about what you want to build…
            </p>

            <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                onClick={isRecording ? handleStop : handleStart}
                variant={isRecording ? 'danger' : 'primary'}
                icon={isRecording ? Radio : Mic}
                disabled={status === 'processing'}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>

              <span className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-600 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300">
                <Clock3 size={15} className="text-genie-blue" />
                {formatDuration(seconds)}
              </span>
            </div>

            <div className="relative mt-8 w-full max-w-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                Supported languages
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {VOICE_LANGUAGES.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-semibold text-ink-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Transcript */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader title="Transcript" subtitle="Edit the text if needed" icon={Radio} />
          <div className="flex flex-1 flex-col p-5">
            <Select
              label="Target Language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              options={VOICE_LANGUAGES}
            />

            <Textarea
              label="What we heard"
              rows={7}
              wrapperClassName="mt-4 flex-1"
              className="min-h-[150px]"
              placeholder="Your transcript will appear here. You can also type it manually…"
              value={transcript || interim}
              onChange={(event) => {
                setTranscript(event.target.value);
                setInterim('');
              }}
              error={error}
              hint={interim && !transcript ? 'Live transcription in progress…' : undefined}
            />

            <Button
              className="mt-4"
              fullWidth
              size="lg"
              icon={Wand2}
              loading={status === 'processing'}
              onClick={handleGenerate}
            >
              {status === 'processing' ? LOADING_MESSAGES.voice : 'Convert to Code'}
            </Button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-ink-400">
              <CheckCircle2 size={12} className="text-emerald-500" />
              Uses your browser&apos;s speech engine when available
            </p>
          </div>
        </Card>
      </div>

      {/* Generated code */}
      <section className="mt-6" aria-live="polite">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-genie-navy text-white">
              <FileCode2 size={16} />
            </span>
            <h2 className="text-lg font-extrabold text-genie-navy dark:text-white">Generated Code</h2>
          </div>
          {code ? (
            <span className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-500 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300">
              {language}
            </span>
          ) : null}
        </div>

        <CodeEditor
          code={code}
          language={language}
          title="voice-output"
          emptyMessage="Record your voice and hit Convert to Code — your snippet will appear here."
        />
      </section>
    </div>
  );
}
