import React from 'react';
import { useApp } from '../../context/AppContext';
import { LEARNING_RESOURCES } from '../../data/learningResources';
import { SKILLS_TAXONOMY } from '../../data/skillsTaxonomy';
import { SectionIndex } from '../common/SectionIndex';
import { 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  Code2, 
  Zap
} from 'lucide-react';

export const LearningJourneyScreen: React.FC = () => {
  const { userProfile, launchAssessment } = useApp();

  return (
    <div className="space-y-6 py-4">
      
      {/* Header Banner */}
      <div className="bento-cell p-6 sm:p-8 rounded-2xl border border-[#E7E2D6] bg-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <SectionIndex 
            index="06" 
            label="CURATED LEARNING & CAPSTONES" 
            sublabel="Every curriculum recommendation directly maps to an identified gap and pairs with an actionable Capstone Project Blueprint that produces verifiable proof."
          />
          <span className="text-xs font-mono text-[#71717A] bg-[#FAF9F5] border border-[#E7E2D6] px-2.5 py-1 rounded-lg shrink-0 self-start md:self-auto font-bold">
            {LEARNING_RESOURCES.length} Curated Blueprints
          </span>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="space-y-4">
        {LEARNING_RESOURCES.map((resource) => {
          const targetSkill = SKILLS_TAXONOMY[resource.targetSkillId];
          const userSkill = userProfile.skills ? userProfile.skills[resource.targetSkillId] : undefined;
          const isSatisfied = userSkill && userSkill.confidence >= 70;

          return (
            <div 
              key={resource.id} 
              className={`bento-cell p-6 sm:p-7 rounded-2xl border transition-all bg-white shadow-sm ${
                isSatisfied ? 'border-emerald-200' : 'border-[#E7E2D6]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#FFF9F6] text-[#FF4F00] border border-[#FF4F00]/20">
                      TARGET: {targetSkill?.name || resource.targetSkillId}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF9F5] text-[#52525B] border border-[#E7E2D6]">
                      {resource.provider}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF9F5] text-[#52525B] border border-[#E7E2D6]">
                      {resource.difficulty} · {resource.format}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-[#18181B] tracking-tight">
                    {resource.title}
                  </h2>

                  <p className="text-xs text-[#52525B] leading-relaxed">
                    <strong>Target Outcome:</strong> {resource.competencyOutcome}
                  </p>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between shrink-0 font-mono text-xs text-[#71717A]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FF4F00]" />
                    <span>{resource.estimatedHours} Hours</span>
                  </div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-[#FF4F00] hover:underline flex items-center gap-1 text-[11px] font-semibold"
                  >
                    <span>Course Syllabus</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Capstone Project Blueprint Box */}
              <div className="mt-5 p-4 bg-[#FAF9F5] rounded-xl border border-[#E7E2D6]">
                <div className="flex items-center space-x-2 text-xs font-mono text-emerald-800 font-bold mb-1.5">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                  <span>ACTIONABLE EVIDENCE CAPSTONE: {resource.capstoneProject.title}</span>
                </div>
                <div className="text-xs text-[#18181B]">
                  {resource.capstoneProject.description}
                </div>
                <div className="mt-3 text-[11px] font-mono text-[#52525B] bg-white p-2.5 rounded-lg border border-[#E7E2D6]">
                  <span className="text-[#A1A1AA] uppercase font-bold text-[10px] block mb-0.5">Proof Artifact Output:</span>
                  {resource.capstoneProject.evidenceOutput}
                </div>
              </div>

              {/* Action Strip */}
              <div className="mt-5 pt-4 border-t border-[#E7E2D6] flex items-center justify-between">
                <div>
                  {isSatisfied ? (
                    <span className="text-xs font-mono text-emerald-700 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Skill Already Satisfied in Profile ({userSkill.confidence}%)</span>
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-[#71717A]">
                      Current Profile Confidence: <strong className="text-[#18181B]">{userSkill ? userSkill.confidence : 0}%</strong>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => launchAssessment(resource.targetSkillId)}
                  className="px-3 py-1.5 bg-[#FFF9F6] hover:bg-[#FFF2EB] text-[#FF4F00] border border-[#FF4F00]/30 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Diagnostic Test</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
