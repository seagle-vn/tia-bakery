import './globals.css';

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
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
