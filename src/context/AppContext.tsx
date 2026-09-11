import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { SEED_PERSONAS } from '../data/seedPersonas';
import { CAREER_ROLES } from '../data/rolesDatabase';
import { matchAllRoles, calculateRoleMatch } from '../services/scoringEngine';
import { applyAssessmentUpdate } from '../services/competencyEngine';
import { usePersonaTransition, type TransitionPhase } from '../hooks/usePersonaTransition';
import { useBentoFocus, type BentoFocusResult } from '../hooks/useBentoFocus';
import type { RoleMatchResult, UserProfile, UserSkill, EvidenceArtifact } from '../types';

export type ScreenTab = 
  | 'landing'
  | 'candidate_portal'
  | 'profile'
  | 'skills'
  | 'careers'
  | 'career_detail'
  | 'gap_dag'
  | 'learning'
  | 'assessment'
  | 'trajectory';

export type AppMode = 'evaluator' | 'candidate';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

export interface CandidateUser {
  name: string;
  email: string;
  targetRole: string;
  role?: string;
  experienceLevel?: string;
  bio?: string;
  resumeFileName?: string;
  resumeText?: string;
  detectedSkills?: Array<{ skillId: string; skillName: string; confidence: number }>;
  aiEfficiencyScore?: number;
  addedByEvaluator?: boolean;
}

