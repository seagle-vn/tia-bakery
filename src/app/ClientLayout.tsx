'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Amatic_SC, Grandiflora_One, Roboto_Condensed } from 'next/font/google';
import { Footer } from '../ui/Footer';
import { Navbar } from '../ui/Navbar';

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

export const theme = extendTheme({
  colors,
  fonts: {
    amatic: 'var(--font-amatic)',
    roboto: 'var(--font-roboto)',
    grandiflora: 'var(--font-grandiflora)',
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
          }
        `}
      </style>
      <CacheProvider>
        <ChakraProvider theme={theme}>
          <Navbar />
          {children}
          <Footer />
        </ChakraProvider>
      </CacheProvider>
    </>
  );
}
