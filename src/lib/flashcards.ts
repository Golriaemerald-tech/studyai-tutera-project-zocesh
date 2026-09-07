import { findTopic } from "@/data/curriculum";
import type { ClassName, FlashCard } from "@/types";

export function fromTopic(className: ClassName, subject: string, topic?: string): FlashCard[] {
  const t = topic ? findTopic(className, subject, topic) : null;
  if (!t) return [];
  return [
    { front: `What is ${t.title}?`, back: t.description },
    { front: "What should you learn?", back: (t.objectives || []).join(" • ") },
    {
      front: "Key formula / idea",
      back: (t.formulas || []).join(" • ") || "Focus on the core concept and its application.",
    },
    { front: "Common mistake", back: (t.commonMistakes || ["Read the question carefully."])[0] },
    { front: "Exam tip", back: (t.examTips || ["Show your working and check your answer."])[0] },
  ];
}
