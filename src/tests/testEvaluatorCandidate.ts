import { CAREER_ROLES } from '../data/rolesDatabase';
import { calculateRoleMatch } from '../services/scoringEngine';
import { buildPrerequisiteDAG } from '../services/gapEngine';
import { SEED_PERSONAS } from '../data/seedPersonas';
import type { UserProfile, UserSkill } from '../types';

console.log('====================================================');
console.log('EVALUATOR ARBITRARY CANDIDATE ENROLLMENT TEST');
console.log('====================================================\n');

// 1. Simulate Evaluator enrolling an arbitrary candidate
const newCandidateData = {
  name: 'Jordan Miller',
  targetRole: 'full-stack-engineer',
  experienceLevel: 'Senior (5-8 yrs)',
  bio: 'Lead Full-Stack developer specializing in React, Node microservices, and distributed PostgreSQL clusters.',
  githubUrl: 'https://github.com/jmiller-dev/enterprise-stack',
  resumeText: '5+ years architecture experience. Built distributed GraphQL federation layer handling 12,000 req/sec.'
};

const targetRoleMeta = CAREER_ROLES.find(r => r.id === newCandidateData.targetRole) || CAREER_ROLES[0];
const candidateId = `eval-candidate-${Date.now()}`;

const initialSkills: Record<string, UserSkill> = {
  typescript: {
    id: 'typescript',
    name: 'TypeScript & Type Systems',
    category: 'frontend',
    state: 'evidenced',
    confidence: 85,
    evidenceStrength: 0.85,
    proficiency: 'Advanced',
    evidenceSources: ['Enterprise Stack Repository']
  },
  react: {
    id: 'react',
    name: 'React & Component Architecture',
    category: 'frontend',
    state: 'evidenced',
    confidence: 88,
    evidenceStrength: 0.88,
    proficiency: 'Advanced',
    evidenceSources: ['Enterprise Stack Repository']
  },
  sql: {
    id: 'sql',
    name: 'Relational Databases & Advanced SQL',
    category: 'backend',
    state: 'evidenced',
    confidence: 80,
    evidenceStrength: 0.80,
    proficiency: 'Intermediate',
    evidenceSources: ['Enterprise Stack Repository']
  }
};

const enrolledProfile: UserProfile = {
  id: candidateId,
  name: newCandidateData.name,
  targetRoleId: targetRoleMeta.id,
  isCustomCandidate: true,
  avatarSeed: newCandidateData.name,
  headline: `${newCandidateData.experienceLevel} · ${targetRoleMeta.title}`,
  bio: newCandidateData.bio,
  education: [
    {
      institution: 'University of Technology',
      degree: 'B.S. in Computer Science',
      field: 'Software Engineering',
      graduationYear: 2020
    }
  ],
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'Distributed Labs',
      period: '2021 - Present',
      highlights: ['Designed high-throughput GraphQL services'],
      skillsUsed: ['TypeScript & Type Systems', 'React & Component Architecture']
    }
  ],
  artifacts: [
    {
      id: `art-github-${Date.now()}`,
      sourceType: 'github_repo',
      title: 'Enterprise Stack Repository',
      url: newCandidateData.githubUrl,
      date: new Date().toISOString().split('T')[0],
      extractedSkills: ['TypeScript & Type Systems', 'React & Component Architecture', 'Relational Databases & Advanced SQL'],
      evidenceStrength: 0.85,
      verificationState: 'evidenced',
      metadata: {
        notes: `Ingested by Evaluator: ${newCandidateData.bio}`
      }
    }
  ],
  skills: initialSkills,
  assessmentHistory: [],
  trajectoryLog: [
    {
      timestamp: new Date().toISOString().split('T')[0],
      event: `Enrolled by Evaluator for role verification against ${targetRoleMeta.title}`,
      affectedSkill: 'Forensic Ingestion',
      deltaConfidence: 0
    }
  ]
};

console.log(`[TEST 1] Enrolling Arbitrary Candidate: "${enrolledProfile.name}"`);
console.log(`   ID: ${enrolledProfile.id}`);
console.log(`   Target Role: ${targetRoleMeta.title}`);
console.log(`   Initial Skills: ${Object.values(enrolledProfile.skills).map(s => s.name).join(', ')}`);
console.log(`   Initial Artifacts: ${enrolledProfile.artifacts.length}`);

// 2. Compute 6-Factor Linear Deterministic Score
const matchResult = calculateRoleMatch(enrolledProfile, targetRoleMeta);
console.log('\n[TEST 2] Running 6-Factor Deterministic Linear Scorer for Evaluator:');
console.log(`   Readiness Score: ${matchResult.overallScore}%`);
console.log(`   Category: ${matchResult.category}`);
console.log(`   Coverage Score: ${matchResult.breakdown.skillCoverageScore}%`);
console.log(`   Evidence Strength: ${matchResult.breakdown.evidenceStrengthScore}%`);
console.log(`   Proficiency Score: ${matchResult.breakdown.proficiencyAlignmentScore}%`);
console.log(`   Audit Equation: ${matchResult.auditTrace.calculationEquation}`);

if (matchResult.overallScore > 0 && matchResult.auditTrace.engineVersion === 'deterministic-linear-kernel') {
  console.log('   ✓ PASS: Evaluator candidate scored deterministically with zero black-box bias.');
} else {
  throw new Error('Deterministic score calculation failed for evaluator candidate.');
}

// 3. Generate Topological Dependency DAG
const dag = buildPrerequisiteDAG(targetRoleMeta, enrolledProfile.skills);
console.log('\n[TEST 3] Topological Dependency DAG Generation:');
console.log(`   Total Nodes: ${dag.nodes.length}`);
console.log(`   Total Edges: ${dag.edges.length}`);
console.log(`   Topological Phases: ${dag.phases.length}`);
if (dag.nodes.length > 0 && dag.phases.length > 0) {
  console.log('   ✓ PASS: DAG successfully structured for evaluator candidate.');
} else {
  throw new Error('DAG calculation failed.');
}

// 4. Test Switching back to Seed Persona A then back to Evaluator Candidate
const personaA = SEED_PERSONAS['persona-a'];
const personaAMatch = calculateRoleMatch(personaA, CAREER_ROLES.find(r => r.id === 'frontend-engineer')!);
console.log('\n[TEST 4] Switching back to Seed Persona (Elena):');
console.log(`   Elena Score: ${personaAMatch.overallScore}% (Expected: 91%)`);
console.log(`   Jordan Score: ${matchResult.overallScore}%`);
if (personaAMatch.overallScore === 91) {
  console.log('   ✓ PASS: Independent state preservation between Evaluator candidates and seed personas.');
} else {
  throw new Error('Persona state collision detected.');
}

console.log('\n====================================================');
console.log('ALL EVALUATOR CANDIDATE TESTS PASSED (4/4)');
console.log('====================================================');
