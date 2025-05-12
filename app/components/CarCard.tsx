'use client';

import { Car } from '@/lib/models';
import Link from 'next/link';
import { 
  Card
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CarCardProps {
  car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
  // URL for this car's reservation page
  const reservationUrl = `/reservation?vin=${car.vin}`;

  const cardContent = (
    <>
      <div className="car-image">
        <img
          src={car.image}
          alt={`${car.brand} ${car.carModel}`}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="car-content">
        <h3>{car.brand} {car.carModel}</h3>
        
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <span>{car.carType}</span>
          <span>•</span>
          <span>{car.yearOfManufacture}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <span>{car.mileage}</span>
          <span>•</span>
          <span>{car.fuelType}</span>
        </div>
        
        <p className="text-gray-600 mb-6">{car.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-primary">
            ${car.pricePerDay}/day
          </div>
          
          {car.available ? (
            <Button 
              className="btn btn-primary car-button"
              onClick={(e) => e.stopPropagation()} // Prevent clicking the button from triggering the card click
            >
              <span className="text-2xl mr-2">←</span>
              <span>Rent Now</span>
            </Button>
          ) : (
            <Button 
              disabled 
              className="btn btn-disabled"
            >
              Unavailable
            </Button>
          )}
        </div>
      </div>
    </>
  );

  // If car is not available, just render the card with no link
  if (!car.available) {
    return (
      <Card className="card car-card">
        {cardContent}
      </Card>
    );
  }

  // For available cars, wrap the entire card in a Link
  return (
    <Link href={reservationUrl} className="block no-underline">
      <Card className="card car-card cursor-pointer">
        {cardContent}
      </Card>
    </Link>
  );
};

export default CarCard; 