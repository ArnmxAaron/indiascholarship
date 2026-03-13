"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ShieldCheck, ArrowLeft, MessageSquare, GraduationCap } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TrackStatus() {
  const [data, setData] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    supabase.from('student_status').select('*').order('id', { ascending: false }).then(({ data }) => {
      setData(data || []);
    });
  }, []);

  useEffect(() => {
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

    const channel = supabase.channel('status_badge_sync')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `sender_id=eq.${storedId}` }, 
        (payload) => { if (payload.new.is_admin) setUnreadCount(prev => prev + 1); }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 relative pb-32">
      <style jsx global>{`
        @keyframes bounce-call {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(1.05); }
        }
        @keyframes shimmer {
          100% { left: 200%; }
        }
        .animate-bounce-call {
          animation: bounce-call 2.5s ease-in-out infinite;
        }
        .group:hover .animate-shimmer {
          animation: shimmer 1s infinite;
        }
      `}</style>

      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 font-bold text-[10px] uppercase gap-1">
          <ArrowLeft size={12} /> Back to Home
        </Link>

        {/* HEADER SECTION */}
        <div className="flex justify-between items-end mb-6">
          <h1 className="text-xl font-black text-blue-900 uppercase tracking-tighter flex items-center gap-2">
            <ShieldCheck className="text-blue-600" size={20} /> Status Tracker
          </h1>
          <div className="text-right">
            <p className="text-[9px] font-bold text-slate-400 uppercase">Total Students</p>
            <p className="text-lg font-black text-blue-600">{data.length}</p>
          </div>
        </div>

        {/* NEW NOTIFICATION BOX */}
        <div className="mb-8 p-5 bg-white border-2 border-blue-100 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <GraduationCap size={20} />
            </div>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight leading-tight">
              Students who have already applied for the <br />
              <span className="text-blue-900">India scholarship application</span>
            </p>
          </div>
          <Link 
            href="/apply" 
            className="w-full md:w-auto text-center bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            See scholarship requirements
          </Link>
        </div>

        {/* STATUS TABLE */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-12">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr className="text-[9px] font-black text-slate-400 uppercase">
                <th className="p-4">Student</th>
                <th className="p-4">Amt Paid</th>
                <th className="p-4">Application Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b last:border-0 text-[10px] font-bold">
                  <td className="p-4 flex items-center gap-2">
                    {row.country_code && (
                      <img 
                        src={`https://flagcdn.com/24x18/${row.country_code.toLowerCase()}.png`} 
                        alt="flag" 
                        className="rounded-sm w-4 h-3" 
                      />
                    )}
                    {row.username}
                  </td>
                  <td className="p-4 text-blue-600">{row.amount_paid} {row.currency}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full uppercase font-black ${
                      row.status === 'Application Completed' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700 animate-pulse'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ENHANCED ATTENTION-GRABBING CHAT BUTTON --- */}
      <div className="fixed bottom-8 right-6 md:right-12 z-50">
        <Link 
          href="/chat" 
          className="group relative flex items-center gap-4 bg-blue-950 p-2 pr-8 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.4)] border-2 border-blue-400/30 hover:scale-105 transition-all duration-300 animate-bounce-call"
        >
          <div className="relative w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white ring-4 ring-yellow-400/20 group-hover:ring-yellow-400/50 transition-all">
            <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-7 w-7">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-7 w-7 bg-red-600 border-2 border-white items-center justify-center text-[12px] font-black text-white">
                  {unreadCount}
                </span>
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-black text-yellow-400 uppercase tracking-widest leading-none mb-1">
              Need Help?
            </span>
            <span className="text-sm font-black text-white uppercase tracking-tight">
              Talk to Expert
            </span>
          </div>

          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
            <div 
              className="absolute top-0 -left-[100%] w-2/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] animate-shimmer" 
              style={{ animationDuration: '2s', animationIterationCount: 'infinite' }} 
            />
          </div>
        </Link>
      </div>
    </main>
  );
}