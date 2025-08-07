'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import {
  Alert,
  Box,
  ChakraProvider,
  Link,
  Text,
  extendTheme,
} from '@chakra-ui/react';
import { Amatic_SC, Grandiflora_One, Roboto_Condensed, Poppins } from 'next/font/google';
import 'yet-another-react-lightbox/styles.css';
import { Footer } from '../ui/Footer';
import { Navbar } from '../ui/Navbar';
import FloatingChat from '../components/FloatingChat';

const colors = {
  primary: {
    200: '#53B7D1',
  },
};

const amaticSc = Amatic_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});
const roboto = Roboto_Condensed({
  subsets: ['latin'],
  weight: '300',
  display: 'swap',
});
const grandiflora = Grandiflora_One({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const theme = extendTheme({
  colors,
  fonts: {
    heading: 'var(--font-poppins)',
    body: 'var(--font-poppins)',
    amatic: 'var(--font-amatic)',
    roboto: 'var(--font-roboto)',
    grandiflora: 'var(--font-grandiflora)',
    poppins: 'var(--font-poppins)',
  },
});

export function ClientLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-amatic: ${amaticSc.style.fontFamily};
            --font-roboto: ${roboto.style.fontFamily};
            --font-grandiflora: ${grandiflora.style.fontFamily};
            --font-poppins: ${poppins.style.fontFamily};
          }
          
          * {
            font-family: var(--font-poppins);
          }
        `}
      </style>
      <CacheProvider>
        <ChakraProvider theme={theme}>
          <Box width='full' overflowX='hidden'>
            <Alert status='info' bg='#42ced1'>
              <Text
                fontFamily='poppins'
                fontWeight={200}
                margin='0 auto'
                color='white'
                fontSize='30px'
                textAlign='center'
              >
                Call me at 226 700 3943 -
                <Link ml='10px' color='#b5ff34e6' href='mailto:tiabakery2019@gmail.com'>
                  Order Your Cake
                </Link>
              </Text>
            </Alert>
            <Navbar />
            {children}
            <Footer />
            <FloatingChat />
          </Box>
        </ChakraProvider>
      </CacheProvider>
    </>
  );
}
