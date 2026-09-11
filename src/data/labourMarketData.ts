export interface LabourMarketSignal {
  skillId: string;
  skillName: string;
  demandIndex: number; // 0-100
  yearOverYearGrowth: string;
  topHiringIndustries: string[];
  medianSalaryPremium: string;
  sampleJobPostingsAnalyzed: number;
  dataSource: 'Curated Benchmark Labour Reference (O*NET & Industry Sample)';
}

export const LABOUR_MARKET_REFERENCE: Record<string, LabourMarketSignal> = {
  'react-core': {
    skillId: 'react-core',
    skillName: 'React & Component Architecture',
    demandIndex: 94,
    yearOverYearGrowth: '+18.4%',
    topHiringIndustries: ['Fintech', 'SaaS / Cloud Platforms', 'E-Commerce', 'HealthTech'],
    medianSalaryPremium: '+$18,000 / yr',
    sampleJobPostingsAnalyzed: 42300,
    dataSource: 'Curated Benchmark Labour Reference (O*NET & Industry Sample)',
  },
  'typescript': {
    skillId: 'typescript',
    skillName: 'TypeScript & Type Systems',
    demandIndex: 96,
    yearOverYearGrowth: '+29.1%',
    topHiringIndustries: ['Enterprise Software', 'Fintech', 'Developer Tooling'],
    medianSalaryPremium: '+$14,500 / yr',
    sampleJobPostingsAnalyzed: 38900,
    dataSource: 'Curated Benchmark Labour Reference (O*NET & Industry Sample)',
  },
  'relational-sql': {
    skillId: 'relational-sql',
    skillName: 'Relational Databases & SQL',
    demandIndex: 97,
    yearOverYearGrowth: '+14.2%',
    topHiringIndustries: ['Financial Services', 'Supply Chain', 'Analytics & BI', 'Healthcare'],
    medianSalaryPremium: '+$16,000 / yr',
    sampleJobPostingsAnalyzed: 65100,
    dataSource: 'Curated Benchmark Labour Reference (O*NET & Industry Sample)',
  },
  'docker-containers': {
    skillId: 'docker-containers',
    skillName: 'Docker & Containerization',
    demandIndex: 92,
    yearOverYearGrowth: '+24.5%',
    topHiringIndustries: ['Cloud Infrastructure', 'AI Labs', 'Enterprise SaaS'],
    medianSalaryPremium: '+$21,000 / yr',
    sampleJobPostingsAnalyzed: 31200,
    dataSource: 'Curated Benchmark Labour Reference (O*NET & Industry Sample)',
  },
  'ml-algorithms': {
    skillId: 'ml-algorithms',
    skillName: 'Applied Machine Learning',
    demandIndex: 95,
    yearOverYearGrowth: '+36.8%',
    topHiringIndustries: ['Autonomous Systems', 'AdTech', 'Quantitative Finance', 'Bioinformatics'],
    medianSalaryPremium: '+$28,000 / yr',
    sampleJobPostingsAnalyzed: 28400,
    dataSource: 'Curated Benchmark Labour Reference (O*NET & Industry Sample)',
  },
  'bi-visualization': {
    skillId: 'bi-visualization',
    skillName: 'BI Dashboards (Power BI / Tableau)',
    demandIndex: 89,
    yearOverYearGrowth: '+21.0%',
    topHiringIndustries: ['Consulting', 'Retail Banking', 'Operations Logistics', 'Marketing Analytics'],
    medianSalaryPremium: '+$12,500 / yr',
    sampleJobPostingsAnalyzed: 29800,
    dataSource: 'Curated Benchmark Labour Reference (O*NET & Industry Sample)',
  },
  'system-design': {
    skillId: 'system-design',
    skillName: 'System Design & Distributed Architectures',
    demandIndex: 98,
    yearOverYearGrowth: '+27.4%',
    topHiringIndustries: ['High-Frequency Trading', 'Hyper-scale Cloud', 'Streaming Platforms'],
    medianSalaryPremium: '+$32,000 / yr',
    sampleJobPostingsAnalyzed: 22100,
    dataSource: 'Curated Benchmark Labour Reference (O*NET & Industry Sample)',
  },
};
