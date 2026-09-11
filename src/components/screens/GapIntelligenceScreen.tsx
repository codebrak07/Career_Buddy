import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { buildPrerequisiteDAG } from '../../services/gapEngine';
import { SectionIndex } from '../common/SectionIndex';
import { DAGVisualGraph } from '../common/DAGVisualGraph';
import { 
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  ArrowRight,
  Network,
  ListTree
} from 'lucide-react';

export const GapIntelligenceScreen: React.FC = () => {
  const { selectedRoleMatch, userProfile, launchAssessment, setActiveScreen } = useApp();
  const [viewMode, setViewMode] = useState<'graph' | 'phases' | 'both'>('graph');

  const role = selectedRoleMatch.role;
  const dag = buildPrerequisiteDAG(role, userProfile.skills);

  return (
    <div className="space-y-6 py-4">
      
      {/* Header Banner */}
      <div className="bento-cell p-6 sm:p-8 rounded-2xl border border-[#E7E2D6] bg-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <SectionIndex 
            index="05" 
            label="PREREQUISITE DEPENDENCY GRAPH" 
            sublabel="Directed Acyclic Graph (DAG) sequencing prerequisites so learning is causal rather than an unprioritized list of disconnected skills."
          />
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-[#FAF9F5] border border-[#E7E2D6] font-bold text-[#18181B]">
              TARGET: {role.title.toUpperCase()}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              {dag.completedNodes}/{dag.totalNodes} NODES SATISFIED
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-5 border-t border-[#E7E2D6]">
          <div className="flex justify-between text-xs font-mono mb-2">
            <span className="text-[#71717A]">Prerequisite Graph Completion:</span>
            <span className="text-[#FF4F00] font-bold">{Math.round((dag.completedNodes / dag.totalNodes) * 100)}%</span>
          </div>
          <div className="w-full bg-[#E7E2D6] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#FF4F00] h-full rounded-full transition-all duration-500"
              style={{ width: `${(dag.completedNodes / dag.totalNodes) * 100}%` }}
            />
          </div>
        </div>

        {/* Graph / Phased List View Mode Toggle */}
        <div className="mt-5 pt-4 border-t border-[#E7E2D6] flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs font-mono text-[#71717A] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive Topological DAG Active</span>
          </div>

          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#FAF9F5] border border-[#E7E2D6] font-mono text-xs">
            <button
              onClick={() => setViewMode('graph')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                viewMode === 'graph'
                  ? 'bg-[#18181B] text-white font-bold shadow-xs'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              <Network className="w-3.5 h-3.5 text-[#FF4F00]" />
              <span>Interactive Graph</span>
            </button>
            <button
              onClick={() => setViewMode('phases')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                viewMode === 'phases'
                  ? 'bg-[#18181B] text-white font-bold shadow-xs'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              <ListTree className="w-3.5 h-3.5" />
              <span>Phased List</span>
            </button>
            <button
              onClick={() => setViewMode('both')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                viewMode === 'both'
                  ? 'bg-[#18181B] text-white font-bold shadow-xs'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              <span>Split View</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Interactive DAG Visual Graph Canvas ───────────────── */}
      {(viewMode === 'graph' || viewMode === 'both') && (
        <DAGVisualGraph
          dag={dag}
          onLaunchAssessment={launchAssessment}
        />
      )}

      {/* Phased Visual Pipeline (Phases 1, 2, and 3) */}
      {(viewMode === 'phases' || viewMode === 'both') && (
      <div className="space-y-4">
        {dag.phases.map((phase) => {
          const phaseNodes = dag.nodes.filter(n => phase.nodeIds.includes(n.id));

          return (
            <div key={phase.phaseNumber} className="bento-cell p-6 rounded-2xl border border-[#E7E2D6] bg-white shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E7E2D6]">
                <div className="flex items-center space-x-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                    phase.isPhaseCompleted 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-[#FFF9F6] text-[#FF4F00] border border-[#FF4F00]/30'
                  }`}>
                    0{phase.phaseNumber}
                  </span>
                  <h2 className="text-base font-bold text-[#18181B] tracking-tight">{phase.phaseTitle}</h2>
                </div>

                <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                  phase.isPhaseCompleted 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {phase.isPhaseCompleted ? 'PHASE COMPLETE' : 'IN PROGRESS'}
                </span>
              </div>

              {/* Node Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {phaseNodes.map((node) => {
                  const isCompleted = node.status === 'completed';
                  const isUnlocked = node.status === 'unlocked' || node.status === 'in_progress';

                  return (
                    <div
                      key={node.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                        isCompleted
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : isUnlocked
                          ? 'bg-[#FFFDFB] border-[#FF4F00] ring-1 ring-[#FF4F00]/20 shadow-xs'
                          : 'bg-[#FAF9F5] border-[#E7E2D6]'
                      }`}
                    >
                      <div>
                        {/* Node Top Header */}
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-bold text-[#18181B]">{node.name}</span>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : isUnlocked ? (
                            <PlayCircle className="w-4 h-4 text-[#FF4F00] shrink-0" />
                          ) : (
                            <Lock className="w-4 h-4 text-[#A1A1AA] shrink-0" />
                          )}
                        </div>

                        {/* Status Label */}
                        <div className="flex items-center space-x-2 text-[10px] font-mono mt-1">
                          <span className={
                            isCompleted ? 'text-emerald-700 font-bold' :
                            isUnlocked ? 'text-[#FF4F00] font-bold' :
                            'text-[#A1A1AA]'
                          }>
                            {isCompleted ? 'VERIFIED COMPLETED' :
                             isUnlocked ? 'READY TO LEARN (UNLOCKED)' :
                             'LOCKED BY PREREQUISITES'}
                          </span>
                        </div>

                        {/* Dependencies pill list */}
                        {node.dependencies.length > 0 && (
                          <div className="mt-2.5 text-[10px] font-mono text-[#71717A]">
                            <span className="text-[#18181B] font-semibold">Requires: </span>
                            {node.dependencies.join(', ')}
                          </div>
                        )}
                      </div>

                      {/* Bottom Action */}
                      <div className="mt-4 pt-3 border-t border-[#E7E2D6]/60 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#71717A]">
                          Confidence: <strong className="text-[#18181B]">{node.userConfidence}%</strong>
                        </span>

                        {isUnlocked && (
                          <button
                            onClick={() => launchAssessment(node.id)}
                            className="px-2.5 py-1 bg-[#FF4F00] hover:bg-[#E04500] text-white text-[10px] font-mono rounded font-bold transition shadow-xs"
                          >
                            Validate
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Jump to Learning Path Banner */}
      <div className="bento-cell p-6 rounded-2xl border border-[#E7E2D6] bg-[#FAF9F5] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-[#18181B]">
            Ready to remediate active DAG blockers?
          </div>
          <div className="text-xs text-[#52525B] mt-0.5">
            Explore curated learning modules and capstone blueprints mapped directly to each graph node.
          </div>
        </div>

        <button
          onClick={() => setActiveScreen('learning')}
          className="btn btn-primary text-xs shrink-0"
        >
          <span>View Learning Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
