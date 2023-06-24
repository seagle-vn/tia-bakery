import { FormLabel, FormLabelProps } from '@chakra-ui/react';
import { FunctionComponent } from 'react';

export const CheckoutFormLabel: FunctionComponent<FormLabelProps> = ({
  children,
  ...props
}) => {
  return (
    <FormLabel
      fontSize='sm'
      htmlFor='date'
      color='gray.700'
      _dark={{
        color: 'gray.50',
      }}
      {...props}
    >
      {children}
    </FormLabel>
  );
};
