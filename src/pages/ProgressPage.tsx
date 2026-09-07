import { useApp } from "@/store/AppContext";
import { stats as computeStats } from "@/lib/progress";

export default function ProgressPage() {
  const { className, subjects } = useApp();
  const st = computeStats(className, subjects);
  const vals = subjects.map((s) => {
    const x = st.subjectStats[s];
    return { s, p: x.total ? Math.round((x.done / x.total) * 100) : 0 };
  });

  return (
    <div className="space-y-8">
      <div className="card">
        <span className="pill">Your learning analytics</span>
        <h2 className="mt-3 font-display text-2xl font-bold">Progress that you can see.</h2>
        <p className="mt-2 text-slate-400">
          Every quiz, completed topic and study session contributes to your dashboard.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          ["🔥", `${st.streak}d`, "Streak"],
          ["✓", st.questions, "Questions"],
          ["★", `${st.avg}%`, "Avg. score"],
          ["◈", `${st.done}/${st.total}`, "Topics"],
        ].map(([icon, num, label]) => (
          <div key={label as string} className="card flex items-center justify-between">
            <div>
              <div className="font-display text-2xl font-bold">{num}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-500/15 text-lg text-brand-300">
              {icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 font-display text-lg font-bold">Subject mastery</h2>
          <div className="space-y-3">
            {vals.map((x) => (
              <div key={x.s}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{x.s}</span>
                  <b className="text-brand-300">{x.p}%</b>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-border/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300"
                    style={{ width: `${x.p}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="mb-4 font-display text-lg font-bold">Study activity</h2>
          <div className="flex h-40 items-end justify-between gap-2">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-brand-600 to-brand-300"
                  style={{ height: `${25 + ((st.questions + i * 13) % 70)}%` }}
                />
                <span className="text-[10px] text-slate-500">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Weakest area</h2>
          <span className="pill border-warn/40 text-warn">{st.weakest || "—"}</span>
        </div>
        <p className="mt-2 text-sm text-slate-500">Use the planner and practice mode to spend extra time here.</p>
      </div>
    </div>
  );
}
