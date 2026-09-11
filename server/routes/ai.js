import { Router } from 'express';
import { askAssistant, generateQuiz, callGroqChat } from '../services/groqService.js';

const router = Router();

/**
 * POST /api/ai/chat
 * Groq AI Assistant conversational interface
 */
router.post('/chat', async (req, res) => {
  try {
    const { userQuery, chatHistory, candidateContext } = req.body;

    if (!userQuery || typeof userQuery !== 'string' || userQuery.trim().length === 0) {
      return res.status(400).json({ error: 'userQuery is required and must be non-empty.' });
    }

    const reply = await askAssistant(userQuery.trim(), chatHistory || [], candidateContext || null);
    return res.status(200).json({ reply, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('AI chat endpoint error:', err);
    return res.status(500).json({
      error: 'Failed to process AI chat query',
      details: err.message
    });
  }
});

/**
 * POST /api/ai/quiz
 * Generate 3 diagnostic questions for skill assessment
 */
router.post('/quiz', async (req, res) => {
  try {
    const { skillId, skillName } = req.body;

    if (!skillId || !skillName) {
      return res.status(400).json({ error: 'skillId and skillName are required.' });
    }

    const questions = await generateQuiz(skillId, skillName);
    return res.status(200).json({ questions });
  } catch (err) {
    console.error('AI quiz endpoint error:', err);
    return res.status(500).json({
      error: 'Failed to generate quiz questions',
      details: err.message
    });
  }
});

/**
 * POST /api/ai/extract
 * Extract skills from raw resume or project context
 */
router.post('/extract', async (req, res) => {
  try {
    const { text, sourceType = 'resume' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'text is required.' });
    }

    const systemPrompt = `You are a technical talent assessor. Extract verifiable engineering skills and tools from the provided ${sourceType} text.
Return ONLY valid JSON matching this schema:
{
  "skills": [
    {
      "skillName": "Standardized skill name",
      "context": "Short evidence snippet from the text",
      "proficiency": 0.85
    }
  ],
  "summary": "Brief 1-sentence technical profile overview"
}`;

    const parsed = await callGroqChat(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text.slice(0, 8000) }
      ],
      'qwen/qwen3.8-27b',
      true
    );

    return res.status(200).json({
      skills: parsed.skills || [],
      summary: parsed.summary || 'Extracted competencies successfully.',
      sourceType
    });
  } catch (err) {
    console.error('AI extract endpoint error:', err);
    return res.status(500).json({
      error: 'Failed to extract skills',
      details: err.message
    });
  }
});

export default router;
