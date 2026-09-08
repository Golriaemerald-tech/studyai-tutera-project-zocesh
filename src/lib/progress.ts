import { Storage } from "@/lib/storage";
import { classes, getSubject } from "@/data/curriculum";
import type { ClassName, ProgressData, QuizResult } from "@/types";

const defaults: ProgressData = {
  topics: {},
  quizResults: [],
  sessions: [],
  questions: 0,
  correct: 0,
  streak: 0,
  lastStudy: null,
  recent: [],
};

function data(): ProgressData {
  return Storage.get("progress", defaults);
}

function save(p: ProgressData): ProgressData {
  Storage.set("progress", p);
  return p;
}

function updateStreak(p: ProgressData) {
  const day = 24 * 60 * 60 * 1000;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!p.lastStudy) return;
  const last = new Date(p.lastStudy);
  last.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - last.getTime()) / day);
  p.streak = Math.max(1, p.streak || 0);
  if (diff === 0) p.streak = Math.max(1, p.streak);
  else if (diff === 1) p.streak = (p.streak || 0) + 1;
  else if (diff > 1) p.streak = 1;
}

export function markTopic(className: ClassName, subject: string, topic: string) {
  const p = data();
  p.topics[`${className}|${subject}|${topic}`] = true;
  p.sessions.push(Date.now());
  p.lastStudy = Date.now();
  p.recent.unshift({ type: "topic", subject, topic, at: Date.now() });
  p.recent = p.recent.slice(0, 12);
  updateStreak(p);
  return save(p);
}

export function isTopicDone(c: ClassName, s: string, t: string) {
  return Boolean(data().topics[`${c}|${s}|${t}`]);
}

export function recordQuiz(result: Omit<QuizResult, "at">) {
  const p = data();
  p.quizResults.unshift({ ...result, at: Date.now() });
  p.quizResults = p.quizResults.slice(0, 50);
  p.questions += result.total;
  p.correct += result.score;
  p.lastStudy = Date.now();
  p.sessions.push(Date.now());
  p.recent.unshift({
    type: "quiz",
    subject: result.subject,
    topic: result.topic,
    score: result.score,
    total: result.total,
    at: Date.now(),
  });
  p.recent = p.recent.slice(0, 12);
  updateStreak(p);
  return save(p);
}

export function stats(className: ClassName, subjects: string[]) {
  const p = data();
  const all: { topics: unknown[] }[] = [];
  const total = all.reduce((n, item) => n + item.topics.length, 0);
  const done = Object.keys(p.topics).filter((k) => k.startsWith(className + "|")).length;
  const subjectStats: Record<string, { done: number; total: number }> = {};
  subjects.forEach((s) => {
    const meta = getSubject(s, className);
    const d = meta?.topics.filter((t) => isTopicDone(className, s, t.title)).length || 0;
    subjectStats[s] = { done: d, total: meta?.topics.length || 0 };
  });
  let weakest = subjects[0] || "Mathematics";
  subjects.forEach((s) => {
    const ratio = (a: string) => (subjectStats[a]?.done || 0) / (subjectStats[a]?.total || 1);
    if (ratio(s) < ratio(weakest)) weakest = s;
  });
  return {
    streak: p.streak || 0,
    questions: p.questions || 0,
    avg: p.questions ? Math.round((p.correct / p.questions) * 100) : 0,
    done,
    total,
    weakest,
    subjectStats,
    recent: p.recent || [],
  };
}

export function resetProgress() {
  Storage.remove("progress");
  Storage.remove("studyPlan");
}

export function exportProgress(className: ClassName, subjects: string[], goal: string) {
  return {
    version: 1,
    studentClass: className,
    selectedSubjects: subjects,
    studentGoal: goal,
    progress: data(),
    studyPlan: Storage.get("studyPlan", []),
  };
}

export function importProgress(payload: any) {
  if (payload?.progress) Storage.set("progress", payload.progress);
  if (payload?.studyPlan) Storage.set("studyPlan", payload.studyPlan);
}
