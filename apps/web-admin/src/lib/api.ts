import axios from 'axios';
import Cookies from 'js-cookie';

interface ApiErrorData {
  message?: string | string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterLeaguePayload {
  organizationName: string;
  organizationSlug: string;
  email: string;
  password: string;
  rut: string;
  firstName: string;
  lastName: string;
}

export interface CreateTournamentPayload {
  name: string;
  slug: string;
}

export interface UpdateTournamentPayload {
  name?: string;
  slug?: string;
  status?: string;
}

export interface CreateTeamPayload {
  name: string;
  logo?: string;
}

export interface AssignPlayerPayload {
  playerId: string;
  number: number;
  position: string;
}

export interface CreatePlayerPayload {
  rut: string;
  firstName: string;
  lastName?: string;
  photo?: string;
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
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
    login: (data: LoginPayload) => apiClient.post('/auth/login', data),
    registerLeague: (data: RegisterLeaguePayload) =>
      apiClient.post('/auth/register-league', data),
  },
  tournaments: {
    create: (data: CreateTournamentPayload) => apiClient.post('/tournaments', data),
    findAll: () => apiClient.get('/tournaments'),
    findOne: (id: string) => apiClient.get(`/tournaments/${id}`),
    update: (id: string, data: UpdateTournamentPayload) =>
      apiClient.patch(`/tournaments/${id}`, data),
    remove: (id: string) => apiClient.delete(`/tournaments/${id}`),
  },
  teams: {
    create: (data: CreateTeamPayload) => apiClient.post('/teams', data),
    findAll: () => apiClient.get('/teams'),
    assignPlayer: (teamId: string, data: AssignPlayerPayload) =>
      apiClient.post(`/teams/${teamId}/players`, data),
  },
  players: {
    create: (data: CreatePlayerPayload) => apiClient.post('/players', data),
    findAll: () => apiClient.get('/players'),
  },
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorData>(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(', ');
    if (typeof message === 'string' && message.length > 0) return message;
  }
  return fallback;
}

export default apiClient;
