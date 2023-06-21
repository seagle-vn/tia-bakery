'use client';

import { Box, SimpleGrid } from '@chakra-ui/react';
import { gql } from '@apollo/client';
import { ProductCard } from '../../components/shop/ProductCard';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';

const query = gql`
  query ShopPage {
    products {
      id
      name
      image
      price
      slug
    }
  }
`;

export default function ShopePage() {
  const { data } = useSuspenseQuery(query, {
    fetchPolicy: 'cache-first',
  });
  console.log(JSON.stringify(data, null, 4));

  return (
    <Box py='4rem' backgroundImage="url('/banner_text_background.png')">
      <SimpleGrid width='80%' margin='0 auto' columns={[1, 4]} spacing='4rem'>
        {(data as any).products.map((product: any) => (
          <ProductCard
            key={product.id}
            name={product.name}
            image={product.image.url}
            price={product.price}
            slug={product.name}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
