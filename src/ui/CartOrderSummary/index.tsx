import {
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa';
import { formatPrice } from '../CartItem/PriceTag';
import { useCart } from 'react-use-cart';

type OrderSummaryItemProps = {
  label: string;
  value?: string;
  children?: React.ReactNode;
};

const OrderSummaryItem = (props: OrderSummaryItemProps) => {
  const { label, value, children } = props;
  return (
    <Flex justify='space-between' fontSize='sm'>
      <Text fontWeight='medium' color={mode('gray.600', 'gray.400')}>
        {label}
      </Text>
      {value ? <Text fontWeight='medium'>{value}</Text> : children}
    </Flex>
  );
};

const shipping = 5;

export const CartOrderSummary = () => {
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
