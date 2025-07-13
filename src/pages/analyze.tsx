'use client';

import { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, Brain, Zap } from 'lucide-react';

export default function AnalyzePage() {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('ai-analysis');

    if (!stored) {
      setResult('❌ No analysis data found.');
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setResult(parsed);
    } catch (err) {
      setResult(stored);
    }
  }, []);

  if (typeof result === 'string') {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <p className="text-xl text-red-500">{result}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8 text-gray-800">
      <h1 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
        <Sparkles className="text-purple-600" /> AI Resume Analysis
      </h1>

      {/* Summary */}
      {result?.summary && (
        <section className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Brain className="text-purple-600" /> Quick Summary
          </h2>
          <p>{result.summary}</p>
        </section>
      )}

      {/* Skills */}
      {result?.skills && (
        <section className="bg-blue-50 p-4 rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-2">🧰 Your Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {result.skills.map((skill: string, idx: number) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {result?.projects && (
        <section className="bg-orange-50 p-4 rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-2">🚀 Projects That Slay</h2>
          <div className="space-y-3">
            {result.projects.map((proj: any, idx: number) => (
              <div
                key={idx}
                className="border border-orange-200 p-3 rounded-lg bg-white shadow-sm"
              >
                <h3 className="font-bold">{proj.title}</h3>
                <p className="text-sm text-gray-700">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {result?.experience && (
        <section className="bg-green-50 p-4 rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-2">💼 Work Vibes</h2>
          <ul className="space-y-2">
            {result.experience.map((exp: any, idx: number) => (
              <li
                key={idx}
                className="bg-white p-3 border-l-4 border-green-400 rounded"
              >
                <p className="font-medium">{exp.role} @ {exp.company}</p>
                <span className="text-sm text-gray-500">{exp.duration}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Suggestions */}
      {result?.suggestions && (
        <section className="bg-yellow-50 p-4 rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-2">✨ Make It Better</h2>
          <ul className="list-disc list-inside text-gray-700">
            {result.suggestions.map((tip: string, idx: number) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </section>
      )}

      {/* ATS Score */}
      {result?.ats && (
        <section className="bg-pink-50 p-4 rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-2">📈 ATS Score</h2>
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold text-pink-600">{result.ats.score}/100</div>
            <div className="flex-1">
              <h3 className="font-semibold">Why this score:</h3>
              <ul className="list-disc list-inside text-gray-700">
                {result.ats.reasons.map((reason: string, idx: number) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
