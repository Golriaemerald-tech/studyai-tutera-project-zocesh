import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { callGeminiAPI } from '../utils/gemini';
import { buildTutorInstruction } from '../lib/gemini';
import { renderMarkdown } from '../lib/markdown';
import { supabase } from '../lib/supabase';
import { getDisplayIdentity } from '../lib/displayIdentity';
import { Send, Trash2, MessageSquare, Bot, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPicture: string;
  content: string;
  timestamp: string;
  isAdminSender: boolean;
  isBot?: boolean;
}

interface CommunityMessageRow {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender_name: string | null;
  sender_email: string | null;
  sender_picture: string | null;
  is_bot: boolean;
  is_admin_sender: boolean;
}

const BOT_EMAIL = 'bot@studyai.app';
const BOT_NAME = 'StudyBot AI';
const BOT_PICTURE =
  'https://api.dicebear.com/7.x/bottts/svg?seed=StudyBot';

function rowToMessage(row: CommunityMessageRow): Message {
  return {
    id: row.id,
    senderName: row.is_bot ? BOT_NAME : row.sender_name || 'Student',
    senderEmail: row.is_bot ? BOT_EMAIL : row.sender_email || '',
    senderPicture: row.is_bot
      ? BOT_PICTURE
      : row.sender_picture || 'https://api.dicebear.com/7.x/initials/svg?seed=Student',
    content: row.content,
    timestamp: new Date(row.created_at).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    isAdminSender: row.is_admin_sender,
    isBot: row.is_bot,
  };
}

export const ChatArena = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('community_messages')
        .select(
          'id, sender_id, content, created_at, sender_name, sender_email, sender_picture, is_bot, is_admin_sender'
        )
        .order('created_at', { ascending: true })
        .limit(500);

      if (error) {
        console.error('Failed to load Arena messages:', error);
      }

      if (mounted && data) {
        setMessages((data as CommunityMessageRow[]).map(rowToMessage));
      }

      if (mounted) {
        setIsLoading(false);
      }
    };

    loadMessages();

    const channel = supabase
      .channel('studyai-arena-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_messages',
        },
        (payload) => {
          const row = payload.new as CommunityMessageRow;

          setMessages((prev) => {
            if (prev.some((message) => message.id === row.id)) {
              return prev;
            }

            return [...prev, rowToMessage(row)];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'community_messages',
        },
        (payload) => {
          const deletedId = (payload.old as { id?: string }).id;

          if (deletedId) {
            setMessages((prev) =>
              prev.filter((message) => message.id !== deletedId)
            );
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotThinking]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim() || !user || isBotThinking) return;

    const userMsgText = inputText.trim();
    setInputText('');

    const { error } = await supabase.from('community_messages').insert({
      sender_id: user.id,
      content: userMsgText,
      sender_name: getDisplayIdentity(user),
      sender_email: user.email,
      sender_picture: user.picture,
      is_bot: false,
      is_admin_sender: isAdmin,
    });

    if (error) {
      console.error('Failed to send Arena message:', error);
      setInputText(userMsgText);
      return;
    }

    setIsBotThinking(true);

    try {
      const aiResponse = await callGeminiAPI(
        `User ${getDisplayIdentity(user)} said in group chat: "${userMsgText}". Respond helpfully and concisely as StudyBot AI in under 3 sentences.`,
        buildTutorInstruction(user, {
          persona:
            'You are StudyBot AI, an intelligent, encouraging educational assistant in a student group chat.',
        })
      );

      const { error: botError } = await supabase
        .from('community_messages')
        .insert({
          sender_id: user.id,
          content: aiResponse,
          sender_name: BOT_NAME,
          sender_email: BOT_EMAIL,
          sender_picture: BOT_PICTURE,
          is_bot: true,
          is_admin_sender: true,
        });

      if (botError) {
        console.error('Failed to save StudyBot response:', botError);
      }
    } catch (error) {
      console.error('StudyBot error:', error);
    } finally {
      setIsBotThinking(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;

    const { error } = await supabase
      .from('community_messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete Arena message:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <MessageSquare size={48} className="text-teal-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Join the Community Chat
        </h2>
        <p className="text-slate-400 mb-6">
          Sign in to participate in the real-time Student Chat Arena.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl transition-all"
        >
          Sign In to Chat
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="text-teal-400" size={22} />
            Public Chat Arena
          </h1>
          <p className="text-xs text-slate-400">
            Live group discussion featuring Gemini-powered StudyBot AI
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-teal-400 text-sm">
            <Loader2 size={18} className="animate-spin mr-2" />
            Loading Arena messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm text-center">
            No messages yet. Be the first to start the discussion!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = !msg.isBot && msg.senderEmail === user.email;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  isMe ? 'flex-row-reverse' : ''
                }`}
              >
                <img
                  src={msg.senderPicture}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full border border-slate-700 mt-1"
                />

                <div
                  className={`max-w-[75%] ${
                    isMe ? 'items-end text-right' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-300">
                      {msg.senderName}
                    </span>

                    {msg.isBot && (
                      <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                        <Bot size={10} /> AI BOT
                      </span>
                    )}

                    {msg.isAdminSender && !msg.isBot && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                        ADMIN
                      </span>
                    )}

                    <span className="text-[10px] text-slate-500">
                      {msg.timestamp}
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-2xl text-sm [&_p]:m-0 [&_ul]:my-1 [&_ul]:pl-4 [&_li]:list-disc ${
                      isMe
                        ? 'bg-teal-500 text-slate-950 font-medium rounded-tr-none'
                        : msg.isBot
                        ? 'bg-slate-800 border border-teal-500/30 text-teal-100 rounded-tl-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-tl-none'
                    }`}
                  >
                    {msg.isBot ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(msg.content),
                        }}
                      />
                    ) : (
                      msg.content
                    )}
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="text-[10px] text-red-400 hover:text-red-300 mt-1 flex items-center gap-1"
                    >
                      <Trash2 size={10} /> Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}

        {isBotThinking && (
          <div className="flex items-center gap-2 text-xs text-teal-400 italic bg-teal-500/5 p-2 rounded-lg border border-teal-500/10 w-fit">
            <Loader2 size={12} className="animate-spin" />
            StudyBot AI is formulating a response...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Send a message to the arena..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
        />

        <button
          type="submit"
          disabled={isBotThinking}
          className="px-5 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
