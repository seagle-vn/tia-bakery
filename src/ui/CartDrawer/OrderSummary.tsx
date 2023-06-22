import { Flex, Stack, Text } from '@chakra-ui/react';
import { useCart } from 'react-use-cart';
import { formatPrice } from '../CartItem/PriceTag';
import { OrderSummaryItem } from '../OrderSummaryItem';

export const OrderSummary = () => {
  const { cartTotal } = useCart();

  return (
    <Stack spacing='8' width='full'>
      <Stack spacing='6'>
        <OrderSummaryItem label='Subtotal' value={formatPrice(cartTotal)} />
        <Flex justify='space-between'>
          <Text fontSize='lg' fontWeight='semibold'>
            Total
          </Text>
          <Text fontSize='xl' fontWeight='extrabold'>
            {formatPrice(cartTotal)}
          </Text>
        </Flex>
      </Stack>
    </Stack>
  );
};
