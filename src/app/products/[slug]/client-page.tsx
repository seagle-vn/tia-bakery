'use client';

import { gql, useSuspenseQuery } from '@apollo/client';
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Image,
  NumberInput,
  Select,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { AddToCartButton } from '../../../ui/AddToCartButton';

const query = gql`
  query PageProduct($slug: String) {
    product(where: { slug: $slug }) {
      id
      name
      slug
      image
      description {
        html
      }
      sizes {
        id
        name
        price
      }
    }
  }
`;

export function ProductClientPage({ params }: { params: { slug: string } }) {
  const { data } = useSuspenseQuery(query, {
    variables: { slug: params.slug },
    fetchPolicy: 'cache-first',
  });

  const { product } = data as any;

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('Small');

  const price = product.sizes.find((s: any) => s.name === size)?.price ?? 30;

  return (
    <SimpleGrid
      my={{ base: '1rem', md: '4rem' }}
      gap={{ base: '2rem', md: '5rem' }}
      columns={[1, 2]}
      px={{ base: '5%', md: '15%' }}
    >
      <Image
        borderRadius={{ base: '1rem', md: 'none' }}
        src={product.image.url}
        alt={product.name}
      />
      <Box>
        <VStack spacing={1} alignItems='flex-start'>
          <Text fontSize={{ base: '2rem', md: '3.75rem' }} fontWeight='bold'>
            {product.name}
          </Text>
          <Text fontSize='lg' fontWeight={600}>
            {price.toFixed(2)} $
          </Text>
          <Box
            dangerouslySetInnerHTML={{ __html: product.description.html }}
            mt={{ base: '1rem', md: '3rem' }}
            maxW={{ base: '100%', md: '80%' }}
          />
          <HStack mt='2rem' width='100%' spacing='15%'>
            <FormControl id='quantity'>
              <FormLabel>Quantity</FormLabel>
              <NumberInput
                onChange={(value) => {
                  setQuantity(Number(value));
                }}
                defaultValue={1}
                step={1}
                min={1}
                max={100}
              />
            </FormControl>
            <FormControl id='quantity'>
              <FormLabel>Select size</FormLabel>
              <Select onChange={(e) => setSize(e.target.value)}>
                {product.sizes.map((size: any) => (
                  <option value={size.name} key={size.id}>
                    {size.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </HStack>
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price,
              image: product.image.url,
              slug: product.slug,
              size,
            }}
            quantity={quantity}
            mt='2rem'
            px='4rem'
            width={{ base: '100%', md: '50%' }}
          />
        </VStack>
      </Box>
    </SimpleGrid>
  );
}
