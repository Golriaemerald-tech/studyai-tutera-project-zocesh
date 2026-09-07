import { useRef, useState } from "react";
import { useApp } from "@/store/AppContext";
import { allSubjectNames } from "@/data/curriculum";
import * as Gemini from "@/lib/gemini";
import { exportProgress, importProgress, resetProgress } from "@/lib/progress";
import type { ClassName } from "@/types";

const GOALS = [
  "Improve my grades",
  "Prepare for exams",
  "Understand difficult topics",
  "Practice more",
  "Become an excellent student",
];

export default function Settings() {
  const { className, setClassName, goal, setGoal, subjects, setSubjects, theme, setTheme, toast } = useApp();
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "ok" | "error">("unknown");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function testConnection() {
    setTesting(true);
    toast("Testing Gemini connection…");
    try {
      const result = await Gemini.testConnection();
      setConnectionStatus("ok");
      toast(result.includes("successful") ? "Gemini connected ✓" : "Gemini responded ✓", "success");
    } catch (err: any) {
      setConnectionStatus("error");
      toast(err?.message || "Gemini connection failed.", "error");
    } finally {
      setTesting(false);
    }
  }

  function toggleSubject(s: string) {
    const next = subjects.includes(s) ? subjects.filter((x) => x !== s) : [...subjects, s];
    setSubjects(next.length ? next : ["Mathematics"]);
  }

  function handleExport() {
    const payload = exportProgress(className, subjects, goal);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "studyai-progress.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    file
      .text()
      .then((text) => {
        importProgress(JSON.parse(text));
        toast("Progress imported.", "success");
      })
      .catch(() => toast("That file could not be imported.", "error"))
      .finally(() => {
        if (fileInputRef.current) fileInputRef.current.value = "";
      });
  }

  function handleReset() {
    if (confirm("Reset local progress? Your profile will remain.")) {
      resetProgress();
      toast("Progress reset.", "success");
    }
  }

  return (
    <div className="space-y-8">
      <div className="card">
        <span className="pill">Settings</span>
        <h2 className="mt-3 font-display text-2xl font-bold">Make StudyAI yours.</h2>
        <p className="mt-2 text-slate-400">
          Manage your class, subjects, AI connection, appearance and local study data.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 font-display text-lg font-bold">Student</h2>
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-xs text-slate-500">Class</label>
              <select className="select" value={className} onChange={(e) => setClassName(e.target.value as ClassName)}>
                <option>SS1</option>
                <option>SS2</option>
                <option>SS3</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">Learning goal</label>
              <select className="select" value={goal} onChange={(e) => setGoal(e.target.value)}>
                {GOALS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-xs text-slate-500">Subjects</label>
            <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto pr-1">
              {allSubjectNames().map((s) => (
                <label
                  key={s}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs transition ${
                    subjects.includes(s)
                      ? "border-brand-400 bg-brand-500/10 text-brand-100"
                      : "border-surface-border bg-surface-raised/40 text-slate-400"
                  }`}
                >
                  <input type="checkbox" className="accent-brand-500" checked={subjects.includes(s)} onChange={() => toggleSubject(s)} />
                  {s}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Gemini AI</h2>
            <span className={`pill ${connectionStatus === "ok" ? "border-brand-400/50 text-brand-300" : ""}`}>
              {connectionStatus === "ok" ? "Connected ✓" : "Server-side connection"}
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Model: <b className="text-slate-200">gemini-3.5-flash-lite</b>
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Your Gemini API key is stored securely as a server environment variable (
            <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">GEMINI_API_KEY</code>) and never touches
            the browser. Requests are proxied through <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">/api/chat</code>.
          </p>
          <button className="btn btn-primary mt-4" onClick={testConnection} disabled={testing}>
            {testing ? "Testing…" : "Test Connection"}
          </button>
        </div>

        <div className="card">
          <h2 className="mb-4 font-display text-lg font-bold">Appearance</h2>
          <div className="flex gap-2">
            {(["dark", "light", "system"] as const).map((t) => (
              <button
                key={t}
                className={`btn ${theme === t ? "border-brand-400/60 text-brand-200" : ""}`}
                onClick={() => setTheme(t)}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="mb-4 font-display text-lg font-bold">Data</h2>
          <div className="flex flex-wrap gap-2">
            <button className="btn" onClick={handleExport}>
              Export progress
            </button>
            <button className="btn" onClick={() => fileInputRef.current?.click()}>
              Import progress
            </button>
            <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={handleImport} />
            <button className="btn btn-danger" onClick={handleReset}>
              Reset progress
            </button>
          </div>
        </div>

        <div className="card md:col-span-2">
          <h2 className="mb-2 font-display text-lg font-bold">About</h2>
          <p className="font-semibold">StudyAI v2.0.0</p>
          <p className="mt-1 text-slate-400">
            A mobile-first SS1–SS3 Nigerian secondary-school study companion. Built with Vite, React, TypeScript and
            Tailwind CSS, deployable on Vercel with a secure serverless Gemini proxy.
          </p>
        </div>
      </div>
    </div>
  );
}
