"use client";
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/utils/supabase';
import { Send, User, MessageSquare, Loader2, LogOut, RefreshCw, Circle } from 'lucide-react';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState("");
  const [activeTab, setActiveTab] = useState<'unread' | 'read'>('unread');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- 1. THE "SAFETY" REFRESH (Every 4 Seconds) ---
  useEffect(() => {
    if (!isLoggedIn) return;
    const interval = setInterval(() => {
      fetchConversations(false);
      if (selectedUser) refreshMessages(selectedUser);
    }, 4000); 
    return () => clearInterval(interval);
  }, [isLoggedIn, selectedUser]);

  // --- 2. REALTIME LISTENER ---
  useEffect(() => {
    if (!isLoggedIn) return;

    const channel = supabase.channel('admin-main-view')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' }, 
        (payload) => {
          fetchConversations(false);
          if (selectedUser && payload.new.sender_id === selectedUser) {
            setMessages(prev => [...prev, payload.new]);
            // Auto-mark as read if we are currently looking at the chat
            markAsRead(selectedUser);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isLoggedIn, selectedUser]);

  // --- 3. TYPING BROADCAST ---
  const handleTyping = (isTyping: boolean) => {
    if (!selectedUser) return;
    supabase.channel('global_typing').send({
      type: 'broadcast',
      event: 'typing',
      payload: { targetUserId: selectedUser, typing: isTyping },
    });
  };

  const markAsRead = async (uid: string) => {
    await supabase.from('messages')
      .update({ status: 'read' })
      .eq('sender_id', uid)
      .eq('is_admin', false);
  };

  // --- DATA FETCHING (Fixed Unread Logic) ---
  const fetchConversations = async (showLoading = true) => {
    if (showLoading) setIsRefreshing(true);
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    
    if (data) {
      const userMap = new Map();
      data.forEach(msg => {
        if (!userMap.has(msg.sender_id)) {
          // A conversation is UNREAD if the latest message is NOT from admin AND status is NOT 'read'
          const isActuallyUnread = !msg.is_admin && msg.status !== 'read';
          
          userMap.set(msg.sender_id, {
            id: msg.sender_id,
            lastMsg: msg,
            isUnread: isActuallyUnread 
          });
        }
      });
      setConversations(Array.from(userMap.values()));
    }
    if (showLoading) setIsRefreshing(false);
  };

  const refreshMessages = async (uid: string) => {
    const { data } = await supabase.from('messages').select('*').eq('sender_id', uid).order('created_at', { ascending: true });
    if (data && data.length !== messages.length) {
      setMessages(data);
    }
  };

  useEffect(() => {
    if (selectedUser && isLoggedIn) {
      refreshMessages(selectedUser);
      markAsRead(selectedUser).then(() => fetchConversations(false));
    }
  }, [selectedUser, isLoggedIn]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else setIsLoggedIn(true);
    setLoading(false);
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selectedUser) return;

    const msgText = reply;
    setReply("");
    handleTyping(false);

    const { error } = await supabase.from('messages').insert([{ 
      sender_id: selectedUser, 
      text: msgText, 
      is_admin: true, 
      status: 'read' 
    }]);

    if (!error) {
      refreshMessages(selectedUser);
      fetchConversations(false);
    }
  };

  if (!isLoggedIn) return (
    <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border">
        <h1 className="text-2xl font-black text-slate-800 text-center mb-8 uppercase tracking-widest">Admin Login</h1>
        <input type="email" placeholder="EMAIL" className="w-full p-4 bg-slate-50 border-2 rounded-2xl mb-4 font-bold outline-none" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="PASSWORD" className="w-full p-4 bg-slate-50 border-2 rounded-2xl mb-8 font-bold outline-none" onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-black text-white py-4 rounded-2xl font-black hover:bg-blue-600 transition-all uppercase">Login</button>
      </form>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F1F5F9] font-sans text-slate-900 overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-[360px] border-r bg-white flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black uppercase text-slate-800">Inbox</h2>
              {isRefreshing && <RefreshCw size={14} className="text-blue-600 animate-spin" />}
            </div>
            <button onClick={() => { supabase.auth.signOut(); setIsLoggedIn(false); }} className="text-slate-300 hover:text-red-500 transition-all"><LogOut size={20}/></button>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button onClick={() => setActiveTab('unread')} className={`flex-1 py-2.5 text-[11px] font-black uppercase rounded-xl transition-all ${activeTab === 'unread' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'}`}>Unread</button>
            <button onClick={() => setActiveTab('read')} className={`flex-1 py-2.5 text-[11px] font-black uppercase rounded-xl transition-all ${activeTab === 'read' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'}`}>All Chats</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.filter(c => activeTab === 'unread' ? c.isUnread : true).map((conv) => (
            <div key={conv.id} onClick={() => setSelectedUser(conv.id)} className={`group p-5 border-b cursor-pointer transition-all relative ${selectedUser === conv.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
              {selectedUser === conv.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />}
              <div className="flex justify-between items-start mb-1">
                <span className="font-black text-[13px] text-slate-800 tracking-tight">USER #{conv.id}</span>
                {conv.isUnread && <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />}
              </div>
              <p className={`text-xs truncate ${conv.isUnread ? 'font-black text-slate-900' : 'text-slate-400 font-medium'}`}>{conv.lastMsg.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT VIEW */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <header className="h-[80px] bg-white border-b flex items-center px-10 justify-between shadow-sm z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600"><User size={20} /></div>
                <div>
                  <h3 className="font-black text-slate-800 text-sm leading-tight uppercase">Support Session</h3>
                  <p className="text-[10px] font-bold text-slate-400">ID: {selectedUser}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
                <Circle size={8} className="fill-green-500 text-green-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase text-green-600">Live</span>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-10 space-y-6">
              {messages.map((msg, i) => (
                <div key={msg.id || i} className={`flex ${msg.is_admin ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-4 rounded-2xl text-[14px] font-bold shadow-sm ${msg.is_admin ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </main>

            <footer className="p-8 bg-white border-t">
              <form onSubmit={sendReply} className="flex gap-4 max-w-5xl mx-auto">
                <input 
                  value={reply} 
                  onChange={(e) => setReply(e.target.value)}
                  onFocus={() => handleTyping(true)}
                  onBlur={() => handleTyping(false)}
                  placeholder="WRITE YOUR MESSAGE..." 
                  className="flex-1 bg-slate-50 rounded-2xl px-6 py-5 outline-none font-bold text-sm border-2 border-transparent focus:border-blue-600 transition-all" 
                />
                <button type="submit" disabled={!reply.trim()} className="bg-black text-white px-10 rounded-2xl font-black hover:bg-blue-600 transition-all flex items-center gap-3 disabled:opacity-30">
                  <Send size={18} /> SEND
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50">
            <MessageSquare size={40} className="text-slate-200 mb-4" />
            <p className="font-black uppercase tracking-widest text-[11px] text-slate-400">Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}