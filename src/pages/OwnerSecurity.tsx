import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  ArrowLeft,
  RefreshCw,
  Ban,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { supabase } from "../lib/supabase";

type AuditLog = {
  id: string;
  actor_id: string | null;
  action: string;
  target_user_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

type Ban = {
  user_id: string;
  email: string | null;
  reason: string | null;
  banned_at: string;
  banned_by: string | null;
};

export default function OwnerSecurity() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [bans, setBans] = useState<Ban[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSecurity() {
    setLoading(true);
    setError("");

    try {
      const [auditResult, bansResult] = await Promise.all([
        supabase
          .from("audit_logs")
          .select("id, actor_id, action, target_user_id, metadata, created_at")
          .order("created_at", { ascending: false })
          .limit(20),

        supabase
          .from("bans")
          .select("user_id, email, reason, banned_at, banned_by")
          .order("banned_at", { ascending: false })
          .limit(20),
      ]);

      if (auditResult.error) throw auditResult.error;
      if (bansResult.error) throw bansResult.error;

      setLogs(auditResult.data ?? []);
      setBans(bansResult.data ?? []);
    } catch (err: any) {
      setError(err?.message || "Unable to load security information.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSecurity();
  }, []);

  function formatDate(value: string) {
    return new Date(value).toLocaleString();
  }

  return (
    <main className="mx-auto max-w-7xl p-5 sm:p-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Shield size={30} />
            <h1 className="text-3xl font-bold">Owner Security Center</h1>
          </div>

          <p className="mt-2 text-white/50">
            Monitor administrative activity, bans and security events.
          </p>
        </div>

        <button
          onClick={loadSecurity}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      {error && (
        <div className="mb-6 flex gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <FileText size={21} />
          <p className="mt-3 text-sm text-white/50">Audit Events</p>
          <p className="mt-1 text-3xl font-bold">
            {loading ? "—" : logs.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <Ban size={21} />
          <p className="mt-3 text-sm text-white/50">Recent Bans</p>
          <p className="mt-1 text-3xl font-bold">
            {loading ? "—" : bans.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <CheckCircle size={21} />
          <p className="mt-3 text-sm text-white/50">Owner Protection</p>
          <p className="mt-1 text-lg font-semibold">Active</p>
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-5 flex items-center gap-3">
          <FileText size={21} />
          <h2 className="text-xl font-bold">Recent Audit Activity</h2>
        </div>

        {loading ? (
          <p className="text-sm text-white/50">Loading audit activity...</p>
        ) : logs.length === 0 ? (
          <div className="rounded-xl border border-white/10 p-5 text-sm text-white/50">
            No audit events have been recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-xl border border-white/10 bg-black/10 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{log.action}</p>
                    <p className="mt-1 text-xs text-white/40">
                      Actor: {log.actor_id || "System"}
                      {log.target_user_id
                        ? ` • Target: ${log.target_user_id}`
                        : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Clock size={14} />
                    {formatDate(log.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-5 flex items-center gap-3">
          <Ban size={21} />
          <h2 className="text-xl font-bold">Recent Bans</h2>
        </div>

        {loading ? (
          <p className="text-sm text-white/50">Loading bans...</p>
        ) : bans.length === 0 ? (
          <div className="rounded-xl border border-white/10 p-5 text-sm text-white/50">
            No banned accounts found.
          </div>
        ) : (
          <div className="space-y-3">
            {bans.map((ban) => (
              <div
                key={`${ban.user_id}-${ban.banned_at}`}
                className="rounded-xl border border-white/10 bg-black/10 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold">
                      {ban.email || "Unknown account"}
                    </p>
                    <p className="mt-1 text-sm text-white/50">
                      {ban.reason || "No reason recorded"}
                    </p>
                    <p className="mt-2 text-xs text-white/30">
                      User ID: {ban.user_id}
                    </p>
                  </div>

                  <span className="text-xs text-white/40">
                    {formatDate(ban.banned_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
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
