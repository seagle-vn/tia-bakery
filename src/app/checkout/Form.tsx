import {
  Button,
  FormControl,
  FormErrorMessage,
  GridItem,
  HStack,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Textarea,
  chakra,
  useToast,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { useRouter } from 'next/navigation';
import { FunctionComponent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useCart } from 'react-use-cart';
import { FormHeading } from './FormHeading';
import { CheckoutFormLabel } from './FormLabel';
import { TextInput } from './TextInput';
import { FormValues, schema } from './types';

export const CheckoutForm: FunctionComponent = () => {
  const {
    handleSubmit,
    register,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<FormValues>({ mode: 'onChange', resolver: zodResolver(schema) });
  const { items, cartTotal } = useCart();
  const router = useRouter();
  const toast = useToast();

  async function onSubmit(values: FormValues) {
    try {
      await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          products: items,
          ...values,
          total: cartTotal,
        }),
      });
      toast({
        title:
          "Your order was sent! We'll get back to you as soon as possible.",
        position: 'top-right',
        isClosable: true,
        status: 'success',
      });
      router.push('/');
    } catch (err) {
      toast({
        title:
          'Something wrong happened! Please us contact us directly to order',
        position: 'top-right',
        isClosable: true,
        status: 'error',
      });
    }
  }

  return (
    <GridItem
      mt={[5, null, 0]}
      colSpan={{
        md: 2,
      }}
      bg='white'
    >
      <chakra.form
        onSubmit={handleSubmit(onSubmit)}
        overflow={{
          sm: 'hidden',
        }}
        height='full'
      >
        <Stack
          px={4}
          py={5}
          p={[null, 6]}
          bg='white'
          _dark={{
            bg: '#141517',
          }}
          spacing={6}
        >
          <FormHeading mt={0}>Shipping Information</FormHeading>
          <SimpleGrid columns={6} spacing={6}>
            <TextInput
              htmlFor='name'
              isInvalid={errors.name != null}
              errorMessage={errors.name?.message}
              colSpan={[6]}
              label={'Full name'}
              register={register}
              name='name'
            />

            <TextInput
              htmlFor='phone'
              isInvalid={errors.phone != null}
              errorMessage={errors.phone?.message}
              colSpan={[6, 3]}
              register={register}
              name='phone'
              label='Phone number'
            />

            <TextInput
              htmlFor='email'
              isInvalid={errors.email != null}
              errorMessage={errors.email?.message}
              colSpan={[6, 3]}
              register={register}
              name='email'
              label='Email address'
              registerOptions={{}}
            />

            <TextInput
              htmlFor='address'
              isInvalid={errors.address != null}
              errorMessage={errors.address?.message}
              colSpan={[6]}
              register={register}
              name='address'
              label='Street address'
            />

            <TextInput
              htmlFor='city'
              isInvalid={errors.city != null}
              errorMessage={errors.city?.message}
              colSpan={[6, 3]}
              register={register}
              name='city'
              label='City'
            />

            <TextInput
              htmlFor='postal_code'
              isInvalid={errors.postal_code != null}
              errorMessage={errors.postal_code?.message}
              colSpan={[6, 3]}
              register={register}
              name='postal_code'
              label='ZIP / Postal code'
            />
          </SimpleGrid>

          <FormHeading>Order details</FormHeading>
          <SimpleGrid columns={6} spacing={6}>
            <FormControl
              isInvalid={errors.date != null}
              as={GridItem}
              colSpan={[6]}
            >
              <CheckoutFormLabel>Date of delivery</CheckoutFormLabel>
              <Controller
                name='date'
                control={control}
                render={({ field }) => (
                  <SingleDatepicker
                    {...field}
                    id='date'
                    minDate={new Date()}
                    date={
                      getValues('date') != null
                        ? new Date(getValues('date'))
                        : undefined
                    }
                    onDateChange={(date) =>
                      setValue('date', date.toISOString())
                    }
                    propsConfigs={{
                      inputProps: {
                        placeholder: 'yyyy-mm-dd',
                      },
                      dayOfMonthBtnProps: {
                        selectedBtnProps: {
                          backgroundColor: 'blue.200',
                        },
                        defaultBtnProps: {
                          _hover: {
                            background: 'blue.400',
                          },
                        },
                      },
                    }}
                  />
                )}
              />
              <FormErrorMessage>
                {errors.date && errors.date.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={errors.notes != null}
              as={GridItem}
              colSpan={[6]}
            >
              <CheckoutFormLabel>Order Notes</CheckoutFormLabel>
              <Textarea id='notes' mt={1} shadow='sm' {...register('notes')} />
            </FormControl>
          </SimpleGrid>

          <FormHeading>How to pay</FormHeading>
          <FormControl>
            <Controller
              rules={{
                required: 'This field is required',
              }}
              name='whenToPay'
              control={control}
              render={({ field }) => (
                <RadioGroup {...field}>
                  <HStack gap='4rem' direction='row'>
                    <Radio width='50%' value='advanced'>
                      Pay in advanced
                    </Radio>
                    <Radio width='50%' value='payAtPickUp'>
                      Pay at pick up
                    </Radio>
                  </HStack>
                </RadioGroup>
              )}
            />
          </FormControl>

          <FormHeading>Payment method</FormHeading>
          <Controller
            name='paymentMethod'
            control={control}
            rules={{
              required: 'This field is required',
            }}
            render={({ field }) => (
              <RadioGroup {...field}>
                <HStack gap='4rem' direction='row'>
                  <Radio width='50%' value='transfer'>
                    E-transfer
                  </Radio>
                  <Radio width='50%' value='cash'>
                    Cash
                  </Radio>
                </HStack>
              </RadioGroup>
            )}
          />

          <Button
            textTransform='uppercase'
            colorScheme='blue'
            mt='2rem'
            type='submit'
            isLoading={isSubmitting}
            isDisabled={!isDirty || !isValid}
          >
            Place order
          </Button>
        </Stack>
      </chakra.form>
    </GridItem>
  );
};
