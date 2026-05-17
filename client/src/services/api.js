import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
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
