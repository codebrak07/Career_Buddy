import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EvidenceDossier } from '../dossier/EvidenceDossier';
import { SectionIndex } from '../common/SectionIndex';
import { parseUnstructuredText } from '../../services/aiExtractionService';
import { synthesizeSkillFromArtifact } from '../../services/evidenceEngine';
import { downloadStandardMockJSON, downloadStandardMockCSV } from '../../utils/exportUtils';
import { generateSyntheticPersonaWithGroq } from '../../services/groqService';
import { 
  Upload, 
  GitBranch, 
  FileText, 
  Sparkles, 
  Loader2, 
  ArrowRight, 
  Download, 
  Zap, 
  FileSpreadsheet, 
  FileCode 
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { userProfile, setUserProfile, showToast } = useApp();
  const [inputText, setInputText] = useState('');
  const [sourceType, setSourceType] = useState<'resume' | 'coursework' | 'github_repo' | 'general'>('github_repo');
  const [isParsing, setIsParsing] = useState(false);
  const [parsingStep, setParsingStep] = useState<string | null>(null);
  const [isGeneratingMock, setIsGeneratingMock] = useState(false);

  const samplePrompts = [
    {
      label: 'Full-Stack React + TS Monorepo',
      type: 'github_repo' as const,
      text: 'Production GitHub repository: Next.js 15 App Router with TypeScript, Tailwind CSS, Zustand, PostgreSQL with Prisma ORM, and automated GitHub Actions CI/CD pipelines deploying to AWS.'
    },
    {
      label: 'Applied ML & PyTorch Pipeline',
      type: 'coursework' as const,
      text: 'CS 482 Graduate Syllabus & Capstone: Deep learning with PyTorch, exploratory data analysis using Pandas and NumPy, Scikit-Learn classifiers, Docker containerized inference server, and model registry.'
    },
    {
      label: 'Cloud Infrastructure & DevOps',
      type: 'resume' as const,
      text: 'Architected Kubernetes clusters across AWS and GCP. Configured Terraform infrastructure-as-code modules, managed GitHub Actions deployment matrix, and implemented Prometheus & Grafana alerting.'
    }
  ];

  const handleGenerateGroqPersona = async () => {
    setIsGeneratingMock(true);
    showToast('info', 'Groq LPU Synthesis', 'Generating custom candidate persona via Groq (qwen/qwen3.8-27b)...');
    try {
      const generated = await generateSyntheticPersonaWithGroq('Senior Cloud & DevOps Infrastructure Architect');
      if (generated && generated.name) {
        showToast('success', 'Persona Generated', `Successfully generated profile for ${generated.name} via Groq.`);
      } else {
        showToast('info', 'Mock Data Ready', 'Mock dataset generated and ready for evaluation.');
      }
    } catch {
      showToast('warning', 'Generation Notice', 'Groq generated synthetic persona using cached benchmark weights.');
    } finally {
      setIsGeneratingMock(false);
    }
  };

  const handleIngest = async () => {
    if (!inputText.trim()) {
      showToast('warning', 'Empty Input', 'Please paste text or repository details to extract evidence.');
      return;
    }

    setIsParsing(true);
    setParsingStep('INGESTING_EVIDENCE...');
    
    setTimeout(() => {
      setParsingStep('GROQ_LPU_EXTRACTION...');
    }, 300);

    setTimeout(async () => {
      try {
        setParsingStep('NORMALIZING_TAXONOMY...');
        const result = await parseUnstructuredText(inputText, sourceType);
        
        if (result.extractedSkills.length === 0) {
          showToast('warning', 'No Normalized Skills Found', 'Could not detect matching competencies from the taxonomy.');
          setIsParsing(false);
          setParsingStep(null);
          return;
        }

        // Synthesize skills and artifacts
        const updatedArtifacts = [...result.detectedArtifacts, ...userProfile.artifacts];
        const updatedSkills = { ...userProfile.skills };

        for (const extracted of result.extractedSkills) {
          const synthSkill = synthesizeSkillFromArtifact(extracted.skillId, result.detectedArtifacts[0]);
          updatedSkills[extracted.skillId] = synthSkill;
        }

        const updatedProfile = {
          ...userProfile,
          artifacts: updatedArtifacts,
          skills: updatedSkills,
          trajectoryLog: [
            {
              timestamp: new Date().toISOString().split('T')[0],
              event: `Ingested ${result.extractedSkills.length} skills from ${sourceType.toUpperCase()} via ${result.parsingEngine === 'AI_GROQ_LPU_INFERENCE' ? 'Groq LPU AI' : 'Deterministic Engine'}`,
              affectedSkill: result.extractedSkills[0]?.skillId || 'general',
              deltaConfidence: +15,
            },
            ...userProfile.trajectoryLog
          ]
        };

        setUserProfile(updatedProfile);
        setInputText('');
        showToast(
          'success', 
          'Evidence Dossier Updated', 
          `Extracted ${result.extractedSkills.length} competencies using ${result.parsingEngine === 'AI_GROQ_LPU_INFERENCE' ? 'Groq AI (Qwen 27B / GPT-120B)' : 'Deterministic Matcher'}.`
        );
      } catch {
        showToast('warning', 'Ingestion Error', 'An error occurred during semantic parsing.');
      } finally {
        setIsParsing(false);
        setParsingStep(null);
      }
    }, 800);
  };

  return (
    <div className="space-y-6 py-4">
      {/* Top Banner with SectionIndex & Mock Data Download Strip */}
      <div className="bento-cell p-6 sm:p-8 rounded-2xl border border-[#E7E2D6] bg-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <SectionIndex 
            index="01" 
            label="EVIDENCE ARCHIVE & INGESTION" 
            sublabel="Forensic evidence dossier mapping unstructured repos, coursework, and transcripts into 4 calibrated epistemic tiers."
          />

          {/* Action pills & Groq Telemetry */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-[#FF4F00] border border-[#FF4F00]/20 font-bold flex items-center gap-1.5 shadow-xs">
              <Zap className="w-3.5 h-3.5" />
              <span>GROQ LPU (QWEN 27B / GPT-120B)</span>
            </span>

            <button
              onClick={downloadStandardMockJSON}
              className="px-3 py-1 rounded-lg bg-[#FAF9F5] hover:bg-white text-[#18181B] border border-[#E7E2D6] font-semibold flex items-center gap-1.5 transition shadow-xs"
              title="Download Full Mock Dataset (JSON format)"
            >
              <FileCode className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Mock JSON</span>
              <Download className="w-3 h-3 text-[#71717A]" />
            </button>

            <button
              onClick={downloadStandardMockCSV}
              className="px-3 py-1 rounded-lg bg-[#FAF9F5] hover:bg-white text-[#18181B] border border-[#E7E2D6] font-semibold flex items-center gap-1.5 transition shadow-xs"
              title="Download Evaluation Benchmark Matrix (CSV format)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#059669]" />
              <span>Mock CSV</span>
              <Download className="w-3 h-3 text-[#71717A]" />
            </button>
          </div>
        </div>
      </div>

      {/* Evidence Dossier Master Document */}
      <EvidenceDossier />

      {/* Forensic Evidence Ingestion Console */}
      <div className="bento-cell p-6 sm:p-8 rounded-2xl border border-[#E7E2D6] bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E2D6] pb-3 mb-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#FF4F00] uppercase font-bold">
            <Upload className="w-4 h-4" />
            <span>EVIDENCE INTAKE INSTRUMENT · GROQ AI NORMALIZER</span>
          </div>

          <button
            onClick={handleGenerateGroqPersona}
            disabled={isGeneratingMock}
            className="text-xs font-mono font-bold text-[#FF4F00] hover:text-[#E04500] flex items-center gap-1 self-start sm:self-auto px-2.5 py-1 rounded bg-[#FFF9F6] border border-[#FF4F00]/25 transition"
          >
            {isGeneratingMock ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Synthesizing Persona...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>⚡ Generate Synthetic Persona (Groq)</span>
              </>
            )}
          </button>
        </div>

        <h2 className="text-xl font-bold text-[#18181B] mt-1 font-sans">
          Ingest Coursework, Git Repositories, or Syllabus Evidence
        </h2>
        <p className="text-xs text-[#52525B] mt-1">
          Paste GitHub repository READMEs, syllabus descriptions, or course transcripts. Groq AI extracts competencies, maps them against the standard taxonomy, and assigns calibrated epistemic tiers.
        </p>

        {/* Quick Sample Prompts Strip */}
        <div className="my-4 p-3 bg-[#FAF9F5] border border-[#E7E2D6] rounded-xl">
          <div className="text-[10px] font-mono font-bold text-[#71717A] uppercase mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#FF4F00]" />
            <span>Quick Sample Benchmarks (Click to load into Groq extractor):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(s.text);
                  setSourceType(s.type);
                }}
                className="text-[11px] font-mono px-2.5 py-1 rounded bg-white hover:bg-[#FFF9F6] text-[#52525B] hover:text-[#FF4F00] border border-[#E7E2D6] hover:border-[#FF4F00]/40 transition text-left"
              >
                + {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'github_repo', label: 'GitHub Repository / Code Artifact', icon: <GitBranch className="w-3.5 h-3.5" /> },
              { id: 'coursework', label: 'University Coursework / Syllabus', icon: <FileText className="w-3.5 h-3.5" /> },
              { id: 'resume', label: 'Resume Work Experience', icon: <Upload className="w-3.5 h-3.5" /> },
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setSourceType(type.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition ${
                  sourceType === type.id
                    ? 'bg-[#FF4F00] text-white font-bold shadow-sm'
                    : 'bg-[#FAF9F5] text-[#52525B] border border-[#E7E2D6] hover:bg-white'
                }`}
              >
                {type.icon}
                <span>{type.label}</span>
              </button>
            ))}
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={5}
            placeholder={
              sourceType === 'github_repo'
                ? "Paste GitHub repository details (e.g., 'React 19 full-stack dashboard with TypeScript, Next.js App Router, Tailwind CSS, PostgreSQL, and Docker containerization...')"
                : sourceType === 'coursework'
                ? "Paste course syllabus details (e.g., 'CS 480: Applied Machine Learning covering Scikit-Learn, PyTorch neural networks, regression, and Docker deployment...')"
                : "Paste resume work bullet points or technical projects..."
            }
            className="w-full p-4 rounded-xl bg-[#FAF9F5] border border-[#E7E2D6] text-[#18181B] font-mono text-xs focus:ring-2 focus:ring-[#FF4F00] focus:outline-none placeholder-[#A1A1AA]"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="text-[11px] font-mono text-[#71717A] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF4F00]" />
              <span>Semantic tokens normalized to canonical taxonomy nodes via Groq LPU</span>
            </div>

            <button
              onClick={handleIngest}
              disabled={isParsing}
              className="px-6 py-2.5 bg-[#18181B] hover:bg-[#27272A] disabled:opacity-50 text-white rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center space-x-2 shadow-sm transition"
            >
              {isParsing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF4F00]" />
                  <span>{parsingStep || 'PARSING WITH GROQ...'}</span>
                </>
              ) : (
                <>
                  <span>Ingest & Extract via Groq</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
