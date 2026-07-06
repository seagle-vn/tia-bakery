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
      range: 'A2:O2',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            body.name,
            body.phone,
            body.address,
            body.city,
            body.postal_code,
            eventDate ? formatDate(eventDate) : '',
            notes,
            body.whenToPay,
            body.paymentMethod,
            body.total,
            JSON.stringify(
              products,
              null,
              4
            ),
            'FALSE',
            formatDate(new Date().toISOString()),
            body.email || '',
            body.inspirationPhoto?.dataUrl || '',
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
