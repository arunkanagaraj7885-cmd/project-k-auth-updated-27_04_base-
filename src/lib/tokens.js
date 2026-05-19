function deleteCookie(name) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

// Non-sensitive session flag on the frontend domain.
// Next.js middleware reads this to know a session exists.
// It carries no token value — actual auth is enforced by backend httpOnly cookies
// on every API call. Expires in 30 days to match the refresh_token lifetime.
export function setSessionCookie() {
  if (typeof document === 'undefined') return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `pk_session=1; path=/; max-age=2592000; SameSite=Lax${secure}`;
}

// Clears all frontend-managed cookies on logout.
// Backend clears httpOnly access_token + refresh_token via Set-Cookie Max-Age=0
// in the /auth/logout response.
export function clearTokens() {
  deleteCookie('pk_session');
  deleteCookie('pk_onb');
}
