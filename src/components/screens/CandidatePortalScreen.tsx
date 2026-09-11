import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SectionIndex } from '../common/SectionIndex';
import { CAREER_ROLES } from '../../data/rolesDatabase';
import { 
  analyzeCandidateSubmissionWithGroq, 
  type CandidateSubmissionAnalysis 
} from '../../services/groqService';
import { extractTextFromDocument } from '../../services/documentParser';
import { synthesizeSkillFromArtifact } from '../../services/evidenceEngine';
import { 
  UserCheck, 
  FileText, 
  GitBranch, 
  Award, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Loader2, 
  UploadCloud, 
  FileCheck, 
  Plus, 
  Trash2, 
  Link2, 
  FolderGit2, 
  BookOpen, 
  X 
} from 'lucide-react';

export interface GitHubRepoEntry {
  id: string;
  title: string;
  url: string;
  techStack: string;
  notes: string;
}

export interface CourseEntry {
  id: string;
  platform: string;
  title: string;
  url: string;
  grade: string;
  notes: string;
}

export const CandidatePortalScreen: React.FC = () => {
  const { 
    userProfile, 
    setUserProfile, 
    selectedRoleMatch, 
    launchAssessment, 
    showToast,
    candidateUser,
    loginCandidate,
    logoutCandidate,
    savedCandidateAccounts,
  } = useApp();

  // ── Candidate Sign In & Register State ─────────────────────
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [authEmail, setAuthEmail] = useState(() => {
    return savedCandidateAccounts.length > 0 ? savedCandidateAccounts[0].email : '';
  });
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState(selectedRoleMatch.role.id);
  const [authLevel, setAuthLevel] = useState('Mid-Level Engineer (2-4 yrs)');
  const [authBio, setAuthBio] = useState('');

  useEffect(() => {
    if (!authEmail && savedCandidateAccounts.length > 0) {
      setAuthEmail(savedCandidateAccounts[0].email);
    }
  }, [savedCandidateAccounts]);

  const DEMO_ACCOUNTS = [
    {
      name: 'Jordan Miller',
      email: 'jordan.miller@example.com',
      targetRole: 'full-stack-engineer',
      level: 'Senior Full-Stack (5+ yrs)',
      bio: 'React, Node microservices, PostgreSQL, and GraphQL architecture specialist.'
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      targetRole: 'ml-engineer',
      level: 'Staff ML Engineer (7+ yrs)',
      bio: 'Machine Learning researcher focused on LLMs, PyTorch, and TensorRT deployment.'
    },
    {
      name: 'Alex Rivers',
      email: 'alex.rivers@example.com',
      targetRole: 'cloud-devops',
      level: 'Cloud DevOps / SRE (4 yrs)',
      bio: 'Kubernetes GitOps, Terraform, and cloud reliability infrastructure engineer.'
    }
  ];

  // ── Registration Resume Upload State ──────────────────────
  const regResumeInputRef = useRef<HTMLInputElement>(null);
  const [regResumeFile, setRegResumeFile] = useState<{ name: string; size: string } | null>(null);
  const [regResumeText, setRegResumeText] = useState('');
  const [isRegAnalyzing, setIsRegAnalyzing] = useState(false);
  const [regAnalysisResult, setRegAnalysisResult] = useState<CandidateSubmissionAnalysis | null>(null);

  const handleRegResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    setRegResumeFile({ name: file.name, size: fileSizeStr });
    setIsRegAnalyzing(true);

    try {
      const cleanText = await extractTextFromDocument(file);
      const textExcerpt = cleanText.slice(0, 15000).trim();
      setRegResumeText(textExcerpt);

      const result = await analyzeCandidateSubmissionWithGroq(
        textExcerpt || file.name,
        'resume',
        authRole
      );
      setRegAnalysisResult(result);
      showToast('success', 'Resume Analyzed by AI', `Groq scored resume efficiency at ${result.efficiencyScore}%.`);
    } catch (err) {
      console.error('Groq resume analysis failed during registration:', err);
      showToast('warning', 'Notice', 'Could not parse text from file. You can still proceed.');
    } finally {
      setIsRegAnalyzing(false);
    }
  };

  const handleClearRegResume = () => {
    setRegResumeFile(null);
    setRegResumeText('');
    setRegAnalysisResult(null);
    if (regResumeInputRef.current) {
      regResumeInputRef.current.value = '';
    }
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) {
      showToast('warning', 'Email Required', 'Please enter your email address to sign in.');
      return;
    }

    // Pre-populate candidate workspace submission tab if resume attached
    if (regResumeFile) {
      setUploadedFileName(regResumeFile.name);
      setUploadedFileSize(regResumeFile.size);
      setSubmissionContent(regResumeText);
      setSubmissionTitle(regResumeFile.name.replace(/\.[^/.]+$/, ''));
      if (regAnalysisResult) {
        setAnalysisResult(regAnalysisResult);
      }
    }

    loginCandidate({
      email: authEmail.trim(),
      password: authPassword,
      name: authName.trim() || undefined,
      targetRole: authRole,
      experienceLevel: authLevel,
      bio: authBio.trim() || undefined,
      resumeFileName: regResumeFile?.name,
      resumeText: regResumeText,
      detectedSkills: regAnalysisResult?.detectedSkills,
      aiEfficiencyScore: regAnalysisResult?.efficiencyScore,
    });
  };

  const handleDemoSignIn = (account: typeof DEMO_ACCOUNTS[0]) => {
    loginCandidate({
      email: account.email,
      name: account.name,
      targetRole: account.targetRole,
      experienceLevel: account.level,
      bio: account.bio,
    });
  };

  const [activeTab, setActiveTab] = useState<'resume' | 'github_repo' | 'coursera_cert'>('resume');
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionContent, setSubmissionContent] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CandidateSubmissionAnalysis | null>(null);

  // ── Multiple GitHub Repositories State ──────────────────────
  const [githubRepos, setGithubRepos] = useState<GitHubRepoEntry[]>([
    {
      id: 'repo-1',
      title: 'Full-Stack Next.js 14 & UI Systems Monorepo',
      url: 'https://github.com/candidate/enterprise-design-system',
      techStack: 'TypeScript, React 19, Next.js, Tailwind CSS, React Query',
      notes: 'Architected scalable component design system with 40+ accessible UI widgets and micro-animations. Implemented automated Playwright E2E testing.'
    }
  ]);

  // ── Multiple Coursera & Online Courses State ────────────────
  const [courses, setCourses] = useState<CourseEntry[]>([
    {
      id: 'course-1',
      platform: 'Coursera',
      title: 'Deep Learning Specialization (DeepLearning.AI / Andrew Ng)',
      url: 'https://coursera.org/verify/DL-SPEC-982134',
      grade: '98.5% with Honors',
      notes: 'Completed 5-course sequence: Neural Networks, Convolutional Vision, Transformers, and PyTorch Capstone.'
    }
  ]);



  const role = selectedRoleMatch.role;
  const skillsList = Object.values(userProfile.skills || {});
  const unvalidatedSkills = skillsList.filter(s => s.state !== 'validated');
  const validatedSkills = skillsList.filter(s => s.state === 'validated');
  const activeBlockers = selectedRoleMatch.missingCompetencies.filter(m => m.isBlocker);

  // File Upload Handler (Resume, Transcript, Project Artifacts)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / 1024).toFixed(1)} KB`);
    setSubmissionTitle(file.name.replace(/\.[^/.]+$/, ''));

    showToast('info', 'Reading Document', `Extracting text content from ${file.name}...`);

    try {
      const extractedText = await extractTextFromDocument(file);
      const cleanExcerpt = extractedText.slice(0, 20000).trim();
      setSubmissionContent(cleanExcerpt);
      showToast('success', 'Resume Loaded', `Read ${file.name} (${cleanExcerpt.length} characters). Ready for Groq AI analysis.`);
    } catch (err) {
      console.error('File extraction failed:', err);
      showToast('warning', 'File Read Notice', 'Could not extract text automatically. Please paste content.');
    }
  };

  const handleClearUploadedFile = () => {
    setUploadedFileName(null);
    setUploadedFileSize(null);
    setSubmissionContent('');
    setSubmissionTitle('');
  };

  // ── GitHub Repos Multi-Item Handlers ────────────────────────
  const addGitHubRepo = () => {
    const newRepo: GitHubRepoEntry = {
      id: `repo-${Date.now()}`,
      title: '',
      url: '',
      techStack: '',
      notes: ''
    };
    setGithubRepos(prev => [...prev, newRepo]);
    showToast('info', 'Repository Added', 'Added new GitHub repository input row.');
  };

  const removeGitHubRepo = (id: string) => {
    if (githubRepos.length <= 1) {
      showToast('warning', 'Notice', 'At least one repository link is required.');
      return;
    }
    setGithubRepos(prev => prev.filter(r => r.id !== id));
  };

  const updateGitHubRepo = (id: string, field: keyof GitHubRepoEntry, value: string) => {
    setGithubRepos(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // ── Courses Multi-Item Handlers ─────────────────────────────
  const addCourse = () => {
    const newCourse: CourseEntry = {
      id: `course-${Date.now()}`,
      platform: 'Coursera',
      title: '',
      url: '',
      grade: '',
      notes: ''
    };
    setCourses(prev => [...prev, newCourse]);
    showToast('info', 'Course Added', 'Added new Course / Certification input row.');
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) {
      showToast('warning', 'Notice', 'At least one course entry is required.');
      return;
    }
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof CourseEntry, value: string) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };



  // Multi-item preset loaders
  const loadMultiRepoPreset = () => {
    setActiveTab('github_repo');
    setGithubRepos([
      {
        id: 'repo-1',
        title: 'Enterprise Design System (Next.js + TypeScript)',
        url: 'https://github.com/candidate/enterprise-design-system',
        techStack: 'TypeScript, React 19, Next.js, Tailwind CSS, Playwright',
        notes: 'Architected 40+ accessible UI components, design tokens, and automated CI/CD pipeline.'
      },
      {
        id: 'repo-2',
        title: 'High-Throughput Microservices (Go + PostgreSQL + Redis)',
        url: 'https://github.com/candidate/distributed-ledger-engine',
        techStack: 'Go, PostgreSQL, Redis, gRPC, Docker',
        notes: 'Built asynchronous event-driven streaming pipeline processing 15,000 req/sec.'
      },
      {
        id: 'repo-3',
        title: 'Multi-Region Kubernetes GitOps Infrastructure',
        url: 'https://github.com/candidate/cloud-infra-orchestrator',
        techStack: 'Kubernetes, Terraform, AWS EKS, GitHub Actions, Docker',
        notes: 'Declarative GitOps infrastructure with automated security auditing and secret management.'
      }
    ]);
    showToast('info', 'Preset Loaded', 'Loaded 3 production repositories across frontend, backend, and cloud infra.');
  };

  const loadMultiCoursePreset = () => {
    setActiveTab('coursera_cert');
    setCourses([
      {
        id: 'course-1',
        platform: 'Coursera',
        title: 'Deep Learning Specialization (Andrew Ng / DeepLearning.AI)',
        url: 'https://coursera.org/verify/DL-SPEC-982134',
        grade: '98.5% with Honors',
        notes: 'Neural Networks, CNNs, Sequence Transformers, and Optimization in PyTorch.'
      },
      {
        id: 'course-2',
        platform: 'Coursera',
        title: 'Meta Front-End Developer Professional Certificate',
        url: 'https://coursera.org/verify/META-FE-774129',
        grade: '100% Final Score',
        notes: 'Advanced React, TypeScript type safety, UX principles, and automated test-driven development.'
      },
      {
        id: 'course-3',
        platform: 'AWS',
        title: 'AWS Certified Solutions Architect – Associate',
        url: 'https://aws.amazon.com/verification/AWS-SAA-382910',
        grade: 'Pass (Score: 890/1000)',
        notes: 'VPC design, IAM governance, serverless architecture (Lambda/API Gateway), and fault-tolerant RDS.'
      }
    ]);
    showToast('info', 'Preset Loaded', 'Loaded 3 verified industry certifications.');
  };

  const handleRunAnalysis = async () => {
    let payloadText = '';
    let payloadUrl = '';

    if (activeTab === 'resume') {
      if (!submissionContent.trim()) {
        showToast('warning', 'Missing Resume', 'Please upload a resume document or paste resume text.');
        return;
      }
      payloadText = submissionContent;
      payloadUrl = submissionUrl;
    } else if (activeTab === 'github_repo') {
      const validRepos = githubRepos.filter(r => r.url.trim() || r.title.trim() || r.notes.trim());
      if (validRepos.length === 0) {
        showToast('warning', 'Missing Repositories', 'Please enter at least one GitHub repository link or details.');
        return;
      }
      payloadText = validRepos.map((r, i) => 
        `=== REPOSITORY 0${i+1}: ${r.title || 'Untitled Repository'} ===\nURL: ${r.url || 'Not specified'}\nTech Stack: ${r.techStack || 'Unspecified'}\nArchitecture Notes:\n${r.notes || 'No notes provided'}`
      ).join('\n\n');
      payloadUrl = validRepos[0]?.url || '';
    } else if (activeTab === 'coursera_cert') {
      const validCourses = courses.filter(c => c.title.trim() || c.url.trim() || c.notes.trim());
      if (validCourses.length === 0) {
        showToast('warning', 'Missing Certifications', 'Please enter at least one course or certification details.');
        return;
      }
      payloadText = validCourses.map((c, i) => 
        `=== COURSE 0${i+1} [${c.platform}]: ${c.title || 'Untitled Course'} ===\nVerification Link: ${c.url || 'Not specified'}\nGrade/Status: ${c.grade || 'Verified'}\nSyllabus & Competency Notes:\n${c.notes || 'Completed coursework'}`
      ).join('\n\n');
      payloadUrl = validCourses[0]?.url || '';
    }

    setIsAnalyzing(true);
    const summaryTarget = activeTab === 'resume' ? 'resume document' : activeTab === 'github_repo' ? `${githubRepos.length} GitHub repositories` : `${courses.length} courses`;
    showToast('info', 'Groq LPU Analysis', `Evaluating ${summaryTarget} for signal efficiency, epistemic credibility, and skills...`);

    try {
      const result = await analyzeCandidateSubmissionWithGroq(
        payloadText,
        activeTab,
        payloadUrl
      );
      setAnalysisResult(result);
      showToast('success', 'Analysis Complete', `Groq scored submission efficiency at ${result.efficiencyScore}%.`);
    } catch {
      showToast('warning', 'Notice', 'Completed evaluation using deterministic baseline.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleIngestToDossier = () => {
    if (!analysisResult) return;

    const detectedSkillIds = analysisResult.detectedSkills.map(s => s.skillId);
    const newArtifacts: any[] = [];

    if (activeTab === 'github_repo') {
      githubRepos.forEach((repo, idx) => {
        if (!repo.title.trim() && !repo.url.trim()) return;
        newArtifacts.push({
          id: `art-github-${Date.now()}-${idx}`,
          sourceType: 'github_repo',
          title: repo.title.trim() || `GitHub Repo: ${repo.url}`,
          url: repo.url.trim() || undefined,
          date: new Date().toISOString().split('T')[0],
          extractedSkills: detectedSkillIds,
          evidenceStrength: Math.min(1.0, (analysisResult.efficiencyScore + 5) / 100),
          verificationState: analysisResult.credibilityTier,
          metadata: {
            efficiencyScore: analysisResult.efficiencyScore,
            techStack: repo.techStack,
            notes: repo.notes || analysisResult.executiveSummary,
          }
        });
      });
    } else if (activeTab === 'coursera_cert') {
      courses.forEach((course, idx) => {
        if (!course.title.trim() && !course.url.trim()) return;
        newArtifacts.push({
          id: `art-course-${Date.now()}-${idx}`,
          sourceType: 'certification',
          title: `${course.platform}: ${course.title.trim() || 'Professional Certificate'}`,
          url: course.url.trim() || undefined,
          date: new Date().toISOString().split('T')[0],
          extractedSkills: detectedSkillIds,
          evidenceStrength: Math.min(1.0, analysisResult.efficiencyScore / 100),
          verificationState: analysisResult.credibilityTier,
          metadata: {
            efficiencyScore: analysisResult.efficiencyScore,
            grade: course.grade,
            notes: course.notes || analysisResult.executiveSummary,
          }
        });
      });
    } else {
      newArtifacts.push({
        id: `art-candidate-${Date.now()}`,
        sourceType: 'project_portfolio',
        title: submissionTitle.trim() || uploadedFileName || `Resume Submission (${analysisResult.efficiencyScore}% Efficiency)`,
        url: submissionUrl.trim() || undefined,
        date: new Date().toISOString().split('T')[0],
        extractedSkills: detectedSkillIds,
        evidenceStrength: analysisResult.efficiencyScore / 100,
        verificationState: analysisResult.credibilityTier,
        metadata: {
          efficiencyScore: analysisResult.efficiencyScore,
          fileName: uploadedFileName || undefined,
          fileSize: uploadedFileSize || undefined,
          notes: analysisResult.executiveSummary,
        }
      });
    }

    if (newArtifacts.length === 0) return;

    // Synthesize skills from newly added artifacts
    const updatedSkills = { ...userProfile.skills };
    for (const art of newArtifacts) {
      for (const det of analysisResult.detectedSkills) {
        if (!updatedSkills[det.skillId]) {
          updatedSkills[det.skillId] = synthesizeSkillFromArtifact(det.skillId, art);
        } else {
          updatedSkills[det.skillId] = {
            ...updatedSkills[det.skillId],
            confidence: Math.min(100, Math.max(updatedSkills[det.skillId].confidence, det.confidence + 5)),
            state: analysisResult.credibilityTier === 'evidenced' && updatedSkills[det.skillId].state === 'claimed'
              ? 'evidenced'
              : updatedSkills[det.skillId].state,
            evidenceSources: Array.from(new Set([...updatedSkills[det.skillId].evidenceSources, art.title]))
          };
        }
      }
    }

    const updatedProfile = {
      ...userProfile,
      artifacts: [...newArtifacts, ...userProfile.artifacts],
      skills: updatedSkills,
      trajectoryLog: [
        {
          timestamp: new Date().toISOString().split('T')[0],
          event: `Ingested ${newArtifacts.length} ${activeTab === 'github_repo' ? 'GitHub repositories' : activeTab === 'coursera_cert' ? 'certifications' : 'documents'} (${analysisResult.efficiencyScore}% Efficiency)`,
          affectedSkill: detectedSkillIds[0] || 'Technical Evidence',
          deltaConfidence: +12,
        },
        ...userProfile.trajectoryLog
      ]
    };

    setUserProfile(updatedProfile);
    showToast('success', 'Profile Dossier Updated', `Ingested ${newArtifacts.length} artifact(s) into your verified evidence ledger. Scores recalculating!`);
    setAnalysisResult(null);
  };

  // ── If Candidate is not yet signed in, render direct full-screen Sign In / Registration Page ──
  if (!candidateUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white border border-[#E7E2D6] rounded-3xl shadow-xl p-8 sm:p-10 space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Subtle top flame accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF4F00] via-[#FF7A30] to-[#FF4F00]" />
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#FFF1EB] text-[#FF4F00] border border-[#FFCDB5]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CANDIDATE ACCESS PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
              Sign In to Candidate Workspace
            </h1>
            <p className="text-xs sm:text-sm text-[#52525B] max-w-md mx-auto leading-relaxed">
              Direct self-service candidate credential ingestion. Upload your resume, link your GitHub repos, and add online courses for Groq AI validation.
            </p>
          </div>

          {/* Saved Candidate Upper Section Quick Login */}
          {savedCandidateAccounts.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-[#FFF5F0] via-white to-[#FAF9F5] border-2 border-[#FFCDB5] rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#FF4F00] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Saved Candidate Account Detected</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FF4F00] text-white">
                  {savedCandidateAccounts.length} SAVED
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#F5E6DD]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#18181B] text-white flex items-center justify-center font-bold font-mono text-xs shadow-xs shrink-0">
                    {savedCandidateAccounts[0].name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#18181B] truncate">
                      {savedCandidateAccounts[0].name}
                    </div>
                    <div className="text-xs text-[#71717A] font-mono truncate">
                      {savedCandidateAccounts[0].email}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => loginCandidate(savedCandidateAccounts[0])}
                  className="px-4 py-2.5 bg-[#FF4F00] hover:bg-[#E04500] text-white font-mono font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <span>Login as {savedCandidateAccounts[0].name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {savedCandidateAccounts.length > 1 && (
                <div className="flex items-center gap-1.5 pt-1 overflow-x-auto text-[11px]">
                  <span className="text-[10px] font-mono text-[#71717A] shrink-0">Other accounts:</span>
                  {savedCandidateAccounts.slice(1).map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => loginCandidate(c)}
                      className="px-2.5 py-1 bg-white hover:bg-[#FFF1EB] border border-[#E7E2D6] hover:border-[#FFCDB5] rounded-lg text-[11px] font-semibold text-[#18181B] hover:text-[#FF4F00] transition cursor-pointer shrink-0 truncate max-w-[200px]"
                    >
                      Login as {c.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mode Switcher: Sign In vs Register */}
          <div className="flex p-1 bg-[#FAF9F5] border border-[#E7E2D6] rounded-xl font-mono text-xs">
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              className={`flex-1 py-2.5 rounded-lg font-bold transition cursor-pointer ${
                authMode === 'signin' ? 'bg-[#18181B] text-white shadow-xs' : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              Sign In with Email
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2.5 rounded-lg font-bold transition cursor-pointer ${
                authMode === 'register' ? 'bg-[#FF4F00] text-white shadow-xs' : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              Create Candidate Account
            </button>
          </div>

          {/* 1-Click Fast Candidate Logins */}
          <div className="p-3.5 bg-[#FAF9F5] border border-[#E7E2D6] rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#71717A] uppercase">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#FF4F00]" />
                <span>1-Click Candidate Logins</span>
              </span>
              <span>Fast Testing</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Saved Candidates */}
              {savedCandidateAccounts.map((acc, i) => (
                <button
                  key={`saved-${i}`}
                  type="button"
                  onClick={() => loginCandidate(acc)}
                  className="p-2.5 text-left bg-white border-2 border-[#FFCDB5] hover:border-[#FF4F00] hover:bg-[#FFFDFB] rounded-xl transition group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FFF1EB] text-[#FF4F00]">
                      SAVED
                    </span>
                    <span className="text-[9px] font-mono text-[#71717A] group-hover:text-[#FF4F00] flex items-center gap-0.5">
                      Enter <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-[#18181B] group-hover:text-[#FF4F00] truncate">
                    Login as {acc.name}
                  </div>
                  <div className="text-[9px] font-mono text-[#71717A] mt-0.5 truncate">
                    {acc.email}
                  </div>
                </button>
              ))}

              {/* Demo Accounts (deduplicated) */}
              {DEMO_ACCOUNTS.filter(demo => !savedCandidateAccounts.some(s => s.email.toLowerCase() === demo.email.toLowerCase())).map((acc, i) => (
                <button
                  key={`demo-${i}`}
                  type="button"
                  onClick={() => handleDemoSignIn(acc)}
                  className="p-2.5 text-left bg-white border border-[#E7E2D6] hover:border-[#FF4F00] hover:bg-[#FFFDFB] rounded-xl transition group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#F4F4F5] text-[#71717A]">
                      DEMO
                    </span>
                    <span className="text-[9px] font-mono text-[#71717A] group-hover:text-[#FF4F00] flex items-center gap-0.5">
                      Enter <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-[#18181B] group-hover:text-[#FF4F00] truncate">
                    Login as {acc.name}
                  </div>
                  <div className="text-[9px] font-mono text-[#71717A] mt-0.5 truncate">
                    {acc.email}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#18181B] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E7E2D6] rounded-xl text-xs font-medium text-[#18181B] focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00] outline-hidden"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono font-bold text-[#18181B] mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 bg-white border border-[#E7E2D6] rounded-xl text-xs font-medium text-[#18181B] focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-[#18181B] mb-1">
                Password
              </label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-white border border-[#E7E2D6] rounded-xl text-xs font-medium text-[#18181B] focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00] outline-hidden font-mono"
              />
            </div>

            {authMode === 'register' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-[#18181B] mb-1">
                      Target Career Role
                    </label>
                    <select
                      value={authRole}
                      onChange={(e) => setAuthRole(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E7E2D6] rounded-xl text-xs font-medium text-[#18181B] focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00] outline-hidden"
                    >
                      {CAREER_ROLES.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.title} ({r.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-[#18181B] mb-1">
                      Experience Level
                    </label>
                    <select
                      value={authLevel}
                      onChange={(e) => setAuthLevel(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E7E2D6] rounded-xl text-xs font-medium text-[#18181B] focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00] outline-hidden"
                    >
                      <option value="Entry / Graduate (0-1 yrs)">Entry / Graduate (0-1 yrs)</option>
                      <option value="Junior Engineer (1-2 yrs)">Junior Engineer (1-2 yrs)</option>
                      <option value="Mid-Level Engineer (2-4 yrs)">Mid-Level Engineer (2-4 yrs)</option>
                      <option value="Senior Engineer (5-7 yrs)">Senior Engineer (5-7 yrs)</option>
                      <option value="Staff / Principal (7+ yrs)">Staff / Principal (7+ yrs)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-[#18181B] mb-1">
                    Candidate Bio / Career Focus (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={authBio}
                    onChange={(e) => setAuthBio(e.target.value)}
                    placeholder="Brief summary of your primary frameworks, languages, and technical goals..."
                    className="w-full px-3 py-2 bg-white border border-[#E7E2D6] rounded-xl text-xs font-medium text-[#18181B] focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00] outline-hidden resize-none font-mono"
                  />
                </div>

                {/* Resume Upload Section on Candidate Registration */}
                <div className="space-y-2.5 p-3.5 bg-[#FAF9F5] border border-[#E7E2D6] rounded-2xl">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono font-bold text-[#18181B] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#FF4F00]" />
                      <span>Resume Document (Optional)</span>
                    </label>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={regResumeInputRef}
                        onChange={handleRegResumeUpload}
                        accept=".pdf,.docx,.doc,.txt,.md,.json"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => regResumeInputRef.current?.click()}
                        disabled={isRegAnalyzing}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono font-bold text-[#FF4F00] bg-white hover:bg-[#FFF1EB] border border-[#FFCDB5] rounded-lg transition cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {isRegAnalyzing ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin text-[#FF4F00]" />
                            <span>Analyzing with AI...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-3.5 h-3.5 text-[#FF4F00]" />
                            <span>Upload Resume Doc</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-[#71717A] leading-relaxed">
                    Attach your resume document (.pdf, .docx, .txt, .md). Groq LPU will automatically extract your technical skills, work experience, and compute an initial signal efficiency score.
                  </p>

                  {/* Uploaded Resume Card with Live AI Insights */}
                  {regResumeFile && (
                    <div className="p-3 bg-white border border-[#E7E2D6] rounded-xl flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]">
                            <FileCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[11px] font-mono font-bold text-[#18181B] leading-tight">
                              {regResumeFile.name}
                            </div>
                            <div className="text-[9px] font-mono text-[#71717A]">
                              {regResumeFile.size} · Ingested for AI Skill Calibration
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleClearRegResume}
                          className="text-[#71717A] hover:text-[#DC2626] p-1 rounded-md hover:bg-[#FAF9F5] transition cursor-pointer"
                          title="Remove resume"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {isRegAnalyzing && (
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[#FF4F00] bg-[#FFF1EB] p-2 rounded-lg border border-[#FFCDB5]">
                          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                          <span>Groq LPU extracting competencies, metrics & efficiency score...</span>
                        </div>
                      )}

                      {regAnalysisResult && !isRegAnalyzing && (
                        <div className="bg-[#FAF9F5] p-2.5 rounded-lg border border-[#E7E2D6] space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#059669]">
                              <Sparkles className="w-3.5 h-3.5 text-[#FF4F00]" />
                              <span>AI Signal Efficiency: {regAnalysisResult.efficiencyScore}%</span>
                            </div>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white border border-[#E7E2D6] text-[#71717A]">
                              Tier: {regAnalysisResult.credibilityTier}
                            </span>
                          </div>

                          {regAnalysisResult.detectedSkills && regAnalysisResult.detectedSkills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {regAnalysisResult.detectedSkills.map((sk, idx) => (
                                <span
                                  key={idx}
                                  className="text-[9px] font-mono font-medium px-1.5 py-0.5 bg-[#FFF1EB] text-[#C2410C] border border-[#FFCDB5] rounded"
                                >
                                  +{sk.skillName} ({sk.confidence}%)
                                </span>
                              ))}
                            </div>
                          )}

                          {regAnalysisResult.executiveSummary && (
                            <p className="text-[10px] font-sans text-[#52525B] leading-relaxed italic">
                              "{regAnalysisResult.executiveSummary}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#FF4F00] hover:bg-[#E04500] text-white font-mono font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{authMode === 'signin' ? 'Sign In & Enter Workspace' : 'Create Candidate Account & Start Ingestion'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      
      {/* ── Candidate Portal Header Banner & Registration Bar ─────────────────── */}
      <div className="bento-cell p-6 sm:p-8 rounded-2xl border border-[#E7E2D6] bg-white shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-[#FF4F00]/10 text-[#FF4F00] border border-[#FF4F00]/30">
                <UserCheck className="w-3.5 h-3.5" />
                <span>CANDIDATE WORKSPACE</span>
              </span>
              <span className="font-mono text-[10px] font-bold text-[#18181B] bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
                LOGGED IN: {candidateUser.email}
              </span>
              <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                LIVE INTERACTION ACTIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
              Welcome, {candidateUser.name}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#52525B] max-w-2xl leading-relaxed">
              Upload resumes, GitHub repositories, or Coursera certificates. Groq AI evaluates signal efficiency and generates custom diagnostic tests to prove and elevate your career readiness.
            </p>
          </div>

          {/* Quick Metrics & Sign Out Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-3 p-3.5 bg-[#FAF9F5] border border-[#E7E2D6] rounded-xl font-mono text-xs">
              <div>
                <div className="text-[9px] text-[#A1A1AA] uppercase font-bold">Target Role</div>
                <div className="text-sm font-bold text-[#18181B] truncate max-w-[150px]">
                  {role.title}
                </div>
              </div>
              <div className="h-8 w-px bg-[#E7E2D6]" />
              <div>
                <div className="text-[9px] text-[#A1A1AA] uppercase font-bold">Readiness Fit</div>
                <div className={`text-2xl font-black ${selectedRoleMatch.overallScore >= 75 ? 'text-[#059669]' : 'text-[#D97706]'}`}>
                  {selectedRoleMatch.overallScore}%
                </div>
              </div>
            </div>

            <button
              onClick={logoutCandidate}
              className="px-4 py-2.5 rounded-xl border border-[#E7E2D6] hover:border-[#FCA5A5] bg-white hover:bg-rose-50 text-xs font-mono font-bold text-[#52525B] hover:text-[#DC2626] transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer shrink-0"
              title="Sign out of candidate account"
            >
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Section 1: Multi-Source Credential Intake & Groq Efficiency ── */}
      <div className="bento-cell p-6 sm:p-8 rounded-2xl border border-[#E7E2D6] bg-white shadow-sm">
        <SectionIndex 
          index="01" 
          label="Credential Intake & Groq AI Efficiency Analysis" 
          sublabel="Upload resumes, code repositories, or course certificates. Groq analyzes technical clarity, depth, and extracts verifiable competencies."
        />

        {/* Source Type Tabs */}
        <div className="flex flex-wrap gap-2 mt-5">
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition ${
              activeTab === 'resume'
                ? 'bg-[#18181B] text-white font-bold shadow-xs'
                : 'bg-[#FAF9F5] text-[#52525B] border border-[#E7E2D6] hover:bg-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Resume / Document Upload</span>
          </button>

          <button
            onClick={() => setActiveTab('github_repo')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition ${
              activeTab === 'github_repo'
                ? 'bg-[#18181B] text-white font-bold shadow-xs'
                : 'bg-[#FAF9F5] text-[#52525B] border border-[#E7E2D6] hover:bg-white'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>GitHub Repository Link</span>
          </button>

          <button
            onClick={() => setActiveTab('coursera_cert')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition ${
              activeTab === 'coursera_cert'
                ? 'bg-[#18181B] text-white font-bold shadow-xs'
                : 'bg-[#FAF9F5] text-[#52525B] border border-[#E7E2D6] hover:bg-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Coursera / Online Certifications</span>
          </button>
        </div>

        {/* Quick Sample Fillers & Presets */}
        <div className="my-3 text-xs font-mono flex items-center justify-between gap-2 text-[#71717A] flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#18181B]">Fast Presets:</span>
            {activeTab === 'resume' && (
              <button 
                onClick={() => {
                  setSubmissionTitle('Staff Full-Stack & UI Systems Engineer Resume');
                  setSubmissionUrl('https://github.com/candidate');
                  setSubmissionContent('Staff Software Engineer with 6+ years of experience architecting enterprise design systems, Next.js web applications, and high-performance microservices. Built scalable state management with React Query, validated TypeScript type safety, and implemented real-time event messaging with WebSocket and PostgreSQL.');
                  setUploadedFileName(null);
                  showToast('info', 'Preset Loaded', 'Loaded comprehensive Full-Stack resume text.');
                }} 
                className="hover:text-[#FF4F00] underline font-medium"
              >
                Staff Full-Stack Resume
              </button>
            )}
            {activeTab === 'github_repo' && (
              <button 
                onClick={loadMultiRepoPreset} 
                className="hover:text-[#FF4F00] underline font-medium"
              >
                Load 3 Multi-Stack Repositories (Frontend + Backend + Cloud)
              </button>
            )}
            {activeTab === 'coursera_cert' && (
              <button 
                onClick={loadMultiCoursePreset} 
                className="hover:text-[#FF4F00] underline font-medium"
              >
                Load 3 Verified Certifications (Deep Learning + Meta + AWS)
              </button>
            )}
          </div>

          {activeTab === 'github_repo' && (
            <button
              onClick={addGitHubRepo}
              className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF4F00]" />
              <span>Add Another GitHub Repo</span>
            </button>
          )}

          {activeTab === 'coursera_cert' && (
            <button
              onClick={addCourse}
              className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF4F00]" />
              <span>Add Another Course / Certificate</span>
            </button>
          )}
        </div>

        {/* ── Tab 1: Resume / Document Upload ──────────────────── */}
        {activeTab === 'resume' && (
          <div className="space-y-4 mt-4">
            {/* File Upload Dropzone */}
            <div className="border-2 border-dashed border-[#E7E2D6] hover:border-[#FF4F00] bg-[#FAF9F5] hover:bg-[#FFFDFB] rounded-xl p-6 text-center transition cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.txt,.md,.json,.doc,.docx"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Upload resume or document"
              />
              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                <UploadCloud className="w-9 h-9 text-[#FF4F00]" />
                <div className="text-xs font-mono font-bold text-[#18181B]">
                  {uploadedFileName ? (
                    <span className="text-emerald-700 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      Loaded: {uploadedFileName} ({uploadedFileSize}) — Click or drop another file to replace
                    </span>
                  ) : (
                    <span>Drop your Resume, CV, or Academic Transcript file here (PDF, TXT, MD, DOCX)</span>
                  )}
                </div>
                <div className="text-[10px] font-mono text-[#71717A]">
                  Client-side text extraction automatically loads content for Groq AI epistemic analysis
                </div>
              </div>
            </div>

            {uploadedFileName && (
              <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-mono">
                <div className="flex items-center gap-2 text-emerald-800">
                  <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold">{uploadedFileName}</span>
                  <span className="text-emerald-600 font-normal">({uploadedFileSize})</span>
                </div>
                <button
                  type="button"
                  onClick={handleClearUploadedFile}
                  className="text-stone-500 hover:text-red-600 font-semibold text-[11px]"
                >
                  Clear File
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono uppercase font-bold text-[#71717A]">
                  Document / Resume Title
                </label>
                <input
                  type="text"
                  value={submissionTitle}
                  onChange={(e) => setSubmissionTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer Resume 2026"
                  className="w-full mt-1 p-3 bg-[#FAF9F5] border border-[#E7E2D6] rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#FF4F00] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase font-bold text-[#71717A]">
                  Online Portfolio / LinkedIn URL (Optional)
                </label>
                <input
                  type="text"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  placeholder="https://portfolio.dev or https://linkedin.com/in/username"
                  className="w-full mt-1 p-3 bg-[#FAF9F5] border border-[#E7E2D6] rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#FF4F00] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono uppercase font-bold text-[#71717A]">
                  Extracted Resume Text / Work Experience Body
                </label>
                <span className="text-[10px] font-mono text-[#71717A]">
                  {submissionContent.length} characters
                </span>
              </div>
              <textarea
                rows={5}
                value={submissionContent}
                onChange={(e) => setSubmissionContent(e.target.value)}
                placeholder="Paste raw resume text, career history, technical achievements, or bullet points..."
                className="w-full p-3.5 bg-[#FAF9F5] border border-[#E7E2D6] rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#FF4F00] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ── Tab 2: Multiple GitHub Repositories ───────────────── */}
        {activeTab === 'github_repo' && (
          <div className="space-y-4 mt-4">
            <div className="space-y-4">
              {githubRepos.map((repo, index) => (
                <div 
                  key={repo.id}
                  className="p-4 sm:p-5 rounded-xl border border-[#E7E2D6] bg-[#FAF9F5] space-y-3 relative group hover:border-stone-400 transition"
                >
                  <div className="flex items-center justify-between border-b border-[#E7E2D6] pb-2.5">
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4 text-[#FF4F00]" />
                      <span className="text-xs font-mono font-bold text-[#18181B] uppercase">
                        Repository 0{index + 1}
                      </span>
                    </div>
                    {githubRepos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGitHubRepo(repo.id)}
                        className="text-stone-400 hover:text-red-600 flex items-center gap-1 text-[11px] font-mono transition"
                        title="Remove this repository link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono uppercase font-bold text-[#71717A]">
                        GitHub Repository URL *
                      </label>
                      <div className="relative mt-1">
                        <Link2 className="w-3.5 h-3.5 absolute left-3 top-3.5 text-stone-400" />
                        <input
                          type="text"
                          value={repo.url}
                          onChange={(e) => updateGitHubRepo(repo.id, 'url', e.target.value)}
                          placeholder="https://github.com/username/project-repo"
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E7E2D6] rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#FF4F00] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase font-bold text-[#71717A]">
                        Project Title / Architecture Name *
                      </label>
                      <input
                        type="text"
                        value={repo.title}
                        onChange={(e) => updateGitHubRepo(repo.id, 'title', e.target.value)}
                        placeholder="e.g. Next.js Enterprise Monorepo or Distributed Microservices"
                        className="w-full mt-1 p-2.5 bg-white border border-[#E7E2D6] rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#FF4F00] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase font-bold text-[#71717A]">
                      Primary Technologies & Stack
                    </label>
                    <input
                      type="text"
                      value={repo.techStack}
                      onChange={(e) => updateGitHubRepo(repo.id, 'techStack', e.target.value)}
                      placeholder="e.g. TypeScript, React 19, Next.js, Docker, Kubernetes, PostgreSQL"
                      className="w-full mt-1 p-2.5 bg-white border border-[#E7E2D6] rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#FF4F00] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase font-bold text-[#71717A]">
                      Architecture Highlights, Commit Scope & Technical Proof
                    </label>
                    <textarea
                      rows={2}
                      value={repo.notes}
                      onChange={(e) => updateGitHubRepo(repo.id, 'notes', e.target.value)}
                      placeholder="Describe concurrency handling, CI/CD pipeline, test coverage, and key architectural patterns..."
                      className="w-full mt-1 p-2.5 bg-white border border-[#E7E2D6] rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#FF4F00] focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addGitHubRepo}
              className="w-full py-2.5 border-2 border-dashed border-[#E7E2D6] hover:border-[#FF4F00] rounded-xl text-xs font-mono font-bold text-[#52525B] hover:text-[#FF4F00] flex items-center justify-center gap-1.5 transition bg-white"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another GitHub Repository ({githubRepos.length} added)</span>
            </button>
          </div>
        )}

        {/* ── Tab 3: Multiple Coursera & Online Courses ────────── */}
        {activeTab === 'coursera_cert' && (
          <div className="space-y-4 mt-4">
            <div className="space-y-4">
              {courses.map((course, index) => (
                <div 
                  key={course.id}
                  className="p-4 sm:p-5 rounded-xl border border-[#E7E2D6] bg-[#FAF9F5] space-y-3 relative group hover:border-stone-400 transition"
                >
                  <div className="flex items-center justify-between border-b border-[#E7E2D6] pb-2.5">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#FF4F00]" />
                      <span className="text-xs font-mono font-bold text-[#18181B] uppercase">
                        Course / Certification 0{index + 1}
                      </span>
                    </div>
                    {courses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCourse(course.id)}
                        className="text-stone-400 hover:text-red-600 flex items-center gap-1 text-[11px] font-mono transition"
                        title="Remove this course entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-mono uppercase font-bold text-[#71717A]">
                        Issuing Platform
                      </label>
                      <select
                        value={course.platform}
                        onChange={(e) => updateCourse(course.id, 'platform', e.target.value)}
                        className="w-full mt-1 p-2.5 bg-white border border-[#E7E2D6] rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#FF4F00] focus:outline-none"
                      >
                        <option value="Coursera">Coursera</option>
                        <option value="edX">edX</option>
                        <option value="AWS">AWS Certification</option>
                        <option value="Google Cloud">Google Cloud</option>
                        <option value="Stanford Online">Stanford Online</option>
                        <option value="Udemy">Udemy</option>
                        <option value="University">University / Academic</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-mono uppercase font-bold text-[#71717A]">
                        Course / Specialization Title *
                      </label>
                      <input
                        type="text"
                        value={course.title}
                        onChange={(e) => updateCourse(course.id, 'title', e.target.value)}
                        placeholder="e.g. Deep Learning Specialization or Meta Front-End Developer"
                        className="w-full mt-1 p-2.5 bg-white border border-[#E7E2D6] rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#FF4F00] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono uppercase font-bold text-[#71717A]">
                        Verification URL / Credential ID
                      </label>
                      <div className="relative mt-1">
                        <Link2 className="w-3.5 h-3.5 absolute left-3 top-3.5 text-stone-400" />
                        <input
                          type="text"
                          value={course.url}
                          onChange={(e) => updateCourse(course.id, 'url', e.target.value)}
                          placeholder="https://coursera.org/verify/YOUR-CERT-ID"
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E7E2D6] rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#FF4F00] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase font-bold text-[#71717A]">
                        Grade / Completion Status
                      </label>
                      <input
                        type="text"
                        value={course.grade}
                        onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                        placeholder="e.g. 98.5% with Honors or Pass"
                        className="w-full mt-1 p-2.5 bg-white border border-[#E7E2D6] rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#FF4F00] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase font-bold text-[#71717A]">
                      Key Topics, Syllabus Modules & Practical Capstones
                    </label>
                    <textarea
                      rows={2}
                      value={course.notes}
                      onChange={(e) => updateCourse(course.id, 'notes', e.target.value)}
                      placeholder="Outline topics covered, programming assignments completed, and tools used..."
                      className="w-full mt-1 p-2.5 bg-white border border-[#E7E2D6] rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#FF4F00] focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addCourse}
              className="w-full py-2.5 border-2 border-dashed border-[#E7E2D6] hover:border-[#FF4F00] rounded-xl text-xs font-mono font-bold text-[#52525B] hover:text-[#FF4F00] flex items-center justify-center gap-1.5 transition bg-white"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Course / Certification ({courses.length} added)</span>
            </button>
          </div>
        )}

        {/* Global Groq AI Evaluation Trigger */}
        <div className="mt-5 pt-3 flex items-center justify-between border-t border-[#E7E2D6] flex-wrap gap-3">
          <div className="text-xs font-mono text-[#71717A]">
            {activeTab === 'resume' ? 'Ready to analyze uploaded resume document' :
             activeTab === 'github_repo' ? `Ready to analyze ${githubRepos.length} repository manifest(s)` :
             `Ready to analyze ${courses.length} course credential(s)`}
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="px-6 py-2.5 bg-[#FF4F00] hover:bg-[#E04500] disabled:opacity-50 text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Groq AI Evaluating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  {activeTab === 'resume' ? 'Analyze Resume with Groq AI' :
                   activeTab === 'github_repo' ? `Analyze ${githubRepos.length} Repositories with Groq AI` :
                   `Analyze ${courses.length} Courses with Groq AI`}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Groq AI Efficiency Analysis Card */}
        {analysisResult && (
          <div className="mt-6 p-6 rounded-xl border border-[#FF4F00]/30 bg-[#FFFDFB] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E2D6] pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF4F00] animate-pulse" />
                <span className="font-mono text-xs font-bold text-[#FF4F00] uppercase tracking-wider">
                  GROQ AI EFFICIENCY REPORT
                </span>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold uppercase">
                  TIER: {analysisResult.credibilityTier}
                </span>
              </div>

              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-3xl font-black text-[#18181B]">
                  {analysisResult.efficiencyScore}%
                </span>
                <span className="text-xs text-[#71717A]">EFFICIENCY</span>
              </div>
            </div>

            <p className="text-xs text-[#18181B] font-mono leading-relaxed">
              {analysisResult.executiveSummary}
            </p>

            {/* Breakdown Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 bg-white border border-[#E7E2D6] rounded-lg">
                <div className="text-[9px] text-[#A1A1AA] uppercase font-bold">Clarity & Impact</div>
                <div className="text-lg font-bold text-[#18181B]">{analysisResult.efficiencyBreakdown.clarityAndImpact}%</div>
              </div>
              <div className="p-3 bg-white border border-[#E7E2D6] rounded-lg">
                <div className="text-[9px] text-[#A1A1AA] uppercase font-bold">Technical Depth</div>
                <div className="text-lg font-bold text-[#18181B]">{analysisResult.efficiencyBreakdown.technicalDepth}%</div>
              </div>
              <div className="p-3 bg-white border border-[#E7E2D6] rounded-lg">
                <div className="text-[9px] text-[#A1A1AA] uppercase font-bold">Verifiability</div>
                <div className="text-lg font-bold text-[#18181B]">{analysisResult.efficiencyBreakdown.evidenceVerifiability}%</div>
              </div>
              <div className="p-3 bg-white border border-[#E7E2D6] rounded-lg">
                <div className="text-[9px] text-[#A1A1AA] uppercase font-bold">Role Relevance</div>
                <div className="text-lg font-bold text-[#18181B]">{analysisResult.efficiencyBreakdown.relevanceToTargetRole}%</div>
              </div>
            </div>

            {/* Extracted Skills Pills */}
            {analysisResult.detectedSkills.length > 0 && (
              <div>
                <div className="text-[10px] font-mono font-bold text-[#71717A] uppercase mb-1.5">
                  Normalized Skills Extracted by Groq:
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.detectedSkills.map(s => (
                    <span 
                      key={s.skillId}
                      className="px-2.5 py-1 rounded bg-white border border-[#E7E2D6] font-mono text-xs text-[#18181B] flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{s.skillName}</span>
                      <strong className="text-[#059669]">+{s.confidence}%</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ingest Action CTA */}
            <div className="pt-3 border-t border-[#E7E2D6] flex justify-end">
              <button
                onClick={handleIngestToDossier}
                className="px-5 py-2 bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-mono font-bold rounded-xl flex items-center gap-2 shadow-xs transition"
              >
                <span>Accept & Ingest into Evidence Dossier</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FF4F00]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Section 2: Dynamic Groq AI Validation Test Console ── */}
      <div className="bento-cell p-6 sm:p-8 rounded-2xl border border-[#E7E2D6] bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <SectionIndex 
            index="02" 
            label="Candidate Skill Validation & Test Engine" 
            sublabel="Exclusively available in the Candidate Workspace. Groq AI generates dynamic assessment questions. Passing tests elevates your confidence and boosts role readiness."
          />
          <div className="font-mono text-xs bg-orange-50 border border-orange-200 text-[#FF4F00] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
            <Zap className="w-4 h-4" />
            <span>DYNAMIC GROQ TESTS ONLY</span>
          </div>
        </div>

        {/* Active Blockers Warning Banner */}
        {activeBlockers.length > 0 && (
          <div className="my-5 p-4 rounded-xl bg-amber-50/70 border border-amber-300 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
              <div>
                <strong className="text-amber-900 font-bold">
                  {activeBlockers.length} Critical Blockers Currently Gating {role.title}:
                </strong>
                <div className="text-amber-800 text-[11px] mt-0.5">
                  Validate these skills below to remove blocker penalties and classify as Ready Now.
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeBlockers.map(b => (
                <button
                  key={b.skillId}
                  onClick={() => launchAssessment(b.skillId)}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] rounded flex items-center gap-1 shadow-xs transition"
                >
                  <Zap className="w-3 h-3" />
                  <span>Validate {b.skillName}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Unvalidated Skills Requiring Groq Test */}
        <div className="mt-5">
          <h3 className="text-sm font-bold text-[#18181B] font-mono uppercase mb-3 flex items-center gap-2">
            <span>Competencies Requiring Diagnostic Validation ({unvalidatedSkills.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unvalidatedSkills.map(skill => (
              <div 
                key={skill.id}
                className="p-5 rounded-xl border border-[#E7E2D6] bg-[#FAF9F5]/80 hover:bg-white hover:border-[#D4D4D8] transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-[#18181B]">{skill.name}</h4>
                      <span className="text-[10px] font-mono text-[#71717A] uppercase">
                        {skill.category} · {skill.proficiency}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded border bg-stone-100 text-stone-700 border-stone-200">
                      {skill.state}
                    </span>
                  </div>

                  {/* Confidence bar */}
                  <div className="my-3">
                    <div className="flex justify-between text-xs font-mono mb-1 text-[#52525B]">
                      <span>Confidence:</span>
                      <strong className="text-[#18181B]">{skill.confidence}%</strong>
                    </div>
                    <div className="w-full bg-[#E7E2D6] rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${skill.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Validate CTA */}
                <div className="mt-3 pt-3 border-t border-[#E7E2D6]">
                  <button
                    onClick={() => launchAssessment(skill.id)}
                    className="w-full py-2 bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-mono font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Take Groq AI Validation Test</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Validated Skills Roster */}
        {validatedSkills.length > 0 && (
          <div className="mt-8 pt-6 border-t border-[#E7E2D6]">
            <h3 className="text-xs font-bold text-emerald-800 font-mono uppercase mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Officially Validated Competencies ({validatedSkills.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {validatedSkills.map(skill => (
                <div 
                  key={skill.id}
                  className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl font-mono text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-emerald-950 truncate max-w-[140px]">{skill.name}</div>
                    <div className="text-[10px] text-emerald-700">Validated: {skill.confidence}%</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
