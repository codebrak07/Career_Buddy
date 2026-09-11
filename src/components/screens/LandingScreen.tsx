import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LivePipelineHero } from '../common/LivePipelineHero';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { SectionIndex } from '../common/SectionIndex';
import type { BentoModuleId } from '../../hooks/useBentoFocus';
import { 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  HelpCircle,
  Database,
  Zap,
  Shield,
  GitBranch,
  Cpu,
  Target,
  BookOpen,
  CheckSquare,
  TrendingUp,
  FileText
} from 'lucide-react';

// ── Persona Metadata ──────────────────────────────────────
const PERSONAS_DEMO = [
  {
    id: 'persona-a',
    name: 'Elena Rostova',
    initials: 'ER',
    tag: 'READY NOW (91%)',
    tagColor: '#059669',
    tagBg: '#ECFDF5',
    tagBorder: '#A7F3D0',
    ringColor: '#059669',
    score: 91,
    role: 'Frontend Engineer',
    summary: 'CS Graduate · 4 React repos · Design system portfolio',
    focusPriority: 'Readiness & Career Placement Focus',
  },
  {
    id: 'persona-b',
    name: 'Marcus Vance',
    initials: 'MV',
    tag: 'TARGET (79%)',
    tagColor: '#0284C7',
    tagBg: '#F0F9FF',
    tagBorder: '#BAE6FD',
    ringColor: '#0284C7',
    score: 79,
    role: 'Data Analyst',
    summary: 'Economics & Stats · FinTech SQL · Power BI gap',
    focusPriority: 'Skill Validation & Remediation Focus',
  },
  {
    id: 'persona-c',
    name: 'Devin Chen',
    initials: 'DC',
    tag: 'REACHABLE (55%)',
    tagColor: '#D97706',
    tagBg: '#FFFBEB',
    tagBorder: '#FDE68A',
    ringColor: '#D97706',
    score: 55,
    role: 'ML Engineer',
    summary: 'AI Sophomore · PyTorch notebooks · 3 Core Blockers',
    focusPriority: 'Blocker Elimination & DAG Trajectory Focus',
  },
];

