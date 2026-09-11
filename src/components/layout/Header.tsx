import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { CAREER_ROLES } from '../../data/rolesDatabase';
import { 
  analyzeCandidateSubmissionWithGroq, 
  type CandidateSubmissionAnalysis 
} from '../../services/groqService';
import { extractTextFromDocument } from '../../services/documentParser';
import { BrandLogo } from '../common/BrandLogo';
import {
  ChevronRight,
  ShieldCheck,
  UserCheck,
  UserPlus,
  X,
  Sparkles,
  Layers,
  Briefcase,
  GitFork,
  FileText,
  UploadCloud,
  FileCheck,
  Loader2
} from 'lucide-react';


interface PersonaMeta {
  id: string;
  name: string;
  initials: string;
  role: string;
  dotColor: string;
}

const PERSONAS: PersonaMeta[] = [
  { id: 'persona-a', name: 'Elena Rostova', initials: 'ER', role: 'Frontend Eng.', dotColor: '#059669' },
  { id: 'persona-b', name: 'Marcus Vance', initials: 'MV', role: 'Data Analyst',  dotColor: '#0284C7' },
  { id: 'persona-c', name: 'Devin Chen',   initials: 'DC', role: 'ML Engineer',   dotColor: '#D97706' },
];

const QUICK_PRESETS = [
  {
    name: 'Jordan Miller',
    targetRole: 'full-stack-engineer',
    experienceLevel: 'Senior (5-8 yrs)',
    bio: 'Lead Full-Stack developer specializing in React, Node microservices, and distributed PostgreSQL clusters.',
    githubUrl: 'https://github.com/jmiller-dev/enterprise-stack',
    resumeText: '5+ years architecture experience. Built distributed GraphQL federation layer handling 12,000 req/sec.'
  },
  {
    name: 'Priya Sharma',
    targetRole: 'ml-engineer',
    experienceLevel: 'Staff (7+ yrs)',
    bio: 'ML Systems Researcher focused on LLM quantisation, TensorRT-LLM inference latency, and high-throughput vector indexes.',
    githubUrl: 'https://github.com/priyasharma/vllm-speed-optim',
    resumeText: 'Staff ML Engineer with 3 published papers on low-bit weight quantization and distributed GPU pipeline parallelism.'
  },
  {
    name: 'Alex Rivers',
    targetRole: 'cloud-devops',
    experienceLevel: 'Mid-Senior (4 yrs)',
    bio: 'Site Reliability & Cloud Infrastructure specialist managing Kubernetes GitOps pipelines and multi-region AWS architectures.',
    githubUrl: 'https://github.com/arivers-ops/k8s-gitops-infra',
    resumeText: 'DevOps engineer with certified CKA, AWS SA Pro. Reduced incident MTTR by 64% through automated chaos testing.'
  }
];

