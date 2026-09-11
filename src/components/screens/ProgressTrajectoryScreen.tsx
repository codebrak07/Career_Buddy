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
    <div className="space-y-6 py-4">
      
      {/* Header Banner */}
      <div className="bento-cell p-6 sm:p-8 rounded-2xl border border-[#E7E2D6] bg-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <SectionIndex 
            index="08" 
            label="PROGRESSION TRAJECTORY & AUDIT" 
            sublabel="Immutable log of verified skill upgrades, diagnostic evaluations, and subsequent deterministic role readiness score shifts."
          />
          <span className="text-xs font-mono text-[#71717A] bg-[#FAF9F5] border border-[#E7E2D6] px-2.5 py-1 rounded-lg shrink-0 self-start md:self-auto font-bold">
            Immutable Audit Trail
          </span>
        </div>

        {/* Global Progress Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E7E2D6] font-mono text-xs">
          <div className="p-3.5 bg-[#FAF9F5] rounded-xl border border-[#E7E2D6]">
            <div className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">TOTAL COMPETENCIES</div>
            <div className="text-2xl font-black text-[#18181B] mt-1 font-mono">
              <AnimatedCounter value={skillsList.length} />
            </div>
          </div>
          <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200">
            <div className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider">VALIDATED MASTERY</div>
            <div className="text-2xl font-black text-emerald-900 mt-1 font-mono">
              <AnimatedCounter value={validatedCount} />
            </div>
          </div>
          <div className="p-3.5 bg-sky-50/70 rounded-xl border border-sky-200">
            <div className="text-[10px] text-sky-800 uppercase font-bold tracking-wider">ASSESSMENTS LOGGED</div>
            <div className="text-2xl font-black text-sky-900 mt-1 font-mono">
              <AnimatedCounter value={userProfile.assessmentHistory.length} />
            </div>
          </div>
          <div className="p-3.5 bg-[#FFF9F6] rounded-xl border border-[#FF4F00]/30">
            <div className="text-[10px] text-[#FF4F00] uppercase font-bold tracking-wider">READY NOW ROLES</div>
            <div className="text-2xl font-black text-[#FF4F00] mt-1 font-mono">
              <AnimatedCounter value={allRoleMatches.readyNow.length} />
            </div>
          </div>
        </div>
      </div>

      {/* Trajectory Event Log Timeline */}
      <div className="bento-cell p-6 sm:p-8 rounded-2xl border border-[#E7E2D6] bg-white shadow-sm">
        <h2 className="text-xs font-mono uppercase text-[#18181B] font-bold mb-6 flex items-center gap-2 tracking-wider">
          <Activity className="w-4 h-4 text-[#FF4F00]" />
          <span>Chronological Verification Ledger</span>
        </h2>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E7E2D6]">
          {userProfile.trajectoryLog.map((item, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-6 top-2 w-3 h-3 rounded-full bg-[#FF4F00] border-2 border-white ring-2 ring-[#FF4F00]/20 group-hover:scale-125 transition" />

              <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#E7E2D6] hover:border-[#D4D4D8] transition flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-[#71717A]">
                    <Calendar className="w-3.5 h-3.5 text-[#FF4F00]" />
                    <span>{item.timestamp}</span>
                    <span>·</span>
                    <span className="text-sky-700 font-bold uppercase">{item.affectedSkill}</span>
                  </div>
                  <div className="text-xs font-bold text-[#18181B] mt-1">
                    {item.event}
                  </div>
                </div>

                <div className="text-right font-mono shrink-0">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    +{item.deltaConfidence}% Confidence
                  </span>
                  {item.readinessDeltaScore && (
                    <div className="text-[10px] text-[#71717A] mt-1">
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
