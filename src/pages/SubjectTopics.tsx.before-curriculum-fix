import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/store/AppContext";
import { getSubject } from "@/data/curriculum";
import { markTopic } from "@/lib/progress";

export default function SubjectTopics() {
  const navigate = useNavigate();
  const { subject: subjectParam } = useParams();
  const subject = decodeURIComponent(subjectParam || "");
  const { className, setSelectedSubject, setSelectedTopic, setMode } = useApp();
  const meta = getSubject(subject, className);

  function learn(topic: string) {
    setSelectedSubject(subject);
    setSelectedTopic(topic);
    markTopic(className, subject, topic);
    setMode("Explain");
    navigate("/chat", { state: { autoAsk: `Teach me the topic "${topic}" from the beginning with examples and a short practice question.` } });
  }

  function quiz(topic: string) {
    setSelectedSubject(subject);
    setSelectedTopic(topic);
    navigate("/quiz", { state: { subject, topic, ai: false } });
  }

  function cards(topic: string) {
    setSelectedSubject(subject);
    setSelectedTopic(topic);
    navigate("/flashcards", { state: { subject, topic } });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="pill">
            {className} • {meta?.category || ""}
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold">{subject}</h2>
          <p className="mt-1 text-sm text-slate-500">{meta?.topics.length || 0} curriculum topics</p>
        </div>
        <button className="btn" onClick={() => navigate("/subjects")}>
          ← Subjects
        </button>
      </div>

      <div className="card space-y-3">
        {(meta?.topics || []).map((t) => (
          <div
            key={t.id}
            className="flex flex-col gap-3 rounded-xl border border-surface-border/60 bg-surface-raised/40 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <strong className="block">{t.title}</strong>
              <small className="text-slate-500">{t.description}</small>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="pill">{t.difficulty}</span>
                <span className="pill">{t.minutes} min</span>
                <span className={`pill ${t.examRelevance === "High" ? "border-warn/40 text-warn" : ""}`}>
                  {t.examRelevance} exam relevance
                </span>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button className="btn" onClick={() => learn(t.title)}>
                Learn
              </button>
              <button className="btn" onClick={() => quiz(t.title)}>
                Quiz
              </button>
              <button className="btn" onClick={() => cards(t.title)}>
                Cards
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
