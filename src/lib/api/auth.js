import api from '@/lib/axios';

export const authApi = {
  login:          (data)            => api.post('/auth/login', data),
  register:       (data)            => api.post('/auth/register', data),
  logout:         ()                => api.post('/auth/logout'),
  refresh:        ()                => api.post('/auth/refresh'),
  sendOtp:        (phone)           => api.post('/auth/send-otp', { phone }),
  verifyOtp:      (phone, otp)      => api.post('/auth/verify-otp', { phone, otp }),
  forgotPassword: (email)           => api.post('/auth/forgot-password', { email }),
  resetPassword:  (token, password) => api.post('/auth/reset-password', { token, password }),

  // Google OAuth — backend exchanges code/token and sets httpOnly cookie
  googleCallback: (code)            => api.post('/auth/google/callback', { code }),
};
