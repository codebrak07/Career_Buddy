import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSESSMENTS_DATABASE } from '../../data/assessmentsDatabase';
import { SKILLS_TAXONOMY } from '../../data/skillsTaxonomy';
import { SectionIndex } from '../common/SectionIndex';
import { generateLiveQuizWithGroq } from '../../services/groqService';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Zap, 
  RotateCcw,
  Cpu,
  Lock,
  Sparkles,
  Loader2
} from 'lucide-react';

const EVAL_STAGES = [
  '[01/05] EVALUATING_RESPONSE...',
  '[02/05] UPDATING_COMPETENCY_BELIEF...',
  '[03/05] RECALCULATING_READINESS_SCORES...',
  '[04/05] UPDATING_CAREER_GRAPH_DAG...',
  '[05/05] NEXT_ACTION_READY'
];

export const AssessmentScreen: React.FC = () => {
  const { 
    activeAssessmentSkillId, 
    launchAssessment, 
    submitAssessment, 
    setActiveScreen, 
    userProfile,
    selectedRoleMatch,
    appMode,
    setAppMode
  } = useApp();

  const targetSkillId = activeAssessmentSkillId || 'docker-containers';
  const defaultAssessment = ASSESSMENTS_DATABASE[targetSkillId] || ASSESSMENTS_DATABASE['docker-containers'];
  const passingScore = defaultAssessment?.passingScore || 70;
  const skillMeta = SKILLS_TAXONOMY[targetSkillId];
  const previousSkillConfidence = userProfile.skills[targetSkillId]?.confidence || 20;

  const [activeQuestions, setActiveQuestions] = useState(defaultAssessment.questions);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalStageIdx, setEvalStageIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [scoreDeltas, setScoreDeltas] = useState<{
    prevConfidence: number;
    newConfidence: number;
    prevRoleScore: number;
    newRoleScore: number;
  } | null>(null);

  // Load dynamic Groq questions when skill changes
  useEffect(() => {
    let isCancelled = false;
    const loadGroqQuestions = async () => {
      setIsGeneratingQuestions(true);
      try {
        const groqQuestions = await generateLiveQuizWithGroq(
          targetSkillId, 
          skillMeta?.name || 'Technical Engineering', 
          previousSkillConfidence
        );
        if (!isCancelled && groqQuestions && groqQuestions.length >= 2) {
          setActiveQuestions(groqQuestions);
        }
      } catch {
        if (!isCancelled) {
          setActiveQuestions(defaultAssessment.questions);
        }
      } finally {
        if (!isCancelled) setIsGeneratingQuestions(false);
      }
    };

    loadGroqQuestions();
    return () => { isCancelled = true; };
  }, [targetSkillId]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted || isEvaluating) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitTest = () => {
    let correctCount = 0;
    activeQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / activeQuestions.length) * 100);
    const passed = score >= defaultAssessment.passingScore;

    setIsEvaluating(true);
    setEvalStageIdx(0);

    // Multi-stage sequential pipeline
    const stageInterval = setInterval(() => {
      setEvalStageIdx(prev => {
        if (prev < EVAL_STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stageInterval);
          setIsEvaluating(false);
          setTestScore(score);
          setSubmitted(true);

          if (passed) {
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 }
              });
            } catch {}
          }

          const prevRoleScore = selectedRoleMatch.overallScore;
          // Trigger actual submission in context
          submitAssessment(targetSkillId, score, passed);

          setScoreDeltas({
            prevConfidence: previousSkillConfidence,
            newConfidence: passed ? Math.min(100, previousSkillConfidence + 35) : previousSkillConfidence,
            prevRoleScore: prevRoleScore,
            newRoleScore: passed ? prevRoleScore + 11 : prevRoleScore
          });

          return prev;
        }
      });
    }, 450);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setIsEvaluating(false);
    setTestScore(0);
    setScoreDeltas(null);
  };

  const allAnswered = activeQuestions.every(q => selectedAnswers[q.id] !== undefined);

  return (
    <div className="space-y-6 py-4 max-w-4xl mx-auto">
      
      {/* Evaluator Mode Warning / Advisory Banner */}
      {appMode === 'evaluator' && (
        <div className="p-4 rounded-xl bg-orange-50 border border-[#FF4F00]/30 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#18181B] shadow-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#FF4F00] shrink-0" />
            <span>
              <strong>Candidate Action Protected:</strong> Validation test-taking is isolated to the Candidate Portal to protect evaluator audit integrity.
            </span>
          </div>
          <button 
            onClick={() => setAppMode('candidate')} 
            className="px-3 py-1.5 bg-[#FF4F00] hover:bg-[#E04500] text-white font-bold rounded-lg text-xs flex items-center gap-1 shrink-0 transition"
          >
            <span>Switch to Candidate Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Assessment Header */}
      <div className="bento-cell p-6 sm:p-8 rounded-2xl border border-[#E7E2D6] bg-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <SectionIndex 
            index="07" 
            label="DIAGNOSTIC VALIDATION" 
            sublabel="Direct technical assessments updating Bayesian competency beliefs in real time."
          />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#FF4F00] bg-orange-50 border border-[#FF4F00]/20 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DYNAMIC GROQ ENGINE</span>
            </span>
            <span className="text-xs font-mono text-[#71717A] bg-[#FAF9F5] border border-[#E7E2D6] px-2.5 py-1 rounded-lg font-bold">
              Benchmark: {defaultAssessment.passingScore}% Pass
            </span>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-[#E7E2D6]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h1 className="text-2xl font-bold text-[#18181B] tracking-tight">
              {defaultAssessment.title}
            </h1>
            {isGeneratingQuestions && (
              <span className="text-xs font-mono text-[#FF4F00] flex items-center gap-1.5 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Groq LPU Generating Live Questions...</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#52525B] mt-1 font-mono">
            Target Competency: <strong className="text-[#18181B]">{skillMeta?.name || targetSkillId}</strong> · Difficulty: {defaultAssessment.difficulty} · {activeQuestions.length} Diagnostic Items
          </p>

          {/* Assessment Selector Pills */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#E7E2D6]/70">
            <span className="text-[11px] font-mono text-[#A1A1AA] self-center mr-2 uppercase font-bold">Assessments:</span>
            {Object.values(ASSESSMENTS_DATABASE).map(a => (
              <button
                key={a.id}
                onClick={() => {
                  handleReset();
                  launchAssessment(a.skillId);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                  targetSkillId === a.skillId
                    ? 'bg-[#FF4F00] text-white font-bold shadow-xs'
                    : 'bg-[#FAF9F5] text-[#52525B] border border-[#E7E2D6] hover:bg-white'
                }`}
              >
                {a.skillName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Evaluating Computation Screen */}
      {isEvaluating && (
        <div className="bento-cell-dark p-8 rounded-2xl bg-[#18181B] text-white border border-stone-800 text-center space-y-4 shadow-lg animate-fade-in-up">
          <div className="w-12 h-12 rounded-full bg-[#FF4F00]/20 border border-[#FF4F00] flex items-center justify-center mx-auto text-[#FF4F00] animate-pulse">
            <Cpu className="w-6 h-6" />
          </div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#FF4F00] font-bold">
            Deterministic Engine Recalibration
          </div>
          <div className="text-xl font-mono font-bold text-white">
            {EVAL_STAGES[evalStageIdx]}
          </div>
          <div className="w-64 bg-stone-800 rounded-full h-2 mx-auto overflow-hidden">
            <div 
              className="bg-[#FF4F00] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((evalStageIdx + 1) / EVAL_STAGES.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Submitted Result Telemetry Box */}
      {submitted && (
        <div className={`bento-cell p-6 sm:p-8 rounded-2xl border-2 transition ${
          testScore >= passingScore
            ? 'border-emerald-500 bg-emerald-50/40'
            : 'border-rose-400 bg-rose-50/40'
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold">
                {testScore >= passingScore ? (
                  <span className="text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ASSESSMENT PASSED · VALIDATED STAMP APPLIED
                  </span>
                ) : (
                  <span className="text-rose-800 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" /> BENCHMARK UNMET · RETRY RECOMMENDED
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold text-[#18181B] mt-1 font-sans">
                Diagnostic Score: {testScore}% ({testScore >= passingScore ? 'Passed' : 'Needs Review'})
              </h2>
              <p className="text-xs text-[#52525B] mt-1">
                Your Bayesian competency confidence has been elevated and global career readiness re-scored across all targets.
              </p>

              {/* Live Competency & Career Shift Indicators */}
              {scoreDeltas && testScore >= passingScore && (
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-emerald-200 font-mono text-xs">
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-xs">
                    <div className="text-[10px] text-[#71717A] uppercase font-bold">{skillMeta?.name || 'Skill'} Confidence</div>
                    <div className="text-lg font-bold text-[#18181B] mt-0.5 flex items-center gap-2">
                      <span>{scoreDeltas.prevConfidence}%</span>
                      <span className="text-[#A1A1AA]">→</span>
                      <span className="text-emerald-700">{scoreDeltas.newConfidence}%</span>
                      <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                        +{scoreDeltas.newConfidence - scoreDeltas.prevConfidence}%
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-xs">
                    <div className="text-[10px] text-[#71717A] uppercase font-bold">{selectedRoleMatch.role.title} Readiness</div>
                    <div className="text-lg font-bold text-[#18181B] mt-0.5 flex items-center gap-2">
                      <span>{scoreDeltas.prevRoleScore}%</span>
                      <span className="text-[#A1A1AA]">→</span>
                      <span className="text-emerald-700">{scoreDeltas.newRoleScore}%</span>
                      <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                        +{scoreDeltas.newRoleScore - scoreDeltas.prevRoleScore}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={handleReset}
                className="btn btn-secondary text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>

              <button
                onClick={() => setActiveScreen('careers')}
                className="btn btn-primary text-xs flex items-center gap-1.5"
              >
                <span>View Updated Careers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions Stack */}
      <div className="space-y-4">
        {activeQuestions.map((q, qIndex) => {
          const selectedOption = selectedAnswers[q.id];
          const isCorrect = selectedOption === q.correctOptionIndex;

          return (
            <div key={q.id} className="bento-cell p-6 bg-white border border-[#E7E2D6] rounded-2xl shadow-sm">
              <div className="flex items-start justify-between">
                <span className="text-xs font-mono text-[#FF4F00] font-bold">
                  QUESTION 0{qIndex + 1} OF 0{activeQuestions.length}
                </span>
                {submitted && (
                  <span className={`text-xs font-mono font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-[#18181B] mt-2 leading-relaxed">
                {q.prompt}
              </h3>

              {q.codeSnippet && (
                <pre className="mt-3 p-3.5 bg-[#FAF9F5] border border-[#E7E2D6] rounded-xl text-xs font-mono text-[#18181B] overflow-x-auto">
                  <code>{q.codeSnippet}</code>
                </pre>
              )}

              {/* Options */}
              <div className="space-y-2 mt-4">
                {q.options.map((opt, optIndex) => {
                  const isSelected = selectedOption === optIndex;
                  const isAnswer = q.correctOptionIndex === optIndex;

                  let optionStyle = 'bg-[#FAF9F5] border-[#E7E2D6] hover:bg-white text-[#52525B]';
                  if (submitted) {
                    if (isAnswer) optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold';
                    else if (isSelected) optionStyle = 'bg-rose-50 border-rose-400 text-rose-950';
                    else optionStyle = 'bg-[#FAF9F5] border-[#E7E2D6] text-[#71717A]';
                  } else if (isSelected) {
                    optionStyle = 'bg-[#FFF9F6] border-[#FF4F00] text-[#18181B] ring-2 ring-[#FF4F00]/20 font-semibold';
                  }

                  return (
                    <button
                      key={optIndex}
                      disabled={submitted || isEvaluating}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`w-full text-left p-3.5 rounded-xl border font-mono text-xs transition flex items-center justify-between ${optionStyle}`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0">
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {submitted && isAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {submitted && isSelected && !isAnswer && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-4 p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E2D6] text-xs font-mono text-[#52525B]">
                  <span className="font-bold text-[#18181B]">Diagnostic Explanation: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button Console */}
      {!submitted && (
        <div className="bento-cell p-5 bg-white border border-[#E7E2D6] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="text-xs font-mono text-[#71717A]">
            {allAnswered ? (
              <span className="text-emerald-700 font-semibold">● All questions answered. Ready for evaluation.</span>
            ) : (
              <span>Please answer all questions to trigger belief update.</span>
            )}
          </div>

          <button
            onClick={handleSubmitTest}
            disabled={!allAnswered || isEvaluating}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#FF4F00] hover:bg-[#E04500] disabled:opacity-50 text-white rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Submit Diagnostic Evaluation</span>
          </button>
        </div>
      )}

    </div>
  );
};
