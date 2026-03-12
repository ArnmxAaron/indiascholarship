"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, GraduationCap } from 'lucide-react';

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
          <span className="mx-4 font-bold uppercase tracking-wider text-xs">🚀 ADMISSIONS OPEN 2026/2027 | $30 SERVICE FEE | FULLY FUNDED</span>
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
      <section className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-black mb-8">Application Requirements</h1>
        
        <div className="space-y-6 text-sm text-slate-700">
          <section>
            <h2 className="font-bold text-lg text-blue-900">1. Eligible Disciplines</h2>
            <p>UG, PG, PhD in Engineering, Science, Business, Humanities, Agriculture, and Indian Culture.</p>
          </section>

          <section className="bg-red-50 p-6 rounded-2xl border-l-4 border-red-500">
            <h2 className="font-bold text-red-700 mb-2">2. EXCLUDED (Do Not Apply)</h2>
            <p>Medical, Pharmacy, Nursing, Physiotherapy, Fashion, Law (5-year), and all 5-year integrated courses.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg text-blue-900">3. Mandatory Documents</h2>
            <ul className="list-disc ml-5 space-y-2 mt-2">
              <li>Valid Passport (2+ years) & Birth Certificate.</li>
              <li>All Academic Transcripts (English translations only).</li>
              <li>500-word Essay & Physical Fitness Certificate.</li>
              <li>Engineering/IT requires Physics, Chem, Math (PCM).</li>
            </ul>
          </section>
        </div>

        {/* 5. PAYMENT SECTION */}
        <div className="mt-12 p-8 bg-white rounded-2xl border shadow-sm text-center">
          <h3 className="font-black text-xl mb-6">ARE YOU READY TO PAY THE $30?</h3>
          {!readyToPay ? (
            <button 
              onClick={() => setReadyToPay(true)}
              className="bg-blue-600 text-white px-10 py-4 rounded-xl font-black hover:bg-blue-700 transition w-full"
            >
              YES, I AM READY
            </button>
          ) : (
            <Link 
              href="/chat" 
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-10 py-4 rounded-xl font-black w-full hover:bg-green-700 transition"
            >
              <MessageCircle /> CHAT WITH EXPERT
            </Link>
          )}
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="py-12 text-center text-slate-400 font-bold text-[10px] uppercase tracking-widest border-t mt-10">
        © 2026 IndiaScholar Admissions • Professional Processing Service
      </footer>
    </main>
  );
}