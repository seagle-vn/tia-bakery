import formData from 'form-data';
import Mailgun from 'mailgun.js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { emailTemplate } from '../constants/email-template';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async ({ body }, res) => {
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
      .replace('$$email$$', body.email)
      .replace('$$address$$', body.address)
      .replace('$$tel$$', body.tel)
      .replace('$$message$$', body.message)
      .replace('$$products$$', JSON.stringify(body.products)),
  };

  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN as string, emailToSend);
  } catch (e) {
    console.log(e);
  }
  res.status(200).json({ status: 'success' });
});

export default router.handler({
  onError: (err, req, res) => {
    if (err instanceof Error) {
      console.error(err.stack);
    }
    res.status(500).end('Something wrong happened!');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});
