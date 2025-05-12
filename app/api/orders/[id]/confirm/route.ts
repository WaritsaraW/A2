import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/data-service';

// Mark this route as dynamic to avoid static rendering errors
export const dynamic = 'force-dynamic';

// This is a mock implementation since we don't have a full update function in our data service
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    
    // In a real implementation, we would update the order status in the database
    // For now, we'll just return a success response
    
    return NextResponse.json({ 
      success: true, 
      message: `Order ${orderId} confirmed successfully` 
    });
  } catch (error) {
    console.error('Error confirming order:', error);
    return NextResponse.json(
      { error: 'Failed to confirm order' },
      { status: 500 }
    );
  }
} 