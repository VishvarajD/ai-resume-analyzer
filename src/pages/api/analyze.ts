// src/pages/api/analyze.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { resumeText } = req.body;

  if (!resumeText) return res.status(400).json({ error: 'Resume text is required' });

  const prompt = `
You are an expert AI Resume Analyzer.

Analyze the resume text below and return a **valid JSON object** in the following structure. Use **strict and consistent criteria**. Do not include any explanations, markdown, or extra text — only the JSON.

Scoring must follow this fixed rubric for consistency:
Consider someone is applying for a role where the description is this 
What are we looking for in students?

Responsible, organized, and efficient.
 Self-motivated to make a career as a software developer.
Involved in extracurricular activities.
What we provide?

A kickstart to move towards a path to become a great software developer with a focus on web technologies.
Exposure to complex & challenging projects within an international context.
A performance driven work culture through collaborative review and feedback.
Ongoing opportunities and guidance to learn modern technologies, share knowledge and grow within the company and sector.
Interview Process: 

Technical Test: Online test to test your technical as well as logical reasoning skills.
Personal Interview: You will have a technical P2P interview.
Technical Interview: Shortlisted candidates from the P2P round will be eligible to give a second technical assessment.
Final Round: You will have a non-technical P2P interview.
Finalized candidate(s) will be offered an internship at Noovosoft. 
Opportunity with Noovosoft (Pune office only): 

Stage 1: Intern 

The goal is to give the intern a solid and practical basis of modern web-based software development. This includes:  
Modern software development tools, e.g.: Linux/Windows administration, Git, Docker, IDE  
General software development practices like clean code, software patterns and testing.  
Programming language paradigms using high level languages like Java/Kotlin, Python and JavaScript/TypeScript.  
Web frameworks and APIs (Application Programming Interface)  
Relational databases and data streaming platforms. 
Web based UI and data visualization frameworks.  
Each intern will first go through the common training sessions and later work on real-world applications with their mentor.  
Tentative internships start date: 1st August 2025.
Internship duration: 12 to 13 months (Batch 2026).
Internship stipend: 18,000/Month.
Location: Pune
Stage 2: Application Developer 

She/he will join a team and work on a project. 
CTC: INR 6,50,000/Year (minimum) and is subject to vary (on the upper side) as per performance in the interview rounds.
Tentative start date: 1st August or 1st September 2026 (most probably due to examinations)
Location: Pune
Employee benefits as per company policy.


---

Return only the following JSON:

{
  "summary": "A rewritten, clear and professional summary of the candidate based on the resume, not copied from it.",
  "skills": ["Extracted", "Technical", "Skills", "Only"],
  "projects": [
    {
      "title": "Project Title",
      "description": "One or two line summary of what it does and technologies used"
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "role": "Position Title",
      "duration": "Start – End (e.g. May 2023 – Aug 2023)"
    }
  ],
  "suggestions": [
    "Constructive suggestions to improve the resume based on project clarity, missing details, or relevance to tech roles. and most importantly based on description"
  ],
  "ats": {
    "score": 0-100,
    "reasons": [
      "Bullet points explaining why the score was given, based on the rubric above"
    ]
  }
}

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
        temperature: 0,
top_p: 1,
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
