# Failure Modes & Graceful Degradation

| Failure Mode | System Symptom | Handled Behavior & Defense |
| :--- | :--- | :--- |
| **Zero Evidence Submitted** | User submits only a name or 1 claimed buzzword | System displays **"Insufficient Evidence (High Uncertainty)"** badge. Readiness scores capped at <25%. Prompts user to link GitHub or take a baseline assessment. |
| **Malformed Resume / Syllabus Text** | Unstructured PDF paste with broken formatting | Semantic parser falls back to deterministic regex token matching against standardized taxonomy IDs. |
| **LLM API Timeout / Rate Limit** | AI extraction endpoint unreachable | Automatic silent switch to local client-side deterministic keyword extractor. Telemetry banner notifies: `[FALLBACK_DETERMINISTIC_PARSER_ACTIVE]`. |
| **Cyclic Dependency in Custom Skills** | Malformed prerequisite input from user | Topological sort uses Tarjan's cycle detection. Cycles are broken and logged to telemetry without crashing the UI. |
| **Exaggerated Self-Claims** | User checks "Expert" in 20 disparate technologies | Epistemic classification locks all unevidenced claims to `Claimed` ($W_e = 0.15$). Role readiness remains low until artifacts or test scores are supplied. |
