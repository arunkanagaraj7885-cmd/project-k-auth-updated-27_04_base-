import api from '@/lib/axios';

export const interviewApi = {
  createSession:   (data)      => api.post('/interview/sessions', data),
  startSession:    (sessionId) => api.post(`/interview/sessions/${sessionId}/start`),
  submitAnswer:    (data)      => api.post('/interview/answers', data),
  completeSession: (sessionId) => api.post(`/interview/sessions/${sessionId}/complete`),
  getSessions:     ()          => api.get('/interview/sessions'),
};
