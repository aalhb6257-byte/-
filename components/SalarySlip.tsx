
import React, { useState } from 'react';
import { User, SalarySlip } from '../types';

interface SalarySlipProps {
  users: User[];
  onSave: (slip: SalarySlip) => void;
  onClose: () => void;
  initialUserId?: string;
}

const SalarySlipComponent: React.FC<SalarySlipProps> = ({ users, onSave, onClose, initialUserId }) => {
  const [selectedUserId, setSelectedUserId] = useState(initialUserId || '');
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState<Omit<SalarySlip, 'id' | 'timestamp' | 'totalAllowances' | 'totalDeductions' | 'netSalary'>>(() => {
    const initialUser = users.find(u => u.id === initialUserId);
    return {
      employeeId: initialUser?.id || '',
      employeeName: initialUser ? (initialUser.fullNameQuad || initialUser.name) : '',
      month: new Date().getMonth() + 1 + '',
      year: new Date().getFullYear() + '',
      jobTitle: initialUser?.role || '',
      education: initialUser?.education || '',
      maritalStatus: 'متزوج',
      childrenCount: 0,
      servicePeriod: '',
      bankAccount: '',
      bankName: 'مصرف TBI للتجارة',
      basicSalary: initialUser?.salary || 0,
      allowances: {
        certificate: 0,
        professionalRisks: 0,
        special: 0,
        marital: 0,
        children: 0,
        location: 0,
        previousCarryover: 0,
        differences: 0,
      },
      deductions: {
        pension: 0,
        socialSecurity: 0,
        carryoverDeduction: 0,
        bills: [
          { label: 'فاتورة شرائح 07833389788', amount: 0 },
          { label: 'فاتورة شرائح 07833389819', amount: 0 }
        ],
      }
    };
  });

  const handleUserChange = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUserId(userId);
      setFormData(prev => ({
        ...prev,
        employeeId: user.id,
        employeeName: user.fullNameQuad || user.name,
        jobTitle: user.role,
        education: user.education,
        basicSalary: user.salary || 0,
      }));
    }
  };

  const calculateTotals = () => {
    const allowancesSum = 
      formData.allowances.certificate + 
      formData.allowances.professionalRisks + 
      formData.allowances.special + 
      formData.allowances.marital + 
      formData.allowances.children + 
      formData.allowances.location + 
      formData.allowances.previousCarryover + 
      formData.allowances.differences +
      formData.basicSalary;

    const deductionsSum = 
      formData.deductions.pension + 
      formData.deductions.socialSecurity + 
      formData.deductions.carryoverDeduction + 
      formData.deductions.bills.reduce((sum, b) => sum + b.amount, 0);

    return {
      totalAllowances: allowancesSum,
      totalDeductions: deductionsSum,
      netSalary: allowancesSum - deductionsSum
    };
  };

  const totals = calculateTotals();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm no-print">
      <div className="bg-white dark:bg-slate-800 w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100 dark:border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-black text-black dark:text-white">منشئ قصاصة الرواتب</h2>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowPreview(!showPreview)}
              className="px-6 py-2.5 rounded-xl font-black text-xs liquid-btn-primary text-white"
            >
              {showPreview ? 'تعديل البيانات' : 'معاينة القصاصة'}
            </button>
            <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-rose-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18"></path></svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {!showPreview ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Employee Selection */}
              <div className="md:col-span-3 space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">اختر الموظف</label>
                <select 
                  value={selectedUserId} 
                  onChange={(e) => handleUserChange(e.target.value)}
                  className="w-full h-12 liquid-input p-4 text-xs font-black"
                >
                  <option value="">-- اختر موظفاً --</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.fullNameQuad || u.name}</option>)}
                </select>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-indigo-500 border-b border-indigo-500/20 pb-2">المعلومات الأساسية</h3>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase">العنوان الوظيفي</label>
                  <input type="text" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} className="w-full h-10 liquid-input px-4 text-xs font-bold" />
                  
                  <label className="text-[10px] font-black text-slate-400 uppercase">التحصيل الدراسي</label>
                  <input type="text" value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} className="w-full h-10 liquid-input px-4 text-xs font-bold" />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase">الحالة الزوجية</label>
                      <input type="text" value={formData.maritalStatus} onChange={e => setFormData({...formData, maritalStatus: e.target.value})} className="w-full h-10 liquid-input px-4 text-xs font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase">عدد الأولاد</label>
                      <input type="number" value={formData.childrenCount} onChange={e => setFormData({...formData, childrenCount: parseInt(e.target.value) || 0})} className="w-full h-10 liquid-input px-4 text-xs font-bold" />
                    </div>
                  </div>

                  <label className="text-[10px] font-black text-slate-400 uppercase">مدة الخدمة</label>
                  <input type="text" placeholder="مثال: 3 سنة / 1 شهر / 16 يوم" value={formData.servicePeriod} onChange={e => setFormData({...formData, servicePeriod: e.target.value})} className="w-full h-10 liquid-input px-4 text-xs font-bold" />
                </div>
              </div>

              {/* Allowances */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-emerald-500 border-b border-emerald-500/20 pb-2">المخصصات (د.ع)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400">الراتب الاسمي</label>
                    <input type="number" value={formData.basicSalary} onChange={e => setFormData({...formData, basicSalary: parseInt(e.target.value) || 0})} className="w-32 h-8 liquid-input px-2 text-xs font-bold text-left" />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400">شهادة</label>
                    <input type="number" value={formData.allowances.certificate} onChange={e => setFormData({...formData, allowances: {...formData.allowances, certificate: parseInt(e.target.value) || 0}})} className="w-32 h-8 liquid-input px-2 text-xs font-bold text-left" />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400">مخاطر مهنية</label>
                    <input type="number" value={formData.allowances.professionalRisks} onChange={e => setFormData({...formData, allowances: {...formData.allowances, professionalRisks: parseInt(e.target.value) || 0}})} className="w-32 h-8 liquid-input px-2 text-xs font-bold text-left" />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400">مخصص خاص</label>
                    <input type="number" value={formData.allowances.special} onChange={e => setFormData({...formData, allowances: {...formData.allowances, special: parseInt(e.target.value) || 0}})} className="w-32 h-8 liquid-input px-2 text-xs font-bold text-left" />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400">زوجية</label>
                    <input type="number" value={formData.allowances.marital} onChange={e => setFormData({...formData, allowances: {...formData.allowances, marital: parseInt(e.target.value) || 0}})} className="w-32 h-8 liquid-input px-2 text-xs font-bold text-left" />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400">أطفال</label>
                    <input type="number" value={formData.allowances.children} onChange={e => setFormData({...formData, allowances: {...formData.allowances, children: parseInt(e.target.value) || 0}})} className="w-32 h-8 liquid-input px-2 text-xs font-bold text-left" />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400">موقع</label>
                    <input type="number" value={formData.allowances.location} onChange={e => setFormData({...formData, allowances: {...formData.allowances, location: parseInt(e.target.value) || 0}})} className="w-32 h-8 liquid-input px-2 text-xs font-bold text-left" />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400">فروقات</label>
                    <input type="number" value={formData.allowances.differences} onChange={e => setFormData({...formData, allowances: {...formData.allowances, differences: parseInt(e.target.value) || 0}})} className="w-32 h-8 liquid-input px-2 text-xs font-bold text-left" />
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-rose-500 border-b border-rose-500/20 pb-2">الاستقطاعات (د.ع)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400">تقاعد</label>
                    <input type="number" value={formData.deductions.pension} onChange={e => setFormData({...formData, deductions: {...formData.deductions, pension: parseInt(e.target.value) || 0}})} className="w-32 h-8 liquid-input px-2 text-xs font-bold text-left" />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400">حماية اجتماعية</label>
                    <input type="number" value={formData.deductions.socialSecurity} onChange={e => setFormData({...formData, deductions: {...formData.deductions, socialSecurity: parseInt(e.target.value) || 0}})} className="w-32 h-8 liquid-input px-2 text-xs font-bold text-left" />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400">مدور مستقطع</label>
                    <input type="number" value={formData.deductions.carryoverDeduction} onChange={e => setFormData({...formData, deductions: {...formData.deductions, carryoverDeduction: parseInt(e.target.value) || 0}})} className="w-32 h-8 liquid-input px-2 text-xs font-bold text-left" />
                  </div>
                  
                  {formData.deductions.bills.map((bill, idx) => (
                    <div key={idx} className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400">{bill.label}</label>
                      <input 
                        type="number" 
                        value={bill.amount} 
                        onChange={e => {
                          const newBills = [...formData.deductions.bills];
                          newBills[idx].amount = parseInt(e.target.value) || 0;
                          setFormData({...formData, deductions: {...formData.deductions, bills: newBills}});
                        }} 
                        className="w-full h-8 liquid-input px-2 text-xs font-bold text-left" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Salary Slip Preview (The actual design from the image) */
            <div id="salary-slip-print" className="bg-white p-10 text-black font-serif border-[3px] border-black max-w-[1000px] mx-auto">
              {/* Header */}
              <div className="grid grid-cols-3 border-b-2 border-black mb-4 pb-2 text-center items-center">
                <div className="text-sm font-bold">رقم البصمة / </div>
                <div className="text-lg font-black">الشركة العامة لتوزيع كهرباء الجنوب / فرع البصرة</div>
                <div className="text-sm font-bold">معتز رواتب</div>
              </div>

              <div className="grid grid-cols-3 border-b-2 border-black mb-4 pb-2 text-center items-center">
                <div className="text-lg font-black">{formData.year} / {formData.month}</div>
                <div className="text-lg font-black">حي الاصدقاء</div>
                <div className="text-sm font-bold"></div>
              </div>

              {/* Employee Info Grid */}
              <div className="grid grid-cols-3 border-2 border-black mb-6">
                <div className="border-l-2 border-black p-2 text-center">
                  <p className="text-xs font-bold mb-1">الخدمة / {formData.servicePeriod}</p>
                </div>
                <div className="border-l-2 border-black p-2 text-center">
                  <p className="text-sm font-black">{formData.jobTitle}</p>
                </div>
                <div className="p-2 text-center">
                  <p className="text-xs font-bold mb-1">206891118</p>
                  <p className="text-lg font-black">{formData.employeeName}</p>
                </div>

                <div className="border-t-2 border-l-2 border-black p-2 text-center">
                  <p className="text-sm font-bold">{formData.bankAccount || 'IQ30TRIQ994005510517001'}</p>
                </div>
                <div className="border-t-2 border-l-2 border-black p-2 text-center">
                  <p className="text-sm font-black">{formData.maritalStatus} | الاولاد {formData.childrenCount}</p>
                </div>
                <div className="border-t-2 border-black p-2 text-center">
                  <p className="text-sm font-black">{formData.education}</p>
                </div>

                <div className="border-t-2 border-l-2 border-black p-2 text-center">
                  <p className="text-sm font-black">{formData.bankName}</p>
                </div>
                <div className="border-t-2 border-l-2 border-black p-2 text-center">
                  <p className="text-sm font-black">راتب متأخر {formData.allowances.previousCarryover}</p>
                </div>
                <div className="border-t-2 border-black p-2 text-center">
                  <p className="text-sm font-black">د/7 م/4 | راتب مستحق {formData.basicSalary}</p>
                </div>
              </div>

              {/* Details Tables */}
              <div className="grid grid-cols-2 gap-4">
                {/* Allowances Table */}
                <div className="border-2 border-black">
                  <div className="bg-slate-100 border-b-2 border-black p-1 text-center font-black">المخصصات</div>
                  <div className="grid grid-cols-3 text-center text-xs font-bold">
                    <div className="border-l border-black p-1">شهادة</div>
                    <div className="border-l border-black p-1">%25</div>
                    <div className="p-1">{formData.allowances.certificate.toLocaleString()}</div>
                    
                    <div className="border-t border-l border-black p-1">مخاطر مهنية</div>
                    <div className="border-t border-l border-black p-1">%57</div>
                    <div className="border-t border-black p-1">{formData.allowances.professionalRisks.toLocaleString()}</div>
                    
                    <div className="border-t border-l border-black p-1">مخصص خاص</div>
                    <div className="border-t border-l border-black p-1">%30</div>
                    <div className="border-t border-black p-1">{formData.allowances.special.toLocaleString()}</div>
                    
                    <div className="border-t border-l border-black p-1">زوجية</div>
                    <div className="border-t border-l border-black p-1"></div>
                    <div className="border-t border-black p-1">{formData.allowances.marital.toLocaleString()}</div>
                    
                    <div className="border-t border-l border-black p-1">اطفال</div>
                    <div className="border-t border-l border-black p-1"></div>
                    <div className="border-t border-black p-1">{formData.allowances.children.toLocaleString()}</div>
                    
                    <div className="border-t border-l border-black p-1">موقع</div>
                    <div className="border-t border-l border-black p-1"></div>
                    <div className="border-t border-black p-1">{formData.allowances.location.toLocaleString()}</div>
                    
                    <div className="border-t border-l border-black p-1">مدور سابق</div>
                    <div className="border-t border-l border-black p-1"></div>
                    <div className="border-t border-black p-1">{formData.allowances.previousCarryover.toLocaleString()}</div>
                    
                    <div className="border-t border-l border-black p-1 bg-slate-50 font-black">المجموع</div>
                    <div className="border-t border-l border-black p-1 bg-slate-50"></div>
                    <div className="border-t border-black p-1 bg-slate-50 font-black">{(totals.totalAllowances - formData.basicSalary - formData.allowances.differences).toLocaleString()}</div>
                    
                    <div className="border-t border-l border-black p-1">ت . راتب اسمي</div>
                    <div className="border-t border-l border-black p-1"></div>
                    <div className="border-t border-black p-1">{formData.basicSalary.toLocaleString()}</div>
                    
                    <div className="border-t border-l border-black p-1">فروقات</div>
                    <div className="border-t border-l border-black p-1"></div>
                    <div className="border-t border-black p-1">{formData.allowances.differences.toLocaleString()}</div>
                  </div>
                </div>

                {/* Deductions Table */}
                <div className="border-2 border-black h-fit">
                  <div className="grid grid-cols-3 bg-slate-100 border-b-2 border-black p-1 text-center font-black">
                    <div>متبقي</div>
                    <div className="border-x border-black">استقطاع</div>
                    <div>رمز</div>
                  </div>
                  <div className="grid grid-cols-3 text-center text-xs font-bold">
                    <div className="border-l border-black p-1"></div>
                    <div className="border-l border-black p-1">{formData.deductions.pension.toLocaleString()}</div>
                    <div className="p-1">تقاعد</div>
                    
                    <div className="border-t border-l border-black p-1"></div>
                    <div className="border-t border-l border-black p-1">{formData.deductions.socialSecurity.toLocaleString()}</div>
                    <div className="border-t border-black p-1">حماية اجتماعية</div>
                    
                    <div className="border-t border-l border-black p-1"></div>
                    <div className="border-t border-l border-black p-1">{formData.deductions.carryoverDeduction.toLocaleString()}</div>
                    <div className="border-t border-black p-1">مدور مستقطع</div>
                    
                    {formData.deductions.bills.map((bill, i) => (
                      <React.Fragment key={i}>
                        <div className="border-t border-l border-black p-1">0</div>
                        <div className="border-t border-l border-black p-1">{bill.amount.toLocaleString()}</div>
                        <div className="border-t border-black p-1">{bill.label}</div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Totals */}
              <div className="grid grid-cols-3 border-2 border-black mt-6 text-center font-black">
                <div className="border-l-2 border-black p-2 bg-slate-50">
                  <p className="text-xs mb-1">الصافي</p>
                  <p className="text-lg">{totals.netSalary.toLocaleString()}</p>
                </div>
                <div className="border-l-2 border-black p-2 bg-slate-50">
                  <p className="text-xs mb-1">مجموع الاستقطاعات</p>
                  <p className="text-lg">{totals.totalDeductions.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-slate-50">
                  <p className="text-xs mb-1">الاجمالي</p>
                  <p className="text-lg">{totals.totalAllowances.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-slate-100 dark:border-white/10 flex justify-end gap-4 no-print">
          <button onClick={onClose} className="px-8 py-3 rounded-2xl font-black text-xs text-slate-500 hover:bg-slate-100 transition-all">إغلاق</button>
          {showPreview && (
            <button 
              onClick={handlePrint}
              className="px-8 py-3 rounded-2xl font-black text-xs bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              طباعة القصاصة
            </button>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #salary-slip-print, #salary-slip-print * {
            visibility: visible;
          }
          #salary-slip-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            border: 3px solid black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SalarySlipComponent;
