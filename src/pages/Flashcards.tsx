import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "@/store/AppContext";
import { fromTopic } from "@/lib/flashcards";
import { getSubject } from "@/data/curriculum";
import type { FlashCard } from "@/types";

export default function Flashcards() {
  const location = useLocation();
  const navigate = useNavigate();
  const { className, subjects } = useApp();
  const navState = (location.state as { subject?: string; topic?: string }) || {};
  const subject = navState.subject || subjects[0] || "Mathematics";
  const topic = navState.topic || getSubject(subject, className)?.topics[0]?.title;

  const [cards, setCards] = useState<FlashCard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setCards(fromTopic(className, subject, topic));
    setIndex(0);
    setFlipped(false);
  }, [className, subject, topic]);

  if (!cards.length) {
    return (
      <div className="card py-10 text-center">
        <b>No flashcards available for this topic yet.</b>
        <div className="mt-4">
          <button className="btn" onClick={() => navigate("/subjects")}>
            Back to Subjects
          </button>
        </div>
      </div>
    );
  }

  const card = cards[index];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="pill">{subject}</span>
          <h2 className="mt-2 font-display text-xl font-bold">Flashcards</h2>
        </div>
        <span className="pill">
          {index + 1}/{cards.length}
        </span>
      </div>

      <div className="[perspective:1200px]">
        <button
          onClick={() => setFlipped((f) => !f)}
          className="relative h-72 w-full [transform-style:preserve-3d] transition-transform duration-500"
          style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
        >
          <div className="card absolute inset-0 flex flex-col items-center justify-center gap-2 p-8 text-center [backface-visibility:hidden]">
            <span className="pill">Tap to reveal</span>
            <h2 className="font-display text-2xl font-bold">{card.front}</h2>
          </div>
          <div
            className="card absolute inset-0 flex flex-col items-center justify-center gap-2 border-brand-400/40 bg-brand-500/10 p-8 text-center [backface-visibility:hidden]"
            style={{ transform: "rotateY(180deg)" }}
          >
            <span className="pill">Answer</span>
            <h2 className="font-display text-xl font-bold">{card.back}</h2>
          </div>
        </button>
      </div>

      <div className="flex justify-center gap-3">
        <button
          className="btn"
          onClick={() => {
            setIndex((i) => (i - 1 + cards.length) % cards.length);
            setFlipped(false);
          }}
        >
          ← Previous
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            setIndex((i) => (i + 1) % cards.length);
            setFlipped(false);
          }}
        >
          Next →
        </button>
        <button className="btn" onClick={() => navigate("/chat")}>
          Ask AI
        </button>
      </div>
    </div>
  );
}
