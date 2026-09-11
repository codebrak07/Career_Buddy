import React, { useState, useMemo } from 'react';
import type { DAGNode, PrerequisiteDAG } from '../../services/gapEngine';
import { 
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface DAGVisualGraphProps {
  dag: PrerequisiteDAG;
  onLaunchAssessment?: (skillId: string) => void;
  onSelectNode?: (nodeId: string) => void;
}

export const DAGVisualGraph: React.FC<DAGVisualGraphProps> = ({
  dag,
  onLaunchAssessment,
  onSelectNode
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    dag.unlockedNextNodes[0] || dag.nodes[0]?.id || null
  );
  const [filterMode, setFilterMode] = useState<'all' | 'critical' | 'unlocked'>('all');

  // Find currently selected node
  const selectedNode = useMemo(() => {
    return dag.nodes.find(n => n.id === selectedNodeId) || dag.nodes[0] || null;
  }, [dag.nodes, selectedNodeId]);

  // Compute node phases and columns
  const phaseColumns = useMemo(() => {
    return dag.phases.map(phase => {
      const nodes = dag.nodes.filter(n => phase.nodeIds.includes(n.id));
      return {
        ...phase,
        nodes
      };
    });
  }, [dag]);

  // Map nodes to coordinates for SVG bezier connectors
  const nodeLayout = useMemo(() => {
    const layout: Record<string, { x: number; y: number; width: number; height: number; colIndex: number; rowIndex: number }> = {};
    const colWidth = 280;
    const colGap = 120;
    const rowHeight = 110;
    const rowGap = 24;
    const startX = 20;
    const startY = 40;

    phaseColumns.forEach((col, colIdx) => {
      const x = startX + colIdx * (colWidth + colGap);
      col.nodes.forEach((node, rowIdx) => {
        const y = startY + rowIdx * (rowHeight + rowGap);
        layout[node.id] = {
          x,
          y,
          width: colWidth,
          height: rowHeight,
          colIndex: colIdx,
          rowIndex: rowIdx
        };
      });
    });

    const totalWidth = startX * 2 + phaseColumns.length * colWidth + (phaseColumns.length - 1) * colGap;
    const maxRows = Math.max(...phaseColumns.map(p => p.nodes.length), 1);
    const totalHeight = startY * 2 + maxRows * (rowHeight + rowGap);

    return { layout, totalWidth, totalHeight };
  }, [phaseColumns]);

  // Compute SVG connector paths between prerequisite and dependent nodes
  const svgEdges = useMemo(() => {
    return dag.edges.map(edge => {
      const fromPos = nodeLayout.layout[edge.from];
      const toPos = nodeLayout.layout[edge.to];
      if (!fromPos || !toPos) return null;

      const fromNode = dag.nodes.find(n => n.id === edge.from);
      const toNode = dag.nodes.find(n => n.id === edge.to);

      // Start from right center of parent node
      const x1 = fromPos.x + fromPos.width;
      const y1 = fromPos.y + fromPos.height / 2;

      // End at left center of child node
      const x2 = toPos.x;
      const y2 = toPos.y + toPos.height / 2;

      // Cubic bezier control points
      const dx = Math.max((x2 - x1) / 2, 40);
      const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

      const isCompleted = fromNode?.status === 'completed' && toNode?.status === 'completed';
      const isActiveRoute = fromNode?.status === 'completed' && (toNode?.status === 'unlocked' || toNode?.status === 'in_progress');
      const isHighlighted = selectedNodeId === edge.from || selectedNodeId === edge.to;

      return {
        id: `${edge.from}->${edge.to}`,
        from: edge.from,
        to: edge.to,
        pathD,
        isCompleted,
        isActiveRoute,
        isHighlighted,
        toNode
      };
    }).filter(Boolean);
  }, [dag.edges, dag.nodes, nodeLayout.layout, selectedNodeId]);

  const handleNodeClick = (node: DAGNode) => {
    setSelectedNodeId(node.id);
    onSelectNode?.(node.id);
  };

  return (
    <div className="rounded-2xl border border-[#E7E2D6] bg-[#FCFBF8] shadow-sm overflow-hidden flex flex-col">
      {/* ── Graph Toolbar & Controls ─────────────────────── */}
      <div className="px-5 py-3.5 border-b border-[#E7E2D6] bg-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FF4F00] animate-ping" />
          <span className="text-xs font-mono font-bold text-[#18181B] uppercase tracking-wider">
            Topological Dependency Visualizer
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
            {dag.nodes.length} Nodes · {dag.edges.length} Causal Edges
          </span>
        </div>

        {/* Filters & Legend */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
          <div className="flex items-center gap-1 bg-[#FAF9F5] p-0.5 rounded-lg border border-[#E7E2D6]">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-md transition ${
                filterMode === 'all'
                  ? 'bg-[#18181B] text-white font-bold'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              All Nodes ({dag.nodes.length})
            </button>
            <button
              onClick={() => setFilterMode('unlocked')}
              className={`px-2.5 py-1 rounded-md transition ${
                filterMode === 'unlocked'
                  ? 'bg-[#FF4F00] text-white font-bold'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              Ready to Prove ({dag.unlockedNextNodes.length})
            </button>
            <button
              onClick={() => setFilterMode('critical')}
              className={`px-2.5 py-1 rounded-md transition ${
                filterMode === 'critical'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              Critical Blockers
            </button>
          </div>

          {/* Mini Legend */}
          <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-stone-200 text-[10px] text-stone-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Verified (≥65%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#FF4F00]" />
              Unlocked / Ready
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-stone-300" />
              Locked by Prereqs
            </span>
          </div>
        </div>
      </div>

      {/* ── Interactive DAG Graph Canvas ─────────────────── */}
      <div className="relative overflow-x-auto p-6 min-h-[460px] bg-gradient-to-br from-[#FAF9F5] via-white to-[#F6F4EE]">
        {/* Phase Column Headers */}
        <div 
          className="flex justify-between mb-4 pointer-events-none"
          style={{ width: `${Math.max(nodeLayout.totalWidth, 900)}px` }}
        >
          {phaseColumns.map((col) => (
            <div 
              key={col.phaseNumber}
              className="px-3 py-1.5 rounded-lg bg-white/80 backdrop-blur-xs border border-[#E7E2D6] shadow-2xs text-left"
              style={{ width: '280px' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#FF4F00] uppercase">
                  PHASE 0{col.phaseNumber}
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  col.isPhaseCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                }`}>
                  {col.isPhaseCompleted ? 'COMPLETED' : 'IN PROGRESS'}
                </span>
              </div>
              <div className="text-xs font-bold text-[#18181B] truncate mt-0.5">
                {col.phaseTitle}
              </div>
            </div>
          ))}
        </div>

        {/* SVG Bezier Edges Layer */}
        <div 
          className="relative"
          style={{ 
            width: `${Math.max(nodeLayout.totalWidth, 900)}px`,
            height: `${Math.max(nodeLayout.totalHeight, 380)}px`
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/* Arrow markers */}
              <marker
                id="dag-arrow-completed"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#10B981" />
              </marker>
              <marker
                id="dag-arrow-active"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#FF4F00" />
              </marker>
              <marker
                id="dag-arrow-locked"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#D4D4D8" />
              </marker>
            </defs>

            {/* Render all causal connection curves */}
            {svgEdges.map((edge) => {
              if (!edge) return null;
              const strokeColor = edge.isHighlighted
                ? '#FF4F00'
                : edge.isCompleted
                ? '#10B981'
                : edge.isActiveRoute
                ? '#FF4F00'
                : '#D4D4D8';

              const strokeWidth = edge.isHighlighted ? 2.5 : edge.isActiveRoute ? 2 : 1.5;
              const markerId = edge.isCompleted
                ? 'dag-arrow-completed'
                : edge.isActiveRoute || edge.isHighlighted
                ? 'dag-arrow-active'
                : 'dag-arrow-locked';

              return (
                <g key={edge.id}>
                  <path
                    d={edge.pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={edge.isCompleted ? undefined : edge.isActiveRoute ? '4 2' : '3 3'}
                    markerEnd={`url(#${markerId})`}
                    className="transition-all duration-300"
                    opacity={edge.isHighlighted ? 1 : edge.isCompleted ? 0.85 : 0.65}
                  />
                  {edge.isActiveRoute && (
                    <circle r="3" fill="#FF4F00">
                      <animateMotion dur="3s" repeatCount="indefinite" path={edge.pathD} />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Render Interactive Nodes */}
          {dag.nodes.map((node) => {
            const pos = nodeLayout.layout[node.id];
            if (!pos) return null;

            const isSelected = selectedNodeId === node.id;
            const isCompleted = node.status === 'completed';
            const isUnlocked = node.status === 'unlocked' || node.status === 'in_progress';

            // Filter check
            if (filterMode === 'unlocked' && !isUnlocked) return null;
            if (filterMode === 'critical' && !node.isCritical) return null;

            return (
              <div
                key={node.id}
                onClick={() => handleNodeClick(node)}
                style={{
                  position: 'absolute',
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  width: `${pos.width}px`,
                  height: `${pos.height}px`,
                }}
                className={`z-10 cursor-pointer p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between select-none ${
                  isSelected
                    ? 'ring-2 ring-[#FF4F00] shadow-md bg-white border-[#FF4F00] -translate-y-1'
                    : isCompleted
                    ? 'bg-white border-emerald-200 shadow-2xs hover:border-emerald-400 hover:shadow-xs'
                    : isUnlocked
                    ? 'bg-[#FFFDFB] border-[#FF4F00]/50 shadow-2xs hover:border-[#FF4F00] hover:shadow-xs'
                    : 'bg-[#F9F8F5] border-[#E7E2D6] opacity-80 hover:opacity-100 hover:bg-white'
                }`}
              >
                {/* Node Header */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-stone-500 truncate max-w-[170px]">
                      {node.category}
                    </span>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        {node.userConfidence}%
                      </span>
                    ) : isUnlocked ? (
                      <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-[#FF4F00] bg-[#FFF1EB] px-1.5 py-0.5 rounded border border-[#FFCDB5] animate-pulse">
                        <PlayCircle className="w-2.5 h-2.5 text-[#FF4F00]" />
                        READY
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[9px] font-mono font-medium text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                        <Lock className="w-2.5 h-2.5" />
                        GATED
                      </span>
                    )}
                  </div>

                  <div className="font-bold text-xs text-[#18181B] line-clamp-1">
                    {node.name}
                  </div>
                </div>

                {/* Node Footer: Prereqs or Action */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] font-mono">
                  {node.dependencies.length > 0 ? (
                    <span className="text-stone-500 truncate max-w-[150px]">
                      Req: {node.dependencies.length} prereq{node.dependencies.length > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-semibold">
                      Foundational root
                    </span>
                  )}

                  {node.isCritical && (
                    <span className="text-[8px] font-black uppercase tracking-tighter px-1 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                      CRITICAL
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Selected Node Inspector Drawer / Banner ─────── */}
      {selectedNode && (
        <div className="p-4 sm:p-5 border-t border-[#E7E2D6] bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded border ${
                selectedNode.status === 'completed'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : selectedNode.status === 'unlocked' || selectedNode.status === 'in_progress'
                  ? 'bg-[#FFF1EB] text-[#FF4F00] border-[#FFCDB5]'
                  : 'bg-stone-100 text-stone-700 border-stone-200'
              }`}>
                {selectedNode.status === 'completed' ? '● VERIFIED COMPETENCY' :
                 selectedNode.status === 'unlocked' ? '⚡ READY FOR VALIDATION' :
                 '🔒 LOCKED BY PREREQUISITES'}
              </span>
              <span className="text-xs font-mono text-stone-500">
                Phase 0{selectedNode.phase} · {selectedNode.category}
              </span>
            </div>

            <div className="text-sm sm:text-base font-bold text-[#18181B]">
              {selectedNode.name}
            </div>

            <div className="text-xs text-[#52525B] flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>
                Evidence Confidence: <strong>{selectedNode.userConfidence}%</strong>
              </span>
              {selectedNode.dependencies.length > 0 && (
                <span>
                  Requires: <strong>{selectedNode.dependencies.join(', ')}</strong>
                </span>
              )}
              {selectedNode.dependents.length > 0 && (
                <span>
                  Unlocks: <strong>{selectedNode.dependents.join(', ')}</strong>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {selectedNode.status === 'unlocked' || selectedNode.status === 'in_progress' ? (
              <button
                onClick={() => onLaunchAssessment?.(selectedNode.id)}
                className="btn btn-primary text-xs py-2 px-4 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Take Groq Validation Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : selectedNode.status === 'completed' ? (
              <button
                onClick={() => onLaunchAssessment?.(selectedNode.id)}
                className="btn btn-secondary text-xs py-2 px-4"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Re-Test Mastery</span>
              </button>
            ) : (
              <div className="text-xs font-mono text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Satisfy upstream prerequisites to unlock this node</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
