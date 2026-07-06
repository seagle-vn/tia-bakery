'use client';

import { use } from 'react';
import { gql } from '@apollo/client';
import { useSuspenseQuery } from '@apollo/client/react';
import { Link } from '@chakra-ui/next-js';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  SimpleGrid,
} from '@chakra-ui/react';
import { ProductCard } from '../../../components/shop/ProductCard';

const query = gql`
  query CategoryPage($slug: String) {
    category(where: { slug: $slug }) {
      name
      id
      products(first: 100) {
        id
        name
        slug
        image
      }
    }
  }
`;

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const { data } = useSuspenseQuery(query, {
    fetchPolicy: 'cache-first',
    variables: { slug },
  });

  const { category } = data as any;

  return (
    <Box py='4rem' width='80%' margin='0 auto'>
      <Breadcrumb mb='2rem'>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link href='/'>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link href='/shop'>Shop</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href='#'>{category.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <SimpleGrid columns={[1, 4]} spacing='4rem'>
        {category.products.map((product: any) => (
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
