import { NextResponse } from 'next/server';
import { getCars } from '@/lib/data-service';

// Mark this route as dynamic to avoid static rendering errors
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Get the search query
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    // If no query, return empty response
    if (!query || query.trim() === '') {
      return NextResponse.json({ brands: [], models: [], carTypes: [] });
    }

    // Get all cars from data service
    const cars = await getCars();

    // Filter brands, models, and car types based on the query
    const lowercaseQuery = query.toLowerCase();
    
    // Extract unique brands that match the query
    const brands = Array.from(new Set(
      cars
        .filter(car => car.brand.toLowerCase().includes(lowercaseQuery))
        .map(car => car.brand)
    ));

    // Extract unique models that match the query
    const models = Array.from(new Set(
      cars
        .filter(car => car.carModel.toLowerCase().includes(lowercaseQuery))
        .map(car => car.carModel)
    ));

    // Extract unique car types that match the query
    const carTypes = Array.from(new Set(
      cars
        .filter(car => car.carType.toLowerCase().includes(lowercaseQuery))
        .map(car => car.carType)
    ));

    // Also search in descriptions to find more matches
    const descriptionMatches = Array.from(new Set(
      cars
        .filter(car => car.description && car.description.toLowerCase().includes(lowercaseQuery))
        .map(car => `${car.brand} ${car.carModel}`)
    ));

    // Return the suggestions
    return NextResponse.json({
      brands,
      models,
      carTypes,
      descriptionMatches
    });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
} 