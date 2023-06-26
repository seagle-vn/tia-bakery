import HomeClientPage from './client-page';

export const metadata = {
  description:
    'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    images: [
      {
        url: `/api/og?title=${encodeURIComponent('Tia bakery')}`,
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
};

export default function HomePage() {
  return <HomeClientPage />;
}
