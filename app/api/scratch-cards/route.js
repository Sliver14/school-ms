import { NextResponse } from 'next/server';
import {
  getScratchCards,
  generateScratchCards,
  updateScratchCardStatus,
  deleteScratchCard,
} from '../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';

    const data = await getScratchCards({ status, search });
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { count, session, term, price, maxUses, batchCode } = body || {};

    const result = await generateScratchCards({
      count: count ? parseInt(count, 10) : 10,
      session: session || '2026/2027',
      term: term || '1st Term',
      price: price ? parseFloat(price) : 2000,
      maxUses: maxUses ? parseInt(maxUses, 10) : 5,
      batchCode,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body || {};

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Card ID and target status are required' },
        { status: 400 }
      );
    }

    const updated = await updateScratchCardStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Scratch card not found or invalid status' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Card status updated to ${status}`,
      card: updated,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Card ID is required' }, { status: 400 });
    }

    const deleted = await deleteScratchCard(id);
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

