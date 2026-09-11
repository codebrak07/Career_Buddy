import { SKILLS_TAXONOMY } from '../data/skillsTaxonomy';
import type { EpistemicState, EvidenceArtifact, SkillProficiency, UserSkill } from '../types';

export function normalizeSkillName(rawName: string): string | null {
  const clean = rawName.trim().toLowerCase();
  
  // Direct id match
  if (SKILLS_TAXONOMY[clean]) return clean;

  // Search aliases and keywords
  for (const [id, skill] of Object.entries(SKILLS_TAXONOMY)) {
    if (skill.name.toLowerCase() === clean) return id;
    if (skill.aliases.some(alias => alias.toLowerCase() === clean)) return id;
  }

  // Substring fuzzy match
  for (const [id, skill] of Object.entries(SKILLS_TAXONOMY)) {
    if (skill.coreKeywords.some(keyword => clean.includes(keyword.toLowerCase()))) {
      return id;
    }
  }

  return null;
}

export function calculateEpistemicWeight(state: EpistemicState): number {
  switch (state) {
    case 'validated': return 1.00;
    case 'evidenced': return 0.75;
    case 'detected': return 0.35;
    case 'claimed': return 0.15;
    default: return 0.00;
  }
}

export function deriveProficiencyFromScore(confidence: number): SkillProficiency {
  if (confidence >= 85) return 'Advanced';
  if (confidence >= 65) return 'Intermediate';
  if (confidence >= 30) return 'Beginner';
  return 'Beginner';
}

export function synthesizeSkillFromArtifact(
  skillId: string,
  artifact: EvidenceArtifact
): UserSkill {
  const taxonomy = SKILLS_TAXONOMY[skillId];
  const name = taxonomy ? taxonomy.name : skillId;
  const category = taxonomy ? taxonomy.category : 'fundamentals';

  const confidence = Math.round(artifact.evidenceStrength * 90);
  const proficiency = deriveProficiencyFromScore(confidence);

  return {
    id: skillId,
    name,
    category,
    state: artifact.verificationState,
    confidence,
    evidenceStrength: artifact.evidenceStrength,
    proficiency,
    evidenceSources: [`${artifact.sourceType.toUpperCase()}: ${artifact.title}`],
    lastValidated: artifact.verificationState === 'validated' ? artifact.date : undefined,
  };
}
