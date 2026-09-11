# Scoring Engine — Mathematical Specification

## 1. Primary Career Match Equation

The role readiness match score is computed as a weighted sum of 5 distinct signals penalized by critical prerequisite deficiencies:

$$\text{Role Match Score} = \max\left(0, \min\left(100, \left(\sum_{i=1}^{5} W_i \cdot S_i - P_{\text{blocker}}\right) \times 100\right)\right)$$

### Vector Weights ($W_i$)

| Metric Symbol | Dimension | Weight ($W_i$) | Rationale |
| :---: | :--- | :---: | :--- |
| $S_1$ | **Skill Requirement Coverage** | `0.35` | Dominant factor: does candidate have the required core skills? |
| $S_2$ | **Evidence Strength Factor** | `0.25` | Verifiable proof: project code, repos, test scores vs claimed text. |
| $S_3$ | **Proficiency Alignment** | `0.15` | Level matching: Beginner vs Intermediate vs Advanced target level. |
| $S_4$ | **Experience & Artifact Quality** | `0.10` | Real-world projects, commit count, domain portfolio depth. |
| $S_5$ | **Labour Demand Alignment** | `0.15` | Market pull factor from curated demand reference. |

---

## 2. Evidence Strength Formulation ($S_2$)

For each required skill $s \in R_{\text{required}}$, the evidence score is evaluated based on the user's highest epistemic artifact:

$$\text{EvidenceScore}(s) = \begin{cases} 
1.00 & \text{if Validated (Assessment Score } \ge 75\%) \\
0.75 & \text{if Evidenced (GitHub repo / verifiable project)} \\
0.35 & \text{if Detected (Extracted from coursework / cert)} \\
0.15 & \text{if Claimed (Unsubstantiated profile claim)} \\
0.00 & \text{if Missing}
\end{cases}$$

$$S_2 = \frac{\sum_{s \in R_{\text{required}}} \text{EvidenceScore}(s)}{|R_{\text{required}}|}$$

---

## 3. Proficiency Alignment ($S_3$)

Let $L_u(s) \in \{1, 2, 3\}$ be the user's proficiency (1=Introductory, 2=Intermediate, 3=Advanced) and $L_r(s)$ be the role's required level:

$$\text{ProfAlignment}(s) = \min\left(1.0, \frac{L_u(s)}{L_r(s)}\right)$$

$$S_3 = \frac{\sum_{s \in R_{\text{required}}} \text{ProfAlignment}(s)}{|R_{\text{required}}|}$$

---

## 4. Blocker Penalty Formulation ($P_{\text{blocker}}$)

Certain role competencies are marked as **Critical Tier-1 Blocker** (e.g. `SQL` for Data Analyst, `React` for Frontend Engineer).

$$P_{\text{blocker}} = 0.08 \times \sum_{b \in R_{\text{critical}}} \mathbb{I}(\text{user is missing or low-evidence in } b)$$

If 2 critical blockers are missing, a flat penalty of $-0.16$ ($-16\%$) is applied to the overall readiness score, preventing false positive readiness.
