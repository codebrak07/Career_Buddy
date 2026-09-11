import React from 'react';
import type { RoleMatchResult } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Compass, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  GitBranch,
  ShieldCheck
} from 'lucide-react';

interface CareerGpsViewProps {
  allMatches: {
    readyNow: RoleMatchResult[];
    reachable: RoleMatchResult[];
  };
}

export const CareerGpsView: React.FC<CareerGpsViewProps> = ({ allMatches }) => {
  const { setSelectedRoleId, setActiveScreen } = useApp();

  const originMatch = allMatches.readyNow[0] || allMatches.reachable[0];
  const targetMatches = allMatches.reachable.slice(0, 3);

  return (
    <div className="paper-dossier p-6 sm:p-8 rounded-2xl border border-[#E7E2D6] bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#E7E2D6]">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF4F00]">
            <Compass className="w-4 h-4 text-[#FF4F00]" />
            <span>TOPOLOGICAL CAREER GPS · TRAJECTORY VECTOR</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-sans text-[#18181B] mt-1">
            Shortest Realistic Capability Pathway
          </h3>
          <p className="text-xs text-[#52525B] mt-1">
            Visualizing the mathematical distance from your verified origin to reachable aspirational milestones.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            ORIGIN: READY NOW
          </span>
          <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            REACHABLE TARGETS
          </span>
        </div>
      </div>

      {/* GPS Topology Graph Visualization */}
      <div className="mt-8 relative overflow-x-auto pb-4">
        <div className="min-w-[700px] flex items-start justify-between relative pt-10 pb-6">
          
          {/* Connecting Pathway Line through node centers */}
          <div className="absolute top-[72px] left-28 right-28 h-0.5 bg-gradient-to-r from-emerald-400 via-sky-400 to-[#FF5A1F] -translate-y-1/2 z-0" />

          {/* Node 1: Origin Candidate Position */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-16 h-16 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center shadow-md border-2 border-white ring-4 ring-emerald-100">
              {/* Floating "You Are Here" Pill Badge */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="px-3 py-1 rounded-full bg-emerald-700 text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 border border-emerald-500/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span>You Are Here</span>
                </span>
              </div>
              <MapPin className="w-5 h-5 text-white" />
              <span className="text-[10px] font-mono font-bold mt-0.5">
                {originMatch ? `${originMatch.overallScore}%` : 'Calibrated'}
              </span>
            </div>
            <div className="mt-3 text-center">
              <div className="text-[10px] font-mono text-emerald-800 font-bold uppercase tracking-wider">CURRENT CAPABILITY</div>
              <div className="text-xs font-bold text-[#14171A] mt-0.5 max-w-[150px] truncate">
                {originMatch ? originMatch.role.title : 'Active Persona'}
              </div>
              <div className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block border border-emerald-200">
                {originMatch ? `${originMatch.overallScore}% Fit` : 'Calibrated'}
              </div>
            </div>
          </div>

          {/* Node 2: First Branching Reachable Career */}
          {targetMatches[0] && (
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-sky-600 text-white flex flex-col items-center justify-center shadow-md border-2 border-white ring-4 ring-sky-100">
                <Target className="w-5 h-5 text-white" />
                <span className="text-[10px] font-mono font-bold mt-0.5">{targetMatches[0].overallScore}%</span>
              </div>
              <div className="mt-3 text-center">
                <div className="text-[10px] font-mono text-sky-800 font-bold uppercase tracking-wider">NEXT ADJACENCY</div>
                <div className="text-xs font-bold text-[#14171A] mt-0.5 max-w-[140px] truncate">
                  {targetMatches[0].role.title}
                </div>
                <div className="text-[10px] font-mono text-[#55554D] mt-1">
                  {targetMatches[0].missingCompetencies.length} Gaps · {targetMatches[0].missingCompetencies.filter(m => m.isBlocker).length} Blockers
                </div>
                <button
                  onClick={() => {
                    setSelectedRoleId(targetMatches[0].role.id);
                    setActiveScreen('career_detail');
                  }}
                  className="mt-1.5 text-[10px] font-mono text-sky-700 font-bold hover:underline flex items-center gap-1 mx-auto cursor-pointer"
                >
                  Inspect Matrix <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          )}

          {/* Node 3: Higher Target Career (e.g. ML Engineer or Cloud Architect) */}
          {targetMatches[1] && (
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[#14171A] text-white flex flex-col items-center justify-center shadow-md border-2 border-white ring-4 ring-stone-200">
                <GitBranch className="w-5 h-5 text-[#FF5A1F]" />
                <span className="text-[10px] font-mono font-bold mt-0.5">{targetMatches[1].overallScore}%</span>
              </div>
              <div className="mt-3 text-center">
                <div className="text-[10px] font-mono text-stone-700 font-bold uppercase tracking-wider">STRATEGIC GOAL</div>
                <div className="text-xs font-bold text-[#14171A] mt-0.5 max-w-[140px] truncate">
                  {targetMatches[1].role.title}
                </div>
                <div className="text-[10px] font-mono text-[#55554D] mt-1">
                  {targetMatches[1].missingCompetencies.length} Gaps · {targetMatches[1].missingCompetencies.filter(m => m.isBlocker).length} Blockers
                </div>
                <button
                  onClick={() => {
                    setSelectedRoleId(targetMatches[1].role.id);
                    setActiveScreen('career_detail');
                  }}
                  className="mt-1.5 text-[10px] font-mono text-[#FF5A1F] font-bold hover:underline flex items-center gap-1 mx-auto cursor-pointer"
                >
                  Inspect Matrix <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* GPS Strategy Ledger */}
      <div className="mt-6 pt-4 border-t border-[#E7E2D6] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E7E2D6]">
          <div className="text-[10px] text-[#71717A] uppercase font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>ESTABLISHED CAPABILITY</span>
          </div>
          <div className="text-stone-800 font-sans mt-1">
            Directly satisfies requirements for high-confidence immediate placement without retraining delays.
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E7E2D6]">
          <div className="text-[10px] text-[#71717A] uppercase font-bold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>CRITICAL BLOCKER GATES</span>
          </div>
          <div className="text-stone-800 font-sans mt-1">
            Identifies gating nodes requiring diagnostic validation tests to unlock the next achievable trajectory tier.
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E7E2D6]">
          <div className="text-[10px] text-[#71717A] uppercase font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>MATHEMATICAL DISTANCE</span>
          </div>
          <div className="text-stone-800 font-sans mt-1">
            Distance is quantified in unresolved competencies and prerequisite depth rather than arbitrary job titles.
          </div>
        </div>
      </div>
    </div>
  );
};
