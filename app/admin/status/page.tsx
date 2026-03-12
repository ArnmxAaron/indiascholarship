"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trash2 } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function StatusPage() {
  const [data, setData] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [form, setForm] = useState({ username: '', amount: '', country_id: '', status: 'In Progress' });

  const fetchData = async () => {
    const { data: fetchedData } = await supabase.from('student_status').select('*').order('id', { ascending: false });
    if (fetchedData) setData(fetchedData);
  };

  useEffect(() => {
    supabase.from('country_registry').select('*').then(({ data: c }) => setCountries(c || []));
    fetchData();
  }, []);

  const addEntry = async () => {
    const selected = countries.find(c => c.id == form.country_id);
    if (!selected || !form.username) return alert("Please select a country and enter a name");

    const { error } = await supabase.from('student_status').insert([{
      username: form.username,
      amount_paid: form.amount,
      currency: selected.currency,
      country_name: selected.country_name,
      country_code: selected.country_code,
      status: 'In Progress'
    }]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      setForm({ username: '', amount: '', country_id: '', status: 'In Progress' });
      fetchData();
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    await supabase.from('student_status').update({ status: newStatus }).eq('id', id);
    fetchData();
  };

  const deleteEntry = async (id: number) => {
    await supabase.from('student_status').delete().eq('id', id);
    fetchData();
  };

  const getStatusColor = (status: string) => {
    return status === 'Application Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* 1. REGISTRATION FORM */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <input placeholder="Username" className="border p-3 rounded-lg text-xs font-bold" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
        <input placeholder="Amount" className="border p-3 rounded-lg text-xs font-bold" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
        <select className="border p-3 rounded-lg text-xs font-bold" value={form.country_id} onChange={e => setForm({...form, country_id: e.target.value})}>
          <option value="">Select Country</option>
          {countries.map(c => <option key={c.id} value={c.id}>{c.country_name}</option>)}
        </select>
        <button onClick={addEntry} className="bg-black text-white p-3 rounded-lg font-black uppercase text-[10px]">Register Student</button>
      </div>

      {/* 2. DATA TABLE */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[9px] uppercase text-slate-400 font-black">
              <th className="p-4">Flag</th><th className="p-4">Student</th><th className="p-4">Paid</th><th className="p-4">Status</th><th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b text-[11px] font-bold">
                <td className="p-4">
                  {row.country_code && <img src={`https://flagcdn.com/24x18/${row.country_code.toLowerCase()}.png`} alt="flag" />}
                </td>
                <td className="p-4">{row.username}</td>
                <td className="p-4">{row.amount_paid} {row.currency}</td>
                <td className="p-4">
                  <select 
                    value={row.status} 
                    onChange={(e) => updateStatus(row.id, e.target.value)}
                    className={`p-2 rounded text-[10px] font-black border-0 cursor-pointer ${getStatusColor(row.status)}`}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Application Completed">Application Completed</option>
                  </select>
                </td>
                <td className="p-4">
                  <button onClick={() => deleteEntry(row.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}