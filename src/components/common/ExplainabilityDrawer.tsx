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
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/30 backdrop-blur-xs transition-opacity animate-fade-in-up">
      <div className="w-full max-w-2xl bg-white border-l border-[#E5E0D8] h-full overflow-y-auto shadow-2xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
        
        <div>
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[#E5E0D8] pb-5">
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-1 rounded-md bg-orange-50/80 text-[#FF5A1F] border border-[#FF5A1F]/20">
                  MATHEMATICAL AUDIT LOG
                </span>
                <span className="text-xs font-mono text-[#8C8C80]">ENGINE: {trace.engineVersion}</span>
              </div>
              <h2 className="text-2xl font-bold text-[#14171A] mt-2 flex items-center gap-2 font-sans tracking-tight">
                Audit Trail: {report.roleTitle}
              </h2>
              <div className="text-xs text-[#6A6A60] mt-1 font-mono">
                Deterministic computation trace generated on {new Date(trace.timestamp).toLocaleTimeString()}.
              </div>
            </div>
            <button
              onClick={() => setExplainDrawerRoleId(null)}
              className="p-2 rounded-xl hover:bg-[#FAF9F5] text-[#8C8C80] hover:text-[#14171A] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Audit Trace Sub-Navigation Tabs */}
          <div className="flex space-x-2 my-5 border-b border-[#E5E0D8] pb-3 font-mono text-xs">
            <button
              onClick={() => setActiveTab('SUMMARY')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                activeTab === 'SUMMARY'
                  ? 'bg-[#14171A] text-white font-semibold shadow-xs'
                  : 'text-[#55554D] hover:bg-[#FAF9F5] hover:text-[#14171A]'
              }`}
            >
              Formula Summary
            </button>
            <button
              onClick={() => setActiveTab('SKILL_EVALS')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                activeTab === 'SKILL_EVALS'
                  ? 'bg-[#14171A] text-white font-semibold shadow-xs'
                  : 'text-[#55554D] hover:bg-[#FAF9F5] hover:text-[#14171A]'
              }`}
            >
              Skill-by-Skill Trace ({trace.skillEvaluations.length})
            </button>
            <button
              onClick={() => setActiveTab('RAW_TRACE')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                activeTab === 'RAW_TRACE'
                  ? 'bg-[#14171A] text-white font-semibold shadow-xs'
                  : 'text-[#55554D] hover:bg-[#FAF9F5] hover:text-[#14171A]'
              }`}
            >
              Raw JSON Digest
            </button>
          </div>

          {/* TAB 1: SUMMARY */}
          {activeTab === 'SUMMARY' && (
            <div className="space-y-6">
              {/* Readiness Score Instrument */}
              <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E5E0D8] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-[#8C8C80] uppercase font-semibold">CALCULATED READINESS INDEX</div>
                  <div className="text-3xl font-bold font-mono text-[#14171A] mt-1 flex items-baseline gap-2.5">
                    {report.readinessScore}%
                    <span className={`text-xs px-2.5 py-1 rounded-md border uppercase font-mono font-semibold ${
                      report.category === 'READY NOW' 
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800' 
                        : 'border-amber-300 bg-amber-50 text-amber-900'
                    }`}>
                      {report.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6A6A60] font-mono mt-1.5">
                    Gatekeeper: {trace.classificationGatekeeperReason}
                  </div>
                </div>
                <div className="text-right text-xs font-mono text-[#6A6A60] space-y-1">
                  <div>Critical Coverage: <span className="text-[#14171A] font-semibold">{roleMatch.criticalCoveragePercent}%</span></div>
                  <div>Blocker Count: <span className={roleMatch.breakdown.blockerPenalty > 0 ? "text-rose-700 font-semibold" : "text-emerald-700 font-semibold"}>
                    {report.criticalBlockers.length}
                  </span></div>
                </div>
              </div>

              {/* Mathematical Formula Display */}
              <div className="p-4 bg-[#14171A] border border-stone-800 rounded-xl font-mono text-xs text-stone-300">
                <div className="flex items-center gap-1.5 text-[#FF5A1F] text-[10px] uppercase font-bold mb-1.5">
                  <Calculator className="w-3.5 h-3.5" /> 6-Factor Deterministic Equation
                </div>
                <div className="text-white break-all leading-relaxed">
                  {report.mathematicalEquation}
                </div>
              </div>

              {/* Factor Weighting Breakdown */}
              <div>
                <h3 className="text-xs font-mono uppercase text-[#8C8C80] font-bold tracking-wider mb-3">
                  Dimension Weight Breakdown
                </h3>
                <div className="space-y-3">
                  {report.components.map((comp, idx) => (
                    <div key={idx} className="p-4 bg-[#FAF9F5] border border-[#E5E0D8] rounded-xl">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#14171A]">{comp.label}</span>
                        <span className="font-mono text-[#6A6A60]">
                          Weight: {comp.weight} · Score: <strong className="text-[#14171A] font-bold">{comp.score}%</strong> ({comp.effectivePoints} pts)
                        </span>
                      </div>
                      <div className="w-full bg-[#E5E0D8] rounded-full h-1.5 mt-2.5 overflow-hidden">
                        <div
                          className="bg-[#FF5A1F] h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, comp.score)}%` }}
                        ></div>
                      </div>
                      <div className="text-[11px] text-[#6A6A60] mt-2">
                        {comp.interpretation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Blockers */}
              {report.criticalBlockers.length > 0 && (
                <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200">
                  <div className="flex items-center gap-2 text-rose-800 text-xs font-mono font-bold uppercase mb-2.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" /> Active Critical Blockers (-{report.criticalBlockers.length * 8}% Penalty)
                  </div>
                  <div className="space-y-2.5">
                    {report.criticalBlockers.map((b, i) => (
                      <div key={i} className="text-xs text-[#14171A] flex items-start justify-between">
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
                <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-mono font-bold uppercase mb-2.5">
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
              <div className="text-[#8C8C80] text-[11px] mb-2">
                Evaluated {trace.skillEvaluations.length} dimensions against candidate profile.
              </div>
              {trace.skillEvaluations.map((evalItem, idx) => (
                <div key={idx} className="p-4 bg-[#FAF9F5] rounded-xl border border-[#E5E0D8] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#14171A] text-sm">{evalItem.skillName}</span>
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

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#6A6A60] pt-2 border-t border-[#E5E0D8]">
                    <div>Importance: <span className="text-[#14171A] font-semibold">{evalItem.importance}</span></div>
                    <div>Required Level: <span className="text-[#14171A] font-semibold">{evalItem.requiredLevel}</span></div>
                    <div>Epistemic Weight: <span className="text-orange-700 font-semibold">{evalItem.epistemicWeight}</span></div>
                    <div>Confidence: <span className="text-[#14171A] font-semibold">{evalItem.userConfidence}%</span></div>
                  </div>

                  <div className="text-[10px] text-[#8C8C80] pt-1">
                    {evalItem.auditNotes}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: RAW JSON DIGEST */}
          {activeTab === 'RAW_TRACE' && (
            <div className="p-4 bg-[#14171A] rounded-xl border border-stone-800 font-mono text-[11px] text-sky-300 overflow-x-auto max-h-[480px]">
              <pre>{JSON.stringify(trace, null, 2)}</pre>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="pt-6 mt-6 border-t border-[#E5E0D8] flex items-center justify-between">
          <button
            onClick={() => setExplainDrawerRoleId(null)}
            className="px-4 py-2 text-xs font-mono text-[#6A6A60] hover:text-[#14171A] transition"
          >
            Close Audit Trail
          </button>
          {roleMatch.nextBestAction.assessmentId && (
            <button
              onClick={() => {
                setExplainDrawerRoleId(null);
                launchAssessment(roleMatch.nextBestAction.skillId);
              }}
              className="btn-primary text-xs flex items-center gap-2 shadow-sm"
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
