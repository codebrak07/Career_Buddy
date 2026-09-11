import type { RoleMatchResult, AuditTrace } from '../types';

export interface ExplainabilityReport {
  roleTitle: string;
  category: string;
  readinessScore: number;
  auditTrace: AuditTrace;
  mathematicalEquation: string;
  components: {
    label: string;
    score: number;
    weight: string;
    effectivePoints: number;
    interpretation: string;
  }[];
  criticalBlockers: {
    name: string;
    penalty: number;
    explanation: string;
  }[];
  strongestDrivers: {
    name: string;
    evidenceType: string;
    confidence: number;
  }[];
  recommendedRemediation: string;
}

export function generateExplainabilityReport(match: RoleMatchResult): ExplainabilityReport {
  const b = match.breakdown;
  const trace = match.auditTrace;

  const components = [
    {
      label: 'Skill Requirement Coverage',
      score: b.skillCoverageScore,
      weight: '35%',
      effectivePoints: Math.round(b.skillCoverageScore * 0.35),
      interpretation: `${match.matchedSkillsCount} of ${match.totalRequiredSkills} mandatory role competencies detected in profile.`,
    },
    {
      label: 'Evidence & Artifact Strength',
      score: b.evidenceStrengthScore,
      weight: '25%',
      effectivePoints: Math.round(b.evidenceStrengthScore * 0.25),
      interpretation: `Weighted epistemic proof from verified code repos, coursework, and assessments.`,
    },
    {
      label: 'Proficiency Alignment',
      score: b.proficiencyAlignmentScore,
      weight: '15%',
      effectivePoints: Math.round(b.proficiencyAlignmentScore * 0.15),
      interpretation: `Depth alignment against senior industry benchmark requirements for ${match.role.title}.`,
    },
    {
      label: 'Portfolio & Experience Depth',
      score: b.experienceAlignmentScore,
      weight: '10%',
      effectivePoints: Math.round(b.experienceAlignmentScore * 0.10),
      interpretation: `Hands-on tenure, deployed projects, and production artifacts in Evidence Dossier.`,
    },
    {
      label: 'Curated Labour Demand Factor',
      score: b.demandScore,
      weight: '15%',
      effectivePoints: Math.round(b.demandScore * 0.15),
      interpretation: `Role hiring index (${match.role.demandGrowthRate}) according to curated benchmark market reference.`,
    }
  ];

  const criticalBlockers = trace.blockers.map(b => ({
    name: b.skillName,
    penalty: -b.penaltyPoints,
    explanation: b.reason,
  }));

  const strongestDrivers = match.strongEvidenceSkills.map(name => ({
    name,
    evidenceType: 'Project Code / Verified Assessment',
    confidence: 85,
  }));

  return {
    roleTitle: match.role.title,
    category: match.category.replace('_', ' '),
    readinessScore: match.overallScore,
    auditTrace: trace,
    mathematicalEquation: trace.calculationEquation,
    components,
    criticalBlockers,
    strongestDrivers,
    recommendedRemediation: match.nextBestAction.actionDescription,
  };
}
