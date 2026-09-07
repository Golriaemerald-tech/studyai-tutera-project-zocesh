import { useState, useEffect, FormEvent, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Sparkles, Mail, Lock, LogIn, Globe } from 'lucide-react';

const GOOGLE_CLIENT_ID = '706971985194-qm8sivf0qquafuqf0pc9spgcdj65lv1k.apps.googleusercontent.com';

export const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: identifier.trim().toLowerCase(),
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!data.user) {
        setError('Sign in failed. Please try again.');
        return;
      }

      navigate('/');
  };

  useEffect(() => {
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: any) => {
            googleLogin(response);
            navigate('/');
          },
        });

        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'filled_black',
            size: 'large',
            width: '100%',
            text: 'signin_with',
          });
        }
      } catch (err) {
        console.error('Google SDK initialization error:', err);
      }
    }
  }, [googleLogin, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex items-center justify-center text-teal-400 mx-auto">
            <Sparkles size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Sign In to Zocesh Zocesh Study AI</h1>
          <p className="text-xs text-slate-400">Google OAuth & Credentials Login</p>
        </div>

        {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-slate-400">Email or Nickname</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="you@gmail.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-100 focus:outline-none focus:border-teal-500 text-sm"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-slate-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-100 focus:outline-none focus:border-teal-500 text-sm"
                required
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
            <LogIn size={18} /> Sign In
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase">Or</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Official Google Sign-In Button Container */}
        <div className="w-full flex justify-center overflow-hidden rounded-xl">
          <div ref={googleButtonRef} className="w-full flex justify-center"></div>
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] text-slate-400 space-y-1">
          <p className="font-bold text-slate-300 flex items-center gap-1"><Globe size={12} className="text-teal-400" /> OAuth Redirect URL:</p>
          <p>• <code className="text-teal-300">https://studyaituteraprojectzocesh.vercel.app</code></p>
        </div>

        <p className="text-center text-xs text-slate-400">
          Don't have an account? <Link to="/register" className="text-teal-400 font-semibold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
