# Code Map — Guided Codebase Tour

## 1. Directory Structure

```text
src/
├── types/
│   └── index.ts                 # Master TypeScript interfaces and data contracts
├── data/
│   ├── skillsTaxonomy.ts        # Standardized taxonomy: 50+ skills, categories, prereqs
│   ├── rolesDatabase.ts         # 10+ career roles with weighted competency requirements
│   ├── labourMarketData.ts      # Curated reference labour data, demand tiers, growth
│   ├── learningResources.ts     # Structured catalog with mapped capstone projects
│   ├── assessmentsDatabase.ts   # Interactive skill validation tests with rubrics
│   └── seedPersonas.ts          # Personas A, B, and C with realistic evidence dossiers
├── services/
│   ├── evidenceEngine.ts        # Normalization & 4-tier epistemic state assignment
│   ├── scoringEngine.ts         # 6-factor deterministic career matching & blocker penalties
│   ├── gapEngine.ts             # Directed Acyclic Graph (DAG) construction & topological sort
│   ├── competencyEngine.ts      # Bayesian incremental skill confidence & calibration
│   ├── aiExtractionService.ts   # AI semantic parser with deterministic fallback
│   └── explainabilityService.ts # Dynamic arithmetic telemetry and human-readable traces
├── context/
│   └── AppContext.tsx           # Global state provider for active persona & assessment events
└── components/
    ├── layout/
    │   ├── Header.tsx           # Telemetry header, status tags, active persona switcher
    │   └── Navigation.tsx       # Instrument tab bar
    ├── dossier/
    │   └── EvidenceDossier.tsx  # Signature evidence archive with skeuomorphic stamps
    ├── common/
    │   └── ExplainabilityDrawer.tsx # Deep telemetry breakdown side-drawer
    └── screens/
        ├── LandingScreen.tsx            # Intro, core differentiator, persona demo kick-off
        ├── ProfileScreen.tsx            # Multi-source profile input (text, cert, GitHub)
        ├── SkillIntelligenceScreen.tsx  # Claimed vs Evidenced radar & confidence meters
        ├── CareerIntelligenceScreen.tsx # Ready Now vs Reachable tabs & role cards
        ├── CareerDetailScreen.tsx       # Requirement matrix, blocker analysis, demand tag
        ├── GapIntelligenceScreen.tsx    # Interactive Prerequisite DAG visualizer
        ├── LearningJourneyScreen.tsx    # Structured resource path with effort estimates
        ├── AssessmentScreen.tsx         # Interactive skill quiz with live recalculation
        └── ProgressTrajectoryScreen.tsx # Skill audit log, trajectory timeline, confidence delta
```

---

## 2. Key Critical Functions

### `calculateRoleMatch(userProfile, role): RoleMatchResult`
- **File**: `src/services/scoringEngine.ts`
- **Importance**: The core deterministic engine deciding whether a candidate is Ready Now vs Reachable.

### `buildPrerequisiteDAG(targetRole, userSkills): PrerequisiteDAG`
- **File**: `src/services/gapEngine.ts`
- **Importance**: Traverses prerequisites and executes topological sort to answer *"What to learn first?"*.

### `applyAssessmentResult(skill, score, passed): UserSkill`
- **File**: `src/services/competencyEngine.ts`
- **Importance**: Applies Bayesian confidence updates and recalculates role readiness live.
