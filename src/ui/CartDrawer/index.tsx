import { Link } from '@chakra-ui/next-js';
import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  DrawerProps,
  Heading,
  Stack,
} from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import { useCart } from 'react-use-cart';
import { CartItem } from '../CartItem';
import { OrderSummary } from './OrderSummary';

export const CartDrawer: FunctionComponent<Omit<DrawerProps, 'children'>> = ({
  isOpen,
  onClose,
  finalFocusRef,
  ...props
}) => {
  const { items } = useCart();

  return (
    <Drawer
      isOpen={isOpen}
      placement='right'
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size='md'
      {...props}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />

        <DrawerBody>
          <Stack spacing={{ base: '8', md: '10' }} flex='2'>
            <Heading fontSize='2xl' mt='4rem' fontWeight='extrabold'>
              Shopping Cart ({items.length} items)
            </Heading>

            <Stack spacing='6'>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  {...item}
                  imageUrl={item.image}
                  description={`Size ${item.size}`}
                  name={item.name}
                  quantity={item.quantity ?? 0}
                  slug={item.slug}
                />
              ))}
            </Stack>
          </Stack>
          <Divider my='2rem' />
          <OrderSummary />
        </DrawerBody>

        <DrawerFooter>
          <Link w='100%' href='/checkout'>
            <Button w='100%' colorScheme='blue' onClick={onClose}>
              Submit Order
            </Button>
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
