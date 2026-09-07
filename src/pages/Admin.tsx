import { useState } from 'react';
import { useAuth, SUPER_ADMIN_EMAILS } from '../context/AuthContext';
import { Shield, UserX, UserCheck, AlertTriangle, Bot } from 'lucide-react';

export const Admin = () => {
  const { isAdmin, isSuperAdmin, adminList, bannedList, toggleAdminRole, banUser, unbanUser } = useAuth();
  const [targetEmail, setTargetEmail] = useState('');
  const [banReason, setBanReason] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const [bots, setBots] = useState([
    { id: 1, name: 'Maths Tutor Bot', status: 'Active', model: 'gemini-2.5-flash' },
    { id: 2, name: 'Physics Peer Chat Bot', status: 'Active', model: 'gemini-2.5-flash' },
    { id: 3, name: 'Exam Prep Assistant Bot', status: 'Active', model: 'gemini-2.5-flash' },
  ]);

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="text-center space-y-3 bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md">
          <AlertTriangle className="text-rose-400 mx-auto" size={40} />
          <h1 className="text-xl font-bold text-slate-100">Access Denied</h1>
          <p className="text-xs text-slate-400">Admin privileges required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Shield className="text-teal-400" /> Admin & AI Bots Control Center
          </h1>
          <p className="text-xs text-slate-400">Super Admin: {SUPER_ADMIN_EMAILS}</p>
        </div>
        <div className="bg-teal-500/10 border border-teal-500/30 px-4 py-2 rounded-2xl text-xs text-teal-300 font-semibold">
          {isSuperAdmin ? 'Super Administrator' : 'Administrator'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase text-slate-400 flex items-center gap-2"><Bot size={16} className="text-teal-400" /> AI Bots Managed</h2>
          <div className="space-y-2">
            {bots.map((b) => (
              <div key={b.id} className="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 text-xs">
                <div>
                  <p className="font-bold text-slate-200">{b.name}</p>
                  <p className="text-[10px] text-teal-400">Model: {b.model}</p>
                </div>
                <span className="text-[10px] bg-teal-500/10 text-teal-300 px-2.5 py-1 rounded-full border border-teal-500/30">{b.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase text-slate-400">Ban / Restrict User</h2>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="user@example.com"
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
            />
            <input
              type="text"
              placeholder="Reason for suspension"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
            />
            <button
              onClick={() => {
                if (targetEmail) {
                  banUser(targetEmail, banReason || 'Violation of terms');
                  setTargetEmail('');
                  setBanReason('');
                }
              }}
              className="w-full bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
            >
              <UserX size={16} /> Ban User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Admin;
