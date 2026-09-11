export type EpistemicState = 'claimed' | 'detected' | 'evidenced' | 'validated';
export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery';
export type SkillCategory = 'frontend' | 'backend' | 'data_ml' | 'devops_cloud' | 'fundamentals' | 'soft_skills';

export interface TaxonomySkill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  aliases: string[];
  prerequisites: string[]; // IDs of prerequisite skills
  coreKeywords: string[];
  marketDemandTier: 'Very High' | 'High' | 'Moderate' | 'Emerging';
}

export interface UserSkill {
  id: string;
  name: string;
  category: SkillCategory;
  state: EpistemicState;
  confidence: number; // 0 to 100
  evidenceStrength: number; // 0.0 to 1.0
  proficiency: SkillProficiency;
  evidenceSources: string[];
  lastValidated?: string;
}

export interface EvidenceArtifact {
  id: string;
  sourceType: 'github_repo' | 'coursework' | 'certification' | 'project_portfolio' | 'assessment';
  title: string;
  url?: string;
  date: string;
  extractedSkills: string[];
  evidenceStrength: number;
  verificationState: EpistemicState;
  metadata: {
    institution?: string;
    grade?: string;
    repoStats?: {
      stars: number;
      commits: number;
      languages: string[];
    };
    assessmentScore?: number;
    notes?: string;
  };
}

export interface RoleRequiredSkill {
  skillId: string;
  requiredLevel: SkillProficiency;
  importance: 'Critical' | 'Important' | 'Supplementary';
  weight: number; // 0.0 to 1.0
}

export interface CareerRole {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  baseDemandTier: 'Very High' | 'High' | 'Moderate' | 'Emerging';
  demandGrowthRate: string;
  salaryRange: string;
  hiringIndex: number; // 0-100
  requiredSkills: RoleRequiredSkill[];
  prerequisiteSequence: string[];
  benchmarkProfilesCount: number;
}

export interface RoleMatchScoreBreakdown {
  skillCoverageScore: number; // 0-100
  evidenceStrengthScore: number; // 0-100
  proficiencyAlignmentScore: number; // 0-100
  experienceAlignmentScore: number; // 0-100
  demandScore: number; // 0-100
  blockerPenalty: number; // 0-100
}

export interface SkillEvaluationTrace {
  skillId: string;
  skillName: string;
  importance: 'Critical' | 'Important' | 'Supplementary';
  requiredLevel: SkillProficiency;
  userLevel: SkillProficiency | 'None';
  userState: EpistemicState | 'missing';
  userConfidence: number;
  epistemicWeight: number; // e.g. 1.00, 0.75, 0.35, 0.15, 0.00
  coverageScore: number;   // 1.0 or 0.0
  evidenceScore: number;   // 0.0 to 1.0
  proficiencyAlignment: number; // 0.0 to 1.0
  assignedWeight: number;
  isSatisfied: boolean;
  isBlocker: boolean;
  auditNotes: string;
}

export interface BlockerTrace {
  skillId: string;
  skillName: string;
  reason: string;
  penaltyPoints: number; // e.g. 8
  prerequisitesNeeded: string[];
}

export interface AuditTrace {
  engineVersion: string;
  timestamp: string;
  roleId: string;
  roleTitle: string;
  candidateId: string;
  inputs: {
    totalSkillsInProfile: number;
    validatedSkillsCount: number;
    evidencedSkillsCount: number;
    claimedSkillsCount: number;
    artifactsCount: number;
  };
  skillEvaluations: SkillEvaluationTrace[];
  intermediateFactors: {
    weightedCoverageRaw: number;
    weightedCoveragePercent: number;
    weightedEvidenceRaw: number;
    weightedEvidencePercent: number;
    weightedProficiencyRaw: number;
    weightedProficiencyPercent: number;
    experienceScore: number;
    marketDemandScore: number;
  };
  blockers: BlockerTrace[];
  totalBlockerPenalty: number;
  calculationEquation: string;
  finalRawScore: number;
  finalScore: number;
  classification: 'READY_NOW' | 'REACHABLE' | 'EXPLORATORY';
  classificationGatekeeperReason: string;
}

export interface MissingCompetency {
  skillId: string;
  skillName: string;
  importance: 'Critical' | 'Important' | 'Supplementary';
  isBlocker: boolean;
  userCurrentLevel: SkillProficiency | 'None';
  userConfidence: number;
  targetLevel: SkillProficiency;
  prerequisites: string[];
  reason: string;
}

export interface NextBestAction {
  skillId: string;
  skillName: string;
  actionTitle: string;
  actionDescription: string;
  resourceId?: string;
  assessmentId?: string;
  expectedScoreBoost: number;
  estimatedHours: number;
}

export interface RoleMatchResult {
  roleId: string;
  role: CareerRole;
  category: 'READY_NOW' | 'REACHABLE' | 'EXPLORATORY';
  overallScore: number; // 0-100
  breakdown: RoleMatchScoreBreakdown;
  auditTrace: AuditTrace; // First-class immutable calculation trace
  matchedSkillsCount: number;
  totalRequiredSkills: number;
  criticalCoveragePercent: number;
  strongEvidenceSkills: string[];
  missingCompetencies: MissingCompetency[];
  nextBestAction: NextBestAction;
  prerequisitePath: string[];
  explainabilitySummary: string;
}

export interface LearningResource {
  id: string;
  title: string;
  provider: string;
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

export interface AssessmentQuestion {
  id: string;
  prompt: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface SkillAssessment {
  id: string;
  skillId: string;
  skillName: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeLimitMinutes: number;
  questions: AssessmentQuestion[];
  passingScore: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  isCustomCandidate?: boolean;
  targetRoleId?: string;
  avatarSeed: string;
  headline: string;
  bio: string;
  education: {
    institution: string;
    degree: string;
    field: string;
    graduationYear: number;
    gpa?: string;
  }[];
  experience: {
    title: string;
    company: string;
    period: string;
    highlights: string[];
    skillsUsed: string[];
  }[];
  artifacts: EvidenceArtifact[];
  skills: Record<string, UserSkill>;
  assessmentHistory: {
    assessmentId: string;
    skillId: string;
    score: number;
    passed: boolean;
    date: string;
  }[];
  trajectoryLog: {
    timestamp: string;
    event: string;
    affectedSkill: string;
    deltaConfidence: number;
    readinessDeltaRole?: string;
    readinessDeltaScore?: number;
  }[];
}
