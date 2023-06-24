import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { NextRequest, NextResponse } from 'next/server';
import { emailTemplate } from '../../../constants/email-template';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY as string,
    });
    const emailToSend = {
      from: process.env.ADDRESS_FROM,
      to: process.env.ADDRESS_TO,
      subject: 'Your bakery has an order',
      html: emailTemplate
        .replace('$$name$$', body.name)
        .replace('$$phone$$', body.phone)
        .replace('$$email$$', body.email)
        .replace('$$address$$', body.address)
        .replace('$$city$$', body.city)
        .replace('$$postal_code$$', body.postal_code)
        .replace('$$date$$', new Date(body.date).toISOString())
        .replace('$$notes$$', body.notes)
        .replace('$$whenToPay$$', body.whenToPay)
        .replace('$$paymentMethod$$', body.paymentMethod)
        .replace('$$total$$', body.total)
        .replace(
          '$$products$$',
          JSON.stringify(body.products, null, '&nbsp;')
            .split('\n')
            .join('<br>&nbsp;&nbsp;')
            .split('<br>&nbsp;&nbsp;}')
            .join('<br>}')
        ),
    };

    await mg.messages.create(process.env.MAILGUN_DOMAIN as string, emailToSend);
  } catch (e) {
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
