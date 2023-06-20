'use client';
import { Box, Center, Text } from '@chakra-ui/react';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <Box
        backgroundImage="url('/banner.jpg')"
        backgroundPosition='center'
        backgroundRepeat='no-repeat'
        backgroundSize='cover'
        height='425px'
        width='100%'
      />
      <Center
        backgroundImage="url('/banner_text_background.png')"
        backgroundPosition='center'
        backgroundRepeat='no-repeat'
        backgroundSize='cover'
        py='4rem'
        className={styles.banner}
        position='relative'
      >
        <Text
          fontFamily='amatic'
          fontWeight='700'
          fontSize='4rem'
          color='primary.200'
          lineHeight='1.1'
          letterSpacing={1}
          borderTop='3px solid'
          borderTopColor='primary.200'
          py='2rem'
          textAlign='center'
          maxWidth='35rem'
          position='relative'
          className={styles.bannerText}
        >
          Fresh. Seasonal. Handmade. Philly&apos;s new craft bake shop.
        </Text>
      </Center>
    </main>
  );
}
