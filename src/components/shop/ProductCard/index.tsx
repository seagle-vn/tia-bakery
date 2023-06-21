import { Link } from '@chakra-ui/next-js';
import { Button, Card, Center, Flex, VStack, Text } from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  slug: string;
  image: string;
  name: string;
  price: number;
}
export const ProductCard: FunctionComponent<ProductCardProps> = ({
  slug,
  image,
  name,
  price,
}) => {
  return (
    <VStack>
      <Card overflow='hidden' className={styles.card}>
        <Link height='100%' href={`/products/${slug}`}>
          <div
            className={styles.image}
            style={{ backgroundImage: `url(${image})` }}
          />
          <Button
            variant='filled'
            bg='#717fe0'
            color='#000'
            className={styles.btn}
          >
            Add to cart
          </Button>
        </Link>
      </Card>
      <Flex direction='column' alignItems='center' mt='md' rowGap={3}>
        <Text size='md'>{name}</Text>
      </Flex>
    </VStack>
  );
};
