import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Terminal, ArrowRight } from 'lucide-react';

interface Stage {
  key: string;
  level: string;
  label: string;
  sub: string;
  weight: string;
  description: string;
  color: string;
  bg: string;
  border: string;
}

const STAGES: Stage[] = [
  {
    key: 'claimed',
    level: 'TIER-1',
    label: 'Claimed',
    sub: 'Self-Reported Skill',
    weight: '15% Epistemic Weight',
    description: 'User stated competency. Unverified baseline with zero external signal.',
    color: '#71717A',
    bg: '#F4F4F5',
    border: '#E4E4E7',
  },
  {
    key: 'detected',
    level: 'TIER-2',
    label: 'Detected',
    sub: 'Keyword & NLP Parse',
    weight: '35% Epistemic Weight',
    description: 'Extracted via semantic AI from uploaded CV, syllabus, or raw work records.',
    color: '#0284C7',
    bg: '#F0F9FF',
    border: '#BAE6FD',
  },
  {
    key: 'evidenced',
    level: 'TIER-3',
    label: 'Evidenced',
    sub: 'Code Repos & Artifacts',
    weight: '75% Epistemic Weight',
    description: 'Verified through public GitHub repos, live production links, and architecture docs.',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },
  {
    key: 'validated',
    level: 'TIER-4',
    label: 'Validated',
    sub: 'Diagnostic Micro-Assessment',
    weight: '100% Platform Weight',
    description: 'Proven through calibrated Bayesian assessments and deterministic challenge tests.',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
];

export const LivePipelineHero: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <div 
      className="bento-cell relative rounded-xl border border-[#E7E2D6] bg-white p-5 shadow-sm overflow-hidden"
    >
      {/* Header telemetry row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E7E2D6]">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF4F00] animate-pulse" />
          <div>
            <div className="text-[10px] font-mono font-bold tracking-widest text-[#71717A] uppercase flex items-center gap-2">
              <span>EPISTEMIC PIPELINE</span>
              <span className="text-[#D4D4D8]">/</span>
              <span className="text-[#FF4F00]">SIGNAL TRANSFORMATION</span>
            </div>
            <h4 className="text-sm font-bold text-[#18181B] tracking-tight mt-0.5">
              How Unstructured Evidence Becomes Defensible Career Intelligence
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FAF9F5] border border-[#E7E2D6] text-[#52525B]">
            <Terminal className="w-3.5 h-3.5 text-[#FF4F00]" />
            <span>STAGE 0{activeStep + 1} / 04</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            DETERMINISTIC
          </span>
        </div>
      </div>

      {/* 4 Pipeline Stages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-4">
        {STAGES.map((stage, idx) => {
          const isActive = idx === activeStep;

          return (
            <button
              key={stage.key}
              onClick={() => setActiveStep(idx)}
              className={`text-left p-3.5 rounded-lg border transition-all duration-200 relative group cursor-pointer ${
                isActive
                  ? 'border-[#FF4F00] ring-2 ring-[#FF4F00]/20 bg-[#FFF9F6] shadow-sm'
                  : 'border-[#E7E2D6] bg-[#FAF9F5]/70 hover:bg-white hover:border-[#FF4F00]/50 hover:shadow-xs'
              }`}
            >
              {/* Active Step Pin */}
              {isActive && (
                <div className="absolute -top-2.5 left-3 bg-[#FF4F00] text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> LIVE FOCUS
                </div>
              )}

              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold text-[#A1A1AA]">
                  {stage.level}
                </span>
                <span 
                  className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border"
                  style={{
                    backgroundColor: stage.bg,
                    borderColor: stage.border,
                    color: stage.color,
                  }}
                >
                  {stage.label}
                </span>
              </div>

              <div className="font-bold text-xs text-[#18181B] tracking-tight">
                {stage.sub}
              </div>

              <p className="text-[11px] text-[#71717A] mt-1 leading-snug line-clamp-2">
                {stage.description}
              </p>

              <div className="mt-2.5 pt-2 border-t border-[#E7E2D6]/70 flex items-center justify-between text-[10px] font-mono text-[#52525B]">
                <span className="font-semibold">{stage.weight}</span>
                {idx < STAGES.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-[#A1A1AA] hidden lg:inline group-hover:translate-x-0.5 transition-transform" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom explanation strip */}
      <div className="p-3 bg-[#FAF9F5] border border-[#E7E2D6] rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs font-mono text-[#52525B]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#FF4F00] shrink-0" />
          <span>
            <strong>Deterministic Isolation:</strong> NLP/AI parses raw files into typed signals. Final role fit is calculated via 6-factor linear matrix.
          </span>
        </div>
        <div className="text-[10px] font-semibold text-[#FF4F00] flex items-center gap-1 shrink-0">
          <span>● SELECT STAGE TO INSPECT</span>
        </div>
      </div>
    </div>
  );
};
