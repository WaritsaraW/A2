import { NextResponse } from 'next/server';
import { getCarByVin } from '@/lib/data-service';

export async function GET(
  request: Request,
  { params }: { params: { vin: string } }
) {
  try {
    const car = await getCarByVin(params.vin);
    
    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    return NextResponse.json(
      { error: 'Failed to fetch car' },
      { status: 500 }
    );
  }
} 