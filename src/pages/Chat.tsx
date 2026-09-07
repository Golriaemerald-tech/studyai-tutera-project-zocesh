import { FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Send, Volume2, VolumeX } from 'lucide-react';
import { renderMarkdown } from '../lib/markdown';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export const Chat = () => {
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Welcome back, ${user?.nickname || user?.name || 'Student'}! 👋 I'm your StudyAI Tutor. What would you like to learn today?`,
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState<number | null>(null);

  async function handleSend(e: FormEvent) {
    e.preventDefault();

    const prompt = input.trim();
    if (!prompt || loading) return;

    setInput('');

    const nextMessages: Message[] = [
      ...messages,
      { role: 'user', content: prompt },
    ];

    setMessages(nextMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          systemInstruction: `
You are STUDYAI, a patient Nigerian secondary-school tutor.

Student name: ${user?.nickname || user?.name || 'Student'}
Student class: ${user?.studentClass || 'SS 3'}
Department: ${user?.department || 'Science'}

Teach at the student's level.
Address the student naturally as "sir".
Explain answers clearly and step by step.
For Mathematics and science, show the actual equations, numbers and working.
Never invent random symbols or placeholder characters for mathematical notation.
Do not put literal ## or ### heading markers in your response.
Use **bold text** when emphasis is needed.
Keep explanations educational, clear and age-appropriate.
        `.trim(),
          maxOutputTokens: 2048,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Tutor AI request failed.');
      }

      const answer =
        typeof data?.text === 'string' && data.text.trim()
          ? data.text.trim()
          : 'I could not generate a response. Please try again, sir.';

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: answer },
      ]);
    } catch (error) {
      console.error('Tutor AI error:', error);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry sir, I could not reach Tutor AI right now. Please check your Gemini configuration and try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function speak(text: string, index: number) {
    if (speaking !== null) return;

    try {
      setSpeaking(index);

      const response = await fetch('/api/elevenlabs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Voice service unavailable.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onended = () => {
        URL.revokeObjectURL(url);
        setSpeaking(null);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setSpeaking(null);
      };

      await audio.play();
    } catch (error) {
      console.error('ElevenLabs error:', error);
      setSpeaking(null);
      alert('Voice is not configured yet. Your text tutor is still working.');
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="card">
        <span className="pill flex w-fit items-center gap-2">
          <Sparkles size={14} />
          STUDYAI TUTOR
        </span>

        <h1 className="mt-3 font-display text-2xl md:text-3xl font-bold">
          Your AI Tutor
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          {user?.studentClass || 'SS 3'} •{' '}
          {user?.department || 'Science'}
        </p>
      </div>

      <div className="card">
        <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-raised border border-surface-border/60'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div
                    className="prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(message.content),
                    }}
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                )}

                {message.role === 'assistant' && (
                  <button
                    type="button"
                    onClick={() => speak(message.content, index)}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg border border-surface-border px-3 py-1.5 text-xs hover:border-brand-400/60"
                  >
                    {speaking === index ? (
                      <>
                        <VolumeX size={14} />
                        Speaking...
                      </>
                    ) : (
                      <>
                        <Volume2 size={14} />
                        Read aloud
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-surface-raised border border-surface-border/60 px-4 py-3 text-sm text-slate-400">
                Tutor AI is thinking, sir...
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSend}
          className="mt-5 flex gap-2"
        >
          <input
            type="text"
            placeholder="Ask your Tutor AI anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 rounded-xl border border-surface-border bg-surface-raised px-4 py-3 text-sm outline-none focus:border-brand-400"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn btn-primary px-4"
          >
            <Send size={17} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
