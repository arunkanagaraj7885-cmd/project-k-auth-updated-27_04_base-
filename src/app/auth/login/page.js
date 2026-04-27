'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Logo from '@/components/shared/Logo';
import PasswordInput from '@/components/auth/PasswordInput';
import { loginSchema } from '@/lib/validations';
import { authApi } from '@/lib/api/auth';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';

// Cookie helper
function setOnbCookie(val) {
  document.cookie = `pk_onb=${val}; path=/; max-age=86400; SameSite=Lax`;
}
function clearOnbCookie() {
  document.cookie = 'pk_onb=done; path=/; max-age=86400; SameSite=Lax';
}

export default function LoginPage() {
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading]           = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  /* ── Google Sign-in ───────────────────────────────────────────────────── */
  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    const callbackUrl = encodeURIComponent(`${window.location.origin}/auth/google-callback`);
    window.location.href = `/api/auth/google?redirect_uri=${callbackUrl}`;
  };

  /* ── Email + Password ─────────────────────────────────────────────────── */
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      const { user, onboarding_complete, plan_selected } = res.data;

      dispatch(setCredentials({ user, plan: user.plan, onboarding_complete, plan_selected }));
      toast.success(`Welcome back, ${user.name?.split(' ')[0]}!`);

      if (onboarding_complete) {
        clearOnbCookie();               // existing user — mark done
        router.push('/main/dashboard');
      } else if (plan_selected) {
        setOnbCookie('profile');        // chose plan but never finished profile
        router.push('/main/profile-setup');
      } else {
        setOnbCookie('plan');           // brand-new user, pick a plan first
        router.push('/pricing?onboarding=1');
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid email or password.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-sm p-8 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo size="md" />
        </div>

        <p className="text-center text-sm text-slate-500 mb-6">
          Sign in to continue to{' '}
          <span className="font-semibold text-slate-700">Project K Interview Module</span>
        </p>

        {/* ── Google Sign-in ── */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 mb-4 rounded-lg border-2 border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
        >
          {googleLoading ? (
            <span className="spinner spinner-brand" />
          ) : (
            <>
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
          <span className="text-xs text-slate-400 font-medium">or with email</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

          <PasswordInput
            register={register('password')}
            error={errors.password?.message}
          />

          <div className="flex items-center justify-between text-sm -mt-1">
            <Link href="/auth/forgot-password" className="text-blue-600 hover:underline font-medium">
              Forgot password
            </Link>
            <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
              Sign up
            </Link>
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-1">
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
