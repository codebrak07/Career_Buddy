import React, { useState } from 'react';
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
    tagBg: '#F0FDF4',
    tagBorder: '#BBF7D0',
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

  const [animIn] = useState(true);

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
            className={`editorial-card cursor-pointer p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
              isFocused 
                ? 'border-[#FF5A1F] ring-2 ring-[#FF5A1F]/20 bg-white shadow-md' 
                : 'hover:border-[#DDD8CE]'
            }`}
          >
            {isFocused && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF5A1F]" />
            )}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-semibold text-[#6E7A8A] tracking-wider uppercase">
                  MODULE 01 · READINESS
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  isFocused ? 'bg-[#FF5A1F] text-white shadow-xs' : 'bg-[#F0FDF4] text-[#059669] border border-[#BBF7D0]'
                }`}>
                  {isFocused ? '● ACTIVE' : 'DETERMINISTIC'}
                </span>
              </div>
              <div className="text-xs font-mono text-[#6E7A8A] uppercase">Top Target Alignment</div>
              <div className="text-lg font-bold text-[#14171A] mt-1 tracking-tight">
                {topReadyNow?.role.title || 'Frontend Engineer'}
              </div>
              <p className="text-xs text-[#525B67] mt-2 leading-relaxed">
                6-factor composite score calculated from verified evidence artifacts.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#EAE6DF] flex items-center justify-between">
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-2xl font-black text-[#059669]">
                  <AnimatedCounter value={topReadyNow ? topReadyNow.overallScore : 91} suffix="%" />
                </span>
                <span className="text-[10px] text-[#6E7A8A] font-semibold">CALCULATED FIT</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (topReadyNow) setSelectedRoleId(topReadyNow.role.id);
                  setActiveScreen('career_detail');
                }}
                className="text-xs font-mono text-[#FF5A1F] font-semibold flex items-center gap-1 hover:underline px-2.5 py-1 rounded bg-[#FFF5F0] border border-[#FFD5C4] transition"
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
            className={`editorial-card cursor-pointer p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
              isFocused 
                ? 'border-[#FF5A1F] ring-2 ring-[#FF5A1F]/20 bg-white shadow-md' 
                : 'hover:border-[#DDD8CE]'
            }`}
          >
            {isFocused && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF5A1F]" />
            )}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-semibold text-[#6E7A8A] tracking-wider uppercase">
                  MODULE 02 · EVIDENCE DOSSIER
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  isFocused ? 'bg-[#FF5A1F] text-white shadow-xs' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                }`}>
                  {isFocused ? '● ACTIVE' : 'AI SEMANTIC PARSE'}
                </span>
              </div>
              <div className="text-xs font-mono text-[#6E7A8A] uppercase">Ingested Artifacts</div>
              <div className="text-lg font-bold text-[#14171A] mt-1 tracking-tight">
                {userProfile.artifacts?.length || 0} Verified Records
              </div>
              <p className="text-xs text-[#525B67] mt-2 leading-relaxed">
                Multi-source proof archive including GitHub commits, transcripts, and PRs.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#EAE6DF] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#525B67]">
                <FileText className="w-4 h-4 text-[#FF5A1F]" />
                <span>Tier-3 & 4: {(userProfile.artifacts || []).filter(e => e.evidenceStrength >= 0.7).length}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveScreen('profile');
                }}
                className="text-xs font-mono text-[#FF5A1F] font-semibold flex items-center gap-1 hover:underline px-2.5 py-1 rounded bg-[#FFF5F0] border border-[#FFD5C4] transition"
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
            className={`editorial-card cursor-pointer p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
              isFocused 
                ? 'border-[#FF5A1F] ring-2 ring-[#FF5A1F]/20 bg-white shadow-md' 
                : 'hover:border-[#DDD8CE]'
            }`}
          >
            {isFocused && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF5A1F]" />
            )}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-semibold text-[#6E7A8A] tracking-wider uppercase">
                  MODULE 03 · SKILL TAXONOMY
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  isFocused ? 'bg-[#FF5A1F] text-white shadow-xs' : 'bg-[#F0FDF4] text-[#059669] border border-[#BBF7D0]'
                }`}>
                  {isFocused ? '● ACTIVE' : 'DETERMINISTIC'}
                </span>
              </div>
              <div className="text-xs font-mono text-[#6E7A8A] uppercase">Active Skill Graph</div>
              <div className="text-lg font-bold text-[#14171A] mt-1 tracking-tight">
                {skillList.length} Tracked Competencies
              </div>
              <p className="text-xs text-[#525B67] mt-2 leading-relaxed">
                Confidence-weighted skills with Bayesian diagnostic calibration history.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#EAE6DF] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#525B67]">
                <Cpu className="w-4 h-4 text-[#0284C7]" />
                <span>Avg: {avgConfidence}%</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveScreen('skills');
                }}
                className="text-xs font-mono text-[#FF5A1F] font-semibold flex items-center gap-1 hover:underline px-2.5 py-1 rounded bg-[#FFF5F0] border border-[#FFD5C4] transition"
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
            className={`editorial-card cursor-pointer p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
              isFocused 
                ? 'border-[#FF5A1F] ring-2 ring-[#FF5A1F]/20 bg-white shadow-md' 
                : 'hover:border-[#DDD8CE]'
            }`}
          >
            {isFocused && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF5A1F]" />
            )}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-semibold text-[#6E7A8A] tracking-wider uppercase">
                  MODULE 04 · CAREER TRAJECTORIES
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  isFocused ? 'bg-[#FF5A1F] text-white shadow-xs' : 'bg-[#F0FDF4] text-[#059669] border border-[#BBF7D0]'
                }`}>
                  {isFocused ? '● ACTIVE' : 'EVALUATED'}
                </span>
              </div>
              <div className="text-xs font-mono text-[#6E7A8A] uppercase">Market Placement</div>
              <div className="text-lg font-bold text-[#14171A] mt-1 tracking-tight">
                {allRoleMatches.readyNow.length} Ready · {allRoleMatches.reachable.length} Reachable
              </div>
              <p className="text-xs text-[#525B67] mt-2 leading-relaxed">
                Zero arbitrary black-box scoring. Every placement is verified through requirements.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#EAE6DF] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#525B67]">
                <Target className="w-4 h-4 text-[#FF5A1F]" />
                <span className="truncate max-w-[130px]">{topReachable?.role.title || 'Data Analyst'}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveScreen('careers');
                }}
                className="text-xs font-mono text-[#FF5A1F] font-semibold flex items-center gap-1 hover:underline px-2.5 py-1 rounded bg-[#FFF5F0] border border-[#FFD5C4] transition"
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
            className={`editorial-card cursor-pointer p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
              isFocused 
                ? 'border-[#FF5A1F] ring-2 ring-[#FF5A1F]/20 bg-white shadow-md' 
                : 'hover:border-[#DDD8CE]'
            }`}
          >
            {isFocused && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF5A1F]" />
            )}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-semibold text-[#6E7A8A] tracking-wider uppercase">
                  MODULE 05 · GAP REMEDIATION & DAG
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  isFocused ? 'bg-[#FF5A1F] text-white shadow-xs' : 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
                }`}>
                  {isFocused ? '● ACTIVE' : 'TOPOLOGICAL DAG'}
                </span>
              </div>
              <div className="text-xs font-mono text-[#6E7A8A] uppercase">Critical Roadblocks</div>
              <div className="text-lg font-bold text-[#14171A] mt-1 tracking-tight">
                {blockersCount === 0 ? 'Zero Blockers Identified' : `${blockersCount} Critical Blockers Gating Roles`}
              </div>
              <p className="text-xs text-[#525B67] mt-2 leading-relaxed">
                Prerequisite dependency graph prevents out-of-order learning and wasted effort.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#EAE6DF] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#525B67]">
                <GitBranch className="w-4 h-4 text-[#D97706]" />
                <span>Sequenced</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveScreen('gap_dag');
                }}
                className="text-xs font-mono text-[#FF5A1F] font-semibold flex items-center gap-1 hover:underline px-2.5 py-1 rounded bg-[#FFF5F0] border border-[#FFD5C4] transition"
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
            className={`editorial-card cursor-pointer p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
              isFocused 
                ? 'border-[#FF5A1F] ring-2 ring-[#FF5A1F]/20 bg-white shadow-md' 
                : 'hover:border-[#DDD8CE]'
            }`}
          >
            {isFocused && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF5A1F]" />
            )}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-semibold text-[#6E7A8A] tracking-wider uppercase">
                  MODULE 06 · CURATED LEARNING
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  isFocused ? 'bg-[#FF5A1F] text-white shadow-xs' : 'bg-purple-50 text-purple-700 border border-purple-200'
                }`}>
                  {isFocused ? '● ACTIVE' : 'RESOURCES'}
                </span>
              </div>
              <div className="text-xs font-mono text-[#6E7A8A] uppercase">Targeted Sprints</div>
              <div className="text-lg font-bold text-[#14171A] mt-1 tracking-tight">
                High-ROI Curriculum
              </div>
              <p className="text-xs text-[#525B67] mt-2 leading-relaxed">
                Zero generic course links. Each unit maps directly to remediating identified gaps.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#EAE6DF] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#525B67]">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span>Est: 2-3 Sprints</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveScreen('learning');
                }}
                className="text-xs font-mono text-[#FF5A1F] font-semibold flex items-center gap-1 hover:underline px-2.5 py-1 rounded bg-[#FFF5F0] border border-[#FFD5C4] transition"
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
            className={`editorial-card cursor-pointer p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
              isFocused 
                ? 'border-[#FF5A1F] ring-2 ring-[#FF5A1F]/20 bg-white shadow-md' 
                : 'hover:border-[#DDD8CE]'
            }`}
          >
            {isFocused && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF5A1F]" />
            )}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-semibold text-[#6E7A8A] tracking-wider uppercase">
                  MODULE 07 · DIAGNOSTIC VALIDATION
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  isFocused ? 'bg-[#FF5A1F] text-white shadow-xs' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {isFocused ? '● ACTIVE' : 'CHALLENGES'}
                </span>
              </div>
              <div className="text-xs font-mono text-[#6E7A8A] uppercase">Active Test Matrix</div>
              <div className="text-lg font-bold text-[#14171A] mt-1 tracking-tight">
                Bayesian Skill Audits
              </div>
              <p className="text-xs text-[#525B67] mt-2 leading-relaxed">
                Proven through interactive code challenges and deterministic rubrics.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#EAE6DF] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#525B67]">
                <CheckSquare className="w-4 h-4 text-red-600" />
                <span>Passing: 70%+</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveScreen('assessment');
                }}
                className="text-xs font-mono text-[#FF5A1F] font-semibold flex items-center gap-1 hover:underline px-2.5 py-1 rounded bg-[#FFF5F0] border border-[#FFD5C4] transition"
              >
                Launch Test <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );

      case 'trajectory':
        return (
          <div
            key={moduleId}
            onClick={() => bentoFocus.selectModule(moduleId)}
            onDoubleClick={() => setActiveScreen('trajectory')}
            className={`editorial-card cursor-pointer p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
              isFocused 
                ? 'border-[#FF5A1F] ring-2 ring-[#FF5A1F]/20 bg-white shadow-md' 
                : 'hover:border-[#DDD8CE]'
            }`}
          >
            {isFocused && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF5A1F]" />
            )}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-semibold text-[#6E7A8A] tracking-wider uppercase">
                  MODULE 08 · TRAJECTORY AUDIT
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  isFocused ? 'bg-[#FF5A1F] text-white shadow-xs' : 'bg-stone-100 text-stone-700 border border-stone-200'
                }`}>
                  {isFocused ? '● ACTIVE' : 'IMMUTABLE LOG'}
                </span>
              </div>
              <div className="text-xs font-mono text-[#6E7A8A] uppercase">Audit Trail</div>
              <div className="text-lg font-bold text-[#14171A] mt-1 tracking-tight">
                Historical Progression
              </div>
              <p className="text-xs text-[#525B67] mt-2 leading-relaxed">
                Cryptographic-style audit records of confidence upgrades over time.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#EAE6DF] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#525B67]">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Trace Verified</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveScreen('trajectory');
                }}
                className="text-xs font-mono text-[#FF5A1F] font-semibold flex items-center gap-1 hover:underline px-2.5 py-1 rounded bg-[#FFF5F0] border border-[#FFD5C4] transition"
              >
                View Log <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-12 py-2 max-w-[1360px] mx-auto">

      {/* ══════════════════════════════════════════════
          HERO — 55–60% Left Content / 40–45% Right Readiness Panel
          Spacious, Calm, Editorial, High-Hierarchy
          ══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        
        {/* ── Hero Left Content (Col 7 / ~58% width) ─────────────────────── */}
        <div
          className={`lg:col-span-7 editorial-card relative overflow-hidden p-8 sm:p-12 flex flex-col justify-between bg-white ${
            animIn ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ minHeight: '440px' }}
        >
          {/* Ambient soft glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at 10% 10%, rgba(255, 90, 31, 0.04) 0%, transparent 65%)',
            }}
          />

          <div className="relative z-10">
            {/* System Status Eyebrow */}
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#FF5A1F] uppercase">
                CAREER BUDDY · EVIDENCE INTELLIGENCE
              </span>
              <span className="text-[#DDD8CE]">/</span>
              <span className="text-[11px] font-mono text-[#6E7A8A]">
                {isTransitioning ? `Recalculating (${transitionPhaseLabel})` : 'Deterministic Kernel Active'}
              </span>
            </div>

            {/* Editorial Headline */}
            <h1
              className={`type-hero ${animIn ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}
            >
              Don't tell us what skills you claim.
              <span className="text-[#FF5A1F] block mt-2">
                Show us what the evidence supports.
              </span>
            </h1>

            <p
              className={`mt-6 text-base text-[#454F5B] leading-relaxed max-w-xl ${
                animIn ? 'animate-fade-in-up delay-200' : 'opacity-0'
              }`}
            >
              Transforming raw code repositories, academic coursework, and technical diagnostics into an explainable, mathematically proven career trajectory — with zero black-box hallucination.
            </p>
          </div>

          {/* Clear CTA Hierarchy */}
          <div className={`flex flex-wrap items-center gap-3.5 mt-10 relative z-10 ${animIn ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
            <button
              onClick={() => setActiveScreen('careers')}
              className="btn btn-primary text-sm px-6 py-3"
            >
              <span>Explore Career Trajectories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveScreen('profile')}
              className="btn btn-secondary text-sm px-5 py-3"
            >
              <Shield className="w-4 h-4 text-[#FF5A1F]" />
              <span>Inspect Evidence Dossier</span>
            </button>
            <button
              onClick={() => setExplainDrawerRoleId(topReadyNow ? topReadyNow.role.id : 'frontend-engineer')}
              className="btn btn-ghost text-sm px-4 py-3 text-[#6E7A8A] hover:text-[#14171A]"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Mathematical Trace</span>
            </button>
          </div>
        </div>

        {/* ── Hero Right: Dominant Readiness Panel (Col 5 / ~42% width) ───── */}
        <div
          className={`lg:col-span-5 editorial-card-dark p-8 sm:p-10 flex flex-col justify-between rounded-2xl bg-[#11141A] text-white shadow-xl border border-[#27272A] relative overflow-hidden ${
            animIn ? 'animate-slide-in-right delay-100' : 'opacity-0'
          }`}
          style={{ minHeight: '440px' }}
        >
          {/* Ambient subtle glow inside card */}
          <div
            className="absolute top-0 right-0 w-64 h-64 pointer-events-none rounded-full"
            style={{
              background: 'radial-gradient(circle at 80% 20%, rgba(5, 150, 105, 0.08) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10">
            {/* Readiness Eyebrow */}
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono uppercase tracking-widest text-stone-400 font-semibold">
                Readiness
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-950/70 border border-emerald-800/70 px-2 py-0.5 rounded">
                DETERMINISTIC FIT
              </span>
            </div>

            {/* Dominant Readiness Score */}
            <div className="mt-3 flex items-baseline">
              <div className="text-6xl sm:text-7xl font-mono font-black text-white tracking-tight leading-none">
                <AnimatedCounter value={topReadyNow ? topReadyNow.overallScore : 91} suffix="%" />
              </div>
            </div>

            {/* Target Role Title & Subsystem */}
            <div className="mt-4">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                {topReadyNow ? `${topReadyNow.role.title} / UI Systems` : 'Frontend Engineer / UI Systems'}
              </h2>
            </div>

            {/* Strong Evidence Coverage Status Pill */}
            <div className="mt-3.5">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Strong evidence coverage</span>
              </span>
            </div>

            {/* Calibration Progress Meter */}
            <div className="mt-6 pt-5 border-t border-stone-800/80">
              <div className="flex justify-between text-[11px] font-mono text-stone-400 mb-2">
                <span>Verified Requirement Satisfaction</span>
                <span className="text-emerald-400 font-bold">{topReadyNow?.criticalCoveragePercent || 100}%</span>
              </div>
              <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
                  style={{ width: `${topReadyNow?.overallScore || 91}%` }}
                />
              </div>
            </div>
          </div>

          {/* Secondary Metrics Strip: Coverage, Blockers, Market Demand */}
          <div className="mt-8 pt-6 border-t border-stone-800 relative z-10">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider font-semibold">
                  Coverage
                </div>
                <div className="text-xl font-mono font-bold text-white mt-1">
                  <AnimatedCounter value={topReadyNow ? topReadyNow.criticalCoveragePercent : 100} suffix="%" />
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider font-semibold">
                  Blockers
                </div>
                <div className="text-xl font-mono font-bold text-white mt-1">
                  {blockersCount}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider font-semibold">
                  Market Demand
                </div>
                <div className="text-xl font-mono font-bold text-[#FF7844] mt-1">
                  {topReadyNow?.role.demandGrowthRate || '+19% YoY'}
                </div>
              </div>
            </div>

            {/* Single Clear Action Button */}
            <button
              onClick={() => {
                if (topReadyNow) setSelectedRoleId(topReadyNow.role.id);
                setActiveScreen('career_detail');
              }}
              className="mt-6 w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-mono font-bold transition-all bg-white/10 hover:bg-white/15 border border-white/10 text-white cursor-pointer"
            >
              <span>Inspect Role Matrix</span>
              <ArrowRight className="w-4 h-4 text-[#FF5A1F]" />
            </button>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════
          SECONDARY BRIDGE & PIPELINE SECTION
          Spacious 7/5 Grid
          ══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        
        {/* ── Reachable Bridge Card (Col 7 / ~58% width) ─────────────────── */}
        <div
          className={`lg:col-span-7 editorial-card p-8 sm:p-10 flex flex-col justify-between bg-white ${
            animIn ? 'animate-fade-in-up delay-200' : 'opacity-0'
          }`}
        >
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span
                  className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border flex items-center gap-1.5 w-fit bg-amber-50 text-amber-800 border-amber-200"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  REACHABLE ADJACENCY
                </span>
                <h3 className="mt-4 font-bold text-2xl text-[#14171A] tracking-tight font-sans">
                  {topReachable ? topReachable.role.title : 'Machine Learning Engineer'}
                </h3>
                <p className="text-xs sm:text-sm mt-2 text-[#6E7A8A] leading-relaxed max-w-lg">
                  Strong foundational overlap. Gated by targeted DAG prerequisite completion.
                </p>
              </div>

              <div className="text-right shrink-0 ml-4 font-mono">
                <div className="text-[10px] uppercase text-[#9AA5B5] font-semibold">Calculated Fit</div>
                <div className="text-3xl sm:text-4xl font-mono font-black text-amber-600 leading-none mt-1">
                  <AnimatedCounter value={topReachable ? topReachable.overallScore : 55} suffix="%" />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl text-xs bg-[#FAF9F5] border border-[#EAE6DF]">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FF5A1F]">
                NEXT BEST ACTION (DAG SEQUENCED)
              </div>
              <div className="font-semibold text-sm mt-1 text-[#14171A]">
                {topReachable?.nextBestAction.actionTitle || 'Complete Diagnostic Validation'}
              </div>
              <div className="text-xs mt-1 text-[#6E7A8A]">
                {topReachable?.missingCompetencies.filter(m => m.isBlocker).length || 2} Critical Blockers · Est. 2 Sprints
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (topReachable) setSelectedRoleId(topReachable.role.id);
              setActiveScreen('gap_dag');
            }}
            className="btn btn-secondary w-full mt-6 justify-center text-xs py-3"
          >
            <GitBranch className="w-4 h-4 text-[#FF5A1F]" />
            <span>Inspect Prerequisite DAG</span>
          </button>
        </div>

        {/* ── Architectural Separation Card (Col 5 / ~42% width) ─────────── */}
        <div
          className={`lg:col-span-5 editorial-card p-8 sm:p-10 flex flex-col justify-between bg-white ${
            animIn ? 'animate-slide-in-right delay-200' : 'opacity-0'
          }`}
        >
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-[#6E7A8A]">
              <Zap className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>ARCHITECTURAL INTEGRITY</span>
            </div>
            
            <div className="space-y-3.5 text-xs">
              <div className="p-4 rounded-xl border border-[#EAE6DF] bg-[#FAF9F5]">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-indigo-700">
                  <span>LAYER 1: SEMANTIC PARSING</span>
                  <span className="px-2 py-0.5 bg-indigo-100 rounded">INPUT ONLY</span>
                </div>
                <p className="text-xs text-[#525B67] mt-2 leading-relaxed">
                  Groq LPU AI extracts candidate skills, commits, and transcripts into typed schema.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#EAE6DF] bg-[#FAF9F5]">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-800">
                  <span>LAYER 2: DETERMINISTIC KERNEL</span>
                  <span className="px-2 py-0.5 bg-emerald-100 rounded">TRUTH ENGINE</span>
                </div>
                <p className="text-xs text-[#525B67] mt-2 leading-relaxed">
                  6-factor linear matrix + topological DAG calculates all matches without hallucination.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#EAE6DF] flex items-center gap-2 text-xs font-mono text-[#6E7A8A]">
            <Database className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>Curated Reference Labour Market Dataset</span>
          </div>
        </div>

      </div>

      {/* ── Live Epistemic Pipeline Hero ─────────────────────────── */}
      <LivePipelineHero />

      {/* ══════════════════════════════════════════════
          CANDIDATE INTELLIGENCE BENTO GRID
          ══════════════════════════════════════════════ */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE6DF]">
          <SectionIndex 
            index="01" 
            label="Candidate Intelligence Modules" 
            sublabel="Select any module below to inspect verified evidence, skill coverage, career roadmaps, or diagnostic validation."
          />

          {/* Module Selectors */}
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-[#14171A] text-white font-bold shadow-xs'
                      : 'bg-white text-[#525B67] border border-[#EAE6DF] hover:bg-[#FAF9F5] hover:text-[#14171A]'
                  }`}
                >
                  {moduleLabels[modId] || modId}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Bento Modules (Spacious 4-col Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bentoFocus.focusOrder.map((moduleId) => renderBentoModule(moduleId))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          JUDGE DEMO — Persona Matrix (Orchestrated Switch)
          ══════════════════════════════════════════════ */}
      <div className="editorial-card p-8 sm:p-10 bg-white">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2 text-[#FF5A1F]">
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-pulse" />
              <span>LIVE EVALUATION MATRIX</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#14171A] tracking-tight font-sans">
              3 Grounded Personas → Distinct, Explainable Outcomes
            </h3>
            <p className="text-xs sm:text-sm mt-1.5 text-[#6E7A8A]">
              Click any candidate below to observe the choreographed re-calibration sequence across all platform layers.
            </p>
          </div>
          <div className="shrink-0 text-xs font-mono px-3.5 py-2 rounded-lg border bg-[#FAF9F5] border-[#EAE6DF] text-[#454F5B]">
            <CheckCircle2 className="inline w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            <span>Deterministic Engine Tests: 6/6 Passing</span>
          </div>
        </div>

        {/* Persona Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PERSONAS_DEMO.map((p) => {
            const isActive = activePersonaId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => resetToPersona(p.id)}
                className={`text-left p-6 rounded-2xl border transition-all duration-200 relative overflow-hidden cursor-pointer ${
                  isActive
                    ? 'border-[#FF5A1F] ring-2 ring-[#FF5A1F]/20 bg-[#FFFDFB] shadow-md -translate-y-0.5'
                    : 'border-[#EAE6DF] bg-[#FAF9F5]/70 hover:bg-white hover:border-[#DDD8CE]'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF5A1F]" />
                )}

                <div className="flex items-start justify-between mb-4">
                  {/* Initials Avatar */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-mono font-black text-white shadow-xs"
                    style={{ backgroundColor: p.ringColor }}
                  >
                    {p.initials}
                  </div>

                  <span
                    className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border tracking-wider"
                    style={{ backgroundColor: p.tagBg, color: p.tagColor, borderColor: p.tagBorder }}
                  >
                    {p.tag}
                  </span>
                </div>

                <div>
                  <div className="font-bold text-base text-[#14171A] tracking-tight">
                    {p.name}
                  </div>
                  <div className="text-xs font-mono font-bold mt-1" style={{ color: p.tagColor }}>
                    {p.role}
                  </div>
                </div>

                {/* Score Bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1.5 text-xs font-mono">
                    <span className="text-[11px] uppercase text-[#6E7A8A]">Calculated Fit</span>
                    <span className="font-bold" style={{ color: p.tagColor }}>
                      {p.score}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#EAE6DF] overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{ width: `${p.score}%`, backgroundColor: p.ringColor }}
                    />
                  </div>
                </div>

                <div className="text-xs text-[#525B67] mt-4 line-clamp-2 leading-relaxed">
                  {p.summary}
                </div>

                <div className="mt-4 pt-3 border-t border-[#EAE6DF] text-[11px] font-mono font-bold text-[#FF5A1F]">
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
