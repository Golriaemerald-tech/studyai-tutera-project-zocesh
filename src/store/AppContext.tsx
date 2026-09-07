import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Storage } from "@/lib/storage";
import type { ClassName, LearningMode } from "@/types";

export interface Toast {
  id: number;
  message: string;
  tone: "default" | "success" | "error";
}

interface AppState {
  className: ClassName;
  subjects: string[];
  goal: string;
  selectedSubject: string | null;
  selectedTopic: string | null;
  mode: LearningMode;
  theme: "dark" | "light" | "system";
  onboardingComplete: boolean;
}

interface AppContextValue extends AppState {
  setClassName: (c: ClassName) => void;
  setSubjects: (s: string[]) => void;
  setGoal: (g: string) => void;
  setSelectedSubject: (s: string | null) => void;
  setSelectedTopic: (t: string | null) => void;
  setMode: (m: LearningMode) => void;
  setTheme: (t: AppState["theme"]) => void;
  completeOnboarding: (c: ClassName, subjects: string[], goal: string) => void;
  toasts: Toast[];
  toast: (message: string, tone?: Toast["tone"]) => void;
}

const DEFAULT_SUBJECTS = ["Mathematics", "English Language", "Physics", "Chemistry", "Biology"];

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [className, setClassNameState] = useState<ClassName>(() => Storage.get("studentClass", "SS1" as ClassName));
  const [subjects, setSubjectsState] = useState<string[]>(() => Storage.get("selectedSubjects", DEFAULT_SUBJECTS));
  const [goal, setGoalState] = useState<string>(() => Storage.get("studentGoal", "Improve my grades"));
  const [selectedSubject, setSelectedSubjectState] = useState<string | null>(() => Storage.get("selectedSubject", null));
  const [selectedTopic, setSelectedTopicState] = useState<string | null>(() => Storage.get("selectedTopic", null));
  const [mode, setModeState] = useState<LearningMode>("Tutor");
  const [theme, setThemeState] = useState<AppState["theme"]>(() => Storage.get("theme", "dark"));
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(() =>
    Storage.get("onboardingComplete", false)
  );
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let actual: "dark" | "light" = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
      : theme;
    document.documentElement.dataset.theme = actual;
    document.documentElement.classList.toggle("dark", actual === "dark");
  }, [theme]);

  const setClassName = useCallback((c: ClassName) => {
    setClassNameState(c);
    Storage.set("studentClass", c);
  }, []);

  const setSubjects = useCallback((s: string[]) => {
    setSubjectsState(s);
    Storage.set("selectedSubjects", s);
  }, []);

  const setGoal = useCallback((g: string) => {
    setGoalState(g);
    Storage.set("studentGoal", g);
  }, []);

  const setSelectedSubject = useCallback((s: string | null) => {
    setSelectedSubjectState(s);
    Storage.set("selectedSubject", s);
  }, []);

  const setSelectedTopic = useCallback((t: string | null) => {
    setSelectedTopicState(t);
    Storage.set("selectedTopic", t);
  }, []);

  const setMode = useCallback((m: LearningMode) => setModeState(m), []);

  const setTheme = useCallback((t: AppState["theme"]) => {
    setThemeState(t);
    Storage.set("theme", t);
  }, []);

  const completeOnboarding = useCallback((c: ClassName, subs: string[], g: string) => {
    setClassNameState(c);
    setSubjectsState(subs);
    setGoalState(g);
    Storage.set("studentClass", c);
    Storage.set("selectedSubjects", subs);
    Storage.set("studentGoal", g);
    Storage.set("onboardingComplete", true);
    setOnboardingComplete(true);
  }, []);

  const toast = useCallback((message: string, tone: Toast["tone"] = "default") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      className,
      subjects,
      goal,
      selectedSubject,
      selectedTopic,
      mode,
      theme,
      onboardingComplete,
      setClassName,
      setSubjects,
      setGoal,
      setSelectedSubject,
      setSelectedTopic,
      setMode,
      setTheme,
      completeOnboarding,
      toasts,
      toast,
    }),
    [
      className,
      subjects,
      goal,
      selectedSubject,
      selectedTopic,
      mode,
      theme,
      onboardingComplete,
      setClassName,
      setSubjects,
      setGoal,
      setSelectedSubject,
      setSelectedTopic,
      setMode,
      setTheme,
      completeOnboarding,
      toasts,
      toast,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
