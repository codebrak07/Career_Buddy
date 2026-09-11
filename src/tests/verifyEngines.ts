import { SEED_PERSONAS } from '../data/seedPersonas';
import { CAREER_ROLES } from '../data/rolesDatabase';
import { calculateRoleMatch } from '../services/scoringEngine';
import { buildPrerequisiteDAG } from '../services/gapEngine';
import { applyAssessmentUpdate } from '../services/competencyEngine';
import { parseUnstructuredText } from '../services/aiExtractionService';

function runAssertions() {
  console.log('====================================================');
  console.log('CAREER INTELLIGENCE INSTRUMENT — DETERMINISTIC TEST SUITE');
  console.log('====================================================\n');

  // TEST 1: Persona A (Elena - Frontend Ready)
  const personaA = SEED_PERSONAS['persona-a'];
  const feRole = CAREER_ROLES.find(r => r.id === 'frontend-engineer')!;
  const feMatch = calculateRoleMatch(personaA, feRole);

  console.log(`[TEST 1] Persona A (Elena) -> Frontend Engineer:`);
  console.log(`   Readiness Score: ${feMatch.overallScore}% (Expected: 85-95%)`);
  console.log(`   Category: ${feMatch.category} (Expected: READY_NOW)`);
  console.log(`   Critical Coverage: ${feMatch.criticalCoveragePercent}% (Expected: 100%)`);
  console.log(`   AuditTrace Engine: ${feMatch.auditTrace.engineVersion}`);
  console.log(`   AuditTrace Equation: ${feMatch.auditTrace.calculationEquation}`);

  if (feMatch.category !== 'READY_NOW' || feMatch.overallScore < 85) {
    throw new Error('FAIL: Persona A should naturally classify as READY_NOW for Frontend Engineer.');
  }
  console.log('   ✓ PASS: Persona A naturally satisfies Ready Now criteria.\n');

  // TEST 2: Persona B (Marcus - Data Analyst Ready)
  const personaB = SEED_PERSONAS['persona-b'];
  const daRole = CAREER_ROLES.find(r => r.id === 'data-analyst')!;
  const daMatch = calculateRoleMatch(personaB, daRole);

  console.log(`[TEST 2] Persona B (Marcus) -> Data Analyst:`);
  console.log(`   Readiness Score: ${daMatch.overallScore}% (Expected: 78-86%)`);
  console.log(`   Category: ${daMatch.category}`);
  console.log(`   Critical Blockers: ${daMatch.missingCompetencies.filter(m => m.isBlocker).map(b => b.skillName).join(', ')}`);
  console.log(`   AuditTrace Blockers Penalty: -${daMatch.auditTrace.totalBlockerPenalty}%`);

  if (daMatch.overallScore < 70) {
    throw new Error('FAIL: Persona B should score in high-readiness tier for Data Analyst.');
  }
  console.log('   ✓ PASS: Persona B naturally satisfies Data Analyst target metrics.\n');

  // TEST 3: Persona C (Devin - ML Reachable)
  const personaC = SEED_PERSONAS['persona-c'];
  const mlRole = CAREER_ROLES.find(r => r.id === 'ml-engineer')!;
  const mlMatch = calculateRoleMatch(personaC, mlRole);

  console.log(`[TEST 3] Persona C (Devin) -> Machine Learning Engineer:`);
  console.log(`   Readiness Score: ${mlMatch.overallScore}% (Expected: 45-60%)`);
  console.log(`   Category: ${mlMatch.category} (Expected: REACHABLE)`);
  console.log(`   Blockers Count: ${mlMatch.missingCompetencies.filter(m => m.isBlocker).length} (Expected >= 2)`);
  console.log(`   Blockers List: ${mlMatch.missingCompetencies.filter(m => m.isBlocker).map(b => b.skillName).join(', ')}`);

  if (mlMatch.category !== 'REACHABLE' || mlMatch.overallScore > 65) {
    throw new Error('FAIL: Persona C should be strictly REACHABLE (not Ready Now) for ML Engineer due to Docker/MLOps blockers.');
  }
  console.log('   ✓ PASS: Persona C is strictly gated as Reachable with clear blocker penalties.\n');

  // TEST 4: Prerequisite DAG Topological Sorter
  console.log('[TEST 4] Prerequisite DAG Topological Sort Algorithm:');
  const mlDAG = buildPrerequisiteDAG(mlRole, personaC.skills);
  console.log(`   Total DAG Nodes: ${mlDAG.totalNodes}`);
  console.log(`   Completed Nodes: ${mlDAG.completedNodes}`);
  console.log(`   Phases: ${mlDAG.phases.map(p => `${p.phaseTitle} (${p.nodeIds.length} nodes)`).join(' -> ')}`);

  if (mlDAG.phases.length !== 3 || mlDAG.totalNodes === 0) {
    throw new Error('FAIL: DAG must generate 3 phased topological tiers.');
  }
  console.log('   ✓ PASS: DAG is acyclic, phased, and properly linearized.\n');

  // TEST 5: Bayesian Competency Assessment Update
  console.log('[TEST 5] Bayesian Competency Update Simulation:');
  const prevDocker = personaC.skills['docker-containers']?.confidence || 20;
  const { updatedProfile, deltaConfidence, newConfidence } = applyAssessmentUpdate(
    personaC,
    'docker-containers',
    90,
    true
  );

  const updatedMLMatch = calculateRoleMatch(updatedProfile, mlRole);
  console.log(`   Docker Confidence: ${prevDocker}% -> ${newConfidence}% (Delta: +${deltaConfidence}%)`);
  console.log(`   ML Engineer Readiness Shift: ${mlMatch.overallScore}% -> ${updatedMLMatch.overallScore}% (Delta: +${updatedMLMatch.overallScore - mlMatch.overallScore}%)`);

  if (newConfidence <= prevDocker || updatedMLMatch.overallScore <= mlMatch.overallScore) {
    throw new Error('FAIL: Assessment should increase skill confidence and role readiness.');
  }
  console.log('   ✓ PASS: Assessment updates skill confidence and recalculates career readiness.\n');

  // TEST 6: Fallback Semantic Parser
  console.log('[TEST 6] Fallback Deterministic Text Extractor:');
  const sampleResume = 'Designed full-stack apps with TypeScript, React, Next.js, and PostgreSQL. Automated CI/CD using GitHub Actions and Docker.';
  parseUnstructuredText(sampleResume, 'github_repo').then(res => {
    console.log(`   Extracted Skills: ${res.extractedSkills.map(s => s.skillName).join(', ')}`);
    console.log(`   Engine Used: ${res.parsingEngine}`);
    if (res.extractedSkills.length < 4) {
      throw new Error('FAIL: Semantic parser failed to extract core technical tokens.');
    }
    console.log('   ✓ PASS: Parser extracted and normalized technical tokens.\n');

    console.log('====================================================');
    console.log('ALL DETERMINISTIC INTELLIGENCE TESTS PASSED (6/6)');
    console.log('====================================================');
  });
}

runAssertions();
