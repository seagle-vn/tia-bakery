import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    projectId: process.env.PROJECT_ID,
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: (process.env.PRIVATE_KEY as string)
        .split(String.raw`\n`)
        .join('\n'),
    },
  });
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const body = await request.json();
    const products = getProducts(body);
    const eventDate = body.date || body.eventDate || '';
    const notes = body.notes || body.details || '';

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID as string,
      range: 'A2:J2',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            body.name,                                // Column A - Name
            body.phone,                               // Column B - Phone
            eventDate ? formatDate(eventDate) : '',   // Column C - Event date
            notes,                                    // Column D - Notes/Details
            body.total,                               // Column E - Total
            JSON.stringify(                           // Column F - Products (JSON)
              products,
              null,
              4
            ),
            formatDate(new Date().toISOString()),     // Column G - Order date
            body.email || '',                         // Column H - Email
            '',                                       // Column I - Email sent status (added by script)
            body.inspirationPhotoUrl || '',           // Column J - Supabase image URL
          ],
        ],
      },
    });
  } catch (e) {
    console.log(e);
    return new NextResponse(
      JSON.stringify({ message: 'Something wrong happened' }),
      { status: 500 }
    );
  }

  return new NextResponse(
    JSON.stringify({ message: 'Placed order successfully' }),
    { status: 200 }
  );
}

function formatDate(str: string) {
  const date = new Date(str);
  return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getFullYear()}`;
}

function getProducts(body: any) {
  const products = body.products || body.items || [];

  return products.map(
    ({ name, price, size, quantity, itemTotal, product_url }: any) => ({
      name,
      price,
      size,
      quantity,
      itemTotal,
      product_url,
    })
  );
}
