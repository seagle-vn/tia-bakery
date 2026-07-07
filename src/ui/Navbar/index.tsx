import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Button,
  Collapse,
  HStack,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CartDrawer } from '../CartDrawer';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';

export const Navbar: FunctionComponent = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    isOpen: isCartOpen,
    onOpen: onCartOpen,
    onClose: onCartClose,
  } = useDisclosure();

  const {
    isOpen: isMobileNavOpen,
    onToggle,
  } = useDisclosure();

  return (
    <>
      <HStack
        justifyContent='space-between'
        display={{ base: 'flex', md: 'none' }}
        w='95%'
      >
        <IconButton
          onClick={onToggle}
          icon={
            isMobileNavOpen ? (
              <CloseIcon w={3} h={3} />
            ) : (
              <HamburgerIcon w={5} h={5} />
            )
          }
          variant='ghost'
          aria-label={'Toggle Navigation'}
        />
        <Button
          onClick={() => {
            if (pathname !== '/') {
              router.push('/#quote');
              return;
            }

            const element = document.querySelector('#quote');
            if (element) {
              const headerOffset = 80;
              const elementPosition = element.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
          }}
          bg='#41B9D2'
          color='white'
          borderRadius='999px'
          fontSize='15px'
          fontWeight={700}
          px='24px'
          py='13px'
          h='auto'
          my='8px'
          boxShadow='0 8px 18px -8px rgba(65, 185, 210, 0.9)'
          _hover={{
            bg: '#2E9FBE',
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 24px -12px rgba(65, 185, 210, 0.95)',
          }}
          _active={{
            bg: '#2E9FBE',
          }}
        >
          Order Your Cake
        </Button>
      </HStack>
      <Collapse in={isMobileNavOpen} animateOpacity>
        <MobileNav />
      </Collapse>
      <DesktopNav onCartOpen={onCartOpen} />

      {/* <DesktopNav onCartOpen={onCartOpen} /> */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={onCartClose}
      />
    </>
  );
};
