import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/AppContext";
import { getSubject, subjectIcon } from "@/data/curriculum";
import { stats as computeStats } from "@/lib/progress";

function Stat({ icon, num, label }: { icon: string; num: string | number; label: string }) {
  return (
    <div className="card flex items-center justify-between">
      <div>
        <div className="font-display text-2xl font-bold">{num}</div>
        <div className="text-xs text-slate-500">{label}</div>
      </div>
      <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-500/15 text-lg text-brand-300">
        {icon}
      </div>
    </div>
  );
}

function Action({
  icon,
  title,
  sub,
  onClick,
}: {
  icon: string;
  title: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="card flex flex-col items-start gap-2 text-left transition hover:border-brand-400/50 hover:-translate-y-0.5"
    >
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/15 text-lg text-brand-300">
        {icon}
      </div>
      <strong className="text-sm">{title}</strong>
      <span className="text-xs text-slate-500">{sub}</span>
    </button>
  );
}

function SubjectCard({ subject }: { subject: string }) {
  const navigate = useNavigate();
  const { className, subjects } = useApp();
  const meta = getSubject(subject, className);
  const st = computeStats(className, subjects).subjectStats[subject] || { done: 0, total: meta?.topics.length || 0 };
  const pct = st.total ? Math.round((st.done / st.total) * 100) : 0;
  return (
    <button
      onClick={() => navigate(`/subjects/${encodeURIComponent(subject)}`)}
      className="card flex items-center gap-3 text-left transition hover:border-brand-400/50"
    >
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-raised text-lg">
        {subjectIcon(subject)}
      </div>
      <div className="min-w-0 flex-1">
        <strong className="block truncate text-sm">{subject}</strong>
        <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
          <span>
            {st.done}/{st.total} topics
          </span>
          <b className="text-brand-300">{pct}%</b>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-border/60">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </button>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { className, subjects, setSelectedSubject, setSelectedTopic, setMode } = useApp();
  const st = computeStats(className, subjects);
  const recent = st.recent[0];

  function continueLearning() {
    const s = subjects[0] || "Mathematics";
    const meta = getSubject(s, className);
    const t = meta?.topics[0];
    setSelectedSubject(s);
    setSelectedTopic(t?.title ?? null);
    navigate("/chat");
  }

  return (
    <div className="space-y-8">
      <div className="card overflow-hidden bg-gradient-to-br from-surface-raised/80 to-surface/40">
        <span className="pill">Personal learning dashboard</span>
        <h2 className="mt-3 font-display text-3xl font-bold">Good to see you, sir 👋</h2>
        <p className="mt-2 max-w-xl text-slate-400">
          You're learning at <b className="text-slate-200">{className}</b>. Build understanding, practise
          consistently and prepare with confidence.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button className="btn btn-primary" onClick={continueLearning}>
            Continue Learning
          </button>
          <button className="btn" onClick={() => navigate("/chat")}>
            Ask Zocesh Zocesh Study AI
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat icon="🔥" num={`${st.streak}d`} label="Study streak" />
        <Stat icon="✓" num={st.questions} label="Questions solved" />
        <Stat icon="★" num={`${st.avg}%`} label="Average quiz score" />
        <Stat icon="◈" num={st.done} label="Topics mastered" />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Quick actions</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Action icon="✦" title="Ask AI" sub="Tutor, explain or solve" onClick={() => navigate("/chat")} />
          <Action
            icon="✓"
            title="Start Quiz"
            sub="Test your knowledge"
            onClick={() => navigate("/quiz", { state: { subject: subjects[0], ai: false } })}
          />
          <Action
            icon="▣"
            title="Flashcards"
            sub="Recall key ideas"
            onClick={() => navigate("/flashcards", { state: { subject: subjects[0] } })}
          />
          <Action icon="◷" title="Study Planner" sub="Plan your week" onClick={() => navigate("/planner")} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">My subjects</h2>
            <button className="btn" onClick={() => navigate("/subjects")}>
              View all
            </button>
          </div>
          <div className="grid gap-3">
            {subjects.slice(0, 4).map((s) => (
              <SubjectCard key={s} subject={s} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-3 font-display text-lg font-bold">Recent activity</h2>
          <div className="card">
            {recent ? (
              <>
                <b className="block">{recent.subject || "Study"}</b>
                <p className="mt-1 text-sm text-slate-400">
                  {recent.topic || "Study session"} ·{" "}
                  {recent.type === "quiz" ? `${recent.score}/${recent.total}` : "Completed"}
                </p>
              </>
            ) : (
              <div className="py-6 text-center">
                <div className="mb-2 text-3xl">✦</div>
                <b className="block">Your study journey starts here, sir.</b>
                <p className="mt-1 text-sm text-slate-500">Start a topic or quiz to build your progress.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
