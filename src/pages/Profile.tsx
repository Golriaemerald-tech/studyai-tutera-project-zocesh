import { useAuth } from '../context/AuthContext';
import { User, Mail, GraduationCap, Calendar, Shield } from 'lucide-react';

export const Profile = () => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <img src={user.picture} alt="avatar" className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 p-1" />
          <div>
            <h1 className="text-xl font-bold text-slate-100">{user.nickname || user.name}</h1>
            <p className="text-xs text-teal-400 font-medium">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center gap-1"><GraduationCap size={14} className="text-teal-400" /> Class</span>
            <p className="text-sm font-bold text-slate-200">{user.studentClass}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center gap-1"><Shield size={14} className="text-teal-400" /> Department</span>
            <p className="text-sm font-bold text-slate-200">{user.department || 'Science'}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center gap-1"><Calendar size={14} className="text-teal-400" /> Age</span>
            <p className="text-sm font-bold text-slate-200">{user.age || 17}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center gap-1"><User size={14} className="text-teal-400" /> Role</span>
            <p className="text-sm font-bold text-slate-200">{isSuperAdmin ? 'Super Administrator (embelmpklet@gmail.com)' : isAdmin ? 'Administrator' : 'Student'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
