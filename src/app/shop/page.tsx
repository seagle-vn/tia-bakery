'use client';

import { gql } from '@apollo/client';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { Box, SimpleGrid } from '@chakra-ui/react';
import { ProductCard } from '../../components/shop/ProductCard';

const query = gql`
  query ShopPage {
    products(first: 100) {
      id
      name
      image
      price
      slug
    }
  }
`;

export default function ShopPage() {
  const { data } = useSuspenseQuery(query, {
    fetchPolicy: 'cache-first',
  });

  return (
    <Box py='4rem'>
      <SimpleGrid width='80%' margin='0 auto' columns={[1, 4]} spacing='4rem'>
        {(data as any).products.map((product: any) => (
          <ProductCard
            key={product.id}
            name={product.name}
            image={product.image.public_id}
            price={product.price}
            slug={product.slug}
            id={product.id}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
