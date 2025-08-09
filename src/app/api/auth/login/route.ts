import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { createAuthToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { username, password } = body as { username?: string; password?: string };

  if (username !== appConfig.admin.username || password !== appConfig.admin.password) {
    return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await createAuthToken({ sub: username!, role: 'admin' });
  const response = NextResponse.json({ ok: true });
  response.cookies.set('wecon_admin_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
  return response;
}
