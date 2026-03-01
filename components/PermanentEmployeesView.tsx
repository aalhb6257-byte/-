
import React, { useState } from 'react';
import { User } from '../types';

interface PermanentEmployeesViewProps {
  users: User[];
  onViewUser: (user: User) => void;
}

const PermanentEmployeesView: React.FC<PermanentEmployeesViewProps> = ({ users, onViewUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users who have a permanent appointment date and are NOT seconded
  const permanentUsers = users.filter(u => {
    const isSeconded = u.notes?.includes('تنسيب');
    const isPermanent = u.appointmentDatePermanent && u.appointmentDatePermanent.trim() !== '';
    const matchesSearch = u.fullNameQuad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return isPermanent && !isSeconded && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-black dark:text-white tracking-tight">موظفي الملاك الدائم</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">عرض وإدارة سجلات الموظفين المثبتين على الملاك الدائم.</p>
        </div>
        <div className="bg-cyan-500/10 px-4 py-2 rounded-2xl border border-cyan-500/20">
          <span className="text-cyan-600 dark:text-cyan-400 font-black text-sm">إجمالي الملاك: {permanentUsers.length}</span>
        </div>
      </div>

      <div className="glass-panel p-6 no-print">
        <div className="relative group">
          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input 
            type="text" 
            placeholder="بحث عن موظف ملاك بالاسم الكامل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 liquid-input pr-12 pl-6 text-sm font-bold transition-all outline-none"
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden border-none shadow-xl">
        <div className="bg-cyan-500/10 backdrop-blur-xl border-b border-white/10 px-10 py-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-transparent to-blue-400/10 animate-pulse"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 shadow-inner border border-cyan-400/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h3 className="text-sm font-black text-cyan-900 dark:text-cyan-100">سجل الملاك الدائم الرسمي</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-right min-w-[1000px] border-collapse">
            <thead className="bg-white/5 border-b border-white/10">
              <tr className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">الموظف</th>
                <th className="px-4 py-4 text-center">تاريخ التثبيت</th>
                <th className="px-4 py-4 text-center">القسم</th>
                <th className="px-4 py-4 text-center">العنوان الوظيفي</th>
                <th className="px-4 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {permanentUsers.length > 0 ? permanentUsers.map(u => (
                <tr key={u.id} className="hover:bg-white/5 transition-all">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center font-black text-slate-400 overflow-hidden">
                        {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black text-black dark:text-white leading-tight">{u.fullNameQuad}</p>
                        <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400">{u.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-xs font-black text-emerald-600 dark:text-emerald-400">
                    {u.appointmentDatePermanent}
                  </td>
                  <td className="px-4 py-4 text-center text-[10px] font-black text-slate-500 uppercase">
                    {u.department}
                  </td>
                  <td className="px-4 py-4 text-center text-[10px] font-black text-slate-500 uppercase">
                    {u.role}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => onViewUser(u)}
                        className="liquid-btn text-indigo-500 px-4 py-1.5 rounded-lg text-[10px] font-black hover:bg-indigo-500 hover:text-white transition-all"
                      >
                        عرض الملف
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <p className="text-slate-500 font-bold">لا يوجد موظفين مثبتين على الملاك الدائم حالياً.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PermanentEmployeesView;
