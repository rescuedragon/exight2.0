export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

import { log, warn, error as logError } from './logger';
import type { Expense as AppExpense } from '@/types/expense';
import type { Loan as AppLoan, LoanPayment as AppLoanPayment } from '@/types/loan';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Prefer env-based configuration with a sensible default to the EC2 server
const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://13.60.70.116/api';

interface MockUser {
  password: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Use the app-wide types for Expenses and Loans
type Expense = AppExpense;
type Loan = AppLoan;

interface FeedbackPayload {
  name?: string;
  email?: string;
  message: string;
}

interface FeedbackResponse {
  success: boolean;
  data?: unknown;
}

interface AuthResponseWrapper {
  success: boolean;
  data: AuthResponse;
  message?: string;
  error?: string;
}

interface ExpenseResponseWrapper {
  success: boolean;
  data: Expense[];
  message?: string;
  error?: string;
}

interface LoanResponseWrapper {
  success: boolean;
  data: Loan[];
  message?: string;
  error?: string;
}

interface SingleExpenseResponseWrapper {
  success: boolean;
  data: Expense;
  message?: string;
  error?: string;
}

interface SingleLoanResponseWrapper {
  success: boolean;
  data: Loan;
  message?: string;
  error?: string;
}

class ApiService {
  private token: string | null = null;
  private mockUsers: Map<string, MockUser> = new Map();

  constructor() {
    // Initialize with some mock users
    this.mockUsers.set('demo@exight.com', {
      password: 'demo123',
      user: {
        id: '1',
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@exight.com'
      }
    });
    
    this.mockUsers.set('admin@exight.com', {
      password: 'admin123',
      user: {
        id: '2',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@exight.com'
      }
    });

    // Load any additional users from localStorage
    this.loadMockUsersFromStorage();
  }

  private loadMockUsersFromStorage() {
    try {
      const storedUsers = localStorage.getItem('mockUsers');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        users.forEach((userData: MockUser) => {
          this.mockUsers.set(userData.user.email, userData);
        });
      }
    } catch (error) {
      warn('No stored mock users found');
    }
  }

  private saveMockUsersToStorage() {
    try {
      const users = Array.from(this.mockUsers.values());
      localStorage.setItem('mockUsers', JSON.stringify(users));
    } catch (error) {
      logError('Failed to save mock users to storage');
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authChanged'));
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authChanged'));
    }
  }

  private generateMockToken(): string {
    return 'mock_token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private async mockRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    log("Mock request called for endpoint:", endpoint);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const body = options.body ? JSON.parse(options.body as string) : {};
    log("Mock request body:", body);
    
    switch (endpoint) {
      case '/auth/login':
        return this.handleMockLogin(body) as ApiResponse<T>;
      case '/auth/register':
        return this.handleMockRegister(body) as ApiResponse<T>;
      case '/auth/logout':
        return this.handleMockLogout() as ApiResponse<T>;
      case '/auth/me':
        return this.handleMockCheckAuth() as ApiResponse<T>;
      default:
        throw new Error('Endpoint not found');
    }
  }

  private handleMockLogin(credentials: LoginRequest): ApiResponse<AuthResponse> {
    log("Mock login called with:", credentials);
    const userData = this.mockUsers.get(credentials.email);
    log("Found user data:", userData);
    
    if (!userData || userData.password !== credentials.password) {
      warn("Login failed - invalid credentials");
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }

    const token = this.generateMockToken();
    this.setToken(token);
    log("Mock login successful, token generated:", token);

    return {
      success: true,
      data: {
        token,
        user: userData.user
      }
    };
  }

  private handleMockRegister(userData: RegisterRequest): ApiResponse<AuthResponse> {
    // Check if user already exists
    if (this.mockUsers.has(userData.email)) {
      return {
        success: false,
        message: 'User with this email already exists'
      };
    }

    // Create new mock user
    const newUser = {
      id: Date.now().toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email
    };

    this.mockUsers.set(userData.email, {
      password: userData.password,
      user: newUser
    });

    // Save to localStorage
    this.saveMockUsersToStorage();

    const token = this.generateMockToken();
    this.setToken(token);

    return {
      success: true,
      data: {
        token,
        user: newUser
      }
    };
  }

  private handleMockLogout(): ApiResponse<void> {
    this.clearToken();
    return {
      success: true
    };
  }

