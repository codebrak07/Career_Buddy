# Career Buddy

> **Evidence-Aware Technical Career Intelligence & Forensic Auditing Platform**  
> Deterministic 6-Factor Linear Kernel · Epistemic Competency Engine · Prerequisite DAG Sequencing · Zero-Hallucination Readiness Scoring

---

## Overview

**Career Buddy** is a career intelligence and technical skill auditing platform. Unlike legacy tools that accept self-reported resume claims and generate generic LLM advice, Career Buddy mathematically evaluates what candidates can **actually prove** they are ready for.

It bridges raw messy artifacts (PDF resumes, GitHub repositories, Coursera certifications, and live diagnostic assessments) into verified technical competencies, scores readiness using a defensible deterministic linear model, and dynamically generates phased topological learning paths.

---

## Core Innovations & Architecture

### 1. Deterministic 6-Factor Career Readiness Kernel
Scoring is calculated mathematically via a transparent linear equation—not a black-box LLM prompt:

$$\text{Readiness} = (0.35 \times \text{Coverage}) + (0.25 \times \text{Evidence}) + (0.15 \times \text{Proficiency}) + (0.10 \times \text{Experience}) + (0.15 \times \text{MarketDemand}) - \sum \text{BlockerPenalties}$$

* **Ready Now** ($\ge 75\%$ overall readiness AND $\ge 80\%$ critical skill coverage)
* **Reachable** ($40\% - 74\%$ readiness with clear blocker roadmaps)
* **Exploratory** ($< 40\%$ readiness)

### 2. 4-Tier Epistemic Competency Ledger
Every skill in a candidate's profile is strictly governed across four verifiable states:
* `CLAIMED`: Self-reported without tangible verification.
* `DETECTED`: Discovered from resume text or repository code via Groq AI LPU extraction.
* `EVIDENCED`: Grounded by verifiable artifacts (commit history, repos, coursework, project deliverables).
* `VALIDATED`: Scientifically proven through interactive Bayesian diagnostic assessments.

### 3. Topological Prerequisite DAG Graph
Orders missing competencies through a directed acyclic graph (Kahn's topological sort algorithm):
* **Phase 1**: Foundational Core
* **Phase 2**: Core Engineering & Frameworks
* **Phase 3**: Role Specialization & Production Capstone

### 4. Dual Workspace Architecture
* **Candidate Workspace**: Direct self-service portal for candidates to upload resumes, link GitHub repos, submit certifications, view their verified skill dossier, and take diagnostic tests.
* **Evaluator / Forensic Instrument**: Comprehensive auditing console for recruiters and technical leads to inspect mathematical traces, DAG dependency graphs, candidate comparisons, and test calibrations.

### 5. Career Buddy AI Assistant
Embedded assistant powered by Groq LPU fast inference (~150ms latency) that explains scoring formulas, guides user exploration, and provides real-time career advice.

---

## Tech Stack

* **Frontend**: React 19, TypeScript, Vite
* **Backend**: Express.js, Node.js (Static SPA delivery, API health monitoring, Groq AI inference proxy)
* **Styling**: Tailored CSS design tokens, modern editorial ivory theme (`#F9F8F5`, `#18181B`, `#FF4F00`)
* **AI & Document Parsing**: Groq Cloud LPU SDK, `pdfjs-dist` (pure in-browser PDF text extraction)
* **Visuals & Data**: Canvas Confetti, SVG Interactive Topological DAG Visualizer, Lucide Icons

---

## Quick Start

### Prerequisites
* Node.js (v18+)
* npm

### 1. Clone the repository
```bash
git clone https://github.com/codebrak07/Career_Buddy.git
cd Career_Buddy
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root:
```env
GROQ_API_KEY_1=your_groq_api_key_here
GROQ_API_KEY_2=your_fallback_key_here
```
*(Optional: App functions fully with built-in deterministic fallbacks even without an API key)*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Run Backend Server Locally
```bash
npm run build
npm start
```
Starts the Express server on [http://localhost:3001](http://localhost:3001) serving both backend APIs and the frontend.

### 6. Run Verification Engine Tests
```bash
npm run test:engines
```

### 7. Deploy to Render

This repository includes a `render.yaml` configuration for automatic deployment as a Render Web Service:

1. Connect your repository on Render ([render.com](https://render.com)).
2. Create a new **Web Service** or use the **Blueprints** feature with `render.yaml`.
3. Set the build and start commands:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
4. Add environment variables `GROQ_API_KEY_1` and `GROQ_API_KEY_2` in the Render dashboard.

---

## License
MIT License. Built with precision for the modern engineering workforce.
