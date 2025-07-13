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




var checkError =  false;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Upload a resume first Dont have a resume? building something for it');
      checkError = true;
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
    // console.log('🧠 Raw AI response:', data.result);
    // console.log('Open Ai response' );
    if (data?.result) {
    // Try parsing it as JSON (Gemini returns stringified JSON sometimes)
    try {
      const parsed = JSON.parse(data.result);
    //   console.log('✅ Parsed AI result:', parsed);
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
//   var msg = "click here to upload resume👇";
//   if(checkError){
//     msg = "upload resume bro first"
//   }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <h1 className="text-3xl text-black  font-bold mb-4">Upload Your Resume (PDF)</h1>
        {checkError?<div className='errorMsg mr-50 text-gray-300 text-1xl'>upload resume bro first</div>:<div className='errorMsg mr-50 text-gray-300 text-1xl'>click here to upload resume👇</div>}
      <form onSubmit={handleSubmit} className="w-full  max-w-md space-y-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full p-2 border rounded bg-gray-300 text-black hover:bg-gray-500"
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-white hover:text-black border-b-white  transition"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </form>
    </main>
  );
}
