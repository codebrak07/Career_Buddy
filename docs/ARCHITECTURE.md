# System Architecture — Career Intelligence Instrument

## 1. High-Level Architectural Diagram

```text
+---------------------------------------------------------------------------------------+
|                                    USER INTERFACE                                     |
|  Bento Instrument Layout · Dossier Visualizer · Prerequisite DAG · Live Telemetry     |
+------------------------------------------+--------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                                 APPLICATION STATE BUS                                 |
|             Active Profile · Epistemic Skills · Role Cache · Assessment State         |
+-------------------+-----------------------------------------------+-------------------+
                    |                                               |
                    v                                               v
+---------------------------------------+   +-------------------------------------------+
|          AI SEMANTIC LAYER            |   |          DETERMINISTIC ENGINE             |
|                                       |   |                                           |
| · Unstructured Text & Resume Parsing  |   | · Evidence Strength & Decay Formulator    |
| · Skill Entity Normalization          |   | · Deterministic Role Matching (6-factor)  |
| · Natural Language Explainability     |   | · Ready Now vs Reachable Gatekeeper       |
| · Fallback Regex & Keyword Classifier |   | · Prerequisite DAG Topological Sorter     |
|                                       |   | · Bayesian Competency Confidence Update   |
+-------------------+-------------------+   +---------------------+---------------------+
                    |                                         |
                    +--------------------+--------------------+
                                         |
                                         v
+---------------------------------------------------------------------------------------+
|                               CURATED REFERENCE DATASTORE                             |
|  Taxonomy (50+ Skills) · Roles DB · Labour Reference · Learning Catalog · Assessments |
+---------------------------------------------------------------------------------------+
```

---

## 2. Component Boundaries & Responsibilities

### 2.1 The Ingestion & Evidence Layer (`src/services/evidenceEngine.ts`)
- **Input**: Raw text, resume bullets, GitHub repo descriptions, coursework lists, certificates.
- **Role**: Normalizes extracted skills against standardized taxonomy IDs and categorizes artifacts into epistemic tiers:
  - Claimed ($W_e = 0.15$)
  - Detected ($W_e = 0.35$)
  - Evidenced ($W_e = 0.75$)
  - Validated ($W_e = 1.00$)
- **Output**: Typed `ProfileEvidence` and normalized `LearnerSkillMap`.

### 2.2 The Deterministic Career Matcher (`src/services/scoringEngine.ts`)
- **Role**: Evaluates each career profile against role requirements using explicit arithmetic formulas.
- **Formula**:
  $$\text{Score} = (0.35 \cdot C) + (0.25 \cdot E) + (0.15 \cdot P) + (0.10 \cdot X) + (0.15 \cdot D) - \text{BlockerPenalty}$$
- **Threshold Gating**:
  - `READY NOW`: Score $\ge 75$, Critical Skill Coverage $\ge 80\%$, No unresolved level-1 blockers.
  - `REACHABLE`: Score $\ge 40$, Path distance $\le 4$ steps.

### 2.3 The Topological Gap & DAG Engine (`src/services/gapEngine.ts`)
- **Role**: Constructs directed acyclic graphs for missing competencies and performs topological sorting.
- **Output**: Ranked learning sequence where foundational nodes (e.g. `prog-foundations`) must be satisfied before descendant nodes (`sys-design`, `distributed-systems`).

### 2.4 The Interactive Assessment & Recalibration Engine (`src/services/assessmentEngine.ts` & `competencyEngine.ts`)
- **Role**: Delivers timed, skill-specific question sets and applies Bayesian-style confidence updates:
  $$\text{Confidence}_{\text{new}} = \text{Confidence}_{\text{old}} + \alpha \cdot (\text{AssessmentScore} - \text{Confidence}_{\text{old}})$$
- **Output**: Instant promotion from `Evidenced` to `Validated` and reactive trigger of the Career Matcher.

---

## 3. Data Flow Progression

```text
Step 1: User imports Profile / selects Seed Persona
Step 2: Evidence Engine normalizes terms (e.g., "React.js" -> "react", "NextJS" -> "nextjs")
Step 3: Scoring Engine calculates readiness vectors across all roles
Step 4: Roles partitioned into "Ready Now" and "Reachable"
Step 5: Gap Engine maps missing dependencies for chosen target role
Step 6: User completes assessment quiz for blocker skill
Step 7: Assessment Engine updates skill confidence and validation status
Step 8: Global state triggers live re-scoring of all career targets
```
