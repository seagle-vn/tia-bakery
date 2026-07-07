import { createApolloClient } from '@/lib/apollo-client';
import { gql } from '@apollo/client';
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
      description {
        text
      }
      seo
    }
  }
`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const client = createApolloClient();

  const { data } = await client.query({
    query,
    variables: { slug },
  });

  const { product } = data as any;

  if (!product) return notFound();

    return {
      title: product.name,
      description: product.description?.text || product.name,
      robots: {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      },
      openGraph: product.image?.url
        ? {
            images: [
              {
                url: product.image.url,
                width: product.image.width || 1200,
                height: product.image.height || 630,
                alt: product.name,
              },
            ],
          }
        : null,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  return <ProductClientPage params={resolvedParams} />;
}
