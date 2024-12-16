import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_EDGE_CONFIG!, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_VERCEL_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching data from Edge Config:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching data from Edge Config.' },
      { status: 500 }
    );
  }
}
