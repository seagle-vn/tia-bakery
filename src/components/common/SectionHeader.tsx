import { Box, Heading, Text, VStack } from '@chakra-ui/react';

export interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  align = 'center',
}: SectionHeaderProps) {
  return (
    <VStack spacing={4} textAlign={align} w='full'>
      {/* Label */}
      <Text
        color='blue.400'
        textTransform='uppercase'
        letterSpacing='0.15em'
        fontWeight='semibold'
        fontSize={{ base: 'xs', md: 'sm' }}
      >
        {label}
      </Text>

      {/* Title */}
      <Heading
        as='h2'
        fontFamily='cormorant'
        fontWeight='semibold'
        color='text.dark'
        fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
        lineHeight='tight'
      >
        {title}
      </Heading>

      {/* Subtitle (optional) */}
      {subtitle && (
        <Text
          color='text.dark'
          maxW='2xl'
          mx='auto'
          lineHeight='relaxed'
          fontSize={{ base: 'md', md: 'lg' }}
        >
          {subtitle}
        </Text>
      )}
    </VStack>
  );
}
