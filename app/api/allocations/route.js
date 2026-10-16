import { NextResponse } from 'next/server';
import { getAllocations, saveAllocation } from '../../../lib/db';

export async function GET() {
  try {
    const data = await getAllocations();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { classKey, ...allocationData } = body;
    if (!classKey) {
      return NextResponse.json({ success: false, error: 'classKey is required' }, { status: 400 });
    }
    const updated = await saveAllocation(classKey, allocationData);
    return NextResponse.json({
      success: true,
      message: `Allocation matrix for ${classKey} saved`,
      allocation: updated,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
