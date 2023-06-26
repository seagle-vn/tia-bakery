import { Image, Link } from '@chakra-ui/next-js';
import { Box, Text } from '@chakra-ui/react';

import { Resize } from '@cloudinary/url-gen/actions/resize';
import { cld } from '../../../constants/cloudinary';
import styles from './ProductCard.module.css';

interface CategoryCardProps {
  link: string;
  image: string;
  title: string;
}

export function ProductCard({ image, title, link }: CategoryCardProps) {
  const url = cld
    .image(image)
    .quality('auto')
    .format('auto')
    .resize(Resize.scale().width(354).height(304))
    .toURL();
  return (
    <Box
      position='relative'
      p='lg'
      shadow='lg'
      className={styles.card}
      borderRadius='1rem'
    >
      <Link href={link}>
        <Image
          width={354}
          height={304}
          alt={title}
          className={styles.image}
          src={url}
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
      </Link>
    </Box>
  );
}
