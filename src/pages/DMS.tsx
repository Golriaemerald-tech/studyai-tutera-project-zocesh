import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { MessageCircle, Search, Send, ArrowLeft, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { getDisplayIdentity } from "../lib/displayIdentity";

type Profile = {
  id: string;
  display_name: string | null;
  nickname: string | null;
  email: string | null;
  role: string | null;
};

type Thread = {
  id: string;
  created_at: string;
};

type Member = {
  thread_id: string;
  user_id: string;
};

type Message = {
  id: string;
  thread_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

const publicName = (profile?: Profile | null) =>
  getDisplayIdentity(profile);

export default function DMS() {
  const [me, setMe] = useState<Profile | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;

    const [meResult, usersResult, threadsResult, membersResult, messagesResult] =
      await Promise.all([
        supabase.from("profiles").select("*").eq("id", auth.user.id).single(),
        supabase
          .from("profiles")
          .select("id,display_name,nickname,email,role")
          .neq("id", auth.user.id)
          .order("display_name"),
        supabase.from("dm_threads").select("*").order("created_at", { ascending: false }),
        supabase.from("dm_members").select("*"),
        supabase.from("dm_messages").select("*").order("created_at"),
      ]);

    setMe(meResult.data);
    setUsers(usersResult.data ?? []);
    setThreads(threadsResult.data ?? []);
    setMembers(membersResult.data ?? []);
    setMessages(messagesResult.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!selectedThread) return;

    const channel = supabase
      .channel(`dm-${selectedThread}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "dm_messages",
          filter: `thread_id=eq.${selectedThread}`,
        },
        (payload) => {
          setMessages((current) => {
            if (current.some((m) => m.id === payload.new.id)) return current;
            return [...current, payload.new as Message];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedThread]);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;

    return users.filter(
      (u) =>
        publicName(u).toLowerCase().includes(q) ||
        (u.email ?? "").toLowerCase().includes(q)
    );
  }, [users, search]);

  const selectUser = async (user: Profile) => {
    if (!me) return;

    const existingMember = members.find((member) => {
      if (member.user_id !== user.id) return false;

      const threadMembers = members.filter(
        (m) => m.thread_id === member.thread_id
      );

      return (
        threadMembers.some((m) => m.user_id === me.id) &&
        threadMembers.length === 2
      );
    });

    if (existingMember) {
      setSelectedThread(existingMember.thread_id);
      setSelectedUser(user);
      return;
    }

    const { data: thread, error } = await supabase
      .from("dm_threads")
      .insert({})
      .select()
      .single();

    if (error || !thread) return;

    const { error: memberError } = await supabase.from("dm_members").insert([
      { thread_id: thread.id, user_id: me.id },
      { thread_id: thread.id, user_id: user.id },
    ]);

    if (memberError) return;

    setThreads((current) => [thread, ...current]);
    setMembers((current) => [
      ...current,
      { thread_id: thread.id, user_id: me.id },
      { thread_id: thread.id, user_id: user.id },
    ]);

    setSelectedThread(thread.id);
    setSelectedUser(user);
  };

  const sendMessage = async () => {
    if (!selectedThread || !text.trim() || !me) return;

    const content = text.trim();
    setText("");

    const { data, error } = await supabase
      .from("dm_messages")
      .insert({
        thread_id: selectedThread,
        sender_id: me.id,
        content,
      })
      .select()
      .single();

    if (!error && data) {
      setMessages((current) =>
        current.some((m) => m.id === data.id) ? current : [...current, data]
      );
    }
  };

  const activeMessages = messages.filter(
    (message) => message.thread_id === selectedThread
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto h-screen flex flex-col">
        <header className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-7 h-7" />
            <div>
              <h1 className="text-2xl font-bold">Direct Messages</h1>
              <p className="text-sm text-slate-500">
                Private conversations with other users
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={load}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <Link
              to="/"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <aside className="w-full sm:w-80 border-r border-slate-800 flex flex-col">
            <div className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Find someone..."
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 py-3 pl-9 pr-3 outline-none"
                />
              </div>
            </div>

            <div className="overflow-y-auto">
              {loading ? (
                <p className="p-5 text-slate-500">Loading...</p>
              ) : (
                filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => selectUser(user)}
                    className="w-full text-left p-4 border-t border-slate-900 hover:bg-slate-900"
                  >
                    <div className="font-medium">{publicName(user)}</div>
                    {user.email && (
                      <div className="text-xs text-slate-500 mt-1">
                        {user.email}
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </aside>

          <section className="hidden sm:flex flex-1 flex-col">
            {!selectedThread ? (
              <div className="flex-1 flex items-center justify-center text-slate-500">
                Select someone to start a conversation.
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-slate-800">
                  <h2 className="font-semibold">
                    {publicName(selectedUser)}
                  </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {activeMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`max-w-[75%] rounded-2xl p-3 ${
                        message.sender_id === me?.id
                          ? "ml-auto bg-blue-600"
                          : "bg-slate-800"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-[10px] opacity-60 mt-1">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-3 border-t border-slate-800 flex gap-2">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendMessage();
                    }}
                    placeholder="Message..."
                    className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    className="rounded-xl bg-blue-600 px-4 hover:bg-blue-500"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
