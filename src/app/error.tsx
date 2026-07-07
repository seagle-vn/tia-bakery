'use client';

import { useEffect } from 'react';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error caught by error boundary:', error);
  }, [error]);

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="bg.primary"
      p={6}
    >
      <VStack spacing={6} maxW="lg" textAlign="center">
        <Heading size="2xl" color="text.dark">
          Houston, something went wrong
        </Heading>
        <Text color="text.dark" fontSize="lg">
          Please review the information below for more details.
        </Text>
        <Box
          maxW="500px"
          p={6}
          border="2px"
          borderRadius="8px"
          borderColor="border.medium"
          bg="white"
        >
          <Text color="red.600">{error.message || error.toString()}</Text>
        </Box>
        <Button
          onClick={reset}
          bg="blue.400"
          color="white"
          size="lg"
          _hover={{ bg: 'blue.500' }}
        >
          Try again
        </Button>
      </VStack>
    </Box>
  );
}
