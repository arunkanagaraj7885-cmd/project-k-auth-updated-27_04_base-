import axios from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './tokens';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.projectk.io/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ── Attach Bearer token to every outgoing request ────────────────────────────
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// ── Auth endpoints that must never trigger the refresh retry loop ─────────────
const AUTH_PATHS = ['/auth/login', '/auth/refresh-token', '/auth/logout', '/auth/register'];
function isAuthEndpoint(url = '') {
  return AUTH_PATHS.some((p) => url.includes(p));
}

let refreshing = false;
let queue = [];

// ── Auto-refresh on 401, then replay queued requests ─────────────────────────
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const orig = err.config;

    if (err.response?.status === 401 && !orig._retry && !isAuthEndpoint(orig.url)) {
      orig._retry = true;

      if (refreshing) {
        return new Promise((resolve) => queue.push(() => resolve(api(orig))));
      }

      refreshing = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error('no_refresh_token');

        const res = await api.post('/auth/refresh-token', { refresh_token: refreshToken });
        const { access_token, refresh_token } = res.data;

        saveTokens(access_token, refresh_token || refreshToken);
        orig.headers['Authorization'] = `Bearer ${access_token}`;
      } catch {
        refreshing = false;
        queue = [];
        clearTokens();
        if (typeof window !== 'undefined') window.location.href = '/auth/login';
        return Promise.reject(err);
      }

      refreshing = false;
      queue.forEach((cb) => cb());
      queue = [];
      return api(orig);
    }

    return Promise.reject(err);
  }
);

export default api;
