'use client';

import { gql, useSuspenseQuery } from '@apollo/client';
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Image,
  Select,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { AddToCartButton } from '../../../ui/AddToCartButton';
import { NumberInput } from '../../../ui/NumberInput';

const query = gql`
  query PageProduct($slug: String) {
    product(where: { slug: $slug }) {
      id
      name
      price
      slug
      image
      description {
        html
      }
    }
  }
`;

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { data } = useSuspenseQuery(query, {
    variables: { slug: params.slug },
    fetchPolicy: 'cache-first',
  });

  const { product } = data as any;

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('small');

  return (
    <SimpleGrid
      my='4rem'
      gap='5rem'
      columns={2}
      sx={{ paddingLeft: '15%', paddingRight: '15%' }}
    >
      <Box borderRadius='1rem'>
        <Image src={product.image.url} alt={product.name} />
      </Box>
      <Box>
        <VStack spacing={1} alignItems='flex-start'>
          <Text fontSize='3.75rem' fontWeight='bold'>
            {product.name}
          </Text>
          <Text fontSize='lg' fontWeight={600}>
            {product.price.toFixed(2)} $
          </Text>
          <Text
            dangerouslySetInnerHTML={{ __html: product.description.html }}
            mt='3rem'
            maxW='80%'
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
                <option value='small'>Big size</option>
                <option value='big'>Small size</option>
              </Select>
            </FormControl>
          </HStack>
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image.url,
              slug: product.slug,
              size,
            }}
            quantity={quantity}
            mt='2rem'
            px='4rem'
          />
        </VStack>
      </Box>
    </SimpleGrid>
  );
}
