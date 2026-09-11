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
    <div className="space-y-8 py-2 max-w-[1360px] mx-auto">
      
      {/* Overview Instrument Banner */}
      <div className="editorial-card p-8 sm:p-10 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <SectionIndex 
            index="02" 
            label="COMPETENCY GRAPH & CALIBRATION" 
            sublabel="Every competency is scored using calibrated epistemic weights derived from repositories, transcripts, and interactive validation rubrics."
          />
          <span className="text-xs font-mono text-[#6E7A8A] bg-[#FAF9F5] border border-[#EAE6DF] px-3.5 py-1.5 rounded-xl shrink-0 self-start md:self-auto font-bold">
            {allSkills.length} Tracked Nodes
          </span>
        </div>

        {/* Global Competency Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#EAE6DF] font-mono">
          <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#EAE6DF]">
            <div className="text-[10px] text-[#6E7A8A] uppercase font-bold tracking-wider">MEAN CONFIDENCE</div>
            <div className="text-3xl font-black text-[#14171A] mt-1 font-mono">
              <AnimatedCounter value={avgConfidence} suffix="%" />
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Calibrated Signal</div>
          </div>

          <div className="p-4 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0]">
            <div className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider">VALIDATED MASTERY</div>
            <div className="text-3xl font-black text-emerald-900 mt-1 font-mono">
              <AnimatedCounter value={validated.length} />
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">Diagnostic Proof</div>
          </div>

          <div className="p-4 bg-[#FFFBEB] rounded-xl border border-[#FDE68A]">
            <div className="text-[10px] text-amber-800 uppercase font-bold tracking-wider">EVIDENCED REPOS</div>
            <div className="text-3xl font-black text-amber-900 mt-1 font-mono">
              <AnimatedCounter value={evidenced.length} />
            </div>
            <div className="text-[11px] text-amber-700 mt-0.5">Code Artifacts</div>
          </div>

          <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#EAE6DF]">
            <div className="text-[10px] text-[#6E7A8A] uppercase font-bold tracking-wider">UNVERIFIED / CLAIMED</div>
            <div className="text-3xl font-black text-[#6E7A8A] mt-1 font-mono">
              <AnimatedCounter value={claimed.length} />
            </div>
            <div className="text-[11px] text-[#FF5A1F] font-medium mt-0.5">Test Recommended</div>
          </div>
        </div>
      </div>

      {/* Filter Domain Tabs */}
      <div className="flex flex-wrap gap-2.5">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#14171A] text-white font-bold shadow-xs'
                : 'bg-white text-[#525B67] border border-[#EAE6DF] hover:bg-[#FAF9F5] hover:text-[#14171A]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Detailed Skill Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map(skill => (
          <div 
            key={skill.id} 
            className="editorial-card p-6 bg-white flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#14171A] tracking-tight">{skill.name}</h3>
                  <div className="text-[11px] font-mono text-[#6E7A8A] uppercase mt-1">
                    {skill.category.replace('_', ' ')} · {skill.proficiency}
                  </div>
                </div>
                <span className={`telemetry-badge ${
                  skill.state === 'validated' ? 'telemetry-validated' :
                  skill.state === 'evidenced' ? 'telemetry-evidenced' :
                  skill.state === 'detected' ? 'telemetry-detected' :
                  'telemetry-claimed'
                }`}>
                  {skill.state}
                </span>
              </div>

              {/* Confidence Progress Meter */}
              <div className="my-5">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-[#6E7A8A]">Competency Signal:</span>
                  <span className="font-bold text-[#14171A]">{skill.confidence}%</span>
                </div>
                <div className="w-full bg-[#EAE6DF] rounded-full h-2 overflow-hidden">
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
              <div className="space-y-1.5 mt-4 pt-4 border-t border-[#EAE6DF] text-xs font-mono text-[#6E7A8A]">
                <div className="text-[10px] uppercase font-bold text-[#9AA5B5]">Verifiable Sources:</div>
                {skill.evidenceSources.map((src, i) => (
                  <div key={i} className="truncate text-[#14171A] text-[11px]">
                    • {src}
                  </div>
                ))}
              </div>
            </div>

            {/* Validate Button CTA */}
            <div className="mt-5 pt-4 border-t border-[#EAE6DF]">
              {skill.state === 'validated' ? (
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold py-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Officially Validated</span>
                </div>
              ) : (
                <button
                  onClick={() => launchAssessment(skill.id)}
                  className="w-full py-2 bg-[#FFF5F0] hover:bg-[#FFEAE0] text-[#FF5A1F] text-xs font-mono font-bold rounded-xl border border-[#FFD5C4] flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5 text-[#FF5A1F]" />
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
