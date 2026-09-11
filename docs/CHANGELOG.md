# Changelog — Skill → Career Mapping Platform

All notable changes to the Career Intelligence Instrument will be documented in this file.

## [2.6.0] - 2026-09-11 — Career Intelligence Instrument V5 (Creative OS & Candidate Dual-Mode)

### Added
- **Candidate / Evaluator Mode Bifurcation (ADR-009)**: Dedicated Candidate Portal for credential ingestion (CV, GitHub, Coursera) and live diagnostic testing, with Evaluator Mode preserved as the forensic audit instrument.
- **Topological Career GPS (`CareerGpsView`)**: Shortest realistic capability pathway graph from candidate origin to reachable targets with explicit skill distances.
- **Inline Explainability (`WhyCareerPanel`)**: Dual "WHY THIS CAREER?" (evidence for) and "WHY NOT HIGHER?" (blockers & penalty deductions) directly inside career cards.
- **Live Measured Latency Telemetry**: Replaced static latency approximations with runtime `performance.now()` measurements (`GROQ / LIVE · ${ms}`).
- **Instrument Companion Bot (`GroqAssistantBot`)**: Floating editorial assistant docked at bottom-right with real navigation shortcuts (`[Candidate Portal]`, `[Gap DAG]`, `[Careers]`, `[Learning Path]`).
- **Creative OS Motion System (`src/styles/motion.ts`)**: Centralized motion parameters with strict runtime `prefers-reduced-motion` compliance.
- **Architectural Decision Records**: Added ADR-009 through ADR-013 in `docs/DECISIONS.md`.

### Enhanced
- **Creative OS Editorial Typography**: Dynamic `clamp()` scaling with display tracking (`-0.035em`), Newsreader italic serif accent lines, and open monospace tracking.
- **Restrained Skeuomorphism**: Paper dossier offsets, verification stamps, and embedded dark audit terminal objects.
- **Dynamic Micro-Assessments**: 3-question live technical evaluation via Groq with seamless Bayesian confidence elevation (+56% on passing).
- **Verification**: 6/6 deterministic engine tests and 4/4 candidate flow tests passing.

## [2.5.0] - 2026-09-11 — V5 Living Bento Intelligence Instrument

### Added
- **Autonomous Bento Focus Manager (`useBentoFocus`)**: Data-driven automatic focus cycling that prioritizes modules based on candidate readiness (Elena: Readiness/Evidence; Marcus: Skills/Validation; Devin: Blockers/DAG/Learning). Includes pause/resume toggle.
- **Choreographed Persona Recalibration (`usePersonaTransition`)**: Multi-stage transition (`CLEARING → LOADING → RECALCULATING → LOCKED`) making deterministic updates transparent and tangible.
- **Inline Explainability Panel (`WhyCareerPanel`)**: Expandable justification inside every career card detailing evidence FOR, evidence AGAINST, and prerequisite blocker chains.
- **Editorial Section Indices (`SectionIndex`)**: Standardized technical indices (`00`-`08`) across all 9 screens.
- **Tactile Instrument Navigation**: Section numbers, live Bento focus beacons, and `AI` vs `DET` engine provenance micro-tags.
- **ADR-008**: Living Bento Intelligence Instrument architecture decision record.

### Upgraded
- **Header & Telemetry**: 2-layer tactile instrument with real-time ticker and live transition status indicator.
- **Hero Composition**: Bento layout with oversized monospace index dial, technical annotations, and epistemic weight badges.
- **All 9 Screens**: Upgraded to V5 bento-cell architecture with tactile typography and zero unused dependencies.
- **Production Build**: Verified with 0 errors in 478ms; 6/6 engine test suite passing.

## [2.4.0] - 2026-09-11

### Changed / Transformed
- **Visual Transformation**: Completely migrated application from uniform dark theme to **Light-First Editorial Career Intelligence Instrument** (Warm ivory canvas `#F9F8F5`, crisp white paper cards `#FFFFFF`, deep navy ink typography `#0F172A`, flame orange accent `#FF6B35`).
- **Motion System**: Implemented centralized motion tokens, `AnimatedCounter` score interpolation, and animated multi-stage assessment evaluation transitions (`[01/05] EVALUATING_RESPONSE... → [05/05] NEXT_ACTION_READY`).
- **Hero Narrative**: Integrated dynamic opening headline with staggered second-line reveal and `LivePipelineHero` interactive epistemic signal demonstrator.
- **Explainability Drawer**: Enhanced with first-class `AuditTrace` inspector, formula summary, and exportable raw JSON digest.
- **Living Documentation**: Synchronized `DESIGN_SYSTEM.md`, `DECISIONS.md`, and `CHANGELOG.md`.

## [1.0.0] - 2026-09-11

### Added
- Complete 25-file living engineering documentation suite in `/docs`.
- Curated reference taxonomy with 50+ skills, 8 career roles, and labour market reference model.
- 6-factor deterministic career scoring engine with blocker penalty calculations.
- Epistemic classification engine: Claimed → Detected → Evidenced → Validated.
- Ready Now vs Reachable strict threshold gating.
- Topological DAG prerequisite sequencer.
- Interactive Assessment Engine with live Bayesian confidence recalculation.
- 3 distinct judge demo personas with natural, unhardcoded score outputs.
