# Evidence Model — Epistemic Proof Architecture

## 1. The Epistemic Lifecycle

```text
+-----------------------------------------------------------------------------------+
| 1. CLAIMED (User Input)                                                           |
| "I know AWS and Docker" (Zero artifact attached)                                  |
| Multiplier: 0.15 · Confidence: LOW · Action: Recommend Assessment or Repo Link   |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| 2. DETECTED (Semantic Parser)                                                     |
| Extracted from PDF Transcript / Syllabus: "CS301: Cloud Computing (Grade: B)"     |
| Multiplier: 0.35 · Confidence: MODERATE-LOW · Signal: Exposure / Academic         |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| 3. EVIDENCED (Artifact & Code Inspector)                                          |
| GitHub Repository: Dockerfile + docker-compose.yml with active commit history     |
| Multiplier: 0.75 · Confidence: STRONG · Signal: Contextual Practical Code         |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| 4. VALIDATED (Assessment & Benchmark)                                             |
| Completed timed 15-min Technical Assessment: 88% Score in Containerization       |
| Multiplier: 1.00 · Confidence: HIGHEST · Signal: Verified Active Problem Solving  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Evidence Artifact Schema

Every submitted artifact is stored in the user's Evidence Dossier:

```typescript
export interface EvidenceArtifact {
  id: string;
  sourceType: 'github_repo' | 'coursework' | 'certification' | 'project_portfolio' | 'assessment';
  title: string;
  url?: string;
  timestamp: string;
  extractedSkills: string[];
  evidenceStrength: number; // 0.0 to 1.0
  verificationState: 'unverified' | 'detected' | 'evidenced' | 'validated';
  metadata: {
    repoStars?: number;
    commitCount?: number;
    institution?: string;
    grade?: string;
    assessmentScore?: number;
  };
}
```

---

## 3. Evidence Strength Calibration Table

| Source Type | Verification Mechanism | Default Strength | Decay Rate (Annual) |
| :--- | :--- | :---: | :---: |
| **Direct Assessment** | Timed question validation | `0.90 - 1.00` | $5\%$ / yr |
| **GitHub Repo (Multi-file)** | Code parsing & structure match | `0.75 - 0.85` | $8\%$ / yr |
| **Course Project** | Submitted repository / zip link | `0.65 - 0.75` | $10\%$ / yr |
| **Accredited Certificate** | Credential ID verification | `0.40 - 0.55` | $12\%$ / yr |
| **Course Transcript** | Syllabus keyword matching | `0.30 - 0.40` | $15\%$ / yr |
| **Self Claim** | User form checkbox | `0.15` | N/A |
