import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // In a real app, you would save this to a database
    // For now, we'll just generate a random booking ID
    const bookingId = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Here you would typically save to your database
    // await saveBookingToDatabase({ ...body, bookingId });
    
    return NextResponse.json({ 
      success: true, 
      bookingId,
      message: 'Booking created successfully',
      data: body
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking', details: error.message },
      { status: 500 }
    );
  }
}