export const Header: React.FC = () => {
  const {
    activePersonaId,
    resetToPersona,
    customCandidateProfile,
    switchToCustomCandidate,
    evaluatorCandidates,
    addEvaluatorCandidate,
    candidateUser,
    logoutCandidate,
    userProfile,
    activeScreen,
    setActiveScreen,
    selectedRoleMatch,
    isTransitioning,
    transitionPhase,
    transitionPhaseLabel,
    appMode,
    setAppMode,
  } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [candidateForm, setCandidateForm] = useState({
    name: '',
    targetRole: 'frontend-engineer',
    experienceLevel: 'Senior (4-7 yrs)',
    bio: '',
    githubUrl: '',
    resumeText: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedResumeFile, setUploadedResumeFile] = useState<{ name: string; size: string } | null>(null);
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState<CandidateSubmissionAnalysis | null>(null);


  const activeSubjectMeta = (() => {
    // 1. Check evaluator added candidates
    const evalCandidate = evaluatorCandidates.find(c => c.id === activePersonaId);
    if (evalCandidate) {
      const initials = evalCandidate.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CA';
      return {
        name: evalCandidate.name,
        initials,
        role: evalCandidate.targetRoleId ? CAREER_ROLES.find(r => r.id === evalCandidate.targetRoleId)?.title || evalCandidate.targetRoleId : 'Audition Candidate',
        dotColor: '#8B5CF6'
      };
    }

    // 2. Check custom candidate
    if (userProfile.isCustomCandidate || activePersonaId === 'custom-candidate') {
      const initials = userProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CU';
      return {
        name: userProfile.name,
        initials,
        role: userProfile.targetRoleId ? CAREER_ROLES.find(r => r.id === userProfile.targetRoleId)?.title || userProfile.targetRoleId : 'Candidate Subject',
        dotColor: '#FF4F00'
      };
    }

    // 3. Check seed personas
    const seed = PERSONAS.find(p => p.id === activePersonaId);
    if (seed) return seed;

    return PERSONAS[0];
  })();

  const handlePresetSelect = (preset: typeof QUICK_PRESETS[0]) => {
    setCandidateForm({
      name: preset.name,
      targetRole: preset.targetRole,
      experienceLevel: preset.experienceLevel,
      bio: preset.bio,
      githubUrl: preset.githubUrl,
      resumeText: preset.resumeText,
    });
    setUploadedResumeFile(null);
    setResumeAnalysis(null);
  };

  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    setUploadedResumeFile({ name: file.name, size: fileSizeStr });
    setIsAnalyzingResume(true);

    try {
      const cleanText = await extractTextFromDocument(file);
      const textExcerpt = cleanText.slice(0, 15000).trim();

      setCandidateForm(prev => ({
        ...prev,
        resumeText: textExcerpt || `[Attached Resume: ${file.name} (${fileSizeStr})]`
      }));

      const analysis = await analyzeCandidateSubmissionWithGroq(
        textExcerpt || file.name,
        'resume',
        file.name
      );
      setResumeAnalysis(analysis);
    } catch (err) {
      console.error('Groq resume document analysis failed:', err);
      setCandidateForm(prev => ({
        ...prev,
        resumeText: prev.resumeText || `[Attached Resume: ${file.name} (${fileSizeStr})]`
      }));
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  const handleClearResume = () => {
    setUploadedResumeFile(null);
    setResumeAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddCandidate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!candidateForm.name.trim()) return;

    addEvaluatorCandidate({
      name: candidateForm.name.trim(),
      targetRole: candidateForm.targetRole,
      experienceLevel: candidateForm.experienceLevel,
      bio: candidateForm.bio.trim(),
      githubUrl: candidateForm.githubUrl.trim(),
      resumeText: candidateForm.resumeText.trim(),
      detectedSkills: resumeAnalysis?.detectedSkills,
      aiEfficiencyScore: resumeAnalysis?.efficiencyScore,
    });

    setIsAddModalOpen(false);
    setUploadedResumeFile(null);
    setResumeAnalysis(null);
    setAppMode('evaluator');
    if (activeScreen === 'candidate_portal') {
      setActiveScreen('landing');
    }
  };

  return (
    <header className="instrument-header" style={{ position: 'sticky', top: 0, zIndex: 50 }}>

      {/* ── Layer 2: Identity Plate + Persona Instrument ──── */}
      <div
        className="flex items-center justify-between px-4 sm:px-8 lg:px-12 h-[56px]"
        style={{ borderBottom: '1px solid var(--border-0)', background: 'var(--paper-0)' }}
      >
        {/* Brand Mark */}
        <button
          onClick={() => setActiveScreen('landing')}
          className="flex items-center gap-3 group text-left"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
            <BrandLogo className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontFamily: 'var(--font-editorial)',
                  fontWeight: 800,
                  fontSize: '15px',
                  color: 'var(--ink-1)',
                  letterSpacing: '-0.025em',
                }}
              >
                CAREER BUDDY
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#6E7A8A] tracking-wider leading-none mt-0.5">
              Evidence-Aware Career Intelligence
            </div>
          </div>
        </button>

        {/* ── Subject / Candidate Scope Indicator ────────────────── */}
        {appMode === 'evaluator' ? (
          <div className="hidden md:flex items-center gap-1.5">
            <span
              className="text-[9px] font-mono font-black uppercase tracking-widest mr-2 flex items-center gap-1"
              style={{ color: 'var(--ink-5)' }}
            >
              SUBJECT
              <ChevronRight className="w-3 h-3" />
            </span>

            {/* Registered Custom Candidate if present */}
            {(customCandidateProfile || userProfile.isCustomCandidate) && (
              <button
                onClick={switchToCustomCandidate}
                disabled={isTransitioning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all duration-300 relative"
                style={{
                  background: userProfile.isCustomCandidate ? '#FF4F00' : 'var(--paper-1)',
                  color: userProfile.isCustomCandidate ? 'white' : 'var(--ink-2)',
                  border: userProfile.isCustomCandidate ? '1.5px solid #FF4F00' : '1.5px solid var(--border-0)',
                  boxShadow: userProfile.isCustomCandidate ? '0 2px 10px rgba(255,79,0,0.25)' : 'none',
                }}
                title="Switch to your registered custom candidate dossier"
              >
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black bg-white/20 text-white">
                  ★
                </span>
                <span className="hidden lg:inline">{userProfile.name.split(' ')[0]}</span>
                <span className="text-[8px] font-mono font-black px-1 py-px rounded bg-black/10">
                  YOU
                </span>
              </button>
            )}

            {PERSONAS.map((p, i) => {
              const isActive = !userProfile.isCustomCandidate && activePersonaId === p.id;
              const idx = String(i + 1).padStart(2, '0');
              return (
                <button
                  key={p.id}
                  onClick={() => resetToPersona(p.id)}
                  disabled={isTransitioning}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all duration-300 relative overflow-hidden"
                  style={{
                    background: isActive ? p.dotColor : 'var(--paper-1)',
                    color: isActive ? 'white' : 'var(--ink-3)',
                    border: isActive ? `1.5px solid ${p.dotColor}` : '1.5px solid var(--border-0)',
                    boxShadow: isActive ? `0 2px 12px ${p.dotColor}30` : 'none',
                    opacity: isTransitioning && !isActive ? 0.5 : 1,
                    cursor: isTransitioning ? 'wait' : 'pointer',
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black shrink-0"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.25)' : `${p.dotColor}18`,
                      color: isActive ? 'white' : p.dotColor,
                    }}
                  >
                    {p.initials}
                  </span>
                  <span className="hidden lg:inline">{p.name.split(' ')[0]}</span>
                  <span
                    className="text-[8px] font-mono font-black px-1 py-px rounded"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    {idx}
                  </span>
                </button>
              );
            })}

            {/* Evaluator-Added Candidates */}
            {evaluatorCandidates.map((c, i) => {
              const isActive = activePersonaId === c.id;
              const idx = String(PERSONAS.length + i + 1).padStart(2, '0');
              const initials = c.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CA';
              const color = i % 2 === 0 ? '#8B5CF6' : '#EC4899';
              return (
                <button
                  key={c.id}
                  onClick={() => resetToPersona(c.id)}
                  disabled={isTransitioning}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all duration-300 relative overflow-hidden"
                  style={{
                    background: isActive ? color : 'var(--paper-1)',
                    color: isActive ? 'white' : 'var(--ink-3)',
                    border: isActive ? `1.5px solid ${color}` : '1.5px solid var(--border-0)',
                    boxShadow: isActive ? `0 2px 12px ${color}30` : 'none',
                    opacity: isTransitioning && !isActive ? 0.5 : 1,
                    cursor: isTransitioning ? 'wait' : 'pointer',
                  }}
                  title={`Audition candidate: ${c.name} (${c.targetRoleId || 'Role'})`}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black shrink-0"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.25)' : `${color}18`,
                      color: isActive ? 'white' : color,
                    }}
                  >
                    {initials}
                  </span>
                  <span className="hidden lg:inline">{c.name.split(' ')[0]}</span>
                  <span
                    className="text-[8px] font-mono font-black px-1 py-px rounded"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    {idx}
                  </span>
                </button>
              );
            })}

            {/* Evaluator: + Add Candidate Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold border border-dashed border-[#D4D4D8] hover:border-[#FF4F00] hover:text-[#FF4F00] hover:bg-[#FFF5F0] text-[#71717A] transition-all duration-200 cursor-pointer"
              title="Enroll any candidate or applicant for forensic evaluation"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#FF4F00]" />
              <span className="hidden xl:inline">+ Candidate</span>
            </button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FFF1EB] border border-[#FFCDB5] text-[11px] font-mono font-bold text-[#FF4F00]">
              <UserCheck className="w-3.5 h-3.5" />
              <span>CANDIDATE WORKSPACE</span>
              {candidateUser ? (
                <>
                  <span className="text-black/30">·</span>
                  <span className="text-[#18181B] font-medium">{candidateUser.name}</span>
                </>
              ) : (
                <>
                  <span className="text-black/30">·</span>
                  <span className="text-[#71717A] font-medium font-mono text-[10px]">SIGN-IN REQUIRED</span>
                </>
              )}
            </div>
            {candidateUser && (
              <button
                onClick={logoutCandidate}
                className="px-2.5 py-1 text-[10px] font-mono font-bold text-[#71717A] hover:text-[#DC2626] bg-white border border-[#E7E2D6] hover:border-[#FCA5A5] rounded-lg transition cursor-pointer"
                title="Sign out of candidate workspace"
              >
                Sign Out
              </button>
            )}
          </div>
        )}

        {/* ── Mode Switcher: Bidirectional Evaluator <-> Candidate Toggle ─────── */}
        <div className="flex items-center p-1 bg-[#FAF9F5] border border-[#E7E2D6] rounded-xl font-mono text-[10px] shadow-xs">
          {appMode === 'evaluator' ? (
            <>
              <button
                onClick={() => {
                  setAppMode('candidate');
                  setActiveScreen('candidate_portal');
                }}
                className="px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition text-[#52525B] hover:text-[#18181B] hover:bg-white/80 cursor-pointer"
                title="Switch to Candidate Workspace to submit credentials and take validation tests"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span className="hidden sm:inline">CANDIDATE VIEW</span>
                <span className="inline sm:hidden">CAND</span>
              </button>
              <div className="px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 bg-[#18181B] text-white shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">EVALUATOR</span>
                <span className="inline sm:hidden">EVAL</span>
              </div>
            </>
          ) : (
            <>
              <div className="px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 bg-[#FF5A1F] text-white shadow-xs">
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CANDIDATE</span>
                <span className="inline sm:hidden">CAND</span>
              </div>
              <button
                onClick={() => {
                  setAppMode('evaluator');
                  setActiveScreen('landing');
                }}
                className="px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition text-[#52525B] hover:text-[#18181B] hover:bg-white/80 cursor-pointer"
                title="Switch back to Evaluator view for deterministic audits, DAG roadmaps, and scoring traces"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#18181B]" />
                <span className="hidden sm:inline">EVALUATOR VIEW</span>
                <span className="inline sm:hidden">EVAL</span>
              </button>
            </>
          )}
        </div>

        {/* ── Active Profile Plate: Tailored for Candidate vs Evaluator ─────── */}
        <div className="flex items-center gap-3">
          {isTransitioning && (
            <div
              className="flex items-center gap-1.5 text-[9px] font-mono font-black uppercase tracking-widest animate-pulse px-2 py-1 rounded"
              style={{ background: 'var(--flame-bg)', color: 'var(--flame-dark)', border: '1px solid var(--flame-border)' }}
            >
              <span className="live-dot inline-block w-1.5 h-1.5" />
              {transitionPhaseLabel}
            </div>
          )}

          {!isTransitioning && appMode === 'candidate' && candidateUser && (
            <>
              <div className="hidden sm:block text-right">
                <div
                  className="text-[11px] font-bold leading-none"
                  style={{ fontFamily: 'var(--font-editorial)', color: 'var(--ink-1)' }}
                >
                  {candidateUser.name}
                </div>
                <div className="text-[9px] font-mono mt-0.5 flex items-center gap-1 justify-end" style={{ color: 'var(--ink-5)' }}>
                  <span style={{ color: selectedRoleMatch.overallScore >= 75 ? 'var(--emerald)' : 'var(--amber)' }}>
                    {selectedRoleMatch.overallScore}%
                  </span>
                  <span>·</span>
                  <span>{selectedRoleMatch.role.title}</span>
                </div>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono font-black shadow-sm"
                style={{
                  background: '#FF4F00',
                  color: 'white',
                  boxShadow: `0 0 0 2px var(--paper-0), 0 0 0 3px #FF4F00`,
                }}
              >
                {candidateUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CA'}
              </div>
            </>
          )}

          {!isTransitioning && appMode === 'evaluator' && (
            <>
              <div className="hidden sm:block text-right">
                <div
                  className="text-[11px] font-bold leading-none"
                  style={{ fontFamily: 'var(--font-editorial)', color: 'var(--ink-1)' }}
                >
                  {activeSubjectMeta.name}
                </div>
                <div className="text-[9px] font-mono mt-0.5 flex items-center gap-1 justify-end" style={{ color: 'var(--ink-5)' }}>
                  <span style={{ color: selectedRoleMatch.overallScore >= 75 ? 'var(--emerald)' : 'var(--amber)' }}>
                    {selectedRoleMatch.overallScore}%
                  </span>
                  <span>·</span>
                  <span>{activeSubjectMeta.role}</span>
                </div>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono font-black shadow-sm transition-all duration-300"
                style={{
                  background: activeSubjectMeta.dotColor,
                  color: 'white',
                  boxShadow: `0 0 0 2px var(--paper-0), 0 0 0 3px ${activeSubjectMeta.dotColor}`,
                  transform: isTransitioning ? 'scale(0.9)' : 'scale(1)',
                  opacity: transitionPhase === 'clearing' ? 0.4 : 1,
                }}
              >
                {activeSubjectMeta.initials}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Evaluator Add Candidate Modal (Portaled to document.body) ─────────────────── */}
      {isAddModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false);
          }}
        >
          <div 
            className="bg-[#FDFCFB] border border-[#E7E2D6] rounded-2xl shadow-2xl max-w-xl w-full p-6 my-auto animate-in zoom-in-95 duration-150"
            style={{ boxShadow: '0 25px 60px -15px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.08)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E7E2D6]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-[#FFF1EB] text-[#FF4F00] border border-[#FFCDB5]">
                    EVALUATOR INSTRUMENT
                  </span>
                  <span className="text-[9px] font-mono text-[#71717A]">
                    SUBJECT ENROLLMENT
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#18181B] tracking-tight">
                  Enroll Candidate for Forensic Evaluation
                </h3>
                <p className="text-xs text-[#52525B] mt-1 leading-relaxed">
                  Add any applicant into the deterministic 6-factor scoring engine to audit their skill graph, DAG dependencies, and evidence tiers.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-[#71717A] hover:text-[#18181B] hover:bg-[#EAE5D9] rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="my-4 p-3 bg-[#FAF9F5] border border-[#E7E2D6] rounded-xl">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#71717A] mb-2 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4F00]" />
                <span>1-Click Candidate Presets</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {QUICK_PRESETS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handlePresetSelect(p)}
                    className="p-2 text-left bg-white border border-[#E7E2D6] rounded-lg hover:border-[#FF4F00] hover:bg-[#FFFDFB] transition group cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-[#18181B] group-hover:text-[#FF4F00] flex items-center justify-between">
                      <span>{p.name}</span>
                      <span className="text-[9px] font-mono text-[#71717A]">{p.experienceLevel.split(' ')[0]}</span>
                    </div>
                    <div className="text-[9px] font-mono text-[#71717A] mt-0.5 truncate">
                      {p.targetRole.replace('-', ' ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleAddCandidate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-[#18181B] mb-1">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateForm.name}
                    onChange={(e) => setCandidateForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Jordan Miller"
                    className="w-full px-3 py-2 bg-white border border-[#E7E2D6] rounded-lg text-xs font-medium text-[#18181B] focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-[#18181B] mb-1 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-[#71717A]" />
                    Target Role Alignment
                  </label>
                  <select
                    value={candidateForm.targetRole}
                    onChange={(e) => setCandidateForm(prev => ({ ...prev, targetRole: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-[#E7E2D6] rounded-lg text-xs font-medium text-[#18181B] focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00] outline-hidden"
                  >
                    {CAREER_ROLES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-[#18181B] mb-1 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#71717A]" />
                    Experience Level
                  </label>
                  <select
                    value={candidateForm.experienceLevel}
                    onChange={(e) => setCandidateForm(prev => ({ ...prev, experienceLevel: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-[#E7E2D6] rounded-lg text-xs font-medium text-[#18181B] focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00] outline-hidden"
                  >
                    <option value="Junior (1-2 yrs)">Junior (1-2 yrs)</option>
                    <option value="Mid-Level (2-4 yrs)">Mid-Level (2-4 yrs)</option>
                    <option value="Senior (4-7 yrs)">Senior (4-7 yrs)</option>
                    <option value="Staff / Principal (7+ yrs)">Staff / Principal (7+ yrs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-[#18181B] mb-1 flex items-center gap-1">
                    <GitFork className="w-3 h-3 text-[#71717A]" />
                    GitHub Repo / Profile (Optional)
                  </label>
                  <input
                    type="url"
                    value={candidateForm.githubUrl}
                    onChange={(e) => setCandidateForm(prev => ({ ...prev, githubUrl: e.target.value }))}
                    placeholder="https://github.com/username/project"
                    className="w-full px-3 py-2 bg-white border border-[#E7E2D6] rounded-lg text-xs font-medium text-[#18181B] focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-[#18181B] mb-1">
                  Candidate Bio / Professional Summary
                </label>
                <input
                  type="text"
                  value={candidateForm.bio}
                  onChange={(e) => setCandidateForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="e.g. Systems architect with 5 years background in distributed streaming systems..."
                  className="w-full px-3 py-2 bg-white border border-[#E7E2D6] rounded-lg text-xs font-medium text-[#18181B] focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00] outline-hidden"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono font-bold text-[#18181B] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#FF4F00]" />
                    Resume / Technical Evidence Excerpt (Optional)
                  </label>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleResumeFileUpload}
                      accept=".pdf,.docx,.doc,.txt,.md,.json"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isAnalyzingResume}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold text-[#FF4F00] bg-[#FFF1EB] hover:bg-[#FFE5DA] border border-[#FFCDB5] rounded-md transition cursor-pointer disabled:opacity-50"
                    >
                      {isAnalyzingResume ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin text-[#FF4F00]" />
                          <span>Analyzing with Groq AI...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3 h-3 text-[#FF4F00]" />
                          <span>Upload Resume Doc</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Uploaded File Banner & AI Analysis Feedback */}
                {uploadedResumeFile && (
                  <div className="p-2.5 bg-[#FAF9F5] border border-[#E7E2D6] rounded-lg flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]">
                          <FileCheck className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-mono font-bold text-[#18181B] leading-tight">
                            {uploadedResumeFile.name}
                          </div>
                          <div className="text-[9px] font-mono text-[#71717A]">
                            {uploadedResumeFile.size} · Parsed for Forensic AI Audit
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearResume}
                        className="text-[#71717A] hover:text-[#DC2626] p-1 rounded hover:bg-white transition cursor-pointer"
                        title="Remove file"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Groq AI Analysis Live Pill */}
                    {isAnalyzingResume && (
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[#FF4F00] bg-white p-2 rounded border border-[#FFCDB5]">
                        <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                        <span>Groq LPU extracting competencies, work metrics & efficiency score...</span>
                      </div>
                    )}

                    {resumeAnalysis && !isAnalyzingResume && (
                      <div className="bg-white p-2.5 rounded border border-[#E7E2D6] space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#059669]">
                            <Sparkles className="w-3 h-3 text-[#FF4F00]" />
                            <span>AI Signal Efficiency: {resumeAnalysis.efficiencyScore}%</span>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FAF9F5] border border-[#E7E2D6] text-[#71717A]">
                            Tier: {resumeAnalysis.credibilityTier}
                          </span>
                        </div>
                        {resumeAnalysis.detectedSkills && resumeAnalysis.detectedSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {resumeAnalysis.detectedSkills.map((sk, idx) => (
                              <span
                                key={idx}
                                className="text-[9px] font-mono font-medium px-1.5 py-0.5 bg-[#FFF1EB] text-[#C2410C] border border-[#FFCDB5] rounded"
                              >
                                +{sk.skillName} ({sk.confidence}%)
                              </span>
                            ))}
                          </div>
                        )}
                        {resumeAnalysis.executiveSummary && (
                          <p className="text-[10px] font-sans text-[#52525B] leading-relaxed italic">
                            "{resumeAnalysis.executiveSummary}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <textarea
                  rows={2}
                  value={candidateForm.resumeText}
                  onChange={(e) => setCandidateForm(prev => ({ ...prev, resumeText: e.target.value }))}
                  placeholder="Paste work experience bullets, key skills, or architecture impact for semantic extraction..."
                  className="w-full px-3 py-2 bg-white border border-[#E7E2D6] rounded-lg text-xs font-medium text-[#18181B] focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00] outline-hidden resize-none font-mono"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E7E2D6] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono font-bold text-[#52525B] hover:text-[#18181B] bg-[#FAF9F5] border border-[#E7E2D6] rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!candidateForm.name.trim()}
                  className="px-5 py-2 text-xs font-mono font-bold bg-[#18181B] hover:bg-black text-white rounded-lg shadow-sm hover:shadow-md transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#FF4F00]" />
                  <span>Enroll & Calibrate Instrument</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
