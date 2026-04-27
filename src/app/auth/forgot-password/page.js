'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { CheckCircle2 } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import { forgotPasswordSchema } from '@/lib/validations';
import { authApi } from '@/lib/api/auth';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authApi.forgotPassword(data.email);
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
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

        {sent ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-green-500" />
            </div>
            <h2 className="font-semibold text-slate-800 text-lg">Check your inbox</h2>
            <p className="text-sm text-slate-500">
              We&apos;ve sent a password reset link to your email address.
            </p>
            <Link href="/auth/login" className="btn-primary mt-2" style={{ width: 'auto', padding: '10px 32px' }}>
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-center text-xl font-semibold text-slate-800 mb-2">Forgot password</h2>
            <p className="text-center text-sm text-slate-500 mb-6">
              Enter your email and we&apos;ll send you a reset link.
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
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <span className="spinner" /> : 'Send reset link'}
              </button>
            </form>
            <p className="text-center text-sm text-slate-500 mt-5">
              <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">
                ← Back to login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
