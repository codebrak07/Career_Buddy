import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { SectionIndex } from '../common/SectionIndex';
import type { SkillCategory, UserSkill } from '../../types';
import { CheckCircle2, Zap } from 'lucide-react';

export const SkillIntelligenceScreen: React.FC = () => {
  const { userProfile, launchAssessment } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');

  const allSkills: UserSkill[] = Object.values(userProfile.skills);
  const filteredSkills = selectedCategory === 'all'
    ? allSkills
    : allSkills.filter(s => s.category === selectedCategory);

  const validated = allSkills.filter(s => s.state === 'validated');
  const evidenced = allSkills.filter(s => s.state === 'evidenced');
  const claimed = allSkills.filter(s => s.state === 'claimed' || s.state === 'detected');

  const avgConfidence = allSkills.length > 0
    ? Math.round(allSkills.reduce((acc, s) => acc + s.confidence, 0) / allSkills.length)
    : 0;

  const categories: { id: SkillCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Domains' },
    { id: 'frontend', label: 'Frontend & UI' },
    { id: 'backend', label: 'Backend & DB' },
    { id: 'data_ml', label: 'Data & ML' },
    { id: 'devops_cloud', label: 'DevOps & Cloud' },
    { id: 'fundamentals', label: 'Core Fundamentals' },
  ];

  return (
    <div className="space-y-6 py-4">
      
      {/* Overview Instrument Banner */}
      <div className="bento-cell p-6 sm:p-8 rounded-2xl border border-[#E7E2D6] bg-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <SectionIndex 
            index="02" 
            label="COMPETENCY GRAPH & CALIBRATION" 
            sublabel="Every competency is scored using calibrated epistemic weights derived from repositories, transcripts, and interactive validation rubrics."
          />
          <span className="text-xs font-mono text-[#71717A] bg-[#FAF9F5] border border-[#E7E2D6] px-2.5 py-1 rounded-lg shrink-0 self-start md:self-auto font-bold">
            {allSkills.length} Tracked Nodes
          </span>
        </div>

        {/* Global Competency Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E7E2D6] font-mono">
          <div className="p-3.5 bg-[#FAF9F5] rounded-xl border border-[#E7E2D6]">
            <div className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">MEAN CONFIDENCE</div>
            <div className="text-3xl font-black text-[#18181B] mt-1 font-mono">
              <AnimatedCounter value={avgConfidence} suffix="%" />
            </div>
            <div className="text-[10px] text-emerald-700 font-medium mt-0.5">Calibrated Signal</div>
          </div>

          <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200">
            <div className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider">VALIDATED MASTERY</div>
            <div className="text-3xl font-black text-emerald-900 mt-1 font-mono">
              <AnimatedCounter value={validated.length} />
            </div>
            <div className="text-[10px] text-emerald-700">Diagnostic Proof</div>
          </div>

          <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200">
            <div className="text-[10px] text-amber-800 uppercase font-bold tracking-wider">EVIDENCED REPOS</div>
            <div className="text-3xl font-black text-amber-900 mt-1 font-mono">
              <AnimatedCounter value={evidenced.length} />
            </div>
            <div className="text-[10px] text-amber-700">Code Artifacts</div>
          </div>

          <div className="p-3.5 bg-[#FAF9F5] rounded-xl border border-[#E7E2D6]">
            <div className="text-[10px] text-[#71717A] uppercase font-bold tracking-wider">UNVERIFIED / CLAIMED</div>
            <div className="text-3xl font-black text-[#71717A] mt-1 font-mono">
              <AnimatedCounter value={claimed.length} />
            </div>
            <div className="text-[10px] text-[#FF4F00] font-medium mt-0.5">Test Recommended</div>
          </div>
        </div>
      </div>

      {/* Filter Domain Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              selectedCategory === cat.id
                ? 'bg-[#18181B] text-white font-bold shadow-xs'
                : 'bg-white text-[#52525B] border border-[#E7E2D6] hover:bg-[#FAF9F5]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Detailed Skill Cards Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map(skill => (
          <div 
            key={skill.id} 
            className="bento-cell p-5 bg-white border border-[#E7E2D6] rounded-xl flex flex-col justify-between shadow-xs hover:border-[#D4D4D8] transition"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#18181B] tracking-tight">{skill.name}</h3>
                  <div className="text-[10px] font-mono text-[#71717A] uppercase mt-0.5">
                    {skill.category.replace('_', ' ')} · {skill.proficiency}
                  </div>
                </div>
                <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                  skill.state === 'validated' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                  skill.state === 'evidenced' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                  skill.state === 'detected' ? 'bg-sky-50 text-sky-800 border-sky-200' :
                  'bg-stone-100 text-stone-700 border-stone-200'
                }`}>
                  {skill.state}
                </span>
              </div>

              {/* Confidence Progress Meter */}
              <div className="my-3.5">
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-[#71717A]">Competency Signal:</span>
                  <span className="font-bold text-[#18181B]">{skill.confidence}%</span>
                </div>
                <div className="w-full bg-[#E7E2D6] rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      skill.state === 'validated' ? 'bg-emerald-500' :
                      skill.state === 'evidenced' ? 'bg-amber-500' :
                      skill.state === 'detected' ? 'bg-sky-500' : 'bg-stone-400'
                    }`}
                    style={{ width: `${skill.confidence}%` }}
                  />
                </div>
              </div>

              {/* Proof Sources */}
              <div className="space-y-1 mt-3 pt-3 border-t border-[#E7E2D6] text-[11px] font-mono text-[#71717A]">
                <div className="text-[9px] uppercase font-bold text-[#A1A1AA]">Verifiable Sources:</div>
                {skill.evidenceSources.map((src, i) => (
                  <div key={i} className="truncate text-[#18181B]">
                    • {src}
                  </div>
                ))}
              </div>
            </div>

            {/* Validate Button CTA */}
            <div className="mt-4 pt-3 border-t border-[#E7E2D6]">
              {skill.state === 'validated' ? (
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Officially Validated</span>
                </div>
              ) : (
                <button
                  onClick={() => launchAssessment(skill.id)}
                  className="w-full py-1.5 bg-[#FFF9F6] hover:bg-[#FFF2EB] text-[#FF4F00] text-xs font-mono font-bold rounded-lg border border-[#FF4F00]/30 flex items-center justify-center gap-1.5 transition"
                >
                  <Zap className="w-3.5 h-3.5 text-[#FF4F00]" />
                  <span>Validate via Assessment (+15%)</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
