import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('=== TEST LOGIN API CALLED ===');
    
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('Request body parsed successfully:', body);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { ok: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { email, password } = body;
    console.log('Email:', email);
    console.log('Password provided:', !!password);

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { ok: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Test database connection
    try {
      await prisma.$connect();
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json(
        { ok: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Find user
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
          emailVerified: true
        }
      });
      console.log('User lookup result:', user ? 'Found' : 'Not found');
      if (user) {
        console.log('User details:', {
          id: user.id,
          email: user.email,
          role: user.role,
          passwordLength: user.password?.length
        });
      }
    } catch (userError) {
      console.error('User lookup failed:', userError);
      return NextResponse.json(
        { ok: false, error: 'User lookup failed' },
        { status: 500 }
      );
    }

    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { ok: false, error: 'User not found' },
        { status: 401 }
      );
    }

    // Test password verification
    try {
      console.log('Testing password verification...');
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('Password verification result:', isValidPassword);
      
      if (!isValidPassword) {
        console.log('Password verification failed');
        return NextResponse.json(
          { ok: false, error: 'Invalid password' },
          { status: 401 }
        );
      }
    } catch (bcryptError) {
      console.error('Password verification error:', bcryptError);
      return NextResponse.json(
        { ok: false, error: 'Password verification failed' },
        { status: 500 }
      );
    }

    console.log('Login test successful!');
    return NextResponse.json({
      ok: true,
      message: 'Login test successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Test login error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
