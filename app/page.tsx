"use client";

import React from 'react';
import { GraduationCap, ArrowRight, BookOpen, Music, ShieldCheck, AlertCircle, Bell, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const whatsappUrl = "https://whatsapp.com/channel/0029Va9Vt96EKyZDUcmikv1F";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* 1. ANIMATION STYLE */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-css {
          display: inline-block;
          animation: marquee 25s linear infinite;
        }
      `}</style>
      
      {/* 2. MOVING NEWS HEADER */}
      <div className="bg-blue-600 text-white py-2 overflow-hidden whitespace-nowrap border-b border-blue-700">
        <div className="animate-marquee-css">
          <span className="mx-4 font-bold uppercase tracking-wider text-[10px]">
            🚀 2026/2027 Admissions Open! | Requirements: WASSCE/NECO | Service Fee: $30 | Fully Funded
          </span>
          <span className="mx-4 font-bold uppercase tracking-wider text-[10px]">
            🚀 2026/2027 Admissions Open! | Requirements: WASSCE/NECO | Service Fee: $30 | Fully Funded
          </span>
        </div>
      </div>

      {/* 3. NAVIGATION */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="text-xl font-bold text-blue-900 flex items-center gap-2">
          <div className="bg-blue-600 p-1 rounded text-white">
            <GraduationCap size={20} />
          </div>
          <span>INDIA SCHOLAR</span>
        </div>

        {/* Pulsing Status Button + Guidance */}
        <div className="flex flex-col items-center gap-1">
          <Link 
            href="/track" 
            className="relative bg-blue-950 text-white font-black px-5 py-2.5 rounded-lg text-[10px] uppercase tracking-widest hover:bg-blue-800 transition flex items-center gap-2 border border-blue-400 animate-pulse"
          >
            <Bell size={12} className="text-green-400" />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
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
          <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded text-[10px] font-bold mb-4 uppercase tracking-wider">
            <ShieldCheck size={14} /> Verified Scholarship Assistance
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Study in India. <span className="text-blue-600">Fully Funded.</span>
          </h1>
          <p className="text-base text-slate-600 mb-8 max-w-xl mx-auto">
            Professional ICCR scholarship processing for Undergraduate, Postgraduate, and PhD programs.
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <Link href="/apply" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-sm shadow-lg hover:bg-blue-700 transition inline-flex items-center gap-2">
              PROCEED TO APPLY <ArrowRight size={16} />
            </Link>

            {/* NEW FOLLOW SECTION */}
            <div className="flex flex-col items-center gap-2">
               <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">35,000+ Followers</span>
               </div>
               
               <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-green-600 transition-all animate-pulse active:scale-95"
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
      <section className="bg-red-600 py-8 px-6 text-white text-center">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-4">
          <AlertCircle size={40} className="shrink-0 opacity-80" />
          <p className="text-sm font-medium">
            <strong className="block uppercase underline">Strict Exclusions:</strong> 
            Medical, Nursing, Fashion, and 5-year Law programs are NOT AVAILABLE.
          </p>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-8 text-center text-slate-400 font-bold text-[10px] uppercase tracking-widest border-t">
        © 2026 IndiaScholar Admissions • Professional Processing Service
      </footer>
    </main>
  );
}

function Card({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition">
      <div className="text-blue-600 mb-3">{icon}</div>
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-slate-500 text-xs font-semibold">{desc}</p>
    </div>
  );
}