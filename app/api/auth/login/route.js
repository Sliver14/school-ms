import { NextResponse } from 'next/server';
import { getUserByIdentifier } from '../../../../lib/db';
import { verifyPassword, createSessionToken } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Identifier and password are required' },
        { status: 400 }
      );
    }

    const user = await getUserByIdentifier(identifier);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid identifier or password. Please check credentials.' },
        { status: 401 }
      );
    }

    // Verify bcrypt hash
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid identifier or password. Please check credentials.' },
        { status: 401 }
      );
    }

    // Generate signed session token
    const token = createSessionToken(user);

    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: {
        id: user.id,
        identifier: user.identifier,
        role: user.role,
        name: user.name,
        avatar: user.avatar,
      },
      token,
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: 'rh_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed due to internal error' },
      { status: 500 }
    );
  }
}
