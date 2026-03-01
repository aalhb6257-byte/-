import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data.json');

export interface Data {
  users: any[];
  logs: any[];
  accounts: any[];
  transactions: any[];
  tasks: any[];
  transfers: any[];
  contractRecords: any[];
  currentUser: any;
}

const INITIAL_DATA: Data = {
  users: [
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
  ],
  logs: [],
  accounts: [],
  transactions: [
    { id: '1', date: '2023-10-01', description: 'راتب شهر أكتوبر - علي خضر', category: 'رواتب', amount: 15000, type: 'EXPENSE' },
    { id: '2', date: '2023-10-02', description: 'إيجار المكتب', category: 'سكن', amount: 3000, type: 'EXPENSE' },
    { id: '3', date: '2023-10-05', description: 'إيداع مبيعات', category: 'دخل', amount: 25000, type: 'INCOME' },
  ],
  tasks: [],
  transfers: [],
  contractRecords: [],
  currentUser: {
    name: 'علي خضر',
    role: 'مدير النظام',
    email: 'ali.khadr@example.com',
    avatar: null,
    phone: '+966 50 123 4567',
    bio: 'مدير مالي وإداري خبير، مسؤول عن إدارة القوى العاملة والتدفقات المالية للنظام.',
    themeColor: '79 70 229', // Indigo
    language: 'ar',
    isDarkMode: false
  }
};

export const getDB = (): Data => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2));
    return INITIAL_DATA;
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB file:', error);
    return INITIAL_DATA;
  }
};

export const saveDB = (data: Partial<Data>) => {
  const currentData = getDB();
  const newData = { ...currentData, ...data };
  fs.writeFileSync(DB_FILE, JSON.stringify(newData, null, 2));
  return newData;
};
