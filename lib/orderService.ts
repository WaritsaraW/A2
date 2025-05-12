import db from './db';
import { Order, Customer, Rental } from './models';
import { updateCarAvailability } from './carService';

export function createOrder(
  customer: Customer,
  carVin: string,
  rental: Omit<Rental, 'orderDate'>,
): number | null {
  try {
    // Check if the car is available
    const car = db.prepare('SELECT available FROM cars WHERE vin = ?').get(carVin) as { available: number } | undefined;
    
    if (!car || !car.available) {
      return null; // Car not found or not available
    }

    const orderDate = new Date().toISOString().split('T')[0];
    
    // Begin transaction
    const transaction = db.transaction(() => {
      // Insert order
      const result = db.prepare(`
        INSERT INTO orders (
          customerName, phoneNumber, email, driversLicenseNumber,
          carVin, startDate, rentalPeriod, totalPrice, orderDate, status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        customer.name,
        customer.phoneNumber,
        customer.email,
        customer.driversLicenseNumber,
        carVin,
        rental.startDate,
        rental.rentalPeriod,
        rental.totalPrice,
        orderDate,
        'pending'
      );

      // Update car availability
      updateCarAvailability(carVin, false);
      
      return result.lastInsertRowid as number;
    });
    
    return transaction();
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

export function getOrderById(orderId: number): Order | null {
  try {
    const orderData = db.prepare(`
      SELECT 
        o.id, o.customerName, o.phoneNumber, o.email, o.driversLicenseNumber,
        o.carVin, o.startDate, o.rentalPeriod, o.totalPrice, o.orderDate, o.status
      FROM orders o
      WHERE o.id = ?
    `).get(orderId) as any;

    if (!orderData) {
      return null;
    }

    return {
      id: orderData.id,
      customer: {
        name: orderData.customerName,
        phoneNumber: orderData.phoneNumber,
        email: orderData.email,
        driversLicenseNumber: orderData.driversLicenseNumber
      },
      car: {
        vin: orderData.carVin
      },
      rental: {
        startDate: orderData.startDate,
        rentalPeriod: orderData.rentalPeriod,
        totalPrice: orderData.totalPrice,
        orderDate: orderData.orderDate
      },
      status: orderData.status
    };
  } catch (error) {
    console.error('Error getting order:', error);
    return null;
  }
}

export function confirmOrder(orderId: number): boolean {
  try {
    const result = db.prepare('UPDATE orders SET status = ? WHERE id = ? AND status = ?')
      .run('confirmed', orderId, 'pending');
    return result.changes > 0;
  } catch (error) {
    console.error('Error confirming order:', error);
    return false;
  }
}

export function cancelOrder(orderId: number): boolean {
  try {
    // Get the order to find the car VIN
    const order = getOrderById(orderId);
    if (!order || order.status !== 'pending') {
      return false;
    }

    // Begin transaction
    const transaction = db.transaction(() => {
      // Update order status
      const result = db.prepare('UPDATE orders SET status = ? WHERE id = ?')
        .run('cancelled', orderId);
      
      // Make the car available again
      updateCarAvailability(order.car.vin, true);
      
      return result.changes > 0;
    });
    
    return transaction();
  } catch (error) {
    console.error('Error cancelling order:', error);
    return false;
  }
} 