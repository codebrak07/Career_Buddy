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
    <div className="space-y-10 py-2 max-w-[1360px] mx-auto">
      
      {/* Header Banner */}
      <div className="editorial-card p-8 sm:p-10 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <SectionIndex 
            index="05" 
            label="PREREQUISITE DEPENDENCY GRAPH" 
            sublabel="Directed Acyclic Graph (DAG) sequencing prerequisites so learning is causal rather than an unprioritized list of disconnected skills."
          />
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#EAE6DF] font-bold text-[#14171A]">
              TARGET: {role.title.toUpperCase()}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-[#F0FDF4] text-[#059669] border border-[#BBF7D0] font-bold">
              {dag.completedNodes}/{dag.totalNodes} NODES SATISFIED
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-8 pt-6 border-t border-[#EAE6DF]">
          <div className="flex justify-between text-xs font-mono mb-2.5">
            <span className="text-[#6E7A8A]">Prerequisite Graph Completion:</span>
            <span className="text-[#FF5A1F] font-bold">{Math.round((dag.completedNodes / dag.totalNodes) * 100)}%</span>
          </div>
          <div className="w-full bg-[#EAE6DF] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#FF5A1F] h-full rounded-full transition-all duration-500"
              style={{ width: `${(dag.completedNodes / dag.totalNodes) * 100}%` }}
            />
          </div>
        </div>

        {/* Graph / Phased List View Mode Toggle */}
        <div className="mt-6 pt-5 border-t border-[#EAE6DF] flex items-center justify-between flex-wrap gap-4">
          <div className="text-xs font-mono text-[#6E7A8A] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive Topological DAG Active</span>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FAF9F5] border border-[#EAE6DF] font-mono text-xs shadow-xs">
            <button
              onClick={() => setViewMode('graph')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'graph'
                  ? 'bg-[#14171A] text-white font-bold shadow-xs'
                  : 'text-[#6E7A8A] hover:text-[#14171A]'
              }`}
            >
              <Network className="w-4 h-4 text-[#FF5A1F]" />
              <span>Interactive Graph</span>
            </button>
            <button
              onClick={() => setViewMode('phases')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'phases'
                  ? 'bg-[#14171A] text-white font-bold shadow-xs'
                  : 'text-[#6E7A8A] hover:text-[#14171A]'
              }`}
            >
              <ListTree className="w-4 h-4" />
              <span>Phased List</span>
            </button>
            <button
              onClick={() => setViewMode('both')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'both'
                  ? 'bg-[#14171A] text-white font-bold shadow-xs'
                  : 'text-[#6E7A8A] hover:text-[#14171A]'
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
      <div className="space-y-6">
        {dag.phases.map((phase) => {
          const phaseNodes = dag.nodes.filter(n => phase.nodeIds.includes(n.id));

          return (
            <div key={phase.phaseNumber} className="editorial-card p-8 bg-white">
              <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#EAE6DF]">
                <div className="flex items-center space-x-3.5">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold ${
                    phase.isPhaseCompleted 
                      ? 'bg-[#F0FDF4] text-[#059669] border border-[#BBF7D0]'
                      : 'bg-[#FFF5F0] text-[#FF5A1F] border border-[#FFD5C4]'
                  }`}>
                    0{phase.phaseNumber}
                  </span>
                  <h2 className="text-lg font-bold text-[#14171A] tracking-tight font-sans">{phase.phaseTitle}</h2>
                </div>

                <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${
                  phase.isPhaseCompleted 
                    ? 'bg-[#F0FDF4] text-[#059669] border-[#BBF7D0]' 
                    : 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]'
                }`}>
                  {phase.isPhaseCompleted ? 'PHASE COMPLETE' : 'IN PROGRESS'}
                </span>
              </div>

              {/* Node Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {phaseNodes.map((node) => {
                  const isCompleted = node.status === 'completed';
                  const isUnlocked = node.status === 'unlocked' || node.status === 'in_progress';

                  return (
                    <div
                      key={node.id}
                      className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                        isCompleted
                          ? 'bg-[#F0FDF4]/60 border-[#BBF7D0]'
                          : isUnlocked
                          ? 'bg-white border-[#FF5A1F] ring-1 ring-[#FF5A1F]/20 shadow-xs'
                          : 'bg-[#FAF9F5] border-[#EAE6DF]'
                      }`}
                    >
                      <div>
                        {/* Node Top Header */}
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-bold text-[#14171A]">{node.name}</span>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : isUnlocked ? (
                            <PlayCircle className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                          ) : (
                            <Lock className="w-4 h-4 text-[#9AA5B5] shrink-0" />
                          )}
                        </div>

                        {/* Status Label */}
                        <div className="flex items-center space-x-2 text-[10px] font-mono mt-1.5">
                          <span className={
                            isCompleted ? 'text-[#059669] font-bold' :
                            isUnlocked ? 'text-[#FF5A1F] font-bold' :
                            'text-[#9AA5B5]'
                          }>
                            {isCompleted ? 'VERIFIED COMPLETED' :
                             isUnlocked ? 'READY TO LEARN (UNLOCKED)' :
                             'LOCKED BY PREREQUISITES'}
                          </span>
                        </div>

                        {/* Dependencies pill list */}
                        {node.dependencies.length > 0 && (
                          <div className="mt-3 text-[11px] font-mono text-[#6E7A8A]">
                            <span className="text-[#14171A] font-semibold">Requires: </span>
                            {node.dependencies.join(', ')}
                          </div>
                        )}
                      </div>

                      {/* Bottom Action */}
                      <div className="mt-5 pt-3.5 border-t border-[#EAE6DF] flex items-center justify-between">
                        <span className="text-xs font-mono text-[#6E7A8A]">
                          Confidence: <strong className="text-[#14171A]">{node.userConfidence}%</strong>
                        </span>

                        {isUnlocked && (
                          <button
                            onClick={() => launchAssessment(node.id)}
                            className="px-3 py-1 bg-[#FF5A1F] hover:bg-[#E64A12] text-white text-xs font-mono rounded-lg font-bold transition shadow-xs cursor-pointer"
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
      <div className="editorial-card p-8 sm:p-9 bg-[#FAF9F5] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-lg font-bold text-[#14171A] font-sans">
            Ready to remediate active DAG blockers?
          </div>
          <div className="text-sm text-[#525B67] mt-1">
            Explore curated learning modules and capstone blueprints mapped directly to each graph node.
          </div>
        </div>

        <button
          onClick={() => setActiveScreen('learning')}
          className="btn btn-primary text-xs px-5 py-2.5 shrink-0 cursor-pointer"
        >
          <span>View Learning Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
