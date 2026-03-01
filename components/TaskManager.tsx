import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, User, CurrentUserProfile } from '../types';
import { toast } from 'react-hot-toast';

interface TaskManagerProps {
  tasks: Task[];
  users: User[];
  currentUser: CurrentUserProfile;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  isReadOnly?: boolean;
}

const TaskManager: React.FC<TaskManagerProps> = ({ 
  tasks, 
  users, 
  currentUser, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask,
  isReadOnly 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: 'pending' as Task['status'],
    priority: 'medium' as Task['priority'],
    dueDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.assignedTo) {
      toast.error('يرجى ملء الحقول المطلوبة');
      return;
    }
    onAddTask(formData);
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      status: 'pending',
      priority: 'medium',
      dueDate: ''
    });
    setShowForm(false);
    toast.success('تمت إضافة المهمة بنجاح');
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
      case 'in-progress': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low': return 'text-slate-400';
      case 'medium': return 'text-amber-500';
      case 'high': return 'text-rose-500';
      default: return 'text-slate-400';
    }
  };

  const isOwner = currentUser.role === 'المالك';

  return (
    <div className="space-y-8 animate-fade-in font-['Cairo']">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-black dark:text-white tracking-tight">إدارة المهام والمشاريع</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">تتبع واجبات الموظفين والمشاريع الجارية.</p>
        </div>
        {!isReadOnly && isOwner && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="liquid-btn-primary text-white px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <svg className={`w-5 h-5 transition-transform ${showForm ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            إضافة مهمة جديدة
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel p-8 overflow-hidden border-2 border-indigo-500/20"
          >
            <h3 className="text-xl font-black text-black dark:text-white mb-6">تسجيل مهمة جديدة</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">عنوان المهمة</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full h-12 liquid-input px-4 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">الموظف المسؤول</label>
                  <select required value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})} className="w-full h-12 liquid-input px-4 text-sm font-bold">
                    <option value="">اختر موظف...</option>
                    {users.map(u => (
                      <option key={u.id} value={u.fullNameQuad}>{u.fullNameQuad}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">الأولوية</label>
                  <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as Task['priority']})} className="w-full h-12 liquid-input px-4 text-sm font-bold">
                    <option value="low">منخفضة</option>
                    <option value="medium">متوسطة</option>
                    <option value="high">عالية</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">تاريخ الاستحقاق</label>
                  <input required type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full h-12 liquid-input px-4 text-sm font-bold" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">وصف المهمة</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full h-24 liquid-input p-4 text-sm font-bold resize-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl font-black text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">إلغاء</button>
                <button type="submit" className="liquid-btn-primary text-white px-8 py-3 rounded-xl font-black text-xs shadow-lg hover:-translate-y-0.5 transition-all">حفظ المهمة</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {tasks.length > 0 ? tasks.map((task, index) => (
            <motion.div 
              key={task.id} 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="pro-card p-6 space-y-4 group"
            >
            <div className="flex justify-between items-start">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(task.status)}`}>
                {task.status === 'pending' ? 'قيد الانتظار' : task.status === 'in-progress' ? 'قيد العمل' : 'مكتملة'}
              </span>
              <div className="flex gap-2">
                {!isReadOnly && (
                  <select 
                    value={task.status} 
                    onChange={(e) => onUpdateTask(task.id, { status: e.target.value as Task['status'] })}
                    className="text-[10px] font-black bg-transparent border-none focus:ring-0 cursor-pointer text-slate-400 hover:text-indigo-500 transition-colors"
                  >
                    <option value="pending">انتظار</option>
                    <option value="in-progress">عمل</option>
                    <option value="completed">تم</option>
                  </select>
                )}
                {isOwner && !isReadOnly && (
                  <button onClick={() => onDeleteTask(task.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-black text-black dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{task.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 line-clamp-2">{task.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 text-[10px] font-black">
                  {task.assignedTo.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] font-black text-black dark:text-white leading-none">{task.assignedTo}</p>
                  <p className="text-[8px] text-slate-400 font-bold mt-0.5">المسؤول</p>
                </div>
              </div>
              <div className="text-left">
                <p className={`text-[10px] font-black ${getPriorityColor(task.priority)} uppercase tracking-tighter`}>{task.priority}</p>
                <p className="text-[8px] text-slate-400 font-bold mt-0.5">{task.dueDate}</p>
              </div>
            </div>
            </motion.div>
          )) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center glass-panel"
            >
              <p className="text-slate-400 font-bold">لا توجد مهام مسجلة حالياً.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskManager;
