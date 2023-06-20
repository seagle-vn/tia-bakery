'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { Amatic_SC, Roboto_Condensed } from 'next/font/google';

const colors = {
  primary: {
    200: '#53B7D1',
  },
};

const amaticSc = Amatic_SC({ subsets: ['latin'], weight: ['400', '700'] });
const roboto = Roboto_Condensed({ subsets: ['latin'], weight: '300' });

export const theme = extendTheme({
  colors,
  fonts: {
    amatic: 'var(--font-amatic)',
    roboto: 'var(--font-roboto)',
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-amatic: ${amaticSc.style.fontFamily};
            --font-roboto: ${roboto.style.fontFamily};
          }
        `}
      </style>
      <CacheProvider>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </CacheProvider>
    </>
  );
}
