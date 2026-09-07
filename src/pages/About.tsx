import { Building2, Code2, Heart, Sparkles } from "lucide-react";

export default function About() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-8">
      <section className="card border-brand-400/20 bg-gradient-to-br from-brand-500/10 via-surface to-surface">
        <span className="pill">About StudyAI</span>

        <div className="mt-4 flex items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-brand-400/30 bg-brand-500/10 text-brand-300">
            <Sparkles size={28} />
          </div>

          <div>
            <h1 className="font-display text-3xl font-bold">StudyAI</h1>
            <p className="text-sm text-brand-300">
              Nigeria Curriculum • AI-powered learning
            </p>
          </div>
        </div>

        <p className="mt-6 max-w-3xl leading-7 text-slate-300">
          StudyAI is an AI-powered learning platform built to help students
          understand their subjects, practise questions, revise with
          flashcards, plan their studies and prepare for important
          examinations.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <div className="mb-4 flex items-center gap-3">
            <Heart className="text-brand-300" size={21} />
            <h2 className="font-display text-xl font-bold">The vision</h2>
          </div>

          <p className="leading-7 text-slate-400">
            StudyAI is designed to make quality learning assistance easier to
            access while keeping lessons relevant to the curriculum and
            examination path of each student.
          </p>
        </div>

        <div className="card">
          <div className="mb-4 flex items-center gap-3">
            <Code2 className="text-brand-300" size={21} />
            <h2 className="font-display text-xl font-bold">The implementation</h2>
          </div>

          <ul className="space-y-3 text-sm leading-6 text-slate-400">
            <li>• Curriculum-aware AI tutoring.</li>
            <li>• Interactive study sessions and quizzes.</li>
            <li>• AI-generated flashcards and revision materials.</li>
            <li>• Study planning and progress tracking.</li>
            <li>• Secure server-side AI integrations.</li>
            <li>• Supabase-powered persistent features.</li>
            <li>• Voice synthesis through ElevenLabs.</li>
            <li>• Mobile-first React, TypeScript and Vite application.</li>
          </ul>
        </div>
      </section>

      <section className="card">
        <div className="mb-5 flex items-center gap-3">
          <Building2 className="text-brand-300" size={21} />
          <h2 className="font-display text-xl font-bold">The people and studios</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-surface-border bg-surface-raised p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Owner
            </p>
            <p className="mt-2 text-lg font-bold text-slate-100">
              Zo Eshalomi
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Owner and creator of StudyAI
            </p>
          </div>

          <div className="rounded-2xl border border-surface-border bg-surface-raised p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Studio
            </p>
            <p className="mt-2 text-lg font-bold text-slate-100">
              Zocesh Studios
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Creative and technology studio behind the project
            </p>
          </div>

          <div className="rounded-2xl border border-surface-border bg-surface-raised p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Studio
            </p>
            <p className="mt-2 text-lg font-bold text-slate-100">
              Emblem Creative Services
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Creative and development partner behind the project
            </p>
          </div>
        </div>
      </section>

      <section className="card">
        <span className="pill">Curriculum foundation</span>

        <p className="mt-4 leading-7 text-slate-400">
          StudyAI is being developed around official Nigerian curriculum
          materials, particularly NERDC resources, with support for relevant
          international curriculum structures where appropriate. Examination
          requirements may vary by examination body and school.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="btn">NERDC</span>
          <span className="btn">National Curriculum for England</span>
        </div>
      </section>
    </div>
  );
}
