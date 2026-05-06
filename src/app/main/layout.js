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
        // DEMO: backend unavailable — rehydrate Redux from the pk_onb cookie so
        // we never override an in-progress onboarding flow with a "done" session.
        if (!isAuthed) {
          const onbStep = document.cookie
            .split('; ')
            .find((c) => c.startsWith('pk_onb='))
            ?.split('=')[1];

          if (onbStep === 'plan') {
            // New user who hasn't picked a plan yet
            dispatch(setCredentials({
              user: { id: 'demo-001', name: 'Demo User', email: 'demo@demo.com', first_name: 'Demo', last_name: 'User', avatar_url: null, plan: 'free' },
              plan: 'free',
              onboarding_complete: false,
              plan_selected: false,
            }));
            // Middleware already enforces the redirect; don't touch the cookie
          } else if (onbStep === 'profile') {
            // New user who selected a plan but hasn't finished profile setup
            dispatch(setCredentials({
              user: { id: 'demo-001', name: 'Demo User', email: 'demo@demo.com', first_name: 'Demo', last_name: 'User', avatar_url: null, plan: 'premium' },
              plan: 'premium',
              onboarding_complete: false,
              plan_selected: true,
            }));
            // Middleware already enforces the redirect; don't touch the cookie
          } else {
            // Returning user with no active onboarding — give full demo access.
            // Prefer the name saved by profile-setup (survives the hard reload).
            const savedRaw = sessionStorage.getItem('demo_user');
            const saved = savedRaw ? JSON.parse(savedRaw) : null;
            dispatch(setCredentials({
              user: {
                id: 'demo-001',
                name:       saved?.name       || 'Demo User',
                email:      'demo@demo.com',
                first_name: saved?.first_name || 'Demo',
                last_name:  saved?.last_name  || 'User',
                avatar_url: null,
                plan: 'premium',
              },
              plan: 'premium',
              onboarding_complete: true,
              plan_selected: true,
            }));
            setOnbCookie('done');
          }
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
