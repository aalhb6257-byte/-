import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import { User, TransferRecord } from '../types';

interface TransfersViewProps {
  users: User[];
  transfers: TransferRecord[];
  onViewUser: (user: User) => void;
  onAddTransfer: (transfer: Omit<TransferRecord, 'id' | 'createdAt'>) => void;
  onDeleteTransfer: (id: string) => void;
  isReadOnly?: boolean;
}

const TransfersView: React.FC<TransfersViewProps> = ({ 
  users, 
  transfers, 
  onViewUser, 
  onAddTransfer, 
  onDeleteTransfer,
  isReadOnly 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    employeeName: '',
    type: 'internal' as 'internal' | 'external',
    placeFrom: '',
    placeTo: '',
    releaseDate: '',
    resumptionDate: '',
    orderNumber: '',
    education: '',
    jobTitle: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeName || !formData.orderNumber) {
      toast.error('يرجى ملء الحقول المطلوبة');
      return;
    }
    
    onAddTransfer(formData);
    setShowForm(false);
    setFormData({
      employeeName: '',
      type: 'internal',
      placeFrom: '',
      placeTo: '',
      releaseDate: '',
      resumptionDate: '',
      orderNumber: '',
      education: '',
      jobTitle: '',
      notes: ''
    });
    toast.success('تم تسجيل حركة النقل بنجاح');
  };

  const filteredTransfers = transfers.filter(t => 
    t.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.placeTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in font-['Cairo']">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-black dark:text-white tracking-tight">النقل الداخلي والخارجي</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">إدارة وتتبع حركة تنقلات الموظفين الرسمية.</p>
        </div>
        {!isReadOnly && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="liquid-btn-primary text-white px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <motion.svg 
              animate={showForm ? { rotate: 45 } : { rotate: 0 }}
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </motion.svg>
            تسجيل حركة نقل
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel p-8 overflow-hidden border-2 border-emerald-500/20"
          >
            <h3 className="text-xl font-black text-black dark:text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
              </span>
              بيانات النقل الجديدة
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">اسم الموظف (إدخال يدوي)</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.employeeName} 
                    onChange={e => setFormData({...formData, employeeName: e.target.value})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold" 
                    placeholder="أدخل اسم الموظف الكامل..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">نوع النقل</label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value as 'internal' | 'external'})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold"
                  >
                    <option value="internal">نقل داخلي</option>
                    <option value="external">نقل خارجي</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">المكان المنقول منه</label>
                  <input 
                    type="text" 
                    value={formData.placeFrom} 
                    onChange={e => setFormData({...formData, placeFrom: e.target.value})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">المكان المنقول إليه</label>
                  <input 
                    type="text" 
                    value={formData.placeTo} 
                    onChange={e => setFormData({...formData, placeTo: e.target.value})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">تاريخ الانفكاك</label>
                  <input 
                    required 
                    type="date" 
                    value={formData.releaseDate} 
                    onChange={e => setFormData({...formData, releaseDate: e.target.value})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">تاريخ المباشرة بالعمل</label>
                  <input 
                    type="date" 
                    value={formData.resumptionDate} 
                    onChange={e => setFormData({...formData, resumptionDate: e.target.value})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">الأمر الصادر بالنقل</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.orderNumber} 
                    onChange={e => setFormData({...formData, orderNumber: e.target.value})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">التحصيل الدراسي</label>
                  <input 
                    type="text" 
                    value={formData.education} 
                    onChange={e => setFormData({...formData, education: e.target.value})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">العنوان الوظيفي</label>
                  <input 
                    type="text" 
                    value={formData.jobTitle} 
                    onChange={e => setFormData({...formData, jobTitle: e.target.value})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold" 
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3 space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">ملاحظات إضافية</label>
                  <textarea 
                    value={formData.notes} 
                    onChange={e => setFormData({...formData, notes: e.target.value})} 
                    className="w-full h-24 liquid-input p-4 text-sm font-bold resize-none" 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl font-black text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">إلغاء</button>
                <button type="submit" className="liquid-btn-primary text-white px-8 py-3 rounded-xl font-black text-xs shadow-lg hover:-translate-y-0.5 transition-all">تأكيد وتسجيل النقل</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-panel p-6 no-print">
        <div className="relative group">
          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input 
            type="text" 
            placeholder="بحث في سجل التنقلات (الاسم، رقم الأمر، الوجهة)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 liquid-input pr-12 pl-6 text-sm font-bold transition-all outline-none"
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden border-none shadow-xl">
        <div className="bg-emerald-500/10 backdrop-blur-xl border-b border-white/10 px-10 py-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-transparent to-teal-400/10 animate-pulse"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner border border-emerald-400/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            </div>
            <h3 className="text-sm font-black text-emerald-900 dark:text-emerald-100">سجل حركات النقل</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-right min-w-[1200px] border-collapse">
            <thead className="bg-white/5 border-b border-white/10">
              <tr className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">الموظف</th>
                <th className="px-4 py-4 text-center">نوع النقل</th>
                <th className="px-4 py-4 text-center">من / إلى</th>
                <th className="px-4 py-4 text-center">رقم الأمر</th>
                <th className="px-4 py-4 text-center">التواريخ</th>
                <th className="px-4 py-4 text-center">العنوان / التحصيل</th>
                <th className="px-4 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredTransfers.length > 0 ? filteredTransfers.map((t, index) => (
                  <motion.tr 
                    key={t.id} 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-white/5 transition-all group"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center font-black text-emerald-600">
                          {t.employeeName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-black dark:text-white leading-tight">{t.employeeName}</p>
                          <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400">سجل نقل رسمي</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${t.type === 'internal' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                        {t.type === 'internal' ? 'داخلي' : 'خارجي'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400">من: <span className="text-slate-700 dark:text-slate-200">{t.placeFrom || '---'}</span></p>
                        <p className="text-[10px] font-bold text-slate-400">إلى: <span className="text-slate-700 dark:text-slate-200">{t.placeTo || '---'}</span></p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-black text-indigo-600">
                      {t.orderNumber}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400">انفكاك: <span className="text-slate-700 dark:text-slate-200">{t.releaseDate}</span></p>
                        <p className="text-[10px] font-bold text-slate-400">مباشرة: <span className="text-slate-700 dark:text-slate-200">{t.resumptionDate || '---'}</span></p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-700 dark:text-slate-200">{t.jobTitle}</p>
                        <p className="text-[9px] font-bold text-slate-400">{t.education}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        {!isReadOnly && (
                          <button 
                            onClick={() => onDeleteTransfer(t.id)}
                            className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                            title="حذف السجل"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center">
                      <p className="text-slate-500 font-bold">لا توجد سجلات تنقلات حالياً.</p>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransfersView;
