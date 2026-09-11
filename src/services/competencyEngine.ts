import { SKILLS_TAXONOMY } from '../data/skillsTaxonomy';
import { deriveProficiencyFromScore } from './evidenceEngine';
import type { UserProfile, UserSkill } from '../types';

export function applyAssessmentUpdate(
  profile: UserProfile,
  skillId: string,
  assessmentScore: number, // 0 - 100
  passed: boolean
): { updatedProfile: UserProfile; deltaConfidence: number; prevConfidence: number; newConfidence: number } {
  const existingSkill = profile.skills[skillId] || {
    id: skillId,
    name: SKILLS_TAXONOMY[skillId]?.name || skillId,
    category: SKILLS_TAXONOMY[skillId]?.category || 'fundamentals',
    state: 'claimed',
    confidence: 20,
    evidenceStrength: 0.15,
    proficiency: 'Beginner',
    evidenceSources: [],
  };

  const prevConfidence = existingSkill.confidence;
  
  // Bayesian update rule: larger step if currently only claimed, smaller refinement if already evidenced
  const learningRate = existingSkill.state === 'claimed' ? 0.70 : 0.45;
  const rawUpdatedConfidence = Math.round(
    prevConfidence + learningRate * (assessmentScore - prevConfidence)
  );
  
  const newConfidence = Math.max(15, Math.min(99, rawUpdatedConfidence));
  const deltaConfidence = newConfidence - prevConfidence;

  const updatedSkill: UserSkill = {
    ...existingSkill,
    confidence: newConfidence,
    state: passed && assessmentScore >= 70 ? 'validated' : 'evidenced',
    evidenceStrength: passed ? Math.max(existingSkill.evidenceStrength, 0.92) : Math.max(existingSkill.evidenceStrength, 0.60),
    proficiency: deriveProficiencyFromScore(newConfidence),
    lastValidated: new Date().toISOString().split('T')[0],
    evidenceSources: [
      `Technical Assessment (${assessmentScore}% score on ${new Date().toISOString().split('T')[0]})`,
      ...existingSkill.evidenceSources.filter(s => !s.startsWith('Technical Assessment'))
    ]
  };

  const updatedSkills = {
    ...profile.skills,
    [skillId]: updatedSkill,
  };

  const newLogEntry = {
    timestamp: new Date().toISOString().split('T')[0],
    event: `Completed Assessment for ${updatedSkill.name}: ${assessmentScore}% (${passed ? 'PASSED' : 'RETRY'})`,
    affectedSkill: skillId,
    deltaConfidence,
  };

  const updatedHistory = [
    {
      assessmentId: `assess-${skillId}`,
      skillId,
      score: assessmentScore,
      passed,
      date: new Date().toISOString().split('T')[0],
    },
    ...profile.assessmentHistory.filter(h => h.skillId !== skillId)
  ];

  const updatedProfile: UserProfile = {
    ...profile,
    skills: updatedSkills,
    assessmentHistory: updatedHistory,
    trajectoryLog: [newLogEntry, ...profile.trajectoryLog],
  };

  return {
    updatedProfile,
    deltaConfidence,
    prevConfidence,
    newConfidence,
  };
}
