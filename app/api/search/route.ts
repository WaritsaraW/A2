import { NextResponse } from 'next/server';
import { searchCars } from '@/lib/data-service';
import { SearchFilters } from '@/lib/models';

export async function GET(request: Request) {
  try {
    // Get URL and search params
    const { searchParams } = new URL(request.url);
    
    // Extract filter parameters
    const filters: SearchFilters = {
      query: searchParams.get('query') || undefined,
      carType: searchParams.get('carType') || undefined,
      brand: searchParams.get('brand') || undefined
    };
    
    // Handle 'All' option from UI
    if (filters.carType === 'All') filters.carType = undefined;
    if (filters.brand === 'All') filters.brand = undefined;
    
    // Search cars with filters
    const cars = await searchCars(filters);
    
    return NextResponse.json(cars);
  } catch (error) {
    console.error('Error searching cars:', error);
    return NextResponse.json(
      { error: 'Failed to search cars' },
      { status: 500 }
    );
  }
} 