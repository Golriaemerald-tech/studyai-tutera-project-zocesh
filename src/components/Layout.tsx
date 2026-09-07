import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  Sparkles,
  Home,
  Brain,
  Shield,
  BookOpen,
  ClipboardCheck,
  Layers,
  CalendarDays,
  BarChart3,
  Trophy,
  MessageSquare,
  User,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export const Layout: React.FC = () => {
  const { user, logout, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: Home },
    { label: 'StudyAI', path: '/study', icon: Brain },
    { label: 'Overseer AI', path: '/overseer', icon: Shield, adminOnly: true },
    { label: 'Subjects', path: '/subjects', icon: BookOpen },
    { label: 'Study & Quizzes', path: '/study-mode', icon: ClipboardCheck },
    { label: 'Flashcards', path: '/flashcards', icon: Layers },
    { label: 'Study Planner', path: '/planner', icon: CalendarDays },
    { label: 'Progress', path: '/progress', icon: BarChart3 },
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { label: 'Community', path: '/chat', icon: MessageSquare },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || isSuperAdmin
  );

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-canvas text-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-surface-border/70 bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-surface-border bg-surface-raised text-slate-200 transition hover:border-brand-400/50 hover:text-brand-300"
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>

            <Link
              to="/"
              className="flex items-center gap-2.5"
              onClick={() => setMenuOpen(false)}
            >
              <div className="grid h-9 w-9 place-items-center rounded-xl border border-brand-400/30 bg-brand-500/10 text-brand-300">
                <Sparkles size={19} />
              </div>
              <div>
                <div className="font-display text-base font-bold tracking-tight">
                  StudyAI
                </div>
                <div className="text-[9px] font-medium uppercase tracking-wider text-brand-300">
                  Nigeria Curriculum
                </div>
              </div>
            </Link>
          </div>

          {user && (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-surface-raised"
              >
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-8 w-8 rounded-full border border-brand-400/30 object-cover"
                />
                <div className="hidden text-right sm:block">
                  <p className="text-xs font-bold text-slate-200">
                    {user.nickname || user.name}
                  </p>
                  <p className="text-[10px] text-brand-300">
                    {user.studentClass || 'Student'}
                  </p>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="grid h-9 w-9 place-items-center rounded-xl border border-surface-border bg-surface-raised text-slate-400 transition hover:border-rose-500/30 hover:text-rose-300"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Navigation drawer */}
      {user && menuOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        >
          <aside
            className="h-full w-[290px] max-w-[88vw] overflow-y-auto border-r border-surface-border bg-surface px-4 py-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5"
              >
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500/10 text-brand-300">
                  <Sparkles size={18} />
                </div>
                <span className="font-display font-bold">StudyAI</span>
              </Link>

              <button
                onClick={() => setMenuOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-surface-raised hover:text-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mb-4 rounded-2xl border border-surface-border bg-surface-raised p-3">
              <div className="flex items-center gap-3">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-100">
                    {user.nickname || user.name}
                  </p>
                  <p className="text-xs text-brand-300">
                    {user.studentClass || 'Student'}
                  </p>
                </div>
              </div>
            </div>

            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Directory
            </p>

            <nav className="space-y-1">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? 'border border-brand-400/20 bg-brand-500/10 text-brand-300'
                        : 'text-slate-400 hover:bg-surface-raised hover:text-slate-100'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight
                      size={14}
                      className={active ? 'opacity-100' : 'opacity-0'}
                    />
                  </Link>
                );
              })}

              {(isAdmin || isSuperAdmin) && (
                <>
                  <div className="my-3 border-t border-surface-border" />
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isActive('/admin')
                        ? 'border border-rose-400/20 bg-rose-500/10 text-rose-300'
                        : 'text-slate-400 hover:bg-surface-raised hover:text-slate-100'
                    }`}
                  >
                    <Shield size={18} />
                    <span className="flex-1">Admin Hub</span>
                    <ChevronRight size={14} />
                  </Link>
                </>
              )}
            </nav>

            <button
              onClick={handleLogout}
              className="mt-6 flex w-full items-center gap-3 rounded-xl border border-rose-500/10 px-3 py-2.5 text-sm font-medium text-rose-300 transition hover:bg-rose-500/10"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </aside>
        </div>
      )}

      {/* Page */}
      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
