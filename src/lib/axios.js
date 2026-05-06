import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.projectk.io/api/v1',
  withCredentials: true, // automatically sends httpOnly cookies
  headers: { 'Content-Type': 'application/json' },
});

let refreshing = false;
let queue = [];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const orig = err.config;
    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      if (refreshing) {
        return new Promise((resolve) => queue.push(() => resolve(api(orig))));
      }
      refreshing = true;
      try {
        await api.post('/auth/refresh-token');
      } catch {
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(err);
      } finally {
        refreshing = false;
      }
      queue.forEach((cb) => cb());
      queue = [];
      return api(orig);
    }
    return Promise.reject(err);
  }
);

export default api;
