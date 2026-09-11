import React from 'react';
import { useApp } from '../../context/AppContext';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { SectionIndex } from '../common/SectionIndex';
import { Activity, Calendar } from 'lucide-react';

export const ProgressTrajectoryScreen: React.FC = () => {
  const { userProfile, allRoleMatches } = useApp();

  const skillsList = Object.values(userProfile.skills);
  const validatedCount = skillsList.filter(s => s.state === 'validated').length;

  return (
    <div className="space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="editorial-card p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <SectionIndex 
            index="08" 
            label="PROGRESSION TRAJECTORY & AUDIT" 
            sublabel="Immutable log of verified skill upgrades, diagnostic evaluations, and subsequent deterministic role readiness score shifts."
          />
          <span className="text-xs font-mono text-[#6A6A60] bg-[#FAF9F5] border border-[#E5E0D8] px-3 py-1.5 rounded-lg shrink-0 self-start md:self-auto font-medium">
            Immutable Audit Trail
          </span>
        </div>

        {/* Global Progress Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#E5E0D8] font-mono text-xs">
          <div className="p-4 sm:p-5 bg-[#FAF9F5] rounded-xl border border-[#E5E0D8]">
            <div className="text-[10px] text-[#8C8C80] uppercase font-bold tracking-wider">TOTAL COMPETENCIES</div>
            <div className="text-2xl sm:text-3xl font-bold text-[#14171A] mt-2 font-mono">
              <AnimatedCounter value={skillsList.length} />
            </div>
          </div>
          <div className="p-4 sm:p-5 bg-emerald-50/40 rounded-xl border border-emerald-200/70">
            <div className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider">VALIDATED MASTERY</div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-900 mt-2 font-mono">
              <AnimatedCounter value={validatedCount} />
            </div>
          </div>
          <div className="p-4 sm:p-5 bg-sky-50/40 rounded-xl border border-sky-200/70">
            <div className="text-[10px] text-sky-800 uppercase font-bold tracking-wider">ASSESSMENTS LOGGED</div>
            <div className="text-2xl sm:text-3xl font-bold text-sky-900 mt-2 font-mono">
              <AnimatedCounter value={userProfile.assessmentHistory.length} />
            </div>
          </div>
          <div className="p-4 sm:p-5 bg-[#FFF9F6] rounded-xl border border-[#FF5A1F]/20">
            <div className="text-[10px] text-[#FF5A1F] uppercase font-bold tracking-wider">READY NOW ROLES</div>
            <div className="text-2xl sm:text-3xl font-bold text-[#FF5A1F] mt-2 font-mono">
              <AnimatedCounter value={allRoleMatches.readyNow.length} />
            </div>
          </div>
        </div>
      </div>

      {/* Trajectory Event Log Timeline */}
      <div className="editorial-card p-6 sm:p-8 lg:p-10">
        <h2 className="text-xs font-mono uppercase text-[#14171A] font-bold mb-8 flex items-center gap-2.5 tracking-wider">
          <Activity className="w-4 h-4 text-[#FF5A1F]" />
          <span>Chronological Verification Ledger</span>
        </h2>

        <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E5E0D8]">
          {userProfile.trajectoryLog.map((item, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-7 top-3 w-3.5 h-3.5 rounded-full bg-[#FF5A1F] border-2 border-white ring-2 ring-[#FF5A1F]/20 group-hover:scale-125 transition" />

              <div className="p-5 sm:p-6 bg-[#FAF9F5] rounded-xl border border-[#E5E0D8] hover:border-[#D5D0C8] hover:bg-white transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2.5 text-[11px] font-mono text-[#6A6A60]">
                    <Calendar className="w-3.5 h-3.5 text-[#FF5A1F]" />
                    <span>{item.timestamp}</span>
                    <span>·</span>
                    <span className="text-sky-700 font-semibold uppercase">{item.affectedSkill}</span>
                  </div>
                  <div className="text-sm font-semibold text-[#14171A]">
                    {item.event}
                  </div>
                </div>

                <div className="sm:text-right font-mono shrink-0">
                  <span className="inline-block text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-md border border-emerald-200">
                    +{item.deltaConfidence}% Confidence
                  </span>
                  {item.readinessDeltaScore && (
                    <div className="text-[11px] text-[#6A6A60] mt-1.5">
                      {item.readinessDeltaRole}: +{item.readinessDeltaScore}% Readiness
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
