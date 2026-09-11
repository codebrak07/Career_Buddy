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
    description: 'User stated competency. Baseline signal with zero external verification.',
    color: '#6E7A8A',
    bg: '#F5F2EA',
    border: '#EAE6DF',
  },
  {
    key: 'detected',
    level: 'TIER-2',
    label: 'Detected',
    sub: 'NLP Semantic Parse',
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
    sub: 'Diagnostic Challenge',
    weight: '100% Platform Weight',
    description: 'Proven through calibrated Bayesian assessments and deterministic challenge tests.',
    color: '#059669',
    bg: '#F0FDF4',
    border: '#BBF7D0',
  },
];

export const LivePipelineHero: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <div 
      className="editorial-card relative rounded-2xl bg-white p-7 sm:p-9 shadow-sm overflow-hidden"
    >
      {/* Header telemetry row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EAE6DF]">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F] animate-pulse" />
          <div>
            <div className="text-[10px] font-mono font-bold tracking-widest text-[#6E7A8A] uppercase flex items-center gap-2">
              <span>EPISTEMIC PIPELINE</span>
              <span className="text-[#DDD8CE]">/</span>
              <span className="text-[#FF5A1F]">SIGNAL CALIBRATION</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-[#14171A] tracking-tight mt-1 font-sans">
              How Unstructured Evidence Becomes Defensible Career Intelligence
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF9F5] border border-[#EAE6DF] text-[#454F5B]">
            <Terminal className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>STAGE 0{activeStep + 1} / 04</span>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-[#F0FDF4] text-[#059669] border border-[#BBF7D0]">
            DETERMINISTIC
          </span>
        </div>
      </div>

      {/* 4 Pipeline Stages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        {STAGES.map((stage, idx) => {
          const isActive = idx === activeStep;

          return (
            <button
              key={stage.key}
              onClick={() => setActiveStep(idx)}
              className={`text-left p-5 rounded-xl border transition-all duration-200 relative group cursor-pointer ${
                isActive
                  ? 'border-[#FF5A1F] ring-2 ring-[#FF5A1F]/20 bg-[#FFFDFB] shadow-sm'
                  : 'border-[#EAE6DF] bg-[#FAF9F5]/70 hover:bg-white hover:border-[#DDD8CE]'
              }`}
            >
              {/* Active Step Pin */}
              {isActive && (
                <div className="absolute -top-2.5 left-4 bg-[#FF5A1F] text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> LIVE FOCUS
                </div>
              )}

              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-semibold text-[#9AA5B5]">
                  {stage.level}
                </span>
                <span 
                  className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: stage.bg,
                    borderColor: stage.border,
                    color: stage.color,
                  }}
                >
                  {stage.label}
                </span>
              </div>

              <div className="font-bold text-sm text-[#14171A] tracking-tight">
                {stage.sub}
              </div>

              <p className="text-xs text-[#6E7A8A] mt-2 leading-relaxed line-clamp-2">
                {stage.description}
              </p>

              <div className="mt-4 pt-3 border-t border-[#EAE6DF] flex items-center justify-between text-[11px] font-mono text-[#454F5B]">
                <span className="font-semibold">{stage.weight}</span>
                {idx < STAGES.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-[#9AA5B5] hidden lg:inline group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom explanation strip */}
      <div className="p-4 bg-[#FAF9F5] border border-[#EAE6DF] rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono text-[#454F5B]">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#FF5A1F] shrink-0" />
          <span>
            <strong>Deterministic Isolation:</strong> NLP parses raw evidence into typed signals. Final readiness is computed strictly by 6-factor linear matrix.
          </span>
        </div>
        <div className="text-[10px] font-semibold text-[#FF5A1F] flex items-center gap-1 shrink-0">
          <span>● CLICK STAGE TO FOCUS</span>
        </div>
      </div>
    </div>
  );
};
