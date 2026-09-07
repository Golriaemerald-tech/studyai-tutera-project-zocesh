import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogOut } from 'lucide-react';

export const BannedScreen = () => {
  const { user, banRecord, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-red-950/20 border border-red-500/30 rounded-2xl p-8 text-center space-y-6 shadow-2xl backdrop-blur">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto text-red-400">
          <ShieldAlert size={36} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-red-400">Account Banned</h1>
          <p className="text-sm text-slate-400 mt-1">Access to Zocesh StudyAI has been restricted.</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-left space-y-2">
          <p className="text-xs text-slate-500 uppercase font-semibold">User Account</p>
          <p className="text-sm text-slate-200 font-mono">{user?.email}</p>
          <div className="border-t border-slate-800 pt-2">
            <p className="text-xs text-slate-500 uppercase font-semibold">Reason for Ban</p>
            <p className="text-sm text-red-300 font-medium mt-0.5">{banRecord?.reason || 'Violation of terms.'}</p>
          </div>
          <div className="border-t border-slate-800 pt-2 flex justify-between text-[11px] text-slate-500">
            <span>Date: {banRecord?.bannedAt}</span>
            <span>By: {banRecord?.bannedBy}</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
};
