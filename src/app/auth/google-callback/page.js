'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { userApi } from '@/lib/api/user';
import toast from 'react-hot-toast';
import PageLoader from '@/components/shared/PageLoader';

function setOnbCookie(val) {
  document.cookie = `pk_onb=${val}; path=/; max-age=86400; SameSite=Lax`;
}

// This page is the OAuth redirect target.
// The backend has already set the access_token cookie.
// We just need to fetch the user state and route them correctly.
export default function GoogleCallbackPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const dispatch     = useAppDispatch();
  const isOnboarding = searchParams.get('onboarding') === '1';

  useEffect(() => {
    const init = async () => {
      try {
        const res  = await userApi.getMe();
        const data = res.data; // { user, plan, onboarding_complete, plan_selected }
        dispatch(setCredentials({
          user:                data.user,
          plan:                data.plan ?? 'free',
          onboarding_complete: data.onboarding_complete ?? false,
          plan_selected:       data.plan_selected ?? false,
        }));

        if (data.onboarding_complete) {
          setOnbCookie('done');
          router.push('/main/dashboard');
        } else if (data.plan_selected) {
          setOnbCookie('profile');
          router.push('/main/profile-setup');
        } else {
          setOnbCookie('plan');
          router.push('/pricing?onboarding=1');
        }
      } catch {
        toast.error('Google sign-in failed. Please try again.');
        router.push('/auth/login');
      }
    };
    init();
  }, []);

  return <PageLoader message="Signing you in…" />;
}
