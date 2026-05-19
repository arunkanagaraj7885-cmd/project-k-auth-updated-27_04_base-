import api from '@/lib/axios';

export const profileApi = {
  get: () => api.get('/profile/'),

  update: (data) => api.patch('/profile/', data),

  uploadPhoto: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post('/profile/photo', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadResume: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post('/profile/resume', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
