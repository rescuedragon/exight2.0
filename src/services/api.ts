const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5001/api');

// Temporary mock authentication for testing
const MOCK_USERS = [
  {
    id: 1,
    email: 'sisirath@flash.co',
    password: 'password123',
    firstName: 'Sisirath',
    lastName: 'Flash'
  },
  {
    id: 2,
    email: 'test@test.com',
    password: 'test123',
    firstName: 'Test',
    lastName: 'User'
  }
];

export const api = {
  async request(endpoint: string, config: RequestInit = {}) {
    console.log(`Making API request to: ${API_BASE_URL}${endpoint}`);
    console.log('Request config:', config);
    
    // For now, handle auth endpoints with mock data
    if (endpoint === '/auth/login' && config.method === 'POST') {
      try {
        const body = JSON.parse(config.body as string);
        const user = MOCK_USERS.find(u => u.email === body.email && u.password === body.password);
        
        if (user) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              message: 'Login successful',
              user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
              },
              token: 'mock-jwt-token-' + Date.now()
            })
          };
        } else {
          return {
            ok: false,
            status: 401,
            json: async () => ({ error: 'Invalid email or password' })
          };
        }
      } catch (error) {
        return {
          ok: false,
          status: 400,
          json: async () => ({ error: 'Invalid request data' })
        };
      }
    }
    
    if (endpoint === '/auth/register' && config.method === 'POST') {
      try {
        const body = JSON.parse(config.body as string);
        const existingUser = MOCK_USERS.find(u => u.email === body.email);
        
        if (existingUser) {
          return {
            ok: false,
            status: 400,
            json: async () => ({ error: 'User already exists' })
          };
        }
        
        const newUser = {
          id: MOCK_USERS.length + 1,
          email: body.email,
          password: body.password,
          firstName: body.firstName,
          lastName: body.lastName
        };
        
        MOCK_USERS.push(newUser);
        
        return {
          ok: true,
          status: 201,
          json: async () => ({
            message: 'Registration successful',
            user: {
              id: newUser.id,
              email: newUser.email,
              firstName: newUser.firstName,
              lastName: newUser.lastName
            },
            token: 'mock-jwt-token-' + Date.now()
          })
        };
      } catch (error) {
        return {
          ok: false,
          status: 400,
          json: async () => ({ error: 'Invalid request data' })
        };
      }
    }
    
    // For other endpoints, try the real API
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error.message);
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check your internet connection or try again later.');
      }
      
      throw error;
    }
  },

  async get(endpoint: string) {
    return this.request(endpoint);
  },

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  async delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  },
};

// Expenses API functions
export const expensesAPI = {
  // Get all expenses
  getAll: async () => {
    return await api.get('/expenses');
  },

  // Get single expense
  getById: async (id: string) => {
    return await api.get(`/expenses/${id}`);
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
    return await api.post('/expenses', data);
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
    return await api.put(`/expenses/${id}`, data);
  },

  // Delete expense
  delete: async (id: string) => {
    return await api.delete(`/expenses/${id}`);
  },

  // Add partial payment
  addPayment: async (expenseId: string, data: {
    amount: number;
    paymentDate: string;
    description?: string;
  }) => {
    return await api.post(`/expenses/${expenseId}/payments`, data);
  },

  // Delete partial payment
  deletePayment: async (expenseId: string, paymentId: string) => {
    return await api.delete(`/expenses/${expenseId}/payments/${paymentId}`);
  },
};

// Action Logs API functions
export const actionLogsAPI = {
  // Get all action logs
  getAll: async () => {
    return await api.get('/action-logs');
  },

  // Create new action log
  create: async (data: {
    action: string;
    details: string;
    type: 'add' | 'update' | 'payment' | 'delete';
  }) => {
    return await api.post('/action-logs', data);
  },

  // Delete action log
  delete: async (id: string) => {
    return await api.delete(`/action-logs/${id}`);
  },

  // Clear all action logs
  clear: async () => {
    return await api.delete('/action-logs/clear');
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

export const authAPI = {
  register: async (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    const response = await api.post('/auth/register', data);
    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        // Mock token, in a real app, you'd set it in localStorage
        // localStorage.setItem('authToken', data.token); 
      }
    }
    return response;
  },
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        // Mock token, in a real app, you'd set it in localStorage
        // localStorage.setItem('authToken', data.token); 
      }
    }
    return response;
  },
  getProfile: async () => {
    return await api.get('/auth/profile');
  },
  logout: () => {
    // Mock logout, in a real app, you'd remove the token from localStorage
    // localStorage.removeItem('authToken'); 
  },
  isAuthenticated: (): boolean => {
    // Mock authentication check
    return true; 
  },
};

export default {
  auth: authAPI,
  expenses: expensesAPI,
  actionLogs: actionLogsAPI,
  healthCheck,
}; 