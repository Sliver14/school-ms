import { NextResponse } from 'next/server';
import {
  getAdmissions,
  createAdmission,
  updateAdmission,
  enrolAdmittedApplicant,
} from '../../../lib/db';

export async function GET() {
  try {
    const admissions = await getAdmissions();
    return NextResponse.json({ success: true, admissions });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const applicant = await createAdmission(body);
    return NextResponse.json({ success: true, applicant, message: 'Application submitted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { action, id, customFields, ...updateData } = body;

    if (action === 'enrol') {
      const student = await enrolAdmittedApplicant(id, customFields || {});
      return NextResponse.json({
        success: true,
        message: `Applicant converted to enrolled student ${student.id}!`,
        student,
      });
    }

    const updated = await updateAdmission(id, updateData);
    return NextResponse.json({
      success: true,
      message: 'Applicant record updated successfully',
      applicant: updated,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
