import { Order, Customer, Rental } from './models';
import { updateCarAvailability } from './carService';
import { getCarByVin } from './carService';
import fs from 'fs';
import path from 'path';

// Load orders from JSON file
const ordersFilePath = path.join(process.cwd(), 'orders.json');
let ordersData: { orders: Order[] } = { orders: [] };

try {
  const jsonData = fs.readFileSync(ordersFilePath, 'utf8');
  ordersData = JSON.parse(jsonData);
} catch (error) {
  console.error('Error loading orders data:', error);
}

// Helper function to save orders back to the file
function saveOrders() {
  try {
    fs.writeFileSync(ordersFilePath, JSON.stringify(ordersData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving orders:', error);
  }
}

// Generate a new order ID
function generateOrderId(): number {
  const maxId = ordersData.orders.reduce((max, order) => 
    order.id ? Math.max(max, order.id) : max, 0);
  return maxId + 1;
}

export function createOrder(
  customer: Customer,
  carVin: string,
  rental: Omit<Rental, 'orderDate'>,
): number | null {
  try {
    // Check if the car is available
    const car = getCarByVin(carVin);
    
    if (!car || !car.available) {
      return null; // Car not found or not available
    }

    const orderDate = new Date().toISOString().split('T')[0];
    const newOrderId = generateOrderId();
    
    // Create the new order
    const newOrder: Order = {
      id: newOrderId,
      customer,
      car: { vin: carVin },
      rental: {
        ...rental,
        orderDate
      },
      status: 'pending'
    };

    // Add to the orders array
    ordersData.orders.push(newOrder);
    
    // Update car availability
    updateCarAvailability(carVin, false);
    
    // Save to file
    saveOrders();
    
    return newOrderId;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

export function getOrderById(orderId: number): Order | null {
  try {
    const order = ordersData.orders.find(order => order.id === orderId);
    return order || null;
  } catch (error) {
    console.error('Error getting order:', error);
    return null;
  }
}

export function confirmOrder(orderId: number): boolean {
  try {
    const orderIndex = ordersData.orders.findIndex(order => 
      order.id === orderId && order.status === 'pending');
    
    if (orderIndex === -1) {
      return false;
    }
    
    ordersData.orders[orderIndex].status = 'confirmed';
    saveOrders();
    return true;
  } catch (error) {
    console.error('Error confirming order:', error);
    return false;
  }
}

export function cancelOrder(orderId: number): boolean {
  try {
    const orderIndex = ordersData.orders.findIndex(order => 
      order.id === orderId && order.status === 'pending');
    
    if (orderIndex === -1) {
      return false;
    }
    
    const order = ordersData.orders[orderIndex];
    
    // Update order status
    ordersData.orders[orderIndex].status = 'cancelled';
    
    // Make the car available again
    updateCarAvailability(order.car.vin, true);
    
    // Save to file
    saveOrders();
    
    return true;
  } catch (error) {
    console.error('Error cancelling order:', error);
    return false;
  }
} 