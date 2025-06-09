import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const expenseAPI = {
  // Get all expenses with filters
  getExpenses: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.dateRange) params.append('dateRange', filters.dateRange);
    if (filters.categories?.length) {
      filters.categories.forEach(cat => params.append('categories', cat));
    }
    if (filters.paymentModes?.length) {
      filters.paymentModes.forEach(mode => params.append('paymentModes', mode));
    }
    
    const response = await api.get(`/expenses?${params}`);
    return response.data;
  },

  // Add new expense
  addExpense: async (expense) => {
    const response = await api.post('/expenses', expense);
    return response.data;
  },

  // Delete expense
  deleteExpense: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  // Get analytics data
  getAnalytics: async () => {
    const response = await api.get('/expenses/analytics');
    return response.data;
  },
};

export default api;