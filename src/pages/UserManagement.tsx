import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  RefreshCw,
  ArrowLeft,
  Shield,
  GraduationCap,
  UserCog,
  Ban,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";

type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  nickname: string | null;
  role: string | null;
  class_level: string | null;
  xp: number | null;
  streak_days: number | null;
  created_at: string;
};

type BanRecord = {
  user_id: string;
};

export default function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [bannedIds, setBannedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const [profilesResult, bansResult] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "id,email,display_name,nickname,role,class_level,xp,streak_days,created_at"
          )
          .order("created_at", { ascending: false })
          .limit(200),

        supabase.from("bans").select("user_id"),
      ]);

      if (profilesResult.error) throw profilesResult.error;
      if (bansResult.error) throw bansResult.error;

      setUsers(profilesResult.data ?? []);

      const ids = new Set(
        (bansResult.data as BanRecord[] | null)?.map((ban) => ban.user_id) ?? []
      );

      setBannedIds(ids);
    } catch (err: any) {
      setError(err?.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !term ||
        (user.email ?? "").toLowerCase().includes(term) ||
        (user.display_name ?? "").toLowerCase().includes(term) ||
        (user.nickname ?? "").toLowerCase().includes(term) ||
        user.id.toLowerCase().includes(term);

      const matchesRole =
        roleFilter === "all" || (user.role ?? "user") === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8" />
              <h1 className="text-3xl font-bold">User Management</h1>
            </div>
            <p className="text-slate-400 mt-1">
              Search and inspect registered Zocesh Study AI accounts.
            </p>
          </div>

          <button
            onClick={loadUsers}
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

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or user ID..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 outline-none focus:border-slate-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
            >
              <option value="all">All ranks</option>
              <option value="user">User</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <div className="mt-3 text-sm text-slate-500">
            Showing {filteredUsers.length} of {users.length} loaded accounts
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-slate-400">
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              No users match your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-slate-950">
                  <tr className="text-left text-sm text-slate-400">
                    <th className="p-4">User</th>
                    <th className="p-4">Rank</th>
                    <th className="p-4">Class</th>
                    <th className="p-4">XP</th>
                    <th className="p-4">Streak</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Joined</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => {
                    const banned = bannedIds.has(user.id);
                    const rank = user.role || "user";

                    return (
                      <tr
                        key={user.id}
                        className="border-t border-slate-800 hover:bg-slate-800/40"
                      >
                        <td className="p-4">
                          <div className="font-medium">
                            {user.display_name ||
                              user.nickname ||
                              "Unnamed user"}
                          </div>
                          <div className="text-sm text-slate-500">
                            {user.email || "No email"}
                          </div>
                          <div className="text-xs text-slate-600 mt-1">
                            {user.id}
                          </div>
                        </td>

                        <td className="p-4">
                          <RankBadge role={rank} />
                        </td>

                        <td className="p-4 text-slate-300">
                          {user.class_level || "—"}
                        </td>

                        <td className="p-4 text-slate-300">
                          {user.xp ?? 0}
                        </td>

                        <td className="p-4 text-slate-300">
                          {user.streak_days ?? 0} days
                        </td>

                        <td className="p-4">
                          {banned ? (
                            <span className="inline-flex items-center gap-1.5 text-red-400">
                              <Ban className="w-4 h-4" />
                              Banned
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-emerald-400">
                              <CheckCircle className="w-4 h-4" />
                              Active
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-sm text-slate-400">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-amber-400" />
            <h2 className="font-semibold">Protected administration</h2>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            This page currently provides live account inspection. Rank changes,
            bans and unbans should be performed through protected backend
            operations with proper authorization and audit logging.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/superadmin"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Super Admin
          </Link>

          <Link
            to="/admin/reports"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 hover:bg-slate-700"
          >
            <Ban className="w-4 h-4" />
            Reports
          </Link>
        </div>
      </div>
    </main>
  );
}

function RankBadge({ role }: { role: string }) {
  const normalized = role.toLowerCase();

  const icon =
    normalized === "owner" || normalized === "superadmin" ? (
      <Shield className="w-3.5 h-3.5" />
    ) : normalized === "admin" || normalized === "teacher" ? (
      <UserCog className="w-3.5 h-3.5" />
    ) : (
      <GraduationCap className="w-3.5 h-3.5" />
    );

  const label =
    normalized === "superadmin"
      ? "Super Admin"
      : normalized.charAt(0).toUpperCase() + normalized.slice(1);

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs">
      {icon}
      {label}
    </span>
  );
}
