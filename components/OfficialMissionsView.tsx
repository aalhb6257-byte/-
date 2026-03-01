
import React, { useState } from 'react';
import { User } from '../types';

interface OfficialMissionsViewProps {
  users: User[];
  onViewUser: (user: User) => void;
}

const OfficialMissionsView: React.FC<OfficialMissionsViewProps> = ({ users, onViewUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const missions = [
    { id: 1, userId: users[0]?.id, destination: 'بغداد - مقر الوزارة', startDate: '2024-03-01', endDate: '2024-03-05', status: 'مكتمل', purpose: 'حضور ورشة عمل تطويرية' },
    { id: 2, userId: users[1]?.id, destination: 'البصرة - فرع الجنوب', startDate: '2024-03-10', endDate: '2024-03-15', status: 'قيد التنفيذ', purpose: 'تدقيق مالي سنوي' },
    { id: 3, userId: users[2]?.id, destination: 'أربيل - مؤتمر التكنولوجيا', startDate: '2024-04-01', endDate: '2024-04-03', status: 'مخطط', purpose: 'تمثيل الدائرة في المؤتمر الدولي' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-black dark:text-white tracking-tight">إدارة الإيفادات</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">توثيق ومتابعة المهمات الرسمية والإيفادات الداخلية والخارجية.</p>
        </div>
        <button className="liquid-btn-primary px-6 py-3 text-white text-xs font-black flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
          إضافة إيفاد جديد
        </button>
      </div>

      <div className="glass-panel overflow-hidden border-none shadow-xl">
        <div className="bg-emerald-500/10 backdrop-blur-xl border-b border-white/10 px-10 py-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-transparent to-teal-400/10 animate-pulse"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner border border-emerald-400/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="text-sm font-black text-emerald-900 dark:text-emerald-100">سجل الإيفادات الرسمي</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-right min-w-[1000px] border-collapse">
            <thead className="bg-white/5 border-b border-white/10">
              <tr className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">الموظف</th>
                <th className="px-4 py-4 text-center">الوجهة</th>
                <th className="px-4 py-4 text-center">الفترة</th>
                <th className="px-4 py-4 text-center">الغرض</th>
                <th className="px-4 py-4 text-center">الحالة</th>
                <th className="px-4 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {missions.map(m => {
                const user = users.find(u => u.id === m.userId);
                return (
                  <tr key={m.id} className="hover:bg-white/5 transition-all">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center font-black text-slate-400 overflow-hidden">
                          {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-black dark:text-white leading-tight">{user?.fullNameQuad || 'موظف غير معروف'}</p>
                          <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400">{user?.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-slate-600 dark:text-slate-300">
                      {m.destination}
                    </td>
                    <td className="px-4 py-4 text-center text-[10px] font-black text-slate-500">
                      من {m.startDate} <br/> إلى {m.endDate}
                    </td>
                    <td className="px-4 py-4 text-center text-[10px] font-bold text-slate-500 max-w-[200px] truncate">
                      {m.purpose}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black ${
                        m.status === 'مكتمل' ? 'bg-emerald-500/10 text-emerald-600' :
                        m.status === 'قيد التنفيذ' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-slate-500/10 text-slate-500'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-500 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OfficialMissionsView;
