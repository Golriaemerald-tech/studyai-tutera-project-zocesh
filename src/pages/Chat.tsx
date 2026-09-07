import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Send, Volume2, VolumeX } from 'lucide-react';
import { renderMarkdown } from '../lib/markdown';
import {
  ChatConversation,
  ChatMessage,
  createConversation,
  getConversations,
  getMessages,
  addMessage,
  updateConversation,
} from '../lib/chatHistory';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export const Chat = () => {
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Welcome back, ${user?.nickname || user?.name || 'Student'}! 👋 I'm your Zocesh Study AI Tutor. What would you like to learn today?`,
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState<number | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    let active = true;

    const loadHistory = async () => {
      try {
        setHistoryLoading(true);

        const chats = await getConversations(user.id);

        if (!active) return;

        setConversations(chats);

        if (chats.length > 0) {
          const latest = chats[0];
          const savedMessages = await getMessages(latest.id);

          if (!active) return;

          setConversationId(latest.id);

          if (savedMessages.length > 0) {
            setMessages(
              savedMessages.map((message: ChatMessage) => ({
                role: message.role === 'user' ? 'user' : 'assistant',
                content: message.content,
              }))
            );
          }
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      } finally {
        if (active) setHistoryLoading(false);
      }
    };

    loadHistory();

    return () => {
      active = false;
    };
  }, [user?.id]);

  async function openConversation(chat: ChatConversation) {
    if (loading || historyLoading) return;

    try {
      setHistoryLoading(true);
      const savedMessages = await getMessages(chat.id);

      setConversationId(chat.id);
      setMessages(
        savedMessages.length > 0
          ? savedMessages.map((message: ChatMessage) => ({
              role: message.role === 'user' ? 'user' : 'assistant',
              content: message.content,
            }))
          : [
              {
                role: 'assistant',
                content: `This is a new conversation. How can I help you?`,
              },
            ]
      );
    } catch (error) {
      console.error('Failed to open conversation:', error);
    } finally {
      setHistoryLoading(false);
    }
  }

  function startNewChat() {
    if (loading) return;

    setConversationId(null);
    setMessages([
      {
        role: 'assistant',
        content: `New chat started. What would you like to study?`,
      },
    ]);
  }

  async function handleSend(e: FormEvent) {
    e.preventDefault();

    const prompt = input.trim();
    if (!prompt || loading || !user?.id) return;

    setInput('');
    setLoading(true);

    try {
      let activeConversationId = conversationId;

      if (!activeConversationId) {
        const conversation = await createConversation(user.id, {
          title: prompt.slice(0, 60),
          model: 'Gemini',
          classLevel: user.studentClass,
        });

        activeConversationId = conversation.id;
        setConversationId(conversation.id);
        setConversations((prev) => [conversation, ...prev]);
      }

      const nextMessages: Message[] = [
        ...messages,
        { role: 'user', content: prompt },
      ];

      setMessages(nextMessages);

      await addMessage(activeConversationId, 'user', prompt, user.id);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          systemInstruction: `
You are ZOCESH STUDY AI, a patient Nigerian secondary-school tutor.

Student name: ${user.nickname || user.name || 'Student'}
Student class: ${user.studentClass || 'SS3'}
Department: ${user.department || 'Science'}

Teach at the student's level.
Address the student naturally and respectfully. Never use sir, ma, madam, or other gendered titles.
Explain answers clearly and step by step.
For Mathematics and science, show the actual equations, numbers and working.
Never invent random symbols or placeholder characters for mathematical notation.
Do not put literal ## or ### heading markers in your response.
Use **bold text** when emphasis is needed.
Keep explanations educational, clear and age-appropriate.
        `.trim(),
          maxOutputTokens: 2048,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Tutor AI request failed.');
      }

      const answer =
        typeof data?.text === 'string' && data.text.trim()
          ? data.text.trim()
          : 'I could not generate a response. Please try again.';

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: answer },
      ]);

      await addMessage(activeConversationId, 'assistant', answer);

      await updateConversation(activeConversationId, {
        title: messages.length <= 1 ? prompt.slice(0, 60) : undefined,
      });

      setConversations((prev) =>
        prev.map((chat) =>
          chat.id === activeConversationId
            ? {
                ...chat,
                title:
                  messages.length <= 1 ? prompt.slice(0, 60) : chat.title,
                updated_at: new Date().toISOString(),
              }
            : chat
        )
      );
    } catch (error) {
      console.error('Tutor AI error:', error);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I could not reach Tutor AI right now. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function stopSpeaking() {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setAudio(null);
    }

    setSpeaking(null);
  }


  async function speak(text: string, index: number) {
    if (speaking !== null) return;

    try {
      setSpeaking(index);

      const response = await fetch('/api/elevenlabs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Voice service unavailable.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onended = () => {
        URL.revokeObjectURL(url);
        setSpeaking(null);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setSpeaking(null);
      };

      await audio.play();
    } catch (error) {
      console.error('ElevenLabs error:', error);
      setSpeaking(null);
      alert('Voice is not configured yet. Your text tutor is still working.');
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <select
          value={conversationId || ''}
          onChange={(e) => {
            const selected = conversations.find(
              (chat) => chat.id === e.target.value
            );
            if (selected) openConversation(selected);
          }}
          disabled={historyLoading || loading}
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-brand-400 disabled:opacity-50"
        >
          <option value="">
            {historyLoading ? 'Loading chats...' : 'Previous chats'}
          </option>
          {conversations.map((chat) => (
            <option key={chat.id} value={chat.id}>
              {chat.title || 'New chat'}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={startNewChat}
          disabled={loading}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-white/10 disabled:opacity-50"
        >
          + New Chat
        </button>
      </div>
      <div className="card">
        <span className="pill flex w-fit items-center gap-2">
          <Sparkles size={14} />
          STUDYAI TUTOR
        </span>

        <h1 className="mt-3 font-display text-2xl md:text-3xl font-bold">
          Your AI Tutor
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          {user?.studentClass || 'SS 3'} •{' '}
          {user?.department || 'Science'}
        </p>
      </div>

      <div className="card">
        <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-raised border border-surface-border/60'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div
                    className="prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(message.content),
                    }}
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                )}

                {message.role === 'assistant' && (
                  <button
                    type="button"
                    onClick={() =>
                      speaking === index
                        ? stopSpeaking()
                        : speak(message.content, index)
                    }
                    className="mt-3 inline-flex items-center gap-2 rounded-lg border border-surface-border px-3 py-1.5 text-xs hover:border-brand-400/60"
                  >
                    {speaking === index ? (
                      <>
                        <VolumeX size={14} />
                        Stop
                      </>
                    ) : (
                      <>
                        <Volume2 size={14} />
                        Read aloud
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-surface-raised border border-surface-border/60 px-4 py-3 text-sm text-slate-400">
                Tutor AI is thinking...
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSend}
          className="mt-5 flex gap-2"
        >
          <input
            type="text"
            placeholder="Ask your Tutor AI anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 rounded-xl border border-surface-border bg-surface-raised px-4 py-3 text-sm outline-none focus:border-brand-400"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn btn-primary px-4"
          >
            <Send size={17} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
