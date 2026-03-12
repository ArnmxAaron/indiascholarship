"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TrackStatus() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('student_status').select('*').order('id', { ascending: false }).then(({ data }) => {
      setData(data || []);
    });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header & Back Button */}
        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 font-bold text-[10px] uppercase gap-1">
          <ArrowLeft size={12} /> Back to Home
        </Link>

        <div className="flex justify-between items-end mb-6">
          <h1 className="text-xl font-black text-blue-900 uppercase tracking-tighter flex items-center gap-2">
            <ShieldCheck className="text-blue-600" size={20} /> Status Tracker
          </h1>
          <div className="text-right">
            <p className="text-[9px] font-bold text-slate-400 uppercase">Total Students Processed</p>
            {/* Displaying the length of the data array */}
            <p className="text-lg font-black text-blue-600">{data.length}</p>
          </div>
        </div>

        {/* Text Intro */}
        <p className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-widest border-l-2 border-blue-600 pl-3">
          Candidates we have applied for from (Expert: Aarons Easy Learning)
        </p>

        {/* Status Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
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
                    {row.country_code && <img src={`https://flagcdn.com/24x18/${row.country_code.toLowerCase()}.png`} alt="flag" className="rounded-sm w-4 h-3" />}
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
    </main>
  );
}