
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../src/lib/supabase';

import { SpecialistAccount } from '../types';

interface LoginProps {
  onLogin: (username: string, role: string, assignedModule?: string, avatar?: string | null) => void;
  accounts: SpecialistAccount[];
  onRegister: (account: SpecialistAccount) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, accounts, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullNameQuad, setFullNameQuad] = useState('');
  const [username, setUsername] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  // التأكد من تطبيق السمة اللونية المخزنة على واجهة الدخول
  useEffect(() => {
    const savedUser = localStorage.getItem('zad_current_user');
    if (savedUser) {
      try {
        const profile = JSON.parse(savedUser);
        if (profile.themeColor) {
          document.documentElement.style.setProperty('--brand-primary', profile.themeColor);
          const shades = profile.themeColor.split(' ').map(Number);
          document.documentElement.style.setProperty('--brand-primary-light', `${Math.min(shades[0]+150, 255)} ${Math.min(shades[1]+150, 255)} ${Math.min(shades[2]+150, 255)}`);
          document.documentElement.style.setProperty('--brand-primary-dark', `${Math.max(shades[0]-30, 0)} ${Math.max(shades[1]-30, 0)} ${Math.max(shades[2]-30, 0)}`);
        }
        if (profile.isDarkMode !== undefined) {
          setIsDarkMode(profile.isDarkMode);
          if (profile.isDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      } catch (e) {
        console.error("Error loading theme for login screen", e);
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to local storage so it persists
    try {
      const savedUser = localStorage.getItem('zad_current_user');
      if (savedUser) {
        const profile = JSON.parse(savedUser);
        profile.isDarkMode = newMode;
        localStorage.setItem('zad_current_user', JSON.stringify(profile));
      } else {
        localStorage.setItem('zad_current_user', JSON.stringify({ isDarkMode: newMode }));
      }
    } catch (e) {
      console.error("Error saving theme preference", e);
    }
  };

  const modules = [
    { id: 'transfers', label: 'النقل الخارجي والداخلي' },
    { id: 'contracts', label: 'العقود والتعيينات' },
    { id: 'salaries', label: 'رواتب الموظفين' },
    { id: 'permanent-employees', label: 'الملاك' },
    { id: 'barcode', label: 'نظام الباركود' },
    { id: 'secondment', label: 'حركة التنسيب' },
    { id: 'degree-calculation', label: 'احتساب الشهادات' },
    { id: 'official-missions', label: 'الايفادات' },
    { id: 'promotions', label: 'الترقيات' },
    { id: 'leaves', label: 'الاجازات' },
    { id: 'training-courses', label: 'الدورات التدريبية' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (isRegistering) {
        if (fullNameQuad && username && password && selectedModule) {
          // Check if username already exists
          if (accounts.some(acc => acc.username === username)) {
            toast.error('اسم المستخدم مسجل مسبقاً.');
            setLoading(false);
            return;
          }

          const newAccount: SpecialistAccount = {
            id: Math.random().toString(36).substr(2, 9),
            username: username,
            fullNameQuad: fullNameQuad,
            password: password, // In a real app, this would be hashed
            assignedModule: selectedModule,
            createdAt: new Date().toISOString(),
            status: 'pending',
            failedAttempts: 0,
            isBlocked: false
          };
          
          onRegister(newAccount);
          toast.success('تم إرسال طلب التسجيل بنجاح. يرجى انتظار موافقة المالك لتتمكن من الدخول.');
          setLoading(false);
          setIsRegistering(false);
        } else {
          toast.error('يرجى ملء جميع الحقول المطلوبة واختيار القسم المختص.');
          setLoading(false);
        }
      } else {
        if ((identifier === 'علي خضر' || identifier === '123456' || identifier === 'ali.khadr@example.com') && password === '1122') {
          onLogin('علي خضر', 'المالك');
        } else if (identifier && password) {
          // Check accounts prop
          const account = accounts.find(acc => 
            (acc.username === identifier || acc.email === identifier)
          );

          if (account) {
            if (account.isBlocked) {
              toast.error('تم حظر هذا الحساب بسبب محاولات دخول خاطئة متعددة. يرجى مراجعة المالك.');
              setLoading(false);
              return;
            }

            if (account.password === password) {
              if (account.status === 'approved') {
                onLogin(account.username, 'موظف مختص', account.assignedModule, account.avatar);
              } else if (account.status === 'rejected') {
                toast.error('لقد تم رفضك للدخول الى النظام');
                setLoading(false);
              } else {
                toast('طلبك قيد المراجعة', {
                  icon: '⏳',
                  duration: 5000,
                  style: {
                    background: '#fef3c7',
                    color: '#92400e',
                  },
                });
                setLoading(false);
              }
            } else {
              // Increment failed attempts - we can't update state here easily without a callback
              // For this demo, we'll just show error. In real app, call onLoginFailure(account.id)
              toast.error('كلمة المرور غير صحيحة.');
              setLoading(false);
            }
          } else {
            // Fallback for demo or general employee
            onLogin(identifier, 'موظف');
          }
        } else {
          toast.error('بيانات الدخول غير صحيحة. يرجى التأكد من اسم المستخدم وكلمة المرور.');
          setLoading(false);
        }
      }
    }, 800);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || 'فشل تسجيل الدخول عبر جوجل');
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || 'فشل تسجيل الدخول عبر GitHub');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-['Cairo'] transition-colors duration-500">
      {/* خلفية تفاعلية تعتمد على لون السمة المختار */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[160px] -mr-64 -mt-64 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/5 rounded-full blur-[140px] -ml-64 -mb-64"></div>

      {/* زر تبديل الوضع الليلي/النهاري */}
      <div className="absolute top-6 left-6 z-50">
        <button 
          onClick={toggleDarkMode}
          className="w-12 h-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-lg hover:scale-110"
          title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
        >
          {isDarkMode ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          )}
        </button>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-600/40 mb-6 border border-white/10 group transition-all duration-500 hover:rotate-6">
            <svg className="w-10 h-10 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-black text-black dark:text-white tracking-tighter mb-2">قسم الموارد البشرية</h1>
          <div className="inline-block px-4 py-1.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 backdrop-blur-md">
            <p className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.2em] text-[9px]">
              {isRegistering ? 'إنشاء حساب جديد في المنظومة' : 'بوابة الدخول الذكية والمشفرة'}
            </p>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] border border-slate-200 dark:border-white/5 relative group transition-colors duration-500">
          <div className="absolute inset-0 rounded-[3rem] border border-indigo-500/0 group-focus-within:border-indigo-500/30 transition-all duration-500 pointer-events-none"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            {!isRegistering ? (
              <>
                {/* حقل اسم المستخدم */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] block pr-1">اسم المستخدم</label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-slate-400 dark:text-slate-600 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </span>
                    <input 
                      required
                      type="text" 
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="اسم المستخدم"
                      className="w-full h-14 bg-slate-100/50 dark:bg-slate-950/40 border-2 border-slate-200 dark:border-white/5 rounded-2xl pr-14 pl-5 text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-800 focus:ring-8 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 focus:border-indigo-500/40 outline-none transition-all duration-300"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* حقول إنشاء حساب */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] block pr-1">الاسم الرباعي</label>
                  <input 
                    required
                    type="text" 
                    value={fullNameQuad}
                    onChange={(e) => setFullNameQuad(e.target.value)}
                    placeholder="الاسم الرباعي"
                    className="w-full h-14 bg-slate-100/50 dark:bg-slate-950/40 border-2 border-slate-200 dark:border-white/5 rounded-2xl px-5 text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-800 focus:ring-8 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 focus:border-indigo-500/40 outline-none transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] block pr-1">اسم المستخدم</label>
                  <input 
                    required
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="اسم المستخدم"
                    className="w-full h-14 bg-slate-100/50 dark:bg-slate-950/40 border-2 border-slate-200 dark:border-white/5 rounded-2xl px-5 text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-800 focus:ring-8 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 focus:border-indigo-500/40 outline-none transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] block pr-1">القسم المختص</label>
                  <select 
                    required
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    className="w-full h-14 bg-slate-100/50 dark:bg-slate-950/40 border-2 border-slate-200 dark:border-white/5 rounded-2xl px-5 text-sm font-bold text-slate-800 dark:text-white focus:ring-8 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 focus:border-indigo-500/40 outline-none transition-all duration-300 appearance-none"
                  >
                    <option value="" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">-- اختر القسم المسؤول عنه --</option>
                    {modules.map(m => (
                      <option key={m.id} value={m.id} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">{m.label}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* حقل كلمة المرور */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] block pr-1">كلمة المرور</label>
              <div className="relative group">
                <span className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-slate-400 dark:text-slate-600 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 11-8 0v4h-8z"></path></svg>
                </span>
                <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 bg-slate-100/50 dark:bg-slate-950/40 border-2 border-slate-200 dark:border-white/5 rounded-2xl pr-14 pl-14 text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-800 focus:ring-8 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 focus:border-indigo-500/40 outline-none transition-all duration-300"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-400 dark:text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path></svg>
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl font-black text-sm shadow-2xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-1 transition-all active:scale-[0.97] flex items-center justify-center gap-4 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <>
                  {isRegistering ? 'إنشاء الحساب الآن' : 'تحقق من الهوية والدخول'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </>
              )}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-white/5"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-white dark:bg-slate-900/0 px-4 text-slate-500 dark:text-slate-600 font-black">أو</span></div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white rounded-2xl font-bold text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </button>

              <button 
                type="button"
                onClick={handleGithubSignIn}
                className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white rounded-2xl font-bold text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-4"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                </svg>
                Sign in with GitHub
              </button>
            </div>

            <div className="text-center">
              <button 
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
              >
                {isRegistering ? 'لديك حساب بالفعل؟ سجل دخولك' : 'ليس لديك حساب؟ أنشئ حساباً جديداً'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-10 flex items-center justify-center gap-6 opacity-40 dark:opacity-20">
           <div className="h-px w-10 bg-indigo-500"></div>
           <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.4em]">ZAD CORE v3.2</p>
           <div className="h-px w-10 bg-indigo-500"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
