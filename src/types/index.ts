export type ClassName = "SS1" | "SS2" | "SS3";

export type LearningMode =
  | "Tutor"
  | "Explain"
  | "Practice"
  | "Quiz"
  | "Exam"
  | "Revision"
  | "Homework Help"
  | "Flashcard"
  | "Socratic"
  | "Study Planner";

export interface Topic {
  id: string;
  subject: string;
  className: ClassName;
  title: string;
  description: string;
  objectives: string[];
  formulas: string[];
  commonMistakes: string[];
  examTips: string[];
  difficulty: "Easy" | "Medium" | "Challenging";
  minutes: number;
  examRelevance: "Low" | "Medium" | "High";
}

export interface SubjectMeta {
  icon: string;
  category: string;
  department: string;
  topics: Topic[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  at: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface QuizState {
  questions: QuizQuestion[];
  index: number;
  answers: (number | null)[];
  meta: { subject: string; topic?: string; ai?: boolean };
}

export interface FlashCard {
  front: string;
  back: string;
}

export interface QuizResult {
  subject: string;
  topic?: string;
  total: number;
  score: number;
  at: number;
}

export interface RecentActivity {
  type: "topic" | "quiz";
  subject: string;
  topic?: string;
  score?: number;
  total?: number;
  at: number;
}

export interface ProgressData {
  topics: Record<string, boolean>;
  quizResults: QuizResult[];
  sessions: number[];
  questions: number;
  correct: number;
  streak: number;
  lastStudy: number | null;
  recent: RecentActivity[];
}

export interface PlannerItem {
  day: string;
  time: string;
  subject: string;
  topic: string;
  minutes: number;
  focus: string;
  examDate?: string;
}
