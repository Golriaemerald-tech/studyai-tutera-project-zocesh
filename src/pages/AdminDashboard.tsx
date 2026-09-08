import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Users,
  Flag,
  Ban,
  Activity,
  MessageSquare,
  RefreshCw,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    pendingReports: 0,
    totalReports: 0,
    bans: 0,
    activity: 0,
    messages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        users,
        pendingReports,
        totalReports,
        bans,
        activity,
        messages,
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),

        supabase
          .from("reports")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),

        supabase
          .from("reports")
          .select("*", { count: "exact", head: true }),

        supabase.from("bans").select("*", { count: "exact", head: true }),

        supabase
          .from("learning_progress")
          .select("*", { count: "exact", head: true }),

        supabase.from("messages").select("*", { count: "exact", head: true }),
      ]);

      const firstError =
        users.error ||
        pendingReports.error ||
        totalReports.error ||
        bans.error ||
        activity.error ||
        messages.error;

      if (firstError) throw firstError;

      setStats({
        users: users.count ?? 0,
        pendingReports: pendingReports.count ?? 0,
        totalReports: totalReports.count ?? 0,
        bans: bans.count ?? 0,
        activity: activity.count ?? 0,
        messages: messages.count ?? 0,
      });
    } catch (err: any) {
      setError(err?.message || "Unable to load admin statistics.");
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
              <Shield className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-slate-400 mt-1">
              Moderation, reports and platform activity.
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
          <Stat icon={<Users />} label="Users" value={stats.users} />
          <Stat
            icon={<Flag />}
            label="Pending Reports"
            value={stats.pendingReports}
          />
          <Stat
            icon={<Flag />}
            label="Total Reports"
            value={stats.totalReports}
          />
          <Stat icon={<Ban />} label="Banned Accounts" value={stats.bans} />
          <Stat
            icon={<Activity />}
            label="Learning Activity"
            value={stats.activity}
          />
          <Stat
            icon={<MessageSquare />}
            label="Messages"
            value={stats.messages}
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ActionCard
            icon={<Flag />}
            title="Reports"
            description="Review reported accounts and messages and keep track of unresolved moderation cases."
            to="/admin/reports"
            label="Open Reports"
            alert={stats.pendingReports > 0}
          />

          <ActionCard
            icon={<Users />}
            title="User Overview"
            description="View the registered-user count and inspect accounts through the protected user-management area."
            to="/superadmin/users"
            label="Open Users"
          />

          <ActionCard
            icon={<Ban />}
            title="Account Security"
            description="Review current bans and administrative security activity."
            to="/owner/security"
            label="Open Security"
          />

          <ActionCard
            icon={<Activity />}
            title="Platform Activity"
            description="Monitor learning activity and platform usage through the analytics area."
            to="/owner/analytics"
            label="Open Analytics"
          />
        </section>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Moderation guidance</h2>
          <p className="mt-2 text-slate-400 leading-relaxed">
            Review reports carefully before taking action. Account bans,
            unbans and rank changes should use protected backend operations and
            should be recorded in the audit log.
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
  label,
  alert = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
  label: string;
  alert?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-slate-300">{icon}</div>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        {alert && (
          <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
            Needs attention
          </span>
        )}
      </div>

      <p className="mt-3 text-slate-400 leading-relaxed">{description}</p>

      <Link
        to={to}
        className="inline-block mt-5 rounded-xl bg-slate-800 px-4 py-2 hover:bg-slate-700"
      >
        {label} →
      </Link>
    </div>
  );
}
