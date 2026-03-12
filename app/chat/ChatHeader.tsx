"use client";
import React from 'react';
import { ArrowLeft, Pin, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export function ChatHeader({ isAdminTyping, ADMIN_IMAGE_URL }: { isAdminTyping: boolean, ADMIN_IMAGE_URL: string }) {
  
  const whatsappUrl = "https://whatsapp.com/channel/0029Va9Vt96EKyZDUcmikv1F";

  return (
    <>
      <header className="flex-none h-[80px] bg-white border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="bg-slate-100 p-2 rounded-xl text-slate-600">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase text-slate-800 tracking-tight leading-none">
              Aarons Easy Learning
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isAdminTyping ? 'bg-blue-500 animate-bounce' : 'bg-green-500 animate-pulse'}`} /> 
              {/* Pulsing Followers Text */}
              <span className={`text-[9px] font-bold uppercase ${isAdminTyping ? 'text-blue-600' : 'text-slate-500 animate-pulse'}`}>
                {isAdminTyping ? 'Admin is typing...' : '35,000 Followers'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Blinking Follow Button */}
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 shadow-md transition-all active:scale-95 animate-bounce shadow-green-200"
            style={{ animationDuration: '2s' }}
          >
            <MessageCircle size={12} fill="currentColor" />
            Follow
          </a>
          <img 
            src={ADMIN_IMAGE_URL} 
            alt="Admin" 
            className="w-10 h-10 rounded-full border-2 border-blue-600 object-cover shadow-sm" 
          />
        </div>
      </header>

      {/* Pinned Service Message */}
      <div className="flex-none bg-blue-600 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <Pin size={14} className="rotate-45 flex-shrink-0" />
        <p className="text-[10px] font-black uppercase leading-tight">
          Professional Assistance: $30 service fee for ICCR registration.
        </p>
      </div>

      <div className="p-4">
        <div className="flex flex-col items-start">
          <div className="max-w-[85%] p-4 rounded-2xl text-[13px] font-bold bg-white text-slate-800 border-l-4 border-blue-600 shadow-sm leading-relaxed">
            👋 Welcome to Aarons Easy Learning! <br/><br/> 
            I'm here to assist you with the scholarship applications.
          </div>
          <span className="text-[8px] text-slate-400 mt-1 px-1 font-bold uppercase tracking-widest">
            System Message
          </span>
        </div>
      </div>
    </>
  );
}