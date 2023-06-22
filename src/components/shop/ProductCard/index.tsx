import { Link } from '@chakra-ui/next-js';
import { Card, Flex, Text, VStack } from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  slug: string;
  image: string;
  name: string;
  price: number;
  id: string;
}
export const ProductCard: FunctionComponent<ProductCardProps> = ({
  slug,
  image,
  name,
  price,
  id,
}) => {
  return (
    <VStack>
      <Card overflow='hidden' className={styles.card}>
        <Link height='100%' href={`/products/${slug}`}>
          <div
            className={styles.image}
            style={{ backgroundImage: `url(${image})` }}
          />
        </Link>
      </Card>
      <Flex direction='column' alignItems='center' mt='md' rowGap={3}>
        <Text size='md'>{name}</Text>
      </Flex>
    </VStack>
  );
};
