import { useState, useCallback, useRef, useEffect } from 'react';

export type TransitionPhase =
  | 'idle'
  | 'clearing'
  | 'loading'
  | 'recalculating'
  | 'locked';

interface PersonaTransitionResult {
  phase: TransitionPhase;
  isTransitioning: boolean;
  phaseLabel: string;
  startTransition: (callback: () => void) => void;
  progress: number; // 0-1
}

const PHASE_DURATIONS: Record<TransitionPhase, number> = {
  idle: 0,
  clearing: 150,
  loading: 200,
  recalculating: 300,
  locked: 150,
};

const PHASE_LABELS: Record<TransitionPhase, string> = {
  idle: '',
  clearing: 'CLEARING SIGNALS...',
  loading: 'LOADING EVIDENCE...',
  recalculating: 'RECALCULATING...',
  locked: 'PROFILE LOCKED',
};

const PHASE_ORDER: TransitionPhase[] = ['clearing', 'loading', 'recalculating', 'locked'];

/**
 * Choreographs persona switch transitions.
 * Wraps the actual state change (resetToPersona) inside
 * a visual sequence: clearing → loading → recalculating → locked → idle.
 * 
 * The actual data swap happens at the 'recalculating' phase so
 * numbers animate FROM old values TO new values during that phase.
 */
export function usePersonaTransition(): PersonaTransitionResult {
  const [phase, setPhase] = useState<TransitionPhase>('idle');
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startTransition = useCallback((dataSwapCallback: () => void) => {
    let elapsed = 0;

    const runPhase = (index: number) => {
      if (index >= PHASE_ORDER.length) {
        setPhase('idle');
        setProgress(0);
        return;
      }

      const currentPhase = PHASE_ORDER[index];
      setPhase(currentPhase);
      elapsed += PHASE_DURATIONS[currentPhase];
      
      const totalDuration = PHASE_ORDER.reduce((s, p) => s + PHASE_DURATIONS[p], 0);
      setProgress(elapsed / totalDuration);

      // Execute the actual data swap at the recalculating phase
      if (currentPhase === 'recalculating') {
        dataSwapCallback();
      }

      timeoutRef.current = setTimeout(() => {
        runPhase(index + 1);
      }, PHASE_DURATIONS[currentPhase]);
    };

    runPhase(0);
  }, []);

  return {
    phase,
    isTransitioning: phase !== 'idle',
    phaseLabel: PHASE_LABELS[phase],
    startTransition,
    progress,
  };
}
