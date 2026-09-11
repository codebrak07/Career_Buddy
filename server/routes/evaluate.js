import { Router } from 'express';

const router = Router();

/**
 * POST /api/evaluate
 * Deterministic 6-Factor Career Readiness Kernel verification
 */
router.post('/', (req, res) => {
  try {
    const {
      coverage = 0,
      evidence = 0,
      proficiency = 0,
      experience = 0,
      marketDemand = 0,
      blockerPenalties = 0
    } = req.body;

    // Deterministic 6-factor equation
    const rawScore =
      (0.35 * coverage) +
      (0.25 * evidence) +
      (0.15 * proficiency) +
      (0.10 * experience) +
      (0.15 * marketDemand) -
      blockerPenalties;

    const normalizedScore = Math.max(0, Math.min(100, Math.round(rawScore * 100) / 100));

    let tier = 'Exploratory';
    if (normalizedScore >= 75 && coverage >= 80) {
      tier = 'Ready Now';
    } else if (normalizedScore >= 40) {
      tier = 'Reachable';
    }

    return res.status(200).json({
      score: normalizedScore,
      tier,
      breakdown: {
        coverage: { weight: 0.35, value: coverage, contribution: +(0.35 * coverage).toFixed(2) },
        evidence: { weight: 0.25, value: evidence, contribution: +(0.25 * evidence).toFixed(2) },
        proficiency: { weight: 0.15, value: proficiency, contribution: +(0.15 * proficiency).toFixed(2) },
        experience: { weight: 0.10, value: experience, contribution: +(0.10 * experience).toFixed(2) },
        marketDemand: { weight: 0.15, value: marketDemand, contribution: +(0.15 * marketDemand).toFixed(2) },
        blockerPenalties: { penalty: blockerPenalties }
      },
      evaluatedAt: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ error: 'Evaluation failed', details: err.message });
  }
});

export default router;
