import api from '@/lib/axios';

export const dashboardApi = {
  getSummary: () => api.get('/dashboard/summary'),
  getTrend: (n = 5) => api.get(`/dashboard/trend?limit=${n}`),
  getSkills: () => api.get('/dashboard/skills'),
  getInsights: () => api.get('/dashboard/insights'),
};
