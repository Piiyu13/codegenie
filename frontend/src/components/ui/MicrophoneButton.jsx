import { Mic, Square } from 'lucide-react';

/**
 * Large circular microphone button with pulsing rings while recording.
 */
export default function MicrophoneButton({ recording = false, onClick, disabled = false, size = 148 }) {
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      {recording ? (
        <>
          <span
            className="absolute inset-0 rounded-full bg-genie-blue/25 animate-pulse-ring"
            aria-hidden="true"
          />
          <span
            className="absolute inset-0 rounded-full bg-genie-blue/20 animate-pulse-ring"
            style={{ animationDelay: '0.6s' }}
            aria-hidden="true"
          />
        </>
      ) : null}

      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={recording ? 'Stop recording' : 'Start recording'}
        className={`relative grid place-items-center rounded-full text-white transition-all duration-300
          focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-genie-blue/40
          ${
            recording
              ? 'bg-red-500 shadow-[0_16px_40px_rgba(239,68,68,0.45)] scale-105'
              : 'bg-genie-blue shadow-glow hover:-translate-y-1 hover:scale-105'
          }
          disabled:cursor-not-allowed disabled:opacity-60`}
        style={{ width: size * 0.66, height: size * 0.66 }}
      >
        {recording ? (
          <Square size={size * 0.2} fill="currentColor" />
        ) : (
          <Mic size={size * 0.24} />
        )}
      </button>
    </div>
  );
}
