import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_EDGE_CONFIG}/items`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            operation: 'update',
            key: 'checkout-data',
            value: data,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error saving to Edge Config:', errorResponse);
      return NextResponse.json(
        { success: false, message: 'Failed to save data to Edge Config.' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, message: 'Data saved to Edge Config.' });
  } catch (error) {
    console.error('Error saving data to Edge Config:', error);
    return NextResponse.json(
      { success: false, message: 'Error saving data.' },
      { status: 500 }
    );
  }
}
