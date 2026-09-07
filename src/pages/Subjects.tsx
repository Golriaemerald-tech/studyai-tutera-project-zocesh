import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/AppContext";
import { getSubject, subjectCategory, subjectIcon } from "@/data/curriculum";
import { stats as computeStats } from "@/lib/progress";

export default function Subjects() {
  const navigate = useNavigate();
  const { className, subjects } = useApp();
  const st = computeStats(className, subjects);

  const groups: Record<string, string[]> = {};
  subjects.forEach((s) => {
    const cat = subjectCategory(s);
    (groups[cat] ??= []).push(s);
  });

  return (
    <div className="space-y-8">
      <div className="card">
        <span className="pill">{className} curriculum</span>
        <h2 className="mt-3 font-display text-2xl font-bold">Learn by subject.</h2>
        <p className="mt-2 text-slate-400">
          Choose a subject to explore topics, practice questions and revision tools.
        </p>
      </div>

      {Object.entries(groups).map(([cat, arr]) => (
        <div key={cat}>
          <h2 className="mb-3 font-display text-lg font-bold">{cat}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {arr.map((s) => {
              const meta = getSubject(s, className);
              const stat = st.subjectStats[s] || { done: 0, total: meta?.topics.length || 0 };
              const pct = stat.total ? Math.round((stat.done / stat.total) * 100) : 0;
              return (
                <button
                  key={s}
                  onClick={() => navigate(`/subjects/${encodeURIComponent(s)}`)}
                  className="card flex items-center gap-3 text-left transition hover:border-brand-400/50"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-raised text-lg">
                    {subjectIcon(s)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-sm">{s}</strong>
                    <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        {stat.done}/{stat.total} topics
                      </span>
                      <b className="text-brand-300">{pct}%</b>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-border/60">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
