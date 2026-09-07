import { Bug, CheckCircle2, Code2, Sparkles, Wrench } from "lucide-react";

const updates = [
  {
    version: "Current development",
    title: "StudyAI Learning System Expansion",
    status: "In progress",
    added: [
      "Expanded curriculum-aware Study Mode design",
      "Dynamic subjects by class and department",
      "Curriculum and examination selection",
      "Topic-based study generation",
      "Real quiz generation",
      "Flashcard generation system",
      "ElevenLabs voice synthesis integration",
    ],
    fixed: [
      "Quiz subject/topic TypeScript errors",
      "Incorrect StudyAI navigation between Tutor AI and Community",
      "Gemini server-side environment-variable handling",
    ],
  },
  {
    version: "v2.0",
    title: "StudyAI UI Restoration",
    status: "Completed",
    added: [
      "Restored StudyAI directory navigation",
      "Tutor AI page",
      "Overseer AI access",
      "Community page",
      "Profile and Settings pages",
      "Study, subjects, planner, progress and flashcards sections",
    ],
    fixed: [
      "Duplicate authentication provider",
      "Blank application caused by missing Supabase environment configuration",
      "Several navigation and routing problems",
    ],
  },
  {
    version: "v1.x",
    title: "Foundation",
    status: "Completed",
    added: [
      "Student authentication",
      "Nigerian secondary-school study structure",
      "AI tutoring foundation",
      "Local progress storage",
      "Initial quiz and flashcard systems",
    ],
    fixed: [
      "Initial application routing issues",
      "Early Gemini integration problems",
    ],
  },
];

export default function Updates() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-8">
      <section className="card border-brand-400/20 bg-gradient-to-br from-brand-500/10 via-surface to-surface">
        <span className="pill">Changelog</span>

        <div className="mt-4 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-brand-400/30 bg-brand-500/10 text-brand-300">
            <Sparkles size={24} />
          </div>

          <div>
            <h1 className="font-display text-3xl font-bold">
              StudyAI Updates
            </h1>
            <p className="text-sm text-slate-400">
              New features, improvements and bugs fixed.
            </p>
          </div>
        </div>

        <p className="mt-5 leading-7 text-slate-400">
          This page records the development history of StudyAI. Future
          releases should be added here so students can see exactly what
          changed.
        </p>
      </section>

      <div className="space-y-5">
        {updates.map((update) => (
          <article key={update.version} className="card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="pill">{update.version}</span>
                <h2 className="mt-3 font-display text-xl font-bold">
                  {update.title}
                </h2>
              </div>

              <span className="flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-500/10 px-3 py-1.5 text-xs text-brand-300">
                <CheckCircle2 size={14} />
                {update.status}
              </span>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-200">
                  <Sparkles size={17} className="text-brand-300" />
                  Added / improved
                </h3>

                <ul className="space-y-2 text-sm text-slate-400">
                  {update.added.map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-200">
                  <Bug size={17} className="text-amber-300" />
                  Bugs / fixes
                </h3>

                <ul className="space-y-2 text-sm text-slate-400">
                  {update.fixed.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Wrench size={16} className="mt-0.5 shrink-0 text-amber-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="card">
        <div className="flex items-center gap-3">
          <Code2 className="text-brand-300" size={20} />
          <h2 className="font-display text-lg font-bold">
            Development policy
          </h2>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Every significant StudyAI release should update this changelog with
          the new functionality, important improvements and bugs that were
          fixed. This keeps the development history transparent and useful.
        </p>
      </section>
    </div>
  );
}
