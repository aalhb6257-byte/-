
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import TransactionList from './components/TransactionList';
import UserManagement from './components/UserManagement';
import EmployeeProfile from './components/EmployeeProfile';
import ReportView from './components/ReportView';
import RecordsList from './components/RecordsList';
import TrashBin from './components/TrashBin';
import UserProfileEdit from './components/UserProfileEdit';
import AccountManagement from './components/AccountManagement';
import ContractsView from './components/ContractsView';
import PermanentEmployeesView from './components/PermanentEmployeesView';
import BarcodeSystem from './components/BarcodeSystem';
import SecondmentView from './components/SecondmentView';
import DegreeCalculationView from './components/DegreeCalculationView';
import OfficialMissionsView from './components/OfficialMissionsView';
import PromotionsView from './components/PromotionsView';
import LeavesView from './components/LeavesView';
import TrainingCoursesView from './components/TrainingCoursesView';
import TransfersView from './components/TransfersView';
import TaskManager from './components/TaskManager';
import Login from './components/Login';
import { supabase } from './src/lib/supabase';
import { Transaction, TransactionType, FinancialSummary, User, GeneratedReport, ActivityLog, CurrentUserProfile, SpecialistAccount, Task, TransferRecord, ContractRecord } from './types';

const INITIAL_DATA: Transaction[] = [
  { id: '1', date: '2023-10-01', description: 'راتب شهر أكتوبر - علي خضر', category: 'رواتب', amount: 15000, type: TransactionType.EXPENSE },
  { id: '2', date: '2023-10-02', description: 'إيجار المكتب', category: 'سكن', amount: 3000, type: TransactionType.EXPENSE },
  { id: '3', date: '2023-10-05', description: 'إيداع مبيعات', category: 'دخل', amount: 25000, type: TransactionType.INCOME },
];

const DEFAULT_PROFILE: CurrentUserProfile = {
  name: 'علي خضر',
  role: 'مدير النظام',
  email: 'ali.khadr@example.com',
  avatar: null,
  phone: '+966 50 123 4567',
  bio: 'مدير مالي وإداري خبير، مسؤول عن إدارة القوى العاملة والتدفقات المالية للنظام.',
  themeColor: '79 70 229', // Indigo
  language: 'ar',
  isDarkMode: false
};

