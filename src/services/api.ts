const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

// Helper function to make API requests
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
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
    const response = await apiRequest('/auth/register', {
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
    const response = await apiRequest('/auth/login', {
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
    return await apiRequest('/auth/profile');
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
    return await apiRequest('/expenses');
  },

  // Get single expense
  getById: async (id: string) => {
    return await apiRequest(`/expenses/${id}`);
  },

  // Create new expense
  create: async (data: {
    name: string;
    amount: number;
    currency?: string;
    type: 'EMI' | 'Personal Loan' | 'Borrowed from Someone';
    deductionDay: number;
    isRecurring?: boolean;
    totalMonths?: number;
    remainingMonths?: number;
    remainingAmount?: number;
  }) => {
    return await apiRequest('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update expense
  update: async (id: string, data: Partial<{
    name: string;
    amount: number;
    currency: string;
    type: 'EMI' | 'Personal Loan' | 'Borrowed from Someone';
    deductionDay: number;
    isRecurring: boolean;
    totalMonths: number;
    remainingMonths: number;
    remainingAmount: number;
  }>) => {
    return await apiRequest(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete expense
  delete: async (id: string) => {
    return await apiRequest(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },

  // Add partial payment
  addPayment: async (expenseId: string, data: {
    amount: number;
    paymentDate: string;
    description?: string;
  }) => {
    return await apiRequest(`/expenses/${expenseId}/payments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Delete partial payment
  deletePayment: async (expenseId: string, paymentId: string) => {
    return await apiRequest(`/expenses/${expenseId}/payments/${paymentId}`, {
      method: 'DELETE',
    });
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export default {
  auth: authAPI,
  expenses: expensesAPI,
  healthCheck,
}; 