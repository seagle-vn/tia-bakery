import {
  Button,
  Flex,
  Link,
  Select,
  SelectProps,
  useColorModeValue,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { PriceTag } from './PriceTag';
import { CartProductMeta } from './CartProductMeta';
import { useCart } from 'react-use-cart';

type CartItemProps = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  imageUrl: string;
  onChangeQuantity?: (quantity: number) => void;
};

const QuantitySelect = (props: SelectProps) => {
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

export const CartItem = ({
  id,
  name,
  description,
  quantity,
  imageUrl,
  price,
  onChangeQuantity,
}: CartItemProps) => {
  const { removeItem } = useCart();

  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      justify='space-between'
      align='center'
    >
      <CartProductMeta name={name} description={description} image={imageUrl} />

      {/* Desktop */}
      <Flex
        width='full'
        justify='space-between'
        display={{ base: 'none', md: 'flex' }}
      >
        <QuantitySelect
          value={quantity}
          onChange={(e) => {
            onChangeQuantity?.(+e.currentTarget.value);
          }}
        />
        <PriceTag price={price} currency='CAD' />
        <Button
          onClick={() => removeItem(id)}
          variant='ghost'
          colorScheme='red'
        >
          <DeleteIcon />
        </Button>
      </Flex>

      {/* Mobile */}
      <Flex
        mt='4'
        align='center'
        width='full'
        justify='space-between'
        display={{ base: 'flex', md: 'none' }}
      >
        <Link fontSize='sm' textDecor='underline'>
          Delete
        </Link>
        <QuantitySelect
          value={quantity}
          onChange={(e) => {
            onChangeQuantity?.(+e.currentTarget.value);
          }}
        />
        <PriceTag price={price} currency='CAD' />
      </Flex>
    </Flex>
  );
};
