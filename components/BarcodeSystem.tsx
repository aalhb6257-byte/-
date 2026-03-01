
import React, { useState } from 'react';
import Barcode from 'react-barcode';
import { User } from '../types';

interface BarcodeSystemProps {
  users: User[];
}

const BarcodeSystem: React.FC<BarcodeSystemProps> = ({ users }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const selectedUser = users.find(u => u.id === selectedUserId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center no-print">
        <div>
          <h2 className="text-3xl font-black text-black dark:text-white tracking-tight">نظام الباركود الذكي</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">توليد باركود تعريفي للموظفين لسهولة الوصول والتحقق.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 no-print">
        <div className="lg:col-span-1 space-y-6">
          <div className="pro-card p-8">
            <h3 className="text-lg font-black text-black dark:text-white mb-6">اختر الموظف</h3>
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
            
            {selectedUser && (
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/10 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black">
                    {selectedUser.avatar ? <img src={selectedUser.avatar} className="w-full h-full object-cover rounded-xl" /> : selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-black text-black dark:text-white">{selectedUser.fullNameQuad}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{selectedUser.role}</p>
                  </div>
                </div>
                <button 
                  onClick={handlePrint}
                  className="w-full py-4 rounded-2xl font-black text-xs liquid-btn-primary text-white flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                  طباعة الباركود
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedUser ? (
            <div className="pro-card p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="bg-white p-10 rounded-[2rem] shadow-inner border-2 border-slate-50 flex flex-col items-center">
                <h4 className="text-xl font-black text-black mb-6">{selectedUser.fullNameQuad}</h4>
                <div className="p-4 bg-white">
                  <Barcode 
                    value={selectedUser.id} 
                    width={2} 
                    height={100} 
                    fontSize={14}
                    background="#ffffff"
                  />
                </div>
                <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المعرف الوظيفي: {selectedUser.id}</p>
              </div>
              <p className="mt-8 text-sm text-slate-500 font-medium max-w-md">
                يمكن استخدام هذا الباركود في أجهزة البصمة، أو للتحقق من الهوية عند الدخول للمنشأة.
              </p>
            </div>
          ) : (
            <div className="pro-card p-12 flex flex-col items-center justify-center min-h-[400px] opacity-50">
              <svg className="w-20 h-20 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v1m-3 3v2m3-3v2m3-3v2m-9 4h12M5 8h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2z"></path></svg>
              <p className="text-lg font-black text-slate-400">يرجى اختيار موظف لتوليد الباركود</p>
            </div>
          )}
        </div>
      </div>

      {/* Print View */}
      <div className="hidden print:block text-center p-20">
        {selectedUser && (
          <div className="inline-block border-4 border-black p-10 rounded-3xl">
            <h2 className="text-2xl font-black mb-4">{selectedUser.fullNameQuad}</h2>
            <p className="text-lg font-bold mb-6">{selectedUser.department} - {selectedUser.role}</p>
            <div className="flex justify-center">
              <Barcode value={selectedUser.id} width={3} height={150} />
            </div>
            <p className="mt-6 font-black">ID: {selectedUser.id}</p>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          .print\\:block {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BarcodeSystem;
