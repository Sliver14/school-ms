import { NextResponse } from 'next/server';
import { getReportCard, updateStudent } from '../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId') || 'RH/2024/018';
    const reportCard = await getReportCard(studentId);

    if (!reportCard) {
      return NextResponse.json({ success: false, error: 'Student report card not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, reportCard });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { studentId, formTeacherComment, principalComment, conductGrade } = body;

    if (!studentId) {
      return NextResponse.json({ success: false, error: 'Student ID is required' }, { status: 400 });
    }

    const updated = await updateStudent(studentId, {
      formTeacherComment,
      principalComment,
      conductGrade,
    });

    return NextResponse.json({
      success: true,
      message: 'Official report card comments endorsed',
      student: updated,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
