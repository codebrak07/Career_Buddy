import { SKILLS_TAXONOMY } from '../data/skillsTaxonomy';
import { calculateEpistemicWeight } from './evidenceEngine';
import type { 
  CareerRole, 
  MissingCompetency, 
  NextBestAction, 
  RoleMatchResult, 
  RoleMatchScoreBreakdown, 
  SkillProficiency, 
  UserProfile, 
  UserSkill,
  AuditTrace,
  SkillEvaluationTrace,
  BlockerTrace
} from '../types';

function proficiencyLevelToNumeric(p: SkillProficiency | 'None'): number {
  switch (p) {
    case 'Mastery': return 4;
    case 'Advanced': return 3;
    case 'Intermediate': return 2;
    case 'Beginner': return 1;
    default: return 0;
  }
}

export function calculateRoleMatch(
  profile: UserProfile,
  role: CareerRole
): RoleMatchResult {
  const userSkills: Record<string, UserSkill> = profile.skills || {};
  const required = role.requiredSkills;

  let totalMatched = 0;
  let criticalRequiredCount = 0;
  let criticalSatisfiedCount = 0;
  
  let weightedCoverageSum = 0;
  let weightedEvidenceSum = 0;
  let weightedProficiencySum = 0;
  let totalSkillWeight = 0;

  const missingCompetencies: MissingCompetency[] = [];
  const strongEvidenceSkills: string[] = [];
  const skillEvaluations: SkillEvaluationTrace[] = [];
  const blockers: BlockerTrace[] = [];

  for (const req of required) {
    const userSkill = userSkills[req.skillId];
    const skillMeta = SKILLS_TAXONOMY[req.skillId];
    const skillName = skillMeta ? skillMeta.name : req.skillId;
    const reqWeight = req.weight || 0.15;
    totalSkillWeight += reqWeight;

    const isCritical = req.importance === 'Critical';
    if (isCritical) criticalRequiredCount++;

    const targetNumeric = proficiencyLevelToNumeric(req.requiredLevel);

    if (userSkill) {
      const userNumeric = proficiencyLevelToNumeric(userSkill.proficiency);
      const epistemicWeight = calculateEpistemicWeight(userSkill.state);
      
      // Matched skill
      totalMatched++;
      const covScore = 1.0;
      const evScore = (userSkill.evidenceStrength * 0.5 + epistemicWeight * 0.5);
      const profAlignRatio = Math.min(1.0, userNumeric / Math.max(1, targetNumeric));

      weightedCoverageSum += covScore * reqWeight;
      weightedEvidenceSum += evScore * reqWeight;
      weightedProficiencySum += profAlignRatio * reqWeight;

      if (userSkill.confidence >= 75 && (userSkill.state === 'evidenced' || userSkill.state === 'validated')) {
        strongEvidenceSkills.push(skillName);
      }

      // Check if skill satisfies critical threshold (must be evidenced or validated, confidence >= 65)
      const isSatisfied = (!isCritical || (userSkill.confidence >= 65 && (userSkill.state === 'evidenced' || userSkill.state === 'validated')));
      const isBlocker = isCritical && !isSatisfied;

      if (isSatisfied && isCritical) {
        criticalSatisfiedCount++;
      } else if (isBlocker) {
        const blockerReason = `Critical skill '${skillName}' is in ${userSkill.state.toUpperCase()} state with unverified evidence confidence (${userSkill.confidence}% < 65% or lacking practical repository proof).`;
        
        missingCompetencies.push({
          skillId: req.skillId,
          skillName,
          importance: req.importance,
          isBlocker: true,
          userCurrentLevel: userSkill.proficiency,
          userConfidence: userSkill.confidence,
          targetLevel: req.requiredLevel,
          prerequisites: skillMeta ? skillMeta.prerequisites : [],
          reason: blockerReason
        });

        blockers.push({
          skillId: req.skillId,
          skillName,
          reason: blockerReason,
          penaltyPoints: 8,
          prerequisitesNeeded: skillMeta ? skillMeta.prerequisites : [],
        });
      }

      skillEvaluations.push({
        skillId: req.skillId,
        skillName,
        importance: req.importance,
        requiredLevel: req.requiredLevel,
        userLevel: userSkill.proficiency,
        userState: userSkill.state,
        userConfidence: userSkill.confidence,
        epistemicWeight,
        coverageScore: covScore,
        evidenceScore: Math.round(evScore * 100) / 100,
        proficiencyAlignment: Math.round(profAlignRatio * 100) / 100,
        assignedWeight: reqWeight,
        isSatisfied,
        isBlocker,
        auditNotes: `Matched via profile skill [${userSkill.id}], State: ${userSkill.state.toUpperCase()} (weight ${epistemicWeight}), Confidence: ${userSkill.confidence}%.`
      });

    } else {
      // Completely missing skill
      const isBlocker = isCritical;
      const blockerReason = isCritical 
        ? `Missing non-negotiable core requirement '${skillName}' for ${role.title}.`
        : `Recommended competency to maximize hiring placement.`;

      missingCompetencies.push({
        skillId: req.skillId,
        skillName,
        importance: req.importance,
        isBlocker,
        userCurrentLevel: 'None',
        userConfidence: 0,
        targetLevel: req.requiredLevel,
        prerequisites: skillMeta ? skillMeta.prerequisites : [],
        reason: blockerReason
      });

      if (isBlocker) {
        blockers.push({
          skillId: req.skillId,
          skillName,
          reason: blockerReason,
          penaltyPoints: 8,
          prerequisitesNeeded: skillMeta ? skillMeta.prerequisites : [],
        });
      }

      skillEvaluations.push({
        skillId: req.skillId,
        skillName,
        importance: req.importance,
        requiredLevel: req.requiredLevel,
        userLevel: 'None',
        userState: 'missing',
        userConfidence: 0,
        epistemicWeight: 0.0,
        coverageScore: 0.0,
        evidenceScore: 0.0,
        proficiencyAlignment: 0.0,
        assignedWeight: reqWeight,
        isSatisfied: false,
        isBlocker,
        auditNotes: `Skill absent from submitted evidence dossier.`
      });
    }
  }

  // Normalizing scores
  const normalizedCoverage = totalSkillWeight > 0 ? (weightedCoverageSum / totalSkillWeight) * 100 : 0;
  const normalizedEvidence = totalSkillWeight > 0 ? (weightedEvidenceSum / totalSkillWeight) * 100 : 0;
  const normalizedProficiency = totalSkillWeight > 0 ? (weightedProficiencySum / totalSkillWeight) * 100 : 0;

  // Experience Alignment (based on portfolio projects and internships)
  const experienceCount = profile.experience?.length || 0;
  const projectsCount = profile.artifacts?.filter(a => a.sourceType === 'github_repo' || a.sourceType === 'project_portfolio').length || 0;
  const experienceAlignment = Math.min(100, Math.round(experienceCount * 30 + projectsCount * 25));

  // Market Demand Factor (mapped from role hiring index)
  const demandScore = role.hiringIndex;

  // Blocker Penalties (Missing or weak critical requirements)
  const totalBlockerPenalty = blockers.reduce((sum, b) => sum + b.penaltyPoints, 0);

  // 6-Factor Linear Model
  const rawScore = (
    0.35 * normalizedCoverage +
    0.25 * normalizedEvidence +
    0.15 * normalizedProficiency +
    0.10 * experienceAlignment +
    0.15 * demandScore -
    totalBlockerPenalty
  );

  const overallScore = Math.max(5, Math.min(99, Math.round(rawScore)));

  const criticalCoveragePercent = criticalRequiredCount > 0 
    ? Math.round((criticalSatisfiedCount / criticalRequiredCount) * 100) 
    : 100;

  // Categorization Gatekeeper
  let category: 'READY_NOW' | 'REACHABLE' | 'EXPLORATORY' = 'EXPLORATORY';
  let gatekeeperReason = '';

  if (overallScore >= 75 && criticalCoveragePercent >= 80 && blockers.length === 0) {
    category = 'READY_NOW';
    gatekeeperReason = `Satisfies Ready Now criteria: Overall score (${overallScore}%) >= 75%, Critical coverage (${criticalCoveragePercent}%) >= 80%, and 0 active blockers.`;
  } else if (overallScore >= 38) {
    category = 'REACHABLE';
    gatekeeperReason = `Classified as Reachable: Overall score (${overallScore}%) is within bridge threshold (>=38%), gated by ${blockers.length} critical blocker(s).`;
  } else {
    category = 'EXPLORATORY';
    gatekeeperReason = `Exploratory interest: Foundational gap depth requires long-term prerequisite sequencing.`;
  }

  const breakdown: RoleMatchScoreBreakdown = {
    skillCoverageScore: Math.round(normalizedCoverage),
    evidenceStrengthScore: Math.round(normalizedEvidence),
    proficiencyAlignmentScore: Math.round(normalizedProficiency),
    experienceAlignmentScore: Math.round(experienceAlignment),
    demandScore: Math.round(demandScore),
    blockerPenalty: Math.round(totalBlockerPenalty),
  };

  // Next Best Action determination
  let nextBestAction: NextBestAction = {
    skillId: 'general',
    skillName: 'General Portfolio Expansion',
    actionTitle: 'Deploy a Capstone Application',
    actionDescription: 'Link a verifiable GitHub repository with live deployment and unit tests to elevate confidence.',
    expectedScoreBoost: 6,
    estimatedHours: 12,
  };

  if (blockers.length > 0) {
    const topBlocker = blockers[0];
    nextBestAction = {
      skillId: topBlocker.skillId,
      skillName: topBlocker.skillName,
      actionTitle: `Validate & Prove ${topBlocker.skillName}`,
      actionDescription: `Complete the ${topBlocker.skillName} verification assessment or link a dedicated project repository to remove the -8% blocker penalty.`,
      assessmentId: `assess-${topBlocker.skillId.split('-')[0]}`,
      expectedScoreBoost: 12,
      estimatedHours: 8,
    };
  } else if (missingCompetencies.length > 0) {
    const topMissing = missingCompetencies[0];
    nextBestAction = {
      skillId: topMissing.skillId,
      skillName: topMissing.skillName,
      actionTitle: `Master ${topMissing.skillName}`,
      actionDescription: `Complete the targeted learning module to reach ${topMissing.targetLevel} level.`,
      expectedScoreBoost: 7,
      estimatedHours: 14,
    };
  }

  const calculationEquation = `Readiness = (0.35 × ${Math.round(normalizedCoverage)}) + (0.25 × ${Math.round(normalizedEvidence)}) + (0.15 × ${Math.round(normalizedProficiency)}) + (0.10 × ${Math.round(experienceAlignment)}) + (0.15 × ${Math.round(demandScore)}) - ${totalBlockerPenalty}`;

  // Build first-class AuditTrace object
  const auditTrace: AuditTrace = {
    engineVersion: 'deterministic-linear-kernel',
    timestamp: new Date().toISOString(),
    roleId: role.id,
    roleTitle: role.title,
    candidateId: profile.id,
    inputs: {
      totalSkillsInProfile: Object.keys(userSkills).length,
      validatedSkillsCount: Object.values(userSkills).filter(s => s.state === 'validated').length,
      evidencedSkillsCount: Object.values(userSkills).filter(s => s.state === 'evidenced').length,
      claimedSkillsCount: Object.values(userSkills).filter(s => s.state === 'claimed').length,
      artifactsCount: profile.artifacts?.length || 0,
    },
    skillEvaluations,
    intermediateFactors: {
      weightedCoverageRaw: weightedCoverageSum,
      weightedCoveragePercent: Math.round(normalizedCoverage),
      weightedEvidenceRaw: weightedEvidenceSum,
      weightedEvidencePercent: Math.round(normalizedEvidence),
      weightedProficiencyRaw: weightedProficiencySum,
      weightedProficiencyPercent: Math.round(normalizedProficiency),
      experienceScore: experienceAlignment,
      marketDemandScore: demandScore,
    },
    blockers,
    totalBlockerPenalty,
    calculationEquation,
    finalRawScore: Math.round(rawScore * 10) / 10,
    finalScore: overallScore,
    classification: category,
    classificationGatekeeperReason: gatekeeperReason,
  };

  // Explainability Summary
  const explainabilitySummary = category === 'READY_NOW'
    ? `Ready Now: Strong alignment across ${strongEvidenceSkills.slice(0, 3).join(', ')} with ${criticalCoveragePercent}% critical requirement coverage.`
    : `Reachable: Solid foundations in ${strongEvidenceSkills.slice(0, 2).join(', ') || 'core principles'}, but gated by ${blockers.length} critical blocker(s): ${blockers.map(b => b.skillName).join(', ')}.`;

  return {
    roleId: role.id,
    role,
    category,
    overallScore,
    breakdown,
    auditTrace,
    matchedSkillsCount: totalMatched,
    totalRequiredSkills: required.length,
    criticalCoveragePercent,
    strongEvidenceSkills,
    missingCompetencies,
    nextBestAction,
    prerequisitePath: role.prerequisiteSequence,
    explainabilitySummary,
  };
}

export function matchAllRoles(
  profile: UserProfile,
  roles: CareerRole[]
): { readyNow: RoleMatchResult[]; reachable: RoleMatchResult[]; exploratory: RoleMatchResult[] } {
  const allResults = roles.map(role => calculateRoleMatch(profile, role));

  const readyNow = allResults
    .filter(r => r.category === 'READY_NOW')
    .sort((a, b) => b.overallScore - a.overallScore);

  const reachable = allResults
    .filter(r => r.category === 'REACHABLE')
    .sort((a, b) => b.overallScore - a.overallScore);

  const exploratory = allResults
    .filter(r => r.category === 'EXPLORATORY')
    .sort((a, b) => b.overallScore - a.overallScore);

  return { readyNow, reachable, exploratory };
}
