import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Users,
  BookOpen,
  Activity,
  Clock,
  Trophy,
  RefreshCw,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";

type Progress = {
  user_id: string;
  subject: string | null;
  topic: string | null;
  score: number | null;
  minutes: number | null;
  lessons_completed: number | null;
  updated_at: string;
};

export default function TeacherDashboard() {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [students, setStudents] = useState(0);
  const [subjects, setSubjects] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTeacherData = async () => {
    setLoading(true);
    setError("");

    try {
      const [studentsResult, progressResult, subjectsResult] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .in("role", ["student", "user"]),

          supabase
            .from("learning_progress")
            .select(
              "user_id,subject,topic,score,minutes,lessons_completed,updated_at"
            )
            .order("updated_at", { ascending: false })
            .limit(300),

          supabase
            .from("curriculum_subjects")
            .select("*", { count: "exact", head: true }),
        ]);

      if (studentsResult.error) throw studentsResult.error;
      if (progressResult.error) throw progressResult.error;
      if (subjectsResult.error) throw subjectsResult.error;

      setStudents(studentsResult.count ?? 0);
      setProgress(progressResult.data ?? []);
      setSubjects(subjectsResult.count ?? 0);
    } catch (err: any) {
      setError(err?.message || "Unable to load teacher dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeacherData();
  }, []);

  const totalMinutes = useMemo(
    () => progress.reduce((sum, item) => sum + (item.minutes ?? 0), 0),
    [progress]
  );

  const completedLessons = useMemo(
    () =>
      progress.reduce(
        (sum, item) => sum + (item.lessons_completed ?? 0),
        0
      ),
    [progress]
  );

  const averageScore = useMemo(() => {
    const scored = progress.filter((item) => item.score !== null);

    if (!scored.length) return 0;

    return Math.round(
      scored.reduce((sum, item) => sum + Number(item.score ?? 0), 0) /
        scored.length
    );
  }, [progress]);

  const recentProgress = progress.slice(0, 12);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            </div>
            <p className="text-slate-400 mt-1">
              Monitor student learning activity and curriculum progress.
            </p>
          </div>

          <button
            onClick={loadTeacherData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2 hover:bg-slate-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </header>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat
            icon={<Users />}
            label="Students"
            value={students}
          />

          <Stat
            icon={<Activity />}
            label="Learning Records"
            value={progress.length}
          />

          <Stat
            icon={<Clock />}
            label="Study Minutes"
            value={totalMinutes}
          />

          <Stat
            icon={<Trophy />}
            label="Average Score"
            value={`${averageScore}%`}
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Panel
            icon={<BookOpen />}
            title="Curriculum"
            value={`${subjects} subjects available`}
            description="Use the curriculum and study tools to guide students through their class-level subjects."
          />

          <Panel
            icon={<GraduationCap />}
            title="Lessons Completed"
            value={completedLessons.toString()}
            description="Total completed lessons represented in the current learning-progress data."
          />
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-semibold">Recent Learning Activity</h2>
            <p className="text-sm text-slate-500 mt-1">
              Latest learning-progress records available to the dashboard.
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-400">
              Loading activity...
            </div>
          ) : recentProgress.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              No learning activity has been recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-slate-950">
                  <tr className="text-left text-sm text-slate-400">
                    <th className="p-4">Student ID</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Topic</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Minutes</th>
                    <th className="p-4">Updated</th>
                  </tr>
                </thead>

                <tbody>
                  {recentProgress.map((item, index) => (
                    <tr
                      key={`${item.user_id}-${item.updated_at}-${index}`}
                      className="border-t border-slate-800 hover:bg-slate-800/40"
                    >
                      <td className="p-4 text-xs text-slate-400 break-all">
                        {item.user_id}
                      </td>

                      <td className="p-4 text-slate-300">
                        {item.subject || "—"}
                      </td>

                      <td className="p-4 text-slate-400">
                        {item.topic || "—"}
                      </td>

                      <td className="p-4">
                        {item.score !== null
                          ? `${Number(item.score).toFixed(0)}%`
                          : "—"}
                      </td>

                      <td className="p-4 text-slate-400">
                        {item.minutes ?? 0}
                      </td>

                      <td className="p-4 text-xs text-slate-500">
                        {new Date(item.updated_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Teacher tools</h2>
          <p className="mt-2 text-slate-400">
            The dashboard currently focuses on live learning data. Assignment
            creation, class management and teacher-specific resources can be
            added as dedicated database-backed features.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 hover:bg-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Study AI
        </Link>
      </div>
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center gap-3 text-slate-400">
        {React.cloneElement(icon as React.ReactElement, {
          className: "w-5 h-5",
        })}
        <span>{label}</span>
      </div>

      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  );
}

function Panel({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center gap-3">
        <div className="text-slate-300">{icon}</div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <p className="mt-4 text-2xl font-bold">{value}</p>

      <p className="mt-2 text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
