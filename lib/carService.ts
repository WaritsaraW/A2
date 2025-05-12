import db from './db';
import { Car, SearchFilters } from './models';

export function getAllCars(): Car[] {
  return db.prepare('SELECT * FROM cars').all() as Car[];
}

export function getCarByVin(vin: string): Car | undefined {
  return db.prepare('SELECT * FROM cars WHERE vin = ?').get(vin) as Car | undefined;
}

export function getAvailableCars(): Car[] {
  return db.prepare('SELECT * FROM cars WHERE available = 1').all() as Car[];
}

export function getCarsByType(carType: string): Car[] {
  return db.prepare('SELECT * FROM cars WHERE carType = ?').all(carType) as Car[];
}

export function getCarsByBrand(brand: string): Car[] {
  return db.prepare('SELECT * FROM cars WHERE brand = ?').all(brand) as Car[];
}

export function searchCars(filters: SearchFilters): Car[] {
  let query = 'SELECT * FROM cars WHERE 1=1';
  const params: any[] = [];
  
  if (filters.carType) {
    query += ' AND carType = ?';
    params.push(filters.carType);
  }
  
  if (filters.brand) {
    query += ' AND brand = ?';
    params.push(filters.brand);
  }
  
  if (filters.query) {
    query += ' AND (carType LIKE ? OR brand LIKE ? OR carModel LIKE ? OR description LIKE ?)';
    const searchTerm = `%${filters.query}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }
  
  return db.prepare(query).all(...params) as Car[];
}

export function updateCarAvailability(vin: string, available: boolean): boolean {
  try {
    const result = db.prepare('UPDATE cars SET available = ? WHERE vin = ?').run(available ? 1 : 0, vin);
    return result.changes > 0;
  } catch (error) {
    console.error('Error updating car availability:', error);
    return false;
  }
}

export function getCarTypes(): string[] {
  const types = db.prepare('SELECT DISTINCT carType FROM cars').all() as { carType: string }[];
  return types.map(type => type.carType);
}

export function getCarBrands(): string[] {
  const brands = db.prepare('SELECT DISTINCT brand FROM cars').all() as { brand: string }[];
  return brands.map(brand => brand.brand);
}

export function getSuggestions(query: string): string[] {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const searchTerm = `%${query}%`;
  const results = db.prepare(`
    SELECT carType as term FROM cars WHERE carType LIKE ?
    UNION
    SELECT brand as term FROM cars WHERE brand LIKE ?
    UNION
    SELECT carModel as term FROM cars WHERE carModel LIKE ?
    UNION
    SELECT fuelType as term FROM cars WHERE fuelType LIKE ?
    GROUP BY term
    LIMIT 10
  `).all(searchTerm, searchTerm, searchTerm, searchTerm) as { term: string }[];
  
  return results.map(result => result.term);
} 