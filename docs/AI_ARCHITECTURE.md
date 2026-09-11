# AI Architecture — The LLM vs Deterministic Boundary

## 1. Explicit Architectural Boundary

```text
+---------------------------------------------------------------------------------------+
|                                    USER INPUT                                         |
|                 Raw Resume Text · GitHub README · Syllabus Document                   |
+------------------------------------------+--------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                             AI SEMANTIC EXTRACTION LAYER                              |
|                                                                                       |
|  1. Entity Recognition: Extracts mentioned skills, tools, and courses                 |
|  2. Semantic Normalization: Maps "Py3", "python scripting" -> Standard ID "python"    |
|  3. Context Extraction: Distinguishes "Built project in X" from "Interested in X"     |
|  4. Natural Language Synthesis: Generates contextual summaries of evidence            |
+------------------------------------------+--------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                            STRICT PARSED SCHEMA CONTRACT                              |
|           `{ extractedSkills: string[], source: string, contextType: string }`        |
+------------------------------------------+--------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                            DETERMINISTIC INTELLIGENCE LAYER                           |
|                                                                                       |
|  1. Epistemic Classification (Claimed vs Detected vs Evidenced vs Validated)         |
|  2. 6-Factor Career Readiness Score Computation                                       |
|  3. Ready Now vs Reachable Gatekeeper Logic                                           |
|  4. Prerequisite DAG Topological Sort                                                 |
|  5. Blocker Penalty Calculation                                                       |
|  6. Bayesian Competency Confidence Update                                             |
+---------------------------------------------------------------------------------------+
```

---

## 2. Guardrails Against Hallucination
- **No LLM in the Loop for Scoring**: The LLM NEVER outputs scores or thresholds.
- **Strict Fallback Guarantee**: If the LLM API is unavailable, times out, or returns malformed JSON, the deterministic Regex & Keyword Classifier executes seamlessly.
