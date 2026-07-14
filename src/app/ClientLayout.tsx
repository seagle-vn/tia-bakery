'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import {
  Box,
  ChakraProvider,
  extendTheme
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Cormorant_Garamond, Nunito_Sans } from 'next/font/google';
import 'yet-another-react-lightbox/styles.css';
import { Footer } from '../ui/Footer';
import { Navbar } from '../ui/Navbar';

const colors = {
  // Brand colors
  blue: {
    50: '#E6F7FA',
    100: '#B3E8F2',
    200: '#80D9EA',
    300: '#4DCAE2',
    400: '#41B9D2',
    500: '#2E9FBE',
    600: '#2685A0',
    700: '#1E6B82',
    800: '#165164',
    900: '#0E3746',
  },
  pink: {
    50: '#FEF0F5',
    100: '#FBE3EC',
    200: '#F5C7D9',
    300: '#EFABC6',
    400: '#E28FB3',
    500: '#DB6E93',
    600: '#C24D93',
    700: '#A03B7A',
    800: '#7E2961',
    900: '#5C1748',
  },
  // Background colors
  bg: {
    primary: '#FBF6EC',
    secondary: '#F9D7DC',
    card: '#FCF8EF',
  },
  // Text colors
  text: {
    dark: '#4A3B36',
    white: '#FFFFFF',
  },
  // Border colors
  border: {
    light: '#F0DDE2',
    medium: '#F3DCE3',
    pink: '#C24D93',
  },
};

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const theme = extendTheme({
  colors,
  fonts: {
    heading: 'var(--font-cormorant)',
    body: 'var(--font-nunito)',
    nunito: 'var(--font-nunito)',
    cormorant: 'var(--font-cormorant)',
  },
  radii: {
    sm: '12px',
    md: '16px',
    lg: '22px',
    xl: '24px',
    full: '999px',
  },
  shadows: {
    sm: '0 2px 8px rgba(74, 59, 54, 0.08)',
    md: '0 4px 16px rgba(74, 59, 54, 0.12)',
    lg: '0 8px 24px rgba(74, 59, 54, 0.16)',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'full',
      },
      variants: {
        primary: {
          bg: 'blue.400',
          color: 'white',
          _hover: {
            bg: 'blue.500',
            transform: 'translateY(-2px)',
            shadow: 'md',
          },
          _active: {
            bg: 'blue.600',
            transform: 'translateY(0)',
          },
        },
        secondary: {
          bg: 'transparent',
          color: 'pink.500',
          borderWidth: '2px',
          borderColor: 'pink.500',
          _hover: {
            bg: 'pink.50',
            transform: 'translateY(-2px)',
            shadow: 'sm',
          },
          _active: {
            bg: 'pink.100',
            transform: 'translateY(0)',
          },
        },
      },
      defaultProps: {
        variant: 'primary',
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'bg.card',
          borderRadius: 'lg',
          borderWidth: '1.5px',
          borderColor: 'border.medium',
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderColor: 'border.medium',
            borderRadius: 'md',
            _focus: {
              borderColor: 'blue.400',
              boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
            },
          },
        },
      },
    },
    Textarea: {
      variants: {
        outline: {
          borderColor: 'border.medium',
          borderRadius: 'md',
          _focus: {
            borderColor: 'blue.400',
            boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
          },
        },
      },
    },
  },
});

const CHAT_EMBED_ORIGIN = 'https://www.askbox.app';

export function ClientLayout({ children }: React.PropsWithChildren) {
  // The chat widget iframe is transparent, so while it's collapsed to just the
  // bubble the rest of its box would still intercept taps on the page beneath
  // it (e.g. the quote form on mobile). The embed posts an `askbox:resize`
  // message reporting its open/closed state; shrink the iframe to the bubble
  // while minimized and expand it only when the chat is open.
  const [chatMinimized, setChatMinimized] = useState(true);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== CHAT_EMBED_ORIGIN) return;
      const data = event.data || {};
      if (data.type !== 'askbox:resize') return;
      setChatMinimized(Boolean(data.minimized));
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-nunito: ${nunitoSans.style.fontFamily};
            --font-cormorant: ${cormorantGaramond.style.fontFamily};
          }

          * {
            font-family: var(--font-nunito);
          }
        `}
      </style>
      <CacheProvider>
        <ChakraProvider theme={theme}>
          <Box width='full' overflowX='hidden'>
            <Navbar />
            {children}
            <Footer />

            {/* Chat Widget */}
            <iframe
              src="https://www.askbox.app/embed/9cbf5730-174b-4783-8c78-f5dc939be834?transparent=true"
              frameBorder="0"
              allow="clipboard-write"
              allowTransparency
              style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                width: chatMinimized ? '96px' : '400px',
                height: chatMinimized ? '96px' : '600px',
                maxWidth: 'calc(100vw - 48px)',
                maxHeight: 'calc(100vh - 48px)',
                border: 'none',
                zIndex: 9999,
                background: 'transparent',
                transition: 'width 0.2s ease, height 0.2s ease'
              }}
              title="Tia bakery Chat Widget"
            />
          </Box>
        </ChakraProvider>
      </CacheProvider>
    </>
  );
}
