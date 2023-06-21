import { Box, Card, CardBody, Image, LinkBox, Text } from '@chakra-ui/react';
import styles from './ProductCard.module.css';
import { Link } from '@chakra-ui/next-js';

interface CategoryCardProps {
  link: string;
  image: string;
  title: string;
}

export function ProductCard({ image, title, link }: CategoryCardProps) {
  return (
    <Box
      position='relative'
      p='lg'
      shadow='lg'
      className={styles.card}
      borderRadius='1rem'
    >
      <Link href='/'></Link>
      <div
        className={styles.image}
        style={{ backgroundImage: `url(${image})` }}
      />
      <Box
        className={styles.overlay}
        bgGradient='linear(to-b, transparent, gray.900 60%)'
        w='100%'
        h='100%'
      />

      <div className={styles.content}>
        <div>
          <Text
            size='lg'
            color='white'
            pb='1rem'
            className={styles.title}
            fontWeight={500}
          >
            {title}
          </Text>
        </div>
      </div>
    </Box>
  );
}
