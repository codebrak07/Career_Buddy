# Learning Engine — Curated Resource Mapping & Action Engine

## 1. Schema & Structured Catalog

Recommendations must never be vague or hallucinated. Every resource in the catalog adheres to a strict schema:

```typescript
export interface LearningResource {
  id: string;
  title: string;
  provider: 'MIT OpenCourseWare' | 'Coursera' | 'freeCodeCamp' | 'DeepLearning.AI' | 'Official Docs';
  targetSkillId: string;
  competencyOutcome: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  format: 'Interactive Course' | 'Hands-on Lab' | 'Documentation Guide' | 'Project Blueprint';
  estimatedHours: number;
  url: string;
  prerequisites: string[];
  capstoneProject: {
    title: string;
    description: string;
    evidenceOutput: string;
  };
}
```

---

## 2. Gap-to-Action Mapping Pipeline

```text
Missing Competency in DAG
            ↓
Query Learning Catalog for targetSkillId & matching difficulty
            ↓
Filter out resources whose prerequisites are not yet completed
            ↓
Select primary resource + concrete Capstone Evidence Project
            ↓
Display in UI with direct "Why Recommended" justification tag
```

---

## 3. "Next Best Action" Determination

The Learning Engine computes a single highest-leverage action:
$$\text{LeverageScore}(s) = \frac{\Delta \text{Readiness Increase}}{\text{Estimated Hours to Complete}}$$

The skill with the highest leverage score is spotlighted as the candidate's **Next Best Action**.
