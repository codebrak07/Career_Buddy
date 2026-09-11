import type { SkillAssessment } from '../types';

export const ASSESSMENTS_DATABASE: Record<string, SkillAssessment> = {
  'docker-containers': {
    id: 'assess-docker',
    skillId: 'docker-containers',
    skillName: 'Docker & Containerization',
    title: 'Containerization & Multi-Stage Architecture Assessment',
    difficulty: 'Intermediate',
    timeLimitMinutes: 10,
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        prompt: 'Which Dockerfile instruction creates an intermediate build artifact to significantly reduce final production image size?',
        codeSnippet: `FROM node:20 AS builder\nWORKDIR /app\nCOPY . .\nRUN npm run build\n\nFROM nginx:alpine\nCOPY --from=builder /app/dist /usr/share/nginx/html`,
        options: [
          'Multi-stage build using "COPY --from="',
          'Using docker-compose volume mounts',
          'Setting RUN npm prune --production in the same container layer',
          'Executing docker commit after runtime'
        ],
        correctOptionIndex: 0,
        explanation: 'Multi-stage builds allow separating build tooling from the final minimal runtime image (e.g. nginx:alpine), minimizing CVE exposure and image megabytes.'
      },
      {
        id: 'q2',
        prompt: 'What happens when you run `docker run -d -p 8080:80 my-app`?',
        options: [
          'Port 80 on host maps to 8080 in container, running in foreground',
          'Port 8080 on host maps to 80 in container, running detached in background',
          'Both ports 8080 and 80 are exposed to the public internet without port forwarding',
          'It mounts the current host directory to /8080 inside the container'
        ],
        correctOptionIndex: 1,
        explanation: 'The -d flag runs in detached mode (background), and -p host:container binds host port 8080 to container internal port 80.'
      },
      {
        id: 'q3',
        prompt: 'Why should sensitive secrets (e.g., API keys) NOT be passed via `ARG` or `ENV` directly in a production Dockerfile?',
        options: [
          'Because Docker automatically fails the build if it detects strings longer than 32 characters',
          'Because ENV and ARG values persist inside image layer metadata and can be viewed via `docker history`',
          'Because container runtimes encrypt ENV variables making them inaccessible to the application',
          'Because ARG variables only work when building on macOS hosts'
        ],
        correctOptionIndex: 1,
        explanation: 'Image layers are immutable and inspectable via `docker history` or `docker inspect`. Production deployments must use BuildKit secret mounts (`--mount=type=secret`) or runtime secret managers.'
      }
    ]
  },
  'bi-visualization': {
    id: 'assess-powerbi',
    skillId: 'bi-visualization',
    skillName: 'BI Dashboards (Power BI / Tableau)',
    title: 'Business Intelligence & Data Modeling Assessment',
    difficulty: 'Intermediate',
    timeLimitMinutes: 10,
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        prompt: 'In relational dimensional modeling, what is the key architectural difference between a Fact table and a Dimension table?',
        options: [
          'Fact tables contain business metrics and foreign keys; Dimension tables contain descriptive context attributes.',
          'Fact tables contain text descriptions; Dimension tables contain financial transactions.',
          'Fact tables must always have a 1-to-1 relationship with other Fact tables.',
          'Dimension tables are refreshed weekly, whereas Fact tables cannot be updated.'
        ],
        correctOptionIndex: 0,
        explanation: 'Fact tables record quantitative numerical events (e.g., sales, revenue), while Dimension tables supply context (e.g., customer name, store geography, product category).'
      },
      {
        id: 'q2',
        prompt: 'Which DAX function in Power BI allows overriding the active filter context to calculate a metric across all rows?',
        codeSnippet: `Total_Sales_All_Regions = CALCULATE(SUM(Sales[Amount]), ALL(Regions))`,
        options: [
          'CALCULATE() combined with ALL()',
          'FILTER() with RELATEDTABLE()',
          'SUMX() with DISTINCT()',
          'LOOKUPVALUE() with USERELATIONSHIP()'
        ],
        correctOptionIndex: 0,
        explanation: '`CALCULATE` modifies filter context, and wrapping `ALL(Regions)` clears any slicers or filters applied to the Regions column.'
      },
      {
        id: 'q3',
        prompt: 'When designing a dashboard for executive leadership, what is the primary visual hierarchy principle?',
        options: [
          'Displaying 25 raw pie charts on the landing tab for granular review',
          'Top-level high-impact KPIs at the top, followed by trends, and drill-downs for root-cause analysis',
          'Using neon saturated rainbow colors to draw attention to every single card',
          'Hiding all labels and legends to maximize empty canvas space'
        ],
        correctOptionIndex: 1,
        explanation: 'Executive dashboards prioritize glanceable top-level KPIs (Total Revenue, YoY Growth), supported by secondary trend graphs and interactive drill-downs.'
      }
    ]
  },
  'react-core': {
    id: 'assess-react',
    skillId: 'react-core',
    skillName: 'React & Component Architecture',
    title: 'React Core & Hooks Performance Assessment',
    difficulty: 'Advanced',
    timeLimitMinutes: 10,
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        prompt: 'What is the primary benefit of wrapping an expensive computational function with `useMemo`?',
        codeSnippet: `const filteredItems = useMemo(() => computeHeavyFilter(items, filter), [items, filter]);`,
        options: [
          'It executes the computation in a separate Web Worker thread automatically',
          'It caches the calculated value between renders, only recomputing when dependencies change',
          'It automatically mutates the DOM without triggering a component render',
          'It stores the result in browser LocalStorage across user sessions'
        ],
        correctOptionIndex: 1,
        explanation: '`useMemo` memoizes the output of an expensive pure function, returning the cached reference unless `items` or `filter` referential identity changes.'
      },
      {
        id: 'q2',
        prompt: 'Why should you NOT call React Hooks inside loops, conditions, or nested functions?',
        options: [
          'Because JavaScript strict mode forbids closures inside if statements',
          'Because React relies on the exact invocation order of Hooks between renders to preserve state',
          'Because hooks consume excessive GPU RAM when nested in loops',
          'Because modern browsers automatically garbage collect hooks if placed inside conditional blocks'
        ],
        correctOptionIndex: 1,
        explanation: 'React maintains an internal linked list of hooks per component. Changing the order or count across renders corrupts state mapping.'
      }
    ]
  }
};
