import { useState } from "react";
import { useApp } from "@/store/AppContext";
import { generatePlan, getPlan } from "@/lib/planner";
import { stats as computeStats } from "@/lib/progress";
import type { PlannerItem } from "@/types";

export default function Planner() {
  const { className, subjects, toast } = useApp();
  const [plan, setPlan] = useState<PlannerItem[]>(() => getPlan());
  const [open, setOpen] = useState(false);
  const [minutes, setMinutes] = useState(45);
  const [examDate, setExamDate] = useState("");

  function create() {
    const weakest = computeStats(className, subjects).weakest;
    const p = generatePlan(className, subjects, Math.max(15, minutes || 45), examDate || undefined, [weakest]);
    setPlan(p);
    setOpen(false);
    toast("Your weekly plan is ready, sir.", "success");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="pill">Weekly planning</span>
          <h2 className="mt-2 font-display text-2xl font-bold">Study Planner</h2>
        </div>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          Create / regenerate
        </button>
      </div>

      {plan.length ? (
        <div className="card space-y-3">
          {plan.map((x, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-surface-border/60 bg-surface-raised/40 p-4"
            >
              <div className="w-20 shrink-0 text-center text-xs text-slate-400">
                <div className="font-semibold text-slate-200">{x.day}</div>
                {x.time}
              </div>
              <div className="min-w-0 flex-1">
                <b className="block">{x.subject}</b>
                <div className="text-sm text-slate-400">
                  {x.topic} · {x.minutes} min
                </div>
                <small className="text-slate-500">{x.focus}</small>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card py-10 text-center">
          <div className="mb-2 text-3xl">◷</div>
          <b>No study plan yet, sir.</b>
          <p className="mt-1 text-sm text-slate-500">Create a plan based on your available time and subjects.</p>
          <button className="btn btn-primary mt-4" onClick={() => setOpen(true)}>
            Create plan
          </button>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md animate-pop card" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Study Planner</h2>
              <button className="text-xl text-slate-500" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Minutes per day</label>
                <input
                  className="input"
                  type="number"
                  min={15}
                  max={180}
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Exam date (optional)</label>
                <input className="input" type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
              </div>
              <p className="text-xs text-slate-500">
                Your selected subjects will be rotated through the week, with extra attention to weak subjects.
              </p>
              <button className="btn btn-primary w-full" onClick={create}>
                Generate plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
