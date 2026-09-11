import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, GitBranch, Award, FileCode, ExternalLink, Info, CheckCircle2, Terminal } from 'lucide-react';

export const EvidenceDossier: React.FC = () => {
  const { userProfile, launchAssessment } = useApp();

  const skillsList = Object.values(userProfile.skills);
  const validatedCount = skillsList.filter(s => s.state === 'validated').length;
  const evidencedCount = skillsList.filter(s => s.state === 'evidenced').length;
  const detectedCount = skillsList.filter(s => s.state === 'detected').length;
  const claimedCount = skillsList.filter(s => s.state === 'claimed').length;

  return (
    <div className="space-y-8">
      
      {/* Dossier Master Header */}
      <div className="editorial-card p-8 sm:p-10 bg-white relative overflow-hidden">
        <div className="absolute right-8 top-8 hidden sm:block">
          <div className="dossier-stamp dossier-stamp-validated">
            EVIDENCE DOSSIER VERIFIED
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#FF5A1F] uppercase font-bold">
          <ShieldCheck className="w-4 h-4 text-[#FF5A1F]" />
          <span>OFFICIAL CANDIDATE PROOF ARCHIVE · RECORD ID #{userProfile.id.toUpperCase()}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14171A] mt-3 tracking-tight font-sans">
          {userProfile.name}
        </h1>
        <p className="text-base text-[#454F5B] mt-2 max-w-2xl leading-relaxed">
          {userProfile.bio}
        </p>

        {/* Epistemic Note */}
        <div className="mt-5 p-4 bg-[#FAF9F5] rounded-xl border border-[#EAE6DF] text-xs text-[#525B67] flex items-start gap-3 max-w-3xl leading-relaxed">
          <Info className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#14171A]">Epistemic Transparency Notice:</strong> Evidence represents context-aware signal strength, not absolute real-world certification. &apos;Validated&apos; status reflects internal diagnostic assessment benchmarks.
          </div>
        </div>

        {/* 4-Tier Epistemic Status Ledger */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#EAE6DF] font-mono">
          <div className="p-4 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0]">
            <div className="text-[10px] text-emerald-800 uppercase font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span> VALIDATED (1.00)
            </div>
            <div className="text-3xl font-black text-emerald-950 mt-1">{validatedCount}</div>
            <div className="text-[11px] text-emerald-700 mt-0.5">Diagnostic Tests Passed</div>
          </div>

          <div className="p-4 bg-[#FFFBEB] rounded-xl border border-[#FDE68A]">
            <div className="text-[10px] text-amber-800 uppercase font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span> EVIDENCED (0.75)
            </div>
            <div className="text-3xl font-black text-amber-950 mt-1">{evidencedCount}</div>
            <div className="text-[11px] text-amber-700 mt-0.5">GitHub / Project Repos</div>
          </div>

          <div className="p-4 bg-[#F0F9FF] rounded-xl border border-[#BAE6FD]">
            <div className="text-[10px] text-sky-800 uppercase font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-600"></span> DETECTED (0.35)
            </div>
            <div className="text-3xl font-black text-sky-950 mt-1">{detectedCount}</div>
            <div className="text-[11px] text-sky-700 mt-0.5">Coursework / Transcripts</div>
          </div>

          <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#EAE6DF]">
            <div className="text-[10px] text-[#6E7A8A] uppercase font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-stone-400"></span> CLAIMED (0.15)
            </div>
            <div className="text-3xl font-black text-[#14171A] mt-1">{claimedCount}</div>
            <div className="text-[11px] text-[#6E7A8A] mt-0.5">Unverified Claims</div>
          </div>
        </div>
      </div>

      {/* Artifacts & Inventory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Verifiable Artifact Ledger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-xs font-mono font-bold uppercase text-[#6E7A8A] tracking-wider">
              Submitted Artifacts & Repositories ({userProfile.artifacts.length})
            </h2>
            <span className="text-xs font-mono text-[#6E7A8A] flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" /> Digest Verified
            </span>
          </div>

          <div className="space-y-4">
            {userProfile.artifacts.map((art) => (
              <div key={art.id} className="editorial-card p-6 bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#EAE6DF] text-[#FF5A1F] shrink-0 mt-0.5">
                      {art.sourceType === 'github_repo' ? (
                        <GitBranch className="w-5 h-5" />
                      ) : art.sourceType === 'certification' ? (
                        <Award className="w-5 h-5" />
                      ) : (
                        <FileCode className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-bold text-[#14171A]">{art.title}</span>
                        {art.url && (
                          <a 
                            href={art.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[#9AA5B5] hover:text-[#FF5A1F] transition"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <div className="text-xs text-[#6E7A8A] font-mono mt-1">
                        Recorded on {art.date} · Source: {art.sourceType.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <span className={`telemetry-badge ${
                    art.verificationState === 'validated' ? 'telemetry-validated' :
                    art.verificationState === 'evidenced' ? 'telemetry-evidenced' :
                    'telemetry-detected'
                  }`}>
                    {art.verificationState} ({Math.round(art.evidenceStrength * 100)}%)
                  </span>
                </div>

                {art.metadata.notes && (
                  <div className="text-xs text-[#525B67] mt-4 p-3.5 bg-[#FAF9F5] rounded-xl border border-[#EAE6DF] font-mono leading-relaxed">
                    {art.metadata.notes}
                  </div>
                )}

                {/* Extracted skills pills */}
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[#EAE6DF]">
                  <span className="text-[10px] font-mono text-[#9AA5B5] uppercase mr-1">Extracted:</span>
                  {art.extractedSkills.map((skId) => (
                    <span key={skId} className="text-xs font-mono px-2.5 py-1 bg-[#FAF9F5] text-[#2B323B] rounded-lg border border-[#EAE6DF]">
                      {skId}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Education & Work Experience */}
          <div className="editorial-card p-8 bg-white">
            <h3 className="text-xs font-mono font-bold uppercase text-[#6E7A8A] tracking-wider mb-5">
              Academic Credentials & Industry Experience
            </h3>
            
            <div className="space-y-5">
              {userProfile.education.map((edu, idx) => (
                <div key={idx} className="flex items-start justify-between text-xs pb-4 border-b border-[#EAE6DF] last:border-0">
                  <div>
                    <div className="font-bold text-sm text-[#14171A]">{edu.degree} — {edu.field}</div>
                    <div className="text-[#6E7A8A] font-mono mt-0.5">{edu.institution} (Class of {edu.graduationYear})</div>
                  </div>
                  {edu.gpa && (
                    <span className="font-mono text-[#FF5A1F] font-bold bg-[#FFF5F0] px-2.5 py-1 rounded-lg border border-[#FFD5C4]">
                      GPA {edu.gpa}
                    </span>
                  )}
                </div>
              ))}

              {userProfile.experience.map((exp, idx) => (
                <div key={idx} className="text-xs pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#14171A]">{exp.title}</span>
                    <span className="font-mono text-[#6E7A8A]">{exp.period}</span>
                  </div>
                  <div className="text-[#FF5A1F] font-mono text-xs mt-0.5 mb-2.5 font-medium">{exp.company}</div>
                  <ul className="list-disc list-inside space-y-1.5 text-[#525B67] leading-relaxed">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Epistemic Skill Inventory */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-xs font-mono font-bold uppercase text-[#6E7A8A] tracking-wider">
              Epistemic Skills ({skillsList.length})
            </h2>
            <span className="text-xs font-mono text-[#FF5A1F] font-semibold">Proof Audit</span>
          </div>

          <div className="editorial-card p-5 bg-white space-y-3.5">
            {skillsList.map((skill) => (
              <div key={skill.id} className="p-4 bg-[#FAF9F5] rounded-xl border border-[#EAE6DF] hover:border-[#DDD8CE] transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#14171A]">{skill.name}</span>
                  <span className={`telemetry-badge text-[9px] ${
                    skill.state === 'validated' ? 'telemetry-validated' :
                    skill.state === 'evidenced' ? 'telemetry-evidenced' :
                    skill.state === 'detected' ? 'telemetry-detected' :
                    'telemetry-claimed'
                  }`}>
                    {skill.state}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-[#6E7A8A] mt-2.5">
                  <span>Confidence: <strong className="text-[#14171A]">{skill.confidence}%</strong></span>
                  <span>Proficiency: <strong className="text-[#FF5A1F] font-bold">{skill.proficiency}</strong></span>
                </div>

                {/* Calibrated Confidence Bar */}
                <div className="w-full bg-[#EAE6DF] rounded-full h-1.5 mt-2 overflow-hidden">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      skill.state === 'validated' ? 'bg-emerald-500' :
                      skill.state === 'evidenced' ? 'bg-amber-500' :
                      skill.state === 'detected' ? 'bg-sky-500' : 'bg-stone-400'
                    }`}
                    style={{ width: `${skill.confidence}%` }}
                  ></div>
                </div>

                {/* Evidence source note */}
                <div className="text-[11px] text-[#9AA5B5] mt-2.5 font-mono truncate">
                  Source: {skill.evidenceSources[0] || 'Direct user input'}
                </div>

                {/* Validation CTA if not validated */}
                {skill.state !== 'validated' && (
                  <button
                    onClick={() => launchAssessment(skill.id)}
                    className="w-full mt-3 py-1.5 bg-white hover:bg-[#FFF5F0] text-[#FF5A1F] text-xs font-mono font-bold rounded-lg border border-[#FFD5C4] flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A1F]" />
                    <span>Validate via Assessment</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
