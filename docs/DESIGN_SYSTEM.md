# Design System — Editorial Career Intelligence × Technical Instrument

## 1. Visual Philosophy & North Star

Conforming to **Creative OS**:
> **Editorial Publication × Research Instrument × Evidence Archive × Modern Product Interface**

The visual language transitions away from uniform dark developer dashboards into a **light-first editorial instrument**:
- **Primary Canvas**: Warm Ivory / Off-White (`#F9F8F5`, `#F5F3ED`) with subtle 24px micro-grid telemetry.
- **Paper & Card Surfaces**: Crisp white sheets (`#FFFFFF`) with subtle graphite borders (`#E2E0D8`, `#D4D1C7`) and layered soft shadows.
- **Typography as Architecture**: Deep navy / editorial ink (`#0F172A`, `#1E293B`) paired with JetBrains Mono for system telemetry.
- **High-Voltage Accents**:
  - Primary Flame Orange (`#FF6B35` / `#EA580C`) for active signals, primary CTAs, and hero highlights.
  - Secondary Technical Cyan (`#0284C7`) for system telemetry and code states.
  - Validated Emerald (`#059669`) for verified credentials and Ready Now classifications.
  - Warning Amber (`#D97706`) for reachable career bridges and partial coverage.
  - Blocker Crimson (`#DC2626`) for critical gating dependencies.
- **Contrasting Instrument Panels**: Intentional deep obsidian/navy panels (`#0F172A`) reserved for high-contrast telemetry bars, live computation stages, and raw code/JSON traces.

---

## 2. Motion System & Tokens

Every animation communicates state, causality, or hierarchy:

```typescript
export const MOTION_TOKENS = {
  duration: {
    fast: '160ms',     // Hover lifts, button presses
    base: '320ms',     // Tab switches, drawer open/close
    slow: '560ms',     // Score interpolation, DAG expansion
  },
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)', // Creative OS Sovereign curve
};
```

### Key Motion Behaviors:
1. **Count-Up Interpolation**: Scores transition smoothly from initial to target value via `AnimatedCounter` (e.g. `55% → 66%`).
2. **Multi-Stage Computation Pipeline**: Assessments animate through real processing stages:
   `[EVALUATING_RESPONSE] → [UPDATING_COMPETENCY] → [RECALCULATING_READINESS] → [UPDATING_CAREER_GRAPH] → [NEXT_ACTION_READY]`
3. **Live Signal Pulse**: Epistemic stages in the hero visualization pulse progressively (`Claimed → Detected → Evidenced → Validated → Career Readiness`).

---

## 3. Typography Hierarchy

| Role | Font Family | Size | Weight | Tracking |
| :--- | :--- | :--- | :---: | :---: |
| **Hero Display** | Sans / Editorial | `clamp(2.5rem, 5.5vw, 4.5rem)` | 800 | `-0.03em` |
| **Section Title** | Sans | `1.5rem` - `2rem` | 700 | `-0.02em` |
| **Instrument Eyebrow** | Mono | `0.6875rem` (`11px`) | 700 | `+0.08em` |
| **Body Content** | Sans | `0.875rem` - `1.0rem` | 400 | `-0.01em` |
| **Telemetry Metric** | Mono | `1.5rem` - `3.0rem` | 800 | `-0.02em` |

---

## 4. Asymmetric Bento Hierarchy

- **Dominant Blocks (2/3 width)**: Career Readiness Spotlight with live 6-factor metrics, Candidate vs Target Requirement Alignment Matrix, and Topological DAG Swimlanes.
- **Supporting Blocks (1/3 width)**: Reachable Bridge roadmap with next best action callouts, 4-tier epistemic ledger, and chronological verification timeline.
- **Micro Telemetry Badges**: Monospace status indicators (`[VALIDATED]`, `[EVIDENCED]`, `[DETECTED]`, `[CLAIMED]`, `[BLOCKER]`).

---

## 5. Restrained Evidence Skeuomorphism

- **Physical Dossier Metaphor**: Crisp archival paper cards, candidate record IDs (`#RECORD ID #ELENA-ROSTOVA`), and angled proof stamps (`[EVIDENCE DOSSIER VERIFIED]`).
- **Forbidden**: Cheap fake leather, glassmorphism blur stacks, neon cyberpunk glows, and non-performant canvas loops.
