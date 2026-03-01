
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  deletedAt?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  transactionsCount: number;
}

export interface AIInsight {
  title: string;
  content: string;
  type: 'tip' | 'warning' | 'info';
}

export type UserRole = string;
export type Gender = 'ذكر' | 'أنثى';

export interface User {
  id: string;
  name: string; // Known as display name
  fullNameQuad: string; // الاسم الرباعي واللقب
  motherNameTriple: string; // اسم الأم الثلاثي
  gender: Gender;
  birthDate: string; // المواليد - جديد
  education: string; // التحصيل الدراسي
  preciseSpecialization: string; // التخصص الدقيق - جديد
  appointmentDateContract: string; // تاريخ التعيين (أجر/عقد)
  appointmentDatePermanent: string; // تاريخ التعيين (ملاك)
  email: string;
  role: UserRole;
  status: 'نشط' | 'معطل';
  joinDate: string; // System join date
  phone: string;
  department: string;
  salary: number;
  address: string; // السكن
  biography?: string; // السيرة المهنية - جديد
  notes?: string; // ملاحظات إدارية
  deletedAt?: string;
  avatar?: string | null; // صورة الموظف
  // Secondment fields
  secondedFrom?: string; // الجهة المنسب منها
  secondedTo?: string; // الجهة المنسب اليها
  secondmentType?: 'internal' | 'external'; // نوع التنسيب
  releaseDate?: string; // تاريخ الانفكاك
  commencementDate?: string; // تاريخ المباشرة
  secondmentDuration?: string; // مدة التنسيب
  secondmentEndDate?: string; // تاريخ انتهاء التنسيب
  secondmentExtensionPeriod?: string; // فترة تمديد التنسيب
}

export interface SpecialistAccount {
  id: string;
  username: string;
  fullNameQuad: string;
  email?: string; // Keep optional for backward compatibility
  password?: string;
  assignedModule: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  failedAttempts?: number;
  isBlocked?: boolean;
  lastLogin?: string;
  avatar?: string | null;
  deletedAt?: string;
}

export interface CurrentUserProfile {
  name: string;
  username?: string;
  role: string;
  email: string;
  avatar: string | null;
  phone: string;
  bio: string;
  themeColor?: string; // New field for theme customization
  language?: 'ar' | 'en';
  isDarkMode?: boolean;
  assignedModule?: string; // The specific module assigned to a specialist
}

export interface GeneratedReport {
  id: string;
  timestamp: string;
  generatedBy: string;
  summarySnapshot: FinancialSummary;
  reportType: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'مالي' | 'إداري' | 'نظام' | 'سلة المهملات';
  details: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // User ID or Name
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
}

export interface TransferRecord {
  id: string;
  employeeName: string;
  type: 'internal' | 'external';
  placeFrom: string;
  placeTo: string;
  releaseDate: string;
  resumptionDate: string;
  orderNumber: string;
  education: string;
  jobTitle: string;
  notes: string;
  createdAt: string;
}

export interface ContractRecord {
  id: string;
  fullNameQuad: string;
  motherNameTriple: string;
  birthDate: string;
  gender: Gender;
  unifiedIdNumber: string;
  issueDate: string;
  appointmentType: 'wage' | 'contract';
  appointmentDate: string;
  commencementDate: string;
  wageOrderNumber: string;
  contractConversionOrderNumber: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface SalarySlip {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: string;
  jobTitle: string;
  education: string;
  maritalStatus: string;
  childrenCount: number;
  servicePeriod: string;
  bankAccount: string;
  bankName: string;
  basicSalary: number;
  allowances: {
    certificate: number;
    professionalRisks: number;
    special: number;
    marital: number;
    children: number;
    location: number;
    previousCarryover: number;
    differences: number;
  };
  deductions: {
    pension: number;
    socialSecurity: number;
    carryoverDeduction: number;
    bills: Array<{ label: string; amount: number }>;
  };
  totalAllowances: number;
  totalDeductions: number;
  netSalary: number;
  timestamp: string;
}
