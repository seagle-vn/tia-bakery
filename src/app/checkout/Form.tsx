import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  HStack,
  Input,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  chakra,
} from '@chakra-ui/react';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { FunctionComponent } from 'react';
import { Controller, useForm } from 'react-hook-form';

type FormValues = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postal_code: string;
  date: string;
  notes: string;
  whenToPay: string;
  paymentMethod: string;
};

export const CheckoutForm: FunctionComponent = () => {
  const {
    handleSubmit,
    register,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<FormValues>({ mode: 'onChange' });

  function onSubmit(values: FormValues) {
    console.log(values);
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
        shadow='base'
        rounded={[null, 'md']}
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
          <Text fontSize='xl' mb='1rem' fontWeight={700} lineHeight={1.2}>
            Shipping Information
          </Text>
          <SimpleGrid columns={6} spacing={6}>
            <FormControl
              isInvalid={errors.name != null}
              as={GridItem}
              colSpan={[6]}
            >
              <FormLabel
                fontSize='sm'
                htmlFor='name'
                color='gray.700'
                _dark={{
                  color: 'gray.50',
                }}
              >
                Full Name
              </FormLabel>
              <Input
                id='name'
                mt={1}
                {...register('name', {
                  required: 'This field is required',
                })}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.phone != null}
              as={GridItem}
              colSpan={[6, 3]}
            >
              <FormLabel
                fontSize='sm'
                htmlFor='phone'
                color='gray.700'
                _dark={{
                  color: 'gray.50',
                }}
              >
                Phone number
              </FormLabel>
              <Input
                id='phone'
                mt={1}
                {...register('phone', {
                  required: 'This field is required',
                })}
              />
              <FormErrorMessage>
                {errors.phone && errors.phone.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.email != null}
              as={GridItem}
              colSpan={[6, 3]}
            >
              <FormLabel
                htmlFor='email'
                fontSize='sm'
                color='gray.700'
                _dark={{
                  color: 'gray.50',
                }}
              >
                Email address
              </FormLabel>
              <Input
                id='email'
                autoComplete='email'
                mt={1}
                {...register('email', {
                  required: 'This field is required',
                })}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.address != null}
              as={GridItem}
              colSpan={6}
            >
              <FormLabel
                htmlFor='address'
                fontSize='sm'
                color='gray.700'
                _dark={{
                  color: 'gray.50',
                }}
              >
                Street address
              </FormLabel>
              <Input
                id='address'
                mt={1}
                rounded='md'
                {...register('address', {
                  required: 'This field is required',
                })}
              />
              <FormErrorMessage>
                {errors.address && errors.address.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.city != null}
              as={GridItem}
              colSpan={[6, 3]}
            >
              <FormLabel
                htmlFor='city'
                fontSize='sm'
                color='gray.700'
                _dark={{
                  color: 'gray.50',
                }}
              >
                City
              </FormLabel>
              <Input
                id='city'
                mt={1}
                rounded='md'
                {...register('city', {
                  required: 'This field is required',
                })}
              />
              <FormErrorMessage>
                {errors.city && errors.city.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.postal_code != null}
              as={GridItem}
              colSpan={[6, 3]}
            >
              <FormLabel
                htmlFor='postal_code'
                fontSize='sm'
                color='gray.700'
                _dark={{
                  color: 'gray.50',
                }}
              >
                ZIP / Postal code
              </FormLabel>
              <Input
                id='postal_code'
                mt={1}
                rounded='md'
                {...register('postal_code', {
                  required: 'This field is required',
                })}
              />
              <FormErrorMessage>
                {errors.postal_code && errors.postal_code.message}
              </FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <Text
            fontSize='xl'
            fontWeight={700}
            mt='2rem'
            mb='1rem'
            lineHeight={1.2}
          >
            Order details
          </Text>
          <SimpleGrid columns={6} spacing={6}>
            <FormControl
              isInvalid={errors.date != null}
              as={GridItem}
              colSpan={[6]}
            >
              <FormLabel
                fontSize='sm'
                htmlFor='date'
                color='gray.700'
                _dark={{
                  color: 'gray.50',
                }}
              >
                Date of delivery
              </FormLabel>
              <Controller
                name='date'
                control={control}
                render={({ field }) => (
                  <SingleDatepicker
                    {...field}
                    id='date'
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
              <FormLabel
                fontSize='sm'
                htmlFor='notes'
                color='gray.700'
                _dark={{
                  color: 'gray.50',
                }}
              >
                Order Notes
              </FormLabel>
              <Textarea id='notes' mt={1} shadow='sm' {...register('notes')} />
            </FormControl>
          </SimpleGrid>

          <Text
            fontSize='xl'
            fontWeight={700}
            mt='2rem'
            mb='1rem'
            lineHeight={1.2}
          >
            How to pay
          </Text>
          <FormControl>
            <Controller
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

          <Text
            fontSize='xl'
            fontWeight={700}
            mt='2rem'
            mb='1rem'
            lineHeight={1.2}
          >
            Payment method
          </Text>
          <Controller
            name='paymentMethod'
            control={control}
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
