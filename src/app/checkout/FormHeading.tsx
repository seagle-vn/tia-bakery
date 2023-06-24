import { Text, TextProps } from '@chakra-ui/react';
import { FunctionComponent } from 'react';

export const FormHeading: FunctionComponent<TextProps> = ({
  children,
  ...props
}) => {
  return (
    <Text
      fontSize='xl'
      fontWeight={700}
      mt='2rem'
      mb='1rem'
      lineHeight={1.2}
      {...props}
    >
      {children}
    </Text>
  );
};
