'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { CheckCircle2, Chrome } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import PasswordInput from '@/components/auth/PasswordInput';
import OTPModal from '@/components/auth/OTPModal';
import { signupSchema } from '@/lib/validations';
import { authApi } from '@/lib/api/auth';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';

// Cookie helper (client-side) for onboarding step
function setOnbCookie(val) {
  document.cookie = `pk_onb=${val}; path=/; max-age=86400; SameSite=Lax`;
}

export default function SignupPage() {
  const router   = useRouter();
  const dispatch = useAppDispatch();

  const [loading, setLoading]           = useState(false);
  const [sendingOtp, setSendingOtp]     = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [currentPhone, setCurrentPhone] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  /* ── Google OAuth ─────────────────────────────────────────────────────── */
  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      // Redirect to backend Google OAuth; backend will set the access_token
      // cookie and redirect back to /auth/google-callback
      const callbackUrl = encodeURIComponent(`${window.location.origin}/auth/google-callback?onboarding=1`);
      window.location.href = `/api/auth/google?redirect_uri=${callbackUrl}`;
    } catch {
      toast.error('Google sign-in failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  /* ── WhatsApp OTP ─────────────────────────────────────────────────────── */
  const handleSendOtp = async () => {
    const phone = getValues('whatsappNumber');
    if (!phone || phone.length !== 10) {
      toast.error('Enter a valid 10-digit mobile number first.');
      return;
    }
    setSendingOtp(true);
    try {
      await authApi.sendOtp(phone);
      setCurrentPhone(phone);
      setOtpModalOpen(true);
      toast.success('OTP sent to your WhatsApp!');
    } catch {
      toast.error('Failed to send OTP. Try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  /* ── Form submit ──────────────────────────────────────────────────────── */
  const onSubmit = async (data) => {
    if (!phoneVerified) {
      toast.error('Please verify your WhatsApp number first.');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.register({
        first_name: data.firstName,
        last_name:  data.lastName,
        email:      data.email,
        password:   data.password,
        whatsapp_number: data.whatsappNumber,
      });
      const { user } = res.data;
      dispatch(setCredentials({ user, plan: 'free', onboarding_complete: false, plan_selected: false }));
      // Mark onboarding step — user must choose a plan next
      setOnbCookie('plan');
      toast.success('Account created! Choose a plan to continue.');
      router.push('/pricing?onboarding=1');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed. Try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center px-4 py-8">
      <div className="card w-full max-w-sm p-8 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Logo size="md" />
        </div>

        <h2 className="text-center text-xl font-semibold text-slate-800 mb-1">
          Create your account
        </h2>
        <p className="text-center text-sm text-slate-500 mb-6">
          Register for{' '}
          <span className="font-semibold text-slate-700">Project K Interview Module</span>
        </p>

        {/* ── Google Sign-up ── */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 mb-4 rounded-lg border-2 border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
        >
          {googleLoading ? (
            <span className="spinner spinner-brand" />
          ) : (
            <>
              {/* Google "G" colour logo */}
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M43.611 20.083H42V20H24V28H35.303C33.654 32.657 29.223 36 24 36C17.373 36 12 30.627 12 24C12 17.373 17.373 12 24 12C27.059 12 29.842 13.154 31.961 15.039L37.618 9.382C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24C4 35.045 12.955 44 24 44C35.045 44 44 35.045 44 24C44 22.659 43.862 21.35 43.611 20.083Z" fill="#FFC107"/>
                <path d="M6.306 14.691L12.877 19.51C14.655 15.108 18.961 12 24 12C27.059 12 29.842 13.154 31.961 15.039L37.618 9.382C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691Z" fill="#FF3D00"/>
                <path d="M24 44C29.166 44 33.86 42.023 37.409 38.808L31.219 33.57C29.211 35.091 26.715 36 24 36C18.798 36 14.381 32.683 12.717 28.054L6.195 33.079C9.505 39.556 16.227 44 24 44Z" fill="#4CAF50"/>
                <path d="M43.611 20.083H42V20H24V28H35.303C34.511 30.237 33.072 32.166 31.216 33.571C31.217 33.57 31.218 33.57 31.219 33.569L37.409 38.807C36.971 39.205 44 34 44 24C44 22.659 43.862 21.35 43.611 20.083Z" fill="#1976D2"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">or with WhatsApp</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                {...register('firstName')}
                type="text"
                placeholder="First name"
                className={`input-base ${errors.firstName ? 'error' : ''}`}
                autoComplete="given-name"
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <input
                {...register('lastName')}
                type="text"
                placeholder="Last name"
                className={`input-base ${errors.lastName ? 'error' : ''}`}
                autoComplete="family-name"
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Email address"
              className={`input-base ${errors.email ? 'error' : ''}`}
              autoComplete="email"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password row */}
          <div className="grid grid-cols-2 gap-3">
            <PasswordInput
              register={register('password')}
              placeholder="Password"
              error={errors.password?.message}
            />
            <PasswordInput
              register={register('confirmPassword')}
              placeholder="Confirm"
              error={errors.confirmPassword?.message}
            />
          </div>

          {/* WhatsApp + Verify */}
          <div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium">
                  +91
                </span>
                <input
                  {...register('whatsappNumber')}
                  type="tel"
                  placeholder="WhatsApp number"
                  className={`input-base pl-10 ${errors.whatsappNumber ? 'error' : ''}`}
                  maxLength={10}
                  autoComplete="tel"
                />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp || phoneVerified}
                className="btn-secondary flex-shrink-0 px-4 whitespace-nowrap"
                style={{ width: 'auto' }}
              >
                {sendingOtp ? <span className="spinner spinner-brand" /> : 'Verify'}
              </button>
            </div>
            {errors.whatsappNumber && (
              <p className="mt-1 text-xs text-red-500">{errors.whatsappNumber.message}</p>
            )}
          </div>

          {/* Verified badge */}
          {phoneVerified && (
            <div className="flex items-center gap-2 -mt-1">
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="text-sm text-green-600 font-medium">WhatsApp verified</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !phoneVerified}
            className="btn-primary mt-1"
          >
            {loading ? <span className="spinner" /> : 'Create Account →'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">
            Back to login
          </Link>
        </p>
      </div>

      {/* OTP Modal */}
      <OTPModal
        open={otpModalOpen}
        phone={currentPhone}
        onSuccess={() => {
          setPhoneVerified(true);
          setOtpModalOpen(false);
        }}
        onClose={() => setOtpModalOpen(false)}
      />
    </div>
  );
}
