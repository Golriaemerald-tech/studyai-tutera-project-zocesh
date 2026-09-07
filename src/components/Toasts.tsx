import { useApp } from "@/store/AppContext";

export default function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4 md:bottom-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto animate-fade-up rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-md ${
            t.tone === "success"
              ? "border-brand-400/40 bg-brand-500/15 text-brand-100"
              : t.tone === "error"
              ? "border-red-500/40 bg-red-500/15 text-red-100"
              : "border-surface-border bg-surface-raised/95 text-slate-100"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
