const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5001/api';

const getToken = () => localStorage.getItem('authToken');

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    let errorBody;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = { error: 'Request failed with status ' + res.status };
    }
    throw new Error(errorBody.error || 'API Error');
  }
  return res.json();
}

export const authAPI = {
  register: (data: any) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => apiRequest('/auth/profile'),
  logout: () => localStorage.removeItem('authToken'),
  isAuthenticated: () => !!getToken(),
};

export const expensesAPI = {
  getAll: () => apiRequest('/expenses'),
  create: (data: any) => apiRequest('/expenses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/expenses/${id}`, { method: 'DELETE' }),
  addPayment: (expenseId: string, data: any) => apiRequest(`/expenses/${expenseId}/payments`, { method: 'POST', body: JSON.stringify(data) }),
};

export const actionLogsAPI = {
  getAll: () => apiRequest('/action-logs'),
  create: (data: any) => apiRequest('/action-logs', { method: 'POST', body: JSON.stringify(data) }),
  clear: () => apiRequest('/action-logs/clear', { method: 'DELETE' }),
};

export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
}; 