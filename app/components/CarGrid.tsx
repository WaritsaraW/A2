'use client';

import React from 'react';
import CarCard from './CarCard';
import { Car } from '@/lib/models';

interface CarGridProps {
  cars: Car[];
  emptyMessage?: string;
}

const CarGrid: React.FC<CarGridProps> = ({ 
  cars, 
  emptyMessage = 'No cars found matching your criteria.'
}) => {
  if (!cars || cars.length === 0) {
    return (
      <div className="my-12 text-center p-8 bg-white rounded-lg shadow-md">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-16 w-16 mx-auto mb-4 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
          />
        </svg>
        <p className="text-xl font-semibold text-gray-600 mb-2">No Results Found</p>
        <p className="text-gray-500">{emptyMessage}</p>
        <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {cars.map(car => (
        <CarCard key={car.vin} car={car} />
      ))}
    </div>
  );
};

export default CarGrid; 