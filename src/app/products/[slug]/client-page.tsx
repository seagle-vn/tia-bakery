'use client';

import { gql, useSuspenseQuery } from '@apollo/client';
import { Image } from '@chakra-ui/next-js';
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Select,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Resize } from '@cloudinary/url-gen/actions/resize';
import { useState } from 'react';
import { cld } from '../../../constants/cloudinary';
import { AddToCartButton } from '../../../ui/AddToCartButton';
import { NumberInput } from '../../../ui/NumberInput';

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
      price
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

  const price =
    product.sizes.find((s: any) => s.name === size)?.price ??
    product.price ??
    30;

  const url = cld
    .image(product.image.public_id)
    .quality('auto')
    .format('auto')
    .resize(Resize.scale().width(420).height(490))
    .toURL();

  return (
    <SimpleGrid
      my={{ base: '1rem', md: '4rem' }}
      gap={{ base: '2rem', md: '5rem' }}
      columns={[1, 2]}
      px={{ base: '5%', md: '15%' }}
    >
      <Image
        height={490}
        width={420}
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
            {price.toFixed(2)} CA$
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
                className='test'
                defaultValue={1}
                step={1}
                min={1}
                max={100}
              />
            </FormControl>
            {product.sizes?.length ? (
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
            ) : null}
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
