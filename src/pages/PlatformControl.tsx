import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  SlidersHorizontal,
  Database,
  Users,
  MessageSquare,
  BookOpen,
  Flag,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function PlatformControl() {
  const [stats, setStats] = useState({
    users: 0,
    conversations: 0,
    messages: 0,
    subjects: 0,
    reports: 0,
    database: "Checking...",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPlatform = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        users,
        conversations,
        messages,
        subjects,
        reports,
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase
          .from("conversations")
          .select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }),
        supabase
          .from("curriculum_subjects")
          .select("*", { count: "exact", head: true }),
        supabase.from("reports").select("*", { count: "exact", head: true }),
      ]);

      const firstError =
        users.error ||
        conversations.error ||
        messages.error ||
        subjects.error ||
        reports.error;

      if (firstError) throw firstError;

      setStats({
        users: users.count ?? 0,
        conversations: conversations.count ?? 0,
        messages: messages.count ?? 0,
        subjects: subjects.count ?? 0,
        reports: reports.count ?? 0,
        database: "Connected",
      });
    } catch (err: any) {
      setError(err?.message || "Unable to load platform status.");
      setStats((current) => ({
        ...current,
        database: "Connection error",
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlatform();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Platform Control</h1>
            </div>
            <p className="text-slate-400 mt-1">
              System status and platform-wide administration.
            </p>
          </div>

          <button
            onClick={loadPlatform}
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

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Stat icon={<Users />} label="Users" value={stats.users} />
          <Stat
            icon={<MessageSquare />}
            label="Conversations"
            value={stats.conversations}
          />
          <Stat
            icon={<MessageSquare />}
            label="Messages"
            value={stats.messages}
          />
          <Stat
            icon={<BookOpen />}
            label="Curriculum Subjects"
            value={stats.subjects}
          />
          <Stat
            icon={<Flag />}
            label="Reports"
            value={stats.reports}
          />
          <Stat
            icon={<Database />}
            label="Database"
            value={stats.database}
            text
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ControlCard
            icon={<Database />}
            title="Database"
            description={`Supabase database status: ${stats.database}.`}
            status={stats.database === "Connected" ? "Operational" : "Check connection"}
          />

          <ControlCard
            icon={<ShieldCheck />}
            title="Authorization"
            description="Rank-protected pages are controlled by the application's authorization layer. Sensitive changes should also be protected by database/server-side rules."
            status="Protected"
          />

          <ControlCard
            icon={<BookOpen />}
            title="Curriculum"
            description={`${stats.subjects} curriculum subjects are currently available in the database.`}
            status="Live data"
          />

          <ControlCard
            icon={<Flag />}
            title="Moderation"
            description={`${stats.reports} reports are currently stored on the platform.`}
            status="Available"
            link="/admin/reports"
          />
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Administrative Areas</h2>
          <p className="mt-2 text-slate-400">
            Use the protected areas below for platform administration.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            <AdminLink to="/superadmin/users" label="User Management" />
            <AdminLink to="/admin/reports" label="Reports" />
            <AdminLink to="/owner/security" label="Security Center" />
            <AdminLink to="/owner/analytics" label="Analytics" />
          </div>
        </section>

        <Link
          to="/superadmin"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 hover:bg-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Super Admin
        </Link>
      </div>
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
  text = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  text?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center gap-3 text-slate-400">
        {React.cloneElement(icon as React.ReactElement, {
          className: "w-5 h-5",
        })}
        <span>{label}</span>
      </div>
      <p className={`mt-3 font-bold ${text ? "text-lg" : "text-3xl"}`}>
        {value}
      </p>
    </div>
  );
}

function ControlCard({
  icon,
  title,
  description,
  status,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: string;
  link?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-slate-300">{icon}</div>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
          <CheckCircle className="w-4 h-4" />
          {status}
        </span>
      </div>

      <p className="mt-3 text-slate-400 leading-relaxed">{description}</p>

      {link && (
        <Link
          to={link}
          className="inline-block mt-4 text-blue-400 hover:text-blue-300"
        >
          Open area →
        </Link>
      )}
    </div>
  );
}

function AdminLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="rounded-xl border border-slate-700 bg-slate-950 p-4 hover:bg-slate-800 transition"
    >
      {label} →
    </Link>
  );
}
