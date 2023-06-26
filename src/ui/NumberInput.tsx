'use client';

import {
  Button,
  HStack,
  Input,
  NumberInputProps,
  useNumberInput,
} from '@chakra-ui/react';
import { FunctionComponent } from 'react';

export const NumberInput: FunctionComponent<
  NumberInputProps & { onChange: (value: number) => void }
> = ({ step, defaultValue, min, max, onChange }) => {
  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
    value,
  } = useNumberInput({
    step,
    defaultValue,
    min,
    max,
  });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  return (
    <HStack>
      <Button
        {...inc}
        onClick={(e) => {
          inc.onClick?.(e);
          onChange(Number(value));
        }}
      >
        +
      </Button>
      <Input
        {...input}
        onChange={(e) => {
          input.onChange?.(e);
          onChange(Number(e.target.value));
        }}
      />
      <Button
        {...dec}
        onClick={(e) => {
          inc.onClick?.(e);
          onChange(Number(value));
        }}
      >
        -
      </Button>
    </HStack>
  );
};