  private handleMockCheckAuth(): ApiResponse<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }> {
    const token = this.getToken();
    if (!token) {
      return {
        success: false,
        message: 'No valid token found'
      };
    }

    return {
      success: true,
      data: {
        id: '1',
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@exight.com'
      }
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      log(`Making API call to: ${url}`);
      const response = await fetch(url, config);

      // Gracefully handle empty/204 responses
      if (response.status === 204) {
        return { success: true } as T;
      }

      // Some servers return empty body with 200/202
      const rawText = await response.text();
      const data = rawText ? JSON.parse(rawText) : { success: response.ok };

      if (!response.ok) {
        const message = (data && (data.message || data.error)) || `HTTP error! status: ${response.status}`;
        logError(`API Error: ${response.status} - ${message}`);
        throw new Error(message);
      }

      log(`API call successful:`, data);
      return data as T; // may be {token,user} or {success,data}
    } catch (error) {
      logError('API request failed:', error);
      throw error;
    }
  }

  // Normalize server responses to strict frontend types
  private normalizeExpense(raw: any): Expense {
    const partialPayments = Array.isArray(raw?.partialPayments)
      ? raw.partialPayments.map((pp: any) => ({
          id: String(pp.id ?? ''),
          amount: Number(pp.amount ?? 0),
          date: pp.date ? new Date(pp.date) : new Date(),
          description: pp.description,
        }))
      : [];

    return {
      id: String(raw?.id ?? ''),
      name: String(raw?.name ?? ''),
      amount: Number(raw?.amount ?? 0),
      currency: String(raw?.currency ?? 'INR') as Expense['currency'],
      type: String(raw?.type ?? 'EMI') as Expense['type'],
      deductionDay: Number(raw?.deductionDay ?? 1),
      isRecurring: Boolean(raw?.isRecurring),
      totalMonths: raw?.totalMonths == null ? undefined : Number(raw.totalMonths),
      remainingMonths: raw?.remainingMonths == null ? undefined : Number(raw.remainingMonths),
      remainingAmount: raw?.remainingAmount == null ? undefined : Number(raw.remainingAmount),
      createdAt: raw?.createdAt ? new Date(raw.createdAt) : new Date(),
      partialPayments,
    };
  }

  private normalizeLoan(raw: any): Loan {
    const payments: AppLoanPayment[] = Array.isArray(raw?.payments)
      ? raw.payments.map((p: any) => ({
          id: String(p.id ?? ''),
          amount: Number(p.amount ?? 0),
          date: p.date ? new Date(p.date) : new Date(),
          description: p.description,
          type: (p.type === 'write-off' ? 'write-off' : 'payment') as AppLoanPayment['type'],
        }))
      : [];

    return {
      id: String(raw?.id ?? ''),
      personName: String(raw?.personName ?? ''),
      amount: Number(raw?.amount ?? 0),
      currency: String(raw?.currency ?? 'INR'),
      dateGiven: raw?.dateGiven ? new Date(raw.dateGiven) : new Date(),
      description: raw?.description,
      status: (raw?.status === 'completed' || raw?.status === 'written-off') ? raw.status : 'active',
      totalReceived: Number(raw?.totalReceived ?? 0),
      remainingAmount: Number(raw?.remainingAmount ?? 0),
      writeOffDate: raw?.writeOffDate ? new Date(raw.writeOffDate) : undefined,
      createdAt: raw?.createdAt ? new Date(raw.createdAt) : new Date(),
      payments,
    };
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const res = await this.request<AuthResponse | AuthResponseWrapper>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      // Normalize backend response shape
      if (res && 'token' in res && (res as any).token) {
        this.setToken((res as any).token);
        return res as AuthResponse;
      }
      if (res && 'success' in (res as any) && (res as any).success && (res as any).data) {
        const data = (res as any).data as AuthResponse;
        this.setToken(data.token);
        return data;
      }

      // If backend responded but without expected fields, fall back to mock
      const mock = this.handleMockLogin(credentials);
      if (mock.success && mock.data) return mock.data;
      throw new Error((res as any)?.message || (res as any)?.error || 'Login failed');
    } catch (err) {
      // Network/server error: allow mock login for known demo/admin users
      const mock = this.handleMockLogin(credentials);
      if (mock.success && mock.data) return mock.data;
      throw err;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    // Backend expects { email, password, name }
    const payload = {
      email: userData.email,
      password: userData.password,
      name: `${userData.firstName ?? ''} ${userData.lastName ?? ''}`.trim() || userData.email.split('@')[0],
    };
    try {
      const res = await this.request<AuthResponse | AuthResponseWrapper>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res && 'token' in (res as any) && (res as any).token) {
        this.setToken((res as any).token);
        return res as AuthResponse;
      }
      if (res && 'success' in (res as any) && (res as any).success && (res as any).data) {
        const data = (res as any).data as AuthResponse;
        this.setToken(data.token);
        return data;
      }

      // If backend response unexpected, generate a mock user
      const mock = this.handleMockRegister(userData);
      if (mock.success && mock.data) return mock.data;
      throw new Error((res as any)?.message || (res as any)?.error || 'Registration failed');
    } catch (err) {
      const mock = this.handleMockRegister(userData);
      if (mock.success && mock.data) return mock.data;
      throw err;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      logError('Logout API call failed:', error);
    } finally {
      this.clearToken();
    }
  }

  async checkAuth(): Promise<boolean> {
    try {
      const response = await this.request<{ success?: boolean }>('/auth/me');
      if (response && response.success !== undefined) return !!response.success;
      // If backend has no /auth/me, fall back to token
      return !!this.getToken();
    } catch (error) {
      return !!this.getToken();
    }
  }

  // Fetch the currently authenticated user's profile (normalized)
  async getCurrentUser(): Promise<{
    id?: string | number;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null> {
    try {
      const res = await this.request<{
        user?: { id?: string | number; firstName?: string; lastName?: string; email?: string };
        data?: { id?: string | number; firstName?: string; lastName?: string; email?: string };
      }>('/auth/me');
      // Support various backend response shapes
      if (res && res.user) return res.user;
      if (res && res.data) return res.data;
      return null;
    } catch (error) {
      return null;
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Expenses API (server-backed)
  async listExpenses(): Promise<Expense[]> {
    const res = await this.request<Expense[] | ExpenseResponseWrapper>('/expenses');
    const list = (res && 'success' in res && res.success !== undefined) ? res.data : (res as any[]);
    return Array.isArray(list) ? list.map(e => this.normalizeExpense(e)) : [];
  }

  async createExpense(payload: Omit<Expense, 'id' | 'createdAt' | 'partialPayments'>): Promise<Expense> {
    const res = await this.request<Expense | SingleExpenseResponseWrapper>('/expenses', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const item = (res && 'success' in res && res.success !== undefined) ? (res as SingleExpenseResponseWrapper).data : (res as any);
    return this.normalizeExpense(item);
  }

  async updateExpense(id: string | number, payload: Partial<Expense>): Promise<Expense> {
    const numericId = typeof id === 'string' && /^\d+$/.test(id) ? Number(id) : id;
    try {
      const res = await this.request<Expense | SingleExpenseResponseWrapper>(`/expenses/${numericId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      const item = (res && 'success' in res && res.success !== undefined) ? (res as SingleExpenseResponseWrapper).data : (res as any);
      return this.normalizeExpense(item);
    } catch (e1) {
      try {
        const res2 = await this.request<Expense | SingleExpenseResponseWrapper>(`/expenses?id=${numericId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        const item2 = (res2 && 'success' in res2 && res2.success !== undefined) ? (res2 as SingleExpenseResponseWrapper).data : (res2 as any);
        return this.normalizeExpense(item2);
      } catch (e2) {
        const res3 = await this.request<Expense | SingleExpenseResponseWrapper>(`/expenses/${numericId}/update`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        const item3 = (res3 && 'success' in res3 && res3.success !== undefined) ? (res3 as SingleExpenseResponseWrapper).data : (res3 as any);
        return this.normalizeExpense(item3);
      }
    }
  }

  async deleteExpense(id: string | number): Promise<{ success: boolean }> {
    // Try several common delete shapes to maximize compatibility
    const numericId = typeof id === 'string' && /^\d+$/.test(id) ? Number(id) : id;
    try {
      const res = await this.request<{ success: boolean }>(`/expenses/${numericId}`, { method: 'DELETE' });
      return res;
    } catch (e1) {
      try {
        const res2 = await this.request<{ success: boolean }>(`/expenses?id=${numericId}`, { method: 'DELETE' });
        return res2;
      } catch (e2) {
        const res3 = await this.request<{ success: boolean }>(`/expenses/${numericId}/delete`, { method: 'POST' });
        return res3;
      }
    }
  }

  // Loans API (server-backed)
  async listLoans(): Promise<Loan[]> {
    const res = await this.request<Loan[] | LoanResponseWrapper>('/loans');
    const list = (res && 'success' in res && res.success !== undefined) ? res.data : (res as any[]);
    return Array.isArray(list) ? list.map(l => this.normalizeLoan(l)) : [];
  }

  async createLoan(payload: Omit<Loan, 'id' | 'createdAt' | 'payments' | 'totalReceived' | 'remainingAmount' | 'status'>): Promise<Loan> {
    const res = await this.request<Loan | SingleLoanResponseWrapper>('/loans', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const item = (res && 'success' in res && res.success !== undefined) ? (res as SingleLoanResponseWrapper).data : (res as any);
    return this.normalizeLoan(item);
  }

  // Feedback (server-backed; falls back to mailto if endpoint is missing)
  async sendFeedback(payload: FeedbackPayload): Promise<FeedbackResponse> {
    try {
      const res = await this.request<FeedbackResponse>('/feedback', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return res;
    } catch (e) {
      const subject = encodeURIComponent('Exight Feedback');
      const body = encodeURIComponent(`Name: ${payload.name || ''}\nEmail: ${payload.email || ''}\n\n${payload.message}`);
      if (typeof window !== 'undefined') {
        window.location.href = `mailto:feedback@exight.in?subject=${subject}&body=${body}`;
      }
      return { success: true };
    }
  }
}

export const apiService = new ApiService(); 