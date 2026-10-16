import { NextResponse } from 'next/server';
import { getFees, createFee, deleteFee } from '../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classFilter = searchParams.get('class');
    const customOnly = searchParams.get('custom');

    let fees = await getFees();

    if (classFilter && classFilter !== 'ALL') {
      fees = fees.filter((f) => f.class === classFilter);
    }

    if (customOnly === 'true') {
      fees = fees.filter((f) => f.isCustom);
    }

    return NextResponse.json({ success: true, count: fees.length, fees });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newFee = await createFee(body);
    return NextResponse.json({
      success: true,
      message: `Fee '${newFee.title}' created successfully`,
      fee: newFee,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Fee ID is required' }, { status: 400 });

    await deleteFee(id);
    return NextResponse.json({ success: true, message: 'Fee schedule removed' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
