# Architecture Decision Records (ADRs)

---

## ADR-001: Deterministic Career Scoring over Pure LLM Generation
- **Date**: 2026-09-11
- **Status**: Accepted
- **Decision**: We mandate deterministic TypeScript calculation for all career readiness scoring, role thresholds, and prerequisite sequencing.
- **Why**:
  - **Explainability**: Enables exact arithmetic inspection in the "Why This Result?" drawer.
  - **Reproducibility**: The exact same profile always produces the exact same score.
  - **Judge Defensibility**: Zero risk of hallucinated 99% scores during live judge stress tests.
- **Alternatives Considered**:
  - *Pure LLM Prompting*: Too volatile, cannot be proven mathematically.
  - *Vector Cosine Similarity*: Measures text similarity, not prerequisite competency or evidence strength.

---

## ADR-002: Four-Tier Epistemic Skill Classification
- **Date**: 2026-09-11
- **Status**: Accepted
- **Decision**: All skills must exist in one of four states: `CLAIMED`, `DETECTED`, `EVIDENCED`, `VALIDATED`.
- **Why**: Protects employers and learners from self-reported resume inflation. Prevents claimed buzzwords from masquerading as verified competency.
- **Judge Explanation**: "We never silently upgrade a claim to a fact without an artifact or assessment."

---

## ADR-003: Separation of Ready Now vs Reachable Careers
- **Date**: 2026-09-11
- **Status**: Accepted
- **Decision**: Strict two-category presentation instead of a continuous 1-100 ranked list.
- **Why**: Prevents candidates from applying to roles where they lack critical non-negotiable prerequisites, while providing clear, structured learning bridges for Reachable roles.
- **Threshold**: Ready Now requires $\ge 75\%$ overall readiness AND $\ge 80\%$ critical skill coverage.

---

## ADR-004: Topological DAG for Skill Gap Ordering
- **Date**: 2026-09-11
- **Status**: Accepted
- **Decision**: Model skill prerequisites as a Directed Acyclic Graph (DAG) and sort via topological traversal.
- **Why**: Answers the fundamental learner question: *"What do I learn first?"* rather than presenting a flat list of 15 overwhelming technologies.

---

## ADR-005: Curated Labour-Demand Reference Model
- **Date**: 2026-09-11
- **Status**: Accepted
- **Decision**: Utilize a curated labor-market demand reference dataset with explicit schema connectors rather than unverified live scraping.
- **Why**: Zero failure rate during hackathon demos, transparent source attribution, and realistic production architecture demonstration.

---

## ADR-006: Bento Editorial × Technical Instrument Visual Language
- **Date**: 2026-09-11
- **Status**: Superseded by ADR-007
- **Decision**: Initial baseline design tokens using dark obsidian palette.

---

## ADR-007: Migration to Light-First Editorial Instrument Aesthetic with Motion System
- **Date**: 2026-09-11
- **Status**: Accepted
- **Decision**: Transition the entire visual presentation from uniform dark theme to a **light-first editorial intelligence instrument** with purposeful global motion.
- **Why**:
  - **Visual Differentiation**: Light ivory canvas (`#F9F8F5`) + crisp paper stock (`#FFFFFF`) + deep navy ink (`#0F172A`) communicates authentic research intelligence and evidence archiving rather than a generic dark SaaS dashboard.
  - **First Impression Impact**: The opening narrative hero with animated second-line reveal and live epistemic signal pipeline immediately captures attention.
  - **Purposeful Motion**: Calibrated count-up animations (`AnimatedCounter`) and multi-stage assessment evaluation transitions visually prove that the interface is a living reflection of the deterministic intelligence engine.
- **Alternatives Rejected**:
  - *Keeping dark theme*: Too flat, static, and indistinguishable from generic AI dashboards.
  - *Full skeuomorphism / glassmorphism*: Too gimmicky; violates Creative OS restraint.
  - *Fake AI processing spinners*: Obscures real deterministic computation states.

---

## ADR-008: Living Bento Intelligence Instrument
- **Date**: 2026-09-11
- **Status**: Accepted
- **Decision**: Implement an autonomous, data-driven Bento Focus Manager (`useBentoFocus`) and multi-phase persona switch choreography (`usePersonaTransition`).
- **Why**: Dynamic prioritization based on epistemic status (readiness, blockers, confidence).
- **Implementation**: `src/hooks/useBentoFocus.ts`, `src/hooks/usePersonaTransition.ts`.
- **Judge Explanation**: "The instrument auto-focuses on the candidate's mathematical reality."

---

## ADR-009: Candidate / Evaluator Mode Separation
- **Date**: 2026-09-11
- **Status**: Accepted
- **Decision**: Structurally bifurcate the user experience into two distinct modes: **Candidate Portal** (personal, guided, credential ingestion, test-taking) and **Evaluator / Auditor Instrument** (forensic audit, 6-factor trace, DAG verification).
- **Why**:
  - Test-taking must never be accessible on the audit/evaluator side, preserving audit integrity.
  - Candidates need progressive credential intake (CV, GitHub, Coursera) and actionable guidance; evaluators need mathematical verification and proof ledgers.
