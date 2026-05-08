const AK = 'pk_access';
const RK = 'pk_refresh';

export function saveTokens(accessToken, refreshToken) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AK, accessToken);
  if (refreshToken) localStorage.setItem(RK, refreshToken);
  // Readable (non-httpOnly) cookie so Next.js middleware can gate protected routes
  document.cookie = `access_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
}

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AK);
}

export function getRefreshToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(RK);
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AK);
  localStorage.removeItem(RK);
  document.cookie = 'access_token=; path=/; max-age=0';
  document.cookie = 'pk_onb=; path=/; max-age=0';
}
