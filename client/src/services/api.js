import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
const apiUrl = rawApiUrl ? rawApiUrl.replace(/\/+$|\s+/g, '') : null;
const normalizedApiUrl = apiUrl
  ? apiUrl.endsWith('/api')
    ? apiUrl
    : `${apiUrl}/api`
  : null;

const API = axios.create({
  baseURL:
    normalizedApiUrl ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:5000/api' : '/api'),
});
API.interceptors.request.use((req) => {
  try {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (user && user.token) {
      req.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch (error) {
    console.error('API Interceptor Error:', error);
  }
  return req;
});

export default API;
