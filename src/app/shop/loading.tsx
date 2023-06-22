'use client';

import { Box, SimpleGrid, Skeleton, VStack } from '@chakra-ui/react';

export default function Loading() {
  return (
    <Box py='4rem'>
      <SimpleGrid width='80%' margin='0 auto' columns={[1, 4]} spacing='4rem'>
        {new Array(8).fill(0).map((_, index) => (
          <VStack key={index}>
            <Skeleton height='10rem' />
            <Skeleton height='2rem' />
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
}
