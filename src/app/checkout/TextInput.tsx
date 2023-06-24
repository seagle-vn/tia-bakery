import {
  FormControl,
  FormErrorMessage,
  GridItem,
  Input,
} from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import { RegisterOptions, UseFormRegister } from 'react-hook-form';
import { CheckoutFormLabel } from './FormLabel';
import { FormValues } from './types';

type TextInputProps = {
  isInvalid?: boolean;
  colSpan?: number[];
  htmlFor: string;
  label: string;
  errorMessage?: string;
  register: UseFormRegister<FormValues>;
  name: keyof FormValues;
  registerOptions?: RegisterOptions<FormValues, keyof FormValues>;
};
export const TextInput: FunctionComponent<TextInputProps> = ({
  isInvalid,
  colSpan,
  htmlFor,
  errorMessage,
  label,
  register,
  name,
  registerOptions,
}) => {
  return (
    <FormControl isInvalid={isInvalid} as={GridItem} colSpan={colSpan}>
      <CheckoutFormLabel>{label}</CheckoutFormLabel>
      <Input
        id={htmlFor}
        mt={1}
        {...register(name, {
          required: 'This field is required',
          ...registerOptions,
        })}
      />
      <FormErrorMessage>
        {errorMessage != null ? errorMessage : null}
      </FormErrorMessage>
    </FormControl>
  );
};
