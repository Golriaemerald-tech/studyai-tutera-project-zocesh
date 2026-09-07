import { useState, useEffect, useRef, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, GoogleCredentialResponse } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, UserPlus, Globe } from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '706971985194-qm8sivf0qquafuqf0pc9spgcdj65lv1k.apps.googleusercontent.com';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [studentClass, setStudentClass] = useState('SS 3');
  const [department, setDepartment] = useState('Science');
  const [error, setError] = useState('');
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const init = () => {
      if (!window.google?.accounts?.id) return false;
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: GoogleCredentialResponse) => {
            googleLogin(response);
            navigate('/');
          },
        });
        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'filled_black',
            size: 'large',
            width: '100%',
            text: 'signup_with',
          });
        }
        return true;
      } catch (err) {
        console.error('Google SDK initialization error:', err);
        return false;
      }
    };
    if (init()) return;
    const interval = window.setInterval(() => {
      if (window.google?.accounts?.id) {
        window.clearInterval(interval);
        if (!cancelled) init();
      }
    }, 100);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [googleLogin, navigate]);

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const newUser = {
      email,
      name,
      nickname: nickname || name,
      picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
      studentClass,
      department,
      age: 17,
    };
    login(newUser);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex items-center justify-center text-teal-400 mx-auto">
            <Sparkles size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Create StudyAI Account</h1>
          <p className="text-xs text-slate-400">Join your peers & AI Tutors</p>
        </div>

        {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase text-slate-400">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Embel Mpklet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-slate-500" size={16} />
              <input
                type="email"
                placeholder="embelmpklet@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase text-slate-400">Nickname</label>
            <input
              type="text"
              placeholder="EmbelPro"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase text-slate-400">Class</label>
              <select
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
              >
                <option value="SS 1">SS 1</option>
                <option value="SS 2">SS 2</option>
                <option value="SS 3">SS 3</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase text-slate-400">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
              >
                <option value="Science">Science</option>
                <option value="Arts">Arts</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase text-slate-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-slate-500" size={16} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs mt-2">
            <UserPlus size={16} /> Create Account & Sign Up
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase">Or</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        <div ref={googleButtonRef} className="w-full flex justify-center overflow-hidden rounded-xl"></div>

        <p className="text-center text-xs text-slate-400">
          Already have an account? <Link to="/login" className="text-teal-400 font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};
export default Register;
