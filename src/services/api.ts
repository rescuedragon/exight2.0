// Mock API service using localStorage for data persistence
// This allows the frontend to work without a backend

import { Expense, User, ActionLog } from '../types/expense';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token
const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token
const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Helper function to generate unique IDs
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Helper function to get data from localStorage
const getLocalData = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Helper function to set data in localStorage
const setLocalData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
};

// Mock delay to simulate API calls
const mockDelay = (ms: number = 300): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    await mockDelay();
    
    const users = getLocalData<User[]>('users', []);
    const existingUser = users.find(user => user.email === data.email);
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const newUser: User = {
      id: generateId(),
      email: data.email,
      password: data.password, // In a real app, this would be hashed
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    setLocalData('users', users);
    
    const token = generateId();
    setAuthToken(token);
    
    return {
      user: { ...newUser, password: undefined },
      token,
      message: 'User registered successfully'
    };
  },

  // Login user
  login: async (data: { email: string; password: string }) => {
    await mockDelay();
    
    const users = getLocalData<User[]>('users', []);
    const user = users.find(u => u.email === data.email && u.password === data.password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const token = generateId();
    setAuthToken(token);
    
    return {
      user: { ...user, password: undefined },
      token,
      message: 'Login successful'
    };
  },

  // Get user profile
  getProfile: async () => {
    await mockDelay();
    
    const users = getLocalData<User[]>('users', []);
    const currentUser = users.find(u => u.id === getAuthToken());
    
    if (!currentUser) {
      throw new Error('User not found');
    }
    
    return { ...currentUser, password: undefined };
  },

  // Logout
  logout: () => {
    removeAuthToken();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },
};

