import { useState } from 'react';
import { MessageSquare, Send, ShieldCheck, Bot } from 'lucide-react';

export const DMs = () => {
  const [activeChat, setActiveChat] = useState('Maths Tutor Bot');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any>({
    'Maths Tutor Bot': [{ sender: 'Maths Tutor Bot', text: 'Hello! Ask me any mathematics problem or concept.', time: '10:00 AM' }],
    'Physics Peer Chat': [{ sender: 'Amina', text: 'Hey guys, check the wave equations!', time: '10:15 AM' }],
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const currentMsgs = messages[activeChat] || [];
    const updated = [...currentMsgs, { sender: 'You', text: message, time: 'Just now' }];
    if (activeChat.includes('Bot')) {
      updated.push({ sender: activeChat, text: `I am your AI bot assistant. Let's solve "${message}" step by step!`, time: 'Just now' });
    }
    setMessages({ ...messages, [activeChat]: updated });
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-6rem)]">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col space-y-3">
        <h2 className="text-sm font-bold uppercase text-slate-400 px-2">DMs & Bot Rooms</h2>
        <div className="space-y-1">
          {['Maths Tutor Bot', 'Physics Peer Chat', 'Exam Prep Assistant Bot', 'General Student Room'].map((chat) => (
            <button
              key={chat}
              onClick={() => setActiveChat(chat)}
              className={`w-full text-left px-3 py-3 rounded-2xl text-xs font-semibold transition-all ${
                activeChat === chat ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {chat}
            </button>
          ))}
        </div>
      </div>

      <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeChat.includes('Bot') ? <Bot className="text-teal-400" size={20} /> : <MessageSquare className="text-teal-400" size={20} />}
            <h3 className="font-bold text-slate-100 text-sm">{activeChat}</h3>
          </div>
          <span className="text-xs text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20 flex items-center gap-1">
            <ShieldCheck size={12} /> Secure Active Room
          </span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {(messages[activeChat] || []).map((m: any, i: number) => (
            <div key={i} className={`flex flex-col ${m.sender === 'You' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-semibold text-slate-400">{m.sender}</span>
                <span className="text-[9px] text-slate-600">{m.time}</span>
              </div>
              <div className={`p-3.5 rounded-2xl text-xs max-w-md ${m.sender === 'You' ? 'bg-teal-500 text-slate-950 font-medium' : 'bg-slate-800 text-slate-200'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
          />
          <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-5 rounded-xl font-bold flex items-center justify-center transition-all">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
export default DMs;
