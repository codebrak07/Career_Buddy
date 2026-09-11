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
    <div className="space-y-6">
      
      {/* Dossier Master Header */}
      <div className="paper-card p-6 sm:p-8 bg-white relative overflow-hidden border-stone-200">
        <div className="absolute right-6 top-6 hidden sm:block">
          <div className="dossier-stamp dossier-stamp-validated">
            [EVIDENCE DOSSIER VERIFIED]
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-orange-700 uppercase font-bold">
          <ShieldCheck className="w-4 h-4 text-orange-600" />
          <span>OFFICIAL CANDIDATE PROOF ARCHIVE · RECORD ID #{userProfile.id.toUpperCase()}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-sans">
          {userProfile.name}
        </h1>
        <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          {userProfile.bio}
        </p>

        {/* Epistemic Note */}
        <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-700 flex items-start gap-2 max-w-3xl">
          <Info className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <strong>Epistemic Transparency Notice:</strong> Evidence represents context-aware signal strength, not absolute real-world certification. &apos;Validated&apos; status reflects internal diagnostic assessment benchmarks.
          </div>
        </div>

        {/* 4-Tier Epistemic Status Ledger */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-100 font-mono">
          <div className="p-3.5 bg-emerald-50/60 rounded-lg border border-emerald-200 shadow-2xs">
            <div className="text-[10px] text-emerald-800 uppercase font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span> VALIDATED (1.00)
            </div>
            <div className="text-2xl font-black text-emerald-950 mt-1">{validatedCount}</div>
            <div className="text-[10px] text-emerald-700">Diagnostic Tests Passed</div>
          </div>

          <div className="p-3.5 bg-amber-50/60 rounded-lg border border-amber-200 shadow-2xs">
            <div className="text-[10px] text-amber-800 uppercase font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span> EVIDENCED (0.75)
            </div>
            <div className="text-2xl font-black text-amber-950 mt-1">{evidencedCount}</div>
            <div className="text-[10px] text-amber-700">GitHub / Project Repos</div>
          </div>

          <div className="p-3.5 bg-sky-50/60 rounded-lg border border-sky-200 shadow-2xs">
            <div className="text-[10px] text-sky-800 uppercase font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-600"></span> DETECTED (0.35)
            </div>
            <div className="text-2xl font-black text-sky-950 mt-1">{detectedCount}</div>
            <div className="text-[10px] text-sky-700">Coursework / Transcripts</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-600 uppercase font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span> CLAIMED (0.15)
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{claimedCount}</div>
            <div className="text-[10px] text-slate-500">Unverified Profile Claims</div>
          </div>
        </div>
      </div>

      {/* Artifacts & Inventory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Verifiable Artifact Ledger */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase text-stone-500 tracking-wider">
              Submitted Artifacts & Repositories ({userProfile.artifacts.length})
            </h2>
            <span className="text-xs font-mono text-stone-400 flex items-center gap-1">
              <Terminal className="w-3 h-3" /> Digest Verified
            </span>
          </div>

          <div className="space-y-3">
            {userProfile.artifacts.map((art) => (
              <div key={art.id} className="paper-card p-5 bg-white border-stone-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-2.5 rounded-lg bg-stone-100 border border-stone-200 text-orange-600 shrink-0 mt-0.5">
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
                        <span className="text-sm font-bold text-slate-900">{art.title}</span>
                        {art.url && (
                          <a 
                            href={art.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-stone-400 hover:text-orange-600 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <div className="text-xs text-stone-500 font-mono mt-0.5">
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
                  <div className="text-xs text-stone-700 mt-3 p-3 bg-stone-50 rounded-md border border-stone-200 font-mono">
                    {art.metadata.notes}
                  </div>
                )}

                {/* Extracted skills pills */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-stone-100">
                  <span className="text-[10px] font-mono text-stone-400 uppercase self-center mr-1">Extracted:</span>
                  {art.extractedSkills.map((skId) => (
                    <span key={skId} className="text-[11px] font-mono px-2 py-0.5 bg-stone-100 text-slate-800 rounded border border-stone-200">
                      {skId}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Education & Work Experience */}
          <div className="paper-card p-6 bg-white border-stone-200 mt-6">
            <h3 className="text-xs font-mono font-bold uppercase text-stone-500 tracking-wider mb-4">
              Academic Credentials & Industry Tenure
            </h3>
            
            <div className="space-y-4">
              {userProfile.education.map((edu, idx) => (
                <div key={idx} className="flex items-start justify-between text-xs pb-3 border-b border-stone-100">
                  <div>
                    <div className="font-bold text-slate-900">{edu.degree} — {edu.field}</div>
                    <div className="text-stone-500 font-mono">{edu.institution} (Class of {edu.graduationYear})</div>
                  </div>
                  {edu.gpa && (
                    <span className="font-mono text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      GPA {edu.gpa}
                    </span>
                  )}
                </div>
              ))}

              {userProfile.experience.map((exp, idx) => (
                <div key={idx} className="text-xs pt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{exp.title}</span>
                    <span className="font-mono text-stone-500">{exp.period}</span>
                  </div>
                  <div className="text-orange-600 font-mono text-[11px] mb-2 font-medium">{exp.company}</div>
                  <ul className="list-disc list-inside space-y-1 text-stone-600">
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase text-stone-500 tracking-wider">
              Epistemic Skills ({skillsList.length})
            </h2>
            <span className="text-xs font-mono text-orange-600 font-semibold">Proof Audit</span>
          </div>

          <div className="paper-card p-4 bg-white border-stone-200 space-y-3">
            {skillsList.map((skill) => (
              <div key={skill.id} className="p-3 bg-stone-50/70 rounded-lg border border-stone-200 hover:border-stone-300 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{skill.name}</span>
                  <span className={`telemetry-badge text-[9px] ${
                    skill.state === 'validated' ? 'telemetry-validated' :
                    skill.state === 'evidenced' ? 'telemetry-evidenced' :
                    skill.state === 'detected' ? 'telemetry-detected' :
                    'telemetry-claimed'
                  }`}>
                    {skill.state}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 mt-2">
                  <span>Confidence: <strong className="text-slate-900">{skill.confidence}%</strong></span>
                  <span>Proficiency: <strong className="text-orange-600 font-bold">{skill.proficiency}</strong></span>
                </div>

                {/* Calibrated Confidence Bar */}
                <div className="w-full bg-stone-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      skill.state === 'validated' ? 'bg-emerald-500' :
                      skill.state === 'evidenced' ? 'bg-amber-500' :
                      skill.state === 'detected' ? 'bg-sky-500' : 'bg-slate-400'
                    }`}
                    style={{ width: `${skill.confidence}%` }}
                  ></div>
                </div>

                {/* Evidence source note */}
                <div className="text-[10px] text-stone-400 mt-2 font-mono truncate">
                  Source: {skill.evidenceSources[0] || 'Direct user input'}
                </div>

                {/* Validation CTA if not validated */}
                {skill.state !== 'validated' && (
                  <button
                    onClick={() => launchAssessment(skill.id)}
                    className="w-full mt-2.5 py-1 bg-white hover:bg-orange-50 text-orange-700 text-[10px] font-mono font-bold rounded border border-orange-200 flex items-center justify-center gap-1 shadow-2xs transition"
                  >
                    <CheckCircle2 className="w-3 h-3 text-orange-600" />
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
