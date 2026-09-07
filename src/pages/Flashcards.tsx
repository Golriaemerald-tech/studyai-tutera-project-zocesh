import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/store/AppContext';
import type { FlashCard } from '@/types';

type FlashcardResponse = {
  front: string;
  back: string;
};

export default function Flashcards() {
  const location = useLocation();
  const navigate = useNavigate();
  const { className, subjects } = useApp();

  const navState =
    (location.state as { subject?: string; topic?: string }) || {};

  const subject = navState.subject || subjects[0] || 'Mathematics';
  const defaultTopic = navState.topic || '';

  const [topic, setTopic] = useState(defaultTopic);
  const [count, setCount] = useState(10);
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setTopic(defaultTopic);
  }, [defaultTopic]);

  const currentCard = useMemo(() => cards[index], [cards, index]);

  async function generateFlashcards() {
    setLoading(true);
    setError('');
    setCards([]);
    setIndex(0);
    setFlipped(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Create ${count} educational flashcards for ${className} ${subject}${
            topic.trim() ? ` on the topic "${topic.trim()}"` : ''
          }.`,
          systemInstruction: `
You are ZOCESH STUDY AI creating study flashcards for Nigerian secondary-school students.

Class: ${className}
Subject: ${subject}
${topic.trim() ? `Topic: ${topic.trim()}` : ''}

Create exactly ${count} useful flashcards.

Return ONLY a valid JSON array in this format:
[
  {
    "front": "Question or key concept",
    "back": "Clear answer or explanation"
  }
]

Rules:
- Match the student's class level.
- Keep every answer educational and accurate.
- Use Nigerian secondary-school terminology where appropriate.
- Mathematics and science questions should contain real values and correct equations.
- Do not include markdown.
- Do not include numbering outside the JSON.
- Do not add commentary before or after the JSON.
          `.trim(),
          maxOutputTokens: 4096,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Flashcard generation failed.');
      }

      const raw =
        typeof data?.text === 'string'
          ? data.text.trim()
          : '';

      const cleaned = raw
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const parsed = JSON.parse(cleaned) as FlashcardResponse[];

      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('The AI returned no flashcards.');
      }

      const validCards: FlashCard[] = parsed
        .filter(
          (card) =>
            typeof card.front === 'string' &&
            typeof card.back === 'string' &&
            card.front.trim() &&
            card.back.trim()
        )
        .map((card) => ({
          front: card.front.trim(),
          back: card.back.trim(),
        }));

      if (!validCards.length) {
        throw new Error('The AI returned invalid flashcards.');
      }

      setCards(validCards);
    } catch (err) {
      console.error('Flashcard generation error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Could not generate flashcards. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  if (!cards.length && !loading) {
    return (
      <div className="space-y-6">
        <div>
          <span className="pill">Study Tools</span>
          <h2 className="mt-2 font-display text-2xl font-bold">
            AI Flashcards
          </h2>
          <p className="mt-2 text-sm opacity-70">
            Generate a custom set of flashcards with Zocesh Study AI.
          </p>
        </div>

        <div className="card space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Subject
            </label>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              {subject}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Topic <span className="opacity-50">(optional)</span>
            </label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={`e.g. ${subject === 'Mathematics' ? 'Quadratic equations' : 'Enter a topic'}`}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-brand-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Number of flashcards
            </label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            >
              {[5, 10, 15, 20, 25, 30].map((number) => (
                <option key={number} value={number}>
                  {number} flashcards
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            className="btn btn-primary w-full"
            onClick={generateFlashcards}
          >
            ✨ Generate New Flashcards
          </button>

          <button
            className="btn w-full"
            onClick={() => navigate('/subjects')}
          >
            Back to Subjects
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card py-16 text-center">
        <div className="mx-auto mb-4 text-3xl">✨</div>
        <h2 className="font-display text-xl font-bold">
          Creating your flashcards...
        </h2>
        <p className="mt-2 text-sm opacity-70">
          Zocesh Study AI is preparing {count} cards for you, sir.
        </p>
      </div>
    );
  }

  if (!currentCard) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="pill">{subject}</span>
          <h2 className="mt-2 font-display text-xl font-bold">
            AI Flashcards
          </h2>
          {topic && (
            <p className="mt-1 text-sm opacity-60">{topic}</p>
          )}
        </div>

        <span className="pill">
          {index + 1}/{cards.length}
        </span>
      </div>

      <div className="[perspective:1200px]">
        <button
          type="button"
          onClick={() => setFlipped((value) => !value)}
          className="relative h-72 w-full [transform-style:preserve-3d] transition-transform duration-500"
          style={{
            transform: flipped ? 'rotateY(180deg)' : 'none',
          }}
        >
          <div className="card absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center [backface-visibility:hidden]">
            <span className="pill">Question</span>
            <h2 className="font-display text-2xl font-bold">
              {currentCard.front}
            </h2>
            <span className="text-xs opacity-50">
              Tap the card to reveal the answer
            </span>
          </div>

          <div
            className="card absolute inset-0 flex flex-col items-center justify-center gap-3 border-brand-400/40 bg-brand-500/10 p-8 text-center [backface-visibility:hidden]"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <span className="pill">Answer</span>
            <h2 className="font-display text-xl font-bold">
              {currentCard.back}
            </h2>
          </div>
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          className="btn"
          onClick={() => {
            setIndex(
              (value) => (value - 1 + cards.length) % cards.length
            );
            setFlipped(false);
          }}
        >
          ← Previous
        </button>

        <button
          className="btn btn-primary"
          onClick={() => {
            setIndex((value) => (value + 1) % cards.length);
            setFlipped(false);
          }}
        >
          Next →
        </button>

        <button
          className="btn"
          onClick={() => {
            setCards([]);
            setIndex(0);
            setFlipped(false);
          }}
        >
          New Set
        </button>

        <button
          className="btn"
          onClick={() => navigate('/chat')}
        >
          Ask AI
        </button>
      </div>
    </div>
  );
}
