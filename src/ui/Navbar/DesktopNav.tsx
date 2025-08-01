import { Link } from '@chakra-ui/next-js';
import {
  Badge,
  Box,
  Button,
  HStack,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FunctionComponent, useRef } from 'react';
import { useCart } from 'react-use-cart';
import styles from './Navbar.module.css';

export const DesktopNav: FunctionComponent<{ onCartOpen: () => void }> = ({
  onCartOpen,
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const { totalItems } = useCart();

  return (
    <VStack
      display={{ base: 'none', md: 'flex' }}
      justifyContent='center'
      backgroundColor='#FFD4D7'
      pb='1rem'
      w='full'
    >
      <HStack spacing='8rem' justifyContent='space-between' alignItems='center' position='relative'>
        <HStack spacing='3rem' width='16rem' justifyContent='space-around'>
          <Box>
            <Link
              href='/'
              className={styles.link}
              _hover={{ color: 'primary.200' }}
            >
              Home
            </Link>
          </Box>
          <Box>
            <Link
              href='/shop'
              className={styles.link}
              _hover={{ color: 'primary.200' }}
            >
              Gallery
            </Link>
          </Box>
          <Box>
            <Link
              href='/sharing'
              className={styles.link}
              _hover={{ color: 'primary.200' }}
            >
              Sharing
            </Link>
          </Box>
        </HStack>
        <Box flex='1' display='flex' marginLeft='3rem' justifyContent='center'>
          <Link href='/'>
            <Box
              width='19rem'
              height='19rem'
            >
              <img
                src='/logo.png'
                alt='Tia Bakery Logo'
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  mixBlendMode: 'multiply',
                  filter: 'contrast(1.2) brightness(1.1) saturate(1.1)',
                  borderRadius: '50%'
                }}
              />
            </Box>
          </Link>
        </Box>
        <HStack spacing='3rem' width='16rem' justifyContent='space-around'>
          <Box>
            <Link
              href='/about'
              className={styles.link}
              _hover={{ color: 'primary.200' }}
            >
              About
            </Link>
          </Box>
          <Box>
            <Link
              href='/faq'
              className={styles.link}
              _hover={{ color: 'primary.200' }}
            >
              FAQ
            </Link>
          </Box>
          <Box>
            <Button
              ref={btnRef}
              variant='link'
              onClick={onCartOpen}
              className={styles.link}
              position='relative'
              color='black'
              _hover={{
                textDecoration: 'none',
                color: '#53B7D1',
              }}
            >
              Basket
              {totalItems > 0 ? (
                <Badge
                  bgColor='black'
                  color='white'
                  position='absolute'
                  top='0px'
                  right='-28px'
                  borderRadius='50%'
                  size='lg'
                  py='5px'
                  px='8px'
                >
                  {totalItems}
                </Badge>
              ) : null}
            </Button>
          </Box>
        </HStack>
      </HStack>
    </VStack>
  );
};
