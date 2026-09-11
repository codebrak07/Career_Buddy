/**
 * Server-side Groq LPU Integration Service
 * Dual API key rotation & high-reliability fallbacks.
 */

function getKeys() {
  const keys = [
    process.env.GROQ_API_KEY_1,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY,
    process.env.VITE_GROQ_API_KEY_1,
    process.env.VITE_GROQ_API_KEY_2,
  ].filter(k => typeof k === 'string' && k.trim().length > 0);
  return [...new Set(keys)];
}

let activeKeyIndex = 0;

function getActiveKey() {
  const keys = getKeys();
  if (keys.length === 0) return '';
  return keys[activeKeyIndex % keys.length];
}

function rotateKey() {
  const keys = getKeys();
  if (keys.length === 0) return '';
  activeKeyIndex = (activeKeyIndex + 1) % keys.length;
  return keys[activeKeyIndex % keys.length];
}

export async function callGroqChat(messages, model = 'qwen/qwen3.8-27b', jsonMode = false) {
  const keys = getKeys();
  if (keys.length === 0) {
    throw new Error('No Groq API keys configured on server.');
  }

  const maxAttempts = Math.max(keys.length, 2);
  let lastError = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const key = getActiveKey();
    try {
      const payload = {
        model,
        messages,
        temperature: 0.2,
        max_tokens: 1500,
      };

      if (jsonMode) {
        payload.response_format = { type: 'json_object' };
      }

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 429 || res.status >= 500) {
        rotateKey();
        continue;
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Groq API Error HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || '';

      if (jsonMode) {
        try {
          return JSON.parse(content);
        } catch {
          return { raw: content };
        }
      }

      return content;
    } catch (err) {
      lastError = err;
      rotateKey();
    }
  }

  throw lastError || new Error('All Groq API key attempts exhausted');
}

export async function askAssistant(userQuery, chatHistory = [], candidateContext = null) {
  const contextDescription = candidateContext
    ? `Current Active Candidate: ${candidateContext.candidateName || 'Candidate'}
Target Role: ${candidateContext.targetRole || 'Target Role'} (Current Fit: ${candidateContext.fitScore ?? 75}%)
Identified Gap Blockers: ${candidateContext.blockersCount ?? 0}
Top Validated Skills: ${Array.isArray(candidateContext.topSkills) ? candidateContext.topSkills.join(', ') : 'In progress'}`
    : 'No active candidate selected.';

  const systemPrompt = `You are "Career Buddy AI", an intelligent, high-precision technical career guide embedded inside the Career Buddy Platform.
Your purpose:
1. Guide candidates and hiring leads through the platform:
   - "Candidate Portal": Direct self-service portal to submit resumes, GitHub repos, certifications, and take diagnostic assessments to elevate competency tiers.
   - "Evaluator / Forensic Instrument": Comprehensive auditing console for recruiters to inspect mathematical 6-factor traces and DAG prerequisite graphs.
   - "Readiness Matrix": Explains Ready Now vs Reachable gating.
   - "Topological DAG": Prerequisite learning graph sequencing causal prerequisites (Phase 1 Foundations -> Phase 2 Core -> Phase 3 Capstone).
   - "Bayesian Diagnostic Tests": Scientifically proven assessments elevating skills from claimed/detected to validated proof.
2. Answer career and technical questions clearly, concisely, and with clean markdown bullet points.

SYSTEM CONTEXT:
${contextDescription}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...chatHistory.slice(-6),
    { role: 'user', content: userQuery }
  ];

  try {
    const reply = await callGroqChat(messages, 'qwen/qwen3.8-27b', false);
    return reply;
  } catch (err) {
    console.warn('Server Groq Assistant fallback triggered:', err.message);
    return `**Platform Guide:**
- **Candidate Portal:** Switch to Candidate mode in the top navigation bar to upload your resume, GitHub repository, or Coursera certificates. Groq AI will evaluate your credentials and verify your technical competencies.
- **Skill Validation:** Click **"Take Validation Test"** on any gap skill in the Candidate Portal to elevate your confidence via Bayesian calibration.
- **Evaluator Mode:** Inspect the 6-factor mathematical equation trace and Topological DAG prerequisite graph.`;
  }
}

export async function generateQuiz(skillId, skillName) {
  const systemPrompt = `You are an expert technical interviewer and psychometric assessment creator.
Generate 3 high-signal, multiple-choice diagnostic questions to evaluate a candidate's practical engineering mastery of: "${skillName}" (Taxonomy ID: ${skillId}).

Return ONLY valid JSON matching this exact schema:
{
  "questions": [
    {
      "id": "q1",
      "prompt": "Clear engineering question testing practical mastery",
      "codeSnippet": "// optional code snippet or empty string",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctOptionIndex": 0,
      "explanation": "Why Option A is correct based on language/framework specification"
    }
  ]
}`;

  try {
    const data = await callGroqChat(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate 3 diagnostic validation questions for: ${skillName} (${skillId}).` }
      ],
      'qwen/qwen3.8-27b',
      true
    );

    if (Array.isArray(data.questions) && data.questions.length >= 2) {
      return data.questions.slice(0, 3).map((q, i) => ({
        id: `groq-q-${skillId}-${i + 1}`,
        prompt: q.prompt || `What is the primary architectural consideration when implementing ${skillName}?`,
        codeSnippet: q.codeSnippet && q.codeSnippet.trim().length > 0 ? q.codeSnippet : undefined,
        options: Array.isArray(q.options) && q.options.length === 4 ? q.options : [
          'Ensures deterministic state isolation',
          'Prevents unhandled runtime race conditions',
          'Minimizes memory overhead and execution cycles',
          'Enforces compile-time type invariance'
        ],
        correctOptionIndex: typeof q.correctOptionIndex === 'number' && q.correctOptionIndex >= 0 && q.correctOptionIndex < 4
          ? q.correctOptionIndex
          : 0,
        explanation: q.explanation || 'Verified through standard engineering best practices.'
      }));
    }
  } catch (err) {
    console.warn('Server quiz generation fallback triggered:', err.message);
  }

  return [
    {
      id: `server-fallback-q-${skillId}-1`,
      prompt: `In enterprise distributed systems, what is the primary operational advantage of mastering ${skillName}?`,
      options: [
        'Enforces deterministic state boundaries and minimizes unhandled race conditions',
        'Eliminates all asynchronous queue latency entirely',
        'Bypasses runtime serialization overhead for all payloads',
        'Guarantees zero memory allocation across all workers'
      ],
      correctOptionIndex: 0,
      explanation: 'Deterministic state boundaries prevent non-reproducible bugs and establish reliable distributed execution.'
    },
    {
      id: `server-fallback-q-${skillId}-2`,
      prompt: `When benchmarking performance regressions in ${skillName}, which metric provides the strongest signal?`,
      options: [
        'Total raw character count of source files',
        'p99 latency distribution under concurrent load and heap allocation velocity',
        'Number of local repository branches',
        'Number of comments per function'
      ],
      correctOptionIndex: 1,
      explanation: 'p99 tail latency combined with heap allocation velocity accurately detects memory leaks and unoptimized execution paths.'
    }
  ];
}
