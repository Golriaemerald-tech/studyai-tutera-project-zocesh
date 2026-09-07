import { useState, useEffect } from 'react';
import { callGeminiAPI } from '../utils/gemini';
import { renderMarkdown } from '../lib/markdown';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, UserX, RefreshCw } from 'lucide-react';

export const OverseerAI = () => {
  const { isSuperAdmin, banUser, getBannedUsers, bannedList } = useAuth();
  const [scanResult, setScanResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [targetEmail, setTargetEmail] = useState<string>('');
  const [banReason, setBanReason] = useState<string>('');
  const [banStatus, setBanStatus] = useState<string>('');

  useEffect(() => {
    if (getBannedUsers) {
      getBannedUsers();
    }
  }, []);

  const handleRunScan = async () => {
    setLoading(true);
    setScanResult('Analyzing chat records and system activity...');
    const result = await callGeminiAPI(
      "Perform a quick security and behavior check on active chat logs. Flag any policy violations or abusive behavior.",
      "You are Sentinel AI, an overseer bot for Zocesh Zocesh Study AI platform moderation."
    );
    setScanResult(result);
    setLoading(false);
  };

  const handleBan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail.trim()) return;

    try {
      setBanStatus('Processing ban action...');
      await banUser(targetEmail.trim().toLowerCase(), banReason.trim() || 'Violated community guidelines');
      setBanStatus(`Successfully banned ${targetEmail}`);
      setTargetEmail('');
      setBanReason('');
      if (getBannedUsers) getBannedUsers();
    } catch (err: any) {
      setBanStatus(`Error: ${err.message || 'Failed to ban user'}`);
    }
  };

  if (!isSuperAdmin) {
    return <div className="p-8 text-center text-red-400 font-bold">Access Denied: Super Admin permissions required.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <ShieldAlert className="text-purple-400" size={32} />
        <h1 className="text-2xl font-bold text-slate-100">Overseer AI & Platform Moderation</h1>
      </div>

      {/* Sentinel AI Scan */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-200">Deep AI Chat Inspection</h2>
          <button
            onClick={handleRunScan}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <RefreshCw className="animate-spin" size={16} />}
            Run Sentinel AI Scan
          </button>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm text-slate-300 min-h-[80px] [&_p]:m-0 [&_ul]:my-1 [&_ul]:pl-4 [&_li]:list-disc">
          {scanResult ? (
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(scanResult) }} />
          ) : (
            "Click scan to run Sentinel AI oversight on user interactions."
          )}
        </div>
      </div>

      {/* Ban Action Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <UserX className="text-red-400" size={20} /> Execute Ban Action
        </h2>
        <form onSubmit={handleBan} className="space-y-3">
          <input
            type="email"
            placeholder="Target User or Admin Email..."
            value={targetEmail}
            onChange={(e) => setTargetEmail(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-red-500"
            required
          />
          <input
            type="text"
            placeholder="Reason for ban..."
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-red-500"
          />
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            Confirm Ban
          </button>
        </form>
        {banStatus && <p className="text-xs font-mono text-amber-400 mt-2">{banStatus}</p>}
      </div>

      {/* Active Banned Roster */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-lg font-semibold text-slate-200">Active Banned Roster</h2>
        {bannedList && bannedList.length > 0 ? (
          <ul className="divide-y divide-slate-800">
            {bannedList.map((item: any, idx: number) => (
              <li key={idx} className="py-2 flex justify-between items-center text-sm">
                <div>
                  <p className="font-semibold text-slate-200">{item.email || item}</p>
                  {item.reason && <p className="text-xs text-slate-400">Reason: {item.reason}</p>}
                </div>
                <span className="text-xs bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full border border-red-500/20">
                  Banned
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No accounts are currently banned.</p>
        )}
      </div>
    </div>
  );
};
