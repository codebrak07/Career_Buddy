# Career Matching — Classification & Threshold Architecture

## 1. Classification Boundaries: Ready Now vs Reachable

To maintain extreme credibility during live evaluation, the system executes an uncompromising two-tier classification pipeline:

```text
                                  +-----------------------+
                                  | Calculated Role Score |
                                  +-----------+-----------+
                                              |
                     +------------------------+------------------------+
                     |                                                 |
            Score >= 75%                                          Score >= 40%
        Critical Coverage >= 80%                              Max Graph Path <= 4
        Level-1 Blockers == 0                                 Blockers Removable
                     |                                                 |
                     v                                                 v
           +--------------------+                            +--------------------+
           |     READY NOW      |                            |     REACHABLE      |
           | Immediate Apply    |                            | Structured Bridge  |
           +--------------------+                            +--------------------+
```

---

## 2. Threshold Justification

### Ready Now Criteria
1. **Overall Score $\ge 75\%$**: Indicates strong general alignment across skills, experience, and market demand.
2. **Critical Requirement Coverage $\ge 80\%$**: A candidate cannot be "Ready Now" for Frontend Engineer if they know TypeScript and CSS but do not know React/DOM architectures.
3. **Zero Critical Blockers**: High scores in optional tools (e.g. Figma, Git) cannot mask missing core engineering prerequisites.

### Reachable Criteria
1. **Overall Score $40\% - 74\%$**: The candidate already possesses foundational adjacencies (e.g., strong Python and Statistics for a Data Science role).
2. **Prerequisite Depth $\le 4$ steps**: Ensures the learning bridge is realistically attainable within 3–6 months rather than requiring a multi-year pivot.
