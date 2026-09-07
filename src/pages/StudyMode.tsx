import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ask, GeminiError, buildTutorInstruction } from '../lib/gemini';
import { renderMarkdown } from '../lib/markdown';
import { BookOpen, Award, CheckCircle, Sparkles, Send } from 'lucide-react';

export const StudyMode = () => {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [quizActive, setQuizActive] = useState(false);
  const [score, setScore] = useState(0);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askGemini = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setLoading(true);
    setAiResponse('');
    try {
      // Routed through our own /api/chat serverless function (see
      // src/lib/gemini.ts) instead of calling Google directly from the
      // browser — that keeps the API key server-side and automatically
      // retries across several Gemini models if one is rate-limited or
      // temporarily unavailable, which matters a lot on a free API key.
      const text = await ask(
        `Explain clearly, for the ${selectedSubject} subject: ${aiPrompt}`,
        { systemInstruction: buildTutorInstruction(user, { subject: selectedSubject }) }
      );
      setAiResponse(text);
    } catch (err: any) {
      const message = err instanceof GeminiError ? err.message : 'Something went wrong talking to Gemini.';
      setAiResponse(`Error connecting with Gemini AI: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <BookOpen className="text-teal-400" /> Study Mode & Gemini AI Tutor
        </h1>
        <p className="text-xs text-slate-400">Select a subject, launch interactive quizzes, or ask the Gemini AI tutor for instant explanations.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Language', 'Civic Education', 'Economics', 'Computer Science'].map((sub) => (
          <button
            key={sub}
            onClick={() => { setSelectedSubject(sub); setQuizActive(false); }}
            className={`p-4 rounded-2xl border text-left text-xs font-semibold transition-all ${
              selectedSubject === sub ? 'bg-teal-500/10 text-teal-300 border-teal-500/50' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase text-slate-400 flex items-center gap-2">
            <Award className="text-amber-400" /> {selectedSubject} Practice Quiz
          </h2>
          {!quizActive ? (
            <div className="space-y-4 py-6 text-center">
              <p className="text-xs text-slate-400">Test your mastery with standard curriculum questions for {selectedSubject}.</p>
              <button
                onClick={() => setQuizActive(true)}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition-all"
              >
                Start Quiz Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-slate-200">Question 1: What is the primary focus of {selectedSubject} in senior secondary curriculum?</p>
              <div className="space-y-2">
                {['Core foundational concepts & problem solving', 'Historical memorization only', 'Casual reading'].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => { setScore(100); alert('Correct answer!'); setQuizActive(false); }}
                    className="w-full text-left bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs text-slate-300 hover:border-teal-500 transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase text-slate-400 flex items-center gap-2">
              <Sparkles className="text-teal-400" /> Ask Gemini AI ({selectedSubject})
            </h2>
            <form onSubmit={askGemini} className="space-y-3">
              <textarea
                rows={3}
                placeholder={`Ask anything about ${selectedSubject}...`}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Thinking...' : <><Send size={14} /> Send to Gemini AI</>}
              </button>
            </form>
            {aiResponse && (
              <div
                className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 max-h-48 overflow-y-auto leading-relaxed [&_p]:m-0 [&_p+p]:mt-2 [&_ul]:my-1 [&_ul]:pl-4 [&_li]:list-disc [&_h2]:font-bold [&_h2]:text-sm [&_h3]:font-bold"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(aiResponse) }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudyMode;
