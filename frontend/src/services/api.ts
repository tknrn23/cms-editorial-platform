import axios from 'axios';
import type { Article, Category, Network, EmailNotification, PaginatedResponse, DashboardStats, ArticleFilters } from '../types/index';

const API_BASE = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Article API
export const articleAPI = {
  getAll: async (filters?: ArticleFilters) => {
    const response = await api.get<PaginatedResponse<Article>>('/articles', { params: filters });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Article>(`/articles/${id}`);
    return response.data;
  },
  create: async (data: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>) => {
    const response = await api.post<Article>('/articles', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Article>) => {
    const response = await api.put<Article>(`/articles/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  },
  updateStatus: async (id: string, status: 'draft' | 'published' | 'archived') => {
    const response = await api.patch<Article>(`/articles/${id}/status`, { status });
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/articles/stats');
    return response.data;
  },
};

// Category API
export const categoryAPI = {
  getAll: async () => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },
  create: async (data: Omit<Category, 'id' | 'createdAt' | 'slug'>) => {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Category>) => {
    const response = await api.put<Category>(`/categories/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
  getStats: async (id: string) => {
    const response = await api.get(`/categories/${id}/stats`);
    return response.data;
  },
};

// Network API
export const networkAPI = {
  getAll: async () => {
    const response = await api.get<Network[]>('/networks');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Network>(`/networks/${id}`);
    return response.data;
  },
  create: async (data: Omit<Network, 'id' | 'createdAt'>) => {
    const response = await api.post<Network>('/networks', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Network>) => {
    const response = await api.put<Network>(`/networks/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/networks/${id}`);
    return response.data;
  },
  getStats: async (id: string) => {
    const response = await api.get(`/networks/${id}/stats`);
    return response.data;
  },
};

// Notification API
export const notificationAPI = {
  getAll: async () => {
    const response = await api.get<EmailNotification[]>('/notifications');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<EmailNotification>(`/notifications/${id}`);
    return response.data;
  },
  send: async (articleId: string, data: { recipients: string[]; subject: string }) => {
    const response = await api.post(`/notifications/${articleId}/send`, data);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/notifications/stats');
    return response.data;
  },
  getLatest: async (limit: number = 5) => {
    const response = await api.get<EmailNotification[]>('/notifications/latest', { params: { limit } });
    return response.data;
  },
};

// Import API
export const importAPI = {
  importArticles: async (data: any[]) => {
    const response = await api.post('/import/articles', { data });
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },
};
