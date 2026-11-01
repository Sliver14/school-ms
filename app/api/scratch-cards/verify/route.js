import { NextResponse } from 'next/server';
import { verifyScratchCard } from '../../../../lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { serialNumber, pin, studentId, studentName, term, session } = body || {};

    if (!serialNumber || !pin) {
      return NextResponse.json(
        { success: false, error: 'Please enter both Serial Number and Secret PIN.' },
        { status: 400 }
      );
    }

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student Admission Number is required to unlock this report card.' },
        { status: 400 }
      );
    }

    const result = await verifyScratchCard({
      serialNumber,
      pin,
      studentId,
      studentName,
      term,
      session,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

