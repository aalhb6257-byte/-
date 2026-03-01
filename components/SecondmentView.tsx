
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { User } from '../types';

interface SecondmentViewProps {
  users: User[];
  onViewUser: (user: User) => void;
  onAddSecondment: (user: Omit<User, 'id' | 'joinDate' | 'status'>) => void;
}

const SecondmentView: React.FC<SecondmentViewProps> = ({ users, onViewUser, onAddSecondment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'internal' | 'external'>('internal');
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    fullNameQuad: '',
    motherNameTriple: '',
    birthDate: '',
    gender: 'ذكر' as 'ذكر' | 'أنثى',
    education: '',
    department: '', // موقع العمل الحالي
    role: '', // العنوان الوظيفي
    secondedFrom: '', // الجهة المنسب منها
    secondedTo: '', // الجهة المنسب اليها
    releaseDate: '', // تاريخ الانفكاك
    commencementDate: '', // تاريخ المباشرة
    secondmentDuration: '', // مدة التنسيب
    secondmentEndDate: '', // تاريخ انتهاء التنسيب
    secondmentExtensionPeriod: '', // فترة تمديد التنسيب
    secondmentType: 'داخلي', // نوع التنسيب
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSecondment({
      ...formData,
      name: formData.fullNameQuad.split(' ')[0] || 'موظف',
      email: '',
      phone: '',
      address: '',
      appointmentDateContract: '',
      appointmentDatePermanent: '',
      preciseSpecialization: '',
      notes: `تنسيب ${formData.secondmentType}`,
    });
    setShowForm(false);
    setFormData({
      fullNameQuad: '',
      motherNameTriple: '',
      birthDate: '',
      gender: 'ذكر',
      education: '',
      department: '',
      role: '',
      secondedFrom: '',
      secondedTo: '',
      releaseDate: '',
      commencementDate: '',
      secondmentDuration: '',
      secondmentEndDate: '',
      secondmentExtensionPeriod: '',
      secondmentType: 'داخلي',
    });
    toast.success('تمت إضافة حركة التنسيب بنجاح');
  };

  const filteredUsers = users.filter(u => {
    const isSeconded = u.notes?.includes('تنسيب');
    if (!isSeconded) return false;

    const isInternal = u.notes?.includes('داخلي');
    const isExternal = u.notes?.includes('خارجي');

    if (activeTab === 'internal' && !isInternal && isExternal) return false;
    if (activeTab === 'external' && !isExternal) return false;
    
    return u.fullNameQuad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           u.department?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-fade-in font-['Cairo']">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-black dark:text-white tracking-tight">حركة التنسيب</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">إدارة ومتابعة تنسيب الموظفين بين الأقسام والمواقع الخارجية.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="liquid-btn-primary text-white px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <svg className={`w-5 h-5 transition-transform ${showForm ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          إضافة تنسيب جديد
        </button>
      </div>

      {showForm && (
        <div className="glass-panel p-8 animate-fade-in border-2 border-amber-500/20">
          <h3 className="text-xl font-black text-black dark:text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
            </span>
            تسجيل بيانات تنسيب جديد
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">الاسم الرباعي واللقب</label>
                <input required type="text" value={formData.fullNameQuad} onChange={e => setFormData({...formData, fullNameQuad: e.target.value})} className="w-full h-12 liquid-input px-4 text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">اسم الأم الثلاثي</label>
                <input required type="text" value={formData.motherNameTriple} onChange={e => setFormData({...formData, motherNameTriple: e.target.value})} className="w-full h-12 liquid-input px-4 text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">المواليد</label>
                <input required type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} className="w-full h-12 liquid-input px-4 text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">الجنس</label>
                <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as 'ذكر'|'أنثى'})} className="w-full h-12 liquid-input px-4 text-sm font-bold">
                  <option value="ذكر">ذكر</option>
                  <option value="أنثى">أنثى</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">نوع التنسيب</label>
                <select value={formData.secondmentType} onChange={e => setFormData({...formData, secondmentType: e.target.value})} className="w-full h-12 liquid-input px-4 text-sm font-bold">
                  <option value="داخلي">تنسيب داخلي</option>
                  <option value="خارجي">تنسيب خارجي</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">التحصيل الدراسي</label>
                <input required type="text" value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} className="w-full h-12 liquid-input px-4 text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">موقع العمل الحالي</label>
                <input required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full h-12 liquid-input px-4 text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">العنوان الوظيفي</label>
                <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full h-12 liquid-input px-4 text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">الجهة المنسب منها</label>
                <input required type="text" value={formData.secondedFrom} onChange={e => setFormData({...formData, secondedFrom: e.target.value})} className="w-full h-12 liquid-input px-4 text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">الجهة المنسب اليها</label>
                <input required type="text" value={formData.secondedTo} onChange={e => setFormData({...formData, secondedTo: e.target.value})} className="w-full h-12 liquid-input px-4 text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">تاريخ الانفكاك</label>
                <input required type="date" value={formData.releaseDate} onChange={e => setFormData({...formData, releaseDate: e.target.value})} className="w-full h-12 liquid-input px-4 text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">تاريخ المباشرة</label>
                <input required type="date" value={formData.commencementDate} onChange={e => setFormData({...formData, commencementDate: e.target.value})} className="w-full h-12 liquid-input px-4 text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">مدة التنسيب</label>
                <input required type="text" value={formData.secondmentDuration} onChange={e => setFormData({...formData, secondmentDuration: e.target.value})} placeholder="مثال: سنة واحدة" className="w-full h-12 liquid-input px-4 text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">تاريخ انتهاء التنسيب</label>
                <input required type="date" value={formData.secondmentEndDate} onChange={e => setFormData({...formData, secondmentEndDate: e.target.value})} className="w-full h-12 liquid-input px-4 text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">فترة تمديد التنسيب</label>
                <input type="text" value={formData.secondmentExtensionPeriod} onChange={e => setFormData({...formData, secondmentExtensionPeriod: e.target.value})} placeholder="اختياري" className="w-full h-12 liquid-input px-4 text-sm font-bold" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl font-black text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">إلغاء</button>
              <button type="submit" className="liquid-btn-primary text-white px-8 py-3 rounded-xl font-black text-xs shadow-lg hover:-translate-y-0.5 transition-all">حفظ بيانات التنسيب</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-px">
        <button
          onClick={() => setActiveTab('internal')}
          className={`px-6 py-3 text-sm font-black transition-all relative ${
            activeTab === 'internal' 
              ? 'text-amber-600 dark:text-amber-400' 
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          التنسيب الداخلي
          {activeTab === 'internal' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-t-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('external')}
          className={`px-6 py-3 text-sm font-black transition-all relative ${
            activeTab === 'external' 
              ? 'text-amber-600 dark:text-amber-400' 
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          التنسيب الخارجي
          {activeTab === 'external' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-t-full"></span>
          )}
        </button>
      </div>

      <div className="glass-panel p-6 no-print">
        <div className="relative group">
          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input 
            type="text" 
            placeholder="بحث عن موظف أو قسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 liquid-input pr-12 pl-6 text-sm font-bold transition-all outline-none"
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden border-none shadow-xl">
        <div className="bg-amber-500/10 backdrop-blur-xl border-b border-white/10 px-10 py-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-transparent to-yellow-400/10 animate-pulse"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-600 shadow-inner border border-amber-400/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            </div>
            <h3 className="text-sm font-black text-amber-900 dark:text-amber-100">سجل التنسيب والحركة</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-right min-w-[1000px] border-collapse">
            <thead className="bg-white/5 border-b border-white/10">
              <tr className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">الموظف</th>
                <th className="px-4 py-4 text-center">القسم الحالي</th>
                <th className="px-4 py-4 text-center">موقع التنسيب</th>
                <th className="px-4 py-4 text-center">تاريخ التنسيب</th>
                <th className="px-4 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length > 0 ? filteredUsers.map(u => (
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
                  <td className="px-4 py-4 text-center text-xs font-bold text-slate-600 dark:text-slate-300">
                    {u.department || 'غير محدد'}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-lg text-[10px] font-black">
                      {u.secondedTo || (u.notes?.includes('تنسيب') ? u.notes.split('تنسيب')[1].trim() : 'داخلي')}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">
                    {u.commencementDate || u.joinDate || '---'}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => onViewUser(u)}
                        className="liquid-btn text-amber-600 px-4 py-1.5 rounded-lg text-[10px] font-black hover:bg-amber-600 hover:text-white transition-all"
                      >
                        تعديل التنسيب
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
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

export default SecondmentView;
