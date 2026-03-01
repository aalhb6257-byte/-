
import React, { useState } from 'react';
import { User } from '../types';

interface DegreeCalculationViewProps {
  users: User[];
  onViewUser: (user: User) => void;
}

const DegreeCalculationView: React.FC<DegreeCalculationViewProps> = ({ users, onViewUser }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [newDegree, setNewDegree] = useState<string>('');
  const [graduationDate, setGraduationDate] = useState<string>('');
  
  const selectedUser = users.find(u => u.id === selectedUserId);

  const degreeOptions = [
    { label: 'دبلوم', years: 2, bonus: 10 },
    { label: 'بكالوريوس', years: 4, bonus: 15 },
    { label: 'دبلوم عالي', years: 1, bonus: 20 },
    { label: 'ماجستير', years: 2, bonus: 25 },
    { label: 'دكتوراه', years: 3, bonus: 35 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-black dark:text-white tracking-tight">احتساب الشهادات</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">أداة ذكية لتقييم أثر الشهادات الدراسية الجديدة على الدرجة الوظيفية والراتب.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="pro-card p-8">
            <h3 className="text-lg font-black text-black dark:text-white mb-6">بيانات الشهادة الجديدة</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">الموظف المعني</label>
                <select 
                  value={selectedUserId} 
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full h-12 liquid-input p-4 text-xs font-black"
                >
                  <option value="">-- اختر موظفاً --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.fullNameQuad || u.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">الشهادة الجديدة</label>
                <select 
                  value={newDegree} 
                  onChange={(e) => setNewDegree(e.target.value)}
                  className="w-full h-12 liquid-input p-4 text-xs font-black"
                >
                  <option value="">-- اختر الشهادة --</option>
                  {degreeOptions.map(d => (
                    <option key={d.label} value={d.label}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">تاريخ التخرج</label>
                <input 
                  type="date" 
                  value={graduationDate}
                  onChange={(e) => setGraduationDate(e.target.value)}
                  className="w-full h-12 liquid-input p-4 text-xs font-black"
                />
              </div>

              <button className="w-full py-4 rounded-2xl font-black text-xs liquid-btn-primary text-white mt-4">
                بدء عملية الاحتساب
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedUser && newDegree ? (
            <div className="pro-card p-8 space-y-8">
              <div className="flex items-center gap-6 pb-8 border-b border-slate-100 dark:border-white/10">
                <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-2xl font-black">
                  {selectedUser.avatar ? <img src={selectedUser.avatar} className="w-full h-full object-cover rounded-3xl" /> : selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-black text-black dark:text-white">{selectedUser.fullNameQuad}</h4>
                  <p className="text-sm font-bold text-slate-500">{selectedUser.role} - {selectedUser.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">الوضع الحالي</p>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">الشهادة: <span className="text-slate-900 dark:text-white">{selectedUser.education || 'غير محدد'}</span></p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">الراتب الاسمي: <span className="text-slate-900 dark:text-white">{selectedUser.salary || '0'} د.ع</span></p>
                  </div>
                </div>

                <div className="p-6 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-3xl border border-indigo-500/20">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">الوضع المتوقع</p>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">الشهادة الجديدة: <span className="text-indigo-900 dark:text-white">{newDegree}</span></p>
                    <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">العلاوة المتوقعة: <span className="text-indigo-900 dark:text-white">+{degreeOptions.find(d => d.label === newDegree)?.bonus}%</span></p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-[2.5rem] border border-emerald-500/20">
                <h5 className="text-sm font-black text-emerald-800 dark:text-emerald-200 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  التوصية الإدارية
                </h5>
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 leading-relaxed">
                  بناءً على القوانين النافذة، يستحق الموظف تغيير عنوانه الوظيفي إلى مرتبة أعلى مع إضافة مخصصات الشهادة الجديدة. يُنصح برفع طلب إلى القسم المالي لتعديل الراتب الاسمي اعتباراً من تاريخ تقديم الطلب.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => onViewUser(selectedUser)}
                  className="flex-1 py-4 rounded-2xl font-black text-xs liquid-btn text-indigo-600 border border-indigo-200"
                >
                  تعديل ملف الموظف
                </button>
                <button className="flex-1 py-4 rounded-2xl font-black text-xs liquid-btn-primary text-white">
                  تصدير تقرير الاحتساب
                </button>
              </div>
            </div>
          ) : (
            <div className="pro-card p-12 flex flex-col items-center justify-center min-h-[400px] opacity-50">
              <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
              </div>
              <p className="text-lg font-black text-slate-400">يرجى اختيار الموظف والشهادة لبدء الاحتساب</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DegreeCalculationView;
