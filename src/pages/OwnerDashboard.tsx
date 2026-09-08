import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Crown, Shield, BarChart3, Settings, Users, GraduationCap,
  UserCog, FileWarning, Ban, Activity, RefreshCw, ArrowRight
} from "lucide-react";
import { supabase } from "../lib/supabase";

type Stats = {
  users: number;
  students: number;
  teachers: number;
  admins: number;
  reports: number;
  bans: number;
  activity: number;
};

export default function OwnerDashboard() {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    students: 0,
    teachers: 0,
    admins: 0,
    reports: 0,
    bans: 0,
    activity: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [
        users,
        students,
        teachers,
        admins,
        reports,
        bans,
        activity,
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .not("class_level", "is", null),
        Promise.resolve({ count: 0, error: null }),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .in("role", ["admin", "super_admin", "owner"]),
        supabase.from("reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("bans").select("*", { count: "exact", head: true }),
        supabase.from("learning_progress").select("*", { count: "exact", head: true }),
      ]);

      const firstError = [
        users.error,
        students.error,
        teachers.error,
        admins.error,
        reports.error,
        bans.error,
        activity.error,
      ].find(Boolean);

      if (firstError) throw firstError;

      setStats({
        users: users.count ?? 0,
        students: students.count ?? 0,
        teachers: teachers.count ?? 0,
        admins: admins.count ?? 0,
        reports: reports.count ?? 0,
        bans: bans.count ?? 0,
        activity: activity.count ?? 0,
      });
    } catch (err: any) {
      setError(err?.message || "Unable to load Owner statistics.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const cards = [
    { label: "Total Users", value: stats.users, icon: Users },
    { label: "Students", value: stats.students, icon: GraduationCap },
    { label: "Teachers", value: stats.teachers, icon: UserCog },
    { label: "Staff", value: stats.admins, icon: Shield },
    { label: "Pending Reports", value: stats.reports, icon: FileWarning },
    { label: "Banned Accounts", value: stats.bans, icon: Ban },
    { label: "Learning Activity", value: stats.activity, icon: Activity },
  ];

  return (
    <main className="mx-auto max-w-7xl p-5 sm:p-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Crown size={30} />
            <h1 className="text-3xl font-bold">Owner Control Center</h1>
          </div>
          <p className="mt-2 text-white/50">
            Full operational overview of Zocesh Study AI.
          </p>
        </div>

        <button
          onClick={loadDashboard}
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

      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">{label}</span>
              <Icon size={20} className="text-white/60" />
            </div>

            <div className="mt-3 text-3xl font-bold">
              {loading ? "—" : value.toLocaleString()}
            </div>
          </div>
        ))}
      </section>

      <h2 className="mb-4 text-xl font-bold">Owner Operations</h2>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/superadmin/users"
          className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"
        >
          <Users size={25} />
          <h3 className="mt-4 font-semibold">User Management</h3>
          <p className="mt-2 text-sm text-white/50">
            Inspect accounts and manage platform ranks.
          </p>
          <div className="mt-5 flex items-center gap-2 text-sm">
            Open <ArrowRight size={15} className="transition group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          to="/superadmin/platform"
          className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"
        >
          <Activity size={25} />
          <h3 className="mt-4 font-semibold">Platform Control</h3>
          <p className="mt-2 text-sm text-white/50">
            Control platform-level features and operations.
          </p>
          <div className="mt-5 flex items-center gap-2 text-sm">
            Open <ArrowRight size={15} className="transition group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          to="/owner/security"
          className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"
        >
          <Shield size={25} />
          <h3 className="mt-4 font-semibold">Security Center</h3>
          <p className="mt-2 text-sm text-white/50">
            Review security controls and access.
          </p>
          <div className="mt-5 flex items-center gap-2 text-sm">
            Open <ArrowRight size={15} className="transition group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          to="/owner/analytics"
          className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"
        >
          <BarChart3 size={25} />
          <h3 className="mt-4 font-semibold">Analytics</h3>
          <p className="mt-2 text-sm text-white/50">
            View platform usage and learning activity.
          </p>
          <div className="mt-5 flex items-center gap-2 text-sm">
            Open <ArrowRight size={15} className="transition group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          to="/admin/reports"
          className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"
        >
          <FileWarning size={25} />
          <h3 className="mt-4 font-semibold">Reports</h3>
          <p className="mt-2 text-sm text-white/50">
            Review reported users and platform content.
          </p>
          <div className="mt-5 flex items-center gap-2 text-sm">
            Open <ArrowRight size={15} className="transition group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          to="/owner/settings"
          className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"
        >
          <Settings size={25} />
          <h3 className="mt-4 font-semibold">Owner Settings</h3>
          <p className="mt-2 text-sm text-white/50">
            Configure Owner-level platform settings.
          </p>
          <div className="mt-5 flex items-center gap-2 text-sm">
            Open <ArrowRight size={15} className="transition group-hover:translate-x-1" />
          </div>
        </Link>
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-semibold">Owner Status</h2>
        <p className="mt-2 text-sm text-white/50">
          Signed-in account is operating with Owner privileges. Owner controls
          are separated from ordinary student and staff navigation.
        </p>
      </section>
    </main>
  );
}
