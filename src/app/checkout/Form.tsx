import {
  Button,
  FormControl,
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
import { FunctionComponent, useState } from 'react';

export const CheckoutForm: FunctionComponent = () => {
  const [date, setDate] = useState(new Date());

  return (
    <GridItem
      mt={[5, null, 0]}
      colSpan={{
        md: 2,
      }}
      bg='white'
    >
      <chakra.form
        method='POST'
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
            <FormControl as={GridItem} colSpan={[6]}>
              <FormLabel
                fontSize='sm'
                htmlFor='name'
                fontWeight='md'
                color='gray.700'
                _dark={{
                  color: 'gray.50',
                }}
              >
                Full Name
              </FormLabel>
              <Input
                type='text'
                name='name'
                id='name'
                autoComplete='name'
                mt={1}
                rounded='md'
              />
            </FormControl>

            <FormControl as={GridItem} colSpan={[6, 3]}>
              <FormLabel
                fontSize='sm'
                htmlFor='phone'
                fontWeight='md'
                color='gray.700'
                _dark={{
                  color: 'gray.50',
                }}
              >
                First name
              </FormLabel>
              <Input
                type='text'
                name='phone'
                id='phone'
                autoComplete='phone'
                mt={1}
                rounded='md'
              />
            </FormControl>

            <FormControl as={GridItem} colSpan={[6, 3]}>
              <FormLabel
                htmlFor='email_address'
                fontSize='sm'
                fontWeight='md'
                color='gray.700'
                _dark={{
                  color: 'gray.50',
                }}
              >
                Email address
              </FormLabel>
              <Input
                type='text'
                name='email_address'
                id='email_address'
                autoComplete='email'
                mt={1}
                rounded='md'
              />
            </FormControl>

            <FormControl as={GridItem} colSpan={6}>
              <FormLabel
                htmlFor='street_address'
                fontSize='sm'
                fontWeight='md'
                color='gray.700'
                _dark={{
                  color: 'gray.50',
                }}
              >
                Street address
              </FormLabel>
              <Input
                type='text'
                name='street_address'
                id='street_address'
                autoComplete='street-address'
                mt={1}
                rounded='md'
              />
            </FormControl>

            <FormControl as={GridItem} colSpan={[6, 3]}>
              <FormLabel
                htmlFor='city'
                fontSize='sm'
                fontWeight='md'
                color='gray.700'
                _dark={{
                  color: 'gray.50',
                }}
              >
                City
              </FormLabel>
              <Input
                type='text'
                name='city'
                id='city'
                autoComplete='city'
                mt={1}
                rounded='md'
              />
            </FormControl>

            <FormControl as={GridItem} colSpan={[6, 3]}>
              <FormLabel
                htmlFor='postal_code'
                fontSize='sm'
                fontWeight='md'
                color='gray.700'
                _dark={{
                  color: 'gray.50',
                }}
              >
                ZIP / Postal
              </FormLabel>
              <Input
                type='text'
                name='postal_code'
                id='postal_code'
                autoComplete='postal-code'
                mt={1}
                rounded='md'
              />
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
            <FormControl as={GridItem} colSpan={[6]}>
              <FormLabel
                fontSize='sm'
                htmlFor='date'
                fontWeight='md'
                color='gray.700'
                _dark={{
                  color: 'gray.50',
                }}
              >
                Date of shipping
              </FormLabel>
              <SingleDatepicker
                id='date'
                name='date'
                date={date}
                onDateChange={setDate}
              />
            </FormControl>
            <FormControl as={GridItem} colSpan={[6]}>
              <FormLabel
                fontSize='sm'
                htmlFor='note'
                fontWeight='md'
                color='gray.700'
                _dark={{
                  color: 'gray.50',
                }}
              >
                Order Notes
              </FormLabel>
              <Textarea
                name='note'
                id='note'
                autoComplete='postal-note'
                mt={1}
                shadow='sm'
              />
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
          <RadioGroup name='whenToPay'>
            <HStack gap='4rem' direction='row'>
              <Radio width='50%' value='advanced'>
                Pay in advanced
              </Radio>
              <Radio width='50%' value='payAtPickUp'>
                Pay at pick up
              </Radio>
            </HStack>
          </RadioGroup>

          <Text
            fontSize='xl'
            fontWeight={700}
            mt='2rem'
            mb='1rem'
            lineHeight={1.2}
          >
            Payment method
          </Text>
          <RadioGroup name='paymentMethod'>
            <HStack gap='4rem' direction='row'>
              <Radio width='50%' value='transfer'>
                E-transfer
              </Radio>
              <Radio width='50%' value='cash'>
                Cash
              </Radio>
            </HStack>
          </RadioGroup>

          <Button textTransform='uppercase' colorScheme='blue' mt='2rem'>
            Place order
          </Button>
        </Stack>
      </chakra.form>
    </GridItem>
  );
};
