import { Image } from '@chakra-ui/next-js';
import {
  HStack,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FunctionComponent, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import styles from './Menu.module.css';
import { generateSlides } from './slides';

interface Menu {
  id: string;
  image: any;
}

export const Menu: FunctionComponent<{ menus: Menu[] }> = ({ menus }) => {
  const [basicExampleOpen, setBasicExampleOpen] = useState(false);
  const slides = generateSlides(menus);
  return (
    <VStack id='menu' my='2rem' w={{ base: '62%', lg: '80%' }}>
      <HStack w='100%' justifyContent='space-between'>
        <Text
          color='black'
          fontFamily='roboto'
          fontSize={{ base: '1.6rem', md: '2.25rem' }}
          fontWeight='700'
        >
          Our Menu
        </Text>
      </HStack>
      <Lightbox
        styles={{ root: { '--yarl__color_backdrop': 'rgba(0, 0, 0, .8)' } }}
        open={basicExampleOpen}
        close={() => setBasicExampleOpen(false)}
        controller={{ closeOnBackdropClick: true }}
        slides={slides}
        plugins={[Zoom]}
        zoom={{
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          scrollToZoom: true,
        }}
      />
      <SimpleGrid w='100%' spacing='6rem' columns={[1, 4]}>
        {menus.map(({ image, id }) => {
          return (
            <LinkBox
              key={id}
              as='div'
              position='relative'
              p='lg'
              shadow='lg'
              className={styles.card}
              borderRadius='1rem'
            >
              <LinkOverlay onClick={() => setBasicExampleOpen(true)}>
                <Image
                  width={354}
                  height={400}
                  alt={image.url}
                  className={styles.image}
                  src={image.url}
                />
              </LinkOverlay>
            </LinkBox>
          );
        })}
      </SimpleGrid>
    </VStack>
  );
};
