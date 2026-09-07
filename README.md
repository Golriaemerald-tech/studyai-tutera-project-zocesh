# StudyAI

An AI-powered study companion for SS1–SS3 Nigerian secondary-school students —
tutoring chat, quizzes, flashcards, progress tracking and a weekly study planner.

Rebuilt as a **Vite + React + TypeScript + Tailwind CSS** app with a secure
**Vercel serverless function** that proxies Gemini requests, so the API key
never reaches the browser.

## What changed from the original prototype

- **Fixed the "loads and shows nothing" chat bug.** The original app called
  Gemini directly from the browser and silently swallowed several failure
  paths (a missing `Gemini.generateQuiz` method, an empty-response case that
  wasn't surfaced clearly). The new `/api/chat` function does robust
  request/response handling and always returns either real text or a clear
  error message.
- **API key moved server-side.** `GEMINI_API_KEY` now lives in Vercel
  environment variables and is used only inside `api/chat.ts`. It is never
  shipped to the client.
- **Fixed a real storage bug**: the original `Chat.save()` passed the `key`
  *function* into storage instead of calling `key()`, which corrupted chat
  history persistence. Fixed in `src/lib/chat.ts`.
- **Full redesign**: new dark/light theme, sidebar + mobile nav, animated
  chat bubbles, flip flashcards, redesigned quiz and planner flows — same
  functionality, modern component-based UI.

## Project structure

```
api/chat.ts            Vercel serverless function — talks to Gemini using GEMINI_API_KEY
src/data/curriculum.ts Curriculum content (ported from the original app)
src/lib/                Storage, chat, quiz, flashcards, planner, progress, gemini client
src/store/AppContext.tsx  Global app state (class, subjects, goal, theme, toasts)
src/pages/               Home, Subjects, SubjectTopics, Chat, Quiz, Flashcards, Progress, Settings, Planner
src/components/          Layout (sidebar/topbar/mobile nav), Onboarding, Toasts
```

## Local development

```bash
npm install
cp .env.example .env.local   # add your real GEMINI_API_KEY
npm run dev                  # front end only, at http://localhost:5173

# To exercise the real /api/chat function locally, use the Vercel CLI instead:
npm install -g vercel
vercel dev
```

## Deploying to Vercel

1. Push this project to a Git repository (GitHub/GitLab/Bitbucket).
2. In Vercel, "Add New Project" → import the repo. Vercel auto-detects the
   Vite framework from `vercel.json`.
3. In **Project Settings → Environment Variables**, add:
   - `GEMINI_API_KEY` — your Gemini API key (get one at
     [Google AI Studio](https://aistudio.google.com/apikey))
   - `GEMINI_MODEL` — optional, defaults to `gemini-3.5-flash-lite`
4. Deploy. The frontend calls `/api/chat`, which Vercel automatically wires
   up as a serverless function from `api/chat.ts`.

Or via CLI:

```bash
npm install -g vercel
vercel
vercel env add GEMINI_API_KEY
vercel --prod
```

## Notes

- All study progress, chat history and preferences are stored in the
  browser's `localStorage` — there's no user account/database in this
  version.
- The onboarding flow (class, subjects, goal) runs once and can be changed
  later from Settings.
