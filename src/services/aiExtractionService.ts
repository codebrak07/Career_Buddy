import { SKILLS_TAXONOMY } from '../data/skillsTaxonomy';
import type { EvidenceArtifact, EpistemicState } from '../types';
import { extractSkillsWithGroq } from './groqService';

export interface ExtractedSkillResult {
  skillId: string;
  skillName: string;
  detectedContext: string;
  suggestedState: EpistemicState;
  suggestedStrength: number;
}

export interface DocumentParseResult {
  extractedSkills: ExtractedSkillResult[];
  detectedArtifacts: EvidenceArtifact[];
  parsingEngine: 'AI_GROQ_LPU_INFERENCE' | 'DETERMINISTIC_TAXONOMY_FALLBACK';
  summary: string;
  modelDetails?: string;
}

export async function parseUnstructuredText(
  rawText: string,
  sourceType: 'resume' | 'coursework' | 'github_repo' | 'general' = 'general',
  forceDeterministic: boolean = false
): Promise<DocumentParseResult> {
  // 1. Try Groq AI extraction first if not forced deterministic
  if (!forceDeterministic && rawText.trim().length > 15) {
    try {
      const groqRes = await extractSkillsWithGroq(rawText, sourceType);
      if (groqRes.skills.length > 0) {
        const newArtifact: EvidenceArtifact = {
          id: `art-groq-${Date.now()}`,
          sourceType: sourceType === 'github_repo' ? 'github_repo' : sourceType === 'coursework' ? 'coursework' : 'project_portfolio',
          title: `Groq AI Extracted Artifact (${groqRes.skills.length} skills)`,
          date: new Date().toISOString().split('T')[0],
          extractedSkills: groqRes.skills.map(s => s.skillId),
          evidenceStrength: Math.max(...groqRes.skills.map(s => s.suggestedStrength)),
          verificationState: groqRes.skills.some(s => s.suggestedState === 'evidenced') ? 'evidenced' : 'detected',
          metadata: {
            notes: `Parsed via Groq LPU (${groqRes.modelUsed}): ${groqRes.summary}`,
          }
        };

        return {
          extractedSkills: groqRes.skills,
          detectedArtifacts: [newArtifact],
          parsingEngine: 'AI_GROQ_LPU_INFERENCE',
          summary: groqRes.summary,
          modelDetails: `Groq (${groqRes.modelUsed})`,
        };
      }
    } catch (err) {
      console.warn('Groq extraction encountered an issue, seamlessly using deterministic fallback.', err);
    }
  }

  // 2. Deterministic taxonomy regex fallback runs with 100% offline reliability
  const detectedMap = new Map<string, ExtractedSkillResult>();
  const lowerText = rawText.toLowerCase();

  for (const [id, skill] of Object.entries(SKILLS_TAXONOMY)) {
    let found = false;
    let matchContext = '';

    // Check main name
    if (lowerText.includes(skill.name.toLowerCase())) {
      found = true;
      matchContext = `Mention of "${skill.name}"`;
    }

    // Check aliases
    if (!found) {
      for (const alias of skill.aliases) {
        if (lowerText.includes(alias.toLowerCase())) {
          found = true;
          matchContext = `Detected keyword alias "${alias}"`;
          break;
        }
      }
    }

    // Check core keywords
    if (!found) {
      for (const kw of skill.coreKeywords) {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        if (regex.test(rawText)) {
          found = true;
          matchContext = `Found specific technical token "${kw}"`;
          break;
        }
      }
    }

    if (found) {
      let suggestedState: EpistemicState = 'detected';
      let suggestedStrength = 0.40;

      if (sourceType === 'github_repo' || lowerText.includes('github.com') || lowerText.includes('repository') || lowerText.includes('built project')) {
        suggestedState = 'evidenced';
        suggestedStrength = 0.75;
      } else if (sourceType === 'coursework' || lowerText.includes('grade:') || lowerText.includes('syllabus')) {
        suggestedState = 'detected';
        suggestedStrength = 0.50;
      } else if (lowerText.includes('familiar with') || lowerText.includes('interested in') || lowerText.includes('learning')) {
        suggestedState = 'claimed';
        suggestedStrength = 0.20;
      }

      detectedMap.set(id, {
        skillId: id,
        skillName: skill.name,
        detectedContext: matchContext,
        suggestedState,
        suggestedStrength,
      });
    }
  }

  const extractedSkills = Array.from(detectedMap.values());

  const newArtifact: EvidenceArtifact = {
    id: `art-ingest-${Date.now()}`,
    sourceType: sourceType === 'github_repo' ? 'github_repo' : sourceType === 'coursework' ? 'coursework' : 'project_portfolio',
    title: `Imported Text Document (${extractedSkills.length} skills extracted)`,
    date: new Date().toISOString().split('T')[0],
    extractedSkills: extractedSkills.map(s => s.skillId),
    evidenceStrength: extractedSkills.length > 0 ? Math.max(...extractedSkills.map(s => s.suggestedStrength)) : 0.2,
    verificationState: extractedSkills.some(s => s.suggestedState === 'evidenced') ? 'evidenced' : 'detected',
    metadata: {
      notes: `Extracted via Deterministic Engine across ${rawText.split(/\s+/).length} words.`,
    }
  };

  return {
    extractedSkills,
    detectedArtifacts: extractedSkills.length > 0 ? [newArtifact] : [],
    parsingEngine: 'DETERMINISTIC_TAXONOMY_FALLBACK',
    summary: `Extracted ${extractedSkills.length} technical competencies across ${rawText.split(/\s+/).length} words of submitted text.`,
  };
}
