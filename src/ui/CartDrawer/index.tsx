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
  Text,
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
  const { items, isEmpty } = useCart();

  const handleScrollToQuote = () => {
    onClose();
    setTimeout(() => {
      const element = document.querySelector('#quote');
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 300);
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement='right'
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size='md'
      {...props}
    >
      <DrawerOverlay bg='blackAlpha.600' />
      <DrawerContent bg='bg.primary'>
        <DrawerCloseButton color='text.dark' />

        <DrawerBody>
          <Stack spacing={{ base: '8', md: '10' }} flex='2'>
            <Heading
              fontSize='2xl'
              mt='4rem'
              fontWeight='semibold'
              fontFamily='cormorant'
              color='text.dark'
            >
              Your Quote ({items.length} {items.length === 1 ? 'item' : 'items'})
            </Heading>

            {isEmpty ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '48px 0',
                  textAlign: 'center',
                  minHeight: '300px',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#F9D7DC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <svg
                    style={{ width: '32px', height: '32px', color: '#DB6E93' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <Text fontSize='lg' fontWeight='semibold' color='text.dark' mb={2}>
                  Your cart is empty
                </Text>
                <Text fontSize='sm' color='text.dark' opacity={0.7}>
                  Add some delicious cakes to get started!
                </Text>
              </div>
            ) : (
              <>
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
                <Divider borderColor='border.light' />
                <OrderSummary />
              </>
            )}
          </Stack>
        </DrawerBody>

        {!isEmpty && (
          <DrawerFooter borderTopWidth='1px' borderColor='border.light'>
            <Button
              w='100%'
              bg='blue.400'
              color='white'
              borderRadius='full'
              px='8'
              py='6'
              fontSize='16px'
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
              onClick={handleScrollToQuote}
            >
              Continue to Quote
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};
