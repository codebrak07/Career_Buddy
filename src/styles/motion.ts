/**
 * CAREER INTELLIGENCE INSTRUMENT — CENTRAL MOTION ARCHITECTURE
 * Aligned with Creative OS motion and typography specifications.
 * Respects prefers-reduced-motion across all transitions.
 */

export const MOTION_TIMINGS = {
  micro: 120,          // Hover states, button toggles, focus dots
  fast: 220,           // Chip selection, drawer toggle, badge shift
  standard: 380,       // Card accordion, tab transition, panel reveal
  cinematic: 650,      // Hero typography sequence, readiness gauge calibration
  personaTransition: 850, // 4-phase orchestrated system recalibration
  autoFocusCycle: 4000,   // Data-driven bento focus dwell time
  userInactivityDelay: 8000, // Time before auto-dwell resumes
} as const;

export const EASINGS = {
  editorial: 'cubic-bezier(0.16, 1, 0.3, 1)',      // High-tension snap with long tail
  calibration: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Spring-like calibration indicator
  dissolve: 'cubic-bezier(0.4, 0, 0.2, 1)',        // Standard telemetry wipe
  linear: 'linear',
} as const;

/**
 * Checks whether user has enabled prefers-reduced-motion at runtime.
 */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Generates transition style strings respecting reduced-motion settings.
 */
export function getTransition(
  properties: string = 'all',
  timing: keyof typeof MOTION_TIMINGS = 'standard',
  easing: keyof typeof EASINGS = 'editorial'
): string {
  if (isReducedMotion()) return 'none';
  return `${properties} ${MOTION_TIMINGS[timing]}ms ${EASINGS[easing]}`;
}
