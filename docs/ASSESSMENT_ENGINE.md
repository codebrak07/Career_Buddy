# Assessment Engine — Live Validation & Recalculation

## 1. Role & Objective

The Assessment Engine transforms self-reported claims into **Validated Competencies**.
When a candidate attempts an assessment:
1. It presents skill-targeted multiple-choice & scenario-based technical questions.
2. It evaluates accuracy, speed, and conceptual depth.
3. It immediately applies a Bayesian confidence update to the user's skill profile.
4. It updates the global Career Readiness indices in real time.

---

## 2. Dynamic Update Algorithm

```typescript
export function applyAssessmentResult(
  currentSkill: UserSkill,
  assessmentScore: number, // 0 to 100
  passed: boolean
): UserSkill {
  const learningRate = currentSkill.state === 'claimed' ? 0.70 : 0.40;
  const newConfidence = Math.round(
    currentSkill.confidence + learningRate * (assessmentScore - currentSkill.confidence)
  );

  return {
    ...currentSkill,
    confidence: Math.min(100, Math.max(10, newConfidence)),
    state: passed && assessmentScore >= 70 ? 'validated' : 'evidenced',
    evidenceStrength: passed ? Math.max(currentSkill.evidenceStrength, 0.90) : currentSkill.evidenceStrength,
    lastValidated: new Date().toISOString(),
  };
}
```

---

## 3. UI Reaction & Live Recalibration

Upon assessment submission:
1. The user's Evidence Dossier is stamped with a **[VALIDATED]** badge.
2. The skill radar and readiness bars transition fluidly to reflect the updated score.
3. A success notification displays: *"Python confidence increased from 58% to 84%. Machine Learning Engineer readiness upgraded from 54% to 68%."*
