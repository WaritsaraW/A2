import fs from 'fs';
import path from 'path';
import { Car, Order, SearchFilters } from './models';

// Path to JSON files - files are in the root of car-rental-system
const carsPath = path.join(process.cwd(), 'cars.json');
const ordersPath = path.join(process.cwd(), 'orders.json');

// Get all cars
export async function getCars(): Promise<Car[]> {
  try {
    // Check if file exists
    if (!fs.existsSync(carsPath)) {
      console.error('cars.json file not found at:', carsPath);
      return [];
    }
    
    const data = fs.readFileSync(carsPath, 'utf8');
    const carsData = JSON.parse(data);
    
    // Ensure we're returning an array
    if (!Array.isArray(carsData)) {
      console.error('cars.json does not contain an array');
      return [];
    }
    
    return carsData;
  } catch (error) {
    console.error('Error loading cars data:', error);
    return [];
  }
}

// Get car by VIN
export async function getCarByVin(vin: string): Promise<Car | null> {
  const cars = await getCars();
  return cars.find(car => car.vin === vin) || null;
}

// Search cars with filters
export async function searchCars(filters: SearchFilters): Promise<Car[]> {
  const cars = await getCars();
  
  return cars.filter(car => {
    // Apply carType filter
    if (filters.carType && filters.carType !== 'All' && car.carType !== filters.carType) {
      return false;
    }
    
    // Apply brand filter
    if (filters.brand && filters.brand !== 'All' && car.brand !== filters.brand) {
      return false;
    }
    
    // Apply search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      return (
        car.brand.toLowerCase().includes(query) ||
        car.carModel.toLowerCase().includes(query) ||
        car.description?.toLowerCase().includes(query) ||
        car.carType.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
}

// Get all available car types
export async function getCarTypes(): Promise<string[]> {
  const cars = await getCars();
  
  // Ensure cars is an array before using map
  if (!Array.isArray(cars)) {
    console.error('Cars data is not an array in getCarTypes');
    return [];
  }
  
  const types = new Set(cars.map(car => car.carType));
  return Array.from(types);
}

// Get all available car brands
export async function getCarBrands(): Promise<string[]> {
  const cars = await getCars();
  
  // Ensure cars is an array before using map
  if (!Array.isArray(cars)) {
    console.error('Cars data is not an array in getCarBrands');
    return [];
  }
  
  const brands = new Set(cars.map(car => car.brand));
  return Array.from(brands);
}

// Get all orders
export async function getOrders(): Promise<Order[]> {
  try {
    // Check if file exists
    if (!fs.existsSync(ordersPath)) {
      console.error('orders.json file not found');
      return [];
    }
    
    const data = fs.readFileSync(ordersPath, 'utf8');
    const ordersData = JSON.parse(data);
    
    // Handle the orders.json structure with an "orders" property
    if (ordersData && ordersData.orders && Array.isArray(ordersData.orders)) {
      return ordersData.orders;
    }
    
    // If orders array not found in expected format, return empty array
    console.error('Invalid orders.json structure');
    return [];
  } catch (error) {
    console.error('Error loading orders data:', error);
    return [];
  }
}

// Get orders for a specific car
export async function getOrdersForCar(vin: string): Promise<Order[]> {
  const orders = await getOrders();
  return orders.filter(order => order.car.vin === vin);
}

// Create a new order
export async function createOrder(order: Order): Promise<boolean> {
  try {
    const orders = await getOrders();
    orders.push(order);
    
    // Write back to file
    const ordersData = { orders };
    fs.writeFileSync(ordersPath, JSON.stringify(ordersData, null, 2));
    return true;
  } catch (error) {
    console.error('Error creating order:', error);
    return false;
  }
} 