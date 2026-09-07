import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, BookOpen, MessageSquare, User, Shield, LogOut, Award } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-teal-500/10 border border-teal-500/30 rounded-xl flex items-center justify-center text-teal-400">
            <Sparkles size={20} />
          </div>
          <span className="font-bold text-slate-100 tracking-tight text-base">Zocesh StudyAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              isActive('/') ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/study-mode"
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isActive('/study-mode') ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <BookOpen size={14} /> Study & Quizzes
          </Link>
          <Link
            to="/dms"
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isActive('/dms') ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <MessageSquare size={14} /> DMs & Rooms
          </Link>
          <Link
            to="/leaderboard"
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isActive('/leaderboard') ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Award size={14} /> Leaderboard
          </Link>
          <Link
            to="/profile"
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isActive('/profile') ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <User size={14} /> Profile
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive('/admin') ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <Shield size={14} /> Admin Hub
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-200">{user.nickname || user.name}</span>
            <span className="text-[10px] text-teal-400 font-medium">{user.studentClass}</span>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="bg-slate-800 hover:bg-rose-500/20 border border-slate-700 text-slate-300 hover:text-rose-300 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
