import { useState } from 'react';
import { useAuth, SUPER_ADMIN_EMAIL } from '../context/AuthContext';
import { ShieldCheck, UserPlus, UserMinus, Sparkles, ShieldAlert, UserX } from 'lucide-react';

export const AdminPanel = () => {
  const { isAdmin, isSuperAdmin, adminList, bannedList, toggleAdminRole, banUser, unbanUser } = useAuth();
  const [targetEmail, setTargetEmail] = useState('');
  const [banEmail, setBanEmail] = useState('');
  const [banReason, setBanReason] = useState('');

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert size={56} className="text-red-400 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Access Restricted</h1>
        <p className="text-slate-400 max-w-md">
          This panel is restricted exclusively to administrators ({SUPER_ADMIN_EMAIL}).
        </p>
      </div>
    );
  }

  const handleGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail.trim()) return;
    toggleAdminRole(targetEmail.trim());
    setTargetEmail('');
  };

  const handleBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banEmail.trim()) return;
    banUser(banEmail.trim(), banReason || 'Admin Action');
    setBanEmail('');
    setBanReason('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-amber-400" size={26} /> Admin Command Center
          </h1>
          <p className="text-sm text-slate-400">
            {isSuperAdmin ? `Root Super Admin Access (${SUPER_ADMIN_EMAIL})` : 'App Administrator Panel'}
          </p>
        </div>
      </div>

      {isSuperAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" /> Admin Privilege Control
            </h2>
            <form onSubmit={handleGrant} className="space-y-3">
              <input
                type="email"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                placeholder="User email address..."
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <UserPlus size={16} /> Toggle Admin Role
              </button>
            </form>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <UserX size={18} className="text-red-400" /> User Moderation Ban
            </h2>
            <form onSubmit={handleBan} className="space-y-3">
              <input
                type="email"
                value={banEmail}
                onChange={(e) => setBanEmail(e.target.value)}
                placeholder="Target email..."
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
              />
              <input
                type="text"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Ban reason..."
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-red-500 hover:bg-red-400 text-slate-950 font-bold rounded-xl text-xs transition-all"
              >
                Ban User
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Current Admin Roster</h2>
          <div className="space-y-2">
            {adminList.map((email) => {
              const isRoot = email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
              return (
                <div key={email} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-200 font-mono">{email}</span>
                  {isSuperAdmin && !isRoot && (
                    <button
                      onClick={() => toggleAdminRole(email)}
                      className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <UserMinus size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Banned Accounts</h2>
          <div className="space-y-2">
            {bannedList.map((item) => (
              <div key={item.email} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <p className="text-xs font-mono text-slate-200">{item.email}</p>
                  <p className="text-[10px] text-red-400">{item.reason}</p>
                </div>
                {isSuperAdmin && (
                  <button
                    onClick={() => unbanUser(item.email)}
                    className="text-xs text-teal-400 hover:underline"
                  >
                    Unban
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
