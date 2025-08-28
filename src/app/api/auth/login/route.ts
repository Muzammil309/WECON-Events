import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { appConfig } from '@/lib/config';
import { createAuthToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Login API called');

    // Parse request body with better error handling
    let body;
    try {
      body = await request.json();
      console.log('✅ Request body parsed successfully');
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return NextResponse.json(
        { ok: false, error: 'Invalid request format' },
        { status: 400 }
      );
    }

    console.log('📦 Login request body:', { email: body.email, password: body.password ? '***' : 'missing' });
    const { email, password, username } = body as { email?: string; password?: string; username?: string };

    // Support both email and username for login
    const loginIdentifier = email || username;
    console.log('🔑 Login identifier:', loginIdentifier);
    console.log('🔒 Password provided:', !!password);

    // Validate required fields
    if (!loginIdentifier || !password) {
      console.log('❌ Missing required fields - identifier:', !!loginIdentifier, 'password:', !!password);
      return NextResponse.json(
        { ok: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (loginIdentifier.includes('@') && !loginIdentifier.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      console.log('❌ Invalid email format:', loginIdentifier);
      return NextResponse.json(
        { ok: false, error: 'Invalid email format' },
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
    console.log('🔍 Searching for user with email:', loginIdentifier.toLowerCase());
    let user;
    try {
      user = await prisma.user.findUnique({
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
      console.log('✅ Database query successful, user found:', !!user);
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      return NextResponse.json(
        { ok: false, error: 'Database connection error' },
        { status: 500 }
      );
    }

    if (!user) {
      console.log('❌ User not found in database');
      return NextResponse.json({ ok: false, error: 'Invalid email or password' }, { status: 401 });
    }

    console.log('👤 User details:', {
      id: user.id,
      email: user.email,
      role: user.role,
      hasPassword: !!user.password,
      passwordLength: user.password?.length
    });

    // Verify password
    console.log('🔒 Verifying password...');
    let isValidPassword;
    try {
      isValidPassword = await bcrypt.compare(password, user.password);
      console.log('✅ Password verification completed:', isValidPassword);
    } catch (bcryptError) {
      console.error('❌ Password verification error:', bcryptError);
      return NextResponse.json(
        { ok: false, error: 'Authentication error' },
        { status: 500 }
      );
    }

    if (!isValidPassword) {
      console.log('❌ Invalid password for user:', user.email);
      return NextResponse.json({ ok: false, error: 'Invalid email or password' }, { status: 401 });
    }

    console.log('✅ Password verification successful for user:', user.email);

    // Note: Email verification check is disabled for now to allow testing
    // Uncomment the following lines if you want to require email verification:
    // if (!user.emailVerified) {
    //   return NextResponse.json({
    //     ok: false,
    //     error: 'Please verify your email before logging in. Check your inbox for the verification link.'
    //   }, { status: 403 });
    // }

    // Create JWT token
    console.log('🎫 Creating JWT token...');
    let token;
    try {
      token = await createAuthToken({
        sub: user.id,
        role: user.role.toLowerCase(),
        email: user.email
      });
      console.log('✅ JWT token created successfully');
    } catch (tokenError) {
      console.error('❌ JWT token creation error:', tokenError);
      return NextResponse.json(
        { ok: false, error: 'Token generation failed' },
        { status: 500 }
      );
    }

    console.log('📦 Preparing response data...');
    const responseData = {
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase()
      }
    };

    console.log('✅ Response data prepared:', responseData);

    const response = NextResponse.json(responseData);

    // Set HTTP-only cookie
    console.log('🍪 Setting authentication cookie...');
    try {
      response.cookies.set('wecon_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });
      console.log('✅ Authentication cookie set successfully');
    } catch (cookieError) {
      console.error('❌ Cookie setting error:', cookieError);
      // Continue anyway, as the response data is still valid
    }

    console.log('🎉 Login successful! Returning response...');
    return response;
  } catch (error) {
    console.error('🚨 Unexpected login error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