export const LandingScreen: React.FC = () => {
  const { 
    setActiveScreen, 
    allRoleMatches, 
    activePersonaId,
    setExplainDrawerRoleId,
    setSelectedRoleId,
    resetToPersona,
    isTransitioning,
    transitionPhaseLabel,
    bentoFocus,
    userProfile
  } = useApp();

  const [animIn, setAnimIn] = useState(false);
  useEffect(() => { setAnimIn(true); }, []);

  const topReadyNow = allRoleMatches.readyNow[0];
  const topReachable = allRoleMatches.reachable[0];
  const blockersCount = topReadyNow 
    ? topReadyNow.missingCompetencies.filter(m => m.isBlocker).length 
    : (topReachable?.missingCompetencies.filter(m => m.isBlocker).length || 0);

  // Focus module definitions for dynamic rendering
  const renderBentoModule = (moduleId: BentoModuleId) => {
    const isFocused = bentoFocus.activeModule === moduleId;

    switch (moduleId) {
      case 'readiness':
        return (
          <div
            key={moduleId}
            onClick={() => bentoFocus.selectModule(moduleId)}
            onDoubleClick={() => {
              if (topReadyNow) setSelectedRoleId(topReadyNow.role.id);
              setActiveScreen('career_detail');
            }}
            className={`bento-cell cursor-pointer p-6 rounded-xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] hover:shadow-md ${
              isFocused 
                ? 'border-[#FF4F00] ring-2 ring-[#FF4F00]/25 bg-[#FFFDFB] shadow-md -translate-y-0.5' 
                : 'border-[#E7E2D6] bg-white hover:border-[#D4D4D8]'
            }`}
          >
            {isFocused && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF4F00]" />
            )}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-[#71717A]">
                  MODULE 01 · READINESS
                </span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  isFocused ? 'bg-[#FF4F00] text-white shadow-xs' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {isFocused ? '● ACTIVE' : 'DETERMINISTIC'}
                </span>
              </div>
              <div className="text-xs font-mono text-[#71717A] uppercase">Top Target Alignment</div>
              <div className="text-lg font-bold text-[#18181B] mt-0.5 tracking-tight">
                {topReadyNow?.role.title || 'Frontend Engineer'}
              </div>
              <p className="text-xs text-[#52525B] mt-1.5 leading-relaxed">
                6-factor composite score calculated from verified evidence artifacts.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E7E2D6] flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-mono font-black text-[#059669]">
                  <AnimatedCounter value={topReadyNow ? topReadyNow.overallScore : 91} suffix="%" />
                </span>
                <span className="text-[10px] font-mono text-[#71717A]">FIT</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (topReadyNow) setSelectedRoleId(topReadyNow.role.id);
                  setActiveScreen('career_detail');
                }}
                className="text-xs font-mono text-[#FF4F00] font-semibold flex items-center gap-1 hover:underline px-2 py-1 rounded bg-[#FFF9F6] border border-[#FF4F00]/20"
              >
                Inspect Matrix <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );

      case 'evidence':
        return (
          <div
            key={moduleId}
            onClick={() => bentoFocus.selectModule(moduleId)}
            onDoubleClick={() => setActiveScreen('profile')}
            className={`bento-cell cursor-pointer p-6 rounded-xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] hover:shadow-md ${
              isFocused 
                ? 'border-[#FF4F00] ring-2 ring-[#FF4F00]/25 bg-[#FFFDFB] shadow-md -translate-y-0.5' 
                : 'border-[#E7E2D6] bg-white hover:border-[#D4D4D8]'
            }`}
          >
            {isFocused && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF4F00]" />
            )}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-[#71717A]">
                  MODULE 02 · EVIDENCE DOSSIER
                </span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  isFocused ? 'bg-[#FF4F00] text-white shadow-xs' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                }`}>
                  {isFocused ? '● ACTIVE' : 'AI SEMANTIC PARSE'}
                </span>
              </div>
              <div className="text-xs font-mono text-[#71717A] uppercase">Ingested Artifacts</div>
              <div className="text-lg font-bold text-[#18181B] mt-0.5 tracking-tight">
                {userProfile.artifacts?.length || 0} Verified Records
              </div>
              <p className="text-xs text-[#52525B] mt-1.5 leading-relaxed">
                Multi-source proof archive including GitHub commits, transcripts, and PRs.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E7E2D6] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#52525B]">
                <FileText className="w-4 h-4 text-[#FF4F00]" />
                <span>Tier-3 & Tier-4: {(userProfile.artifacts || []).filter(e => e.evidenceStrength >= 0.7).length}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveScreen('profile');
                }}
                className="text-xs font-mono text-[#FF4F00] font-semibold flex items-center gap-1 hover:underline px-2 py-1 rounded bg-[#FFF9F6] border border-[#FF4F00]/20"
              >
                View Dossier <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );

      case 'skills':
        const skillList = Object.values(userProfile.skills || {});
        const avgConfidence = skillList.length > 0 
          ? Math.round(skillList.reduce((acc, s) => acc + s.confidence, 0) / skillList.length)
          : 0;

        return (
          <div
            key={moduleId}
            onClick={() => bentoFocus.selectModule(moduleId)}
            onDoubleClick={() => setActiveScreen('skills')}
            className={`bento-cell cursor-pointer p-6 rounded-xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] hover:shadow-md ${
              isFocused 
                ? 'border-[#FF4F00] ring-2 ring-[#FF4F00]/25 bg-[#FFFDFB] shadow-md -translate-y-0.5' 
                : 'border-[#E7E2D6] bg-white hover:border-[#D4D4D8]'
            }`}
          >
            {isFocused && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF4F00]" />
            )}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-[#71717A]">
                  MODULE 03 · SKILL TAXONOMY
                </span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  isFocused ? 'bg-[#FF4F00] text-white shadow-xs' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {isFocused ? '● ACTIVE' : 'DETERMINISTIC'}
                </span>
              </div>
              <div className="text-xs font-mono text-[#71717A] uppercase">Active Skill Graph</div>
              <div className="text-lg font-bold text-[#18181B] mt-0.5 tracking-tight">
                {skillList.length} Tracked Competencies
              </div>
              <p className="text-xs text-[#52525B] mt-1.5 leading-relaxed">
                Confidence-weighted skills with Bayesian diagnostic calibration history.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E7E2D6] flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs font-mono text-[#52525B]">
                <Cpu className="w-4 h-4 text-[#0284C7]" />
                <span>Avg: {avgConfidence}%</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveScreen('skills');
                }}
                className="text-xs font-mono text-[#FF4F00] font-semibold flex items-center gap-1 hover:underline px-2 py-1 rounded bg-[#FFF9F6] border border-[#FF4F00]/20"
              >
                Inspect Skills <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );

      case 'career':
      case 'career-reachable':
        return (
          <div
            key={moduleId}
            onClick={() => bentoFocus.selectModule(moduleId)}
            onDoubleClick={() => setActiveScreen('careers')}
            className={`bento-cell cursor-pointer p-6 rounded-xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] hover:shadow-md ${
              isFocused 
                ? 'border-[#FF4F00] ring-2 ring-[#FF4F00]/25 bg-[#FFFDFB] shadow-md -translate-y-0.5' 
                : 'border-[#E7E2D6] bg-white hover:border-[#D4D4D8]'
            }`}
          >
            {isFocused && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF4F00]" />
            )}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-[#71717A]">
                  MODULE 04 · CAREER TRAJECTORIES
                </span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  isFocused ? 'bg-[#FF4F00] text-white shadow-xs' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {isFocused ? '● ACTIVE' : 'EVALUATED'}
                </span>
              </div>
              <div className="text-xs font-mono text-[#71717A] uppercase">Market Placement</div>
              <div className="text-lg font-bold text-[#18181B] mt-0.5 tracking-tight">
                {allRoleMatches.readyNow.length} Ready Now · {allRoleMatches.reachable.length} Reachable
              </div>
              <p className="text-xs text-[#52525B] mt-1.5 leading-relaxed">
                Zero arbitrary black-box scoring. Every placement is verified through requirements.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E7E2D6] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#52525B]">
                <Target className="w-4 h-4 text-[#FF4F00]" />
                <span>Reachable: {topReachable?.role.title || 'Data Analyst'}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveScreen('careers');
                }}
                className="text-xs font-mono text-[#FF4F00] font-semibold flex items-center gap-1 hover:underline px-2 py-1 rounded bg-[#FFF9F6] border border-[#FF4F00]/20"
              >
                Explore All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );

      case 'blockers':
      case 'gap':
        return (
          <div
            key={moduleId}
            onClick={() => bentoFocus.selectModule(moduleId)}
            onDoubleClick={() => setActiveScreen('gap_dag')}
            className={`bento-cell cursor-pointer p-6 rounded-xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] hover:shadow-md ${
              isFocused 
                ? 'border-[#FF4F00] ring-2 ring-[#FF4F00]/25 bg-[#FFFDFB] shadow-md -translate-y-0.5' 
                : 'border-[#E7E2D6] bg-white hover:border-[#D4D4D8]'
            }`}
          >
            {isFocused && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF4F00]" />
            )}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-[#71717A]">
                  MODULE 05 · GAP REMEDIATION & DAG
                </span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  isFocused ? 'bg-[#FF4F00] text-white shadow-xs' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {isFocused ? '● ACTIVE' : 'TOPOLOGICAL DAG'}
                </span>
              </div>
              <div className="text-xs font-mono text-[#71717A] uppercase">Critical Roadblocks</div>
              <div className="text-lg font-bold text-[#18181B] mt-0.5 tracking-tight">
                {blockersCount === 0 ? 'Zero Blockers Identified' : `${blockersCount} Critical Blockers Gating Roles`}
              </div>
              <p className="text-xs text-[#52525B] mt-1.5 leading-relaxed">
                Prerequisite dependency graph prevents out-of-order learning and wasted effort.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E7E2D6] flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs font-mono text-[#52525B]">
                <GitBranch className="w-4 h-4 text-[#D97706]" />
                <span>Next: {topReachable?.nextBestAction.actionTitle || 'DAG Sequenced'}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveScreen('gap_dag');
                }}
                className="text-xs font-mono text-[#FF4F00] font-semibold flex items-center gap-1 hover:underline px-2 py-1 rounded bg-[#FFF9F6] border border-[#FF4F00]/20"
              >
                Open DAG <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );

      case 'learning':
        return (
          <div
            key={moduleId}
            onClick={() => bentoFocus.selectModule(moduleId)}
            onDoubleClick={() => setActiveScreen('learning')}
            className={`bento-cell cursor-pointer p-6 rounded-xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] hover:shadow-md ${
              isFocused 
                ? 'border-[#FF4F00] ring-2 ring-[#FF4F00]/25 bg-[#FFFDFB] shadow-md -translate-y-0.5' 
                : 'border-[#E7E2D6] bg-white hover:border-[#D4D4D8]'
            }`}
          >
            {isFocused && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF4F00]" />
            )}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-[#71717A]">
                  MODULE 06 · CURATED LEARNING
                </span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  isFocused ? 'bg-[#FF4F00] text-white shadow-xs' : 'bg-purple-50 text-purple-700 border border-purple-200'
                }`}>
                  {isFocused ? '● ACTIVE' : 'RESOURCES'}
                </span>
              </div>
              <div className="text-xs font-mono text-[#71717A] uppercase">Targeted Sprints</div>
              <div className="text-lg font-bold text-[#18181B] mt-0.5 tracking-tight">
                High-ROI Curriculum
              </div>
              <p className="text-xs text-[#52525B] mt-1.5 leading-relaxed">
                Zero generic course links. Each unit maps directly to remediating identified gaps.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E7E2D6] flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs font-mono text-[#52525B]">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span>Est: 2-3 Sprints</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveScreen('learning');
                }}
                className="text-xs font-mono text-[#FF4F00] font-semibold flex items-center gap-1 hover:underline px-2 py-1 rounded bg-[#FFF9F6] border border-[#FF4F00]/20"
              >
                View Journey <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );

      case 'validation':
        return (
          <div
            key={moduleId}
            onClick={() => bentoFocus.selectModule(moduleId)}
            onDoubleClick={() => setActiveScreen('assessment')}
            className={`bento-cell cursor-pointer p-6 rounded-xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] hover:shadow-md ${
              isFocused 
                ? 'border-[#FF4F00] ring-2 ring-[#FF4F00]/25 bg-[#FFFDFB] shadow-md -translate-y-0.5' 
                : 'border-[#E7E2D6] bg-white hover:border-[#D4D4D8]'
            }`}
          >
            {isFocused && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF4F00]" />
            )}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-[#71717A]">
                  MODULE 07 · DIAGNOSTIC VALIDATION
                </span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  isFocused ? 'bg-[#FF4F00] text-white shadow-xs' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {isFocused ? '● ACTIVE' : 'BAYESIAN UPDATER'}
                </span>
              </div>
              <div className="text-xs font-mono text-[#71717A] uppercase">Active Diagnostic</div>
              <div className="text-lg font-bold text-[#18181B] mt-0.5 tracking-tight">
                Live Technical Quiz
              </div>
              <p className="text-xs text-[#52525B] mt-1.5 leading-relaxed">
                Demonstrates how live test completion updates competency confidence in real time.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E7E2D6] flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs font-mono text-[#52525B]">
                <CheckSquare className="w-4 h-4 text-[#FF4F00]" />
                <span>Live Interactive</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveScreen('assessment');
                }}
                className="text-xs font-mono text-[#FF4F00] font-semibold flex items-center gap-1 hover:underline px-2 py-1 rounded bg-[#FFF9F6] border border-[#FF4F00]/20"
              >
                Launch Quiz <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );

      case 'trajectory':
      default:
        return (
          <div
            key={moduleId}
            onClick={() => bentoFocus.selectModule(moduleId)}
            onDoubleClick={() => setActiveScreen('trajectory')}
            className={`bento-cell cursor-pointer p-6 rounded-xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] hover:shadow-md ${
              isFocused 
                ? 'border-[#FF4F00] ring-2 ring-[#FF4F00]/25 bg-[#FFFDFB] shadow-md -translate-y-0.5' 
                : 'border-[#E7E2D6] bg-white hover:border-[#D4D4D8]'
            }`}
          >
            {isFocused && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF4F00]" />
            )}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-[#71717A]">
                  MODULE 08 · TRAJECTORY AUDIT
                </span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  isFocused ? 'bg-[#FF4F00] text-white shadow-xs' : 'bg-stone-100 text-stone-700 border border-stone-200'
                }`}>
                  {isFocused ? '● ACTIVE' : 'IMMUTABLE LOG'}
                </span>
              </div>
              <div className="text-xs font-mono text-[#71717A] uppercase">Audit Trail</div>
              <div className="text-lg font-bold text-[#18181B] mt-0.5 tracking-tight">
                Historical Progression
              </div>
              <p className="text-xs text-[#52525B] mt-1.5 leading-relaxed">
                Cryptographic-style audit records of confidence upgrades over time.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E7E2D6] flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs font-mono text-[#52525B]">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Trace Verified</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveScreen('trajectory');
                }}
                className="text-xs font-mono text-[#FF4F00] font-semibold flex items-center gap-1 hover:underline px-2 py-1 rounded bg-[#FFF9F6] border border-[#FF4F00]/20"
              >
                View Log <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-[1360px] mx-auto">

      {/* ══════════════════════════════════════════════
          HERO — Instrument Grade Bento Composition (7 / 5 Ratio)
          ══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        
        {/* ── Hero Main Card (Col 7 / ~58% width) ─────────────────────── */}
        <div
          className={`lg:col-span-7 bento-cell relative overflow-hidden p-8 sm:p-10 flex flex-col justify-between rounded-2xl border border-[#E7E2D6] bg-white shadow-sm ${
            animIn ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ minHeight: '360px' }}
        >
          {/* Subtle crosshair decorations */}
          <div className="cross-h" style={{ top: '40%', opacity: 0.3 }} />
          <div className="cross-v" style={{ left: '72%', opacity: 0.3 }} />

          {/* Ambient gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 10% 20%, rgba(255,79,0,0.04) 0%, transparent 65%), radial-gradient(ellipse 60% 40% at 90% 80%, rgba(2,132,199,0.03) 0%, transparent 65%)',
            }}
          />

          <div className="relative z-10">
            {/* System Classification Tag */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span
                className="text-[10px] font-mono font-black uppercase tracking-widest px-2.5 py-1 rounded-full border flex items-center gap-1.5"
                style={{ background: 'var(--flame-bg)', color: 'var(--flame-dark)', borderColor: 'var(--flame-border)' }}
              >
                <span className="live-dot w-1.5 h-1.5 inline-block" />
                CAREER BUDDY
              </span>
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded border bg-[#FAF9F5] text-[#52525B] border-[#E7E2D6]"
              >
                {isTransitioning ? `RECALCULATING (${transitionPhaseLabel})` : 'DETERMINISTIC KERNEL ACTIVE'}
              </span>
            </div>

            {/* Editorial Headline */}
            <h1
              className={`${animIn ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}
              style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: 'clamp(28px, 3.2vw, 48px)',
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                color: '#18181B',
              }}
            >
              Don't tell us what skills you claim.
            </h1>
            <h2
              className={`mt-2 ${animIn ? 'animate-fade-in-up delay-150' : 'opacity-0'}`}
              style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: 'clamp(24px, 2.8vw, 42px)',
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                color: '#FF4F00',
              }}
            >
              Show us what the evidence supports.
            </h2>

            <p
              className={`mt-5 text-sm sm:text-base leading-relaxed max-w-xl text-[#52525B] ${
                animIn ? 'animate-fade-in-up delay-200' : 'opacity-0'
              }`}
            >
              Transforming raw GitHub repos, academic transcripts, and diagnostic submissions into an explainable, mathematically proven career trajectory — with zero black-box generative hallucination.
            </p>
          </div>

          {/* CTA Row */}
          <div className={`flex flex-wrap gap-3 mt-8 relative z-10 ${animIn ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
            <button
              onClick={() => setActiveScreen('careers')}
              className="btn btn-primary"
            >
              Explore Career Buddy
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveScreen('profile')}
              className="btn btn-secondary"
            >
              <Shield className="w-3.5 h-3.5 text-[#FF4F00]" />
              Inspect Evidence
            </button>
            <button
              onClick={() => setExplainDrawerRoleId(topReadyNow ? topReadyNow.role.id : 'frontend-engineer')}
              className="btn btn-ghost"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Mathematical Trace
            </button>
          </div>
        </div>

        {/* ── Top Match Instrument Dial (Col 5 / ~42% width) ─────────── */}
        <div
          className={`lg:col-span-5 bento-cell-dark p-7 sm:p-8 flex flex-col justify-between rounded-2xl bg-[#18181B] text-white shadow-md border border-[#27272A] ${
            animIn ? 'animate-slide-in-right delay-100' : 'opacity-0'
          }`}
          style={{ minHeight: '360px' }}
        >
          {/* Header & Role Info */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-[9px] font-mono font-black uppercase tracking-widest px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800"
              >
                ● READY NOW TARGET
              </span>
              <span className="text-[10px] font-mono text-stone-400 tracking-wider">
                [AUDITABLE]
              </span>
            </div>

            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
              Readiness Index
            </div>
            <div className="mt-1 flex items-baseline gap-3">
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(58px, 6.5vw, 76px)',
                  lineHeight: 0.9,
                  color: '#FFFFFF',
                  letterSpacing: '-0.01em',
                }}
              >
                <AnimatedCounter value={topReadyNow ? topReadyNow.overallScore : 91} suffix="%" />
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                STABLE
              </span>
            </div>

            <div
              className="mt-3 text-base font-bold tracking-tight text-[#F0FDF4]"
              style={{ fontFamily: 'var(--font-editorial)' }}
            >
              {topReadyNow ? topReadyNow.role.title : 'Frontend Engineer'}
            </div>
            <div className="mt-1 text-xs font-mono text-stone-400 leading-relaxed">
              {topReadyNow ? topReadyNow.role.tagline : 'Architecting high-performance web applications'}
            </div>

            {/* Calibration Gauge Bar */}
            <div className="mt-4 pt-3 border-t border-stone-800/80">
              <div className="flex justify-between text-[10px] font-mono text-stone-400 mb-1.5">
                <span>DETERMINISTIC CONFIDENCE</span>
                <span className="text-emerald-400 font-bold">{topReadyNow?.criticalCoveragePercent || 100}% COVERAGE</span>
              </div>
              <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
                  style={{ width: `${topReadyNow?.overallScore || 91}%` }}
                />
              </div>
            </div>
          </div>

          {/* Metric Strip */}
          <div className="mt-5 pt-4 border-t border-stone-800">
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <div className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">Critical Cov.</div>
                <div className="text-xl font-mono font-bold text-emerald-400 mt-0.5">
                  <AnimatedCounter value={topReadyNow ? topReadyNow.criticalCoveragePercent : 100} suffix="%" />
                </div>
              </div>
              <div>
                <div className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">Blockers</div>
                <div className="text-xl font-mono font-bold text-emerald-400 mt-0.5">0</div>
              </div>
              <div>
                <div className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">Market Growth</div>
                <div className="text-xs font-mono font-bold text-[#FF7A42] mt-0.5">
                  {topReadyNow?.role.demandGrowthRate || '+22% YoY'}
                </div>
              </div>
              <div>
                <div className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">Est. Compensation</div>
                <div className="text-xs font-mono font-semibold text-stone-300 mt-0.5">
                  {topReadyNow?.role.salaryRange || '$80k–$120k'}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (topReadyNow) setSelectedRoleId(topReadyNow.role.id);
                setActiveScreen('career_detail');
              }}
              className="mt-4 w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-mono font-semibold transition-colors bg-white/10 hover:bg-white/15 border border-white/10 text-white"
            >
              <span>Inspect Role Matrix</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FF4F00]" />
            </button>
          </div>
        </div>

        {/* ── Reachable Bridge Card (Col 7 / ~58% width) ─────────────────── */}
        <div
          className={`lg:col-span-7 bento-cell p-7 sm:p-8 flex flex-col justify-between rounded-xl border border-[#E7E2D6] bg-white shadow-sm ${
            animIn ? 'animate-fade-in-up delay-200' : 'opacity-0'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span
                className="text-[10px] font-mono font-black uppercase tracking-widest px-2.5 py-1 rounded border flex items-center gap-1.5 w-fit bg-amber-50 text-amber-800 border-amber-200"
              >
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                REACHABLE ADJACENCY
              </span>
              <h3
                className="mt-3 font-bold text-lg text-[#18181B] tracking-tight"
                style={{ fontFamily: 'var(--font-editorial)' }}
              >
                {topReachable ? topReachable.role.title : 'Machine Learning Engineer'}
              </h3>
              <p className="text-xs mt-1 text-[#71717A]">
                High adjacent foundation. Gated by targeted DAG prerequisite completion.
              </p>
            </div>
            <div className="text-right shrink-0 ml-4">
              <div className="text-[10px] font-mono uppercase text-[#A1A1AA]">Current</div>
              <div className="text-3xl font-mono font-black text-amber-600 leading-none mt-1">
                <AnimatedCounter value={topReachable ? topReachable.overallScore : 55} suffix="%" />
              </div>
            </div>
          </div>

          <div className="mt-5 p-3.5 rounded-lg text-xs bg-[#FFF9F6] border border-[#FF4F00]/20">
            <div className="text-[10px] font-mono font-black uppercase tracking-widest text-[#FF4F00]">
              NEXT BEST ACTION (DAG)
            </div>
            <div className="font-semibold mt-1 text-[#18181B]">
              {topReachable?.nextBestAction.actionTitle || 'Complete Diagnostic Validation'}
            </div>
            <div className="text-[11px] mt-0.5 text-[#71717A]">
              {topReachable?.missingCompetencies.filter(m => m.isBlocker).length || 2} Critical Blockers · Est. 2 Sprints
            </div>
          </div>

          <button
            onClick={() => {
              if (topReachable) setSelectedRoleId(topReachable.role.id);
              setActiveScreen('gap_dag');
            }}
            className="btn btn-secondary w-full mt-5 justify-center"
          >
            <GitBranch className="w-3.5 h-3.5 text-[#FF4F00]" />
            Inspect Prerequisite DAG
          </button>
        </div>

        {/* ── Pipeline Steps Card (Col 5 / ~42% width) ─────────────────────── */}
        <div
          className={`lg:col-span-5 bento-cell p-7 sm:p-8 rounded-xl border border-[#E7E2D6] bg-white shadow-sm flex flex-col justify-between ${
            animIn ? 'animate-slide-in-right delay-200' : 'opacity-0'
          }`}
        >
          <div>
            <div className="text-[10px] font-mono font-black uppercase tracking-widest mb-3.5 flex items-center gap-2 text-[#71717A]">
              <Zap className="w-3 h-3 text-[#FF4F00]" />
              Architectural Separation
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg border border-[#E7E2D6] bg-[#FAF9F5]">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-indigo-700">
                  <span>LAYER 1: SEMANTIC AI</span>
                  <span className="px-1.5 py-0.5 bg-indigo-100 rounded">INPUT ONLY</span>
                </div>
                <p className="text-[11px] text-[#52525B] mt-1.5 leading-relaxed">
                  NLP extracts skills, commits, and transcripts into typed schema.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-[#E7E2D6] bg-[#FAF9F5]">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-700">
                  <span>LAYER 2: DETERMINISTIC</span>
                  <span className="px-1.5 py-0.5 bg-emerald-100 rounded">TRUTH ENGINE</span>
                </div>
                <p className="text-[11px] text-[#52525B] mt-1.5 leading-relaxed">
                  6-factor linear matrix + topological DAG calculates all matches.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#E7E2D6] flex items-center gap-2 text-[10px] font-mono text-[#71717A]">
            <Database className="w-3 h-3 text-[#FF4F00]" />
            <span>Reference Dataset: Curated Labour Market Data</span>
          </div>
        </div>

      </div>

      {/* ── Live Epistemic Pipeline Hero ─────────────────────────── */}
      <LivePipelineHero />

      {/* ══════════════════════════════════════════════
          INTERACTIVE BENTO INTELLIGENCE GRID
          ══════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7E2D6]">
          <SectionIndex 
            index="01" 
            label="Candidate Intelligence Modules" 
            sublabel="Select any module below to inspect verified evidence, skill coverage, career roadmaps, or diagnostic validation."
          />

          {/* Interactive Module Selectors */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            {bentoFocus.focusOrder.map((modId) => {
              const isActive = bentoFocus.activeModule === modId;
              const moduleLabels: Record<string, string> = {
                'readiness': '01 Readiness',
                'evidence': '02 Evidence',
                'skills': '03 Skills',
                'career': '04 Careers',
                'career-reachable': '04 Reachable',
                'blockers': '05 Blockers',
                'gap': '05 Gap DAG',
                'learning': '06 Learning',
                'validation': '07 Validation',
                'trajectory': '08 Trajectory',
              };
              return (
                <button
                  key={modId}
                  onClick={() => bentoFocus.selectModule(modId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    isActive
                      ? 'bg-[#18181B] text-white font-bold shadow-xs'
                      : 'bg-white text-[#52525B] border border-[#E7E2D6] hover:bg-[#FAF9F5] hover:text-[#18181B]'
                  }`}
                >
                  {moduleLabels[modId] || modId}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Bento Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bentoFocus.focusOrder.map((moduleId) => renderBentoModule(moduleId))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          JUDGE DEMO — Persona Matrix (Orchestrated Switch)
          ══════════════════════════════════════════════ */}
      <div className="bento-cell p-6 sm:p-8 rounded-2xl border border-[#E7E2D6] bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-[10px] font-mono font-black uppercase tracking-widest mb-1 flex items-center gap-1.5 text-[#FF4F00]">
              <span className="live-dot inline-block w-1.5 h-1.5" />
              LIVE JUDGE EVALUATION MATRIX
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: 'clamp(20px, 2.5vw, 28px)',
                fontWeight: 800,
                color: '#18181B',
                letterSpacing: '-0.02em',
              }}
            >
              3 Grounded Personas → Distinct, Explainable Outcomes
            </h3>
            <p className="text-xs mt-1 text-[#71717A]">
              Click any candidate below to observe the choreographed re-calibration sequence across all 9 instrument layers.
            </p>
          </div>
          <div className="shrink-0 text-xs font-mono px-3 py-1.5 rounded-lg border bg-[#FAF9F5] border-[#E7E2D6] text-[#52525B]">
            <CheckCircle2 className="inline w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            Deterministic Engine Tests: 6/6 Passing
          </div>
        </div>

        {/* Persona Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PERSONAS_DEMO.map((p) => {
            const isActive = activePersonaId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => resetToPersona(p.id)}
                className={`text-left p-5 rounded-xl border transition-all duration-200 relative overflow-hidden cursor-pointer ${
                  isActive
                    ? 'border-[#FF4F00] ring-2 ring-[#FF4F00]/20 bg-[#FFFDFB] shadow-md -translate-y-0.5'
                    : 'border-[#E7E2D6] bg-[#FAF9F5]/80 hover:bg-white hover:border-[#D4D4D8]'
                }`}
              >
                {/* Active bar */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF4F00]" />
                )}

                <div className="flex items-start justify-between mb-3">
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-mono font-black text-white"
                    style={{ backgroundColor: p.ringColor }}
                  >
                    {p.initials}
                  </div>

                  <span
                    className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border tracking-wider"
                    style={{ backgroundColor: p.tagBg, color: p.tagColor, borderColor: p.tagBorder }}
                  >
                    {p.tag}
                  </span>
                </div>

                <div>
                  <div className="font-bold text-sm text-[#18181B] tracking-tight">
                    {p.name}
                  </div>
                  <div className="text-xs font-mono font-bold mt-0.5" style={{ color: p.tagColor }}>
                    {p.role}
                  </div>
                </div>

                {/* Score Bar */}
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1 text-xs font-mono">
                    <span className="text-[10px] uppercase text-[#71717A]">Calculated Fit</span>
                    <span className="font-bold" style={{ color: p.tagColor }}>
                      {p.score}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#E7E2D6] overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{ width: `${p.score}%`, backgroundColor: p.ringColor }}
                    />
                  </div>
                </div>

                <div className="text-xs text-[#52525B] mt-3 line-clamp-2">
                  {p.summary}
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#E7E2D6] text-[10px] font-mono font-bold text-[#FF4F00]">
                  ⚡ {p.focusPriority}
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
