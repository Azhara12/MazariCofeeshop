import { useCallback, useRef } from 'react';

/**
 * useAudioAlert – plays a subtle "ding" notification using the Web Audio API.
 * No external files required; the sound is synthesised on the fly.
 */
export const useAudioAlert = () => {
  const ctxRef = useRef(null);

  const playAlert = useCallback(() => {
    try {
      // Lazily create a shared AudioContext
      if (!ctxRef.current || ctxRef.current.state === 'closed') {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = ctxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // ── Ding sequence (two notes) ──────────────────────────────────────
      const playNote = (frequency, startTime, duration = 0.3, gain = 0.35) => {
        const oscillator = ctx.createOscillator();
        const gainNode   = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type      = 'sine';
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.7, startTime + duration);

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration + 0.05);
      };

      const now = ctx.currentTime;
      playNote(880, now);           // A5
      playNote(1175, now + 0.2);    // D6

    } catch (err) {
      // Web Audio not supported – silently swallow
      console.warn('[useAudioAlert] Web Audio API not supported:', err);
    }
  }, []);

  return { playAlert };
};
