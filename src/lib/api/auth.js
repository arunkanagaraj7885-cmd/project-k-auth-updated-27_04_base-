import api from '@/lib/axios';

export const authApi = {
  // Backend uses OAuth2PasswordRequestForm — must send form-encoded with field 'username'
  login: (data) => {
    const form = new URLSearchParams();
    form.append('username', data.email);
    form.append('password', data.password);
    return api.post('/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },

  register: (data) => api.post('/auth/register', {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    password: data.password,
    confirm_password: data.confirmPassword,
    phone_number: data.phoneNumber,
    email_verified: true,
    user_type: 'individual',
  }),

  logout:         ()                => api.post('/auth/logout'),
  refresh: (refreshToken)           => api.post('/auth/refresh-token', { refresh_token: refreshToken }),

  // Backend expects { email }
  sendOtp: (email)           => api.post('/auth/send-otp', { email }),

  // Backend expects { email, otp_code, purpose }
  verifyOtp: (email, otp_code, purpose = 'login') =>
    api.post('/auth/verify-otp', { email, otp_code, purpose }),

  forgotPassword: (email)           => api.post('/auth/forgot-password', { email }),

  // Backend expects { token, new_password, confirm_password }
  resetPassword: (token, password)  => api.post('/auth/reset-password', {
    token,
    new_password: password,
    confirm_password: password,
  }),
};
