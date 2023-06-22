import { Divider, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import { useCart } from 'react-use-cart';
import { CartItem } from '../../ui/CartItem';
import { formatPrice } from '../../ui/CartItem/PriceTag';
import { OrderSummaryItem } from '../../ui/OrderSummaryItem';

const shipping = 5;
export const OrderDetails: FunctionComponent = () => {
  const { items, cartTotal } = useCart();

  return (
    <Stack spacing={{ base: '8', md: '10' }} flex='2' p={10}>
      <Heading fontSize='xl' fontWeight='bold'>
        Order summary
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
            displayRemoveButton={false}
          />
        ))}
      </Stack>

      <Stack spacing='6'>
        <OrderSummaryItem label='Subtotal' value={formatPrice(cartTotal)} />
        <OrderSummaryItem label='Shipping' value={formatPrice(shipping)} />
        <Divider />
        <Flex justify='space-between'>
          <Text fontSize='lg' fontWeight='semibold'>
            Total
          </Text>
          <Text fontSize='xl' fontWeight='extrabold'>
            {formatPrice(cartTotal + shipping)}
          </Text>
        </Flex>
      </Stack>
    </Stack>
  );
};
