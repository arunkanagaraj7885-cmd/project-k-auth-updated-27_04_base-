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
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';

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
      await fetch('/api/auth/demo-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      const [firstName] = (data.email || 'demo@demo.com').split('@');
      const demoFirstName = firstName ? firstName.slice(0, 1).toUpperCase() + firstName.slice(1) : 'Demo';
      const user = {
        id: 'demo-001',
        email: data.email || 'demo@demo.com',
        first_name: demoFirstName,
        last_name: 'User',
        is_first_login: false,
      };

      dispatch(setCredentials({
        user: {
          id:         user.id,
          name:       `${user.first_name} ${user.last_name}`,
          email:      user.email,
          first_name: user.first_name,
          last_name:  user.last_name,
          avatar_url: null,
          plan:       'free',
        },
        plan:                'free',
        onboarding_complete: !user.is_first_login,
        plan_selected:       !user.is_first_login,
      }));

      toast.success(`Welcome back, ${user.first_name}!`);

      setOnbCookie('done');
      router.push('/main/dashboard');
    } catch (err) {
      const detail = err.response?.data?.detail;
      toast.error(detail || 'Invalid email or password.');
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

        <p className="text-center text-sm text-slate-500 mb-6">
          Sign in to continue to{' '}
          <span className="font-semibold text-slate-700">Project K Interview Module</span>
        </p>

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