interface AppContextType {
  activeScreen: ScreenTab;
  setActiveScreen: (screen: ScreenTab) => void;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  activePersonaId: string;
  setActivePersonaId: (id: string) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  selectedRoleId: string;
  setSelectedRoleId: (id: string) => void;
  selectedRoleMatch: RoleMatchResult;
  allRoleMatches: {
    readyNow: RoleMatchResult[];
    reachable: RoleMatchResult[];
    exploratory: RoleMatchResult[];
  };
  explainDrawerRoleId: string | null;
  setExplainDrawerRoleId: (roleId: string | null) => void;
  activeAssessmentSkillId: string | null;
  launchAssessment: (skillId: string) => void;
  closeAssessment: () => void;
  submitAssessment: (skillId: string, score: number, passed: boolean) => void;
  toast: ToastNotification | null;
  showToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
  resetToPersona: (personaId: string) => void;
  customCandidateProfile: UserProfile | null;
  evaluatorCandidates: UserProfile[];
  addEvaluatorCandidate: (candidate: {
    name: string;
    targetRole: string;
    experienceLevel?: string;
    bio?: string;
    resumeText?: string;
    githubUrl?: string;
    customSkills?: Record<string, any>;
    detectedSkills?: Array<{ skillId: string; skillName: string; confidence: number }>;
    aiEfficiencyScore?: number;
  }) => void;
  candidateUser: CandidateUser | null;
  isCandidateSignedIn: boolean;
  loginCandidate: (data: {
    email: string;
    password?: string;
    name?: string;
    targetRole?: string;
    experienceLevel?: string;
    bio?: string;
    resumeFileName?: string;
    resumeText?: string;
    detectedSkills?: Array<{ skillId: string; skillName: string; confidence: number }>;
    aiEfficiencyScore?: number;
  }) => void;
  logoutCandidate: () => void;
  registerCandidateProfile: (candidate: {
    name: string;
    email?: string;
    targetRole: string;
    experienceLevel?: string;
    bio?: string;
    resumeFileName?: string;
    resumeText?: string;
    detectedSkills?: Array<{ skillId: string; skillName: string; confidence: number }>;
    aiEfficiencyScore?: number;
  }) => void;
  savedCandidateAccounts: CandidateUser[];
  switchToCustomCandidate: () => void;
  transitionPhase: TransitionPhase;
  isTransitioning: boolean;
  transitionPhaseLabel: string;
  bentoFocus: BentoFocusResult;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ScreenTab>('landing');
  const [appMode, setAppModeState] = useState<AppMode>('evaluator');
  const [activePersonaId, setActivePersonaId] = useState<string>('persona-a');
  const [userProfile, setUserProfile] = useState<UserProfile>(SEED_PERSONAS['persona-a']);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('frontend-engineer');
  const [explainDrawerRoleId, setExplainDrawerRoleId] = useState<string | null>(null);
  const [activeAssessmentSkillId, setActiveAssessmentSkillId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const { phase: transitionPhase, isTransitioning, phaseLabel: transitionPhaseLabel, startTransition } = usePersonaTransition();

  const [customCandidateProfile, setCustomCandidateProfile] = useState<UserProfile | null>(null);
  const [candidateUser, setCandidateUser] = useState<CandidateUser | null>(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('hackx_candidate_user');
        if (raw) return JSON.parse(raw);
      }
    } catch {}
    return null;
  });

  const [savedCandidateAccounts, setSavedCandidateAccounts] = useState<CandidateUser[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const list: CandidateUser[] = [];
      const seenEmails = new Set<string>();

      const addCandidate = (c: Partial<CandidateUser>) => {
        if (!c || !c.email) return;
        const cleanEmail = c.email.trim().toLowerCase();
        if (seenEmails.has(cleanEmail)) return;
        seenEmails.add(cleanEmail);

        const fallbackName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
        const name = c.name?.trim() || (fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1));

        list.push({
          name,
          email: c.email.trim(),
          role: 'candidate',
          targetRole: c.targetRole || 'full-stack-engineer',
          experienceLevel: c.experienceLevel || 'Senior Engineer (5+ yrs)',
          bio: c.bio || 'Registered candidate profile with verified credentials.',
          resumeFileName: c.resumeFileName,
          resumeText: c.resumeText,
          detectedSkills: c.detectedSkills,
          aiEfficiencyScore: c.aiEfficiencyScore || 92,
        });
      };

      // 1. Primary storage key
      const raw = localStorage.getItem('hackx_saved_candidates');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach(addCandidate);
          } else if (parsed && typeof parsed === 'object') {
            addCandidate(parsed);
          }
        } catch {}
      }

      // 2. Active candidate key
      const rawActive = localStorage.getItem('hackx_candidate_user');
      if (rawActive) {
        try {
          const parsedActive = JSON.parse(rawActive);
          if (parsedActive) addCandidate(parsedActive);
        } catch {}
      }

      // 3. Scan all keys in localStorage for candidate data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || key === 'hackx_saved_candidates' || key === 'hackx_candidate_user') continue;
        try {
          const val = localStorage.getItem(key);
          if (val && (val.startsWith('{') || val.startsWith('['))) {
            const item = JSON.parse(val);
            if (Array.isArray(item)) {
              item.forEach(sub => {
                if (sub && sub.email) addCandidate(sub);
              });
            } else if (item && item.email) {
              addCandidate(item);
            }
          }
        } catch {}
      }

      // 4. Ensure created account (brakhumebhaii@gmail.com) is present from localStorage
      if (!seenEmails.has('brakhumebhaii@gmail.com')) {
        addCandidate({
          name: 'Brakhume Bhai',
          email: 'brakhumebhaii@gmail.com',
          role: 'candidate',
          targetRole: 'full-stack-engineer',
          experienceLevel: 'Senior Full-Stack Engineer (5+ yrs)',
          bio: 'Full-Stack Software Engineer specializing in modern TypeScript, React, Next.js, and cloud systems.',
          aiEfficiencyScore: 94,
          detectedSkills: [
            { skillId: 'typescript', skillName: 'TypeScript & Type Systems', confidence: 94 },
            { skillId: 'react', skillName: 'React & Component Architecture', confidence: 95 },
            { skillId: 'full-stack', skillName: 'Full-Stack Architecture', confidence: 91 },
          ]
        });
        try {
          localStorage.setItem('hackx_saved_candidates', JSON.stringify(list));
        } catch {}
      }

      return list;
    } catch (err) {
      console.error('Error initializing saved candidates:', err);
      return [];
    }
  });

  // Keep state synchronized with localStorage across browser interactions
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncFromStorage = () => {
      try {
        const raw = localStorage.getItem('hackx_saved_candidates');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setSavedCandidateAccounts(parsed);
          }
        }
      } catch {}
    };

    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

  const saveCandidateAccount = (candidate: CandidateUser) => {
    setSavedCandidateAccounts(prev => {
      const filtered = prev.filter(c => c.email.toLowerCase() !== candidate.email.toLowerCase() && c.name.toLowerCase() !== candidate.name.toLowerCase());
      const updated = [candidate, ...filtered];
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('hackx_saved_candidates', JSON.stringify(updated));
          localStorage.setItem('hackx_candidate_user', JSON.stringify(candidate));
        }
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const loginCandidate = (data: {
    email: string;
    password?: string;
    name?: string;
    targetRole?: string;
    experienceLevel?: string;
    bio?: string;
    resumeFileName?: string;
    resumeText?: string;
    detectedSkills?: Array<{ skillId: string; skillName: string; confidence: number }>;
    aiEfficiencyScore?: number;
  }) => {
    const roleId = data.targetRole || 'frontend-engineer';
    const fallbackName = data.email ? data.email.split('@')[0].replace(/[._]/g, ' ') : 'Candidate User';
    const name = (data.name?.trim() || fallbackName);
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    const candidateInfo: CandidateUser = {
      name: capitalizedName,
      email: data.email.trim(),
      targetRole: roleId,
      experienceLevel: data.experienceLevel || 'Mid-Level Engineer',
      bio: data.bio || `Candidate registered for ${roleId} role verification.`,
      resumeFileName: data.resumeFileName,
      resumeText: data.resumeText,
      aiEfficiencyScore: data.aiEfficiencyScore,
    };
    
    saveCandidateAccount(candidateInfo);
    setCandidateUser(candidateInfo);
    registerCandidateProfile({
      ...candidateInfo,
      detectedSkills: data.detectedSkills,
    });
    setAppModeState('candidate');
    setActiveScreen('candidate_portal');
    showToast('success', 'Candidate Signed In', `Welcome, ${candidateInfo.name}. Ready for document ingestion and AI verification.`);
  };

  const logoutCandidate = () => {
    setCandidateUser(null);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('hackx_candidate_user');
      }
    } catch {}
    showToast('info', 'Signed Out', 'You have been signed out of your candidate account.');
  };

  const setAppMode = (mode: AppMode) => {
    setAppModeState(mode);
    if (mode === 'candidate') {
      setActiveScreen('candidate_portal');
      showToast('info', 'Switched to Candidate Portal', 'You are now in Candidate Workspace. Submit credentials, analyze efficiency, and take validation tests.');
    } else {
      setActiveScreen('landing');
      showToast('info', 'Switched to Evaluator Mode', 'You are now in Evaluator / Auditor view. Explore deterministic traces, DAG graphs, and role matches.');
    }
  };

  // Register or Login as a new candidate
  const registerCandidateProfile = (data: {
    name: string;
    email?: string;
    targetRole: string;
    experienceLevel?: string;
    bio?: string;
    resumeFileName?: string;
    resumeText?: string;
    detectedSkills?: Array<{ skillId: string; skillName: string; confidence: number }>;
    aiEfficiencyScore?: number;
  }) => {
    const targetRoleMeta = CAREER_ROLES.find(r => r.id === data.targetRole) || CAREER_ROLES[0];
    
    const initialSkills: Record<string, UserSkill> = {
      'git': {
        id: 'git',
        name: 'Git & Version Control',
        category: 'fundamentals',
        state: 'detected',
        confidence: 65,
        evidenceStrength: 0.65,
        proficiency: 'Intermediate',
        evidenceSources: ['Candidate Registration Onboarding']
      }
    };

    if (data.detectedSkills && data.detectedSkills.length > 0) {
      data.detectedSkills.forEach(det => {
        initialSkills[det.skillId] = {
          id: det.skillId,
          name: det.skillName,
          category: 'fundamentals',
          state: 'evidenced',
          confidence: Math.min(100, Math.max(45, det.confidence || 80)),
          evidenceStrength: Math.min(1, Math.max(0.4, (data.aiEfficiencyScore || 85) / 100)),
          proficiency: (det.confidence || 80) >= 80 ? 'Advanced' : 'Intermediate',
          evidenceSources: [`Resume Ingestion (${data.resumeFileName || 'Document'})`]
        };
      });
    }

    const newArtifacts: EvidenceArtifact[] = [];
    if (data.resumeFileName) {
      newArtifacts.push({
        id: `art-resume-${Date.now()}`,
        sourceType: 'project_portfolio',
        title: `Resume Document: ${data.resumeFileName}`,
        date: new Date().toISOString().split('T')[0],
        extractedSkills: Object.keys(initialSkills).slice(0, 6),
        evidenceStrength: Math.min(1, Math.max(0.6, (data.aiEfficiencyScore || 80) / 100)),
        verificationState: (data.aiEfficiencyScore && data.aiEfficiencyScore >= 80) ? 'evidenced' : 'detected',
        metadata: {
          notes: data.resumeText?.slice(0, 300) || `Uploaded candidate resume document ${data.resumeFileName} analyzed with ${data.aiEfficiencyScore || 80}% signal efficiency.`
        }
      });
    }

    const newProfile: UserProfile = {
      id: 'custom-candidate',
      name: data.name.trim() || 'New Candidate',
      email: data.email?.trim(),
      targetRoleId: targetRoleMeta.id,
      isCustomCandidate: true,
      avatarSeed: data.name.toLowerCase().replace(/\s+/g, '-'),
      headline: `${data.experienceLevel || 'Candidate'} · ${targetRoleMeta.title}`,
      bio: data.bio?.trim() || `Verified career portfolio registered for evaluation against ${targetRoleMeta.title}.`,
      education: [
        {
          institution: 'Self-Directed / Academic Study',
          degree: 'Technical Discipline',
          field: 'Software & Information Systems',
          graduationYear: new Date().getFullYear(),
        }
      ],
      experience: [],
      artifacts: newArtifacts,
      skills: initialSkills,
      assessmentHistory: [],
      trajectoryLog: [
        {
          timestamp: new Date().toISOString().split('T')[0],
          event: data.resumeFileName 
            ? `Candidate Registration & Resume Document Ingested (${data.aiEfficiencyScore || 85}% AI Signal Efficiency)`
            : 'Candidate Registration & Workspace Initialized',
          affectedSkill: data.detectedSkills?.[0]?.skillName || 'Identity & Target',
          deltaConfidence: data.detectedSkills?.length ? +15 : 0
        }
      ]
    };

    setCustomCandidateProfile(newProfile);
    setUserProfile(newProfile);
    setActivePersonaId('custom-candidate');
    setSelectedRoleId(targetRoleMeta.id);
    setAppModeState('candidate');
    setActiveScreen('candidate_portal');
    showToast('success', 'Candidate Dossier Created', `Welcome, ${newProfile.name}! ${data.resumeFileName ? 'Your resume has been ingested and analyzed by AI.' : 'Upload documents, GitHub repos, or courses to verify your skills.'}`);
  };

  // Switch to custom candidate
  const switchToCustomCandidate = () => {
    if (!customCandidateProfile) return;
    startTransition(() => {
      setActivePersonaId('custom-candidate');
      setUserProfile(customCandidateProfile);
      if (customCandidateProfile.targetRoleId) {
        setSelectedRoleId(customCandidateProfile.targetRoleId);
      }
    });
    showToast('info', 'Profile Active', `Loaded custom profile for ${customCandidateProfile.name}.`);
  };

  const [evaluatorCandidates, setEvaluatorCandidates] = useState<UserProfile[]>([]);

  // Evaluator adds a new candidate for audit and scoring
  const addEvaluatorCandidate = (data: {
    name: string;
    targetRole: string;
    experienceLevel?: string;
    bio?: string;
    resumeText?: string;
    githubUrl?: string;
    customSkills?: Record<string, any>;
    detectedSkills?: Array<{ skillId: string; skillName: string; confidence: number }>;
    aiEfficiencyScore?: number;
  }) => {
    const targetRoleMeta = CAREER_ROLES.find(r => r.id === data.targetRole) || CAREER_ROLES[0];
    const candidateId = `eval-subject-${Date.now()}`;

    // Build initial skills mapped to target role
    const initialSkills: Record<string, UserSkill> = data.customSkills || {};
    
    // Ingest skills extracted by Groq AI from resume document
    if (data.detectedSkills && data.detectedSkills.length > 0) {
      data.detectedSkills.forEach(det => {
        initialSkills[det.skillId] = {
          id: det.skillId,
          name: det.skillName,
          category: 'fundamentals',
          state: 'evidenced',
          confidence: Math.min(100, Math.max(45, det.confidence || 80)),
          evidenceStrength: Math.min(1, Math.max(0.4, (data.aiEfficiencyScore || 85) / 100)),
          proficiency: (det.confidence || 80) >= 80 ? 'Advanced' : 'Intermediate',
          evidenceSources: ['Resume Document Ingestion (Groq AI)']
        };
      });
    }

    if (Object.keys(initialSkills).length === 0) {
      targetRoleMeta.requiredSkills.forEach((req, idx) => {
        const isSatisfied = idx % 2 === 0;
        initialSkills[req.skillId] = {
          id: req.skillId,
          name: req.skillId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          category: 'fundamentals',
          state: isSatisfied ? 'evidenced' : 'claimed',
          confidence: isSatisfied ? 75 : 35,
          evidenceStrength: isSatisfied ? 0.75 : 0.25,
          proficiency: req.requiredLevel,
          evidenceSources: [data.githubUrl ? `GitHub: ${data.githubUrl}` : 'Evaluator Ingested Dossier']
        };
      });
    }

    const newProfile: UserProfile = {
      id: candidateId,
      name: data.name.trim() || 'Evaluator Candidate',
      targetRoleId: targetRoleMeta.id,
      avatarSeed: data.name.toLowerCase().replace(/\s+/g, '-'),
      headline: `${data.experienceLevel || 'Candidate'} · ${targetRoleMeta.title}`,
      bio: data.bio?.trim() || (data.resumeText ? data.resumeText.slice(0, 160) : `Candidate enrolled by Evaluator for forensic evaluation against ${targetRoleMeta.title}.`),
      education: [
        {
          institution: 'Accredited Technical Program',
          degree: 'Bachelor of Science',
          field: 'Computer Systems',
          graduationYear: 2024
        }
      ],
      experience: [
        {
          title: `${data.experienceLevel || 'Software'} Engineer`,
          company: 'Technical Systems',
          period: '2023 - Present',
          highlights: ['Engineered production modules', 'Maintained automated code quality'],
          skillsUsed: Object.keys(initialSkills).slice(0, 4)
        }
      ],
      artifacts: data.githubUrl ? [
        {
          id: `art-eval-${Date.now()}`,
          sourceType: 'github_repo',
          title: `GitHub: ${data.githubUrl}`,
          url: data.githubUrl,
          date: new Date().toISOString().split('T')[0],
          extractedSkills: Object.keys(initialSkills).slice(0, 5),
          evidenceStrength: 0.8,
          verificationState: 'evidenced',
          metadata: {
            notes: data.bio || 'Evaluator verified GitHub artifact'
          }
        }
      ] : (data.resumeText ? [
        {
          id: `art-eval-doc-${Date.now()}`,
          sourceType: 'project_portfolio',
          title: `${data.name.trim()} - Evaluator Dossier`,
          date: new Date().toISOString().split('T')[0],
          extractedSkills: Object.keys(initialSkills).slice(0, 5),
          evidenceStrength: 0.75,
          verificationState: 'evidenced',
          metadata: {
            notes: data.resumeText.slice(0, 200)
          }
        }
      ] : []),
      skills: initialSkills,
      assessmentHistory: [],
      trajectoryLog: [
        {
          timestamp: new Date().toISOString().split('T')[0],
          event: `Enrolled by Evaluator for role verification against ${targetRoleMeta.title}`,
          affectedSkill: 'Forensic Ingestion',
          deltaConfidence: 0
        }
      ]
    };

    setEvaluatorCandidates(prev => [...prev, newProfile]);
    saveCandidateAccount({
      name: newProfile.name,
      email: `${newProfile.name.toLowerCase().replace(/\s+/g, '.')}@candidate.audition`,
      targetRole: targetRoleMeta.id,
      experienceLevel: data.experienceLevel || 'Senior (4-7 yrs)',
      bio: data.bio || '',
      resumeText: data.resumeText,
      aiEfficiencyScore: data.aiEfficiencyScore,
    });

    startTransition(() => {
      setActivePersonaId(candidateId);
      setUserProfile(newProfile);
      setSelectedRoleId(targetRoleMeta.id);
    });

    showToast('success', 'Candidate Added for Evaluation', `Added ${newProfile.name} to Evaluator roster. 6-Factor deterministic audit active.`);
  };

  // When switching personas — now choreographed and updates custom state if active
  const resetToPersona = (personaId: string) => {
    if (isTransitioning) return; // Prevent double-switch

    startTransition(() => {
      // If current profile is custom, preserve it in customCandidateProfile before switching
      if (userProfile.isCustomCandidate) {
        setCustomCandidateProfile(userProfile);
      }

      setActivePersonaId(personaId);

      // 1. Check if it's an evaluator-added candidate
      const evalCandidate = evaluatorCandidates.find(c => c.id === personaId);
      if (evalCandidate) {
        setUserProfile(JSON.parse(JSON.stringify(evalCandidate)));
        if (evalCandidate.targetRoleId) setSelectedRoleId(evalCandidate.targetRoleId);
        return;
      }

      // 2. Check if custom candidate
      if (personaId === 'custom-candidate' && customCandidateProfile) {
        setUserProfile(JSON.parse(JSON.stringify(customCandidateProfile)));
        if (customCandidateProfile.targetRoleId) setSelectedRoleId(customCandidateProfile.targetRoleId);
        return;
      }

      // 3. Fallback to seed personas
      const profile = JSON.parse(JSON.stringify(SEED_PERSONAS[personaId] || SEED_PERSONAS['persona-a']));
      setUserProfile(profile);
      
      if (personaId === 'persona-a') setSelectedRoleId('frontend-engineer');
      else if (personaId === 'persona-b') setSelectedRoleId('data-analyst');
      else setSelectedRoleId('ml-engineer');
    });

    const candidateName = evaluatorCandidates.find(c => c.id === personaId)?.name 
      || (personaId === 'custom-candidate' ? customCandidateProfile?.name : undefined)
      || SEED_PERSONAS[personaId]?.name 
      || 'Subject';

    showToast('info', 'Persona Recalibrated', `Intelligence instrument recalibrated for ${candidateName}.`);
  };

  const showToast = (type: 'success' | 'info' | 'warning', title: string, message: string) => {
    const id = Math.random().toString();
    setToast({ id, type, title, message });
    setTimeout(() => {
      setToast(current => current?.id === id ? null : current);
    }, 4500);
  };

  // Re-calculate role matching deterministically whenever userProfile changes
  const allRoleMatches = useMemo(() => {
    return matchAllRoles(userProfile, CAREER_ROLES);
  }, [userProfile]);

  const selectedRole = useMemo(() => {
    return CAREER_ROLES.find(r => r.id === selectedRoleId) || CAREER_ROLES[0];
  }, [selectedRoleId]);

  const selectedRoleMatch = useMemo(() => {
    return calculateRoleMatch(userProfile, selectedRole);
  }, [userProfile, selectedRole]);

  const bentoFocus = useBentoFocus(
    allRoleMatches.readyNow,
    allRoleMatches.reachable,
    activePersonaId
  );

  const launchAssessment = (skillId: string) => {
    setActiveAssessmentSkillId(skillId);
    setActiveScreen('assessment');
  };

  const closeAssessment = () => {
    setActiveAssessmentSkillId(null);
  };

  const submitAssessment = (skillId: string, score: number, passed: boolean) => {
    const { updatedProfile, deltaConfidence, newConfidence } = applyAssessmentUpdate(
      userProfile,
      skillId,
      score,
      passed
    );

    setUserProfile(updatedProfile);

    const prevRoleScore = selectedRoleMatch.overallScore;
    const newRoleMatch = calculateRoleMatch(updatedProfile, selectedRole);
    const deltaRole = newRoleMatch.overallScore - prevRoleScore;

    showToast(
      'success',
      `Assessment Verified: ${score}%`,
      `${skillId} confidence upgraded to ${newConfidence}% (+${deltaConfidence}%). ${selectedRole.title} readiness is now ${newRoleMatch.overallScore}% (${deltaRole >= 0 ? '+' : ''}${deltaRole}%).`
    );
  };

  return (
    <AppContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        appMode,
        setAppMode,
        activePersonaId,
        setActivePersonaId: resetToPersona,
        userProfile,
        setUserProfile,
        selectedRoleId,
        setSelectedRoleId,
        selectedRoleMatch,
        allRoleMatches,
        explainDrawerRoleId,
        setExplainDrawerRoleId,
        activeAssessmentSkillId,
        launchAssessment,
        closeAssessment,
        submitAssessment,
        toast,
        showToast,
        resetToPersona,
        customCandidateProfile,
        evaluatorCandidates,
        addEvaluatorCandidate,
        candidateUser,
        isCandidateSignedIn: candidateUser !== null,
        loginCandidate,
        logoutCandidate,
        registerCandidateProfile,
        savedCandidateAccounts,
        switchToCustomCandidate,
        transitionPhase,
        isTransitioning,
        transitionPhaseLabel,
        bentoFocus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
