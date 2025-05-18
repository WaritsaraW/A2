import { NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/data-service';

// Mark this route as dynamic to avoid static rendering errors
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    
    // Add status if not provided
    if (!orderData.status) {
      orderData.status = 'pending';
    }
    
    const success = await createOrder(orderData);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }
    
    // Return success with order ID if it's available
    return NextResponse.json({ 
      id: orderData.id || 'generated-by-system',  // ID might be generated on the server side
      success: true 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 