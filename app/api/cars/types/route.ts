import { NextResponse } from 'next/server';
import { getCarTypes } from '@/lib/data-service';

export async function GET() {
  try {
    const types = await getCarTypes();
    return NextResponse.json(types);
  } catch (error) {
    console.error('Error fetching car types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch car types' },
      { status: 500 }
    );
  }
} 