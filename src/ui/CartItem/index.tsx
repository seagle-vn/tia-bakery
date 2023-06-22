import { DeleteIcon } from '@chakra-ui/icons';
import { Button, Flex, Link } from '@chakra-ui/react';
import { useCart } from 'react-use-cart';
import { CartProductMeta } from './CartProductMeta';
import { PriceTag } from './PriceTag';
import { QuantitySelect } from './QuantitySelect';

type CartItemProps = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  imageUrl: string;
  displayRemoveButton?: boolean;
};

export const CartItem = ({
  id,
  name,
  description,
  quantity,
  imageUrl,
  price,
  displayRemoveButton = true,
}: CartItemProps) => {
  const { removeItem } = useCart();

  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      justify='space-between'
      align='center'
    >
      <CartProductMeta
        onChangeQuantity={() => console.group('changed')}
        quantity={quantity}
        name={name}
        description={description}
        image={imageUrl}
      />

      {/* Desktop */}
      <Flex
        width={{ md: '40%' }}
        mt={{ md: '-4rem' }}
        justify='flex-end'
        display={{ base: 'none', md: 'flex' }}
      >
        <PriceTag price={price} currency='CAD' />
        {displayRemoveButton ? (
          <Button
            onClick={() => removeItem(id)}
            variant='ghost'
            colorScheme='red'
          >
            <DeleteIcon />
          </Button>
        ) : null}
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
            // onChangeQuantity?.(+e.currentTarget.value);
            console.log('quantity changed');
          }}
        />
        <PriceTag price={price} currency='CAD' />
      </Flex>
    </Flex>
  );
};
