import { findTopic } from "@/data/curriculum";
import { generateJSON } from "@/lib/gemini";
import type { ClassName, QuizQuestion, QuizState } from "@/types";

export function localQuestions(className: ClassName, subject: string, topic?: string): QuizQuestion[] {
  const t = topic ? findTopic(className, subject, topic) : null;
  if (!t) return [];
  return [
    {
      question: `Which statement best describes ${t.title}?`,
      options: [t.description, "A topic unrelated to the subject", "A laboratory safety rule", "A type of examination"],
      answer: 0,
      explanation: t.objectives?.[0] || "Review the topic objectives.",
    },
    {
      question: `Which is a useful study habit for ${t.title}?`,
      options: ["Memorise without understanding", "Identify the key idea and practise it", "Skip worked examples", "Avoid checking units"],
      answer: 1,
      explanation: "Understanding the key idea and practising application improves retention.",
    },
    {
      question: `What should you do when solving a ${t.title} question?`,
      options: ["Ignore the wording", "Show relevant reasoning and check the result", "Choose the longest answer", "Never review your work"],
      answer: 1,
      explanation: "Clear reasoning and a final check reduce avoidable mistakes.",
    },
    {
      question: "Which level is this practice set designed for?",
      options: [className, "Primary 3", "University only", "Postgraduate"],
      answer: 0,
      explanation: `The set is adapted for ${className}.`,
    },
  ];
}

export async function generateAIQuiz(opts: {
  className: ClassName;
  subject: string;
  topic?: string;
  examContext?: string;
}): Promise<QuizQuestion[]> {
  const schema = `{"questions": [{"question": string, "options": [string, string, string, string], "answer": number (0-3 index of correct option), "explanation": string}]} — return exactly 5 questions.`;
  const prompt = `Create a 5-question multiple-choice quiz for a ${opts.className} Nigerian secondary-school student on the subject "${opts.subject}"${
    opts.topic ? `, topic "${opts.topic}"` : ""
  }. Context: ${opts.examContext || "WAEC/NECO practice"}. Keep questions exam-relevant and age-appropriate.`;
  const result = await generateJSON<{ questions: QuizQuestion[] }>(prompt, schema, {
    systemInstruction: "You are STUDYAI, an educational quiz generator for Nigerian secondary schools.",
  });
  const qs = Array.isArray(result?.questions) ? result.questions : [];
  return qs.filter((q) => q && Array.isArray(q.options) && q.options.length >= 2);
}

export function startQuiz(questions: QuizQuestion[], meta: QuizState["meta"]): QuizState {
  return { questions, index: 0, answers: Array(questions.length).fill(null), meta };
}
