# Data Model — TypeScript Interfaces & Schemas

## 1. Complete Type Hierarchy

```typescript
// Epistemic verification states
export type EpistemicState = 'claimed' | 'detected' | 'evidenced' | 'validated';
export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery';

export interface UserSkill {
  id: string; // matches SkillTaxonomy id (e.g. 'react', 'python', 'docker')
  name: string;
  category: 'frontend' | 'backend' | 'data_ml' | 'devops_cloud' | 'fundamentals' | 'soft_skills';
  state: EpistemicState;
  confidence: number; // 0 - 100
  evidenceStrength: number; // 0.0 - 1.0
  proficiency: SkillProficiency;
  evidenceSources: string[]; // e.g. ['GitHub: ecommerce-app', 'Course: CS50']
  lastValidated?: string;
}

export interface CareerRole {
  id: string;
  title: string;
  category: string;
  description: string;
  baseDemandTier: 'Very High' | 'High' | 'Moderate' | 'Emerging';
  demandGrowthRate: string; // e.g. '+24% YoY'
  salaryRange: string; // e.g. '$95k - $145k'
  requiredSkills: {
    skillId: string;
    requiredLevel: SkillProficiency;
    importance: 'Critical' | 'Important' | 'Supplementary';
    weight: number; // 0.0 - 1.0
  }[];
  prerequisiteSequence: string[]; // skill IDs ordered
}

export interface RoleMatchResult {
  roleId: string;
  roleTitle: string;
  category: 'READY_NOW' | 'REACHABLE' | 'EXPLORATORY';
  overallScore: number; // 0 - 100
  breakdown: {
    skillCoverageScore: number; // 0 - 100
    evidenceStrengthScore: number; // 0 - 100
    proficiencyAlignmentScore: number; // 0 - 100
    experienceAlignmentScore: number; // 0 - 100
    demandScore: number; // 0 - 100
    blockerPenalty: number; // 0 - 100
  };
  matchedSkillsCount: number;
  totalRequiredSkills: number;
  criticalCoveragePercent: number;
  strongEvidenceSkills: string[];
  missingCompetencies: {
    skillId: string;
    skillName: string;
    importance: 'Critical' | 'Important' | 'Supplementary';
    isBlocker: boolean;
    requiredLevel: SkillProficiency;
  }[];
  nextBestAction: {
    skillId: string;
    skillName: string;
    actionDescription: string;
    expectedScoreBoost: number;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    graduationYear: number;
    gpa?: string;
  }[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
    skillsUsed: string[];
  }[];
  projects: {
    title: string;
    description: string;
    repoUrl?: string;
    liveUrl?: string;
    techStack: string[];
    evidenceWeight: number;
  }[];
  certifications: {
    name: string;
    issuer: string;
    issueDate: string;
    skillsVerified: string[];
  }[];
  skills: Record<string, UserSkill>;
}
```
