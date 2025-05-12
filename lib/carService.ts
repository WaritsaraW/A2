import { Car, SearchFilters } from './models';
import carsData from '../cars.json';

const cars: Car[] = carsData as Car[];

export function getAllCars(): Car[] {
  return cars;
}

export function getCarByVin(vin: string): Car | undefined {
  return cars.find(car => car.vin === vin);
}

export function getAvailableCars(): Car[] {
  return cars.filter(car => car.available);
}

export function getCarsByType(carType: string): Car[] {
  return cars.filter(car => car.carType === carType);
}

export function getCarsByBrand(brand: string): Car[] {
  return cars.filter(car => car.brand === brand);
}

export function searchCars(filters: SearchFilters): Car[] {
  return cars.filter(car => {
    if (filters.carType && car.carType !== filters.carType) return false;
    if (filters.brand && car.brand !== filters.brand) return false;
    
    if (filters.query) {
      const searchTerm = filters.query.toLowerCase();
      return (
        car.carType.toLowerCase().includes(searchTerm) ||
        car.brand.toLowerCase().includes(searchTerm) ||
        car.carModel.toLowerCase().includes(searchTerm) ||
        (car.description?.toLowerCase() || '').includes(searchTerm)
      );
    }
    
    return true;
  });
}

export function updateCarAvailability(vin: string, available: boolean): boolean {
  const carIndex = cars.findIndex(car => car.vin === vin);
  if (carIndex === -1) return false;
  
  cars[carIndex].available = available;
  return true;
}

export function getCarTypes(): string[] {
  return Array.from(new Set(cars.map(car => car.carType)));
}

export function getCarBrands(): string[] {
  return Array.from(new Set(cars.map(car => car.brand)));
}

export function getSuggestions(query: string): string[] {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const searchTerm = query.toLowerCase();
  const suggestions = new Set<string>();
  
  cars.forEach(car => {
    if (car.carType.toLowerCase().includes(searchTerm)) suggestions.add(car.carType);
    if (car.brand.toLowerCase().includes(searchTerm)) suggestions.add(car.brand);
    if (car.carModel.toLowerCase().includes(searchTerm)) suggestions.add(car.carModel);
    if (car.fuelType.toLowerCase().includes(searchTerm)) suggestions.add(car.fuelType);
  });
  
  return Array.from(suggestions).slice(0, 10);
} 