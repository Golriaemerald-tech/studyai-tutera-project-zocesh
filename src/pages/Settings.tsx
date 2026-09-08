import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState("");
  const [savingNickname, setSavingNickname] = useState(false);

  useEffect(() => {
    const loadNickname = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", user.id)
        .maybeSingle();

      setNickname(data?.nickname ?? "");
    };

    loadNickname();
  }, []);

  async function saveNickname() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setSavingNickname(true);

    const value = nickname.trim().slice(0, 24);

    const { error } = await supabase
      .from("profiles")
      .update({ nickname: value || null })
      .eq("id", user.id);

    setSavingNickname(false);

    if (error) {
      toast("Could not save nickname.", "error");
      return;
    }

    setNickname(value);
    toast("Nickname saved.", "success");
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
    a.download = "zocesh-study-ai-progress.json";
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
        <h2 className="mt-3 font-display text-2xl font-bold">Make Zocesh Study AI yours.</h2>
        <p className="mt-2 text-slate-400">
          Manage your class, subjects, AI connection, appearance and local study data.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
      <div className="card md:col-span-2">
        <h2 className="mb-2 font-display text-lg font-bold">Nickname</h2>
        <p className="mb-4 text-sm text-slate-400">
          Choose the name other students will see in Community, Direct Messages and Tutor AI.
          Staff accounts always display their rank.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={nickname}
            maxLength={24}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="What should we call you?"
            className="input flex-1"
          />
          <button
            className="btn"
            onClick={saveNickname}
            disabled={savingNickname}
          >
            {savingNickname ? "Saving..." : "Save nickname"}
          </button>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Maximum 24 characters.
        </p>
      </div>


        <div className="card">
          <h2 className="mb-4 font-display text-lg font-bold">Student</h2>
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-xs text-slate-500">Class</label>
              <select className="select" value={className} onChange={(e) => setClassName(e.target.value as ClassName)}>
                <option>JSS1</option>
                <option>JSS2</option>
                <option>JSS3</option>
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
        </div><div className="card">
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
          <p className="font-semibold">Zocesh Study AI</p>
          <p className="mt-1 text-slate-400">
            A mobile-first Nigerian secondary-school study companion. Built with Vite, React, TypeScript and
            Tailwind CSS, deployable on Vercel with a secure serverless Gemini proxy.
          </p>
        </div>
      </div>
    </div>
  );
}
