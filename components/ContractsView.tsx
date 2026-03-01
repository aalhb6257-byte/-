import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import { User, ContractRecord, Gender } from '../types';

interface ContractsViewProps {
  users: User[];
  contractRecords: ContractRecord[];
  onAddContractRecord: (record: Omit<ContractRecord, 'id' | 'createdAt'>) => void;
  onDeleteContractRecord: (id: string) => void;
  isReadOnly?: boolean;
}

const ContractsView: React.FC<ContractsViewProps> = ({ 
  users, 
  contractRecords, 
  onAddContractRecord, 
  onDeleteContractRecord,
  isReadOnly 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    fullNameQuad: '',
    motherNameTriple: '',
    birthDate: '',
    gender: 'ذكر' as Gender,
    unifiedIdNumber: '',
    issueDate: '',
    appointmentType: 'wage' as 'wage' | 'contract',
    appointmentDate: '',
    commencementDate: '',
    wageOrderNumber: '',
    contractConversionOrderNumber: '',
    phone: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullNameQuad || !formData.appointmentDate) {
      toast.error('يرجى ملء الحقول المطلوبة');
      return;
    }
    
    onAddContractRecord(formData);
    setShowForm(false);
    resetForm();
    toast.success('تم تسجيل البيانات بنجاح');
  };

  const resetForm = () => {
    setFormData({
      fullNameQuad: '',
      motherNameTriple: '',
      birthDate: '',
      gender: 'ذكر',
      unifiedIdNumber: '',
      issueDate: '',
      appointmentType: 'wage',
      appointmentDate: '',
      commencementDate: '',
      wageOrderNumber: '',
      contractConversionOrderNumber: '',
      phone: '',
      address: ''
    });
  };

  const filteredRecords = contractRecords.filter(r => 
    r.fullNameQuad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.unifiedIdNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in font-['Cairo']">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-black dark:text-white tracking-tight">العقود والتعيينات</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">إدارة بيانات الأجراء اليوميين وموظفي العقود الجدد.</p>
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
            {showForm ? 'إغلاق النموذج' : 'نافذة إدخال البيانات'}
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel p-8 overflow-hidden border-2 border-rose-500/20"
          >
            <h3 className="text-xl font-black text-black dark:text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </span>
              إدخال بيانات تعيين جديد
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">الاسم الرباعي واللقب</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.fullNameQuad} 
                    onChange={e => setFormData({...formData, fullNameQuad: e.target.value})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">اسم الأم الثلاثي</label>
                  <input 
                    type="text" 
                    value={formData.motherNameTriple} 
                    onChange={e => setFormData({...formData, motherNameTriple: e.target.value})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">المواليد</label>
                  <input 
                    type="date" 
                    value={formData.birthDate} 
                    onChange={e => setFormData({...formData, birthDate: e.target.value})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">الجنس</label>
                  <select 
                    value={formData.gender} 
                    onChange={e => setFormData({...formData, gender: e.target.value as Gender})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold"
                  >
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">رقم البطاقة الموحدة</label>
                  <input 
                    type="text" 
                    value={formData.unifiedIdNumber} 
                    onChange={e => setFormData({...formData, unifiedIdNumber: e.target.value})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">تاريخ الإصدار</label>
                  <input 
                    type="date" 
                    value={formData.issueDate} 
                    onChange={e => setFormData({...formData, issueDate: e.target.value})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">نوع التعيين</label>
                  <select 
                    value={formData.appointmentType} 
                    onChange={e => setFormData({...formData, appointmentType: e.target.value as 'wage' | 'contract'})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold"
                  >
                    <option value="wage">أجر يومي</option>
                    <option value="contract">عقد</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">تاريخ التعيين بأجر أو عقد</label>
                  <input 
                    required 
                    type="date" 
                    value={formData.appointmentDate} 
                    onChange={e => setFormData({...formData, appointmentDate: e.target.value})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">تاريخ المباشرة</label>
                  <input 
                    type="date" 
                    value={formData.commencementDate} 
                    onChange={e => setFormData({...formData, commencementDate: e.target.value})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">الأمر الصادر بالاشتغال بأجر</label>
                  <input 
                    type="text" 
                    value={formData.wageOrderNumber} 
                    onChange={e => setFormData({...formData, wageOrderNumber: e.target.value})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">الأمر الصادر بتحويل إلى عقد</label>
                  <input 
                    type="text" 
                    value={formData.contractConversionOrderNumber} 
                    onChange={e => setFormData({...formData, contractConversionOrderNumber: e.target.value})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">رقم الهاتف</label>
                  <input 
                    type="tel" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold text-left" 
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3 space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">عنوان السكن</label>
                  <input 
                    type="text" 
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})} 
                    className="w-full h-12 liquid-input px-4 text-sm font-bold" 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl font-black text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">إلغاء</button>
                <button type="submit" className="liquid-btn-primary text-white px-8 py-3 rounded-xl font-black text-xs shadow-lg hover:-translate-y-0.5 transition-all">حفظ البيانات</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-panel p-6 no-print">
        <div className="relative group">
          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-rose-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input 
            type="text" 
            placeholder="بحث بالاسم، رقم الهاتف، أو رقم البطاقة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 liquid-input pr-12 pl-6 text-sm font-bold transition-all outline-none"
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden border-none shadow-xl">
        <div className="bg-rose-500/10 backdrop-blur-xl border-b border-white/10 px-10 py-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-400/10 via-transparent to-orange-400/10 animate-pulse"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-400 shadow-inner border border-rose-400/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <h3 className="text-sm font-black text-rose-900 dark:text-rose-100">سجل العقود والتعيينات</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-right min-w-[1200px] border-collapse">
            <thead className="bg-white/5 border-b border-white/10">
              <tr className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">الموظف</th>
                <th className="px-4 py-4 text-center">نوع التعيين</th>
                <th className="px-4 py-4 text-center">البطاقة الموحدة</th>
                <th className="px-4 py-4 text-center">تاريخ المباشرة</th>
                <th className="px-4 py-4 text-center">رقم الهاتف</th>
                <th className="px-4 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredRecords.length > 0 ? filteredRecords.map((r, index) => (
                  <motion.tr 
                    key={r.id} 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-white/5 transition-all group"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center font-black text-rose-600">
                          {r.fullNameQuad.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-black dark:text-white leading-tight">{r.fullNameQuad}</p>
                          <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400">{r.motherNameTriple}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${r.appointmentType === 'wage' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {r.appointmentType === 'wage' ? 'أجر يومي' : 'عقد'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-slate-600 dark:text-slate-300">
                      {r.unifiedIdNumber || '---'}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-slate-600 dark:text-slate-300">
                      {r.commencementDate || '---'}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-slate-600 dark:text-slate-300">
                      {r.phone}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        {!isReadOnly && (
                          <button 
                            onClick={() => onDeleteContractRecord(r.id)}
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
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <p className="text-slate-500 font-bold">لا توجد سجلات حالياً.</p>
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

export default ContractsView;
