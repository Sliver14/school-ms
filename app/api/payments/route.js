import { NextResponse } from 'next/server';
import { getPayments, processPayment } from '../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    let payments = await getPayments();
    if (studentId) {
      payments = payments.filter((p) => p.studentId === studentId);
    }

    return NextResponse.json({ success: true, count: payments.length, payments });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const receipt = await processPayment(body);
    return NextResponse.json({
      success: true,
      message: `Payment of ${receipt.amount} verified and cleared!`,
      receipt,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
