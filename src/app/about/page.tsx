import AboutClientPage from './client-page';

export async function generateMetadata() {
  return {
    title: 'About',
    description: 'About tia bakery',
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default function AboutPage() {
  return <AboutClientPage />;
}
