import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, MessageSquare, BookOpen, Award, Shield, User as UserIcon, LogOut } from 'lucide-react';

export const Layout: React.FC = () => {
  const { user, logout, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Study AI', path: '/study', icon: BookOpen },
    { label: 'Community', path: '/chat', icon: MessageSquare },
    { label: 'Leaderboard', path: '/leaderboard', icon: Award },
    { label: 'Profile', path: '/profile', icon: UserIcon },
  ];

  if (isAdmin || isSuperAdmin) {
    navItems.push({ label: 'Admin', path: '/admin', icon: Shield });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-lg font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            StudyAI
          </Link>
          <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full font-medium">
            Nigeria Curriculum
          </span>
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-teal-500/40 object-cover" />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-200">{user.name}</p>
                <p className="text-[10px] text-teal-400 font-medium">{user.studentClass || 'SS 3'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 rounded-xl transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-xs font-semibold px-3 py-1.5 text-slate-300 hover:text-white">Sign In</Link>
            <Link to="/register" className="text-xs font-semibold px-3 py-1.5 bg-teal-500 text-slate-950 rounded-xl">Register</Link>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-6">
        <Outlet />
      </main>

      {/* Bottom Navigation Bar for Mobile */}
      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2 z-50 flex justify-around items-center shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  isActive ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
};
export default Layout;
