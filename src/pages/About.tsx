import { BookOpen, Code2, Heart, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/10 p-3">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Zocesh Study AI</h1>
            <p className="text-sm text-white/60">
              Your intelligent secondary-school study companion.
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-3 text-xl font-semibold">About Zocesh Study AI</h2>
        <p className="leading-7 text-white/70">
          Zocesh Study AI is an educational platform designed to help
          secondary-school students learn, practise, revise and understand
          their subjects with the help of artificial intelligence.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <BookOpen className="mb-3" size={22} />
          <h2 className="mb-2 font-semibold">What it includes</h2>
          <ul className="space-y-2 text-sm text-white/70">
            <li>• AI tutoring and persistent chat history</li>
            <li>• AI-powered Study Mode</li>
            <li>• AI-generated flashcards</li>
            <li>• Quizzes and revision tools</li>
            <li>• Text-to-speech learning support</li>
            <li>• Student progress and study tools</li>
            <li>• Nigerian secondary-school curriculum support</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <Code2 className="mb-3" size={22} />
          <h2 className="mb-2 font-semibold">Implementations</h2>
          <p className="text-sm leading-6 text-white/70">
            The platform combines modern web technologies, AI services,
            secure authentication, cloud data storage and educational tools
            to create one unified study experience.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-xl font-semibold">Created by</h2>

        <div className="space-y-4 text-white/70">
          <div>
            <p className="font-semibold text-white">Zoe Eshalomi</p>
            <p className="text-sm">Owner & creator of Zocesh Study AI</p>
          </div>

          <div>
            <p className="font-semibold text-white">Zocesh Studios</p>
            <p className="text-sm">The studio behind the Zocesh project.</p>
          </div>

          <div>
            <p className="font-semibold text-white">
              Emblem Creative Services
            </p>
            <p className="text-sm">
              Creative and technology studio supporting the project.
            </p>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-center gap-2 pb-6 text-sm text-white/40">
        <Heart size={15} />
        <span>Built to make learning smarter and more accessible.</span>
      </div>
    </div>
  );
}
