import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Link } from '@chakra-ui/next-js';
import { HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import { ProductCard } from '../ProductCard';

interface CategoryProps {
  title: string;
  link: string;
  products: {
    image: { url: string; public_id: string };
    name: string;
    id: string;
    slug: string;
  }[];
}
export const Category: FunctionComponent<CategoryProps> = ({
  title,
  link,
  products,
}) => {
  return (
    <VStack my='2rem' w='80%'>
      <HStack w='100%' justifyContent='space-between'>
        <Text
          color='black'
          fontFamily='roboto'
          fontSize={{ base: '1.6rem', md: '2.25rem' }}
          fontWeight='700'
        >
          {title}
        </Text>
        <Link href={link} color='primary.200'>
          <HStack alignItems='center' justifyContent='center'>
            <Text fontSize={{ md: '1.2rem', base: '1rem' }}>See all</Text>
            <ArrowForwardIcon boxSize={6} />
          </HStack>
        </Link>
      </HStack>
      <SimpleGrid w='100%' spacing={10} columns={[1, 4]}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image.public_id}
            title={product.name}
            link={`/products/${product.slug}`}
          />
        ))}
      </SimpleGrid>
    </VStack>
  );
};
