import api from '@/lib/axios';

export const reportsApi = {
  getAll: (params) => api.get('/reports', { params }),
  getById: (id) => api.get(`/reports/${id}`),
  getSummary: (id) => api.get(`/reports/${id}/summary`),
  download: (id) => api.post(`/reports/${id}/download`),
  getScoreCard: (id) => api.get(`/score-cards/${id}`),
  verifyScoreCard: (id) => api.get(`/score-cards/${id}/verify`),
};
