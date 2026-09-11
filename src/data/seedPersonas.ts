import type { UserProfile } from '../types';

export const SEED_PERSONAS: Record<string, UserProfile> = {
  'persona-a': {
    id: 'persona-a',
    name: 'Elena Rostova',
    avatarSeed: 'elena',
    headline: 'Frontend Engineer & UI Systems Architect',
    bio: 'CS graduate with 2+ years building accessible component libraries, state management architectures, and high-performance React web applications.',
    education: [
      {
        institution: 'University of Washington',
        degree: 'B.S. Computer Science',
        field: 'Human-Computer Interaction & Systems',
        graduationYear: 2024,
        gpa: '3.82',
      }
    ],
    experience: [
      {
        title: 'Frontend Engineering Intern',
        company: 'Veloce Cloud Systems',
        period: 'Jun 2023 - Sep 2023',
        highlights: [
          'Migrated legacy dashboard to React 18 with TypeScript, cutting bundle load time by 34%.',
          'Authored 14 core design system primitives in Storybook with full WCAG AAA keyboard navigation.',
          'Integrated React Query caching layer, reducing redundant API round-trips by 60%.'
        ],
        skillsUsed: ['react-core', 'typescript', 'javascript-core', 'tailwind-css', 'git-vcs']
      }
    ],
    artifacts: [
      {
        id: 'art-gh-design-tokens',
        sourceType: 'github_repo',
        title: 'GitHub: elena/obsidian-ui-tokens',
        url: 'https://github.com/elena/obsidian-ui-tokens',
        date: '2024-03-15',
        extractedSkills: ['react-core', 'typescript', 'tailwind-css', 'html-css', 'git-vcs'],
        evidenceStrength: 0.88,
        verificationState: 'evidenced',
        metadata: {
          repoStats: {
            stars: 142,
            commits: 320,
            languages: ['TypeScript', 'CSS', 'HTML']
          },
          notes: 'Full monorepo with automated GitHub Actions CI/CD and npm distribution.'
        }
      },
      {
        id: 'art-cert-frontend-masters',
        sourceType: 'certification',
        title: 'Frontend Masters: Enterprise TypeScript & React Architecture',
        date: '2023-11-20',
        extractedSkills: ['typescript', 'react-core'],
        evidenceStrength: 0.65,
        verificationState: 'detected',
        metadata: {
          institution: 'Frontend Masters',
          grade: 'Verified Completion',
        }
      }
    ],
    skills: {
      'javascript-core': {
        id: 'javascript-core',
        name: 'Modern JavaScript (ES6+)',
        category: 'frontend',
        state: 'validated',
        confidence: 94,
        evidenceStrength: 0.95,
        proficiency: 'Advanced',
        evidenceSources: ['GitHub: obsidian-ui-tokens', 'Internship: Veloce Cloud', 'Technical Assessment: 92%'],
        lastValidated: '2024-04-10'
      },
      'typescript': {
        id: 'typescript',
        name: 'TypeScript & Type Systems',
        category: 'frontend',
        state: 'validated',
        confidence: 92,
        evidenceStrength: 0.92,
        proficiency: 'Advanced',
        evidenceSources: ['GitHub: obsidian-ui-tokens', 'Cert: Frontend Masters'],
        lastValidated: '2024-03-15'
      },
      'react-core': {
        id: 'react-core',
        name: 'React & Component Architecture',
        category: 'frontend',
        state: 'validated',
        confidence: 90,
        evidenceStrength: 0.90,
        proficiency: 'Advanced',
        evidenceSources: ['GitHub: obsidian-ui-tokens', 'Internship: Veloce Cloud'],
        lastValidated: '2024-03-20'
      },
      'html-css': {
        id: 'html-css',
        name: 'Semantic HTML5 & Modern CSS3',
        category: 'frontend',
        state: 'evidenced',
        confidence: 88,
        evidenceStrength: 0.85,
        proficiency: 'Advanced',
        evidenceSources: ['GitHub: obsidian-ui-tokens'],
      },
      'tailwind-css': {
        id: 'tailwind-css',
        name: 'Tailwind CSS & Design Tokens',
        category: 'frontend',
        state: 'evidenced',
        confidence: 85,
        evidenceStrength: 0.85,
        proficiency: 'Intermediate',
        evidenceSources: ['GitHub: obsidian-ui-tokens'],
      },
      'git-vcs': {
        id: 'git-vcs',
        name: 'Git & Version Control',
        category: 'fundamentals',
        state: 'evidenced',
        confidence: 86,
        evidenceStrength: 0.80,
        proficiency: 'Intermediate',
        evidenceSources: ['320 commits across GitHub repos'],
      },
      'prog-foundations': {
        id: 'prog-foundations',
        name: 'Programming Fundamentals',
        category: 'fundamentals',
        state: 'validated',
        confidence: 92,
        evidenceStrength: 0.90,
        proficiency: 'Advanced',
        evidenceSources: ['B.S. Computer Science Transcript'],
      },
      'nextjs-fullstack': {
        id: 'nextjs-fullstack',
        name: 'Next.js & Full-Stack React',
        category: 'frontend',
        state: 'claimed',
        confidence: 45,
        evidenceStrength: 0.25,
        proficiency: 'Beginner',
        evidenceSources: ['Self-reported claim'],
      },
      'relational-sql': {
        id: 'relational-sql',
        name: 'Relational Databases & SQL',
        category: 'backend',
        state: 'detected',
        confidence: 40,
        evidenceStrength: 0.35,
        proficiency: 'Beginner',
        evidenceSources: ['Course: Intro to Relational DBs (Grade: B)'],
      }
    },
    assessmentHistory: [
      {
        assessmentId: 'assess-react',
        skillId: 'react-core',
        score: 95,
        passed: true,
        date: '2024-04-10'
      }
    ],
    trajectoryLog: [
      {
        timestamp: '2024-04-10',
        event: 'Passed React Advanced Assessment (95%)',
        affectedSkill: 'react-core',
        deltaConfidence: +14,
        readinessDeltaRole: 'frontend-engineer',
        readinessDeltaScore: +8
      }
    ]
  },

  'persona-b': {
    id: 'persona-b',
    name: 'Marcus Vance',
    avatarSeed: 'marcus',
    headline: 'Data Analyst & Quantitative Insights Specialist',
    bio: 'Economics & Statistics background with deep experience querying complex relational databases, statistical hypothesis modeling, and executive KPI reporting.',
    education: [
      {
        institution: 'University of Michigan',
        degree: 'B.S. Applied Statistics & Economics',
        field: 'Quantitative Analytics & Econometrics',
        graduationYear: 2024,
        gpa: '3.75',
      }
    ],
    experience: [
      {
        title: 'Business Intelligence Analyst Intern',
        company: 'Meridian Capital Partners',
        period: 'May 2023 - Aug 2023',
        highlights: [
          'Engineered complex SQL window queries across 4M+ transaction records to detect revenue anomalies.',
          'Built statistical regression models identifying customer churn drivers with 84% predictive precision.',
          'Presented weekly executive summaries to senior portfolio leadership.'
        ],
        skillsUsed: ['relational-sql', 'math-stats', 'exploratory-analytics', 'numpy-pandas']
      }
    ],
    artifacts: [
      {
        id: 'art-gh-sql-analytics',
        sourceType: 'github_repo',
        title: 'GitHub: marcus/fintech-churn-modeling',
        url: 'https://github.com/marcus/fintech-churn-modeling',
        date: '2024-02-18',
        extractedSkills: ['relational-sql', 'numpy-pandas', 'exploratory-analytics', 'math-stats'],
        evidenceStrength: 0.85,
        verificationState: 'evidenced',
        metadata: {
          repoStats: {
            stars: 48,
            commits: 110,
            languages: ['SQL', 'Python', 'Jupyter']
          },
          notes: 'Contains 2,000 lines of normalized SQL queries and Python exploratory analysis notebooks.'
        }
      },
      {
        id: 'art-transcript-stats',
        sourceType: 'coursework',
        title: 'University Transcript: STAT 425 (Applied Regression Analysis)',
        date: '2023-12-15',
        extractedSkills: ['math-stats', 'exploratory-analytics'],
        evidenceStrength: 0.80,
        verificationState: 'evidenced',
        metadata: {
          institution: 'University of Michigan',
          grade: 'Grade: A',
        }
      }
    ],
    skills: {
      'relational-sql': {
        id: 'relational-sql',
        name: 'Relational Databases & Advanced SQL',
        category: 'backend',
        state: 'validated',
        confidence: 92,
        evidenceStrength: 0.90,
        proficiency: 'Advanced',
        evidenceSources: ['GitHub: fintech-churn-modeling', 'Internship: Meridian Capital'],
        lastValidated: '2024-03-01'
      },
      'math-stats': {
        id: 'math-stats',
        name: 'Mathematics & Applied Statistics',
        category: 'fundamentals',
        state: 'evidenced',
        confidence: 88,
        evidenceStrength: 0.85,
        proficiency: 'Advanced',
        evidenceSources: ['STAT 425 Grade A', 'GitHub: fintech-churn-modeling'],
      },
      'exploratory-analytics': {
        id: 'exploratory-analytics',
        name: 'Exploratory Data Analysis (EDA)',
        category: 'data_ml',
        state: 'evidenced',
        confidence: 86,
        evidenceStrength: 0.85,
        proficiency: 'Advanced',
        evidenceSources: ['GitHub: fintech-churn-modeling'],
      },
      'numpy-pandas': {
        id: 'numpy-pandas',
        name: 'Data Manipulation (NumPy / Pandas)',
        category: 'data_ml',
        state: 'evidenced',
        confidence: 80,
        evidenceStrength: 0.75,
        proficiency: 'Intermediate',
        evidenceSources: ['GitHub: fintech-churn-modeling'],
      },
      'python-core': {
        id: 'python-core',
        name: 'Python Programming',
        category: 'backend',
        state: 'evidenced',
        confidence: 76,
        evidenceStrength: 0.70,
        proficiency: 'Intermediate',
        evidenceSources: ['Jupyter Analysis Scripts'],
      },
      'prog-foundations': {
        id: 'prog-foundations',
        name: 'Programming Fundamentals',
        category: 'fundamentals',
        state: 'validated',
        confidence: 88,
        evidenceStrength: 0.85,
        proficiency: 'Advanced',
        evidenceSources: ['University Coursework'],
      },
      'bi-visualization': {
        id: 'bi-visualization',
        name: 'BI Dashboards (Power BI / Tableau)',
        category: 'data_ml',
        state: 'claimed',
        confidence: 42,
        evidenceStrength: 0.20,
        proficiency: 'Beginner',
        evidenceSources: ['Self-reported claim (No dashboard portfolio link)'],
      },
      'ml-algorithms': {
        id: 'ml-algorithms',
        name: 'Applied Machine Learning',
        category: 'data_ml',
        state: 'detected',
        confidence: 50,
        evidenceStrength: 0.40,
        proficiency: 'Beginner',
        evidenceSources: ['STAT 425 Coursework'],
      }
    },
    assessmentHistory: [],
    trajectoryLog: [
      {
        timestamp: '2024-03-01',
        event: 'Imported GitHub Repository: fintech-churn-modeling',
        affectedSkill: 'relational-sql',
        deltaConfidence: +22,
        readinessDeltaRole: 'data-analyst',
        readinessDeltaScore: +18
      }
    ]
  },

  'persona-c': {
    id: 'persona-c',
    name: 'Devin Chen',
    avatarSeed: 'devin',
    headline: 'Machine Learning Explorer & Algorithms Student',
    bio: 'Computer Science sophomore who completed online machine learning and deep learning specializations, but currently lacks production containerization and deployment evidence.',
    education: [
      {
        institution: 'Georgia Tech',
        degree: 'B.S. Computer Science',
        field: 'Artificial Intelligence Track',
        graduationYear: 2026,
        gpa: '3.65',
      }
    ],
    experience: [
      {
        title: 'Undergraduate AI Research Assistant',
        company: 'GT Cognitive Systems Lab',
        period: 'Jan 2024 - Present',
        highlights: [
          'Trained benchmark PyTorch convolutional networks on CIFAR-100 dataset in Jupyter Notebooks.',
          'Assisted literature review for neural attention mechanism efficiency.'
        ],
        skillsUsed: ['python-core', 'math-stats', 'deep-learning']
      }
    ],
    artifacts: [
      {
        id: 'art-cert-deeplearning-ai',
        sourceType: 'certification',
        title: 'Coursera: Deep Learning Specialization (Andrew Ng)',
        date: '2023-10-10',
        extractedSkills: ['deep-learning', 'math-stats', 'python-core'],
        evidenceStrength: 0.55,
        verificationState: 'detected',
        metadata: {
          institution: 'DeepLearning.AI',
          notes: 'Completed theoretical video lectures and guided notebook assignments.'
        }
      },
      {
        id: 'art-gh-cifar-notebooks',
        sourceType: 'github_repo',
        title: 'GitHub: devin/vision-notebooks',
        url: 'https://github.com/devin/vision-notebooks',
        date: '2024-01-20',
        extractedSkills: ['python-core', 'deep-learning', 'numpy-pandas'],
        evidenceStrength: 0.60,
        verificationState: 'evidenced',
        metadata: {
          repoStats: {
            stars: 6,
            commits: 22,
            languages: ['Jupyter Notebook', 'Python']
          },
          notes: 'Single notebook exploratory code without Dockerfile or production API wrapper.'
        }
      }
    ],
    skills: {
      'prog-foundations': {
        id: 'prog-foundations',
        name: 'Programming Fundamentals',
        category: 'fundamentals',
        state: 'validated',
        confidence: 85,
        evidenceStrength: 0.80,
        proficiency: 'Intermediate',
        evidenceSources: ['Georgia Tech CS1331 Grade A'],
      },
      'python-core': {
        id: 'python-core',
        name: 'Python Programming',
        category: 'backend',
        state: 'evidenced',
        confidence: 78,
        evidenceStrength: 0.70,
        proficiency: 'Intermediate',
        evidenceSources: ['GitHub: vision-notebooks'],
      },
      'math-stats': {
        id: 'math-stats',
        name: 'Mathematics & Applied Statistics',
        category: 'fundamentals',
        state: 'evidenced',
        confidence: 75,
        evidenceStrength: 0.70,
        proficiency: 'Intermediate',
        evidenceSources: ['Linear Algebra & Probability Coursework'],
      },
      'numpy-pandas': {
        id: 'numpy-pandas',
        name: 'Data Manipulation (NumPy / Pandas)',
        category: 'data_ml',
        state: 'evidenced',
        confidence: 70,
        evidenceStrength: 0.65,
        proficiency: 'Intermediate',
        evidenceSources: ['GitHub: vision-notebooks'],
      },
      'ml-algorithms': {
        id: 'ml-algorithms',
        name: 'Applied Machine Learning',
        category: 'data_ml',
        state: 'detected',
        confidence: 60,
        evidenceStrength: 0.50,
        proficiency: 'Intermediate',
        evidenceSources: ['Coursera Cert: DeepLearning.AI'],
      },
      'deep-learning': {
        id: 'deep-learning',
        name: 'Deep Learning & Neural Networks',
        category: 'data_ml',
        state: 'evidenced',
        confidence: 68,
        evidenceStrength: 0.60,
        proficiency: 'Intermediate',
        evidenceSources: ['GitHub: vision-notebooks', 'Coursera Cert'],
      },
      'linux-shell': {
        id: 'linux-shell',
        name: 'Linux Systems & Bash Shell Scripting',
        category: 'devops_cloud',
        state: 'claimed',
        confidence: 35,
        evidenceStrength: 0.15,
        proficiency: 'Beginner',
        evidenceSources: ['Self-reported claim'],
      },
      'docker-containers': {
        id: 'docker-containers',
        name: 'Docker & Containerization',
        category: 'devops_cloud',
        state: 'claimed',
        confidence: 20,
        evidenceStrength: 0.10,
        proficiency: 'Beginner',
        evidenceSources: ['Self-reported claim (No Dockerfile artifact found)'],
      },
      'mlops-deployment': {
        id: 'mlops-deployment',
        name: 'MLOps & Model Deployment',
        category: 'data_ml',
        state: 'claimed',
        confidence: 15,
        evidenceStrength: 0.05,
        proficiency: 'Beginner',
        evidenceSources: ['Self-reported interest'],
      }
    },
    assessmentHistory: [],
    trajectoryLog: [
      {
        timestamp: '2024-01-20',
        event: 'Uploaded Jupyter Notebook: vision-notebooks',
        affectedSkill: 'deep-learning',
        deltaConfidence: +18,
        readinessDeltaRole: 'ml-engineer',
        readinessDeltaScore: +12
      }
    ]
  }
};
