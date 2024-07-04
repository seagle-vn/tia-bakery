import HomeClientPage from './client-page';

export const metadata = {
  description:
    'Online Cake Shop in London Ontario. Birthday Cake, Custom Cake, Wedding Cakeand Special Occasion Cake',
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
  keywords: ['Tia bakery', 'London Ontario', 'Tia', 'cakes', 'bakery'],
};

export default function HomePage() {
  return <HomeClientPage />;
}
