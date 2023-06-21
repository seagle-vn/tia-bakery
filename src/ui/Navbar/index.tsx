import { Link } from '@chakra-ui/next-js';
import {
  HStack,
  VStack,
  Text,
  Box,
  Avatar,
  AvatarBadge,
} from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import styles from './Navbar.module.css';
import Image from 'next/image';

export const Navbar: FunctionComponent = () => {
  return (
    <VStack justifyContent='center' backgroundColor='#FBD4D7' pb='2rem'>
      <VStack>
        <Text
          fontSize='5.5rem'
          textShadow='2px 2px #ffffff'
          fontFamily='amatic'
          color='primary.200'
          fontWeight='bold'
          letterSpacing='5px'
        >
          Tia bakery
        </Text>
        <Text fontFamily='amatic' fontSize='26px' marginTop='-25px'>
          Cakes and joyfulness
        </Text>
      </VStack>
      <HStack spacing='8rem' justifyContent='space-between'>
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
            <Link
              href='/shop'
              className={styles.link}
              _hover={{ color: 'primary.200' }}
            >
              Menu
            </Link>
          </Box>
        </HStack>
        <Box
          backgroundImage='/logo.png'
          backgroundPosition='center'
          backgroundSize='cover'
          backgroundRepeat='no-repeat'
          width='10rem'
          height='10rem'
          borderRadius='50%'
        >
          <Link href='/'></Link>
        </Box>
        <HStack spacing='3rem' width='8rem' justifyContent='space-around'>
          <Box>
            <Link
              href='/about'
              className={styles.link}
              _hover={{ color: 'primary.200' }}
            >
              Instagram
            </Link>
          </Box>
          <Box>
            <Link
              href='/about'
              className={styles.link}
              _hover={{ color: 'primary.200' }}
            >
              Basket
            </Link>
          </Box>
        </HStack>
      </HStack>
    </VStack>
  );
};
