// Real API service connecting to backend server
// Backend: Node/Express on EC2 (13.60.70.116)
// Database: PostgreSQL on RDS

import { Expense, User, ActionLog } from '../types/expense';

// API base URL - using main production API
const API_BASE_URL = 'https://exight.in/api';

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

// Helper function to make authenticated API calls
const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }
  
  return response.json();
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
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  // Login user
  login: async (data: { email: string; password: string }) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  // Get user profile
  getProfile: async () => {
    return await apiCall('/auth/profile');
  },

  // Logout
  logout: () => {
    removeAuthToken();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },

  // Google OAuth login
  googleLogin: async (credential: string) => {
    const response = await apiCall('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },
};

// Expenses API functions
export const expensesAPI = {
  // Get all expenses
  getAll: async () => {
    return await apiCall('/expenses');
  },

  // Get single expense
  getById: async (id: string) => {
    return await apiCall(`/expenses/${id}`);
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
    return await apiCall('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
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
    return await apiCall(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete expense
  delete: async (id: string) => {
    return await apiCall(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },

  // Add partial payment
  addPayment: async (expenseId: string, data: {
    amount: number;
    paymentDate: string;
    description?: string;
  }) => {
    return await apiCall(`/expenses/${expenseId}/payments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Delete partial payment
  deletePayment: async (expenseId: string, paymentId: string) => {
    return await apiCall(`/expenses/${expenseId}/payments/${paymentId}`, {
      method: 'DELETE',
    });
  },
};

// Action Logs API functions
export const actionLogsAPI = {
  // Get all action logs
  getAll: async () => {
    return await apiCall('/action-logs');
  },

  // Create new action log
  create: async (data: {
    action: string;
    details: string;
    type: 'add' | 'update' | 'payment' | 'delete';
  }) => {
    return await apiCall('/action-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Delete action log
  delete: async (id: string) => {
    return await apiCall(`/action-logs/${id}`, {
      method: 'DELETE',
    });
  },

  // Clear all action logs
  clear: async () => {
    return await apiCall('/action-logs', {
      method: 'DELETE',
    });
  },
};

// Health check
export const healthCheck = async () => {
  return await apiCall('/health');
};

export default {
  auth: authAPI,
  expenses: expensesAPI,
  actionLogs: actionLogsAPI,
  healthCheck,
}; 