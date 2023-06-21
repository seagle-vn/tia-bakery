import { Link } from '@chakra-ui/next-js';
import {
  HStack,
  VStack,
  Text,
  Box,
  Button,
  useDisclosure,
  Badge,
} from '@chakra-ui/react';
import { useRef, FunctionComponent } from 'react';
import styles from './Navbar.module.css';
import { CartDrawer } from '../CartDrawer';
import { useCart } from 'react-use-cart';

export const Navbar: FunctionComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  const { totalItems } = useCart();

  return (
    <>
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
            width='13rem'
            height='13rem'
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
              <Button
                ref={btnRef}
                variant='link'
                onClick={onOpen}
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
                    fontSize='0.8em'
                    bgColor='black'
                    color='white'
                    position='absolute'
                    top='-15px'
                    right='-28px'
                    borderRadius='50%'
                    size='lg'
                    py='5px'
                    px='6px'
                  >
                    {totalItems}
                  </Badge>
                ) : null}
              </Button>
            </Box>
          </HStack>
        </HStack>
      </VStack>

      <CartDrawer isOpen={isOpen} onClose={onClose} finalFocusRef={btnRef} />
    </>
  );
};
