import { SearchFilters as SearchFiltersType } from '@/lib/models';
import CarGrid from '../components/CarGrid';
import SearchFilters from '../components/SearchFilters';
import { searchCars, getCarTypes, getCarBrands } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get search parameters from the URL
  const query = typeof searchParams.query === 'string' ? searchParams.query : 
               (typeof searchParams.q === 'string' ? searchParams.q : '');
  
  const carType = typeof searchParams.carType === 'string' ? searchParams.carType : 
                 (typeof searchParams.type === 'string' ? searchParams.type : '');
  
  const brand = typeof searchParams.brand === 'string' ? searchParams.brand : '';
  
  const filters: SearchFiltersType = {
    query: query,
    carType: carType === 'All' ? undefined : carType,
    brand: brand === 'All' ? undefined : brand,
  };
  
  // Get car types and brands from data service
  const carTypes = await getCarTypes();
  const brands = await getCarBrands();
  
  // Search cars using the data service
  const cars = await searchCars(filters);
  
  return (
    <div className="container search-container">
      <div className="hero-section mb-2">
        <h1>Find Your Perfect Ride</h1>
        <p>Choose from our wide range of high-quality rental cars for any occasion</p>
      </div>
      
      <SearchFilters carTypes={carTypes} brands={brands} initialFilters={filters} />
      
      <div className="featured-section">
        <div className="featured-header">
          <h2 className="featured-title">
            {query ? `Search Results for "${query}"` : 'Available Cars'}
          </h2>
          <p className="text-gray-600">
            {cars.length} {cars.length === 1 ? 'car' : 'cars'} found
          </p>
        </div>
        
        <CarGrid cars={cars} />
      </div>
    </div>
  );
} 