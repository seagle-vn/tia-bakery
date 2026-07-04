import { Link } from '@chakra-ui/next-js';
import { Badge, Box, Button, HStack, Text } from '@chakra-ui/react';
import { FunctionComponent, useRef } from 'react';
import { BsCart3 } from 'react-icons/bs';
import { useCart } from 'react-use-cart';
import styles from './Navbar.module.css';

export const DesktopNav: FunctionComponent<{ onCartOpen: () => void }> = ({
  onCartOpen,
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const { totalItems } = useCart();

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box
      as='nav'
      display={{ base: 'none', md: 'block' }}
      position='sticky'
      top={0}
      zIndex={100}
      backgroundColor='rgba(251, 246, 236, 0.9)'
      backdropFilter='blur(12px)'
      borderBottom='1px solid'
      borderColor='border.light'
      w='full'
    >
      <HStack
        maxW='1440px'
        mx='auto'
        px='6'
        py='4'
        justifyContent='space-between'
        alignItems='center'
      >
        {/* Left Navigation Links */}
        <HStack spacing='8' flex='1'>
          <Link
            href='#hero'
            onClick={(e) => handleSmoothScroll(e, '#hero')}
            className={styles.link}
            fontSize='16px'
            fontWeight='400'
            color='text.dark'
            _hover={{ color: 'blue.400', textDecoration: 'none' }}
          >
            Home
          </Link>
          <Link
            href='#gallery'
            onClick={(e) => handleSmoothScroll(e, '#gallery')}
            className={styles.link}
            fontSize='16px'
            fontWeight='400'
            color='text.dark'
            _hover={{ color: 'blue.400', textDecoration: 'none' }}
          >
            Gallery
          </Link>
          <Link
            href='#menu'
            onClick={(e) => handleSmoothScroll(e, '#menu')}
            className={styles.link}
            fontSize='16px'
            fontWeight='400'
            color='text.dark'
            _hover={{ color: 'blue.400', textDecoration: 'none' }}
          >
            Menu
          </Link>
        </HStack>

        {/* Center Logo & Brand */}
        <HStack spacing='3' flex='0 0 auto'>
          <Link href='/' display='flex' alignItems='center'>
            <Box
              width='46px'
              height='46px'
              borderRadius='50%'
              overflow='hidden'
              boxShadow='sm'
            >
              <img
                src='/new_logo.png'
                alt='Tia Bakery Logo'
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Link>
          <Text
            fontFamily='cormorant'
            fontSize='26px'
            fontWeight='600'
            color='text.dark'
            letterSpacing='0.5px'
          >
            Tia Bakery
          </Text>
        </HStack>

        {/* Right Navigation Links & Actions */}
        <HStack spacing='8' flex='1' justifyContent='flex-end'>
          <Link
            href='#about'
            onClick={(e) => handleSmoothScroll(e, '#about')}
            className={styles.link}
            fontSize='16px'
            fontWeight='400'
            color='text.dark'
            _hover={{ color: 'blue.400', textDecoration: 'none' }}
          >
            About
          </Link>
          <Link
            href='#faq'
            onClick={(e) => handleSmoothScroll(e, '#faq')}
            className={styles.link}
            fontSize='16px'
            fontWeight='400'
            color='text.dark'
            _hover={{ color: 'blue.400', textDecoration: 'none' }}
          >
            FAQ
          </Link>

          {/* CTA Button */}
          <Button
            as='a'
            href='#quote'
            onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector('#quote');
              if (element) {
                const headerOffset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
              }
            }}
            bg='blue.400'
            color='white'
            px='6'
            py='2.5'
            borderRadius='full'
            fontSize='15px'
            fontWeight='600'
            _hover={{
              bg: 'blue.500',
              transform: 'translateY(-2px)',
              shadow: 'md',
            }}
            _active={{
              bg: 'blue.600',
              transform: 'translateY(0)',
            }}
          >
            Order Your Cake
          </Button>

          {/* Cart Button */}
          <Button
            ref={btnRef}
            variant='ghost'
            onClick={onCartOpen}
            position='relative'
            color='text.dark'
            p='2'
            minW='auto'
            _hover={{
              bg: 'transparent',
              color: 'blue.400',
            }}
          >
            <BsCart3 size={22} />
            {totalItems > 0 && (
              <Badge
                bgColor='blue.400'
                color='white'
                position='absolute'
                top='0'
                right='0'
                borderRadius='full'
                fontSize='10px'
                minW='18px'
                h='18px'
                display='flex'
                alignItems='center'
                justifyContent='center'
              >
                {totalItems}
              </Badge>
            )}
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
};
