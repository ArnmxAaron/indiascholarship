"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { ChatHeader } from './ChatHeader';
import { Send, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function ChatContent() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const [userId, setUserId] = useState<string>(""); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => { 
    scrollRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages, isAdminTyping]);

  // 1. Identity Setup
  useEffect(() => {
    const storedId = localStorage.getItem('supporter_id') || 
                     searchParams.get('id') || 
                     Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('supporter_id', storedId);
    setUserId(storedId);
  }, [searchParams]);

  // 2. Data Fetching & Realtime Listeners
  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('sender_id', userId)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);

    const msgChannel = supabase.channel(`user_messages_${userId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `sender_id=eq.${userId}` 
      }, (payload) => {
        setMessages((prev) => {
          const exists = prev.some(m => m.id === payload.new.id);
          if (exists) return prev;
          return [...prev, payload.new];
        });
        if (payload.new.is_admin) setIsAdminTyping(false);
      })
      .subscribe();

    const typingChannel = supabase.channel('global_typing')
      .on('broadcast', { event: 'typing' }, ({ payload }) => { 
        if (payload.targetUserId === userId) { 
          setIsAdminTyping(payload.typing); 
        } 
      })
      .subscribe();

    return () => { 
      clearInterval(interval);
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(typingChannel);
    };
  }, [userId]);

  // 3. Send Message
  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const currentText = input;
    const optimisticMsg = { 
      id: Math.random(), 
      sender_id: userId, 
      text: currentText, 
      is_admin: false, 
      status: 'unread', 
      created_at: new Date().toISOString() 
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInput("");

    await supabase.from('messages').insert([{ 
      sender_id: userId, 
      text: currentText, 
      is_admin: false, 
      status: 'unread' 
    }]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    
    const fileName = `${Date.now()}_${file.name}`;
    const { error: storageError } = await supabase.storage.from('ad').upload(fileName, file);
    
    if (!storageError) {
      const { data } = supabase.storage.from('ad').getPublicUrl(fileName);
      await supabase.from('messages').insert([{ 
        sender_id: userId, 
        text: data.publicUrl, 
        is_admin: false,
        status: 'unread' 
      }]);
    }
    setUploading(false);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-2xl mx-auto bg-[#F8FAFC] overflow-hidden">
      <ChatHeader 
        isAdminTyping={isAdminTyping} 
        ADMIN_IMAGE_URL="https://aosqoqbsnrxcvbzaiwuu.supabase.co/storage/v1/object/public/ad/IMG_9718.JPG" 
      />
      
      <main className="flex-1 overflow-y-auto p-4 space-y-4 overflow-x-hidden">
        {messages.map((msg, i) => (
          <div key={msg.id || i} className={`flex flex-col ${msg.is_admin ? 'items-start' : 'items-end'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] font-bold break-words whitespace-pre-wrap ${msg.is_admin ? 'bg-white text-slate-800 shadow-sm' : 'bg-blue-600 text-white'}`}>
              {/\.(jpeg|jpg|png|svg|webp|gif)$/i.test(msg.text) ? (
                <img src={msg.text} className="rounded-lg w-full" alt="upload" />
              ) : (
                msg.text
              )}
            </div>
            <div className="flex items-center gap-1 mt-1 px-1">
              <span className="text-[8px] text-slate-400 font-bold uppercase">
                {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
              </span>
              {!msg.is_admin && <span className="text-[10px] text-blue-500 font-bold">✓✓</span>}
            </div>
          </div>
        ))}

        {isAdminTyping && (
          <div className="text-[10px] text-blue-600 animate-pulse font-black px-2 mb-2 uppercase tracking-tight">
            Admin is typing...
          </div>
        )}
        
        <div ref={scrollRef} />
      </main>

      <footer className="flex-none bg-white p-4 border-t">
        <div className="flex gap-2 items-end">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            
            <textarea 
              value={input} 
              rows={1}
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type a message..." 
              className="flex-1 bg-slate-100 rounded-2xl py-3 px-5 text-sm font-bold outline-none border-2 border-transparent focus:border-blue-600 resize-none max-h-32 overflow-y-auto custom-scrollbar" 
            />

            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              className="text-slate-500 hover:text-blue-600 transition mb-2"
            >
              {uploading ? <Loader2 className="animate-spin" size={22} /> : <ImageIcon size={22} />}
            </button>

            <button 
              onClick={() => sendMessage()}
              disabled={!input.trim()}
              className="bg-black text-white p-3 rounded-2xl hover:bg-blue-600 transition mb-1 disabled:opacity-20"
            >
              <Send size={20} />
            </button>
         </div>
      </footer>
    </div>
  );
}