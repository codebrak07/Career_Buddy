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
    <div className="space-y-10 py-2 max-w-[1360px] mx-auto">
      
      {/* Header Banner */}
      <div className="editorial-card p-8 sm:p-10 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <SectionIndex 
            index="06" 
            label="CURATED LEARNING & CAPSTONES" 
            sublabel="Every curriculum recommendation directly maps to an identified gap and pairs with an actionable Capstone Project Blueprint that produces verifiable proof."
          />
          <span className="text-xs font-mono text-[#6E7A8A] bg-[#FAF9F5] border border-[#EAE6DF] px-3.5 py-1.5 rounded-xl shrink-0 self-start md:self-auto font-bold">
            {LEARNING_RESOURCES.length} Curated Blueprints
          </span>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="space-y-6">
        {LEARNING_RESOURCES.map((resource) => {
          const targetSkill = SKILLS_TAXONOMY[resource.targetSkillId];
          const userSkill = userProfile.skills ? userProfile.skills[resource.targetSkillId] : undefined;
          const isSatisfied = userSkill && userSkill.confidence >= 70;

          return (
            <div 
              key={resource.id} 
              className={`editorial-card p-8 sm:p-9 bg-white transition-all ${
                isSatisfied ? 'border-emerald-200' : 'border-[#EAE6DF]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-[#FFF5F0] text-[#FF5A1F] border border-[#FFD5C4]">
                      TARGET: {targetSkill?.name || resource.targetSkillId}
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#FAF9F5] text-[#525B67] border border-[#EAE6DF]">
                      {resource.provider}
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#FAF9F5] text-[#525B67] border border-[#EAE6DF]">
                      {resource.difficulty} · {resource.format}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-[#14171A] tracking-tight font-sans">
                    {resource.title}
                  </h2>

                  <p className="text-sm text-[#525B67] leading-relaxed max-w-3xl">
                    <strong className="text-[#14171A]">Target Outcome:</strong> {resource.competencyOutcome}
                  </p>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between shrink-0 font-mono text-xs text-[#6E7A8A]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#FF5A1F]" />
                    <span>{resource.estimatedHours} Hours</span>
                  </div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-[#FF5A1F] hover:underline flex items-center gap-1 text-xs font-semibold"
                  >
                    <span>Course Syllabus</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Capstone Project Blueprint Box */}
              <div className="mt-6 p-5 bg-[#FAF9F5] rounded-2xl border border-[#EAE6DF]">
                <div className="flex items-center space-x-2 text-xs font-mono text-emerald-800 font-bold mb-2">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                  <span>ACTIONABLE EVIDENCE CAPSTONE: {resource.capstoneProject.title}</span>
                </div>
                <div className="text-sm text-[#14171A] leading-relaxed">
                  {resource.capstoneProject.description}
                </div>
                <div className="mt-3.5 text-xs font-mono text-[#525B67] bg-white p-3 rounded-xl border border-[#EAE6DF]">
                  <span className="text-[#9AA5B5] uppercase font-bold text-[10px] block mb-1">Proof Artifact Output:</span>
                  {resource.capstoneProject.evidenceOutput}
                </div>
              </div>

              {/* Action Strip */}
              <div className="mt-6 pt-5 border-t border-[#EAE6DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  {isSatisfied ? (
                    <span className="text-xs font-mono text-emerald-700 flex items-center gap-1.5 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Skill Already Satisfied in Profile ({userSkill.confidence}%)</span>
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-[#6E7A8A]">
                      Current Profile Confidence: <strong className="text-[#14171A]">{userSkill ? userSkill.confidence : 0}%</strong>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => launchAssessment(resource.targetSkillId)}
                  className="px-4 py-2 bg-[#FFF5F0] hover:bg-[#FFEAE0] text-[#FF5A1F] border border-[#FFD5C4] rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5 text-[#FF5A1F]" />
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
