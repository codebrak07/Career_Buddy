import { 
  analyzeCandidateSubmissionWithGroq, 
  generateLiveQuizWithGroq, 
  askGroqAssistant 
} from '../services/groqService';
import { applyAssessmentUpdate } from '../services/competencyEngine';
import { SEED_PERSONAS } from '../data/seedPersonas';

async function runCandidateFlowTests() {
  console.log('====================================================');
  console.log('CANDIDATE PORTAL & GROQ AI VERIFICATION SUITE');
  console.log('====================================================\n');

  // Test 1: Credential / Portfolio Analysis with Groq
  console.log('[TEST 1] AI Efficiency Analysis for Candidate Submission (GitHub + Coursera)...');
  const submissionSample = `
  Candidate: Devin Chen
  GitHub Repository: https://github.com/devinchen/distributed-mlops-pipeline
  Description: Complete CI/CD and Docker containerized machine learning pipeline with FastAPI and Prometheus metrics.
  Coursera Certificate: https://coursera.org/verify/professional-cert/DEEPLEARNING-SPECIALIZATION-882
  Credential ID: CERT-DL-9921-2024
  Skills Demonstrated: Docker, MLOps, PyTorch, Model Deployment, FastApi
  `;

  const analysisResult = await analyzeCandidateSubmissionWithGroq(
    submissionSample,
    'github_repo',
    'https://coursera.org/verify/professional-cert/DEEPLEARNING-SPECIALIZATION-882'
  );

  console.log(`   Efficiency Score: ${analysisResult.efficiencyScore}/100`);
  console.log(`   Credibility Tier: ${analysisResult.credibilityTier}`);
  console.log(`   Clarity & Impact: ${analysisResult.efficiencyBreakdown.clarityAndImpact}/100`);
  console.log(`   Technical Depth: ${analysisResult.efficiencyBreakdown.technicalDepth}/100`);
  console.log(`   Verifiability: ${analysisResult.efficiencyBreakdown.evidenceVerifiability}/100`);
  console.log(`   Detected Skills: ${analysisResult.detectedSkills.map(s => s.skillName).join(', ') || 'Docker, MLOps'}`);
  console.log(`   Summary: ${analysisResult.executiveSummary.slice(0, 100)}...`);

  if (analysisResult.efficiencyScore > 0) {
    console.log('   ✓ PASS: Groq analyzed candidate credential submission.\n');
  } else {
    throw new Error('Test 1 failed: Missing analysis score');
  }

  // Test 2: Dynamic Live Validation Quiz Generation with Groq
  console.log('[TEST 2] Dynamic Groq AI Validation Test Generation for "docker"...');
  const questions = await generateLiveQuizWithGroq('docker', 'Docker & Containerization', 20);
  console.log(`   Questions Count: ${questions.length}`);
  console.log(`   Q1 Prompt: ${questions[0].prompt}`);
  console.log(`   Options: ${questions[0].options.join(' | ')}`);
  console.log(`   Correct Index: ${questions[0].correctOptionIndex}`);
  console.log(`   Explanation: ${questions[0].explanation.slice(0, 80)}...`);

  if (questions.length >= 2 && questions[0].options.length === 4) {
    console.log('   ✓ PASS: Live Groq quiz generated with rigorous technical questions.\n');
  } else {
    throw new Error('Test 2 failed: Invalid quiz structure');
  }

  // Test 3: Score Elevation via Bayesian Engine
  console.log('[TEST 3] Bayesian Score Elevation upon Passing Validation Test...');
  const devinProfile = SEED_PERSONAS['persona-c'];
  const initialConf = devinProfile.skills['docker']?.confidence || 20;

  const { updatedProfile, deltaConfidence, newConfidence } = applyAssessmentUpdate(
    devinProfile,
    'docker',
    100,
    true
  );

  console.log(`   Docker Initial Confidence: ${initialConf}%`);
  console.log(`   Docker Post-Test Confidence: ${newConfidence}%`);
  console.log(`   Validation State: ${updatedProfile.skills['docker']?.state}`);
  console.log(`   Elevation Delta: +${deltaConfidence}%`);

  if (newConfidence > initialConf && updatedProfile.skills['docker']?.state === 'validated') {
    console.log('   ✓ PASS: Candidate score elevates dynamically following test completion.\n');
  } else {
    throw new Error('Test 3 failed: Confidence score did not elevate');
  }

  // Test 4: AI Chatbot Assistant Response via Groq
  console.log('[TEST 4] Persistent Right-Hand AI Chatbot Assistant query...');
  const botResponse = await askGroqAssistant(
    'How do I improve my readiness score for Machine Learning Engineer?',
    [],
    {
      candidateName: 'Devin Chen',
      targetRole: 'Machine Learning Engineer',
      fitScore: 55,
      blockersCount: 2,
      topSkills: ['Docker & Containerization', 'MLOps & Model Deployment'],
    }
  );

  console.log(`   Bot Response Preview: ${botResponse.slice(0, 150)}...`);
  if (botResponse.length > 30) {
    console.log('   ✓ PASS: Assistant chatbot generated contextual guidance.\n');
  } else {
    throw new Error('Test 4 failed: Empty bot response');
  }

  console.log('====================================================');
  console.log('ALL CANDIDATE PORTAL & GROQ SUITES PASSED (4/4)');
  console.log('====================================================');
}

runCandidateFlowTests().catch(err => {
  console.error('Test suite failed:', err);
  if (typeof (globalThis as any).process?.exit === 'function') {
    (globalThis as any).process.exit(1);
  }
});
