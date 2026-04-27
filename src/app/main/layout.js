'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AppSidebar from '@/components/shared/AppSidebar';
import AppHeader  from '@/components/shared/AppHeader';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectSidebarOpen } from '@/store/slices/uiSlice';
import {
  selectOnboardingComplete,
  selectPlanSelected,
  selectIsAuthed,
  setCredentials,
} from '@/store/slices/authSlice';
import { userApi } from '@/lib/api/user';

const PAGE_TITLES = {
  '/main/dashboard':       'Dashboard',
  '/main/start-interview': 'Start Interview',
  '/main/reports':         'My Reports',
  '/main/profile-setup':   'My Profile',
  '/main/jobs':            'Job Board',
  '/pricing':              'Choose a Plan',
};

function setOnbCookie(val) {
  if (typeof document !== 'undefined') {
    document.cookie = `pk_onb=${val}; path=/; max-age=86400; SameSite=Lax`;
  }
}

export default function MainLayout({ children }) {
  const pathname           = usePathname();
  const router             = useRouter();
  const dispatch           = useAppDispatch();
  const sidebarOpen        = useAppSelector(selectSidebarOpen);
  const isAuthed           = useAppSelector(selectIsAuthed);
  const onboardingComplete = useAppSelector(selectOnboardingComplete);
  const planSelected       = useAppSelector(selectPlanSelected);

  const title = Object.entries(PAGE_TITLES).find(([k]) => pathname?.startsWith(k))?.[1] || 'Project K';

  // ── Rehydrate Redux on hard refresh + enforce onboarding gates ───────────
  useEffect(() => {
    const rehydrate = async () => {
      try {
        const res  = await userApi.getMe();
        const data = res.data;
        dispatch(setCredentials({
          user:                data.user,
          plan:                data.plan ?? 'free',
          onboarding_complete: data.onboarding_complete ?? false,
          plan_selected:       data.plan_selected ?? false,
        }));

        // Route new users through onboarding if they land on a protected page
        if (!data.onboarding_complete) {
          if (!data.plan_selected && !pathname.startsWith('/main/profile-setup')) {
            setOnbCookie('plan');
            router.replace('/pricing?onboarding=1');
            return;
          }
          if (data.plan_selected && !pathname.startsWith('/main/profile-setup')) {
            setOnbCookie('profile');
            router.replace('/main/profile-setup');
            return;
          }
          if (data.plan_selected) setOnbCookie('profile');
        } else {
          setOnbCookie('done');
        }
      } catch {
        // token invalid — middleware will redirect, just ignore
      }
    };
    rehydrate();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <AppSidebar />

      <div
        className="transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 260 : 72 }}
      >
        <AppHeader title={title} />

        <main className="pt-16 min-h-screen">
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
