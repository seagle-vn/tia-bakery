import { Image, Link } from '@chakra-ui/next-js';
import { Card, Flex, Text, VStack } from '@chakra-ui/react';
import { Resize } from '@cloudinary/url-gen/actions/resize';
import { FunctionComponent } from 'react';
import { cld } from '../../../constants/cloudinary';
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
}) => {
  const url = cld
    .image(image)
    .quality('auto')
    .format('auto')
    .resize(Resize.scale().width(336).height(304))
    .toURL();
  return (
    <VStack>
      <Card overflow='hidden' className={styles.card}>
        <Link height='100%' href={`/products/${slug}`}>
          <Image
            className={styles.image}
            width={336}
            height={304}
            src={url}
            alt={name}
          />
        </Link>
      </Card>
      <Flex direction='column' alignItems='center' mt='md' rowGap={3}>
        <Text size='md'>{name}</Text>
      </Flex>
    </VStack>
  );
};
