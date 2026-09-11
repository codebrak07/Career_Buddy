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
    <div className="space-y-10 py-2 max-w-[1360px] mx-auto">
      
      {/* Header Banner */}
      <div className="editorial-card p-8 sm:p-10 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <SectionIndex 
            index="03" 
            label="CAREER TRAJECTORIES" 
            sublabel="Roles partitioned into Ready Now vs Reachable based strictly on verified evidence and deterministic requirement satisfaction."
          />
          <div className="flex items-center gap-2.5 font-mono text-xs text-[#6E7A8A] shrink-0 self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Ready: {readyNow.length}</span>
            <span className="text-[#DDD8CE]">·</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Reachable: {reachable.length}</span>
            <span className="px-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#EAE6DF] font-bold text-[#FF5A1F]">
              6-FACTOR LINEAR MODEL
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2.5 mt-8 pt-6 border-t border-[#EAE6DF] font-mono">
          <button
            onClick={() => setActiveTab('READY_NOW')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'READY_NOW'
                ? 'bg-[#F0FDF4] text-[#059669] border border-[#BBF7D0] font-bold shadow-xs'
                : 'bg-white text-[#525B67] border border-[#EAE6DF] hover:bg-[#FAF9F5] hover:text-[#14171A]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>READY NOW ({readyNow.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('REACHABLE')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'REACHABLE'
                ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] font-bold shadow-xs'
                : 'bg-white text-[#525B67] border border-[#EAE6DF] hover:bg-[#FAF9F5] hover:text-[#14171A]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <span>REACHABLE BRIDGE ({reachable.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-[#14171A] text-white font-bold shadow-xs'
                : 'bg-white text-[#525B67] border border-[#EAE6DF] hover:bg-[#FAF9F5] hover:text-[#14171A]'
            }`}
          >
            <span>ALL EVALUATED ROLES ({readyNow.length + reachable.length + exploratory.length})</span>
          </button>
        </div>
      </div>

      {/* ── Career GPS Trajectory Visualizer ──────── */}
      <CareerGpsView allMatches={{ readyNow, reachable }} />

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayedRoles.map((match: RoleMatchResult) => {
          const isReadyNow = match.category === 'READY_NOW';
          const b = match.breakdown;
          const activeBlockers = match.missingCompetencies.filter(m => m.isBlocker);

          return (
            <div 
              key={match.roleId} 
              className={`editorial-card rounded-2xl bg-white flex flex-col justify-between overflow-hidden transition-all ${
                isReadyNow 
                  ? 'hover:border-emerald-300' 
                  : 'hover:border-amber-300'
              }`}
            >
              <div className="p-8 sm:p-9">
                {/* Card Top Metadata */}
                <div className="flex items-start justify-between">
                  <div>
                    <span 
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        isReadyNow 
                          ? 'bg-[#F0FDF4] text-[#059669] border-[#BBF7D0]' 
                          : 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]'
                      }`}
                    >
                      {isReadyNow ? '● READY NOW TARGET' : '▲ REACHABLE ADJACENCY'}
                    </span>
                    <h2 className="text-2xl font-bold text-[#14171A] mt-3 tracking-tight font-sans">
                      {match.role.title}
                    </h2>
                    <div className="text-xs font-mono text-[#6E7A8A] mt-1">
                      {match.role.category} · {match.role.salaryRange}
                    </div>
                  </div>

                  {/* Readiness Metric */}
                  <div className="text-right font-mono">
                    <div className="text-[10px] text-[#9AA5B5] uppercase font-bold tracking-wider">FIT SCORE</div>
                    <div className={`text-4xl font-mono font-black ${isReadyNow ? 'text-[#059669]' : 'text-[#D97706]'}`}>
                      <AnimatedCounter value={match.overallScore} suffix="%" />
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#525B67] mt-4 leading-relaxed">
                  {match.role.description}
                </p>

                {/* Arithmetic Score Breakdown Bar */}
                <div className="my-6 p-4 bg-[#FAF9F5] rounded-xl border border-[#EAE6DF] font-mono text-xs space-y-2">
                  <div className="flex justify-between items-center text-[#525B67]">
                    <span>Critical Skill Coverage:</span>
                    <strong className="text-[#14171A]">
                      {match.criticalCoveragePercent}% ({match.matchedSkillsCount}/{match.totalRequiredSkills})
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-[#525B67]">
                    <span>Evidence Strength Score:</span>
                    <strong className="text-[#14171A]">{b.evidenceStrengthScore}%</strong>
                  </div>
                  <div className="flex justify-between items-center text-[#525B67]">
                    <span>Curated Market Signal:</span>
                    <strong className="text-[#FF5A1F] font-bold">
                      {match.role.demandGrowthRate} (Idx {b.demandScore})
                    </strong>
                  </div>
                  {b.blockerPenalty > 0 && (
                    <div className="flex justify-between items-center text-rose-700 font-bold pt-2 border-t border-[#EAE6DF]">
                      <span>Unresolved Blocker Penalty:</span>
                      <span>-{b.blockerPenalty}%</span>
                    </div>
                  )}
                </div>

                {/* Strong vs Missing Highlights */}
                <div className="space-y-2 text-xs">
                  {match.strongEvidenceSkills.length > 0 && (
                    <div className="flex items-start gap-2 text-emerald-800 text-xs font-mono">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Validated: {match.strongEvidenceSkills.slice(0, 3).join(', ')}</span>
                    </div>
                  )}

                  {activeBlockers.length > 0 && (
                    <div className="flex items-start gap-2 text-rose-800 text-xs font-mono">
                      <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                      <span>Blocker: Missing {activeBlockers.map(b => b.skillName).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Inline Expandable Why Panel */}
              <div className="px-8 pb-4">
                <WhyCareerPanel 
                  match={match} 
                  onLaunchAssessment={launchAssessment}
                  onOpenTrace={() => setExplainDrawerRoleId(match.roleId)}
                />
              </div>

              {/* Bottom Actions */}
              <div className="p-5 bg-[#FAF9F5] border-t border-[#EAE6DF] flex items-center justify-between">
                <button
                  onClick={() => setExplainDrawerRoleId(match.roleId)}
                  className="text-xs font-mono text-[#6E7A8A] hover:text-[#FF5A1F] flex items-center gap-1.5 font-medium transition cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Mathematical Trace</span>
                </button>

                <button
                  onClick={() => handleSelectRole(match.roleId)}
                  className="btn btn-secondary text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Role Matrix Detail</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FF5A1F]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
