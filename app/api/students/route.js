import { NextResponse } from 'next/server';
import { getStudents, createStudent, updateStudent } from '../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classFilter = searchParams.get('class');
    const search = searchParams.get('search');

    let students = await getStudents();

    if (classFilter && classFilter !== 'ALL') {
      students = students.filter((s) => s.class === classFilter);
    }

    if (search) {
      const q = search.toLowerCase();
      students = students.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          (s.guardian && s.guardian.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ success: true, count: students.length, students });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newStudent = await createStudent(body);
    return NextResponse.json({
      success: true,
      message: `Student ${newStudent.name} enrolled with ID ${newStudent.id}`,
      student: newStudent,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...fields } = body;
    const updated = await updateStudent(id, fields);
    return NextResponse.json({
      success: true,
      message: 'Student record updated',
      student: updated,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
