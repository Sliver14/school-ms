import { NextResponse } from 'next/server';
import { getAttendance, markAttendance } from '../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = {
      class: searchParams.get('class'),
      date: searchParams.get('date'),
      studentId: searchParams.get('studentId'),
    };

    const attendance = await getAttendance(query);
    return NextResponse.json({ success: true, count: attendance.length, attendance });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const records = Array.isArray(body) ? body : [body];
    const logged = await markAttendance(records);
    return NextResponse.json({
      success: true,
      message: `Successfully logged attendance for ${logged.length} scholars`,
      records: logged,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
