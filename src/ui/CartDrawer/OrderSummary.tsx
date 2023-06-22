import { Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { useCart } from 'react-use-cart';
import { formatPrice } from '../CartItem/PriceTag';
import { OrderSummaryItem } from '../OrderSummaryItem';

const shipping = 5;

export const OrderSummary = () => {
  const { cartTotal } = useCart();
  const tax = cartTotal * 0.19;
  return (
    <Stack spacing='8' width='full'>
      <Heading size='md'>Order Summary</Heading>

      <Stack spacing='6'>
        <OrderSummaryItem label='Subtotal' value={formatPrice(cartTotal)} />
        <OrderSummaryItem
          label='Tax (19%)'
          value={formatPrice(cartTotal * 0.19)}
        />
        <OrderSummaryItem label='Shipping' value={formatPrice(shipping)} />
        <Flex justify='space-between'>
          <Text fontSize='lg' fontWeight='semibold'>
            Total
          </Text>
          <Text fontSize='xl' fontWeight='extrabold'>
            {formatPrice(cartTotal + shipping + tax)}
          </Text>
        </Flex>
      </Stack>
    </Stack>
  );
};
