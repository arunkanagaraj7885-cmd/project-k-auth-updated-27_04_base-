'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import PasswordInput from '@/components/auth/PasswordInput';
import { loginSchema } from '@/lib/validations';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { authApi } from '@/lib/api/auth';
import { setSessionCookie } from '@/lib/tokens';

function setOnbCookie(val) {
  document.cookie = `pk_onb=${val}; path=/; max-age=86400; SameSite=Lax`;
}

export default function LoginPage() {
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Backend sets access_token + refresh_token as httpOnly cookies.
      // Login response body contains the user object directly — no separate /auth/me call needed.
      const { user: u } = (await authApi.login({ email: data.email, password: data.password })).data;

      const plan = u.plan || sessionStorage.getItem('pk_plan') || 'free';

      const userObj = {
        id:         u.id         || null,
        name:       `${u.first_name} ${u.last_name}`,
        email:      u.email,
        first_name: u.first_name,
        last_name:  u.last_name,
        avatar_url: u.avatar_url || null,
        plan,
      };

      setSessionCookie();
      sessionStorage.setItem('pk_user', JSON.stringify(userObj));
      sessionStorage.setItem('pk_plan', plan);

      dispatch(setCredentials({
        user:                userObj,
        plan,
        onboarding_complete: true,
        plan_selected:       true,
      }));

      toast.success(`Welcome back, ${u.first_name}!`);

      // Step 4: Respect any in-progress onboarding cookie, otherwise go to dashboard
      const onbStep = document.cookie.split('; ').find((c) => c.startsWith('pk_onb='))?.split('=')[1];
      if (onbStep === 'plan') {
        router.push('/pricing?onboarding=1');
      } else if (onbStep === 'profile') {
        router.push('/main/profile-setup');
      } else {
        setOnbCookie('done');
        router.push('/main/dashboard');
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      toast.error(typeof detail === 'string' ? detail : 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-sm p-8 animate-fade-in">
        <div className="flex justify-center mb-6">
          <Logo size="md" />
        </div>

        <h2 className="text-center text-xl font-bold text-slate-800 mb-1">Welcome back</h2>
        <p className="text-center text-sm text-slate-500 mb-6">
          Sign in to{' '}
          <span className="font-semibold text-slate-700">Project K Interview Module</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
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

          <div>
            <PasswordInput
              register={register('password')}
              error={errors.password?.message}
            />
          </div>

          <div className="-mt-1">
            <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline font-medium">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-1 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Signing in…</>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-blue-600 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
