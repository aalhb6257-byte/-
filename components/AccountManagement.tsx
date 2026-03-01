
import React, { useState, useEffect } from 'react';
import { SpecialistAccount } from '../types';

interface AccountManagementProps {
  accounts: SpecialistAccount[];
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onUnblock: (id: string) => void;
  onUpdate: (id: string, updates: Partial<SpecialistAccount>) => void;
}

const AccountManagement: React.FC<AccountManagementProps> = ({ accounts, onDelete, onApprove, onReject, onUnblock, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAccount, setEditingAccount] = useState<SpecialistAccount | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<SpecialistAccount | null>(null);
  const [editForm, setEditForm] = useState({
    username: '',
    fullNameQuad: '',
    password: ''
  });

  const pendingAccounts = accounts.filter(acc => acc.status === 'pending');
  const otherAccounts = accounts.filter(acc => acc.status !== 'pending');

  const filteredAccounts = accounts.filter(acc => 
    acc.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (acc.fullNameQuad && acc.fullNameQuad.toLowerCase().includes(searchTerm.toLowerCase())) ||
    acc.assignedModule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (account: SpecialistAccount) => {
    setEditingAccount(account);
    setEditForm({
      username: account.username,
      fullNameQuad: account.fullNameQuad || '',
      password: account.password || ''
    });
  };

  const handleDeleteClick = (account: SpecialistAccount) => {
    setDeleteConfirmation(account);
  };

  const confirmDelete = () => {
    if (deleteConfirmation) {
      onDelete(deleteConfirmation.id);
      setDeleteConfirmation(null);
    }
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAccount) {
      onUpdate(editingAccount.id, {
        username: editForm.username,
        fullNameQuad: editForm.fullNameQuad,
        password: editForm.password
      });
      setEditingAccount(null);
    }
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
    <div className="space-y-10 animate-fade-in pb-20 font-['Cairo']">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <div>
            <h2 className="text-2xl font-black text-black dark:text-white tracking-tight">إدارة حسابات الموظفين المختصين</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">معاينة وإدارة صلاحيات الدخول للنظام</p>
          </div>
        </div>
        <div className="relative w-full lg:w-96">
          <input 
            type="text" 
            placeholder="بحث باسم المستخدم، الاسم الرباعي، أو القسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pr-12 pl-4 text-sm font-bold shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
          />
          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
        </div>
      </div>

      {pendingAccounts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
            <h3 className="text-sm font-black uppercase tracking-widest">طلبات التسجيل الجديدة ({pendingAccounts.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingAccounts.map(acc => (
              <div key={acc.id} className="glass-panel p-6 border-2 border-amber-500/20 bg-amber-500/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-black text-xl">
                      {acc.username.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-black dark:text-white">{acc.username}</h4>
                      <p className="text-[10px] font-bold text-slate-500">{acc.fullNameQuad}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">{getModuleLabel(acc.assignedModule)}</p>
                  </div>
                </div>
                <div className="mt-6 flex gap-2 relative z-10">
                  <button 
                    onClick={() => onApprove(acc.id)}
                    className="flex-1 h-10 bg-emerald-500 text-white rounded-xl text-[10px] font-black hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    موافقة وتفعيل
                  </button>
                  <button 
                    onClick={() => onReject(acc.id)}
                    className="flex-1 h-10 bg-amber-500 text-white rounded-xl text-[10px] font-black hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
                  >
                    رفض الطلب
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm(`هل أنت متأكد من حذف طلب ${acc.username} نهائياً؟`)) {
                        onDelete(acc.id);
                      }
                    }}
                    className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
                    title="حذف الطلب نهائياً"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-panel overflow-hidden border-none shadow-xl">
        <div className="bg-indigo-500/10 backdrop-blur-xl border-b border-white/10 px-10 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h3 className="text-sm font-black text-indigo-900 dark:text-indigo-100">الحسابات المسجلة حالياً</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-[8px] font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-0.5">إجمالي الحسابات</p>
              <p className="text-sm font-black text-indigo-900 dark:text-indigo-100">{accounts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">اسم المستخدم</th>
                <th className="px-8 py-4">الاسم الرباعي</th>
                <th className="px-8 py-4">القسم المسؤول عنه</th>
                <th className="px-8 py-4 text-center">آخر دخول</th>
                <th className="px-8 py-4">الحالة</th>
                <th className="px-8 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAccounts.length > 0 ? filteredAccounts.map(acc => (
                <tr key={acc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-lg">
                        {acc.username.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-black dark:text-white">{acc.username}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {new Date(acc.createdAt).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-300">{acc.fullNameQuad || acc.email}</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black">
                      {getModuleLabel(acc.assignedModule)}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {acc.lastLogin || '---'}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black w-fit ${
                        acc.status === 'approved' ? 'bg-emerald-500/20 text-emerald-500' : 
                        acc.status === 'rejected' ? 'bg-rose-500/20 text-rose-500' :
                        'bg-amber-500/20 text-amber-500'
                      }`}>
                        {acc.status === 'approved' ? 'تمت الموافقة' : 
                         acc.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
                      </span>
                      {acc.isBlocked && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black w-fit bg-rose-500/20 text-rose-500">
                          محظور
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center gap-2">
                      {acc.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => onApprove(acc.id)}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                            title="الموافقة على الحساب"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                          </button>
                          <button 
                            onClick={() => onReject(acc.id)}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                            title="رفض الحساب"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        </>
                      )}
                      {acc.isBlocked && (
                        <button 
                          onClick={() => onUnblock(acc.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                          title="إلغاء الحظر"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 11-8 0v4h-8z"></path></svg>
                        </button>
                      )}
                      <button 
                        onClick={() => handleEditClick(acc)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                        title="تعديل الحساب"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(acc)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        title="حذف الحساب"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                      <p className="text-sm font-black italic">لا توجد حسابات مسجلة حالياً</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in text-center">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </div>
            <h3 className="text-xl font-black text-black dark:text-white mb-2">تأكيد الحذف</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-8">
              هل أنت متأكد من حذف حساب <span className="text-rose-500">{deleteConfirmation.username}</span>؟
              <br/>
              <span className="text-xs opacity-75 mt-1 block">سيتم نقل الحساب إلى سلة المهملات ويمكن استعادته لاحقاً.</span>
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirmation(null)}
                className="flex-1 h-12 rounded-xl font-black text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                تراجع
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 h-12 bg-rose-500 text-white rounded-xl font-black hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {editingAccount && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
            <h3 className="text-xl font-black text-black dark:text-white mb-6">تعديل بيانات الحساب</h3>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">اسم المستخدم</label>
                <input 
                  type="text" 
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 text-sm font-bold border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">الاسم الرباعي</label>
                <input 
                  type="text" 
                  value={editForm.fullNameQuad}
                  onChange={(e) => setEditForm({...editForm, fullNameQuad: e.target.value})}
                  className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 text-sm font-bold border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">كلمة المرور الجديدة (اختياري)</label>
                <input 
                  type="text" 
                  value={editForm.password}
                  onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                  placeholder="اتركه فارغاً للإبقاء على كلمة المرور الحالية"
                  className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 text-sm font-bold border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setEditingAccount(null)}
                  className="flex-1 h-12 rounded-xl font-black text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  className="flex-1 h-12 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
                >
                  حفظ التغييرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;
