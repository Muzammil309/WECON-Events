import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { appConfig } from '@/lib/config';
import { createAuthToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    console.log('Login request body:', body);
    const { email, password, username } = body as { email?: string; password?: string; username?: string };

    // Support both email and username for login
    const loginIdentifier = email || username;
    console.log('Login identifier:', loginIdentifier);
    console.log('Password provided:', !!password);

    // Validate required fields
    if (!loginIdentifier || !password) {
      console.log('Missing required fields - identifier:', !!loginIdentifier, 'password:', !!password);
      return NextResponse.json(
        { ok: false, error: 'Email/username and password are required' },
        { status: 400 }
      );
    }

    // First check if it's the admin user from config (fallback)
    if (loginIdentifier === appConfig.admin.username && password === appConfig.admin.password) {
      const token = await createAuthToken({ sub: loginIdentifier, role: 'admin' });
      const response = NextResponse.json({
        ok: true,
        user: {
          id: 'admin',
          name: 'Admin User',
          email: loginIdentifier,
          role: 'admin'
        }
      });

      response.cookies.set('wecon_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });

      return response;
    }

    // Check database for user
    console.log('Searching for user with email:', loginIdentifier.toLowerCase());
    const user = await prisma.user.findUnique({
      where: {
        email: loginIdentifier.toLowerCase()
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        emailVerified: true
      }
    });

    console.log('User found:', !!user);
    if (!user) {
      console.log('User not found in database');
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // Note: Email verification check is disabled for now to allow testing
    // Uncomment the following lines if you want to require email verification:
    // if (!user.emailVerified) {
    //   return NextResponse.json({
    //     ok: false,
    //     error: 'Please verify your email before logging in. Check your inbox for the verification link.'
    //   }, { status: 403 });
    // }

    // Create JWT token
    const token = await createAuthToken({
      sub: user.id,
      role: user.role.toLowerCase(),
      email: user.email
    });

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase()
      }
    });

    response.cookies.set('wecon_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
