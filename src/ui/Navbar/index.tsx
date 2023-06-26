import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Badge,
  Button,
  Collapse,
  HStack,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { FunctionComponent, useRef } from 'react';
import { BsCart3 } from 'react-icons/bs';
import { useCart } from 'react-use-cart';
import { CartDrawer } from '../CartDrawer';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import styles from './Navbar.module.css';

export const Navbar: FunctionComponent = () => {
  const {
    isOpen: isCartOpen,
    onOpen: onCartOpen,
    onClose: onCartClose,
  } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  const {
    isOpen: isMobileNavOpen,
    onOpen: onMobileNavOpen,
    onClose: onMobileNavClose,
    onToggle,
  } = useDisclosure();

  const { totalItems } = useCart();

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
          <BsCart3 />
          {totalItems > 0 ? (
            <Badge
              fontSize='10px'
              bgColor='black'
              color='white'
              position='absolute'
              top='0px'
              right='-8px'
              borderRadius='50%'
              size='lg'
              py='5px'
              px='6px'
            >
              {totalItems}
            </Badge>
          ) : null}
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
        finalFocusRef={btnRef}
      />
    </>
  );
};
