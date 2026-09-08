import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Flag,
  RefreshCw,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  MessageSquare,
} from "lucide-react";
import { supabase } from "../lib/supabase";

type Report = {
  id: string;
  reporter_id: string | null;
  target_user_id: string | null;
  target_message_id: string | null;
  reason: string | null;
  status: string | null;
  created_at: string;
  resolved_at: string | null;
};

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: queryError } = await supabase
        .from("reports")
        .select(
          "id,reporter_id,target_user_id,target_message_id,reason,status,created_at,resolved_at"
        )
        .order("created_at", { ascending: false })
        .limit(200);

      if (queryError) throw queryError;

      setReports(data ?? []);
    } catch (err: any) {
      setError(err?.message || "Unable to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const filteredReports = useMemo(() => {
    if (statusFilter === "all") return reports;

    return reports.filter(
      (report) => (report.status || "pending").toLowerCase() === statusFilter
    );
  }, [reports, statusFilter]);

  const pendingCount = reports.filter(
    (report) => (report.status || "pending").toLowerCase() === "pending"
  ).length;

  const resolvedCount = reports.filter(
    (report) => (report.status || "").toLowerCase() === "resolved"
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Flag className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Admin Reports</h1>
            </div>
            <p className="text-slate-400 mt-1">
              Review reports submitted by users.
            </p>
          </div>

          <button
            onClick={loadReports}
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

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Summary
            icon={<Flag />}
            label="Total Reports"
            value={reports.length}
          />
          <Summary
            icon={<Clock />}
            label="Pending"
            value={pendingCount}
          />
          <Summary
            icon={<CheckCircle />}
            label="Resolved"
            value={resolvedCount}
          />
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex flex-wrap gap-2">
            {["all", "pending", "resolved"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-xl px-4 py-2 text-sm transition ${
                  statusFilter === status
                    ? "bg-slate-700 text-white"
                    : "bg-slate-950 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {status === "all"
                  ? "All"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
              Loading reports...
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
              No reports found.
            </div>
          ) : (
            filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))
          )}
        </section>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <h2 className="font-semibold">Moderation protection</h2>
          </div>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Reports are displayed from the database. Resolving reports or
            taking action against accounts should be performed through
            protected backend operations with authorization and audit logging.
          </p>
        </div>

        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 hover:bg-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Dashboard
        </Link>
      </div>
    </main>
  );
}

function Summary({
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

function ReportCard({ report }: { report: Report }) {
  const status = (report.status || "pending").toLowerCase();
  const isResolved = status === "resolved";

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-slate-300" />
            <h2 className="font-semibold">
              {report.reason || "No reason provided"}
            </h2>
          </div>

          <p className="mt-2 text-xs text-slate-600 break-all">
            Report ID: {report.id}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${
            isResolved
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-amber-500/10 text-amber-400"
          }`}
        >
          {isResolved ? (
            <CheckCircle className="w-3.5 h-3.5" />
          ) : (
            <Clock className="w-3.5 h-3.5" />
          )}
          {isResolved ? "Resolved" : "Pending"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
        <Info
          icon={<User />}
          label="Reporter"
          value={report.reporter_id || "Unknown"}
        />
        <Info
          icon={<User />}
          label="Target User"
          value={report.target_user_id || "None"}
        />
        <Info
          icon={<MessageSquare />}
          label="Target Message"
          value={report.target_message_id || "None"}
        />
      </div>

      <div className="mt-4 text-sm text-slate-500">
        Submitted {new Date(report.created_at).toLocaleString()}
        {report.resolved_at &&
          ` • Resolved ${new Date(report.resolved_at).toLocaleString()}`}
      </div>
    </article>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-950 p-3">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        {React.cloneElement(icon as React.ReactElement, {
          className: "w-4 h-4",
        })}
        {label}
      </div>
      <div className="mt-2 text-xs text-slate-400 break-all">{value}</div>
    </div>
  );
}
