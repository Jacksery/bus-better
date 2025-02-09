import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const API_KEY = process.env.NEXT_PUBLIC_BUS_API_KEY;
        const response = await fetch(
            `https://data.bus-data.dft.gov.uk/api/v1/datafeed/9950/?api_key=${API_KEY}`,
            {
                headers: {
                    'Accept': '*/*',
                },
                next: { revalidate: 30 },
            }
        );

        const data = await response.text();
        return new NextResponse(data, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml',
            },
        });
    } catch (error) {
        console.error('API route error:', error);
        return new NextResponse('Error fetching bus data', { status: 500 });
    }
}
