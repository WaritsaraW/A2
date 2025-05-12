import { NextResponse } from 'next/server';
import { getCarBrands } from '@/lib/data-service';

export async function GET() {
  try {
    const brands = await getCarBrands();
    return NextResponse.json(brands);
  } catch (error) {
    console.error('Error fetching car brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch car brands' },
      { status: 500 }
    );
  }
} 