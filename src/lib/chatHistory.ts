import { supabase } from './supabase';

export interface ChatConversation {
  id: string;
  title: string;
  model: string | null;
  class_level: string | null;
  subject: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string | null;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export async function createConversation(
  userId: string,
  options?: {
    title?: string;
    model?: string;
    classLevel?: string;
    subject?: string;
  }
) {
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      title: options?.title || 'New chat',
      model: options?.model || null,
      class_level: options?.classLevel || null,
      subject: options?.subject || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as ChatConversation;
}

export async function getConversations(userId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data || []) as ChatConversation[];
}

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as ChatMessage[];
}

export async function addMessage(
  conversationId: string,
  role: ChatMessage['role'],
  content: string,
  senderId?: string
) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId || null,
      role,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data as ChatMessage;
}

export async function updateConversation(
  conversationId: string,
  updates: {
    title?: string;
    subject?: string;
    model?: string;
  }
) {
  const { data, error } = await supabase
    .from('conversations')
    .update(updates)
    .eq('id', conversationId)
    .select()
    .single();

  if (error) throw error;
  return data as ChatConversation;
}
