import { Button, HStack, Input, useNumberInput } from '@chakra-ui/react';
import { FunctionComponent } from 'react';

interface NumberInputProps {
  step: number;
  defaultValue: number;
  min: number;
  max: number;
}
export const NumberInput: FunctionComponent<NumberInputProps> = ({
  step,
  defaultValue,
  min,
  max,
}) => {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step,
      defaultValue,
      min,
      max,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  return (
    <HStack maxW='320px'>
      <Button {...inc}>+</Button>
      <Input {...input} />
      <Button {...dec}>-</Button>
    </HStack>
  );
};
