import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { SectionIndex } from '../common/SectionIndex';
import { WhyCareerPanel } from '../common/WhyCareerPanel';
import { CareerGpsView } from '../common/CareerGpsView';
import type { RoleMatchResult } from '../../types';
import { 
  HelpCircle, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle
} from 'lucide-react';

export const CareerIntelligenceScreen: React.FC = () => {
  const { 
    allRoleMatches, 
    setSelectedRoleId, 
    setActiveScreen, 
    setExplainDrawerRoleId,
    launchAssessment 
  } = useApp();
  const [activeTab, setActiveTab] = useState<'READY_NOW' | 'REACHABLE' | 'ALL'>('READY_NOW');

  const readyNow = allRoleMatches.readyNow;
  const reachable = allRoleMatches.reachable;
  const exploratory = allRoleMatches.exploratory;

  const displayedRoles = activeTab === 'READY_NOW' 
    ? readyNow 
    : activeTab === 'REACHABLE' 
    ? reachable 
    : [...readyNow, ...reachable, ...exploratory];

  const handleSelectRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    setActiveScreen('career_detail');
  };

  return (
    <div className="space-y-6 py-4">
      
      {/* Header Banner */}
      <div className="bento-cell p-6 sm:p-8 rounded-2xl border border-[#E7E2D6] bg-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <SectionIndex 
            index="03" 
            label="CAREER TRAJECTORIES" 
            sublabel="Roles partitioned into Ready Now vs Reachable based strictly on verified evidence and deterministic requirement satisfaction."
          />
          <div className="flex items-center gap-2 font-mono text-xs text-[#71717A] shrink-0 self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Ready: {readyNow.length}</span>
            <span className="text-[#D4D4D8]">·</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Reachable: {reachable.length}</span>
            <span className="px-2.5 py-1 rounded bg-[#FAF9F5] border border-[#E7E2D6] font-bold text-[#FF4F00]">
              6-FACTOR LINEAR MODEL
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-[#E7E2D6] font-mono">
          <button
            onClick={() => setActiveTab('READY_NOW')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-2 ${
              activeTab === 'READY_NOW'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-xs'
                : 'bg-white text-[#52525B] border border-[#E7E2D6] hover:bg-[#FAF9F5]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>READY NOW ({readyNow.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('REACHABLE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-2 ${
              activeTab === 'REACHABLE'
                ? 'bg-amber-50 text-amber-900 border border-amber-300 font-bold shadow-xs'
                : 'bg-white text-[#52525B] border border-[#E7E2D6] hover:bg-[#FAF9F5]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <span>REACHABLE BRIDGE ({reachable.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-2 ${
              activeTab === 'ALL'
                ? 'bg-[#18181B] text-white font-bold shadow-xs'
                : 'bg-white text-[#52525B] border border-[#E7E2D6] hover:bg-[#FAF9F5]'
            }`}
          >
            <span>ALL EVALUATED ROLES ({readyNow.length + reachable.length + exploratory.length})</span>
          </button>
        </div>
      </div>

      {/* ── Career GPS Trajectory Visualizer ──────── */}
      <CareerGpsView allMatches={{ readyNow, reachable }} />

      {/* Role Cards Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedRoles.map((match: RoleMatchResult) => {
          const isReadyNow = match.category === 'READY_NOW';
          const b = match.breakdown;
          const activeBlockers = match.missingCompetencies.filter(m => m.isBlocker);

          return (
            <div 
              key={match.roleId} 
              className={`bento-cell rounded-2xl border transition-all duration-200 bg-white shadow-sm flex flex-col justify-between overflow-hidden ${
                isReadyNow 
                  ? 'border-[#E7E2D6] hover:border-emerald-300' 
                  : 'border-[#E7E2D6] hover:border-amber-300'
              }`}
            >
              <div className="p-6 sm:p-7">
                {/* Card Top Metadata */}
                <div className="flex items-start justify-between">
                  <div>
                    <span 
                      className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        isReadyNow 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {isReadyNow ? '● READY NOW CANDIDATE' : '▲ REACHABLE ADJACENCY'}
                    </span>
                    <h2 className="text-xl font-bold text-[#18181B] mt-2 tracking-tight">
                      {match.role.title}
                    </h2>
                    <div className="text-xs font-mono text-[#71717A] mt-0.5">
                      {match.role.category} · {match.role.salaryRange}
                    </div>
                  </div>

                  {/* Readiness Metric */}
                  <div className="text-right font-mono">
                    <div className="text-[9px] text-[#A1A1AA] uppercase font-bold tracking-wider">FIT SCORE</div>
                    <div className={`text-4xl font-mono font-black ${isReadyNow ? 'text-[#059669]' : 'text-[#D97706]'}`}>
                      <AnimatedCounter value={match.overallScore} suffix="%" />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#52525B] mt-3 leading-relaxed">
                  {match.role.description}
                </p>

                {/* Arithmetic Score Breakdown Bar */}
                <div className="my-4 p-3.5 bg-[#FAF9F5] rounded-xl border border-[#E7E2D6] font-mono text-xs space-y-1.5">
                  <div className="flex justify-between items-center text-[#52525B]">
                    <span>Critical Skill Coverage:</span>
                    <strong className="text-[#18181B]">
                      {match.criticalCoveragePercent}% ({match.matchedSkillsCount}/{match.totalRequiredSkills})
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-[#52525B]">
                    <span>Evidence Strength Score:</span>
                    <strong className="text-[#18181B]">{b.evidenceStrengthScore}%</strong>
                  </div>
                  <div className="flex justify-between items-center text-[#52525B]">
                    <span>Curated Market Signal:</span>
                    <strong className="text-[#FF4F00] font-bold">
                      {match.role.demandGrowthRate} (Idx {b.demandScore})
                    </strong>
                  </div>
                  {b.blockerPenalty > 0 && (
                    <div className="flex justify-between items-center text-rose-700 font-bold pt-1.5 border-t border-[#E7E2D6]">
                      <span>Unresolved Blocker Penalty:</span>
                      <span>-{b.blockerPenalty}%</span>
                    </div>
                  )}
                </div>

                {/* Strong vs Missing Highlights */}
                <div className="space-y-1.5 text-xs">
                  {match.strongEvidenceSkills.length > 0 && (
                    <div className="flex items-start gap-1.5 text-emerald-800 text-[11px] font-mono">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Validated: {match.strongEvidenceSkills.slice(0, 3).join(', ')}</span>
                    </div>
                  )}

                  {activeBlockers.length > 0 && (
                    <div className="flex items-start gap-1.5 text-rose-800 text-[11px] font-mono">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 mt-0.5 shrink-0" />
                      <span>Blocker: Missing {activeBlockers.map(b => b.skillName).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Inline Expandable Why Panel */}
              <WhyCareerPanel 
                match={match} 
                onLaunchAssessment={launchAssessment}
                onOpenTrace={() => setExplainDrawerRoleId(match.roleId)}
              />

              {/* Bottom Actions */}
              <div className="p-4 bg-[#FAF9F5]/70 border-t border-[#E7E2D6] flex items-center justify-between">
                <button
                  onClick={() => setExplainDrawerRoleId(match.roleId)}
                  className="text-xs font-mono text-[#71717A] hover:text-[#FF4F00] flex items-center gap-1.5 font-medium transition"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Mathematical Trace</span>
                </button>

                <button
                  onClick={() => handleSelectRole(match.roleId)}
                  className="btn btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
                >
                  <span>Role Matrix Detail</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FF4F00]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
