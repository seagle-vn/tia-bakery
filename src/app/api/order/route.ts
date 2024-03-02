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

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID as string,
      range: 'A2:M2',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            body.name,
            body.phone,
            body.address,
            body.city,
            body.postal_code,
            formatDate(body.date),
            body.notes,
            body.whenToPay,
            body.paymentMethod,
            body.total,
            JSON.stringify(
              body.products.map(
                ({ name, price, size, quantity, itemTotal }: any) => ({
                  name,
                  price,
                  size,
                  quantity,
                  itemTotal,
                })
              ),
              null,
              4
            ),
            'FALSE',
            formatDate(new Date().toISOString()),
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
