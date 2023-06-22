import { Select, SelectProps, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';

export const QuantitySelect = (
  props: Omit<SelectProps, 'onChange' | 'defaultValue'> & {
    onChange: (value: number) => void;
    defaultValue: number;
  }
) => {
  const [quantity, setQuantity] = useState(props.defaultValue);

  return (
    <Select
      maxW='80px'
      aria-label='Select quantity'
      focusBorderColor={useColorModeValue('blue.500', 'blue.200')}
      {...props}
      onChange={(e) => {
        setQuantity(Number(e.target.value));
        props.onChange(Number(e.target.value));
      }}
    >
      <option value='1'>1</option>
      <option value='2'>2</option>
      <option value='3'>3</option>
      <option value='4'>4</option>
      <option value='5'>5</option>
      <option value='6'>6</option>
      <option value='7'>7</option>
      <option value='8'>8</option>
      <option value='9'>9</option>
      <option value='10'>10</option>
    </Select>
  );
};
