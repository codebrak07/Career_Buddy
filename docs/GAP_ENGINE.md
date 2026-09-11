# Gap Engine — Topological Prerequisite DAG

## 1. The Directed Acyclic Graph (DAG) Model

Competencies are not independent islands; they form strict hierarchical dependency trees.
We define a global dependency graph $G = (V, E)$, where an edge $(u, v) \in E$ denotes that skill $u$ is a strict prerequisite for skill $v$.

```text
[prog-foundations]
        │
        ├──> [python-core]
        │         │
        │         ├──> [data-structures] ──> [backend-apis] ──> [system-design]
        │         │                                                    │
        │         └──> [numpy-pandas] ─────> [ml-algorithms] ──────────┴──> [mlops-deployment]
        │
        └──> [javascript-core] ────────────> [react-ts] ─────────────> [frontend-arch]
```

---

## 2. Topological Sort & Sequencing Algorithm

When a target career (e.g. *Machine Learning Engineer*) is selected:
1. Identify all required skills $R = \{s_1, s_2, \dots, s_k\}$.
2. Filter for missing or low-confidence skills: $M = \{s \in R \mid \text{UserConfidence}(s) < \text{RequiredLevel}(s)\}$.
3. Expand $M$ to include all ancestor prerequisites $P = \bigcup_{s \in M} \text{Ancestors}(s)$.
4. Construct induced subgraph $G_M = (M \cup P, E')$.
5. Run **Topological Sort** (Kahn's algorithm) on $G_M$.
6. Group sorted nodes into actionable phases:
   - **Phase 1 (Foundations)**: Nodes with zero missing in-degree dependencies.
   - **Phase 2 (Core Competency)**: Nodes unlocked by Phase 1.
   - **Phase 3 (Role Specialization)**: Final target capstone nodes.

This guarantees the user is never told to learn *System Design* before they have built basic *Backend APIs*.
