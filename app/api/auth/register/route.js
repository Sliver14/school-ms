import { NextResponse } from 'next/server';
import { createUserAccount, getUserByIdentifier } from '../../../../lib/db';
import { hashPassword, DEFAULT_PASSWORD_HASH } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { identifier, name, role, password, phone, linkedIds } = body;

    if (!identifier || !name || !role) {
      return NextResponse.json(
        { success: false, error: 'Identifier, Name, and Role are required' },
        { status: 400 }
      );
    }

    const existing = await getUserByIdentifier(identifier);
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Account with identifier '${identifier}' already exists.` },
        { status: 409 }
      );
    }

    const passwordHash = password ? await hashPassword(password) : DEFAULT_PASSWORD_HASH;
    const tempPassword = password || 'RoyalHeights@2026';

    const result = await createUserAccount({
      identifier,
      passwordHash,
      role,
      name,
      phone,
      linkedIds: linkedIds || [],
    });

    return NextResponse.json({
      success: true,
      message: `Account created for ${name} (${role})!`,
      user: result.user,
      credentialSlip: {
        name,
        role: role.toUpperCase(),
        identifier,
        temporaryPassword: tempPassword,
        phone,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
