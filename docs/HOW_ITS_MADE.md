# How It's Made — Engineering Implementation Pipeline

## 1. Technical Stack Overview
- **Framework**: React 18 / 19 with TypeScript & Vite.
- **Styling Architecture**: TailwindCSS configured with **Creative OS** tokens (Obsidian dark base `#0B0D10`, warm ivory surfaces `#F4F3EE`, single accent flame `#FF6B35`, JetBrains Mono metadata).
- **Icons & Visuals**: Lucide React + canvas-confetti for assessment completion micro-moments.
- **State Management**: React Context with persistent reactive store.

---

## 2. End-to-End Pipeline

```text
1. User profile ingestion (Resume / Coursework / GitHub Link / Persona Switcher)
       ↓
2. Evidence Engine: Normalizes skill aliases to taxonomy IDs (e.g. "React.js" → "react-core")
       ↓
3. Epistemic Classifier: Categorizes into Claimed (0.15), Detected (0.35), Evidenced (0.75), Validated (1.00)
       ↓
4. Scoring Engine: Evaluates 6-factor deterministic linear model against all career roles
       ↓
5. Role Gatekeeper: Partitions outcomes into Ready Now (Score >= 75%, Critical >= 80%) vs Reachable
       ↓
6. Gap Engine: Extracts missing competencies and executes Topological Sort on the Prerequisite DAG
       ↓
7. Learning Engine: Maps ordered gap nodes to structured learning catalog & capstone projects
       ↓
8. Assessment Engine: Serves interactive technical validation tests
       ↓
9. Bayesian Confidence Update: Dynamically elevates skill status to "Validated"
       ↓
10. Live Re-scoring: Telemetry instruments and readiness meters recalculate instantaneously
```
