import { useState } from 'react';
import { useRouter } from 'next/router';
import * as pdfjsLib from 'pdfjs-dist';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };
// @ts-ignore
const extractTextFromPDF = async (file: File): Promise<string> => {
  const pdfjsLib = await import('pdfjs-dist/build/pdf');

  // @ts-ignore
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
};





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload a resume first.');
      return;
    }

    setLoading(true);

    const text = await extractTextFromPDF(file);

    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText: text }),
    });

    const data = await res.json();
    console.log('🧠 Raw AI response:', data.result);
    console.log('Open Ai response' );
    if (data?.result) {
    // Try parsing it as JSON (Gemini returns stringified JSON sometimes)
    try {
      const parsed = JSON.parse(data.result);
      console.log('✅ Parsed AI result:', parsed);
      localStorage.setItem('ai-analysis', JSON.stringify(parsed));
      router.push('/analyze');
    } catch (err) {
      console.warn('⚠️ Could not parse JSON from Gemini. Showing raw result.');
      localStorage.setItem('ai-analysis', data.result);
      router.push('/analyze');
    }
  } else {
    alert(data.error || 'No response from AI');
  }
    localStorage.setItem('aiResult', data.result); // Pass data to next page
    router.push('/analyze');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">Upload Your Resume (PDF)</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </form>
    </main>
  );
}
