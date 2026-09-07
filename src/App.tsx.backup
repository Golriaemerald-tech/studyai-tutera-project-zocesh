import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, GoogleCredentialResponse, User } from './context/AuthContext';
import { ask, GeminiError, buildTutorInstruction, type StudentProfile } from './lib/gemini';
import { renderMarkdown } from './lib/markdown';
import { 
  Home, MessageSquare, BookOpen, Award, Shield, User as UserIcon, LogOut, 
  Sparkles, Mail, Lock, LogIn, Globe, CheckCircle2, RefreshCw, Send, Users, Key 
} from 'lucide-react';

// --- GEMINI SERVICE ---
// Calls go through our own /api/chat serverless function (see
// src/lib/gemini.ts) instead of hitting Google directly from the browser.
// That keeps the Gemini API key server-side (a client-side key ships inside
// the public JS bundle for anyone to grab) and gets automatic fallback
// across several Gemini models if the primary one is rate-limited or briefly
// unavailable — which matters a lot on a free API key. `profile` carries the
// student's class/department so answers are pitched at the right level.
const generateStudyResponse = async (
  prompt: string,
  subjectContext = 'General',
  profile?: StudentProfile | null
) => {
  try {
    const text = await ask(`Help the student thoroughly.\n\nStudent: ${prompt}`, {
      systemInstruction: buildTutorInstruction(profile, {
        subject: subjectContext,
        persona: `You are StudyAI, an expert Nigerian curriculum tutor specialized in ${subjectContext}.`,
      }),
    });
    return text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    const message = error instanceof GeminiError ? error.message : 'Error connecting to Gemini AI.';
    return message;
  }
};

