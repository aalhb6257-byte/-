
import React, { useState, useMemo } from 'react';
import { User } from '../types';

interface PromotionsViewProps {
  users: User[];
  onViewUser: (user: User) => void;
}

const PromotionsView: React.FC<PromotionsViewProps> = ({ users, onViewUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const eligibleUsers = useMemo(() => {
    // In a real app, this would check dates and grades
    // For now, we'll simulate eligibility for some users
    return users.filter(u => {
      const matchesSearch = u.fullNameQuad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           u.department?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [users, searchTerm]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-black dark:text-white tracking-tight">إدارة الترقيات</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">متابعة استحقاقات الترقية والترفيع السنوي للموظفين حسب الضوابط القانونية.</p>
        </div>
        <div className="bg-rose-500/10 px-4 py-2 rounded-2xl border border-rose-500/20">
          <span className="text-rose-600 dark:text-rose-400 font-black text-sm">المستحقين حالياً: {Math.floor(eligibleUsers.length * 0.3)}</span>
        </div>
      </div>

      <div className="glass-panel p-6 no-print">
        <div className="relative group">
          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-rose-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input 
            type="text" 
            placeholder="بحث عن موظف مستحق للترقية..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 liquid-input pr-12 pl-6 text-sm font-bold transition-all outline-none"
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden border-none shadow-xl">
        <div className="bg-rose-500/10 backdrop-blur-xl border-b border-white/10 px-10 py-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-400/10 via-transparent to-pink-400/10 animate-pulse"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-600 shadow-inner border border-rose-400/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
            <h3 className="text-sm font-black text-rose-900 dark:text-rose-100">سجل استحقاقات الترقية</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-right min-w-[1000px] border-collapse">
            <thead className="bg-white/5 border-b border-white/10">
              <tr className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">الموظف</th>
                <th className="px-4 py-4 text-center">الدرجة الحالية</th>
                <th className="px-4 py-4 text-center">الدرجة المستحقة</th>
                <th className="px-4 py-4 text-center">تاريخ الاستحقاق</th>
                <th className="px-4 py-4 text-center">الحالة</th>
                <th className="px-4 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {eligibleUsers.length > 0 ? eligibleUsers.map((u, idx) => (
                <tr key={u.id} className="hover:bg-white/5 transition-all">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center font-black text-slate-400 overflow-hidden">
                        {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black text-black dark:text-white leading-tight">{u.fullNameQuad}</p>
                        <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400">{u.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-xs font-bold text-slate-600 dark:text-slate-300">
                    {idx % 3 === 0 ? 'الرابعة' : 'الخامسة'}
                  </td>
                  <td className="px-4 py-4 text-center text-xs font-black text-rose-600 dark:text-rose-400">
                    {idx % 3 === 0 ? 'الثالثة' : 'الرابعة'}
                  </td>
                  <td className="px-4 py-4 text-center text-[10px] font-black text-slate-500">
                    {idx % 2 === 0 ? '2024-06-15' : '2024-09-20'}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black ${
                      idx % 3 === 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                    }`}>
                      {idx % 3 === 0 ? 'مكتمل الشروط' : 'قيد التدقيق'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => onViewUser(u)}
                        className="liquid-btn text-rose-600 px-4 py-1.5 rounded-lg text-[10px] font-black hover:bg-rose-600 hover:text-white transition-all"
                      >
                        إصدار أمر ترقية
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <p className="text-slate-500 font-bold">لا توجد بيانات مطابقة للبحث.</p>
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

export default PromotionsView;
