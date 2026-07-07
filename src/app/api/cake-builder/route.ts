import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Disable caching for dev

export async function GET() {
  try {
    const fileId = process.env.NEXT_PUBLIC_CAKE_BUILDER_FILE_ID;

    if (!fileId) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_CAKE_BUILDER_FILE_ID not configured' },
        { status: 500 }
      );
    }

    // Google Drive direct download URL
    const url = `https://drive.google.com/uc?export=download&id=${fileId}`;

    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch from Google Drive' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('API Route - Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
