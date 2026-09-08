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
    version: 'v1.1.7',
    date: 'September 2026',
    title: 'Direct Messages & Personal Identity',
    status: 'Current',
    items: [
      { type: 'Added', text: 'Added Direct Messages so users can privately message other users one-to-one.' },
      { type: 'Added', text: 'Added nickname settings so users can choose how they are identified across the platform.' },
      { type: 'Added', text: 'Nicknames are used as the identity shown in Community, Direct Messages and Tutor AI.' },
      { type: 'Added', text: 'Added shared identity handling so the same user identity is used consistently across chat experiences.' },
      { type: 'Improved', text: 'Owner, Super Admin and Admin accounts now display their rank instead of their personal nickname in chat and messaging.' },
      { type: 'Improved', text: 'Direct Messages support realtime message updates.' },
      { type: 'Improved', text: 'Added nickname-aware Tutor AI interactions.' },
      { type: 'Fixed', text: 'Fixed user identity falling back to the profile display name instead of the saved nickname.' },
    ],
  },

  {
    version: 'v1.1.6',
    date: 'September 2026',
    title: 'Rank-Based Access & Dashboards',
    status: 'Current',
    items: [
      { type: 'Added', text: 'Added Owner rank with four protected owner-only pages.' },
      { type: 'Added', text: 'Added Super Admin rank with three protected administration pages.' },
      { type: 'Added', text: 'Added Admin rank with two protected administration pages.' },
      { type: 'Added', text: 'Added Teacher rank with a protected Teacher Dashboard.' },
      { type: 'Added', text: 'Students and regular Users do not receive rank-only pages.' },
      { type: 'Improved', text: 'Added rank-aware route protection so protected pages cannot be opened by unauthorized ranks.' },
      { type: 'Improved', text: 'Extended the authentication context with Owner and Teacher access states.' },
    ],
  },

  {
    version: 'v1.1.5',
    date: 'September 2026',
    title: 'External Examination Curricula',
    status: 'Current',
    items: [
      { type: 'Added', text: 'Added Junior WAEC / BECE preparation for JSS3.' },
      { type: 'Added', text: 'Added NECO BECE preparation for JSS3.' },
      { type: 'Added', text: 'Added Lagos State BECE preparation for JSS3.' },
      { type: 'Added', text: 'Added WAEC preparation for SS3.' },
      { type: 'Added', text: 'Added NECO SSCE preparation for SS3.' },
      { type: 'Added', text: 'Added GCE preparation for SS3.' },
      { type: 'Added', text: 'Added JAMB / UTME preparation for SS3.' },
      { type: 'Added', text: 'Added NABTEB preparation for SS3.' },
      { type: 'Improved', text: 'Study Mode now uses the selected examination curriculum by its proper name when generating questions.' },
      { type: 'Improved', text: 'External examination curricula automatically determine the examination scope.' },
      { type: 'Improved', text: 'The Topic field is hidden when an external examination curriculum is selected because a separate topic is not required.' },
      { type: 'Improved', text: 'The Topic field automatically returns when the NERDC curriculum is selected.' },
      { type: 'Fixed', text: 'Fixed Study Mode showing only the NERDC curriculum for SS3.' },
      { type: 'Fixed', text: 'Fixed external examination selections not being available from the curriculum dropdown.' },
    ],
  },

  {
    version: 'v1.1.4',
    date: 'September 2026',
    title: 'External Exam Curricula & Study Mode Improvements',
    status: 'Current',
    items: [
      { type: 'Added', text: 'Restored Junior WAEC / BECE preparation for JSS3.' },
      { type: 'Added', text: 'Restored NECO BECE preparation for JSS3.' },
      { type: 'Added', text: 'Added Lagos State BECE preparation for JSS3.' },
      { type: 'Added', text: 'Restored WAEC preparation for SS3.' },
      { type: 'Added', text: 'Restored NECO preparation for SS3.' },
      { type: 'Added', text: 'Added GCE preparation for SS3.' },
      { type: 'Added', text: 'Added JAMB / UTME preparation for SS3.' },
      { type: 'Added', text: 'Added NABTEB preparation for SS3.' },
      { type: 'Improved', text: 'Selected examination curricula are now passed to the AI using their proper curriculum names.' },
      { type: 'Improved', text: 'Objective answers in Test Mode are evaluated immediately after selection.' },
      { type: 'Improved', text: 'Exam Mode continues to hide correctness and explanations until the exam is complete.' },
      { type: 'Improved', text: 'External examination options now change automatically according to the selected class.' },
      { type: 'Fixed', text: 'Fixed Study Mode using only the internal curriculum ID when generating questions.' },
      { type: 'Fixed', text: 'Preserved the NERDC curriculum and Supabase curriculum integration while restoring examination pathways.' },
    ],
  },

  {
    version: 'v1.1.3',
    date: 'September 2026',
    title: 'Supabase Curriculum Integration',
    status: 'Current',
    items: [
      { type: 'Added', text: 'Connected the Subjects experience to the Supabase curriculum service.' },
      { type: 'Added', text: 'Added Supabase-powered curriculum loading based on the student class.' },
      { type: 'Added', text: 'Added support for JSS1, JSS2, JSS3, SS1, SS2 and SS3 curriculum structures.' },
      { type: 'Added', text: 'Added curriculum subject categories from the database.' },
      { type: 'Improved', text: 'Subjects now use curriculum data loaded from the Zocesh Study AI Supabase project.' },
      { type: 'Improved', text: 'Added curriculum loading states while subjects are being retrieved.' },
      { type: 'Improved', text: 'Added a graceful fallback when the latest curriculum cannot be loaded.' },
      { type: 'Improved', text: 'Kept subject progress indicators compatible while the curriculum migration continues.' },
      { type: 'Fixed', text: 'Fixed TypeScript compatibility issues between the new curriculum layer and existing Study Mode/progress code.' },
      { type: 'Fixed', text: 'Fixed Study Mode curriculum selection so curriculum IDs are used correctly in the selector.' },
      { type: 'Fixed', text: 'Fixed curriculum filtering by class level.' },
      { type: 'Improved', text: 'Preserved the existing subject navigation and study workflow during the curriculum migration.' },
    ],
  },

  {
    version: 'v1.1.2',
    date: 'September 2026',
    title: 'Advanced Study, Test & Exam Modes',
    status: 'Major Update',
    items: [
      { type: 'Added', text: 'Study Mode question types: Objectives, Theory and Objectives + Theory.' },
      { type: 'Added', text: 'Objective questions with selectable answer options.' },
      { type: 'Added', text: 'Theory questions with a written-answer field.' },
      { type: 'Added', text: 'AI evaluation of theory answers, including correct points, mistakes, missing information and areas to work on.' },
      { type: 'Added', text: 'Test Mode with immediate answer evaluation and explanations.' },
      { type: 'Added', text: 'Exam Mode with objectives-only questions and results revealed after completion.' },
      { type: 'Added', text: 'Exam performance summary with score and percentage.' },
      { type: 'Improved', text: 'Study sessions now present questions one at a time for focused practice.' },
      { type: 'Improved', text: 'Practice feedback is separated from exam assessment.' },
    ],
  },

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
