import { Storage } from "@/lib/storage";
import { getSubject } from "@/data/curriculum";
import type { ChatMessage, ClassName } from "@/types";

function historyKey(className: ClassName): string {
  return `chatHistory_${className}`;
}

export function getHistory(className: ClassName): ChatMessage[] {
  return Storage.get(historyKey(className), []);
}

function saveHistory(className: ClassName, h: ChatMessage[]) {
  // NOTE: the original prototype passed the `key` function itself into
  // Storage.set instead of calling it — that bug is fixed here by
  // resolving the key up front.
  Storage.set(historyKey(className), h.slice(-30));
}

export function addMessage(className: ClassName, role: ChatMessage["role"], text: string): ChatMessage[] {
  const h = getHistory(className);
  h.push({ role, text, at: Date.now() });
  saveHistory(className, h);
  return h;
}

export function clearHistory(className: ClassName) {
  Storage.remove(historyKey(className));
}

export function localReply(
  input: string,
  ctx: { subject?: string; topic?: string; className: ClassName }
): string {
  const q = input.toLowerCase();
  if (q.includes("quiz")) {
    return `## Let's practise, sir\nI can start a local ${
      ctx.subject || "study"
    } quiz from the built-in curriculum. Use **Start Quiz** or tell me the topic you want to practise.`;
  }
  if (q.includes("flash")) {
    return `## Flashcards\nChoose a topic and use **Flashcards** for quick recall practice.`;
  }
  const meta = ctx.subject ? getSubject(ctx.subject, ctx.className) : null;
  const topic = ctx.topic ? meta?.topics.find((t) => t.title === ctx.topic) : meta?.topics[0];
  if (topic) {
    return `## ${topic.title}\n\n**What it covers:** ${topic.description}\n\n### Objectives\n${topic.objectives
      .map((x) => "- " + x)
      .join("\n")}\n\n### Key idea\n${topic.formulas.join(" • ")}\n\n### Try This\nExplain the main idea in your own words, sir. Then ask me for a practice question.`;
  }
  return `## Offline Study Mode\nGemini isn't connected right now, sir, but I can still help you study using the built-in curriculum. Pick a subject and topic, or ask for a local quiz.`;
}
