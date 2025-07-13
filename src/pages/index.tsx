import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 px-4">
      <h1 className="text-4xl font-bold mb-4">AI Resume Analyzer</h1>
      <p className="mb-6 text-center max-w-xl">
        Upload your resume and let our AI analyze its strengths, weaknesses, and keyword match for tech roles.
      </p>
      <Link href="/upload">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">
          Upload Resume
        </button>
      </Link>
      <div className="mt-10 text-sm text-gray-500">
        Made by <a href="http://vishvarajdeshmukh.me/Portfolio" className="underline text-shadow-gray-900">Vishvaraj Deshmukh</a>
      </div>
    </main>
  );
}
