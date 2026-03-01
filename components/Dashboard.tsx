
import React from 'react';
import { motion } from 'motion/react';
import { Transaction, FinancialSummary, User, CurrentUserProfile } from '../types';

interface DashboardProps {
  summary: FinancialSummary;
  transactions: Transaction[];
  users: User[];
  currentUser: CurrentUserProfile;
  onViewUser: (user: User) => void;
  onTabChange: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ summary, transactions, users, currentUser, onViewUser, onTabChange }) => {
  const mainActions = [
    { 
      id: 'users', 
      label: 'بيانات الموظفين', 
      desc: 'إدارة السجلات والملفات الوظيفية',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      color: 'indigo' 
    },
    { 
      id: 'transfers', 
      label: 'النقل الداخلي والخارجي', 
      desc: 'إدارة طلبات النقل والتدوير الوظيفي',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      color: 'emerald' 
    },
    { 
      id: 'contracts', 
      label: 'العقود والتعيينات', 
      desc: 'متابعة عقود الموظفين وتواريخ التثبيت',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'rose' 
    },
    { 
      id: 'transactions', 
      label: 'رواتب الموظفين', 
      desc: 'إدارة صرف الرواتب والمنح المالية',
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
      color: 'indigo' 
    },
    { 
      id: 'permanent-employees', 
      label: 'الملاك', 
      desc: 'عرض وإدارة سجلات الموظفين على الملاك الدائم',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      color: 'cyan' 
    },
    { 
      id: 'barcode', 
      label: 'نظام الباركود', 
      desc: 'مسح وتوليد الباركود لتعريف الموظفين',
      icon: 'M12 4v1m-3 3v2m3-3v2m3-3v2m-9 4h12M5 8h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2z',
      color: 'slate' 
    },
    { 
      id: 'secondment', 
      label: 'حركة التنسيب', 
      desc: 'إدارة تنسيب الموظفين بين الأقسام والمواقع',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      color: 'amber' 
    },
    { 
      id: 'degree-calculation', 
      label: 'احتساب الشهادات', 
      desc: 'تقييم واحتساب الشهادات الدراسية الجديدة للموظفين',
      icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
      color: 'indigo' 
    },
    { 
      id: 'official-missions', 
      label: 'الايفادات', 
      desc: 'إدارة وتوثيق الإيفادات الرسمية والمهمات الخارجية',
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'emerald' 
    },
    { 
      id: 'promotions', 
      label: 'الترقيات', 
      desc: 'إدارة استحقاقات الترقية والترفيع الوظيفي للموظفين',
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      color: 'rose' 
    },
    { 
      id: 'leaves', 
      label: 'الاجازات', 
      desc: 'إدارة طلبات الإجازات السنوية والمرضية والاضطرارية',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      color: 'sky' 
    },
    { 
      id: 'training-courses', 
      label: 'الدورات التدريبية', 
      desc: 'متابعة وتوثيق الدورات التطويرية والورش التدريبية للكادر',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      color: 'violet' 
    }
  ].filter(action => {
    if (currentUser?.role === 'المالك') return true;
    if (currentUser?.assignedModule) return action.id === currentUser.assignedModule;
    return true;
  });

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-black dark:text-white tracking-tight">الرئيسية</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">نظرة عامة على القوى العاملة والعمليات الإدارية.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mainActions.map((action, index) => (
          <motion.button
            key={action.id}
            onClick={() => onTabChange(action.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="pro-card p-6 flex items-center gap-5 text-right hover:border-purple-500 group transition-all relative overflow-hidden"
          >
            <motion.div 
              className={`w-14 h-14 rounded-2xl liquid-btn-primary flex items-center justify-center transition-all`}
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={action.icon}></path>
              </svg>
            </motion.div>
            <div>
              <h4 className="text-lg font-black text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{action.label}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">{action.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
