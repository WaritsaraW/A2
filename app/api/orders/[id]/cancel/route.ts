import { NextResponse } from 'next/server';
import { cancelOrder } from '@/lib/data-service';

// Mark this route as dynamic to avoid static rendering errors
export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id, 10);
    
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }
    
    const success = await cancelOrder(orderId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to cancel order. Order not found or not in pending state.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Order ${orderId} cancelled successfully` 
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { error: 'Failed to cancel order' },
      { status: 500 }
    );
  }
} 