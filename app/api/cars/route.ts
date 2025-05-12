import { NextResponse } from 'next/server';
import { getCars } from '@/lib/data-service';

export async function GET() {
  try {
    const cars = await getCars();
    return NextResponse.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cars' },
      { status: 500 }
    );
  }
} 