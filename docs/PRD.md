# Product Requirements Document (PRD) — Skill → Career Mapping Platform
**Product Name**: Career Intelligence Instrument (HackX)  
**Version**: 1.0.0  
**Status**: In Active Build  
**Classification**: Evidence-Aware Career Intelligence Platform  

---

## 1. Executive Summary & Problem Statement

### The Problem
Traditional career guidance and job matching platforms suffer from two fundamental flaws:
1. **Self-Reported Inflation**: Platforms take user-claimed skills at face value or infer ungrounded competencies from generic resume keywords.
2. **Black-Box Hallucinations**: Generative AI tools output arbitrary role recommendations (e.g., *"You should be a Data Scientist!"*) without verifiable mathematical grounding, missing prerequisite sequencing, or proof-of-competency requirements.

Learners and early-career professionals ask:
> *"Don't just tell me what skills I claim to have. Tell me what career I can actually prove I'm ready for, what blocks me, and exactly what evidence or learning will remove that block."*

### The Solution
The **Career Intelligence Instrument** is an evidence-aware career intelligence platform that deterministically maps raw learner artifacts (code repos, course transcripts, certifications, project dossiers, assessments) into verified competencies, evaluates role readiness with mathematical transparency, and constructs ordered prerequisite learning journeys.

---

## 2. Core Value Differentiators

| Traditional Career Tools | Career Intelligence Instrument |
| :--- | :--- |
| Resume text → AI Guess → Unexplained job list | Evidence → Normalized Skills → Deterministic Match Score → Ready Now vs Reachable |
| Treats course completion as full mastery | Deconstructs signals: Completion = weak signal (0.3), Assessment = strong signal (0.8), Production Project = high confidence (0.9) |
| Flat list of 20 missing technologies | Topological Directed Acyclic Graph (DAG) of prerequisites answering *"What do I learn first?"* |
| Hallucinated labour market claims | Curated reference labour data with explicit schema connectors for live enterprise feeds |
| Static recommendations | Interactive validation assessments that recalculate career readiness in real time upon completion |

---

## 3. Target User Personas

### Persona A: The Hands-On Builder (Frontend Specialist)
- **Background**: Computer Science graduate with 4 deployed React/TypeScript projects, GitHub commit histories, and CSS architecture portfolios.
- **Target Role**: Frontend Engineer / UI Systems Engineer.
- **System Outcome**: Classified as **Ready Now** (88% match). Low critical blocker count. Immediate employer portfolio dossier generated.

### Persona B: The Analytical Transitioner (Data Analyst)
- **Background**: Business background with coursework in Statistics, high-grade SQL project, Excel modeling, and exploratory analytics.
- **Target Role**: Data Analyst.
- **System Outcome**: Classified as **Ready Now** (82% match). Blocker identified: Power BI / dashboard deployment. Next action: 1 guided dashboard project.

### Persona C: The Ambitious Aspier (ML Explorer)
- **Background**: Student with Python basics and ML theory certificates, but zero production deployment, Docker, or data pipeline evidence.
- **Target Role**: Machine Learning Engineer.
- **System Outcome**: Strictly categorized as **Reachable** (54% match), NOT Ready Now. Clear prerequisite path: Python Advanced → Databases/APIs → Docker & Containerization → MLOps / Model Deployment.

---

## 4. Key Functional Requirements

### FR-01: Multi-Source Evidence Ingestion & Skill Classification
- System shall ingest coursework, project repositories, certifications, documents, and manual claims.
- System shall classify all extracted skills into four strict epistemological tiers:
  - **CLAIMED**: Stated by user without supporting artifact.
  - **DETECTED**: Extracted via semantic parser from unstructured text.
  - **EVIDENCED**: Supported by verifiable project, repository, or credential artifact.
  - **VALIDATED**: Confirmed through interactive assessment or verified evaluation.

### FR-02: Deterministic Role Readiness Scoring Engine
- System shall evaluate match score using the formula:
  $$\text{Match Score} = W_c \cdot C + W_e \cdot E + W_p \cdot P + W_{exp} \cdot X + W_d \cdot D - \sum \text{Penalty}_{\text{blocker}}$$
- System shall enforce strict categorization:
  - **READY NOW**: Role Match $\ge 75\%$ AND Critical Skill Coverage $\ge 80\%$ AND all Essential Prerequisites met.
  - **REACHABLE**: Role Match $\ge 40\%$ AND Path length $\le 4$ prerequisite steps.

### FR-03: Prerequisite Graph & Ordered Gap Engine
- Missing competencies shall be organized into a topological DAG.
- System must output an ordered learning sequence where foundational dependencies precede advanced topics.

### FR-04: Structured Learning Resource Engine
- Recommended resources must map directly to missing competencies with difficulty level, estimated hours, provider, and target project opportunity.

### FR-05: Interactive Assessment & Live Recalculation
- Users can launch skill-specific validation assessments.
- Completing an assessment provides instant Bayesian confidence updates to the target skill and triggers immediate role readiness re-scoring.

### FR-06: Explainability Side-Drawer ("Why This Result?")
- Every career card, skill score, and recommendation must have an explainability drawer revealing mathematical weights, evidence sources, and blocker penalties.

---

## 5. Non-Goals (Hackathon Boundary)
- No fake live scraping of job boards during live demo; curated reference demand model is used with transparent labeling.
- No single monolithic LLM prompt deciding career destiny; AI is strictly restricted to extraction, normalization, and contextual explanations.

---

## 6. Acceptance Criteria
1. System runs locally with zero runtime crashes.
2. Switching personas dynamically updates all 10 intelligence views.
3. Taking a test immediately recalculates readiness and updates UI meters with fluid micro-animations.
4. "Explain This" drawer accurately shows arithmetic breakdown for any selected role.
