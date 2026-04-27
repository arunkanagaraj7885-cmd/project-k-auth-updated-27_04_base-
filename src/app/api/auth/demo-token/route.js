import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me');

  const token = await new SignJWT({ sub: 'demo-001', email: body.email ?? 'demo@demo.com', demo: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);

  const res = NextResponse.json({ ok: true });
  res.cookies.set('access_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });
  return res;
}
