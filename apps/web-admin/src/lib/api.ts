import axios from 'axios';
import Cookies from 'js-cookie';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('southgo_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const api = {
  auth: {
    login: (data: any) => apiClient.post('/auth/login', data),
    registerLeague: (data: any) => apiClient.post('/auth/register-league', data),
  },
  tournaments: {
    create: (data: any) => apiClient.post('/tournaments', data),
    findAll: () => apiClient.get('/tournaments'),
    findOne: (id: string) => apiClient.get(`/tournaments/${id}`),
    update: (id: string, data: any) => apiClient.patch(`/tournaments/${id}`, data),
    remove: (id: string) => apiClient.delete(`/tournaments/${id}`)
  }
};

export default apiClient;
