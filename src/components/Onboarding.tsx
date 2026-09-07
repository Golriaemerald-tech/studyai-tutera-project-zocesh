import { useState } from "react";
import { allSubjectNames } from "@/data/curriculum";
import { useApp } from "@/store/AppContext";
import type { ClassName } from "@/types";

const CLASS_OPTIONS: { id: ClassName; label: string }[] = [
  { id: "SS1", label: "Foundation & Exploration" },
  { id: "SS2", label: "Development & Mastery" },
  { id: "SS3", label: "Advanced Learning & Examination Preparation" },
];

const GOALS = [
  "Improve my grades",
  "Prepare for exams",
  "Understand difficult topics",
  "Practice more",
  "Become an excellent student",
];

export default function Onboarding() {
  const { completeOnboarding, toast } = useApp();
  const [step, setStep] = useState(0);
  const [className, setClassName] = useState<ClassName | null>(null);
  const [subjects, setSubjects] = useState<string[]>(allSubjectNames().slice(0, 5));
  const [goal, setGoal] = useState(GOALS[0]);

  const allSubjects = allSubjectNames();

  function next() {
    if (step === 1 && !className) {
      toast("Please choose a class, sir.");
      return;
    }
    setStep((s) => Math.min(3, s + 1));
  }

  function finish() {
    completeOnboarding(className || "SS1", subjects.length ? subjects : ["Mathematics"], goal);
  }

  function toggleSubject(s: string) {
    setSubjects((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-canvas/95 p-4 backdrop-blur-xl">
      <div className="w-full max-w-lg animate-pop rounded-xl2 border border-surface-border bg-surface/90 p-8 shadow-glow">
        <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 font-display text-lg font-bold text-black">
          S
        </div>

        {step === 0 && (
          <div className="animate-fade-up">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
              Your intelligence. Your classroom. Your progress.
            </span>
            <h1 className="mt-3 font-display text-4xl font-bold">STUDYAI</h1>
            <p className="mt-3 text-slate-400">Your Intelligent Personal Study Companion for SS1–SS3.</p>
            <button className="btn btn-primary mt-6" onClick={next}>
              Get Started →
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-up">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">Before we begin, sir...</span>
            <h1 className="mt-2 text-2xl font-bold">What class are you in?</h1>
            <div className="mt-5 grid gap-3">
              {CLASS_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setClassName(c.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    className === c.id
                      ? "border-brand-400 bg-brand-500/10"
                      : "border-surface-border bg-surface-raised/50 hover:border-brand-400/40"
                  }`}
                >
                  <b className="block">{c.id}</b>
                  <small className="text-slate-400">{c.label}</small>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button className="btn btn-primary" onClick={next}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-up">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">Personalise your learning</span>
            <h1 className="mt-2 text-2xl font-bold">What subjects are you studying?</h1>
            <div className="mt-5 grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1">
              {allSubjects.map((s) => (
                <label
                  key={s}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                    subjects.includes(s)
                      ? "border-brand-400 bg-brand-500/10 text-brand-100"
                      : "border-surface-border bg-surface-raised/50 text-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="accent-brand-500"
                    checked={subjects.includes(s)}
                    onChange={() => toggleSubject(s)}
                  />
                  {s}
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button className="btn btn-primary" onClick={next}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-up">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">One last thing</span>
            <h1 className="mt-2 text-2xl font-bold">What's your main goal?</h1>
            <div className="mt-5 grid gap-2">
              {GOALS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                    goal === g
                      ? "border-brand-400 bg-brand-500/10"
                      : "border-surface-border bg-surface-raised/50 hover:border-brand-400/40"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button className="btn btn-primary" onClick={finish}>
                Enter Zocesh Zocesh Study AI →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
