'use client';

import React from 'react';
import { Car } from '@/lib/models';
import Image from 'next/image';

type CarDetailsProps = {
  car: Car;
};

const CarDetails: React.FC<CarDetailsProps> = ({ car }) => {
  const { 
    brand, 
    carModel, 
    image, 
    fuelType, 
    mileage, 
    yearOfManufacture, 
    available, 
    pricePerDay, 
    description,
    carType
  } = car;

  return (
    <div className="bg-white border border-gray-200 rounded h-full flex flex-col">
      <div className="p-4">
        <div className="max-w-[400px] mx-auto max-h-[600px]">
          <div className="aspect-[4/3] overflow-hidden">
            <Image 
              src={image || '/images/car-placeholder.jpg'} 
              alt={`${brand} ${carModel}`}
              width={400}
              height={400}
              className="object-contain w-full h-full"
              priority
            />
          </div>
        </div>
      </div>
      
      <div className="px-4 pb-4 flex-grow">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-2xl font-semibold">{brand} {carModel}</h2>
            <p className="text-sm text-gray-600 -mt-1">{carType}</p>
          </div>
          <div className="text-xl font-semibold">${pricePerDay}<span className="text-sm text-gray-500 font-normal">/day</span></div>
        </div>
        
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-2">
          <div className="py-0.5">
            <p className="text-sm text-gray-600 mb-0">Year</p>
            <p className="text-base leading-tight">{yearOfManufacture}</p>
          </div>
          
          <div className="py-0.5">
            <p className="text-sm text-gray-600 mb-0">Mileage</p>
            <p className="text-base leading-tight">{mileage.toLocaleString()} km</p>
          </div>
          
          <div className="py-0.5">
            <p className="text-sm text-gray-600 mb-0">Fuel Type</p>
            <p className="text-base leading-tight">{fuelType}</p>
          </div>
          
          <div className="py-0.5">
            <p className="text-sm text-gray-600 mb-0">Status</p>
            <p className={`text-base leading-tight ${available ? 'text-green-600' : 'text-red-600'}`}>
              {available ? 'Available' : 'Unavailable'}
            </p>
          </div>
        </div>
        
        <div className="mt-2 flex-grow">
          <h3 className="text-lg font-medium mb-0.5">Description</h3>
          <p className="text-sm text-gray-800 leading-snug">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default CarDetails; 