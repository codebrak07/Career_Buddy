import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateExplainabilityReport } from '../../services/explainabilityService';
import { CAREER_ROLES } from '../../data/rolesDatabase';
import { calculateRoleMatch } from '../../services/scoringEngine';
import { 
  X, 
  Calculator, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

export const ExplainabilityDrawer: React.FC = () => {
  const { explainDrawerRoleId, setExplainDrawerRoleId, userProfile, launchAssessment } = useApp();
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'RAW_TRACE' | 'SKILL_EVALS'>('SUMMARY');

  if (!explainDrawerRoleId) return null;

  const targetRole = CAREER_ROLES.find(r => r.id === explainDrawerRoleId) || CAREER_ROLES[0];
  const roleMatch = calculateRoleMatch(userProfile, targetRole);
  const report = generateExplainabilityReport(roleMatch);
  const trace = roleMatch.auditTrace;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in-up">
      <div className="w-full max-w-2xl bg-white border-l border-stone-200 h-full overflow-y-auto shadow-2xl p-6 sm:p-8 flex flex-col justify-between">
        
        <div>
          {/* Header */}
          <div className="flex items-start justify-between border-b border-stone-200 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                  MATHEMATICAL AUDIT LOG
                </span>
                <span className="text-xs font-mono text-stone-500">ENGINE: {trace.engineVersion}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1.5 flex items-center gap-2 font-sans">
                Audit Trail: {report.roleTitle}
              </h2>
              <div className="text-xs text-stone-600 mt-0.5">
                Deterministic computation trace generated on {new Date(trace.timestamp).toLocaleTimeString()}.
              </div>
            </div>
            <button
              onClick={() => setExplainDrawerRoleId(null)}
              className="p-1.5 rounded-md hover:bg-stone-100 text-stone-500 hover:text-slate-900 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Audit Trace Sub-Navigation Tabs */}
          <div className="flex space-x-2 my-4 border-b border-stone-200 pb-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('SUMMARY')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'SUMMARY'
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Formula Summary
            </button>
            <button
              onClick={() => setActiveTab('SKILL_EVALS')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'SKILL_EVALS'
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Skill-by-Skill Trace ({trace.skillEvaluations.length})
            </button>
            <button
              onClick={() => setActiveTab('RAW_TRACE')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'RAW_TRACE'
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Raw JSON Digest
            </button>
          </div>

          {/* TAB 1: SUMMARY */}
          {activeTab === 'SUMMARY' && (
            <div className="space-y-6">
              {/* Readiness Score Instrument */}
              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-stone-500 uppercase font-bold">CALCULATED READINESS INDEX</div>
                  <div className="text-3xl font-extrabold font-mono text-slate-900 mt-0.5 flex items-baseline gap-2">
                    {report.readinessScore}%
                    <span className={`text-xs px-2 py-0.5 rounded border uppercase font-mono font-bold ${
                      report.category === 'READY NOW' 
                        ? 'border-emerald-300 bg-emerald-100 text-emerald-800' 
                        : 'border-amber-300 bg-amber-100 text-amber-900'
                    }`}>
                      {report.category}
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono mt-1">
                    Gatekeeper: {trace.classificationGatekeeperReason}
                  </div>
                </div>
                <div className="text-right text-xs font-mono text-stone-600">
                  <div>Critical Coverage: <span className="text-slate-900 font-bold">{roleMatch.criticalCoveragePercent}%</span></div>
                  <div>Blocker Count: <span className={roleMatch.breakdown.blockerPenalty > 0 ? "text-rose-700 font-bold" : "text-emerald-700 font-bold"}>
                    {report.criticalBlockers.length}
                  </span></div>
                </div>
              </div>

              {/* Mathematical Formula Display */}
              <div className="p-3.5 bg-stone-900 border border-stone-800 rounded-lg font-mono text-xs text-stone-300">
                <div className="flex items-center gap-1.5 text-orange-400 text-[10px] uppercase font-bold mb-1">
                  <Calculator className="w-3.5 h-3.5" /> 6-Factor Deterministic Equation
                </div>
                <div className="text-white break-all leading-relaxed">
                  {report.mathematicalEquation}
                </div>
              </div>

              {/* Factor Weighting Breakdown */}
              <div>
                <h3 className="text-xs font-mono uppercase text-stone-500 font-bold tracking-wider mb-3">
                  Dimension Weight Breakdown
                </h3>
                <div className="space-y-2.5">
                  {report.components.map((comp, idx) => (
                    <div key={idx} className="p-3 bg-stone-50 border border-stone-200 rounded-md">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-900">{comp.label}</span>
                        <span className="font-mono text-stone-600">
                          Weight: {comp.weight} · Score: <strong className="text-slate-900">{comp.score}%</strong> ({comp.effectivePoints} pts)
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div
                          className="bg-orange-600 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, comp.score)}%` }}
                        ></div>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-1.5">
                        {comp.interpretation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Blockers */}
              {report.criticalBlockers.length > 0 && (
                <div className="p-4 rounded-lg bg-rose-50 border border-rose-200">
                  <div className="flex items-center gap-2 text-rose-800 text-xs font-mono font-bold uppercase mb-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" /> Active Critical Blockers (-{report.criticalBlockers.length * 8}% Penalty)
                  </div>
                  <div className="space-y-2">
                    {report.criticalBlockers.map((b, i) => (
                      <div key={i} className="text-xs text-slate-900 flex items-start justify-between">
                        <div>
                          <span className="font-bold text-rose-900">{b.name}</span>: {b.explanation}
                        </div>
                        <span className="font-mono text-rose-700 font-bold ml-2">{b.penalty}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verifiable Drivers */}
              {report.strongestDrivers.length > 0 && (
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-mono font-bold uppercase mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Strongest Evidenced Pillars
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {report.strongestDrivers.map((d, i) => (
                      <span key={i} className="telemetry-badge telemetry-validated text-[11px] px-2.5 py-1">
                        ✓ {d.name} ({d.evidenceType})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SKILL EVALUATIONS */}
          {activeTab === 'SKILL_EVALS' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="text-stone-500 text-[11px] mb-2">
                Evaluated {trace.skillEvaluations.length} dimensions against candidate profile.
              </div>
              {trace.skillEvaluations.map((evalItem, idx) => (
                <div key={idx} className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{evalItem.skillName}</span>
                    <span className={`telemetry-badge text-[9px] ${
                      evalItem.userState === 'validated' ? 'telemetry-validated' :
                      evalItem.userState === 'evidenced' ? 'telemetry-evidenced' :
                      evalItem.userState === 'detected' ? 'telemetry-detected' :
                      evalItem.userState === 'claimed' ? 'telemetry-claimed' :
                      'telemetry-blocker'
                    }`}>
                      {evalItem.userState.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 pt-1 border-t border-stone-200">
                    <div>Importance: <span className="text-slate-900 font-semibold">{evalItem.importance}</span></div>
                    <div>Required Level: <span className="text-slate-900 font-semibold">{evalItem.requiredLevel}</span></div>
                    <div>Epistemic Weight: <span className="text-orange-700 font-semibold">{evalItem.epistemicWeight}</span></div>
                    <div>Confidence: <span className="text-slate-900 font-semibold">{evalItem.userConfidence}%</span></div>
                  </div>

                  <div className="text-[10px] text-stone-500 pt-1">
                    {evalItem.auditNotes}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: RAW JSON DIGEST */}
          {activeTab === 'RAW_TRACE' && (
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-sky-300 overflow-x-auto max-h-[480px]">
              <pre>{JSON.stringify(trace, null, 2)}</pre>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="pt-6 mt-6 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => setExplainDrawerRoleId(null)}
            className="px-4 py-2 text-xs font-mono text-stone-500 hover:text-slate-900"
          >
            Close Audit Trail
          </button>
          {roleMatch.nextBestAction.assessmentId && (
            <button
              onClick={() => {
                setExplainDrawerRoleId(null);
                launchAssessment(roleMatch.nextBestAction.skillId);
              }}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-mono rounded-md flex items-center gap-1.5 shadow-sm font-bold transition"
            >
              <span>Launch Validation Test</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
