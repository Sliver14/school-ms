import { NextResponse } from 'next/server';
import { verifySessionToken } from '../../../../lib/auth';
import { getUserByIdentifier } from '../../../../lib/db';

export async function GET(request) {
  try {
    const cookieToken = request.cookies.get('rh_session')?.value;
    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, authenticated: false, error: 'Session expired or invalid' }, { status: 401 });
    }

    const user = await getUserByIdentifier(payload.identifier);
    if (!user) {
      return NextResponse.json({ success: false, authenticated: false, error: 'User record not found' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        identifier: user.identifier,
        role: user.role,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, authenticated: false, error: error.message }, { status: 500 });
  }
}
