import React from 'react';
import { useApp } from '../../context/AppContext';
import { SKILLS_TAXONOMY } from '../../data/skillsTaxonomy';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { SectionIndex } from '../common/SectionIndex';
import { WhyCareerPanel } from '../common/WhyCareerPanel';
import { 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  GitBranch, 
  Zap,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export const CareerDetailScreen: React.FC = () => {
  const { 
    selectedRoleMatch, 
    userProfile, 
    setActiveScreen, 
    setExplainDrawerRoleId, 
    launchAssessment 
  } = useApp();

  const role = selectedRoleMatch.role;
  const isReadyNow = selectedRoleMatch.category === 'READY_NOW';
  const blockers = selectedRoleMatch.missingCompetencies.filter(m => m.isBlocker);
  const nextAction = selectedRoleMatch.nextBestAction;
  const audit = selectedRoleMatch.auditTrace;

  return (
    <div className="space-y-6 py-4">
      
      {/* Role Header Banner */}
      <div className="bento-cell p-6 sm:p-8 rounded-2xl border border-[#E7E2D6] bg-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <SectionIndex 
            index="04" 
            label="ROLE SPECIFICATION MATRIX" 
            sublabel="Direct arithmetic evaluation between candidate profile evidence and institutional role requirements."
          />
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className={`px-2.5 py-1 rounded-lg border font-bold ${
              isReadyNow 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {isReadyNow ? '● READY NOW CANDIDATE' : '▲ REACHABLE ROADMAP'}
            </span>
            <button
              onClick={() => setExplainDrawerRoleId(role.id)}
              className="px-2.5 py-1 rounded-lg border border-[#E7E2D6] bg-[#FAF9F5] text-[#52525B] hover:text-[#FF4F00] flex items-center gap-1 font-mono"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Full Audit Trace</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-6 pt-6 border-t border-[#E7E2D6]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight font-sans">
              {role.title}
            </h1>
            <p className="text-xs text-[#52525B] mt-1.5 max-w-2xl leading-relaxed">
              {role.description}
            </p>
          </div>

          <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#E7E2D6] font-mono text-right shrink-0">
            <div className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">CALCULATED READINESS</div>
            <div className={`text-4xl font-mono font-black ${isReadyNow ? 'text-[#059669]' : 'text-[#D97706]'}`}>
              <AnimatedCounter value={selectedRoleMatch.overallScore} suffix="%" />
            </div>
            <div className="text-[10px] text-[#71717A] mt-0.5">
              100% Deterministic Scorer
            </div>
          </div>
        </div>

        {/* Key Benchmark Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#E7E2D6] font-mono text-xs">
          <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E2D6]">
            <div className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">SALARY BENCHMARK</div>
            <div className="text-sm font-bold text-[#18181B] mt-0.5">{role.salaryRange}</div>
          </div>
          <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E2D6]">
            <div className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">MARKET GROWTH</div>
            <div className="text-sm font-bold text-[#FF4F00] mt-0.5">{role.demandGrowthRate}</div>
          </div>
          <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E2D6]">
            <div className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">CRITICAL COVERAGE</div>
            <div className="text-sm font-bold text-[#18181B] mt-0.5">{selectedRoleMatch.criticalCoveragePercent}%</div>
          </div>
          <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E2D6]">
            <div className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">ACTIVE BLOCKERS</div>
            <div className={`text-sm font-bold mt-0.5 ${blockers.length > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
              {blockers.length} Unresolved
            </div>
          </div>
        </div>
      </div>

      {/* Why This Career Panel (Inline Full Feature) */}
      <div className="bento-cell rounded-2xl border border-[#E7E2D6] bg-white shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 bg-[#FAF9F5] border-b border-[#E7E2D6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FF4F00]" />
            <span className="text-xs font-mono font-bold uppercase text-[#18181B]">
              Deterministic Audit & Justification
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#71717A]">
            EVALUATED AT: {audit.timestamp.split('T')[0]}
          </span>
        </div>
        <WhyCareerPanel 
          match={selectedRoleMatch} 
          onLaunchAssessment={launchAssessment}
          onOpenTrace={() => setExplainDrawerRoleId(role.id)}
        />
      </div>

      {/* Main Matrix: Candidate Competency vs Role Requirements */}
      <div className="bento-cell p-6 sm:p-8 rounded-2xl border border-[#E7E2D6] bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base font-mono uppercase text-[#18181B] font-bold">
              Competency Alignment Matrix
            </h2>
            <div className="text-xs text-[#71717A]">
              Direct arithmetic comparison between verified profile evidence and role requirements.
            </div>
          </div>
          <span className="text-xs font-mono text-[#71717A] bg-[#FAF9F5] px-2.5 py-1 rounded-lg border border-[#E7E2D6] shrink-0 self-start">
            {role.requiredSkills.length} Required Dimensions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#E7E2D6] text-[#71717A] uppercase text-[10px]">
                <th className="py-3 px-3">Required Competency</th>
                <th className="py-3 px-3">Target Level</th>
                <th className="py-3 px-3">Your Evidence State</th>
                <th className="py-3 px-3">Confidence</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E2D6]/60">
              {role.requiredSkills.map((req) => {
                const skill = userProfile.skills ? userProfile.skills[req.skillId] : undefined;
                const meta = SKILLS_TAXONOMY[req.skillId];
                const isCritical = req.importance === 'Critical';
                const hasSkill = !!skill;
                const isSatisfied = skill && skill.confidence >= 60 && skill.state !== 'claimed';

                return (
                  <tr key={req.skillId} className="hover:bg-[#FAF9F5]/70 transition">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-[#18181B]">{meta?.name || req.skillId}</div>
                      <div className="text-[10px] text-[#71717A] flex items-center gap-1.5 mt-0.5">
                        <span className={isCritical ? 'text-rose-700 font-bold' : 'text-[#71717A]'}>
                          [{req.importance.toUpperCase()}]
                        </span>
                        <span>Weight: {Math.round(req.weight * 100)}%</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 bg-[#FAF9F5] rounded border border-[#E7E2D6] text-[#18181B] font-medium">
                        {req.requiredLevel}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      {hasSkill ? (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                          skill.state === 'validated' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          skill.state === 'evidenced' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          skill.state === 'detected' ? 'bg-sky-50 text-sky-800 border-sky-200' :
                          'bg-stone-100 text-stone-700 border-stone-200'
                        }`}>
                          {skill.state} ({skill.proficiency})
                        </span>
                      ) : (
                        <span className="text-[#A1A1AA] italic">No evidence found</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-[#E7E2D6] rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              isSatisfied ? 'bg-emerald-500' : hasSkill ? 'bg-amber-500' : 'bg-stone-300'
                            }`}
                            style={{ width: `${skill ? skill.confidence : 0}%` }}
                          />
                        </div>
                        <span className="font-bold text-[#18181B]">{skill ? `${skill.confidence}%` : '0%'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      {isSatisfied ? (
                        <span className="text-emerald-700 flex items-center gap-1 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Satisfied
                        </span>
                      ) : isCritical ? (
                        <span className="text-rose-700 flex items-center gap-1 text-[11px] font-bold">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Critical Blocker
                        </span>
                      ) : (
                        <span className="text-amber-800 text-[11px] font-medium">
                          Optional Gap
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      {!isSatisfied && (
                        <button
                          onClick={() => launchAssessment(req.skillId)}
                          className="px-2.5 py-1 bg-white hover:bg-orange-50 text-[#FF4F00] border border-[#FF4F00]/40 rounded text-[10px] transition font-bold"
                        >
                          Validate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mathematical Calculation Equation Trace */}
      <div className="bento-cell p-6 rounded-2xl border border-[#E7E2D6] bg-white shadow-sm font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E7E2D6]">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#FF4F00]" />
            <span className="font-bold text-[#18181B] uppercase tracking-wider text-[11px]">
              Active Scoring Equation (ADR-002 Formula)
            </span>
          </div>
          <span className="text-[10px] text-[#71717A]">
            DETERMINISTIC KERNEL
          </span>
        </div>

        <div className="p-3 my-3 bg-[#FAF9F5] rounded-xl border border-[#E7E2D6] overflow-x-auto text-[11px] text-[#18181B]">
          <code>{audit.calculationEquation}</code>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] text-[#71717A] pt-2">
          <div>Weighted Coverage: <strong className="text-[#18181B]">{audit.intermediateFactors.weightedCoveragePercent}%</strong></div>
          <div>Weighted Evidence: <strong className="text-[#18181B]">{audit.intermediateFactors.weightedEvidencePercent}%</strong></div>
          <div>Proficiency Alignment: <strong className="text-[#18181B]">{audit.intermediateFactors.weightedProficiencyPercent}%</strong></div>
          <div>Blocker Penalty: <strong className="text-rose-600">-{audit.totalBlockerPenalty}%</strong></div>
        </div>
      </div>

      {/* Next Best Action & Prerequisite Roadmaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Next Best Action Card */}
        <div className="bento-cell p-6 rounded-2xl border border-[#E7E2D6] bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#FF4F00] uppercase font-bold">
              <Zap className="w-4 h-4" />
              <span>HIGHEST LEVERAGE NEXT ACTION</span>
            </div>

            <h3 className="text-lg font-bold text-[#18181B] mt-2">
              {nextAction.actionTitle}
            </h3>
            <p className="text-xs text-[#52525B] mt-1 leading-relaxed">
              {nextAction.actionDescription}
            </p>

            <div className="mt-4 p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E2D6] text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-[#71717A]">Target Competency:</span>
                <span className="font-bold text-[#18181B]">{nextAction.skillName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717A]">Estimated Sprints:</span>
                <span className="font-bold text-[#18181B]">{Math.ceil(nextAction.estimatedHours / 10)} Sprints ({nextAction.estimatedHours} hrs)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717A]">Expected Role Score Boost:</span>
                <span className="font-bold text-emerald-700">+{nextAction.expectedScoreBoost}%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E7E2D6] flex gap-2">
            <button
              onClick={() => setActiveScreen('gap_dag')}
              className="btn btn-secondary flex-1 justify-center text-xs"
            >
              <GitBranch className="w-3.5 h-3.5 text-[#FF4F00]" />
              Prerequisite DAG
            </button>
            <button
              onClick={() => setActiveScreen('learning')}
              className="btn btn-primary flex-1 justify-center text-xs"
            >
              Learning Units
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Strategic Trajectory Advice */}
        <div className="bento-cell p-6 rounded-2xl border border-[#E7E2D6] bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-[#71717A] uppercase font-bold">
              EXPLAINABILITY SUMMARY
            </div>

            <h3 className="text-lg font-bold text-[#18181B] mt-2">
              Evidence Governance Verdict
            </h3>

            <p className="text-xs text-[#52525B] mt-2 leading-relaxed whitespace-pre-line">
              {selectedRoleMatch.explainabilitySummary}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E7E2D6] flex items-center justify-between">
            <button
              onClick={() => setActiveScreen('careers')}
              className="text-xs font-mono text-[#71717A] hover:text-[#18181B] flex items-center gap-1"
            >
              ← Back to Careers
            </button>
            <button
              onClick={() => setExplainDrawerRoleId(role.id)}
              className="btn btn-ghost text-xs flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Audit Trace
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
