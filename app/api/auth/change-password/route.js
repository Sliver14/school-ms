import { NextResponse } from 'next/server';
import { verifySessionToken, verifyPassword, hashPassword } from '../../../../lib/auth';
import { getUserByIdentifier, updateUserPassword } from '../../../../lib/db';

export async function POST(request) {
  try {
    const cookieToken = request.cookies.get('rh_session')?.value;
    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Session missing' }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Session expired' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Both current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const user = await getUserByIdentifier(payload.identifier);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User record not found' }, { status: 404 });
    }

    const isMatch = await verifyPassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Current password does not match records' },
        { status: 400 }
      );
    }

    // Hash new password with bcrypt
    const newHash = await hashPassword(newPassword);
    await updateUserPassword(user.identifier, newHash);

    return NextResponse.json({
      success: true,
      message: 'Password successfully updated and securely hashed.',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
