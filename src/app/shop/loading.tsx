'use client';

import {
  Box,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  VStack,
} from '@chakra-ui/react';

export default function Loading() {
  return (
    <Box px='10%' py='4rem'>
      <SimpleGrid width='80%' margin='0 auto' columns={[1, 4]} spacing='4rem'>
        {new Array(8).fill(0).map((_, index) => (
          <VStack key={index}>
            <Skeleton borderRadius='xl' width='full' height='10rem' />
            <SkeletonText noOfLines={1} width='40%' height='2rem' />
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
}
