import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const { data } = await api.post('/login', { email, password });
  return data;
};

export const fetchNeos = async (filters = {}) => {
  const sanitizedFilters = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== '' && value !== undefined && value !== null),
  );

  const { data } = await api.get('/neos', { params: sanitizedFilters });
  return data;
};

export const createNeo = async (neo) => {
  const { data } = await api.post('/neos', neo);
  return data;
};

export default api;
