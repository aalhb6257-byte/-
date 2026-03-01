
import React, { useState } from 'react';
import { User } from '../types';

interface TrainingCoursesViewProps {
  users: User[];
  onViewUser: (user: User) => void;
}

const TrainingCoursesView: React.FC<TrainingCoursesViewProps> = ({ users, onViewUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const courses = [
    { id: 1, title: 'إدارة الموارد البشرية المتقدمة', provider: 'مركز التطوير الإداري', date: '2024-05-01', duration: '5 أيام', participants: 12, status: 'قادم' },
    { id: 2, title: 'الأرشفة الإلكترونية والذكاء الاصطناعي', provider: 'أكاديمية التكنولوجيا', date: '2024-03-15', duration: '3 أيام', participants: 8, status: 'مكتمل' },
    { id: 3, title: 'قوانين الخدمة المدنية والتعليمات النافذة', provider: 'الدائرة القانونية', date: '2024-04-10', duration: '2 يوم', participants: 25, status: 'قيد التسجيل' },
  ];

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-black dark:text-white tracking-tight">الدورات التدريبية</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">تطوير مهارات الكادر الوظيفي من خلال الورش والدورات التخصصية.</p>
        </div>
        <button className="liquid-btn-primary px-6 py-3 text-white text-xs font-black flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
          إضافة دورة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
        <div className="pro-card p-6 border-violet-500/20 bg-violet-500/5">
          <p className="text-[10px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-1">الدورات النشطة</p>
          <h3 className="text-2xl font-black text-black dark:text-white">3 دورات</h3>
        </div>
        <div className="pro-card p-6 border-emerald-500/20 bg-emerald-500/5">
          <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">المتدربين هذا الشهر</p>
          <h3 className="text-2xl font-black text-black dark:text-white">45 موظف</h3>
        </div>
        <div className="pro-card p-6 border-indigo-500/20 bg-indigo-500/5">
          <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">ساعات التدريب الكلية</p>
          <h3 className="text-2xl font-black text-black dark:text-white">120 ساعة</h3>
        </div>
      </div>

      <div className="glass-panel p-6 no-print">
        <div className="relative group">
          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input 
            type="text" 
            placeholder="بحث عن دورة أو جهة تدريبية..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 liquid-input pr-12 pl-6 text-sm font-bold transition-all outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map(course => (
          <div key={course.id} className="pro-card p-8 hover:border-violet-500 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              </div>
              <span className={`px-3 py-1 rounded-lg text-[9px] font-black ${
                course.status === 'مكتمل' ? 'bg-emerald-500/10 text-emerald-600' :
                course.status === 'قيد التسجيل' ? 'bg-amber-500/10 text-amber-600' :
                'bg-violet-500/10 text-violet-600'
              }`}>
                {course.status}
              </span>
            </div>
            <h4 className="text-lg font-black text-black dark:text-white mb-2 group-hover:text-violet-600 transition-colors">{course.title}</h4>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              {course.provider}
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-white/5">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">التاريخ</p>
                <p className="text-xs font-black text-slate-700 dark:text-slate-300">{course.date}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">المدة</p>
                <p className="text-xs font-black text-slate-700 dark:text-slate-300">{course.duration}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">المشاركين</p>
                <p className="text-xs font-black text-slate-700 dark:text-slate-300">{course.participants} موظف</p>
              </div>
            </div>
            
            <button className="w-full mt-6 py-3 rounded-xl text-[10px] font-black liquid-btn text-violet-600 border border-violet-200 hover:bg-violet-600 hover:text-white transition-all">
              عرض قائمة المتدربين
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingCoursesView;
