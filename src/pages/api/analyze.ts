// src/pages/api/analyze.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { resumeText } = req.body;

  if (!resumeText) return res.status(400).json({ error: 'Resume text is required' });

  const prompt = `
You are an AI Resume Analyzer. Review the following resume text and return a JSON object with the following keys:
- "summary": A short summary of the candidate
- "skills": A list of technical skills extracted from the resume
- "projects": An array of { title, description }
- "experience": An array of companies with role and duration
- "suggestions": A list of suggestions to improve the resume
- "ats": An object with:
  - "score": ATS score out of 100
  - "reasons": Bullet points explaining the score based on formatting, keyword matching, clarity, grammar, and relevance.

IMPORTANT: Return only a **valid JSON object**. Do not include explanations or markdown.

Resume text:
"""
${resumeText}
"""
`;



  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000', // or your deployed domain
        'X-Title': 'ai-resume-analyzer'
      },
      body: JSON.stringify({
        model:'mistralai/mistral-7b-instruct:free',
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await response.json();

    if (!data || !data.choices || !data.choices[0]?.message?.content) {
      console.error('❌ Invalid Gemini response:', data);
      return res.status(500).json({ error: 'No response from AI (Gemini).' });
    }

    const content = data.choices[0].message.content;
    // console.log('📦 Gemini response:', content);

    res.status(200).json({ result: content });
  } catch (err: any) {
    console.error('❌ Gemini fetch failed:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
