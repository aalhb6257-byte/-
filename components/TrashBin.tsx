
import React, { useState } from 'react';
import { Transaction, User, TransactionType, Gender, SpecialistAccount } from '../types';

interface TrashBinProps {
  transactions: Transaction[];
  users: User[];
  specialistAccounts?: SpecialistAccount[];
  onRestoreTransaction: (id: string, updated?: Transaction) => void;
  onPermanentDeleteTransaction: (id: string) => void;
  onRestoreUser: (id: string, updated?: User) => void;
  onPermanentDeleteUser: (id: string) => void;
  onRestoreSpecialistAccount?: (id: string) => void;
  onPermanentDeleteSpecialistAccount?: (id: string) => void;
  isReadOnly?: boolean;
}

const TrashBin: React.FC<TrashBinProps> = ({ 
  transactions, 
  users, 
  specialistAccounts = [],
  onRestoreTransaction, 
  onPermanentDeleteTransaction,
  onRestoreUser,
  onPermanentDeleteUser,
  onRestoreSpecialistAccount,
  onPermanentDeleteSpecialistAccount,
  isReadOnly
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'transactions' | 'accounts'>('users');
  const [editingItem, setEditingItem] = useState<{ type: 'user' | 'tx', data: any } | null>(null);

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (editingItem.type === 'user') {
      onRestoreUser(editingItem.data.id, editingItem.data);
    } else {
      onRestoreTransaction(editingItem.data.id, editingItem.data);
    }
    setEditingItem(null);
  };

  const getModuleLabel = (id: string) => {
    const modules: Record<string, string> = {
      'transfers': 'النقل الخارجي والداخلي',
      'contracts': 'العقود والتعيينات',
      'salaries': 'رواتب الموظفين',
      'permanent-employees': 'الملاك',
      'barcode': 'نظام الباركود',
      'secondment': 'حركة التنسيب',
      'degree-calculation': 'احتساب الشهادات',
      'official-missions': 'الايفادات',
      'promotions': 'الترقيات',
      'leaves': 'الاجازات',
      'training-courses': 'الدورات التدريبية',
    };
    return modules[id] || id;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-black dark:text-white flex items-center gap-3">
             <span className="w-10 h-10 bg-rose-500/20 text-rose-500 rounded-xl flex items-center justify-center">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
             </span>
             سلة المهملات
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">إدارة العناصر المحذوفة قبل الحذف النهائي</p>
        </div>
        
        <div className="flex glass-panel p-1.5 rounded-2xl shadow-sm overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeSubTab === 'users' ? 'liquid-btn-primary shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-white/5'}`}
          >
            سجل الموظفين ({users.length})
          </button>
          <button
            onClick={() => setActiveSubTab('transactions')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeSubTab === 'transactions' ? 'liquid-btn-primary shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-white/5'}`}
          >
            المعاملات المالية ({transactions.length})
          </button>
          <button
            onClick={() => setActiveSubTab('accounts')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeSubTab === 'accounts' ? 'liquid-btn-primary shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-white/5'}`}
          >
            حسابات المختصين ({specialistAccounts.length})
          </button>
        </div>
      </div>

      {editingItem && (
        <form onSubmit={handleEditSave} className="glass-panel p-10 border border-white/10 animate-fade-in mb-8 relative z-20">
          <h3 className="text-lg font-black mb-10 flex items-center gap-3 text-white">
            <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold">✎</span>
            مراجعة وتدقيق البيانات قبل الاستعادة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {editingItem.type === 'user' ? (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">الاسم الرباعي</label>
                  <input type="text" value={editingItem.data.fullNameQuad} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, fullNameQuad: e.target.value}})} className="w-full h-12 liquid-input p-4 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">اسم الأم</label>
                  <input type="text" value={editingItem.data.motherNameTriple} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, motherNameTriple: e.target.value}})} className="w-full h-12 liquid-input p-4 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">التحصيل الدراسي</label>
                  <input type="text" value={editingItem.data.education} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, education: e.target.value}})} className="w-full h-12 liquid-input p-4 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">الجنس</label>
                  <select value={editingItem.data.gender} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, gender: e.target.value as Gender}})} className="w-full h-12 liquid-input px-4 text-sm font-bold appearance-none">
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">الراتب</label>
                  <input type="number" value={editingItem.data.salary} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, salary: parseFloat(e.target.value)}})} className="w-full h-12 liquid-input p-4 text-sm font-bold" />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">وصف العملية</label>
                  <input type="text" value={editingItem.data.description} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, description: e.target.value}})} className="w-full h-12 liquid-input p-4 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">المبلغ</label>
                  <input type="number" value={editingItem.data.amount} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, amount: parseFloat(e.target.value)}})} className="w-full h-12 liquid-input p-4 text-sm font-bold" />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => setEditingItem(null)} className="px-8 py-3.5 rounded-xl font-black text-slate-500 dark:text-slate-400 hover:text-white text-xs uppercase tracking-widest transition-colors">تجاهل</button>
            <button type="submit" className="px-12 py-3.5 liquid-btn-primary text-white rounded-xl font-black shadow-lg transition-all">تثبيت واستعادة السجل</button>
          </div>
        </form>
      )}

      <div className="glass-panel rounded-[2.5rem] shadow-sm border border-white/10 overflow-hidden overflow-x-auto">
        {activeSubTab === 'users' ? (
          <table className="w-full text-right min-w-[1000px]">
            <thead className="bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/10">
              <tr>
                <th className="px-10 py-6">الموظف (الاسم الرباعي)</th>
                <th className="px-6 py-6 text-center">تاريخ الحذف</th>
                <th className="px-6 py-6">التحصيل الدراسي</th>
                <th className="px-10 py-6 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.length > 0 ? users.map(u => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-400 font-black">{u.fullNameQuad?.charAt(0) || u.name.charAt(0)}</div>
                      <div>
                        <p className="font-black text-black dark:text-white">{u.fullNameQuad || u.name}</p>
                        <p className="text-[10px] font-bold text-rose-500 uppercase">بواسطة مدير النظام</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center text-xs font-bold text-slate-500 dark:text-slate-400">{u.deletedAt || '---'}</td>
                  <td className="px-6 py-6 text-xs font-bold text-slate-600 dark:text-slate-400">{u.education || 'غير محدد'}</td>
                  <td className="px-10 py-6">
                    {!isReadOnly && (
                      <div className="flex justify-center gap-2">
                        <button onClick={() => setEditingItem({ type: 'user', data: u })} className="px-4 py-2 liquid-btn text-indigo-500 dark:text-indigo-400 hover:text-white transition-all text-[10px] font-black">تدقيق واستعادة</button>
                        <button onClick={() => onRestoreUser(u.id)} className="p-2 liquid-btn text-emerald-500 dark:text-emerald-400 hover:text-white transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        </button>
                        <button onClick={() => onPermanentDeleteUser(u.id)} className="p-2 liquid-btn text-rose-500 dark:text-rose-400 hover:text-white transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="py-20 text-center text-slate-500 dark:text-slate-400 italic font-bold">السجل نظيف حالياً</td></tr>
              )}
            </tbody>
          </table>
        ) : activeSubTab === 'transactions' ? (
          <table className="w-full text-right min-w-[800px]">
            <thead className="bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/10">
              <tr>
                <th className="px-10 py-6">المعاملة</th>
                <th className="px-6 py-6 text-left">المبلغ</th>
                <th className="px-6 py-6 text-center">تاريخ الحذف</th>
                <th className="px-10 py-6 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.length > 0 ? transactions.map(t => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-10 py-6 font-black text-black dark:text-white">{t.description}</td>
                  <td className={`px-6 py-6 text-left font-black ${t.type === TransactionType.INCOME ? 'text-indigo-400' : 'text-rose-400'}`}>{t.amount.toLocaleString()} د.ع</td>
                  <td className="px-6 py-6 text-center text-xs font-bold text-slate-500 dark:text-slate-400">{t.deletedAt}</td>
                  <td className="px-10 py-6">
                    {!isReadOnly && (
                      <div className="flex justify-center gap-2">
                        <button onClick={() => setEditingItem({ type: 'tx', data: t })} className="p-2 liquid-btn text-indigo-500 dark:text-indigo-400 hover:text-white transition-all">تعديل</button>
                        <button onClick={() => onRestoreTransaction(t.id)} className="p-2 liquid-btn text-emerald-500 dark:text-emerald-400 hover:text-white transition-all">استعادة</button>
                        <button onClick={() => onPermanentDeleteTransaction(t.id)} className="p-2 liquid-btn text-rose-500 dark:text-rose-400 hover:text-white transition-all">حذف</button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="py-20 text-center text-slate-500 dark:text-slate-400 italic font-bold">لا توجد عمليات محدوفة</td></tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-right min-w-[800px]">
            <thead className="bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/10">
              <tr>
                <th className="px-10 py-6">اسم المستخدم</th>
                <th className="px-6 py-6">القسم</th>
                <th className="px-6 py-6 text-center">تاريخ التسجيل</th>
                <th className="px-10 py-6 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {specialistAccounts.length > 0 ? specialistAccounts.map(acc => (
                <tr key={acc.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                        {acc.username.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-black dark:text-white">{acc.username}</p>
                        <p className="text-[10px] text-slate-500">{acc.fullNameQuad || '---'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-xs font-bold text-slate-600 dark:text-slate-400">{getModuleLabel(acc.assignedModule)}</td>
                  <td className="px-6 py-6 text-center text-xs font-bold text-slate-500 dark:text-slate-400">{new Date(acc.createdAt).toLocaleDateString('ar-SA')}</td>
                  <td className="px-10 py-6">
                    {!isReadOnly && (
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => onRestoreSpecialistAccount && onRestoreSpecialistAccount(acc.id)} 
                          className="p-2 liquid-btn text-emerald-500 dark:text-emerald-400 hover:text-white transition-all"
                          title="استعادة الحساب"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        </button>
                        <button 
                          onClick={() => onPermanentDeleteSpecialistAccount && onPermanentDeleteSpecialistAccount(acc.id)} 
                          className="p-2 liquid-btn text-rose-500 dark:text-rose-400 hover:text-white transition-all"
                          title="حذف نهائي"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="py-20 text-center text-slate-500 dark:text-slate-400 italic font-bold">لا توجد حسابات محدوفة</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TrashBin;
