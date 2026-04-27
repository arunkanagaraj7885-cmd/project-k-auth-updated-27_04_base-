import api from '@/lib/axios';

export const interviewApi = {
  getConfigDefaults: () => api.get('/interviews/config/defaults'),
  createSession: (data) => api.post('/interviews/sessions', data),
  getSessionToken: (sessionId) => api.get(`/interviews/sessions/${sessionId}/token`),
  endSession: (sessionId) => api.post(`/interviews/sessions/${sessionId}/end`),
  getSessionStatus: (sessionId) => api.get(`/interviews/sessions/${sessionId}/status`),
  getRecent: (n = 3) => api.get(`/interviews/recent?limit=${n}`),
};
