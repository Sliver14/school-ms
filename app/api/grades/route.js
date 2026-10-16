import { NextResponse } from 'next/server';
import { getGrades, saveGrades } from '../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = {
      studentId: searchParams.get('studentId'),
      class: searchParams.get('class'),
      subject: searchParams.get('subject'),
    };

    const grades = await getGrades(query);
    return NextResponse.json({ success: true, count: grades.length, grades });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const entries = Array.isArray(body) ? body : [body];
    const saved = await saveGrades(entries);
    return NextResponse.json({
      success: true,
      message: `Assessment scores recorded and terminal results computed successfully`,
      count: entries.length,
      grades: saved,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
