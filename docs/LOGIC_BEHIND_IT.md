# Logic Behind It — Mathematical & Cognitive Foundations

This document is the conceptual defense of every formula, threshold, and classification decision in the **Career Intelligence Instrument**.

---

## 1. Why Course Completion Does NOT Equal Mastery

### The Flaw of Traditional LMS
Most learning platforms operate on binary state:
$$\text{Video Watched} = 100\% \text{ Mastery}$$
In reality, passive video consumption tests endurance, not problem-solving.

### Our Epistemic Signal Weighting
We assign asymmetric weights to different evidence sources:
- **Self-Claimed Keyword**: $S_{\text{raw}} = 0.15$ (Minimal signal; anyone can type a skill)
- **Coursework / Certificate**: $S_{\text{raw}} = 0.35$ (Proof of exposure/participation, but unverified retention)
- **Code Repository / Project Artifact**: $S_{\text{raw}} = 0.75$ (Contextual application with syntax and structure)
- **Verified Assessment / Timed Evaluation**: $S_{\text{raw}} = 1.00$ (Active retrieval under constraint)

```text
Claimed (15%)  -->  Detected (35%)  -->  Evidenced (75%)  -->  Validated (100%)
```

---

## 2. The Career Readiness Matching Formula

We reject opaque vector similarity embeddings for primary career scoring because vector distance cannot explain *why* a candidate failed a critical safety threshold.

Instead, we use a 6-factor deterministic linear model:

$$\text{Readiness Index} = W_c \cdot C + W_e \cdot E + W_p \cdot P + W_x \cdot X + W_d \cdot D - P_b$$

Where:
- $C$ (**Skill Coverage**, weight $0.35$): Proportion of mandatory competencies possessed.
  $$C = \frac{\sum_{s \in R_{\text{req}}} \mathbb{I}(s \in U_{\text{skills}})}{|R_{\text{req}}|}$$
- $E$ (**Evidence Strength**, weight $0.25$): Mean epistemic signal strength across matched skills.
  $$E = \frac{1}{|R_{\text{req}} \cap U_{\text{skills}}|} \sum_{s} \text{EvidenceWeight}(s)$$
- $P$ (**Proficiency Alignment**, weight $0.15$): Harmonic mean of user proficiency vs target role requirement level.
- $X$ (**Experience & Project Alignment**, weight $0.10$): Relevant project count and domain tenure.
- $D$ (**Labour Market Demand Factor**, weight $0.15$): Normalized market demand coefficient for role stability.
- $P_b$ (**Blocker Penalty**): Direct penalty for missing Tier-1 foundational competencies:
  $$P_b = 0.08 \times \text{Count}(\text{Missing Critical Competencies})$$

---

## 3. Why Ready Now vs Reachable are Strictly Separated

A flat 1-to-100 list induces choice paralysis. A candidate with a 65% score might think: *"I'm more than half-way there, I should apply!"* — only to be instantly rejected for lacking a non-negotiable prerequisite (e.g., SQL for a Database Architect).

### Strict Gatekeeper Thresholds
- **READY NOW**:
  1. Total Readiness Score $\ge 75\%$
  2. Critical Skill Coverage $\ge 80\%$
  3. Zero unresolved Level-1 blockers
- **REACHABLE**:
  1. Total Readiness Score $\ge 40\%$
  2. Topological Path Length $\le 4$ graph steps

This gives candidates honest, psychologically safe guidance: *"You have a credible bridge to this career, but you must cross step 1 before step 2."*

---

## 4. Why Gaps Must Be a Prerequisite Graph (DAG)

If a candidate is missing:
`Python, Docker, Kubernetes, System Design, FastAPI`

Presenting them as a flat alphabetical list leads to disastrous learning choices (e.g. attempting Kubernetes before writing an API).

### Graph Traversal Logic
We define a directed acyclic graph $G = (V, E)$ where $(u, v) \in E$ means competency $u$ is a prerequisite for competency $v$.
The Gap Engine runs Kahn's Algorithm / Topological Sort to linearize the graph:
1. Root nodes (in-degree = 0) become **Phase 1: Foundations**.
2. Intermediate nodes become **Phase 2: Core Engineering**.
3. Leaf nodes become **Phase 3: Role-Specific Specialization**.

---

## 5. Bayesian-Style Incremental Competency Updates

When a user passes an assessment, their skill score does not jump arbitrarily to 100%. We apply a calibrated learning rate update:

$$\text{Confidence}_{\text{new}} = \text{Confidence}_{\text{prev}} + \alpha \cdot (\text{Score} - \text{Confidence}_{\text{prev}})$$

Where:
- $\alpha = 0.65$ for initial validation
- $\alpha = 0.35$ for subsequent re-tests (prevents test-cramming volatility)

This guarantees defensible, incremental growth.