// --- LAYOUT & NAVIGATION BAR ---
const Layout: React.FC = () => {
  const { user, logout, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: Home },
    { label: 'Study & Quizzes', path: '/study', icon: BookOpen },
    { label: 'DMs & Rooms', path: '/chat', icon: MessageSquare },
    { label: 'Leaderboard', path: '/leaderboard', icon: Award },
    { label: 'Profile', path: '/profile', icon: UserIcon },
  ];

  if (isAdmin || isSuperAdmin) {
    navItems.push({ label: 'Admin Panel', path: '/admin', icon: Shield });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
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

      <main className="flex-1 pb-20 md:pb-6">
        <Outlet />
      </main>

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

// --- LOGIN PAGE ---
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '706971985194-qm8sivf0qquafuqf0pc9spgcdj65lv1k.apps.googleusercontent.com';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!identifier || !password) {
      setError('Please enter your email or nickname and your password.');
      return;
    }

    let allUsers: Record<string, User> = {};
    try {
      allUsers = JSON.parse(localStorage.getItem('studyai_all_users') || '{}') as Record<string, User>;
    } catch {
      allUsers = {};
    }

    const lookup = identifier.toLowerCase();
    const foundUser = allUsers[lookup] || Object.values(allUsers).find((u) => u.nickname?.toLowerCase() === lookup);

    if (!foundUser) {
      setError('Account not found. Please register first.');
      return;
    }
    if (foundUser.password && foundUser.password !== password) {
      setError('Incorrect password.');
      return;
    }

    login(foundUser);
    navigate('/');
  };

  useEffect(() => {
    let cancelled = false;

    const initGoogle = () => {
      if (!window.google?.accounts?.id) return;
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
            text: 'signin_with',
          });
        }
      } catch (err) {
        console.error('Google SDK initialization error:', err);
      }
    };

    if (window.google?.accounts?.id) {
      if (!cancelled) initGoogle();
      return;
    }

    const interval = window.setInterval(() => {
      if (window.google?.accounts?.id) {
        window.clearInterval(interval);
        if (!cancelled) initGoogle();
      }
    }, 100);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [googleLogin, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex items-center justify-center text-teal-400 mx-auto">
            <Sparkles size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Sign In to StudyAI</h1>
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

        <div className="w-full flex justify-center overflow-hidden rounded-xl">
          <div ref={googleButtonRef} className="w-full flex justify-center"></div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Don't have an account? <Link to="/register" className="text-teal-400 font-semibold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

// --- REGISTER PAGE ---
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentClass, setStudentClass] = useState('SS 3');
  const [department, setDepartment] = useState('Science');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('Full Name, Email, and Password are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    login({ name, email, password, studentClass, department });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-100">Create StudyAI Account</h1>
          <p className="text-xs text-slate-400">Join Nigerian scholars and ace your exams</p>
        </div>

        {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-400">Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-teal-500" required />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-400">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-teal-500" required />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-400">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-teal-500" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-400">Class</label>
              <select value={studentClass} onChange={e => setStudentClass(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-teal-500">
                <option>SS 1</option><option>SS 2</option><option>SS 3</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-400">Department</label>
              <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-teal-500">
                <option>Science</option><option>Arts</option><option>Commercial</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3.5 rounded-xl">Register Account</button>
        </form>
        <p className="text-center text-xs text-slate-400">Already have an account? <Link to="/login" className="text-teal-400 font-semibold hover:underline">Sign In</Link></p>
      </div>
    </div>
  );
};

// --- HOME DASHBOARD ---
const HomeDashboard = () => {
  const { user } = useAuth();
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-teal-500/10 via-slate-900 to-slate-900 border border-teal-500/20 p-8 rounded-3xl space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-3">
          Welcome, {user?.name || 'Student'}! <Sparkles className="text-teal-400" />
        </h1>
        <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
          Your complete Nigerian secondary education AI suite. Department: <strong className="text-teal-300">{user?.department || 'Science'}</strong> ({user?.studentClass || 'SS 3'}).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase">Questions Solved</p>
          <p className="text-3xl font-extrabold text-teal-400">42</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase">Average Quiz Score</p>
          <p className="text-3xl font-extrabold text-emerald-400">91%</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase">National Rank</p>
          <p className="text-3xl font-extrabold text-amber-400">#14</p>
        </div>
      </div>
    </div>
  );
};

// --- STUDY & QUIZZES HUB ---
const Study: React.FC = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState('Mathematics');
  const [topic, setTopic] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const sampleQuiz = {
    question: 'According to the WAEC/NECO syllabus, what is the quadratic formula used to solve ax² + bx + c = 0?',
    options: [
      'x = (-b ± √(b² - 4ac)) / 2a',
      'x = (b ± √(b² + 4ac)) / a',
      'x = (-b ± √(b² + 4ac)) / 2a',
      'x = (-b - √(b² - 4ac)) / a'
    ],
    correct: 0
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    const res = await generateStudyResponse(`Explain: ${topic}`, subject, user);
    setAiOutput(res);
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="text-teal-400" /> Study & Quizzes Hub
          </h1>
          <p className="text-xs text-slate-400">Master WAEC, NECO & JAMB subjects with Gemini AI & interactive tests.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setQuizMode(false)} className={`px-4 py-2 rounded-xl text-xs font-semibold ${!quizMode ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>AI Tutor</button>
          <button onClick={() => setQuizMode(true)} className={`px-4 py-2 rounded-xl text-xs font-semibold ${quizMode ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>Practice Quiz</button>
        </div>
      </div>

      {!quizMode ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Select Subject</h2>
            <div className="space-y-2">
              {['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Civic Education'].map((s) => (
                <button key={s} onClick={() => setSubject(s)} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium ${subject === s ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-slate-950 text-slate-400 hover:bg-slate-800'}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
            <form onSubmit={handleAskAI} className="space-y-4">
              <label className="text-xs font-semibold text-slate-400 uppercase">Ask AI Tutor about {subject}</label>
              <div className="flex gap-2">
                <input type="text" placeholder="e.g., Explain Newton's laws..." value={topic} onChange={(e) => setTopic(e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-teal-500" />
                <button type="submit" disabled={loading} className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 rounded-xl flex items-center justify-center">
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
                </button>
              </div>
            </form>
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl min-h-[250px] text-sm text-slate-200 leading-relaxed overflow-y-auto [&_p]:m-0 [&_p+p]:mt-3 [&_ul]:my-2 [&_ul]:pl-5 [&_li]:list-disc [&_h2]:font-bold [&_h2]:text-base [&_h2]:mb-1 [&_h3]:font-bold [&_h3]:mb-1 [&_code]:bg-slate-800 [&_code]:px-1 [&_code]:rounded">
              {aiOutput ? (
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(aiOutput) }} />
              ) : (
                'Your AI tutor explanation will appear here...'
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-teal-400 uppercase">WAEC CBT Practice</span>
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">Question 1 of 10</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100">{sampleQuiz.question}</h2>
          <div className="space-y-3">
            {sampleQuiz.options.map((opt, idx) => (
              <button key={idx} onClick={() => setSelectedAnswer(idx)} className={`w-full text-left p-4 rounded-xl text-sm transition-all border ${selectedAnswer === idx ? (idx === sampleQuiz.correct ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-rose-500/20 border-rose-500 text-rose-300') : 'bg-slate-950 border-slate-800 text-slate-300'}`}>{opt}</button>
            ))}
          </div>
          {selectedAnswer !== null && (
            <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${selectedAnswer === sampleQuiz.correct ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <CheckCircle2 size={16} /> {selectedAnswer === sampleQuiz.correct ? 'Correct! Excellent problem solving.' : 'Incorrect. The correct formula is option A.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- CHAT ROOMS & DMs ---
interface Message { id: string; sender: string; text: string; time: string; }

const ChatRooms: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'community' | 'dm'>('community');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'Chinedu Obi', text: 'Who has solved the 2025 WAEC Further Math past questions?', time: '09:00 AM' },
    { id: '2', sender: 'Aisha Bello', text: 'Check the Study Hub, the AI explained it clearly there.', time: '09:05 AM' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: user?.name || 'Student', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <MessageSquare className="text-teal-400" /> Community & DMs
          </h1>
          <p className="text-xs text-slate-400">Connect with Nigerian students and study peers securely.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('community')} className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${activeTab === 'community' ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}><Users size={14} /> Rooms</button>
          <button onClick={() => setActiveTab('dm')} className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${activeTab === 'dm' ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}><MessageSquare size={14} /> Direct Chats</button>
        </div>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-3xl h-[550px] flex flex-col justify-between overflow-hidden">
        <div className="bg-slate-950/60 border-b border-slate-800 p-4 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">{activeTab === 'community' ? 'SS3 Science General Room' : 'Direct Message with Tutor'}</span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Live</span>
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.sender === user?.name ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] text-slate-500 mb-1">{m.sender} • {m.time}</span>
              <div className={`p-3.5 rounded-2xl max-w-md text-xs leading-relaxed ${m.sender === user?.name ? 'bg-teal-500 text-slate-950 font-medium' : 'bg-slate-800 text-slate-200'}`}>{m.text}</div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input type="text" placeholder="Type your message..." value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500" />
          <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 rounded-xl flex items-center justify-center"><Send size={16} /></button>
        </form>
      </div>
    </div>
  );
};

// --- LEADERBOARD & PROFILE ---
const Leaderboard = () => (
  <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
      <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2"><Award className="text-amber-400" /> National Leaderboard</h1>
      <p className="text-xs text-slate-400">Top WAEC/NECO scholars across Nigeria.</p>
    </div>
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden divide-y divide-slate-800">
      {['Chinedu Obi', 'Embel Mpklet', 'Aisha Bello', 'Oluwaseun Ade'].map((name, i) => (
        <div key={name} className="p-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3"><span className="font-bold text-teal-400">#{i + 1}</span><span className="font-bold text-slate-200">{name}</span></div>
          <span className="text-slate-400">{98 - i * 3} pts</span>
        </div>
      ))}
    </div>
  </div>
);

const Profile = () => {
  const { user } = useAuth();
  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 text-center">
        <img src={user?.picture} alt={user?.name} className="w-24 h-24 rounded-full mx-auto border-2 border-teal-500/40 object-cover" />
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-100">{user?.name}</h2>
          <p className="text-xs text-teal-400">{user?.email}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl text-left text-xs space-y-2 border border-slate-800">
          <p><strong className="text-slate-400">Class:</strong> {user?.studentClass || 'SS 3'}</p>
          <p><strong className="text-slate-400">Department:</strong> {user?.department || 'Science'}</p>
          <p><strong className="text-slate-400">Role:</strong> {user?.role || 'user'}</p>
        </div>
      </div>
    </div>
  );
};

// --- ADMIN PANEL ---
const AdminPanel: React.FC = () => {
  const { isAdmin, isSuperAdmin, bannedList, unbanUser } = useAuth();
  const [apiKeyInput, setApiKeyInput] = useState(() => localStorage.getItem('studyai_gemini_api_key') || '');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAdmin && !isSuperAdmin) {
    return (
      <div className="p-12 text-center space-y-4">
        <Shield className="mx-auto text-rose-500" size={48} />
        <h1 className="text-xl font-bold text-slate-100">Access Restricted</h1>
        <p className="text-xs text-slate-400">You do not have administrator privileges to view this panel.</p>
      </div>
    );
  }

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('studyai_gemini_api_key', apiKeyInput);
    setSuccessMsg('Gemini API Key successfully updated across all AI chatbots!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Shield className="text-teal-400" /> Admin & Owner Panel
          </h1>
          <p className="text-xs text-slate-400">Manage global AI API keys, users, and platform security.</p>
        </div>
        {isSuperAdmin && <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-3 py-1 rounded-full font-bold">Superadmin Access</span>}
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2"><Key size={16} className="text-teal-400" /> Gemini API Key Configuration</h2>
          <p className="text-xs text-slate-400">Enter your custom Google Gemini API key to power all AI chatbots and study assistants instantly.</p>
          <form onSubmit={handleSaveApiKey} className="space-y-4">
            <input type="password" placeholder="AIzaSy..." value={apiKeyInput} onChange={(e) => setApiKeyInput(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500" required />
            <button type="submit" className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3 rounded-xl text-xs">Save Global API Key</button>
          </form>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2"><Users size={16} className="text-teal-400" /> Moderation & Banned Users</h2>
          <div className="space-y-2 max-h-[220px] overflow-y-auto">
            {bannedList.length === 0 ? <p className="text-xs text-slate-500">No banned users currently.</p> : bannedList.map((b) => (
              <div key={b.userId} className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div><p className="font-bold text-slate-200">{b.email}</p><p className="text-[10px] text-rose-400">{b.reason}</p></div>
                <button onClick={() => unbanUser(b.userId)} className="p-2 bg-slate-800 hover:bg-teal-500/20 text-teal-400 rounded-lg">Unban</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- AUTH GUARD ---
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

// --- APP ROUTER ---
export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route path="/" element={<RequireAuth><HomeDashboard /></RequireAuth>} />
            <Route path="/study" element={<RequireAuth><Study /></RequireAuth>} />
            <Route path="/chat" element={<RequireAuth><ChatRooms /></RequireAuth>} />
            <Route path="/leaderboard" element={<RequireAuth><Leaderboard /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/admin" element={<RequireAuth><AdminPanel /></RequireAuth>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
