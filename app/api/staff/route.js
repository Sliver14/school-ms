import { NextResponse } from 'next/server';
import { readLocalDb, onboardTeacher } from '../../../lib/db';
import { allTeachersList } from '../../../data/schoolData';

export async function GET() {
  try {
    const db = readLocalDb();
    const teachers = db.teachers || allTeachersList;
    return NextResponse.json({ success: true, count: teachers.length, teachers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, dept, qualification, roleTitle, formTeacherClass, phone, accountRole } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Staff Full Name and Official Email are required' },
        { status: 400 }
      );
    }

    const targetAccountRole = accountRole === 'bursar' ? 'bursar' : 'teacher';

    const result = await onboardTeacher({
      name,
      email,
      phone,
      dept: dept || (targetAccountRole === 'bursar' ? 'Bursary & Accounts' : 'Academic Dept'),
      qualification,
      roleTitle: roleTitle || (targetAccountRole === 'bursar' ? 'Bursar & Finance Officer' : 'Subject Specialist'),
      formTeacherClass,
      accountRole: targetAccountRole,
    });

    return NextResponse.json({
      success: true,
      message: `${targetAccountRole === 'bursar' ? 'Bursary Officer' : 'Faculty Instructor'} ${name} onboarded successfully! Account created.`,
      teacher: result.teacher,
      user: result.user,
      credentialSlip: {
        name,
        role: targetAccountRole === 'bursar' ? 'Bursar / Accounts Officer' : 'Faculty Instructor',
        identifier: email,
        temporaryPassword: result.temporaryPassword,
        department: dept || (targetAccountRole === 'bursar' ? 'Bursary & Financial Management' : 'Academic Dept'),
        formTeacherClass: formTeacherClass || (targetAccountRole === 'bursar' ? 'Finance & Revenue Ledger' : 'General Faculty'),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
