import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Settings,
  ArrowLeft,
  RefreshCw,
  Shield,
  Users,
  Database,
  BookOpen,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function OwnerSettings() {
  const [stats, setStats] = useState({
    users: 0,
    staff: 0,
    curriculum: 0,
    database: "Checking...",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSettings = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        users,
        staff,
        curriculum,
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .in("role", ["admin", "super_admin", "owner"]),
        supabase
          .from("curriculum_subjects")
          .select("*", { count: "exact", head: true }),
      ]);

      const firstError = users.error || staff.error || curriculum.error;
      if (firstError) throw firstError;

      setStats({
        users: users.count ?? 0,
        staff: staff.count ?? 0,
        curriculum: curriculum.count ?? 0,
        database: "Connected",
      });
    } catch (err: any) {
      setError(err?.message || "Unable to load platform settings.");
      setStats((s) => ({ ...s, database: "Connection error" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Settings className="w-7 h-7" />
              <h1 className="text-3xl font-bold">Owner Settings</h1>
            </div>
            <p className="text-slate-400 mt-1">
              Platform configuration and owner-level controls.
            </p>
          </div>

          <button
            onClick={loadSettings}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat
            icon={<Users />}
            label="Total Users"
            value={stats.users}
          />
          <Stat
            icon={<Shield />}
            label="Staff Accounts"
            value={stats.staff}
          />
          <Stat
            icon={<BookOpen />}
            label="Curriculum Subjects"
            value={stats.curriculum}
          />
          <Stat
            icon={<Database />}
            label="Database"
            value={stats.database}
            text
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Panel
            icon={<Shield />}
            title="Owner Protection"
            text="This area is restricted to the Owner rank. Authorization should always be enforced by trusted server-side/database controls."
          />

          <Panel
            icon={<Users />}
            title="Rank Management"
            text="Manage staff and rank-related controls through the protected administration areas."
            link="/superadmin/users"
            linkText="Open User Management"
          />

          <Panel
            icon={<Database />}
            title="Platform Control"
            text="Review platform-wide controls, moderation configuration and system status."
            link="/superadmin/platform"
            linkText="Open Platform Control"
          />

          <Panel
            icon={<CheckCircle />}
            title="System Status"
            text={`Zocesh Study AI database: ${stats.database}. Use Refresh to check the latest state.`}
          />
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/owner"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Owner Dashboard
          </Link>

          <Link
            to="/owner/security"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
          >
            Security Center
          </Link>

          <Link
            to="/owner/analytics"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
          >
            Analytics
          </Link>
        </div>
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
      <div className={`mt-3 font-bold ${text ? "text-lg" : "text-3xl"}`}>
        {value}
      </div>
    </div>
  );
}

function Panel({
  icon,
  title,
  text,
  link,
  linkText,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  link?: string;
  linkText?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center gap-3">
        <div className="text-slate-300">{icon}</div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <p className="text-slate-400 mt-3 leading-relaxed">{text}</p>

      {link && (
        <Link
          to={link}
          className="inline-block mt-4 text-blue-400 hover:text-blue-300"
        >
          {linkText} →
        </Link>
      )}
    </div>
  );
}
