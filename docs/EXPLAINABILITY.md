# Explainability Layer — Telemetry & Audit Trails

## 1. The "Explain This" Component Specification

Every critical metric in the application is backed by an interactive telemetry drawer.
Clicking `[EXPLAIN READINESS]` opens a drawer displaying:

```text
┌─────────────────────────────────────────────────────────────┐
│ EXPLAINABILITY AUDIT TRAIL: DATA ANALYST                    │
├─────────────────────────────────────────────────────────────┤
│ Final Readiness Score: 82% (READY NOW)                      │
│                                                             │
│ MATHEMATICAL FACTOR BREAKDOWN:                              │
│ 1. Skill Coverage (Weight 35%):       91% (10/11 skills)    │
│ 2. Evidence Strength (Weight 25%):    78% (Projects + Cert) │
│ 3. Proficiency Alignment (Weight 15%): 85% (Target met)     │
│ 4. Experience & Portfolio (Weight 10%):70% (2 projects)     │
│ 5. Market Demand Factor (Weight 15%): 90% (Tier-1 Demand)   │
│                                                             │
│ PENALTIES & BLOCKERS:                                       │
│ - Blocker: Power BI / Tableau Dashboard (Penalty: -8%)      │
│                                                             │
│ VERIFIABLE EVIDENCE TRACE:                                  │
│ + SQL: Advanced project query artifact found (Weight: 0.85) │
│ + Statistics: University transcript CS204 Grade A (0.75)    │
│ + Python: Pandas / NumPy exploratory notebook (0.70)        │
│                                                             │
│ RECOMMENDED REMEDIATION:                                    │
│ Complete "Power BI Executive Dashboard" Capstone (+8% boost)│
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Dynamic Natural Language Rationale Generation

The system deterministically formats human-readable explanations based on the exact telemetry vectors:
- **Strongest Positive Drivers**: Top 3 evidenced skills that contributed the highest point shares.
- **Top Vulnerability / Blocker**: The single missing competency with the highest negative weight.
- **Next High-Leverage Step**: The concrete action with the maximum expected point increase.
