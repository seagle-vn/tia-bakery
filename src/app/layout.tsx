import './globals.css';

import GoogleAnalytics from '../ui/GoogleAnalytics';
import { ApolloWrapper } from './ApolloWrapper';
import CartProvider from './CartProvider';
import { ClientLayout } from './ClientLayout';

export const metadata = {
  title: {
    default: 'Tia bakery',
    template: '%s | Tia bakery',
  },
  robots: {
    follow: true,
    index: true,
  },
  openGraph: {
    url: 'https://www.url.ie/a',
    title: 'Tia bakery',
    description:
      'Philadelphia Based Handmade, Freshly Prepared, Seasonally Inspired Craft Baked Goods',
    images: [
      {
        url: `/api/og?title=${encodeURIComponent('Tia bakery')}`,
        width: 800,
        height: 600,
        alt: 'Og Image Alt',
        type: 'image/jpeg',
      },
    ],
    siteName: 'SiteName',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <GoogleAnalytics GA_MEASUREMENT_ID='G-RX9QSRTKV2' />
      <body>
        <ApolloWrapper delay={1000}>
          <CartProvider>
            <ClientLayout>{children}</ClientLayout>
          </CartProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
