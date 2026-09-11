import { SKILLS_TAXONOMY } from '../data/skillsTaxonomy';
import type { CareerRole, UserSkill } from '../types';

export interface DAGNode {
  id: string;
  name: string;
  category: string;
  status: 'completed' | 'in_progress' | 'unlocked' | 'locked';
  userConfidence: number;
  userState?: string;
  phase: number; // 1: Foundations, 2: Core Engineering, 3: Capstone/Role Specific
  dependencies: string[]; // skill IDs required before this node
  dependents: string[];   // skill IDs unlocked by this node
  isCritical: boolean;
}

export interface PrerequisiteDAG {
  roleId: string;
  roleTitle: string;
  nodes: DAGNode[];
  edges: { from: string; to: string }[];
  phases: {
    phaseNumber: number;
    phaseTitle: string;
    nodeIds: string[];
    isPhaseCompleted: boolean;
  }[];
  totalNodes: number;
  completedNodes: number;
  unlockedNextNodes: string[];
}

export function buildPrerequisiteDAG(
  role: CareerRole,
  userSkills: Record<string, UserSkill>
): PrerequisiteDAG {
  const criticalMap = new Map(role.requiredSkills.map(r => [r.skillId, r.importance === 'Critical']));

  // Collect all skills including ancestor prerequisites
  const includedSkillIds = new Set<string>();

  function collectAncestors(skillId: string) {
    if (includedSkillIds.has(skillId)) return;
    includedSkillIds.add(skillId);
    const meta = SKILLS_TAXONOMY[skillId];
    if (meta && meta.prerequisites) {
      meta.prerequisites.forEach(prereqId => collectAncestors(prereqId));
    }
  }

  // Seed with required skills + role sequence
  role.requiredSkills.forEach(r => collectAncestors(r.skillId));
  role.prerequisiteSequence.forEach(id => collectAncestors(id));

  // Build nodes and dependency graph
  const rawNodes: Map<string, DAGNode> = new Map();
  const edges: { from: string; to: string }[] = [];

  for (const skillId of includedSkillIds) {
    const meta = SKILLS_TAXONOMY[skillId];
    const userSkill = userSkills[skillId];
    const userConfidence = userSkill ? userSkill.confidence : 0;
    const isCompleted = userSkill && userSkill.confidence >= 65 && userSkill.state !== 'claimed';
    const isCritical = criticalMap.get(skillId) ?? false;

    const prereqs = (meta?.prerequisites || []).filter(p => includedSkillIds.has(p));

    rawNodes.set(skillId, {
      id: skillId,
      name: meta ? meta.name : skillId,
      category: meta ? meta.category : 'fundamentals',
      status: isCompleted ? 'completed' : 'locked',
      userConfidence,
      userState: userSkill?.state,
      phase: 1,
      dependencies: prereqs,
      dependents: [],
      isCritical,
    });

    for (const p of prereqs) {
      edges.push({ from: p, to: skillId });
    }
  }

  // Populate dependents
  for (const edge of edges) {
    const fromNode = rawNodes.get(edge.from);
    if (fromNode) {
      fromNode.dependents.push(edge.to);
    }
  }

  // Calculate topological phases / depth
  function computeDepth(nodeId: string, visited = new Set<string>()): number {
    if (visited.has(nodeId)) return 1; // prevent cycle crash
    visited.add(nodeId);
    const node = rawNodes.get(nodeId);
    if (!node || node.dependencies.length === 0) return 1;

    let maxParentDepth = 0;
    for (const parentId of node.dependencies) {
      maxParentDepth = Math.max(maxParentDepth, computeDepth(parentId, new Set(visited)));
    }
    return maxParentDepth + 1;
  }

  for (const [id, node] of rawNodes.entries()) {
    const depth = computeDepth(id);
    node.phase = depth <= 1 ? 1 : depth <= 3 ? 2 : 3;
  }

  // Determine unlocked vs locked status
  for (const node of rawNodes.values()) {
    if (node.status === 'completed') continue;

    const allPrereqsMet = node.dependencies.every(depId => {
      const dep = rawNodes.get(depId);
      return dep && dep.status === 'completed';
    });

    if (allPrereqsMet) {
      node.status = node.userConfidence > 0 ? 'in_progress' : 'unlocked';
    } else {
      node.status = 'locked';
    }
  }

  const nodes = Array.from(rawNodes.values()).sort((a, b) => {
    if (a.phase !== b.phase) return a.phase - b.phase;
    return a.name.localeCompare(b.name);
  });

  const completedCount = nodes.filter(n => n.status === 'completed').length;
  const unlockedNext = nodes.filter(n => n.status === 'unlocked' || n.status === 'in_progress').map(n => n.id);

  const phases = [
    {
      phaseNumber: 1,
      phaseTitle: 'Phase 1: Foundational Core',
      nodeIds: nodes.filter(n => n.phase === 1).map(n => n.id),
      isPhaseCompleted: nodes.filter(n => n.phase === 1).every(n => n.status === 'completed'),
    },
    {
      phaseNumber: 2,
      phaseTitle: 'Phase 2: Core Engineering & Frameworks',
      nodeIds: nodes.filter(n => n.phase === 2).map(n => n.id),
      isPhaseCompleted: nodes.filter(n => n.phase === 2).every(n => n.status === 'completed'),
    },
    {
      phaseNumber: 3,
      phaseTitle: 'Phase 3: Role Specialization & Production Capstone',
      nodeIds: nodes.filter(n => n.phase === 3).map(n => n.id),
      isPhaseCompleted: nodes.filter(n => n.phase === 3).every(n => n.status === 'completed'),
    }
  ];

  return {
    roleId: role.id,
    roleTitle: role.title,
    nodes,
    edges,
    phases,
    totalNodes: nodes.length,
    completedNodes: completedCount,
    unlockedNextNodes: unlockedNext,
  };
}
