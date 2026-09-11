import React, { useState } from 'react';
import type { RoleMatchResult, MissingCompetency } from '../../types';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ShieldAlert,
  Compass
} from 'lucide-react';

export interface WhyCareerPanelProps {
  match: RoleMatchResult;
  onLaunchAssessment?: (skillId: string) => void;
  onOpenTrace?: () => void;
  defaultExpanded?: boolean;
}

export const WhyCareerPanel: React.FC<WhyCareerPanelProps> = ({
  match,
  onLaunchAssessment,
  onOpenTrace,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const {
    overallScore,
    category,
    strongEvidenceSkills,
    missingCompetencies,
    auditTrace,
    breakdown
  } = match;

  const criticalBlockers = missingCompetencies.filter((m: MissingCompetency) => m.isBlocker);

  return (
    <div className="border border-[#E7E2D6] rounded-xl bg-[#FAF9F5] overflow-hidden transition-all duration-200">
      {/* Header Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-[#FAF9F5] transition text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#FF4F00]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#18181B]">
            INLINE EXPLAINABILITY · {isExpanded ? 'COLLAPSE DOSSIER' : 'WHY THIS MATCH?'}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFF1EB] text-[#FF4F00] font-bold border border-[#FFCDB5]">
            {category === 'READY_NOW' ? 'READY NOW' : 'REACHABLE PATH'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#71717A]">
            {isExpanded ? 'Hide Analysis' : 'Inspect Evidence For / Against'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#71717A]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#71717A]" />
          )}
        </div>
      </button>

      {/* Expanded Explanation Content */}
      {isExpanded && (
        <div className="p-4 sm:p-5 border-t border-[#E7E2D6] space-y-4 animate-fade-in-down">
          
          {/* Top Quick Readouts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2.5 bg-white rounded-lg border border-[#E7E2D6]">
              <div className="text-[9px] text-[#71717A] uppercase font-bold">Fit Score</div>
              <div className="text-base font-bold text-[#18181B] mt-0.5">{overallScore}%</div>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#E7E2D6]">
              <div className="text-[9px] text-[#71717A] uppercase font-bold">Strong Proof</div>
              <div className="text-base font-bold text-emerald-700 mt-0.5">{strongEvidenceSkills.length} Skills</div>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#E7E2D6]">
              <div className="text-[9px] text-[#71717A] uppercase font-bold">Critical Blockers</div>
              <div className={`text-base font-bold mt-0.5 ${criticalBlockers.length > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                {criticalBlockers.length}
              </div>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#E7E2D6]">
              <div className="text-[9px] text-[#71717A] uppercase font-bold">Distance to Target</div>
              <div className="text-base font-bold text-[#FF4F00] mt-0.5">{missingCompetencies.length} Gaps</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* ── Evidence FOR: Why This Career? ── */}
            <div className="p-4 bg-white rounded-xl border border-emerald-200">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-emerald-800 mb-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>WHY THIS CAREER? (EVIDENCE FOR)</span>
              </div>
              
              <ul className="space-y-2 text-xs">
                {strongEvidenceSkills.slice(0, 5).map((skillName: string, idx: number) => (
                  <li key={idx} className="flex items-start justify-between gap-2 pb-1.5 border-b border-emerald-50 last:border-0">
                    <span className="font-sans text-[#18181B] font-medium">{skillName}</span>
                    <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                      Verified Proof
                    </span>
                  </li>
                ))}
                {strongEvidenceSkills.length === 0 && (
                  <li className="text-stone-500 font-mono text-[11px]">No core competencies currently verified above threshold.</li>
                )}
              </ul>
              
              <div className="mt-3 text-[11px] font-mono text-emerald-800 bg-emerald-50/70 p-2 rounded border border-emerald-200/60">
                Evidence Base: Derived from verified repositories, technical projects, and coursework artifacts.
              </div>
            </div>

            {/* ── Evidence AGAINST: Why Not Higher? ── */}
            <div className="p-4 bg-white rounded-xl border border-amber-200">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-amber-900 mb-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>WHY NOT HIGHER? (GAPS & PENALTIES)</span>
              </div>

              {criticalBlockers.length > 0 && (
                <div className="mb-3 p-2 bg-rose-50 border border-rose-200 rounded text-xs font-mono text-rose-900 flex items-start gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Critical Blocker Identified: </span>
                    {criticalBlockers.map((b: MissingCompetency) => b.skillName).join(', ')}
                    <div className="text-[10px] text-rose-700 mt-0.5">
                      Prerequisite dependencies gate progression until diagnostic test passed.
                    </div>
                  </div>
                </div>
              )}

              <ul className="space-y-2 text-xs">
                {missingCompetencies.slice(0, 4).map((m: MissingCompetency, idx: number) => (
                  <li key={idx} className="flex items-start justify-between gap-2 pb-1.5 border-b border-amber-50 last:border-0">
                    <span className="font-sans text-[#52525B]">
                      {m.isBlocker ? '− ' : '· '} {m.skillName}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
                        m.isBlocker ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {m.isBlocker ? 'BLOCKER' : `${m.userCurrentLevel} → ${m.targetLevel}`}
                      </span>
                      {onLaunchAssessment && (
                        <button
                          onClick={() => onLaunchAssessment(m.skillId)}
                          className="px-1.5 py-0.5 rounded bg-[#FFF1EB] text-[#FF4F00] font-bold text-[9px] hover:bg-[#FF4F00] hover:text-white transition"
                          title="Validate competency with live diagnostic test"
                        >
                          Test
                        </button>
                      )}
                    </div>
                  </li>
                ))}
                {missingCompetencies.length === 0 && (
                  <li className="text-emerald-700 font-mono text-[11px]">Zero critical gaps detected. Target ready for placement.</li>
                )}
              </ul>

              {breakdown?.blockerPenalty > 0 && (
                <div className="mt-3 text-[11px] font-mono text-amber-900 bg-amber-50/70 p-2 rounded border border-amber-200/60 flex items-center justify-between">
                  <span>Blocker Formula Penalty Applied:</span>
                  <span className="font-bold text-rose-700">−{breakdown.blockerPenalty}%</span>
                </div>
              )}
            </div>

          </div>

          {/* Mathematical Trace Summary & Direct Action */}
          <div className="p-3 bg-[#FAF9F5] border border-[#E7E2D6] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <div className="text-[#52525B] text-[11px]">
              <span className="font-bold text-[#18181B]">Formula Equation: </span>
              <span className="text-[#71717A]">{auditTrace?.calculationEquation || 'Readiness = w_c × C + w_d × D - Penalties'}</span>
            </div>

            {onOpenTrace && (
              <button
                onClick={onOpenTrace}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-[#18181B] text-white hover:bg-black font-semibold flex items-center gap-1.5 transition text-xs"
              >
                <Compass className="w-3.5 h-3.5 text-[#FF4F00]" />
                Inspect Mathematical Trace <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
