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
      backgroundColor='#FBD4D7'
      pb='1rem'
      w='full'
    >
      <VStack>
        <Heading
          as='h1'
          fontSize='5.5rem'
          textShadow='2px 2px #ffffff'
          fontFamily='amatic'
          color='primary.200'
          fontWeight='bold'
          letterSpacing='5px'
        >
          Tia bakery
        </Heading>
        <Text fontFamily='amatic' fontSize='26px' marginTop='-25px'>
          Cakes and joyfulness
        </Text>
      </VStack>
      <HStack spacing='8rem' justifyContent='space-between'>
        <HStack spacing='3rem' width='8rem' justifyContent='space-around'>
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
              Menu
            </Link>
          </Box>
        </HStack>
        <Link href='/'>
          <Box
            backgroundImage='/logo.png'
            backgroundPosition='center'
            backgroundSize='cover'
            backgroundRepeat='no-repeat'
            width='13rem'
            height='13rem'
            borderRadius='50%'
          ></Box>
        </Link>
        <HStack spacing='3rem' width='8rem' justifyContent='space-around'>
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
