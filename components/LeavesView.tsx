
import React, { useState } from 'react';
import { User } from '../types';

interface LeavesViewProps {
  users: User[];
  onViewUser: (user: User) => void;
}

const LeavesView: React.FC<LeavesViewProps> = ({ users, onViewUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const leaveRequests = [
    { id: 1, userId: users[0]?.id, type: 'سنوية', startDate: '2024-04-01', endDate: '2024-04-15', status: 'معتمد', days: 15 },
    { id: 2, userId: users[1]?.id, type: 'مرضية', startDate: '2024-03-20', endDate: '2024-03-22', status: 'قيد الانتظار', days: 3 },
    { id: 3, userId: users[2]?.id, type: 'اضطرارية', startDate: '2024-03-25', endDate: '2024-03-26', status: 'مرفوض', days: 1 },
    { id: 4, userId: users[3]?.id, type: 'سنوية', startDate: '2024-05-10', endDate: '2024-05-20', status: 'قيد الانتظار', days: 10 },
  ];

  const filteredRequests = leaveRequests.filter(req => {
    const user = users.find(u => u.id === req.userId);
    return user?.fullNameQuad?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           user?.department?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-black dark:text-white tracking-tight">إدارة الإجازات</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">تنظيم ومتابعة طلبات الإجازات بأنواعها المختلفة للموظفين.</p>
        </div>
        <button className="liquid-btn-primary px-6 py-3 text-white text-xs font-black flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
          تقديم طلب إجازة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 no-print">
        <div className="pro-card p-6 border-sky-500/20 bg-sky-500/5">
          <p className="text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-1">إجمالي الطلبات</p>
          <h3 className="text-2xl font-black text-black dark:text-white">{leaveRequests.length} طلب</h3>
        </div>
        <div className="pro-card p-6 border-amber-500/20 bg-amber-500/5">
          <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">قيد الانتظار</p>
          <h3 className="text-2xl font-black text-black dark:text-white">2 طلب</h3>
        </div>
        <div className="pro-card p-6 border-emerald-500/20 bg-emerald-500/5">
          <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">تمت الموافقة</p>
          <h3 className="text-2xl font-black text-black dark:text-white">1 طلب</h3>
        </div>
        <div className="pro-card p-6 border-rose-500/20 bg-rose-500/5">
          <p className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-1">رصيد الإجازات المستهلك</p>
          <h3 className="text-2xl font-black text-black dark:text-white">29 يوم</h3>
        </div>
      </div>

      <div className="glass-panel p-6 no-print">
        <div className="relative group">
          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input 
            type="text" 
            placeholder="بحث عن طلب إجازة لموظف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 liquid-input pr-12 pl-6 text-sm font-bold transition-all outline-none"
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden border-none shadow-xl">
        <div className="bg-sky-500/10 backdrop-blur-xl border-b border-white/10 px-10 py-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 via-transparent to-blue-400/10 animate-pulse"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-sky-500/20 rounded-xl flex items-center justify-center text-sky-600 shadow-inner border border-sky-400/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-sm font-black text-sky-900 dark:text-sky-100">سجل طلبات الإجازات</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-right min-w-[1000px] border-collapse">
            <thead className="bg-white/5 border-b border-white/10">
              <tr className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">الموظف</th>
                <th className="px-4 py-4 text-center">نوع الإجازة</th>
                <th className="px-4 py-4 text-center">الفترة</th>
                <th className="px-4 py-4 text-center">المدة</th>
                <th className="px-4 py-4 text-center">الحالة</th>
                <th className="px-4 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRequests.length > 0 ? filteredRequests.map(req => {
                const user = users.find(u => u.id === req.userId);
                return (
                  <tr key={req.id} className="hover:bg-white/5 transition-all">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center font-black text-slate-400 overflow-hidden">
                          {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-black dark:text-white leading-tight">{user?.fullNameQuad || 'موظف غير معروف'}</p>
                          <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400">{user?.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-lg text-[10px] font-black text-slate-600 dark:text-slate-300">
                        {req.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-[10px] font-black text-slate-500">
                      من {req.startDate} <br/> إلى {req.endDate}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-black text-slate-700 dark:text-slate-200">
                      {req.days} يوم
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black ${
                        req.status === 'معتمد' ? 'bg-emerald-500/10 text-emerald-600' :
                        req.status === 'قيد الانتظار' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-rose-500/10 text-rose-600'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-emerald-500 transition-colors" title="موافقة">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors" title="رفض">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        <button 
                          onClick={() => user && onViewUser(user)}
                          className="p-2 text-slate-400 hover:text-indigo-500 transition-colors" title="عرض الملف"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <p className="text-slate-500 font-bold">لا توجد طلبات إجازة حالياً.</p>
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

export default LeavesView;
