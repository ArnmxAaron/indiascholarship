"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, GraduationCap, CheckCircle, ShieldCheck, Plane, BookOpen, Home, Wallet } from 'lucide-react';

export default function ApplyPage() {
  const [readyToPay, setReadyToPay] = useState(false);

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

      {/* 2. NEWS HEADER */}
      <div className="bg-blue-600 text-white py-2 overflow-hidden whitespace-nowrap border-b border-blue-700">
        <div className="animate-marquee-css">
          <span className="mx-4 font-bold uppercase tracking-wider text-xs">🚀 ADMISSIONS OPEN 2026/2027 | $30 SERVICE FEE | FULLY FUNDED SCHOLARSHIPS</span>
        </div>
      </div>

      {/* 3. NAVIGATION */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="text-xl font-bold text-blue-900 flex items-center gap-2">
          <div className="bg-blue-600 p-1 rounded text-white"><GraduationCap size={20} /></div>
          <span>INDIA SCHOLAR</span>
        </div>
        <Link href="/" className="text-sm font-bold text-blue-900 hover:text-blue-600 flex items-center gap-2">
          <ArrowLeft size={16} /> BACK HOME
        </Link>
      </nav>

      {/* 4. CONTENT AREA */}
      <section className="max-w-3xl mx-auto p-6 pb-20">
        <h1 className="text-3xl font-black mb-8 tracking-tighter">Application Requirements</h1>
        
        <div className="space-y-8 text-sm text-slate-700">
          
          {/* SCHOLARSHIP BENEFITS */}
          <section className="bg-blue-900 text-white p-8 rounded-3xl shadow-xl">
            <h2 className="font-black text-xl mb-6 flex items-center gap-2 uppercase tracking-tight">
              <Wallet className="text-blue-400" /> Scholarship Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3 items-start">
                <CheckCircle className="text-blue-400 shrink-0" size={18} />
                <p><span className="font-bold block text-blue-200 uppercase text-[10px]">100% Tuition</span> Government of India pays your full fees.</p>
              </div>
              <div className="flex gap-3 items-start">
                <Wallet className="text-blue-400 shrink-0" size={18} />
                <p><span className="font-bold block text-blue-200 uppercase text-[10px]">Living Allowance</span> Cash allowance for personal expenses.</p>
              </div>
              <div className="flex gap-3 items-start">
                <Home className="text-blue-400 shrink-0" size={18} />
                <p><span className="font-bold block text-blue-200 uppercase text-[10px]">Accommodation</span> On-campus housing or rent allowance.</p>
              </div>
              <div className="flex gap-3 items-start">
                <BookOpen className="text-blue-400 shrink-0" size={18} />
                <p><span className="font-bold block text-blue-200 uppercase text-[10px]">Study Materials</span> Annual allowance for books.</p>
              </div>
              <div className="flex gap-3 items-start">
                <Plane className="text-blue-400 shrink-0" size={18} />
                <p><span className="font-bold block text-blue-200 uppercase text-[10px]">Travel</span> Airfare included for most regional schemes.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-lg text-blue-900 uppercase">1. Eligible Disciplines</h2>
            <p className="mt-2 leading-relaxed">UG, PG, PhD in Engineering, Science, Business, Humanities, Agriculture, and Indian Culture.</p>
          </section>

          <section className="bg-red-50 p-6 rounded-2xl border-l-4 border-red-500">
            <h2 className="font-bold text-red-700 mb-2 uppercase text-xs tracking-widest">2. EXCLUDED (Do Not Apply)</h2>
            <p className="font-medium text-red-900">Medical, Pharmacy, Nursing, Physiotherapy, Fashion, Law (5-year), and all 5-year integrated courses.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg text-blue-900 uppercase">3. Mandatory Documents</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {[
                "Passport (2+ years valid)",
                "Birth Certificate",
                "WAEC/NECO/High School Cert",
                "Academic Transcripts",
                "Medical Fitness Certificate",
                "Passport Photo (White BG)",
                "500-word English Statement"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 bg-white p-3 rounded-lg border border-slate-200 font-bold text-[11px] uppercase">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> {item}
                </li>
              ))}
            </ul>
          </section>

          {/* WHY PAY SECTION */}
          <section className="bg-slate-100 p-8 rounded-3xl border border-slate-200">
            <h2 className="font-black text-lg text-slate-800 mb-6 uppercase tracking-tighter flex items-center gap-2">
              <ShieldCheck className="text-blue-600" /> Why pay the $30 service fee?
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="font-black text-blue-600 text-xl">01</div>
                <p className="font-bold text-xs uppercase tracking-tight">Document Audit: We professionally review your documents for errors before submission.</p>
              </div>
              <div className="flex gap-4">
                <div className="font-black text-blue-600 text-xl">02</div>
                <p className="font-bold text-xs uppercase tracking-tight">Essay Assistance: Professional guidance for your 500-word proficiency statement.</p>
              </div>
              <div className="flex gap-4">
                <div className="font-black text-blue-600 text-xl">03</div>
                <p className="font-bold text-xs uppercase tracking-tight">Strategic Selection: Choosing the top 5 universities most likely to accept you.</p>
              </div>
              <div className="flex gap-4">
                <div className="font-black text-blue-600 text-xl">04</div>
                <p className="font-bold text-xs uppercase tracking-tight">Portal Guidance: Direct, step-by-step assistance through the official portal.</p>
              </div>
            </div>
          </section>
        </div>

        {/* 5. PAYMENT SECTION */}
        <div className="mt-12 p-8 bg-white rounded-2xl border shadow-lg text-center ring-4 ring-blue-50">
          <h3 className="font-black text-xl mb-6 uppercase tracking-tighter text-blue-900">Are you ready to pay the $30?</h3>
          {!readyToPay ? (
            <button 
              onClick={() => setReadyToPay(true)}
              className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all w-full shadow-xl shadow-blue-200 active:scale-95"
            >
              YES, I AM READY
            </button>
          ) : (
            <Link 
              href="/chat" 
              className="inline-flex items-center justify-center gap-3 bg-green-600 text-white px-10 py-5 rounded-2xl font-black text-lg w-full hover:bg-green-700 transition-all shadow-xl shadow-green-200 animate-bounce"
            >
              <MessageCircle /> CHAT WITH EXPERT
            </Link>
          )}
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Payment Processing via Expert Support</p>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="py-12 text-center text-slate-400 font-bold text-[10px] uppercase tracking-widest border-t mt-10">
        © 2026 IndiaScholar Admissions • Professional Processing Service
      </footer>
    </main>
  );
}