import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Send, Flame, CheckCircle, Star, Compass } from 'lucide-react';

export const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Welcome back, ${user?.nickname || 'Student'}! Ready to conquer your studies today?` }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = input;
    setMessages((prev) => [...prev, { role: 'user', content: msg }, { role: 'assistant', content: `Got it! Let's examine "${msg}" together in detail.` }]);
    setInput('');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-2xl">
        <span className="text-xs uppercase bg-teal-500/10 border border-teal-500/30 text-teal-300 px-3 py-1 rounded-full font-semibold">Dashboard & General AI Chat</span>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-100">Welcome, {user?.nickname || user?.name || 'Student'}! 👋</h1>
        <p className="text-xs md:text-sm text-slate-400">Class: <strong className="text-teal-400">{user?.studentClass || 'SS 3'}</strong> ({user?.department || 'Science'})</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex justify-between items-center text-slate-400"><span className="text-xs">Study streak</span><Flame className="text-amber-500" size={18} /></div>
          <p className="text-2xl font-bold text-slate-100">5d</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex justify-between items-center text-slate-400"><span className="text-xs">Questions solved</span><CheckCircle className="text-teal-400" size={18} /></div>
          <p className="text-2xl font-bold text-slate-100">42</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex justify-between items-center text-slate-400"><span className="text-xs">Average quiz score</span><Star className="text-amber-400" size={18} /></div>
          <p className="text-2xl font-bold text-slate-100">91%</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex justify-between items-center text-slate-400"><span className="text-xs">Topics mastered</span><Compass className="text-indigo-400" size={18} /></div>
          <p className="text-2xl font-bold text-slate-100">14</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase text-slate-400 flex items-center gap-2"><Sparkles className="text-teal-400" size={16} /> General Assistant Room</h2>
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl text-xs max-w-lg ${m.role === 'user' ? 'bg-teal-500 text-slate-950 font-medium' : 'bg-slate-800 text-slate-200'}`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex gap-2 pt-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
          />
          <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-5 rounded-xl font-bold flex items-center justify-center transition-all">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
export default Chat;
