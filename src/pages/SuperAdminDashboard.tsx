import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  UserCog,
  Flag,
  Ban,
  Activity,
  RefreshCw,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    staff: 0,
    admins: 0,
    pendingReports: 0,
    bans: 0,
    learningActivity: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        users,
        staff,
        admins,
        reports,
        bans,
        activity,
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),

        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .in("role", ["teacher", "admin", "superadmin", "owner"]),

        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .in("role", ["admin", "superadmin", "owner"]),

        supabase
          .from("reports")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),

        supabase.from("bans").select("*", { count: "exact", head: true }),

        supabase
          .from("learning_progress")
          .select("*", { count: "exact", head: true }),
      ]);

      const firstError =
        users.error ||
        staff.error ||
        admins.error ||
        reports.error ||
        bans.error ||
        activity.error;

      if (firstError) throw firstError;

      setStats({
        users: users.count ?? 0,
        staff: staff.count ?? 0,
        admins: admins.count ?? 0,
        pendingReports: reports.count ?? 0,
        bans: bans.count ?? 0,
        learningActivity: activity.count ?? 0,
      });
    } catch (err: any) {
      setError(err?.message || "Unable to load Super Admin statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
            </div>
            <p className="text-slate-400 mt-1">
              Platform administration, staff management and moderation overview.
            </p>
          </div>

          <button
            onClick={loadStats}
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
          <Stat icon={<Users />} label="Total Users" value={stats.users} />
          <Stat icon={<UserCog />} label="Staff" value={stats.staff} />
          <Stat icon={<ShieldCheck />} label="Admins & Owners" value={stats.admins} />
          <Stat icon={<Flag />} label="Pending Reports" value={stats.pendingReports} />
          <Stat icon={<Ban />} label="Banned Accounts" value={stats.bans} />
          <Stat
            icon={<Activity />}
            label="Learning Activity"
            value={stats.learningActivity}
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ActionCard
            icon={<Users />}
            title="User Management"
            description="View platform users, inspect accounts and manage administrative user controls."
            to="/superadmin/users"
            button="Open User Management"
          />

          <ActionCard
            icon={<ShieldCheck />}
            title="Platform Control"
            description="Review platform controls, moderation settings and system-level administration."
            to="/superadmin/platform"
            button="Open Platform Control"
          />

          <ActionCard
            icon={<Flag />}
            title="Moderation"
            description="Review reports and keep track of outstanding moderation work."
            to="/admin/reports"
            button="Open Reports"
          />

          <ActionCard
            icon={<Ban />}
            title="Security"
            description="Review bans and administrative security activity."
            to="/owner/security"
            button="Open Security Center"
          />
        </section>

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
  value: number;
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

function ActionCard({
  icon,
  title,
  description,
  to,
  button,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
  button: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center gap-3">
        <div className="text-slate-300">{icon}</div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <p className="mt-3 text-slate-400 leading-relaxed">{description}</p>

      <Link
        to={to}
        className="inline-flex mt-5 rounded-xl bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
      >
        {button} →
      </Link>
    </div>
  );
}
