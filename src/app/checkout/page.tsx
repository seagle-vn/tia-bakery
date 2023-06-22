'use client';

import { Box, SimpleGrid } from '@chakra-ui/react';
import { CheckoutForm } from './Form';
import { OrderDetails } from './OrderDetails';

export default function CheckoutPage() {
  return (
    <Box
      _dark={{
        bg: '#111',
      }}
      px='10%'
      py='4rem'
    >
      <Box bg='gray.50' mt={[10, 0]}>
        <SimpleGrid
          display={{
            base: 'initial',
            md: 'grid',
          }}
          columns={{
            md: 3,
          }}
        >
          <CheckoutForm />
          <OrderDetails />
        </SimpleGrid>
      </Box>
    </Box>
  );
}
