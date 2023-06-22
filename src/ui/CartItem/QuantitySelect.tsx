import { Select, SelectProps, useColorModeValue } from '@chakra-ui/react';

export const QuantitySelect = (props: SelectProps) => {
  return (
    <Select
      maxW='64px'
      aria-label='Select quantity'
      focusBorderColor={useColorModeValue('blue.500', 'blue.200')}
      {...props}
    >
      <option value='1'>1</option>
      <option value='2'>2</option>
      <option value='3'>3</option>
      <option value='4'>4</option>
    </Select>
  );
};
