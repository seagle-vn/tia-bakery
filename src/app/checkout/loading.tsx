'use client';
import { Box, HStack, Skeleton, SkeletonText, VStack } from '@chakra-ui/react';

export default function LoadingPage() {
  return (
    <Box px='10%' py='4rem'>
      <HStack alignItems='start' width='100%'>
        <VStack alignItems='start' width='65%' spacing='4rem'>
          <VStack spacing='1rem' width='full' alignItems='start'>
            <Skeleton width='50%' height='1rem' />
            <SkeletonText noOfLines={4} width='80%' />
          </VStack>
          <VStack spacing='1rem' width='full' alignItems='start'>
            <Skeleton width='50%' height='1rem' />
            <SkeletonText noOfLines={4} width='80%' />
          </VStack>
          <VStack spacing='1rem' width='full' alignItems='start'>
            <Skeleton width='50%' height='1rem' />
            <SkeletonText noOfLines={4} width='80%' />
          </VStack>
          <VStack spacing='1rem' width='full' alignItems='start'>
            <Skeleton width='50%' height='1rem' />
            <SkeletonText noOfLines={4} width='80%' />
          </VStack>
        </VStack>
        <VStack width='35%'>
          <HStack width='100%'>
            <Skeleton width='33%' height='4rem' />
            <SkeletonText noOfLines={3} width='33%' />
          </HStack>
          <HStack width='100%'>
            <Skeleton width='33%' height='4rem' />
            <SkeletonText noOfLines={3} width='33%' />
          </HStack>
          <HStack width='100%'>
            <Skeleton width='33%' height='4rem' />
            <SkeletonText noOfLines={3} width='33%' />
          </HStack>
        </VStack>
      </HStack>
      {/* <VStack width='80%' margin='0 auto' spacing='4rem'>
	  {new Array(4).fill(0).map((_, index) => (
		 <VStack key={index}>
			<Skeleton borderRadius='xl' width='full' height='10rem' />
			<SkeletonText noOfLines={3} width='full' height='2rem' />
		 </VStack>
	  ))}
	</VStack> */}
    </Box>
  );
}
