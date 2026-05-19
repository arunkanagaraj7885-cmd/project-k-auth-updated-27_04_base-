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
  setCredentials,
} from '@/store/slices/authSlice';
import { userApi } from '@/lib/api/user';

const PAGE_TITLES = {
  '/main/dashboard':       'Dashboard',
  '/main/start-interview': 'Start Interview',
  '/main/reports':         'My Reports',
  '/main/profile-setup':   'My Profile',
  '/main/jobs':            'Job Board',
  '/main/upgrade':         'Upgrade Plan',
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
  const onboardingComplete = useAppSelector(selectOnboardingComplete);
  const planSelected       = useAppSelector(selectPlanSelected);

  const title = Object.entries(PAGE_TITLES).find(([k]) => pathname?.startsWith(k))?.[1] || 'Project K';

  // ── Rehydrate Redux on hard refresh + enforce onboarding gates ───────────
  useEffect(() => {
    const rehydrate = async () => {
      try {
        // /auth/me returns a flat user object — no nested .user key
        const res  = await userApi.getMe();
        const u    = res.data;
        // Backend may not return plan — fall back to what the user selected locally
        const plan = u.plan ?? sessionStorage.getItem('pk_plan') ?? 'free';

        const userObj = {
          id:         u.id         || null,
          name:       `${u.first_name} ${u.last_name}`,
          email:      u.email,
          first_name: u.first_name,
          last_name:  u.last_name,
          avatar_url: u.avatar_url || null,
          plan,
        };

        sessionStorage.setItem('pk_user', JSON.stringify(userObj));
        sessionStorage.setItem('pk_plan', plan);

        // Backend may not return onboarding_complete — use pk_onb cookie as source of truth.
        // 'plan' or 'profile' → still in onboarding (false); 'done' or absent → complete (true)
        const onbCookie = document.cookie.split('; ').find((c) => c.startsWith('pk_onb='))?.split('=')[1];
        const onboardingComplete = u.onboarding_complete !== undefined
          ? u.onboarding_complete
          : (!onbCookie || onbCookie === 'done');

        dispatch(setCredentials({
          user:                userObj,
          plan,
          onboarding_complete: onboardingComplete,
          plan_selected:       u.plan_selected ?? (onbCookie === 'done' || !onbCookie),
        }));

        if (!onboardingComplete) {
          const planSelected = u.plan_selected ?? (onbCookie === 'profile' || onbCookie === 'done');
          if (!planSelected && !pathname.startsWith('/main/profile-setup')) {
            setOnbCookie('plan');
            router.replace('/pricing?onboarding=1');
            return;
          }
          if (planSelected && !pathname.startsWith('/main/profile-setup')) {
            setOnbCookie('profile');
            router.replace('/main/profile-setup');
            return;
          }
          if (planSelected) setOnbCookie('profile');
        } else {
          setOnbCookie('done');
        }
      } catch {
        // Backend unavailable or session expired — rehydrate from sessionStorage.
        const onbStep = document.cookie
          .split('; ')
          .find((c) => c.startsWith('pk_onb='))
          ?.split('=')[1];

        const savedPlan = sessionStorage.getItem('pk_plan') || 'free';
        const savedRaw  = sessionStorage.getItem('pk_user');
        const savedUser = savedRaw ? (() => { try { return JSON.parse(savedRaw); } catch { return null; } })() : null;

        // No stored user at all → session is truly gone, send to login
        if (!savedUser) {
          router.replace('/auth/login');
          return;
        }

        if (onbStep === 'plan') {
          dispatch(setCredentials({
            user: savedUser,
            plan: 'free',
            onboarding_complete: false,
            plan_selected: false,
          }));
        } else if (onbStep === 'profile') {
          dispatch(setCredentials({
            user: { ...savedUser, plan: savedPlan },
            plan: savedPlan,
            onboarding_complete: false,
            plan_selected: true,
          }));
        } else {
          dispatch(setCredentials({
            user: { ...savedUser, plan: savedPlan },
            plan: savedPlan,
            onboarding_complete: true,
            plan_selected: true,
          }));
          setOnbCookie('done');
        }
      }
    };
    rehydrate();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <AppSidebar />

      <div
        className="transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 260 : 72 }}
      >
        <AppHeader title={title} />

        <main className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