const INITIAL_USERS: User[] = [
  { 
    id: 'u1', 
    name: 'علي خضر', 
    fullNameQuad: 'علي خضر بن حسن آل علي',
    motherNameTriple: 'سارة بنت محمد حسن',
    gender: 'ذكر',
    birthDate: '1985-05-15',
    education: 'ماجستير إدارة أعمال',
    preciseSpecialization: 'إدارة استراتيجية',
    appointmentDateContract: '2022-12-01',
    appointmentDatePermanent: '2023-01-01',
    email: 'ali.khadr@example.com', 
    role: 'مدير', 
    status: 'نشط', 
    joinDate: '2023-01-01',
    phone: '+966 50 123 4567',
    department: 'الإدارة العليا',
    salary: 15000,
    address: 'الرياض، حي العليا',
    biography: 'خبير مالي وإداري بخبرة تمتد لأكثر من 15 عاماً في قيادة التحول الرقمي للمؤسسات.',
    notes: 'المدير التنفيذي للنظام.'
  },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('zad_is_authenticated') === 'true';
  });

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        const user = session.user;
        setCurrentUser(prev => ({
          ...prev,
          name: user.user_metadata.full_name || user.email?.split('@')[0] || 'مستخدم',
          email: user.email || '',
          avatar: user.user_metadata.avatar_url || null,
          role: user.email === 'ali.khadr@example.com' ? 'المالك' : 'موظف'
        }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        const user = session.user;
        setCurrentUser(prev => ({
          ...prev,
          name: user.user_metadata.full_name || user.email?.split('@')[0] || 'مستخدم',
          email: user.email || '',
          avatar: user.user_metadata.avatar_url || null,
          role: user.email === 'ali.khadr@example.com' ? 'المالك' : 'موظف'
        }));
      } else {
        setIsAuthenticated(false);
        setCurrentUser(DEFAULT_PROFILE);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  const [currentUser, setCurrentUser] = useState<CurrentUserProfile>(() => {
    try {
      const saved = localStorage.getItem('zad_current_user');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && 'role' in parsed) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error loading saved user profile:", e);
    }
    return DEFAULT_PROFILE;
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [trashTransactions, setTrashTransactions] = useState<Transaction[]>([]);
  const [trashUsers, setTrashUsers] = useState<User[]>([]);
  const [trashSpecialistAccounts, setTrashSpecialistAccounts] = useState<SpecialistAccount[]>([]);
  const [reportsHistory, setReportsHistory] = useState<GeneratedReport[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [specialistAccounts, setSpecialistAccounts] = useState<SpecialistAccount[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [transfers, setTransfers] = useState<TransferRecord[]>([]);
  const [contractRecords, setContractRecords] = useState<ContractRecord[]>([]);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (response.ok) {
          const data = await response.json();
          if (data.users) setUsers(data.users);
          if (data.transactions) setTransactions(data.transactions);
          if (data.logs) setActivityLogs(data.logs);
          if (data.accounts) setSpecialistAccounts(data.accounts);
          if (data.tasks) setTasks(data.tasks);
          if (data.transfers) setTransfers(data.transfers);
          if (data.contractRecords) setContractRecords(data.contractRecords);
          if (data.trashSpecialistAccounts) setTrashSpecialistAccounts(data.trashSpecialistAccounts);
          // Load other data if added to DB
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsDataLoaded(true);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!isDataLoaded) return;

    const saveData = async () => {
      try {
        await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            users,
            transactions,
            logs: activityLogs,
            accounts: specialistAccounts,
            tasks,
            transfers,
            contractRecords,
            trashSpecialistAccounts
          })
        });
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };

    const timeoutId = setTimeout(saveData, 1000); // Debounce 1s
    return () => clearTimeout(timeoutId);
  }, [users, transactions, activityLogs, specialistAccounts, tasks, transfers, contractRecords, trashSpecialistAccounts, isDataLoaded]);

  useEffect(() => {
    localStorage.setItem('zad_is_authenticated', isAuthenticated.toString());
    localStorage.setItem('zad_current_user', JSON.stringify(currentUser));
  }, [isAuthenticated, currentUser]);

  const addLog = (action: string, category: ActivityLog['category'], details: string) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString('ar-SA'),
      user: currentUser.name,
      action,
      category,
      details
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const handleLogin = async (username: string, role: string, assignedModule?: string, avatar?: string | null) => {
    setIsAuthenticated(true);
    
    let finalAvatar = avatar || null;
    let displayName = username;
    
    // If owner, try to find their avatar in the users list
    if (role === 'المالك') {
      const ownerUser = users.find(u => u.name === 'علي خضر');
      if (ownerUser?.avatar) {
        finalAvatar = ownerUser.avatar;
      }
      displayName = 'علي خضر';
    }

    // If specialist, try to find their full name and avatar
    if (role === 'موظف مختص') {
      const account = specialistAccounts.find(acc => acc.username === username);
      if (account) {
        displayName = account.fullNameQuad || username;
        if (!finalAvatar && account.avatar) {
          finalAvatar = account.avatar;
        }
      }
    }

    const profile: CurrentUserProfile = {
      ...DEFAULT_PROFILE,
      name: displayName,
      username: username,
      role: role,
      assignedModule: assignedModule,
      avatar: finalAvatar
    };
    setCurrentUser(profile);
    localStorage.setItem('zad_current_user', JSON.stringify(profile));
    
    // Redirect specialist to their assigned module
    if (role === 'موظف مختص' && assignedModule) {
      setActiveTab(assignedModule);
    } else {
      setActiveTab('dashboard');
    }
    
    // Update last login for specialist accounts
    if (role === 'موظف مختص') {
      setSpecialistAccounts(prev => prev.map(acc => 
        acc.username === username ? { ...acc, lastLogin: new Date().toLocaleString('ar-SA') } : acc
      ));
    }
    
    addLog('تسجيل دخول ناجح', 'نظام', `قام المستخدم ${username} بالدخول للنظام بصلاحية: ${role}${assignedModule ? ` (قسم: ${assignedModule})` : ''}.`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentUser(DEFAULT_PROFILE);
    addLog('تسجيل خروج', 'نظام', `تم إنهاء الجلسة الحالية يدوياً.`);
  };

  const updateTheme = (color: string) => {
    setCurrentUser(prev => ({ ...prev, themeColor: color }));
    addLog('تغيير مظهر النظام', 'نظام', `تم تغيير لون العلامة التجارية للنظام.`);
    toast.success('تم تغيير لون المظهر بنجاح');
  };

  const toggleLanguage = () => {
    setCurrentUser(prev => ({ ...prev, language: prev.language === 'ar' ? 'en' : 'ar' }));
    addLog('تغيير اللغة', 'نظام', `تم تغيير لغة واجهة النظام.`);
    toast.success('تم تغيير اللغة بنجاح');
  };

  const toggleDarkMode = () => {
    setCurrentUser(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
    addLog('تغيير وضع المظهر', 'نظام', `تم التبديل بين الوضع الليلي والنهاري.`);
    toast.success('تم تغيير وضع المظهر بنجاح');
  };

  useEffect(() => {
    if (currentUser.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.dir = currentUser.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentUser.language || 'ar';
  }, [currentUser.isDarkMode, currentUser.language]);

  const summary = useMemo<FinancialSummary>(() => {
    const totalIncome = transactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome, totalExpenses, netProfit: totalIncome - totalExpenses, transactionsCount: transactions.length };
  }, [transactions]);

  const isOwner = currentUser.role === 'المالك';

  const addUser = (newUser: Omit<User, 'joinDate' | 'status'>) => {
    if (!isOwner) return;
    const userWithId: User = { 
      ...newUser, 
      joinDate: new Date().toISOString().split('T')[0], 
      status: 'نشط' 
    } as User;
    setUsers(prev => [userWithId, ...prev]);
    addLog('إضافة موظف', 'إداري', `تم تسجيل الموظف: ${newUser.fullNameQuad}`);
    toast.success('تم إضافة الموظف بنجاح');
  };

  const softDeleteUsers = (ids: string[]) => {
    if (!isOwner) return;
    const usersToDelete = users.filter(u => ids.includes(u.id));
    if (usersToDelete.length > 0) {
      setUsers(users.filter(u => !ids.includes(u.id)));
      const deletedAt = new Date().toLocaleString('ar-SA');
      const movedToTrash = usersToDelete.map(u => ({ ...u, deletedAt }));
      setTrashUsers([...movedToTrash, ...trashUsers]);
      addLog('حذف موظفين', 'سلة المهملات', `تم نقل ${ids.length} موظف إلى السلة.`);
      toast.success(`تم نقل ${ids.length} موظف إلى السلة`);
    }
  };

  const updateUser = (id: string, updatedData: Partial<User>) => {
    if (!isOwner) return;
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedData } : u));
    addLog('تحديث بيانات موظف', 'إداري', `تم تعديل بيانات الملف الوظيفي للمعرف ${id}`);
    toast.success('تم تحديث بيانات الموظف بنجاح');
  };

  const handleImportDatabase = (data: any) => {
    if (!isOwner) return;
    try {
      if (data.users) setUsers(data.users);
      if (data.transactions) setTransactions(data.transactions);
      if (data.activityLogs) setActivityLogs(data.activityLogs);
      if (data.specialistAccounts) setSpecialistAccounts(data.specialistAccounts);
      addLog('استيراد بيانات', 'نظام', 'تم استيراد قاعدة البيانات بنجاح من ملف خارجي.');
      toast.success('تم استيراد البيانات بنجاح!');
    } catch (e) {
      toast.error('خطأ في تنسيق ملف البيانات المستورد.');
    }
  };

  const handleExportDatabase = () => {
    const data = {
      users: users,
      transactions: transactions,
      activityLogs: activityLogs,
      specialistAccounts: specialistAccounts,
      trashSpecialistAccounts: trashSpecialistAccounts,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `نسخة_احتياطية_كاملة_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    addLog('تصدير قاعدة البيانات', 'نظام', 'تم إنشاء نسخة احتياطية كاملة وتحميلها.');
    toast.success('تم إنشاء النسخة الاحتياطية وتحميلها بنجاح');
  };

  const handleProfileSave = (updated: CurrentUserProfile) => {
    setCurrentUser(updated);
    
    // Persist to specialistAccounts if current user is a specialist
    if (currentUser.role === 'موظف مختص') {
      setSpecialistAccounts(prev => prev.map(acc => 
        acc.username === currentUser.username ? { ...acc, avatar: updated.avatar, fullNameQuad: updated.name, email: updated.email } : acc
      ));
    }
    
    // Persist to users if current user is the owner (ali khadr)
    if (currentUser.role === 'المالك') {
      setUsers(prev => prev.map(u => 
        u.name === 'علي خضر' ? { ...u, avatar: updated.avatar, fullNameQuad: updated.name, email: updated.email } : u
      ));
    }
    
    addLog('تحديث الملف الشخصي', 'نظام', `قام المستخدم ${currentUser.name} بتحديث بياناته الشخصية.`);
    toast.success('تم حفظ التعديلات بنجاح');
  };

  const renderContent = () => {
    if (activeTab === 'employee-profile' && selectedUser) {
      return (
        <EmployeeProfile 
          user={selectedUser} 
          onBack={() => { setActiveTab('users'); setSelectedUser(null); }} 
          onEdit={(id) => { 
            if (isOwner) {
              setEditingUserId(id); 
              setActiveTab('users'); 
              setSelectedUser(null); 
            } else {
              toast.error('عذراً، لا تملك صلاحية تعديل بيانات الموظفين.');
            }
          }}
          transactions={transactions} 
          isReadOnly={!isOwner}
        />
      );
    }
    switch (activeTab) {
      case 'dashboard': 
        return isOwner ? (
          <Dashboard 
            summary={summary} 
            transactions={transactions} 
            users={users} 
            onViewUser={user => { setSelectedUser(user); setActiveTab('employee-profile'); }} 
            onTabChange={setActiveTab} 
          />
        ) : (
          <EmployeeDashboard 
            currentUser={currentUser} 
            activityLogs={activityLogs} 
            users={users}
            onTabChange={setActiveTab}
          />
        );
      case 'transactions': return (
        <TransactionList 
          transactions={transactions} 
          users={users} 
          onAdd={(t) => isOwner && setTransactions([{...t, id: Math.random().toString(36).substr(2, 9)}, ...transactions])} 
          onDelete={(id) => isOwner && setTransactions(transactions.filter(t => t.id !== id))} 
          onUpdateUser={updateUser} 
          isReadOnly={!isOwner}
        />
      );
      case 'users': return (
        <UserManagement 
          users={users} 
          onAdd={addUser} 
          onUpdate={updateUser} 
          onDelete={(id) => softDeleteUsers([id])} 
          onDeleteMultiple={softDeleteUsers}
          onToggleStatus={id => isOwner && setUsers(users.map(u => u.id === id ? {...u, status: u.status === 'نشط' ? 'معطل' : 'نشط'} : u))} 
          onViewProfile={user => { setSelectedUser(user); setActiveTab('employee-profile'); }} 
          editUserId={editingUserId}
          onImportDatabase={handleImportDatabase}
          isReadOnly={!isOwner}
        />
      );
      case 'reports': return <ReportView summary={summary} transactions={transactions} users={users} reportsHistory={reportsHistory} onSaveReport={r => isOwner && setReportsHistory([{...r, id: `ZD-${Date.now()}`}, ...reportsHistory])} currentUser={currentUser} isReadOnly={!isOwner} />;
      case 'archive': return (
        <div className="space-y-10 animate-fade-in pb-20">
          <div className="glass-panel rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-600/20">
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
             <div className="relative z-10">
                <h2 className="text-4xl font-black mb-4">أرشيف المعلومات المركزي</h2>
                <p className="text-indigo-100 text-lg leading-relaxed max-w-2xl font-medium">
                  مركز أمان البيانات المتكامل. من هنا يمكنك إدارة النسخ الاحتياطية وضمان بقاء سجلات القوى العاملة محمية ضد أي تغيير أو فقدان عرضي.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <button onClick={handleExportDatabase} className="liquid-btn-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl transition-all flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    إنشاء نسخة احتياطية (JSON)
                  </button>
                  {isOwner && (
                    <label className="liquid-btn text-white border border-white/10 px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-white/10 transition-all flex items-center gap-3 cursor-pointer">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                      استيراد نسخة سابقة
                      <input type="file" className="hidden" accept=".json" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const json = JSON.parse(event.target?.result as string);
                              if (window.confirm('سيتم دمج البيانات المستوردة مع قاعدة البيانات الحالية. هل أنت متأكد؟')) {
                                handleImportDatabase(json);
                              }
                            } catch (err) { toast.error('خطأ في قراءة ملف الأرشيف.'); }
                          };
                          reader.readAsText(file);
                        }
                      }} />
                    </label>
                  )}
                </div>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-panel p-8 flex flex-col justify-between border border-white/10">
              <div>
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h4 className="text-xl font-black text-black dark:text-white mb-2">سلامة المعلومات</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">النظام يقوم بحفظ البيانات في "المساحة المحلية الموثوقة" فورياً عند كل تعديل لضمان عدم الضياع.</p>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-2 text-emerald-400 font-black text-xs">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                قاعدة البيانات نشطة ومؤمنة
              </div>
            </div>

            <div className="glass-panel p-8 flex flex-col justify-between border border-white/10">
              <div>
                <div className="w-12 h-12 bg-slate-500/20 text-slate-400 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>
                <h4 className="text-xl font-black text-black dark:text-white mb-2">إحصائيات الأرشفة</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">إجمالي سجلات الموظفين المؤرشفة حالياً في النظام الرئيسي.</p>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                 <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase">إجمالي السجلات</span>
                 <span className="text-2xl font-black text-indigo-400">{users.length}</span>
              </div>
            </div>
          </div>
        </div>
      );
      case 'records': return <RecordsList logs={activityLogs} />;
      case 'tasks': return (
        <TaskManager 
          tasks={tasks} 
          users={users} 
          currentUser={currentUser}
          onAddTask={(newTask) => {
            const taskWithId: Task = {
              ...newTask,
              id: Math.random().toString(36).substr(2, 9),
              createdAt: new Date().toISOString()
            };
            setTasks(prev => [taskWithId, ...prev]);
            addLog('إضافة مهمة', 'إداري', `تم إضافة مهمة جديدة: ${newTask.title}`);
          }}
          onUpdateTask={(id, updates) => {
            setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
            addLog('تحديث مهمة', 'إداري', `تم تحديث بيانات المهمة بالمعرف ${id}`);
          }}
          onDeleteTask={(id) => {
            setTasks(prev => prev.filter(t => t.id !== id));
            addLog('حذف مهمة', 'إداري', `تم حذف المهمة بالمعرف ${id}`);
            toast.success('تم حذف المهمة بنجاح');
          }}
          isReadOnly={!isOwner && currentUser.role !== 'موظف مختص'}
        />
      );
      case 'transfers': return (
        <TransfersView 
          users={users} 
          transfers={transfers}
          onViewUser={user => { setSelectedUser(user); setActiveTab('employee-profile'); }} 
          onAddTransfer={(newTransfer) => {
            if (!isOwner && currentUser.role !== 'موظف مختص') return;
            const transferWithId: TransferRecord = {
              ...newTransfer,
              id: Math.random().toString(36).substr(2, 9),
              createdAt: new Date().toISOString()
            };
            setTransfers(prev => [transferWithId, ...prev]);
            addLog('تسجيل نقل', 'إداري', `تم تسجيل حركة نقل للموظف: ${newTransfer.employeeName} بموجب الأمر ${newTransfer.orderNumber}`);
          }}
          onDeleteTransfer={(id) => {
            if (!isOwner) return;
            setTransfers(prev => prev.filter(t => t.id !== id));
            addLog('حذف سجل نقل', 'إداري', `تم حذف سجل نقل بالمعرف ${id}`);
            toast.success('تم حذف السجل بنجاح');
          }}
          isReadOnly={!isOwner && currentUser.role !== 'موظف مختص'}
        />
      );
      case 'contracts': return (
        <ContractsView 
          users={users} 
          contractRecords={contractRecords}
          onAddContractRecord={(newRecord) => {
            if (!isOwner && currentUser.role !== 'موظف مختص') return;
            const recordWithId: ContractRecord = {
              ...newRecord,
              id: Math.random().toString(36).substr(2, 9),
              createdAt: new Date().toISOString()
            };
            setContractRecords(prev => [recordWithId, ...prev]);
            addLog('تسجيل تعيين', 'إداري', `تم تسجيل بيانات تعيين جديد للموظف: ${newRecord.fullNameQuad}`);
          }}
          onDeleteContractRecord={(id) => {
            if (!isOwner) return;
            setContractRecords(prev => prev.filter(r => r.id !== id));
            addLog('حذف سجل تعيين', 'إداري', `تم حذف سجل تعيين بالمعرف ${id}`);
            toast.success('تم حذف السجل بنجاح');
          }}
          isReadOnly={!isOwner && currentUser.role !== 'موظف مختص'}
        />
      );
      case 'permanent-employees': return <PermanentEmployeesView users={users} onViewUser={user => { setSelectedUser(user); setActiveTab('employee-profile'); }} />;
      case 'barcode': return <BarcodeSystem users={users} />;
      case 'secondment': return <SecondmentView users={users} onViewUser={user => { setSelectedUser(user); setActiveTab('employee-profile'); }} onAddSecondment={(newUser) => {
        if (!isOwner) return;
        const userWithId: User = { 
          ...newUser, 
          id: Math.random().toString(36).substr(2, 9),
          joinDate: new Date().toISOString().split('T')[0], 
          status: 'نشط',
          salary: 0
        } as User;
        setUsers(prev => [userWithId, ...prev]);
        addLog('إضافة تنسيب', 'إداري', `تم إضافة حركة تنسيب للموظف: ${newUser.fullNameQuad}`);
        toast.success('تمت إضافة حركة التنسيب بنجاح');
      }} />;
      case 'degree-calculation': return <DegreeCalculationView users={users} onViewUser={user => { setSelectedUser(user); setActiveTab('employee-profile'); }} />;
      case 'official-missions': return <OfficialMissionsView users={users} onViewUser={user => { setSelectedUser(user); setActiveTab('employee-profile'); }} />;
      case 'promotions': return <PromotionsView users={users} onViewUser={user => { setSelectedUser(user); setActiveTab('employee-profile'); }} />;
      case 'leaves': return <LeavesView users={users} onViewUser={user => { setSelectedUser(user); setActiveTab('employee-profile'); }} />;
      case 'training-courses': return <TrainingCoursesView users={users} onViewUser={user => { setSelectedUser(user); setActiveTab('employee-profile'); }} />;
      case 'account-management': return isOwner ? (
        <AccountManagement 
          accounts={specialistAccounts} 
          onDelete={(id) => { 
            const account = specialistAccounts.find(a => a.id === id);
            if (account) {
              setTrashSpecialistAccounts(prev => [{ ...account, deletedAt: new Date().toLocaleString('ar-SA') } as SpecialistAccount, ...prev]);
              setSpecialistAccounts(prev => prev.filter(a => a.id !== id)); 
              addLog('نقل حساب متخصص لسلة المهملات', 'نظام', `تم نقل حساب متخصص بالمعرف ${id} إلى سلة المهملات`); 
              toast.success('تم نقل الحساب إلى سلة المهملات');
            }
          }} 
          onApprove={(id) => {
            setSpecialistAccounts(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
            addLog('الموافقة على حساب', 'نظام', `تمت الموافقة على حساب متخصص بالمعرف ${id}`);
            toast.success('تمت الموافقة على الحساب بنجاح');
          }}
          onReject={(id) => {
            setSpecialistAccounts(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
            addLog('رفض حساب', 'نظام', `تم رفض حساب متخصص بالمعرف ${id}`);
            toast.success('تم رفض الحساب بنجاح');
          }}
          onUnblock={(id) => {
            setSpecialistAccounts(prev => prev.map(a => a.id === id ? { ...a, isBlocked: false, failedAttempts: 0 } : a));
            addLog('إلغاء حظر حساب', 'نظام', `تم إلغاء حظر حساب متخصص بالمعرف ${id}`);
            toast.success('تم إلغاء حظر الحساب بنجاح');
          }}
          onUpdate={(id, updates) => {
            setSpecialistAccounts(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
            addLog('تحديث حساب متخصص', 'نظام', `تم تحديث بيانات حساب متخصص بالمعرف ${id}`);
            toast.success('تم تحديث بيانات الحساب بنجاح');
          }}
        />
      ) : null;
      case 'trash': return (
        <TrashBin 
          transactions={trashTransactions} 
          users={trashUsers} 
          specialistAccounts={trashSpecialistAccounts}
          onRestoreTransaction={(id, updated) => {
            if (!isOwner) return;
            const tx = trashTransactions.find(t => t.id === id);
            if (tx) {
              setTransactions(prev => [updated || tx, ...prev]);
              setTrashTransactions(prev => prev.filter(t => t.id !== id));
              addLog('استعادة معاملة', 'سلة المهملات', `تم استعادة المعاملة المالية: ${tx.description}`);
              toast.success('تم استعادة المعاملة بنجاح');
            }
          }} 
          onPermanentDeleteTransaction={(id) => {
            if (!isOwner) return;
            setTrashTransactions(prev => prev.filter(t => t.id !== id));
            addLog('حذف نهائي', 'سلة المهملات', `تم حذف معاملة مالية نهائياً`);
            toast.success('تم حذف المعاملة نهائياً');
          }} 
          onRestoreUser={(id, updated) => {
            if (!isOwner) return;
            const user = trashUsers.find(u => u.id === id);
            if (user) {
              setUsers(prev => [updated || user, ...prev]);
              setTrashUsers(prev => prev.filter(u => u.id !== id));
              addLog('استعادة موظف', 'سلة المهملات', `تم استعادة الموظف: ${user.fullNameQuad || user.name}`);
              toast.success('تم استعادة الموظف بنجاح');
            }
          }} 
          onPermanentDeleteUser={(id) => {
            if (!isOwner) return;
            setTrashUsers(prev => prev.filter(u => u.id !== id));
            addLog('حذف نهائي', 'سلة المهملات', `تم حذف موظف نهائياً`);
            toast.success('تم حذف الموظف نهائياً');
          }} 
          onRestoreSpecialistAccount={(id) => {
            if (!isOwner) return;
            const account = trashSpecialistAccounts.find(a => a.id === id);
            if (account) {
              setSpecialistAccounts(prev => [account, ...prev]);
              setTrashSpecialistAccounts(prev => prev.filter(a => a.id !== id));
              addLog('استعادة حساب متخصص', 'سلة المهملات', `تم استعادة حساب متخصص: ${account.username}`);
              toast.success('تم استعادة الحساب بنجاح');
            }
          }}
          onPermanentDeleteSpecialistAccount={(id) => {
            if (!isOwner) return;
            setTrashSpecialistAccounts(prev => prev.filter(a => a.id !== id));
            addLog('حذف نهائي', 'سلة المهملات', `تم حذف حساب متخصص نهائياً`);
            toast.success('تم حذف الحساب نهائياً');
          }}
          isReadOnly={!isOwner} 
        />
      );
      case 'my-profile': return <UserProfileEdit profile={currentUser} onSave={handleProfileSave} isReadOnly={false} />;
      default: return <Dashboard summary={summary} transactions={transactions} users={users} currentUser={currentUser} onViewUser={user => { setSelectedUser(user); setActiveTab('employee-profile'); }} onTabChange={handleTabChange} />;
    }
  };

  const handleTabChange = (tab: string) => {
    if (currentUser.assignedModule && tab !== 'dashboard' && tab !== 'my-profile' && tab !== 'ai-advisor') {
      // Special mapping for 'users' tab which is often paired with others
      if (tab !== currentUser.assignedModule) {
        return;
      }
    }
    setActiveTab(tab);
    setEditingUserId(null);
  };

  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 4000,
          style: {
            background: currentUser.isDarkMode ? '#1e293b' : '#ffffff',
            color: currentUser.isDarkMode ? '#ffffff' : '#1e293b',
            border: '1px solid rgba(121, 112, 229, 0.2)',
            fontFamily: 'inherit',
            fontWeight: 'bold',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }} 
      />
      {!isAuthenticated ? (
        <Login 
          onLogin={handleLogin} 
          accounts={specialistAccounts}
          onRegister={(newAccount) => {
            setSpecialistAccounts(prev => [...prev, newAccount]);
            addLog('تسجيل حساب جديد', 'نظام', `تم تسجيل حساب جديد للمستخدم: ${newAccount.username}`);
          }}
        />
      ) : (
        <Layout 
          activeTab={activeTab === 'employee-profile' ? 'users' : activeTab} 
          setActiveTab={handleTabChange} 
          currentUser={currentUser} 
          activityLogs={activityLogs}
          onLogout={handleLogout}
          onUpdateTheme={updateTheme}
          onToggleLanguage={toggleLanguage}
          onToggleDarkMode={toggleDarkMode}
          pendingAccountsCount={specialistAccounts.filter(acc => acc.status === 'pending').length}
        >
          {renderContent()}
        </Layout>
      )}
    </>
  );
};

export default App;
