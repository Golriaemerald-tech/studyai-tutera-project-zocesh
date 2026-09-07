import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, User, MessageCircle, Lock } from 'lucide-react';

interface DirectMessage {
  id: string;
  senderEmail: string;
  receiverEmail: string;
  content: string;
  timestamp: string;
}

export const DirectMessages = () => {
  const { user } = useAuth();
  const [receiver, setReceiver] = useState('');
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [allDMs, setAllDMs] = useState<DirectMessage[]>(() => {
    const saved = localStorage.getItem('studyai_dms');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('studyai_dms', JSON.stringify(allDMs));
  }, [allDMs]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Lock size={48} className="text-teal-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Direct Messages</h2>
        <p className="text-slate-400">Please sign in to send private direct messages.</p>
      </div>
    );
  }

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiver.trim()) return;
    setActiveChat(receiver.trim().toLowerCase());
  };

  const handleSendDM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const newDM: DirectMessage = {
      id: Date.now().toString(),
      senderEmail: user.email.toLowerCase(),
      receiverEmail: activeChat.toLowerCase(),
      content: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAllDMs((prev) => [...prev, newDM]);
    setInputText('');
  };

  const activeMessages = allDMs.filter(
    (dm) =>
      (dm.senderEmail === user.email.toLowerCase() && dm.receiverEmail === activeChat) ||
      (dm.receiverEmail === user.email.toLowerCase() && dm.senderEmail === activeChat)
  );

  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-6rem)]">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-4 flex flex-col">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageCircle size={20} className="text-teal-400" /> Direct Messages
        </h2>
        <form onSubmit={handleStartChat} className="space-y-2">
          <input
            type="email"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="User email to DM..."
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
          >
            Open Chat
          </button>
        </form>

        <div className="flex-1 overflow-y-auto space-y-2 border-t border-slate-800 pt-3">
          <p className="text-[11px] font-semibold text-slate-500 uppercase">Active Contacts</p>
          {Array.from(new Set(allDMs.flatMap((d) => [d.senderEmail, d.receiverEmail])))
            .filter((e) => e !== user.email.toLowerCase())
            .map((email) => (
              <button
                key={email}
                onClick={() => setActiveChat(email)}
                className={`w-full text-left p-2.5 rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${
                  activeChat === email
                    ? 'bg-teal-500/10 border-teal-500/30 text-teal-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="truncate">{email}</span>
              </button>
            ))}
        </div>
      </div>

      <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col">
        {activeChat ? (
          <>
            <div className="border-b border-slate-800 pb-3 mb-3 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <User size={16} className="text-teal-400" /> {activeChat}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
              {activeMessages.length === 0 ? (
                <p className="text-xs text-slate-500 text-center pt-8">No message history yet. Say hi!</p>
              ) : (
                activeMessages.map((dm) => {
                  const isMe = dm.senderEmail === user.email.toLowerCase();
                  return (
                    <div key={dm.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                          isMe
                            ? 'bg-teal-500 text-slate-950 font-medium rounded-tr-none'
                            : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-tl-none'
                        }`}
                      >
                        <p>{dm.content}</p>
                        <p className={`text-[9px] mt-1 text-right ${isMe ? 'text-slate-800' : 'text-slate-500'}`}>
                          {dm.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSendDM} className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeChat}...`}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center"
              >
                <Send size={14} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs">
            Select or start a chat to begin messaging.
          </div>
        )}
      </div>
    </div>
  );
};
