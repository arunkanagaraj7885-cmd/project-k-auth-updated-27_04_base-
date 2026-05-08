import { NextResponse } from 'next/server';

// Public paths — no auth required
const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/pricing',
  '/score-card',
];

// Onboarding cookie name — tracks where the new user is in signup flow
// Values: 'plan'    → must choose a plan first     (/pricing)
//         'profile' → must complete profile setup   (/main/profile-setup)
//         'done'    → onboarding finished, all /main/* accessible
const ONB_COOKIE = 'pk_onb';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Always allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Only check cookie presence — the Python backend enforces real auth on every API call.
  // Verifying the JWT here with a frontend secret would always fail if the backend
  // uses a different signing key, causing a redirect loop on every protected route.
  const token = req.cookies.get('access_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // ── Onboarding guard ────────────────────────────────────────────────────────
  const onbStep = req.cookies.get(ONB_COOKIE)?.value; // 'plan' | 'profile' | 'done' | undefined

  // Existing users who never went through the new onboarding flow won't have
  // this cookie — treat them as done so they hit the dashboard directly.
  if (!onbStep || onbStep === 'done') {
    return NextResponse.next();
  }

  // User must pick a plan first
  if (onbStep === 'plan') {
    if (!pathname.startsWith('/pricing')) {
      return NextResponse.redirect(new URL('/pricing?onboarding=1', req.url));
    }
    return NextResponse.next();
  }

  // User has a plan, must complete profile setup
  if (onbStep === 'profile') {
    if (!pathname.startsWith('/main/profile-setup')) {
      return NextResponse.redirect(new URL('/main/profile-setup', req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon\\.ico|api|.*\\.png|.*\\.jpg|.*\\.svg).*)'],
};
