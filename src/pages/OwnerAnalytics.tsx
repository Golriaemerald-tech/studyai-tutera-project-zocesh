import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, ArrowLeft, RefreshCw, Users, BookOpen, MessageSquare, Trophy, Clock } from "lucide-react";
import { supabase } from "../lib/supabase";

type Analytics = {
  users: number;
  students: number;
  teachers: number;
  conversations: number;
  messages: number;
  progress: number;
  achievements: number;
  studyMinutes: number;
};

export default function OwnerAnalytics() {
  const [data, setData] = useState<Analytics>({
    users: 0,
    students: 0,
    teachers: 0,
    conversations: 0,
    messages: 0,
    progress: 0,
    achievements: 0,
    studyMinutes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAnalytics() {
    setLoading(true);
    setError("");

    try {
      const [
        users,
        students,
        teachers,
        conversations,
        messages,
        progress,
        achievements,
        minutes,
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
        Promise.resolve({ count: 0, error: null }),
        supabase.from("conversations").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }),
        supabase.from("learning_progress").select("*", { count: "exact", head: true }),
        supabase.from("achievements").select("*", { count: "exact", head: true }),
        supabase.from("learning_progress").select("minutes"),
      ]);

      const errors = [
        users.error,
        students.error,
        teachers.error,
        conversations.error,
        messages.error,
        progress.error,
        achievements.error,
        minutes.error,
      ].filter(Boolean);

      if (errors.length) throw errors[0];

      const studyMinutes =
        (minutes.data ?? []).reduce(
          (total, row) => total + (Number(row.minutes) || 0),
          0
        );

      setData({
        users: users.count ?? 0,
        students: students.count ?? 0,
        teachers: teachers.count ?? 0,
        conversations: conversations.count ?? 0,
        messages: messages.count ?? 0,
        progress: progress.count ?? 0,
        achievements: achievements.count ?? 0,
        studyMinutes,
      });
    } catch (err: any) {
      setError(err?.message || "Unable to load analytics.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  const metrics = [
    ["Total Users", data.users, Users],
    ["Students", data.students, BookOpen],
    ["Teachers", data.teachers, Users],
    ["AI Conversations", data.conversations, MessageSquare],
    ["Messages", data.messages, MessageSquare],
    ["Learning Records", data.progress, BookOpen],
    ["Achievements", data.achievements, Trophy],
    ["Study Minutes", data.studyMinutes, Clock],
  ] as const;

  return (
    <main className="mx-auto max-w-7xl p-5 sm:p-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <BarChart3 size={30} />
            <h1 className="text-3xl font-bold">Owner Analytics</h1>
          </div>
          <p className="mt-2 text-white/50">
            Live platform and learning activity overview.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([label, value, Icon]) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">{label}</span>
              <Icon size={19} className="text-white/60" />
            </div>

            <p className="mt-3 text-3xl font-bold">
              {loading ? "—" : Number(value).toLocaleString()}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-bold">Platform Overview</h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-white/50">Student share</p>
            <p className="mt-1 text-2xl font-semibold">
              {data.users
                ? Math.round((data.students / data.users) * 100)
                : 0}%
            </p>
          </div>

          <div>
            <p className="text-sm text-white/50">Teacher share</p>
            <p className="mt-1 text-2xl font-semibold">
              {data.users
                ? Math.round((data.teachers / data.users) * 100)
                : 0}%
            </p>
          </div>

          <div>
            <p className="text-sm text-white/50">Average study minutes / record</p>
            <p className="mt-1 text-2xl font-semibold">
              {data.progress
                ? Math.round(data.studyMinutes / data.progress)
                : 0}
            </p>
          </div>
        </div>
      </section>

      <Link
        to="/owner"
        className="mt-7 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Owner Control Center
      </Link>
    </main>
  );
}
