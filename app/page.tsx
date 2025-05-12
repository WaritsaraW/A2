import Link from 'next/link';
import { Car } from '@/lib/models';
import CarGrid from './components/CarGrid';
import SearchFilters from './components/SearchFilters';
import { getCars, getCarTypes, getCarBrands, searchCars } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Get search parameters from the URL
  const query = typeof searchParams.query === 'string' ? searchParams.query : '';
  const carType = typeof searchParams.carType === 'string' ? searchParams.carType : '';
  const brand = typeof searchParams.brand === 'string' ? searchParams.brand : '';

  // Get cars, car types, and brands from data service
  const allCars = await getCars();
  const carTypes = await getCarTypes();
  const brands = await getCarBrands();
  
  // Search cars based on filters if provided
  const filteredCars = await searchCars({
    query,
    carType: carType === 'All' || carType === '' ? undefined : carType,
    brand: brand === 'All' || brand === '' ? undefined : brand
  });
  
  // Use filtered cars if filters are applied, otherwise show all cars
  const displayCars = query || carType || brand ? filteredCars : allCars;
  
  // Get featured cars (select 3 available cars from cars.json)
  const featuredCars = allCars
    .filter(car => car.available)
    .sort(() => 0.5 - Math.random()) // Shuffle the array
    .slice(0, 3);

  return (
    <div className="container search-container">
      <div className="hero-section mb-2">
        <h1>Find Your Perfect Ride</h1>
        <p>Choose from our wide range of high-quality rental cars for any occasion</p>
      </div>
      
      <SearchFilters 
        carTypes={carTypes} 
        brands={brands} 
        initialFilters={{ query, carType, brand }}
      />
      
      {(query || carType || brand) ? (
        <div className="featured-section">
          <div className="featured-header">
            <h2 className="featured-title">
              {query ? `Search Results for "${query}"` : 'Filtered Results'}
            </h2>
            <p className="text-gray-600">
              {displayCars.length} {displayCars.length === 1 ? 'car' : 'cars'} found
            </p>
          </div>
          
          <CarGrid cars={displayCars} />
        </div>
      ) : (
        <div className="featured-section">
          <div className="featured-header">
            <h2 className="featured-title">Featured Cars</h2>
            <Link href="/search" className="view-all">
              View all cars
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <CarGrid cars={featuredCars} />
        </div>
      )}
      
      <div className="mt-12 mb-16 bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Why Choose DriveEase?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Fast & Easy Booking</h3>
            <p className="text-gray-600">Book your car in just a few clicks and get on the road in no time.</p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Quality Guaranteed</h3>
            <p className="text-gray-600">All our vehicles are regularly serviced and kept in top condition.</p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">24/7 Customer Support</h3>
            <p className="text-gray-600">Our customer service team is available around the clock to assist you.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 