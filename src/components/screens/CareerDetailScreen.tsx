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
    <div className="space-y-10 py-2 max-w-[1360px] mx-auto">
      
      {/* Role Header Banner */}
      <div className="editorial-card p-8 sm:p-10 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <SectionIndex 
            index="04" 
            label="ROLE SPECIFICATION MATRIX" 
            sublabel="Direct arithmetic evaluation between candidate profile evidence and institutional role requirements."
          />
          <div className="flex items-center gap-2.5 font-mono text-xs">
            <span className={`px-3 py-1.5 rounded-xl border font-semibold ${
              isReadyNow 
                ? 'bg-[#F0FDF4] text-[#059669] border-[#BBF7D0]' 
                : 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]'
            }`}>
              {isReadyNow ? '● READY NOW TARGET' : '▲ REACHABLE ROADMAP'}
            </span>
            <button
              onClick={() => setExplainDrawerRoleId(role.id)}
              className="px-3 py-1.5 rounded-xl border border-[#EAE6DF] bg-[#FAF9F5] text-[#525B67] hover:text-[#FF5A1F] flex items-center gap-1.5 font-mono transition cursor-pointer shadow-xs"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Full Audit Trace</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mt-8 pt-8 border-t border-[#EAE6DF]">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#14171A] tracking-tight font-sans">
              {role.title}
            </h1>
            <p className="text-sm text-[#525B67] mt-2 max-w-2xl leading-relaxed">
              {role.description}
            </p>
          </div>

          <div className="p-6 bg-[#FAF9F5] rounded-2xl border border-[#EAE6DF] font-mono text-right shrink-0">
            <div className="text-[10px] text-[#6E7A8A] uppercase font-bold tracking-wider">CALCULATED READINESS</div>
            <div className={`text-5xl font-mono font-black mt-1 ${isReadyNow ? 'text-[#059669]' : 'text-[#D97706]'}`}>
              <AnimatedCounter value={selectedRoleMatch.overallScore} suffix="%" />
            </div>
            <div className="text-xs text-[#6E7A8A] mt-1">
              100% Deterministic Scorer
            </div>
          </div>
        </div>

        {/* Key Benchmark Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#EAE6DF] font-mono text-xs">
          <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#EAE6DF]">
            <div className="text-[10px] text-[#6E7A8A] uppercase font-semibold tracking-wider">SALARY BENCHMARK</div>
            <div className="text-base font-bold text-[#14171A] mt-1">{role.salaryRange}</div>
          </div>
          <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#EAE6DF]">
            <div className="text-[10px] text-[#6E7A8A] uppercase font-semibold tracking-wider">MARKET GROWTH</div>
            <div className="text-base font-bold text-[#FF5A1F] mt-1">{role.demandGrowthRate}</div>
          </div>
          <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#EAE6DF]">
            <div className="text-[10px] text-[#6E7A8A] uppercase font-semibold tracking-wider">CRITICAL COVERAGE</div>
            <div className="text-base font-bold text-[#14171A] mt-1">{selectedRoleMatch.criticalCoveragePercent}%</div>
          </div>
          <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#EAE6DF]">
            <div className="text-[10px] text-[#6E7A8A] uppercase font-semibold tracking-wider">ACTIVE BLOCKERS</div>
            <div className={`text-base font-bold mt-1 ${blockers.length > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
              {blockers.length} Unresolved
            </div>
          </div>
        </div>
      </div>

      {/* Why This Career Panel */}
      <div className="editorial-card rounded-2xl bg-white overflow-hidden">
        <div className="p-5 sm:p-6 bg-[#FAF9F5] border-b border-[#EAE6DF] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#FF5A1F]" />
            <span className="text-xs font-mono font-bold uppercase text-[#14171A]">
              Deterministic Audit & Justification
            </span>
          </div>
          <span className="text-xs font-mono text-[#6E7A8A]">
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
      <div className="editorial-card p-8 sm:p-10 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div>
            <h2 className="text-lg font-mono uppercase text-[#14171A] font-bold">
              Competency Alignment Matrix
            </h2>
            <div className="text-sm text-[#6E7A8A] mt-0.5">
              Direct arithmetic comparison between verified profile evidence and role requirements.
            </div>
          </div>
          <span className="text-xs font-mono text-[#6E7A8A] bg-[#FAF9F5] px-3 py-1.5 rounded-xl border border-[#EAE6DF] shrink-0 self-start font-medium">
            {role.requiredSkills.length} Required Dimensions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#EAE6DF] text-[#6E7A8A] uppercase text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Required Competency</th>
                <th className="py-3.5 px-4 font-semibold">Target Level</th>
                <th className="py-3.5 px-4 font-semibold">Your Evidence State</th>
                <th className="py-3.5 px-4 font-semibold">Confidence</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6DF]/70">
              {role.requiredSkills.map((req) => {
                const skill = userProfile.skills ? userProfile.skills[req.skillId] : undefined;
                const meta = SKILLS_TAXONOMY[req.skillId];
                const isCritical = req.importance === 'Critical';
                const hasSkill = !!skill;
                const isSatisfied = skill && skill.confidence >= 60 && skill.state !== 'claimed';

                return (
                  <tr key={req.skillId} className="hover:bg-[#FAF9F5]/70 transition">
                    <td className="py-4 px-4">
                      <div className="font-bold text-sm text-[#14171A]">{meta?.name || req.skillId}</div>
                      <div className="text-[11px] text-[#6E7A8A] flex items-center gap-2 mt-0.5">
                        <span className={isCritical ? 'text-rose-700 font-bold' : 'text-[#6E7A8A]'}>
                          [{req.importance.toUpperCase()}]
                        </span>
                        <span>Weight: {Math.round(req.weight * 100)}%</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 bg-[#FAF9F5] rounded-lg border border-[#EAE6DF] text-[#14171A] font-medium text-xs">
                        {req.requiredLevel}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`telemetry-badge text-[10px] ${
                          skill?.state === 'validated' ? 'telemetry-validated' :
                          skill?.state === 'evidenced' ? 'telemetry-evidenced' :
                          skill?.state === 'detected' ? 'telemetry-detected' :
                          skill ? 'telemetry-claimed' : 'bg-stone-100 text-stone-500'
                        }`}>
                          {skill ? skill.state : 'None'}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 bg-[#EAE6DF] rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isSatisfied ? 'bg-emerald-500' : hasSkill ? 'bg-amber-500' : 'bg-stone-300'
                            }`}
                            style={{ width: `${skill ? skill.confidence : 0}%` }}
                          />
                        </div>
                        <span className="font-bold text-xs text-[#14171A]">{skill ? `${skill.confidence}%` : '0%'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {isSatisfied ? (
                        <span className="text-emerald-700 flex items-center gap-1.5 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Satisfied
                        </span>
                      ) : isCritical ? (
                        <span className="text-rose-700 flex items-center gap-1.5 text-xs font-bold">
                          <AlertTriangle className="w-4 h-4 text-rose-600" /> Critical Blocker
                        </span>
                      ) : (
                        <span className="text-amber-800 text-xs font-medium">
                          Optional Gap
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      {!isSatisfied && (
                        <button
                          onClick={() => launchAssessment(req.skillId)}
                          className="px-3 py-1 bg-white hover:bg-[#FFF5F0] text-[#FF5A1F] border border-[#FFD5C4] rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
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
      <div className="editorial-card p-8 bg-white font-mono text-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DF]">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-[#FF5A1F]" />
            <span className="font-bold text-[#14171A] uppercase tracking-wider text-xs">
              Active Scoring Equation (ADR-002 Deterministic Kernel)
            </span>
          </div>
          <span className="text-xs text-[#6E7A8A]">
            DETERMINISTIC FORMULA
          </span>
        </div>

        <div className="p-4 my-4 bg-[#FAF9F5] rounded-xl border border-[#EAE6DF] overflow-x-auto text-xs text-[#14171A] leading-relaxed">
          <code>{audit.calculationEquation}</code>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#6E7A8A] pt-2">
          <div>Weighted Coverage: <strong className="text-[#14171A]">{audit.intermediateFactors.weightedCoveragePercent}%</strong></div>
          <div>Weighted Evidence: <strong className="text-[#14171A]">{audit.intermediateFactors.weightedEvidencePercent}%</strong></div>
          <div>Proficiency Alignment: <strong className="text-[#14171A]">{audit.intermediateFactors.weightedProficiencyPercent}%</strong></div>
          <div>Blocker Penalty: <strong className="text-rose-600">-{audit.totalBlockerPenalty}%</strong></div>
        </div>
      </div>

      {/* Next Best Action & Strategic Trajectory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Next Best Action Card */}
        <div className="editorial-card p-8 sm:p-9 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#FF5A1F] uppercase font-bold">
              <Zap className="w-4 h-4" />
              <span>HIGHEST LEVERAGE NEXT ACTION</span>
            </div>

            <h3 className="text-xl font-bold text-[#14171A] mt-3 font-sans">
              {nextAction.actionTitle}
            </h3>
            <p className="text-sm text-[#525B67] mt-2 leading-relaxed">
              {nextAction.actionDescription}
            </p>

            <div className="mt-6 p-4 bg-[#FAF9F5] rounded-xl border border-[#EAE6DF] text-xs font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6E7A8A]">Target Competency:</span>
                <span className="font-bold text-[#14171A]">{nextAction.skillName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E7A8A]">Estimated Sprints:</span>
                <span className="font-bold text-[#14171A]">{Math.ceil(nextAction.estimatedHours / 10)} Sprints ({nextAction.estimatedHours} hrs)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E7A8A]">Expected Role Score Boost:</span>
                <span className="font-bold text-emerald-700">+{nextAction.expectedScoreBoost}%</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-[#EAE6DF] flex gap-3">
            <button
              onClick={() => setActiveScreen('gap_dag')}
              className="btn btn-secondary flex-1 justify-center text-xs py-2.5 cursor-pointer"
            >
              <GitBranch className="w-4 h-4 text-[#FF5A1F]" />
              <span>Prerequisite DAG</span>
            </button>
            <button
              onClick={() => setActiveScreen('learning')}
              className="btn btn-primary flex-1 justify-center text-xs py-2.5 cursor-pointer"
            >
              <span>Learning Units</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Strategic Trajectory Advice */}
        <div className="editorial-card p-8 sm:p-9 bg-white flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-[#6E7A8A] uppercase font-bold">
              EXPLAINABILITY SUMMARY
            </div>

            <h3 className="text-xl font-bold text-[#14171A] mt-3 font-sans">
              Evidence Governance Verdict
            </h3>

            <p className="text-sm text-[#525B67] mt-3 leading-relaxed whitespace-pre-line">
              {selectedRoleMatch.explainabilitySummary}
            </p>
          </div>

          <div className="mt-8 pt-5 border-t border-[#EAE6DF] flex items-center justify-between">
            <button
              onClick={() => setActiveScreen('careers')}
              className="text-xs font-mono text-[#6E7A8A] hover:text-[#14171A] flex items-center gap-1.5 cursor-pointer"
            >
              ← Back to Careers
            </button>
            <button
              onClick={() => setExplainDrawerRoleId(role.id)}
              className="btn btn-ghost text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Audit Trace</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
