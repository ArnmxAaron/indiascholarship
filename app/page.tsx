"use client";

import React, { useEffect, useState } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  BookOpen, 
  Music, 
  ShieldCheck, 
  AlertCircle, 
  Bell, 
  MessageCircle, 
  MessageSquare 
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

export default function Home() {
  const whatsappUrl = "https://whatsapp.com/channel/0029Va9Vt96EKyZDUcmikv1F";
  const [unreadCount, setUnreadCount] = useState(0);

  // --- 1. REALTIME UNREAD COUNTER ---
  useEffect(() => {
    // Attempt to get the user ID from localStorage
    const storedId = localStorage.getItem('supporter_id');
    if (!storedId) return;

    const getUnreadCount = async () => {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender_id', storedId)
        .eq('is_admin', true)
        .neq('status', 'read');

      if (!error) setUnreadCount(count || 0);
    };

    getUnreadCount();

    // Listen for new messages while the user is browsing the home page
    const channel = supabase.channel('home_badge_sync')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages', 
          filter: `sender_id=eq.${storedId}` 
        }, 
        (payload) => {
          if (payload.new.is_admin) {
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans relative pb-24">
      {/* --- ANIMATIONS & STYLES --- */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          100% { left: 200%; }
        }
        .animate-marquee-css {
          display: inline-block;
          animation: marquee 25s linear infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
        .group:hover .animate-shimmer {
          animation: shimmer 1s infinite;
        }
      `}</style>
      
      {/* 2. MOVING NEWS HEADER */}
      <div className="bg-blue-600 text-white py-2 overflow-hidden whitespace-nowrap border-b border-blue-700">
        <div className="animate-marquee-css text-[10px] font-black uppercase tracking-widest">
          <span className="mx-4">🚀 2026/2027 Admissions Open!</span>
          <span className="mx-4">Requirements: WASSCE/NECO</span>
          <span className="mx-4">Service Fee: $30</span>
          <span className="mx-4">Fully Funded Scholarships</span>
          <span className="mx-4">🚀 2026/2027 Admissions Open!</span>
          <span className="mx-4">Requirements: WASSCE/NECO</span>
        </div>
      </div>

      {/* 3. NAVIGATION */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="text-xl font-bold text-blue-900 flex items-center gap-2">
          <div className="bg-blue-600 p-1 rounded text-white shadow-lg">
            <GraduationCap size={20} />
          </div>
          <span className="tracking-tighter">INDIA SCHOLAR</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Link 
            href="/track" 
            className="relative bg-blue-950 text-white font-black px-5 py-2.5 rounded-lg text-[10px] uppercase tracking-widest hover:bg-blue-800 transition flex items-center gap-2 border border-blue-400 animate-pulse"
          >
            <Bell size={12} className="text-green-400" />
            CHECK STATUS
          </Link>
          <span className="text-[8px] font-black text-blue-600 animate-bounce uppercase tracking-widest">
            TAP HERE ☝️
          </span>
        </div>
      </nav>

      {/* 4. HERO SECTION */}
      <section className="py-12 px-6 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded text-[10px] font-bold mb-4 uppercase tracking-wider border border-blue-200">
            <ShieldCheck size={14} /> Verified Scholarship Assistance
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
            Study in India. <br/><span className="text-blue-600">Fully Funded.</span>
          </h1>
          <p className="text-base text-slate-600 mb-8 max-w-xl mx-auto font-medium">
            Professional ICCR scholarship processing for Undergraduate, Postgraduate, and PhD programs in top Indian Universities.
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <Link href="/apply" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-[0_10px_30px_rgba(37,99,235,0.4)] hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2 uppercase tracking-widest">
              PROCEED TO APPLY <ArrowRight size={18} />
            </Link>

            <div className="flex flex-col items-center gap-3">
               <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">35,000+ Followers</span>
               </div>
               
               <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-2 bg-green-500 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-green-600 transition-all active:scale-95"
               >
                 <MessageCircle size={14} fill="currentColor" />
                 Follow Channel
               </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CARDS */}
      <section className="py-10 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <Card icon={<BookOpen size={20}/>} title="Undergraduate" desc="BA, BSc, BCom, B.Tech" />
          <Card icon={<GraduationCap size={20}/>} title="PG / PhD" desc="MA, MSc, MBA, Research" />
          <Card icon={<Music size={20}/>} title="Indian Culture" desc="Yoga, Dance, Cuisine" />
        </div>
      </section>

      {/* 6. EXCLUSION ALERT */}
      <section className="bg-red-600 py-8 px-6 text-white text-center rounded-3xl mx-6 shadow-xl">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-4">
          <AlertCircle size={40} className="shrink-0 opacity-80" />
          <p className="text-sm font-bold">
            <strong className="block uppercase underline mb-1">Strict Exclusions:</strong> 
            Medical, Nursing, Fashion, and 5-year Law programs are NOT AVAILABLE via this scheme.
          </p>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-20 text-center text-slate-400 font-bold text-[10px] uppercase tracking-widest">
        © 2026 IndiaScholar Admissions • Professional Processing Service
      </footer>

      {/* --- 8. FLOATING "ALIVE" CHAT BUTTON --- */}
      <div className="fixed bottom-6 right-6 md:right-10 z-50">
        <Link 
          href="/chat" 
          className="group relative flex items-center gap-3 bg-white border-2 border-blue-600 p-2 pr-6 rounded-full shadow-[0_20px_50px_rgba(8,112,184,0.5)] hover:bg-blue-600 transition-all duration-300 active:scale-95 animate-bounce-subtle"
        >
          {/* Icon Container */}
          <div className="relative w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-blue-600 transition-colors">
            <MessageSquare size={24} className="group-hover:rotate-[360deg] transition-transform duration-700" />
            
            {/* Notification Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-red-600 border-2 border-white items-center justify-center text-[10px] font-black text-white">
                  {unreadCount}
                </span>
              </span>
            )}
          </div>

          {/* Labels */}
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter group-hover:text-white leading-none">
              Questions?
            </span>
            <span className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-white">
              Chat With Admin
            </span>
          </div>

          {/* Shimmer Overlay */}
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] group-hover:animate-shimmer" />
          </div>
        </Link>
      </div>
    </main>
  );
}

function Card({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-black text-slate-800 mb-1 uppercase tracking-tight">{title}</h3>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">{desc}</p>
    </div>
  );
}