import { useState, useEffect, useCallback, useRef } from 'react';
import type { RoleMatchResult } from '../types';

export type BentoModuleId =
  | 'readiness'
  | 'evidence'
  | 'skills'
  | 'career'
  | 'career-reachable'
  | 'blockers'
  | 'gap'
  | 'learning'
  | 'validation'
  | 'trajectory';

export type BentoModuleState = 'idle' | 'focused' | 'secondary' | 'attention';

export interface BentoFocusResult {
  focusOrder: BentoModuleId[];
  activeIndex: number;
  activeModule: BentoModuleId;
  getModuleState: (id: BentoModuleId) => BentoModuleState;
  selectModule: (id: BentoModuleId) => void;
  setActiveIndex: (index: number) => void;
  pauseFocus: () => void;
  resumeFocus: () => void;
  toggleAutoTour: () => void;
  isAutoTourActive: boolean;
  isPaused: boolean;
  focusLabel: string;
}

/**
 * Calculates prioritized module order from deterministic engine state.
 */
function calculateFocusPriority(
  _readyNow: RoleMatchResult[],
  _reachable: RoleMatchResult[],
  topMatch: RoleMatchResult | undefined
): BentoModuleId[] {
  if (!topMatch) return ['readiness', 'evidence', 'career', 'trajectory'];

  const blockerCount = topMatch.missingCompetencies.filter(m => m.isBlocker).length;
  const score = topMatch.overallScore;
  const hasWeakSkills = topMatch.missingCompetencies.some(
    m => m.userConfidence > 0 && m.userConfidence < 65
  );

  // High readiness, no blockers → emphasize opportunity
  if (score >= 80 && blockerCount === 0) {
    return ['readiness', 'evidence', 'career', 'trajectory'];
  }

  // Good readiness but has weak skills → emphasize validation
  if (score >= 65 && hasWeakSkills) {
    return ['skills', 'validation', 'career', 'learning'];
  }

  // Moderate readiness with blockers → emphasize gap remediation
  if (score >= 50 && blockerCount > 0) {
    return ['career-reachable', 'blockers', 'gap', 'learning'];
  }

  // Low readiness, many blockers → emphasize learning path
  if (blockerCount >= 2) {
    return ['career-reachable', 'blockers', 'gap', 'learning'];
  }

  // Default
  return ['readiness', 'skills', 'career', 'gap'];
}

const CYCLE_INTERVAL_MS = 5000;

export function useBentoFocus(
  readyNow: RoleMatchResult[],
  reachable: RoleMatchResult[],
  activePersonaId: string
): BentoFocusResult {
  const topMatch = readyNow[0] || reachable[0];
  const focusOrder = calculateFocusPriority(readyNow, reachable, topMatch);

  const [activeIndex, setActiveIndex] = useState(0);
  // Auto-tour is OFF by default so user is in 100% control
  const [isAutoTourActive, setIsAutoTourActive] = useState(false);
  const cycleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset to first prioritized module when persona changes
  useEffect(() => {
    setActiveIndex(0);
    setIsAutoTourActive(false);
  }, [activePersonaId]);

  // Only cycle if user explicitly toggles on auto-tour
  useEffect(() => {
    if (!isAutoTourActive) {
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current);
      return;
    }

    cycleTimerRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % focusOrder.length);
    }, CYCLE_INTERVAL_MS);

    return () => {
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current);
    };
  }, [isAutoTourActive, focusOrder.length]);

  const selectModule = useCallback((id: BentoModuleId) => {
    // User interacted manually: stop any auto-tour
    setIsAutoTourActive(false);
    const idx = focusOrder.indexOf(id);
    if (idx !== -1) {
      setActiveIndex(idx);
    }
  }, [focusOrder]);

  const toggleAutoTour = useCallback(() => {
    setIsAutoTourActive(prev => !prev);
  }, []);

  const pauseFocus = useCallback(() => {
    setIsAutoTourActive(false);
  }, []);

  const resumeFocus = useCallback(() => {
    setIsAutoTourActive(true);
  }, []);

  const getModuleState = useCallback(
    (id: BentoModuleId): BentoModuleState => {
      const idx = focusOrder.indexOf(id);
      if (idx === -1) return 'idle';
      if (idx === activeIndex) return 'focused';
      return 'idle';
    },
    [focusOrder, activeIndex]
  );

  return {
    focusOrder,
    activeIndex,
    activeModule: focusOrder[activeIndex] || 'readiness',
    getModuleState,
    selectModule,
    setActiveIndex,
    pauseFocus,
    resumeFocus,
    toggleAutoTour,
    isAutoTourActive,
    isPaused: !isAutoTourActive,
    focusLabel: `${String(activeIndex + 1).padStart(2, '0')} / ${String(focusOrder.length).padStart(2, '0')}`,
  };
}
