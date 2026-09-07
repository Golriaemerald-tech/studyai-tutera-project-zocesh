import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "@/store/AppContext";
import { generateAIQuiz, localQuestions, startQuiz } from "@/lib/quiz";
import { recordQuiz } from "@/lib/progress";
import type { QuizState } from "@/types";

export default function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { className, subjects, toast } = useApp();
  const navState = (location.state as { subject?: string; topic?: string; ai?: boolean }) || {};
  const subject = navState.subject || subjects[0] || "Mathematics";
  const topic = navState.topic;

  const [quiz, setQuiz] = useState<QuizState | null>(null);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setFinished(false);
      if (navState.ai) {
        try {
          const qs = await generateAIQuiz({ className, subject, topic, examContext: "WAEC/NECO practice" });
          if (!qs.length) throw new Error("empty");
          if (!cancelled) setQuiz(startQuiz(qs, { subject, topic, ai: true }));
        } catch {
          if (!cancelled) {
            setQuiz(startQuiz(localQuestions(className, subject, topic), { subject, topic }));
            toast("Using local quiz questions.");
          }
        }
      } else {
        setQuiz(startQuiz(localQuestions(className, subject, topic), { subject, topic }));
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [className, subject, topic, navState.ai]);

  function answer(i: number) {
    if (!quiz) return;
    const answers = [...quiz.answers];
    answers[quiz.index] = i;
    setQuiz({ ...quiz, answers });
  }

  function prev() {
    if (!quiz) return;
    setQuiz({ ...quiz, index: Math.max(0, quiz.index - 1) });
  }

  function next() {
    if (!quiz) return;
    if (quiz.answers[quiz.index] === null) {
      toast("Choose an answer first, sir.");
      return;
    }
    if (quiz.index === quiz.questions.length - 1) {
      finish();
    } else {
      setQuiz({ ...quiz, index: quiz.index + 1 });
    }
  }

  function finish() {
    if (!quiz) return;
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (quiz.answers[i] === q.answer) score++;
    });
    recordQuiz({ subject: quiz.meta.subject, topic: quiz.meta.topic, total: quiz.questions.length, score });
    setFinished(true);
  }

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3 text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
        <p>Preparing your quiz, sir...</p>
      </div>
    );
  }

  if (!quiz || !quiz.questions.length) {
    return (
      <div className="card py-10 text-center">
        <b>No quiz available for this topic yet.</b>
        <div className="mt-4">
          <button className="btn" onClick={() => navigate("/subjects")}>
            Back to Subjects
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (quiz.answers[i] === q.answer) score++;
    });
    const pct = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="space-y-6">
        <div className="card">
          <span className="pill">Quiz complete</span>
          <h2 className="mt-3 font-display text-3xl font-bold">
            {score}/{quiz.questions.length} — {pct}%
          </h2>
          <p className="mt-2 text-slate-400">
            {pct >= 80 ? "Excellent work, sir! Keep building on it." : "Good effort, sir. Review the explanations and try again."}
          </p>
          <div className="mt-4 flex gap-3">
            <button
              className="btn btn-primary"
              onClick={() => {
                setLoading(true);
                setFinished(false);
                setQuiz(startQuiz(localQuestions(className, subject, topic), quiz.meta));
                setLoading(false);
              }}
            >
              Try Again
            </button>
            <button className="btn" onClick={() => navigate("/subjects")}>
              Back to Subjects
            </button>
          </div>
        </div>
        <div className="card space-y-3">
          <h2 className="font-display text-lg font-bold">Review</h2>
          {quiz.questions.map((q, i) => (
            <div key={i} className="rounded-xl border border-surface-border/60 bg-surface-raised/40 p-4">
              <strong className="block text-sm">
                {i + 1}. {q.question}
              </strong>
              <small className={quiz.answers[i] === q.answer ? "text-brand-300" : "text-red-300"}>
                {quiz.answers[i] === q.answer ? "✓ Correct" : "✗ Review"} — {q.explanation}
              </small>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const q = quiz.questions[quiz.index];
  const answered = quiz.answers.filter((x) => x !== null).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="pill">
            {subject} • {className}
          </span>
          <h2 className="mt-2 font-display text-xl font-bold">Practice Quiz</h2>
        </div>
        <span className="pill">
          {quiz.index + 1}/{quiz.questions.length}
        </span>
      </div>
      <div className="card">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span>Question {quiz.index + 1}</span>
          <span>{answered} answered</span>
        </div>
        <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-surface-border/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300 transition-all"
            style={{ width: `${((quiz.index + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
        <p className="mb-4 text-base font-medium">{q.question}</p>
        <div className="space-y-2">
          {q.options.map((o, i) => (
            <button
              key={i}
              onClick={() => answer(i)}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                quiz.answers[quiz.index] === i
                  ? "border-brand-400 bg-brand-500/10 text-brand-100"
                  : "border-surface-border/70 bg-surface-raised/40 hover:border-brand-400/40"
              }`}
            >
              {String.fromCharCode(65 + i)}. {o}
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-between">
          <button className="btn" onClick={prev} disabled={quiz.index === 0}>
            ← Previous
          </button>
          <button className="btn btn-primary" onClick={next}>
            {quiz.index === quiz.questions.length - 1 ? "Submit" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
