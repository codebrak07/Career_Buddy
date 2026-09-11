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

  const [currentSkillId, setCurrentSkillId] = useState<string>(
    activeAssessmentSkillId || 'docker-containers'
  );

  useEffect(() => {
    if (activeAssessmentSkillId && activeAssessmentSkillId !== currentSkillId) {
      setCurrentSkillId(activeAssessmentSkillId);
      setSelectedAnswers({});
      setSubmitted(false);
      setIsEvaluating(false);
      setTestScore(0);
      setScoreDeltas(null);
    }
  }, [activeAssessmentSkillId]);

  const defaultAssessment = ASSESSMENTS_DATABASE[currentSkillId] || ASSESSMENTS_DATABASE['docker-containers'];
  const passingScore = defaultAssessment?.passingScore || 70;
  const skillMeta = SKILLS_TAXONOMY[currentSkillId];
  const previousSkillConfidence = userProfile.skills[currentSkillId]?.confidence || 20;

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

    // Seed with curated questions immediately
    const baseQuestions = ASSESSMENTS_DATABASE[currentSkillId]?.questions || defaultAssessment.questions;
    setActiveQuestions(baseQuestions);
    setSelectedAnswers({});
    setSubmitted(false);
    setIsEvaluating(false);
    setTestScore(0);
    setScoreDeltas(null);

    const loadGroqQuestions = async () => {
      setIsGeneratingQuestions(true);
      try {
        const groqQuestions = await generateLiveQuizWithGroq(
          currentSkillId, 
          skillMeta?.name || 'Technical Engineering', 
          previousSkillConfidence
        );
        if (!isCancelled && groqQuestions && groqQuestions.length >= 2) {
          // Only replace questions if the user hasn't already started answering!
          setSelectedAnswers(prev => {
            if (Object.keys(prev).length === 0) {
              setActiveQuestions(groqQuestions);
            }
            return prev;
          });
        }
      } catch {
        if (!isCancelled) {
          setActiveQuestions(baseQuestions);
        }
      } finally {
        if (!isCancelled) setIsGeneratingQuestions(false);
      }
    };

    loadGroqQuestions();
    return () => { isCancelled = true; };
  }, [currentSkillId]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted || isEvaluating) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitTest = () => {
    let correctCount = 0;
    activeQuestions.forEach(q => {
      const chosen = selectedAnswers[q.id];
      if (chosen !== undefined && chosen === q.correctOptionIndex) {
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
          submitAssessment(currentSkillId, score, passed);

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

  const allAnswered = activeQuestions.length > 0 && activeQuestions.every(q => selectedAnswers[q.id] !== undefined);

  return (
    <div className="space-y-8 py-4 max-w-4xl mx-auto">
      
      {/* Evaluator Mode Warning / Advisory Banner */}
      {appMode === 'evaluator' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-orange-50/70 border border-[#FF5A1F]/20 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#14171A]">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#FF5A1F] shrink-0" />
            <span className="leading-relaxed">
              <strong className="font-semibold text-[#14171A]">Candidate Action Protected:</strong> Validation test-taking is isolated to the Candidate Portal to protect evaluator audit integrity.
            </span>
          </div>
          <button 
            onClick={() => setAppMode('candidate')} 
            className="px-3.5 py-2 bg-[#FF5A1F] hover:bg-[#E04500] text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition"
          >
            <span>Switch to Candidate Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Assessment Header */}
      <div className="editorial-card p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <SectionIndex 
            index="07" 
            label="DIAGNOSTIC VALIDATION" 
            sublabel="Direct technical assessments updating Bayesian competency beliefs in real time."
          />
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-mono text-[#FF5A1F] bg-orange-50/80 border border-[#FF5A1F]/20 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DYNAMIC GROQ ENGINE</span>
            </span>
            <span className="text-xs font-mono text-[#6A6A60] bg-[#FAF9F5] border border-[#E5E0D8] px-3 py-1.5 rounded-lg font-medium">
              Benchmark: {defaultAssessment.passingScore}% Pass
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#E5E0D8]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#14171A] tracking-tight">
              {defaultAssessment.title}
            </h1>
            {isGeneratingQuestions && (
              <span className="text-xs font-mono text-[#FF5A1F] flex items-center gap-2 animate-pulse bg-orange-50/60 px-3 py-1.5 rounded-lg border border-[#FF5A1F]/20">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Groq LPU Generating Live Questions...</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#6A6A60] mt-2 font-mono">
            Target Competency: <strong className="text-[#14171A] font-semibold">{skillMeta?.name || currentSkillId}</strong> · Difficulty: {defaultAssessment.difficulty} · {activeQuestions.length} Diagnostic Items
          </p>

          {/* Assessment Selector Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-[#E5E0D8]">
            <span className="text-[11px] font-mono text-[#8C8C80] uppercase tracking-wider font-semibold mr-1">Assessments:</span>
            {Object.values(ASSESSMENTS_DATABASE).map(a => (
              <button
                key={a.id}
                onClick={() => {
                  handleReset();
                  setCurrentSkillId(a.skillId);
                  launchAssessment(a.skillId);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer ${
                  currentSkillId === a.skillId
                    ? 'bg-[#14171A] text-white font-semibold shadow-xs'
                    : 'bg-[#FAF9F5] text-[#55554D] border border-[#E5E0D8] hover:bg-white hover:text-[#14171A]'
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
        <div className="editorial-card p-10 bg-[#14171A] text-white border-transparent text-center space-y-5 shadow-xl animate-fade-in-up">
          <div className="w-14 h-14 rounded-2xl bg-[#FF5A1F]/15 border border-[#FF5A1F]/40 flex items-center justify-center mx-auto text-[#FF5A1F] animate-pulse">
            <Cpu className="w-7 h-7" />
          </div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#FF5A1F] font-semibold">
            Deterministic Engine Recalibration
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-white tracking-wide">
            {EVAL_STAGES[evalStageIdx]}
          </div>
          <div className="w-72 max-w-full bg-white/10 rounded-full h-2 mx-auto overflow-hidden">
            <div 
              className="bg-[#FF5A1F] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((evalStageIdx + 1) / EVAL_STAGES.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Submitted Result Telemetry Box */}
      {submitted && (
        <div className={`editorial-card p-6 sm:p-8 border-2 transition ${
          testScore >= passingScore
            ? 'border-emerald-500/60 bg-emerald-50/30'
            : 'border-rose-400/60 bg-rose-50/30'
        }`}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase font-semibold">
                {testScore >= passingScore ? (
                  <span className="text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ASSESSMENT PASSED · VALIDATED STAMP APPLIED
                  </span>
                ) : (
                  <span className="text-rose-800 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-600" /> BENCHMARK UNMET · RETRY RECOMMENDED
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#14171A] font-sans">
                Diagnostic Score: {testScore}% ({testScore >= passingScore ? 'Passed' : 'Needs Review'})
              </h2>
              <p className="text-sm text-[#55554D] max-w-2xl leading-relaxed">
                Your Bayesian competency confidence has been elevated and global career readiness re-scored across all targets.
              </p>

              {/* Live Competency & Career Shift Indicators */}
              {scoreDeltas && testScore >= passingScore && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6 pt-6 border-t border-emerald-200/60 font-mono text-xs">
                  <div className="p-4 bg-white rounded-xl border border-emerald-200/70 shadow-xs">
                    <div className="text-[10px] text-[#8C8C80] uppercase tracking-wider font-semibold">{skillMeta?.name || 'Skill'} Confidence</div>
                    <div className="text-xl font-bold text-[#14171A] mt-1.5 flex items-center gap-2.5">
                      <span>{scoreDeltas.prevConfidence}%</span>
                      <span className="text-[#8C8C80]">→</span>
                      <span className="text-emerald-700">{scoreDeltas.newConfidence}%</span>
                      <span className="text-xs text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        +{scoreDeltas.newConfidence - scoreDeltas.prevConfidence}%
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-emerald-200/70 shadow-xs">
                    <div className="text-[10px] text-[#8C8C80] uppercase tracking-wider font-semibold">{selectedRoleMatch.role.title} Readiness</div>
                    <div className="text-xl font-bold text-[#14171A] mt-1.5 flex items-center gap-2.5">
                      <span>{scoreDeltas.prevRoleScore}%</span>
                      <span className="text-[#8C8C80]">→</span>
                      <span className="text-emerald-700">{scoreDeltas.newRoleScore}%</span>
                      <span className="text-xs text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        +{scoreDeltas.newRoleScore - scoreDeltas.prevRoleScore}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 w-full sm:w-auto mt-4 lg:mt-0">
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#D5D0C8] hover:border-[#B5B0A8] text-[#2D3136] hover:text-[#14171A] text-xs font-semibold flex items-center justify-center gap-2 shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer flex-1 sm:flex-initial"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#6A6A60]" />
                <span>Retry Quiz</span>
              </button>

              <button
                onClick={() => setActiveScreen('careers')}
                className="px-5 py-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#E04500] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-150 cursor-pointer flex-1 sm:flex-initial"
              >
                <span>View Updated Careers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions Stack */}
      <div className="space-y-6">
        {activeQuestions.map((q, qIndex) => {
          const selectedOption = selectedAnswers[q.id];
          const isAnswered = selectedOption !== undefined;
          const isCorrect = isAnswered && selectedOption === q.correctOptionIndex;

          return (
            <div key={q.id} className="editorial-card p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs font-mono text-[#FF5A1F] font-bold tracking-wider">
                  QUESTION {String(qIndex + 1).padStart(2, '0')} OF {String(activeQuestions.length).padStart(2, '0')}
                </span>
                {submitted && (
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 ${
                    isCorrect 
                      ? 'text-emerald-800 bg-emerald-50 border border-emerald-200' 
                      : 'text-rose-800 bg-rose-50 border border-rose-200'
                  }`}>
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>CORRECT</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>INCORRECT</span>
                      </>
                    )}
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-semibold text-[#14171A] mt-3 leading-relaxed">
                {q.prompt}
              </h3>

              {q.codeSnippet && (
                <pre className="mt-4 p-4 bg-[#FAF9F5] border border-[#E5E0D8] rounded-xl text-xs font-mono text-[#14171A] overflow-x-auto leading-relaxed">
                  <code>{q.codeSnippet}</code>
                </pre>
              )}

              {/* Options */}
              <div className="space-y-2.5 mt-6">
                {q.options.map((opt, optIndex) => {
                  const isSelected = selectedOption === optIndex;
                  const isAnswer = q.correctOptionIndex === optIndex;

                  let optionStyle = 'bg-[#FAF9F5] border-[#E5E0D8] hover:bg-white hover:border-[#D5D0C8] text-[#55554D]';
                  let letterCircleStyle = 'border-[#D5D0C8] text-[#8C8C80]';

                  if (submitted) {
                    if (isSelected && isAnswer) {
                      // User correctly picked this option
                      optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-500/30';
                      letterCircleStyle = 'bg-emerald-600 text-white border-emerald-600';
                    } else if (isSelected && !isAnswer) {
                      // User picked a wrong option: distinctly RED
                      optionStyle = 'bg-rose-50 border-rose-500 text-rose-950 font-semibold ring-1 ring-rose-500/30';
                      letterCircleStyle = 'bg-rose-600 text-white border-rose-600';
                    } else if (!isSelected && isAnswer) {
                      // The correct answer that user missed: subtle dashed green
                      optionStyle = 'bg-emerald-50/40 border-emerald-400 border-dashed text-emerald-950';
                      letterCircleStyle = 'border-emerald-500 text-emerald-700 bg-emerald-100/50';
                    } else {
                      // Unselected non-answer option
                      optionStyle = 'bg-[#FAF9F5] border-[#E5E0D8] text-[#8C8C80] opacity-60';
                      letterCircleStyle = 'border-[#D5D0C8] text-[#8C8C80]';
                    }
                  } else if (isSelected) {
                    // Before submitting, active selection in crisp orange
                    optionStyle = 'bg-[#FFF9F6] border-[#FF5A1F] text-[#14171A] ring-2 ring-[#FF5A1F]/20 font-semibold';
                    letterCircleStyle = 'bg-[#FF5A1F] text-white border-[#FF5A1F]';
                  }

                  return (
                    <button
                      key={optIndex}
                      type="button"
                      disabled={submitted || isEvaluating}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`w-full text-left p-4 rounded-xl border font-mono text-xs transition flex items-center justify-between gap-3 ${optionStyle} ${
                        !submitted && !isEvaluating ? 'cursor-pointer' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-[11px] shrink-0 font-bold transition-colors ${letterCircleStyle}`}>
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </div>

                      {/* Explicit Answer & Status Indicators */}
                      {submitted ? (
                        isSelected && isAnswer ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-bold shrink-0 text-[11px]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Your Answer (Correct)</span>
                          </div>
                        ) : isSelected && !isAnswer ? (
                          <div className="flex items-center gap-1.5 text-rose-700 font-bold shrink-0 text-[11px]">
                            <XCircle className="w-4 h-4 text-rose-600" />
                            <span>Your Answer (Incorrect)</span>
                          </div>
                        ) : !isSelected && isAnswer ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold shrink-0 text-[11px]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Correct Answer</span>
                          </div>
                        ) : null
                      ) : isSelected ? (
                        <span className="w-2 h-2 rounded-full bg-[#FF5A1F] shrink-0" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-5 p-4 bg-[#FAF9F5] rounded-xl border border-[#E5E0D8] text-xs font-mono text-[#55554D] leading-relaxed">
                  <span className="font-bold text-[#14171A]">Diagnostic Explanation: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button Console */}
      {!submitted && (
        <div className="editorial-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-[#6A6A60]">
            {allAnswered ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                All questions answered. Ready for evaluation.
              </span>
            ) : (
              <span>Please answer all diagnostic questions to trigger belief update.</span>
            )}
          </div>

          <button
            onClick={handleSubmitTest}
            disabled={!allAnswered || isEvaluating}
            className={`w-full sm:w-auto px-7 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-200 ${
              allAnswered && !isEvaluating
                ? 'bg-[#FF5A1F] hover:bg-[#E04500] text-white shadow-md hover:shadow-lg hover:scale-[1.01] cursor-pointer'
                : 'bg-[#E5E0D8] text-[#8C8C80] cursor-not-allowed shadow-none border border-[#D5D0C8]'
            }`}
          >
            <Zap className={`w-4 h-4 ${allAnswered && !isEvaluating ? 'text-white' : 'text-[#8C8C80]'}`} />
            <span>Submit Diagnostic Evaluation</span>
          </button>
        </div>
      )}

    </div>
  );
};