- **Alternatives Considered**:
  - *Unified single dashboard*: Overwhelmed candidates with technical formulas and confused auditors with input forms.
- **Rejected Alternatives**:
  - *Separate applications*: Fragments state and code; dual-mode in one shared deterministic engine provides seamless 1-click evaluation.
- **Implementation**: `AppContext.tsx` (`appMode: 'candidate' | 'evaluator'`), `CandidatePortalScreen.tsx`, `Header.tsx` mode toggle.
- **Trade-offs**: Requires dual-state navigation routing and mode-aware screen permissions.
- **Judge Explanation**: "The auditor inspects the proof ledger; the candidate earns the credentials."

---

## ADR-010: Groq Semantic Assistance & Strict Deterministic Boundary
- **Date**: 2026-09-11
- **Status**: Accepted
- **Decision**: Deploy high-performance Groq LPU models (`qwen/qwen3.8-27b`) strictly for semantic extraction and contextual assistance, forbidding LLMs from calculating scores, thresholds, or prerequisite orderings.
- **Why**:
  - LLMs excel at understanding messy natural-language resumes, commit logs, and conversational inquiries.
  - Deterministic algorithms excel at reproducible mathematical scoring, blocker penalties, and DAG topological sorting.
- **Alternatives Considered**:
  - *End-to-end LLM scoring*: Non-reproducible, subject to prompt injection and hallucinations.
- **Rejected Alternatives**:
  - *Pure regex parser*: Misses nuanced technical synonyms and multi-line project descriptions.
- **Implementation**: `src/services/groqService.ts` (`analyzeCandidateSubmissionWithGroq`, `askGroqAssistant`), strictly isolated from `scoringEngine.ts`.
- **Trade-offs**: Requires dual API key rotation, failover handling, and structured JSON parsing validation.
- **Judge Explanation**: "AI handles the human language; mathematics handles the career verdict."

---

## ADR-011: Dynamic Validation Assessment via Groq with Deterministic Bayesian Updates
- **Date**: 2026-09-11
- **Status**: Accepted
- **Decision**: Dynamically generate 3-question diagnostic micro-assessments using Groq tailored to the candidate's current measured confidence, followed by a deterministic Bayesian confidence update (`applyAssessmentUpdate`).
- **Why**:
  - Static quizzes become memorized or outdated; dynamic generation tests real system trade-offs and code scenarios.
  - Test outcomes feed directly into Bayesian belief updates, elevating skills from claimed/detected to `VALIDATED` and recalculating career readiness in real time.
- **Alternatives Considered**:
  - *Static 10-question tests*: Too slow for live demonstrations and hackathon evaluation.
  - *Simple +10% score bump*: Mathematically ungrounded and fails judge audit.
- **Rejected Alternatives**:
  - *Self-reported skill sliding bars*: Encourages resume inflation with zero proof.
- **Implementation**: `generateLiveQuizWithGroq()` in `groqService.ts`, `applyAssessmentUpdate()` in `competencyEngine.ts`, `AssessmentScreen.tsx`.
- **Trade-offs**: External API call required during test generation; mitigated by instant fallback question bank.
- **Judge Explanation**: "Testing a skill elevates belief probability, not an arbitrary flat score."

---

## ADR-012: User-Controlled & Data-Driven Bento Focus Overrides
- **Date**: 2026-09-11
- **Status**: Accepted
- **Decision**: Bento focus sequencing is data-reactive to candidate profile state, but all autonomous cycling immediately pauses upon user interaction (hover, click, scroll).
- **Why**: Prevents UI jumpiness and respects user agency while ensuring the first impression demonstrates active intelligence.
- **Implementation**: `src/hooks/useBentoFocus.ts` with 8-second resume delay and tactile pill selector overrides.
- **Judge Explanation**: "The system suggests attention, but the human retains complete control."

---

## ADR-013: Evidence-First Career Explanation (Why Career + Why Not Higher)
- **Date**: 2026-09-11
- **Status**: Accepted
- **Decision**: Every career card must expose inline explainability answering both **"Why This Career?"** (satisfied competencies, evidence base) and **"Why Not Higher?"** (missing skills, blocker penalties, prerequisite gaps).
- **Why**: Solves the fundamental failure of black-box career tools that output recommendations without revealing the reasoning or how to improve.
- **Implementation**: `src/components/common/WhyCareerPanel.tsx`, embedded across `CareerIntelligenceScreen` and `CareerDetailScreen`.
- **Trade-offs**: Increases card vertical density; mitigated by progressive collapsible disclosure.
- **Judge Explanation**: "Showing why you didn't score higher is twice as valuable as showing why you matched."



