import { CheckCircle2, Clock3, Plus, Sparkles, Wrench } from 'lucide-react';

type Update = {
  version: string;
  date: string;
  title: string;
  status: 'Current' | 'Major Update' | 'Planned';
  items: {
    type: 'Added' | 'Fixed' | 'Improved' | 'Removed' | 'Known bug' | 'Planned';
    text: string;
  }[];
};

const updates: Update[] = [
  {
    version: 'v1.1',
    date: 'September 2026',
    title: 'AI Study Tools & Cloud History',
    status: 'Current',
    items: [
      { type: 'Added', text: 'Supabase authentication and cloud-backed student accounts.' },
      { type: 'Added', text: 'Persistent AI chat conversations and message history.' },
      { type: 'Added', text: 'Previous chats dropdown and New Chat functionality.' },
      { type: 'Added', text: 'AI-powered Study Mode with class, department, subject, curriculum, question count and time controls.' },
      { type: 'Added', text: 'AI-generated flashcards with configurable card counts.' },
      { type: 'Added', text: 'ElevenLabs text-to-speech support for AI responses.' },
      { type: 'Added', text: 'About page for Zocesh Study AI and its creators.' },
      { type: 'Improved', text: 'Student-focused AI tutoring instructions and explanations.' },
      { type: 'Improved', text: 'Chat experience with conversation switching and persistent data.' },
      { type: 'Removed', text: 'Unnecessary Gemini model/explanation information from Settings.' },
      { type: 'Fixed', text: 'Chat history now persists through Supabase instead of relying only on local browser storage.' },
      { type: 'Fixed', text: 'Voice playback handling now supports stopping and finishing audio correctly.' },
    ],
  },
  {
    version: 'v1.2',
    date: 'Coming soon',
    title: 'Verified Nigerian Curriculum',
    status: 'Major Update',
    items: [
      { type: 'Planned', text: 'Complete JSS1–JSS3 and SS1–SS3 curriculum structure.' },
      { type: 'Planned', text: 'Verified Nigerian curriculum content based on authoritative curriculum sources.' },
      { type: 'Planned', text: 'Junior WAEC / NECO and Lagos State BECE support for JSS3.' },
      { type: 'Planned', text: 'WAEC, JAMB, NECO and GCE preparation pathways for SS3.' },
      { type: 'Planned', text: 'Detailed subjects, topics, subtopics, objectives and examination guidance.' },
      { type: 'Planned', text: 'Versioned curriculum data so future curriculum changes can be tracked safely.' },
    ],
  },
];

function typeIcon(type: Update['items'][number]['type']) {
  if (type === 'Added') return <Plus size={15} />;
  if (type === 'Fixed') return <Wrench size={15} />;
  if (type === 'Improved') return <Sparkles size={15} />;
  if (type === 'Removed') return <CheckCircle2 size={15} />;
  return <Clock3 size={15} />;
}

export default function Updates() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Updates</h1>
        <p className="mt-1 text-sm text-white/60">
          A record of what has been added, fixed, improved, removed and planned
          for Zocesh Study AI.
        </p>
      </div>

      {updates.map((update) => (
        <section
          key={update.version}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{update.title}</h2>
                <span className="rounded-full bg-white/10 px-2 py-1 text-xs">
                  {update.version}
                </span>
              </div>
              <p className="mt-1 text-sm text-white/50">{update.date}</p>
            </div>

            <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium">
              {update.status}
            </span>
          </div>

          <div className="space-y-3">
            {update.items.map((item, index) => (
              <div
                key={`${update.version}-${index}`}
                className="flex gap-3 rounded-xl bg-black/10 p-3"
              >
                <div className="mt-0.5 shrink-0">{typeIcon(item.type)}</div>

                <div className="min-w-0">
                  <span className="mr-2 text-xs font-semibold text-white/50">
                    {item.type}
                  </span>
                  <span className="text-sm leading-6 text-white/75">
                    {item.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="pb-6 text-center text-xs text-white/35">
        New changes will be documented here as Zocesh Study AI evolves.
      </div>
    </div>
  );
}
