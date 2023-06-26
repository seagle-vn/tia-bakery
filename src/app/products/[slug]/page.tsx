import { ApolloClient, gql } from '@apollo/client';
import { NextSSRInMemoryCache } from '@apollo/experimental-nextjs-app-support/ssr';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductClientPage } from './client-page';

const query = gql`
  query PageProduct($slug: String) {
    product(where: { slug: $slug }) {
      id
      name
      slug
      image
      seo
    }
  }
`;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const client = new ApolloClient({
    uri: 'https://api-ca-central-1.hygraph.com/v2/cljabf7co288y01t24ejkdc80/master',
    cache: new NextSSRInMemoryCache(),
  });
  const {
    data: { product },
  } = await client.query({
    query,
    variables: { slug: params.slug },
  });

  if (!product) return notFound();

  const { url, width, height } = product.image || {};

  return {
    title: product.seo?.title || product.title,
    description: product.seo?.description || product.description,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt: product.seo?.title || product.title,
            },
          ],
        }
      : null,
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductClientPage params={params} />;
}
