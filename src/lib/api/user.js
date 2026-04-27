import api from '@/lib/axios';

export const userApi = {
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.put('/users/me', data),
  uploadAvatar: (file) => {
    const form = new FormData();
    form.append('avatar', file);
    return api.post('/users/me/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteAvatar: () => api.delete('/users/me/avatar'),
  uploadResume: (file) => {
    const form = new FormData();
    form.append('resume', file);
    return api.post('/users/me/resume', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getResumeStatus: () => api.get('/users/me/resume/status'),
  deleteResume: () => api.delete('/users/me/resume'),
};
