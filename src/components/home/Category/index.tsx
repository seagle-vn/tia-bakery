import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Link } from '@chakra-ui/next-js';
import { HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import { ProductCard } from '../ProductCard';

const products = [
  {
    image:
      'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    link: '/',
    title: 'Birthday cakes',
  },

  {
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2FrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    link: '/',
    title: 'Bake goods',
  },
  {
    image:
      'https://images.unsplash.com/photo-1607478900766-efe13248b125?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    link: '/',
    title: 'Featured products',
  },
  {
    image:
      'https://images.unsplash.com/photo-1559620192-032c4bc4674e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGNha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    link: '/',
    title: 'Banana Bread',
  },
];

interface CategoryProps {
  title: string;
  link: string;
  products: {
    image: { url: string };
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
          fontSize='2.25rem'
          fontWeight='700'
        >
          {title}
        </Text>
        <Link href={link} color='primary.200'>
          <HStack alignItems='center' justifyContent='center'>
            <Text fontSize='1.2rem'>See all</Text>
            <ArrowForwardIcon boxSize={6} />
          </HStack>
        </Link>
      </HStack>
      <SimpleGrid w='100%' spacing={10} columns={[1, 4]}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image.url}
            title={product.name}
            link={`/products/${product.slug}`}
          />
        ))}
      </SimpleGrid>
    </VStack>
  );
};
