import fs from 'fs';
import path from 'path';
import { Car, Order, SearchFilters } from './models';

// Path to JSON files - files are in the root of car-rental-system
const carsPath = path.join(process.cwd(), 'cars.json');
const ordersPath = path.join(process.cwd(), 'orders.json');

// In-memory storage for production environment
let inMemoryCars: Car[] = [];
let inMemoryOrders: Order[] = [];

// Check if running in production (Vercel) or development
const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';

// Initialize in-memory data for production
const initializeInMemoryData = async () => {
  try {
    if (isProduction && inMemoryCars.length === 0) {
      // Load initial car data only once
      if (fs.existsSync(carsPath)) {
        const data = fs.readFileSync(carsPath, 'utf8');
        inMemoryCars = JSON.parse(data);
      }
    }
  } catch (error) {
    console.error('Error initializing in-memory data:', error);
  }
};

// Call initialization
initializeInMemoryData();

// Get all cars
export async function getCars(): Promise<Car[]> {
  if (isProduction) {
    return inMemoryCars;
  }

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
  if (isProduction) {
    return inMemoryOrders;
  }

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
    if (isProduction) {
      // Add a generated ID if not present
      if (!order.id) {
        const maxId = inMemoryOrders.reduce(
          (max, o) => (o.id && o.id > max ? o.id : max), 
          0
        );
        order.id = maxId + 1;
      }
      
      // Add to in-memory orders
      inMemoryOrders.push(order);
      
      // Update car availability in memory
      const carIndex = inMemoryCars.findIndex(car => car.vin === order.car.vin);
      if (carIndex !== -1) {
        inMemoryCars[carIndex].available = false;
      }
      
      return true;
    } else {
      // Development environment - write to file
      const orders = await getOrders();
      orders.push(order);
      
      // Write back to file
      const ordersData = { orders };
      fs.writeFileSync(ordersPath, JSON.stringify(ordersData, null, 2));
      
      // Update car availability in file
      const cars = await getCars();
      const carIndex = cars.findIndex(car => car.vin === order.car.vin);
      if (carIndex !== -1) {
        cars[carIndex].available = false;
        fs.writeFileSync(carsPath, JSON.stringify(cars, null, 2));
      }
      
      return true;
    }
  } catch (error) {
    console.error('Error creating order:', error);
    return false;
  }
}

// Confirm an order
export async function confirmOrder(orderId: number): Promise<boolean> {
  try {
    if (isProduction) {
      const orderIndex = inMemoryOrders.findIndex(
        order => order.id === orderId && order.status === 'pending'
      );
      
      if (orderIndex === -1) {
        return false;
      }
      
      inMemoryOrders[orderIndex].status = 'confirmed';
      return true;
    } else {
      // Development - update in file
      const orders = await getOrders();
      const orderIndex = orders.findIndex(
        order => order.id === orderId && order.status === 'pending'
      );
      
      if (orderIndex === -1) {
        return false;
      }
      
      orders[orderIndex].status = 'confirmed';
      
      // Write back to file
      const ordersData = { orders };
      fs.writeFileSync(ordersPath, JSON.stringify(ordersData, null, 2));
      return true;
    }
  } catch (error) {
    console.error('Error confirming order:', error);
    return false;
  }
}

// Cancel an order
export async function cancelOrder(orderId: number): Promise<boolean> {
  try {
    if (isProduction) {
      const orderIndex = inMemoryOrders.findIndex(
        order => order.id === orderId && order.status === 'pending'
      );
      
      if (orderIndex === -1) {
        return false;
      }
      
      const order = inMemoryOrders[orderIndex];
      inMemoryOrders[orderIndex].status = 'cancelled';
      
      // Make car available again
      const carIndex = inMemoryCars.findIndex(car => car.vin === order.car.vin);
      if (carIndex !== -1) {
        inMemoryCars[carIndex].available = true;
      }
      
      return true;
    } else {
      // Development - update in file
      const orders = await getOrders();
      const orderIndex = orders.findIndex(
        order => order.id === orderId && order.status === 'pending'
      );
      
      if (orderIndex === -1) {
        return false;
      }
      
      const order = orders[orderIndex];
      orders[orderIndex].status = 'cancelled';
      
      // Write back to file
      const ordersData = { orders };
      fs.writeFileSync(ordersPath, JSON.stringify(ordersData, null, 2));
      
      // Make car available again
      const cars = await getCars();
      const carIndex = cars.findIndex(car => car.vin === order.car.vin);
      if (carIndex !== -1) {
        cars[carIndex].available = true;
        fs.writeFileSync(carsPath, JSON.stringify(cars, null, 2));
      }
      
      return true;
    }
  } catch (error) {
    console.error('Error cancelling order:', error);
    return false;
  }
} 