// Expenses API functions
export const expensesAPI = {
  // Get all expenses
  getAll: async () => {
    await mockDelay();
    
    const expenses = getLocalData<Expense[]>('expenses', []);
    return expenses;
  },

  // Get single expense
  getById: async (id: string) => {
    await mockDelay();
    
    const expenses = getLocalData<Expense[]>('expenses', []);
    const expense = expenses.find(e => e.id === id);
    
    if (!expense) {
      throw new Error('Expense not found');
    }
    
    return expense;
  },

  // Create new expense
  create: async (data: {
    name: string;
    amount: number;
    currency?: string;
    type: 'EMI' | 'Personal Loan' | 'Borrowed';
    deductionDay: number;
    isRecurring?: boolean;
    totalMonths?: number;
    remainingMonths?: number;
    remainingAmount?: number;
  }) => {
    await mockDelay();
    
    const expenses = getLocalData<Expense[]>('expenses', []);
    
    const newExpense: Expense = {
      id: generateId(),
      userId: getAuthToken() || 'default',
      name: data.name,
      amount: data.amount,
      currency: data.currency || 'INR',
      type: data.type,
      deductionDay: data.deductionDay,
      isRecurring: data.isRecurring ?? true,
      totalMonths: data.totalMonths || 12,
      remainingMonths: data.remainingMonths || data.totalMonths || 12,
      remainingAmount: data.remainingAmount || data.amount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    expenses.push(newExpense);
    setLocalData('expenses', expenses);
    
    return newExpense;
  },

  // Update expense
  update: async (id: string, data: Partial<{
    name: string;
    amount: number;
    currency: string;
    type: 'EMI' | 'Personal Loan' | 'Borrowed';
    deductionDay: number;
    isRecurring: boolean;
    totalMonths: number;
    remainingMonths: number;
    remainingAmount: number;
  }>) => {
    await mockDelay();
    
    const expenses = getLocalData<Expense[]>('expenses', []);
    const expenseIndex = expenses.findIndex(e => e.id === id);
    
    if (expenseIndex === -1) {
      throw new Error('Expense not found');
    }
    
    expenses[expenseIndex] = {
      ...expenses[expenseIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    setLocalData('expenses', expenses);
    return expenses[expenseIndex];
  },

  // Delete expense
  delete: async (id: string) => {
    await mockDelay();
    
    const expenses = getLocalData<Expense[]>('expenses', []);
    const filteredExpenses = expenses.filter(e => e.id !== id);
    
    if (filteredExpenses.length === expenses.length) {
      throw new Error('Expense not found');
    }
    
    setLocalData('expenses', filteredExpenses);
    return { message: 'Expense deleted successfully' };
  },

  // Add partial payment
  addPayment: async (expenseId: string, data: {
    amount: number;
    paymentDate: string;
    description?: string;
  }) => {
    await mockDelay();
    
    const expenses = getLocalData<Expense[]>('expenses', []);
    const expense = expenses.find(e => e.id === expenseId);
    
    if (!expense) {
      throw new Error('Expense not found');
    }
    
    const payment = {
      id: generateId(),
      expenseId,
      amount: data.amount,
      paymentDate: data.paymentDate,
      description: data.description || '',
      createdAt: new Date().toISOString(),
    };
    
    // Update expense remaining amount
    expense.remainingAmount = Math.max(0, expense.remainingAmount - data.amount);
    expense.updatedAt = new Date().toISOString();
    
    setLocalData('expenses', expenses);
    
    // Store payment in separate array
    const payments = getLocalData<any[]>('payments', []);
    payments.push(payment);
    setLocalData('payments', payments);
    
    return payment;
  },

  // Delete partial payment
  deletePayment: async (expenseId: string, paymentId: string) => {
    await mockDelay();
    
    const payments = getLocalData<any[]>('payments', []);
    const payment = payments.find(p => p.id === paymentId);
    
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    // Restore the payment amount to the expense
    const expenses = getLocalData<Expense[]>('expenses', []);
    const expense = expenses.find(e => e.id === expenseId);
    
    if (expense) {
      expense.remainingAmount += payment.amount;
      expense.updatedAt = new Date().toISOString();
      setLocalData('expenses', expenses);
    }
    
    const filteredPayments = payments.filter(p => p.id !== paymentId);
    setLocalData('payments', filteredPayments);
    
    return { message: 'Payment deleted successfully' };
  },
};

// Action Logs API functions
export const actionLogsAPI = {
  // Get all action logs
  getAll: async () => {
    await mockDelay();
    
    const logs = getLocalData<ActionLog[]>('actionLogs', []);
    return logs;
  },

  // Create new action log
  create: async (data: {
    action: string;
    details: string;
    type: 'add' | 'update' | 'payment' | 'delete';
  }) => {
    await mockDelay();
    
    const logs = getLocalData<ActionLog[]>('actionLogs', []);
    
    const newLog: ActionLog = {
      id: generateId(),
      action: data.action,
      details: data.details,
      type: data.type,
      timestamp: new Date().toISOString(),
    };
    
    logs.push(newLog);
    setLocalData('actionLogs', logs);
    
    return newLog;
  },

  // Delete action log
  delete: async (id: string) => {
    await mockDelay();
    
    const logs = getLocalData<ActionLog[]>('actionLogs', []);
    const filteredLogs = logs.filter(log => log.id !== id);
    
    if (filteredLogs.length === logs.length) {
      throw new Error('Action log not found');
    }
    
    setLocalData('actionLogs', filteredLogs);
    return { message: 'Action log deleted successfully' };
  },

  // Clear all action logs
  clear: async () => {
    await mockDelay();
    
    setLocalData('actionLogs', []);
    return { message: 'All action logs cleared successfully' };
  },
};

// Health check
export const healthCheck = async () => {
  await mockDelay();
  
  return {
    status: 'OK',
    message: 'Mock API is running',
    timestamp: new Date().toISOString(),
    dataSource: 'localStorage'
  };
};

export default {
  auth: authAPI,
  expenses: expensesAPI,
  actionLogs: actionLogsAPI,
  healthCheck,
}; 