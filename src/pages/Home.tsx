import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/AppContext";
import { getSubject, subjectIcon } from "@/data/curriculum";
import { stats as computeStats } from "@/lib/progress";

function Stat({ icon, num, label }: { icon: string; num: string | number; label: string }) {
  return (
    <div className="card group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/40">
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-brand-500/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
      <div className="relative flex items-center justify-between">
        <div>
          <div className="font-display text-2xl font-bold">{num}</div>
          <div className="text-xs text-slate-500">{label}</div>
        </div>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500/15 text-lg text-brand-300 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
          {icon}
        </div>
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
      className="card group relative overflow-hidden text-left transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/50 hover:shadow-lg hover:shadow-brand-500/5 active:scale-[0.98]"
    >
      <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-brand-500/10 blur-xl transition-transform duration-500 group-hover:scale-150" />
      <div className="relative flex flex-col items-start gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/15 text-lg text-brand-300 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
          {icon}
        </div>
        <strong className="text-sm">{title}</strong>
        <span className="text-xs leading-relaxed text-slate-500">{sub}</span>
      </div>
    </button>
  );
}

function SubjectCard({ subject }: { subject: string }) {
  const navigate = useNavigate();
  const { className, subjects } = useApp();
  const meta = getSubject(subject, className);
  const st =
    computeStats(className, subjects).subjectStats[subject] || {
      done: 0,
      total: meta?.topics.length || 0,
    };
  const pct = st.total ? Math.round((st.done / st.total) * 100) : 0;

  return (
    <button
      onClick={() => navigate(`/subjects/${encodeURIComponent(subject)}`)}
      className="card group w-full min-w-0 text-left transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/50 hover:shadow-lg hover:shadow-brand-500/5 active:scale-[0.99]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-raised text-lg transition-all duration-300 group-hover:scale-105 group-hover:bg-brand-500/10">
          {subjectIcon(subject)}
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <strong className="min-w-0 flex-1 whitespace-normal break-words text-sm leading-tight">
              {subject}
            </strong>
            <b className="shrink-0 text-xs text-brand-300">{pct}%</b>
          </div>

          <div className="mt-1 text-xs text-slate-500">
            {st.done}/{st.total} topics
          </div>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-border/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300 transition-all duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { className, subjects, setSelectedSubject, setSelectedTopic } = useApp();
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
      <section className="card group relative overflow-hidden bg-gradient-to-br from-surface-raised/90 via-surface-raised/60 to-surface/40">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-500/15 blur-3xl transition-transform duration-700 group-hover:scale-125" />
        <div className="absolute -bottom-20 left-1/3 h-32 w-32 rounded-full bg-brand-400/10 blur-3xl animate-pulse" />

        <div className="relative">
          <span className="pill">Personal learning dashboard</span>

          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
            Welcome back 👋
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            You're learning at{" "}
            <b className="text-slate-200">{className}</b>. Build understanding,
            practise consistently and prepare with confidence.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className="btn btn-primary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/20"
              onClick={continueLearning}
            >
              Continue Learning →
            </button>

            <button
              className="btn transition-all duration-300 hover:-translate-y-0.5"
              onClick={() => navigate("/chat")}
            >
              ✦ Ask Zocesh Study AI
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <Stat icon="🔥" num={`${st.streak}d`} label="Study streak" />
        <Stat icon="✓" num={st.questions} label="Questions solved" />
        <Stat icon="★" num={`${st.avg}%`} label="Average quiz score" />
        <Stat icon="◈" num={st.done} label="Topics mastered" />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold">Quick actions</h2>
            <p className="mt-1 text-xs text-slate-500">Jump straight into your study tools.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Action
            icon="✦"
            title="Ask AI"
            sub="Tutor, explain or solve"
            onClick={() => navigate("/chat")}
          />
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
          <Action
            icon="◷"
            title="Study Planner"
            sub="Plan your week"
            onClick={() => navigate("/planner")}
          />
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold">My subjects</h2>
              <p className="mt-1 text-xs text-slate-500">
                Continue learning from your subjects.
              </p>
            </div>

            <button
              className="btn shrink-0 transition-all duration-300 hover:-translate-y-0.5"
              onClick={() => navigate("/subjects")}
            >
              View all
            </button>
          </div>

          <div className="grid min-w-0 gap-3 sm:grid-cols-2 md:grid-cols-1">
            {subjects.slice(0, 4).map((s) => (
              <SubjectCard key={s} subject={s} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-bold">Recent activity</h2>

          <div className="card min-h-[150px] transition-all duration-300 hover:border-brand-400/30">
            {recent ? (
              <>
                <b className="block break-words">{recent.subject || "Study"}</b>
                <p className="mt-1 break-words text-sm text-slate-400">
                  {recent.topic || "Study session"} ·{" "}
                  {recent.type === "quiz"
                    ? `${recent.score}/${recent.total}`
                    : "Completed"}
                </p>
              </>
            ) : (
              <div className="py-6 text-center">
                <div className="mb-2 text-3xl animate-pulse">✦</div>
                <b className="block">Your study journey starts here.</b>
                <p className="mt-1 text-sm text-slate-500">
                  Start a topic or quiz to build your progress.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
