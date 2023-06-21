'use client';

import { Button, ButtonProps } from '@chakra-ui/react';
import { FunctionComponent, useState } from 'react';
import { useCart } from 'react-use-cart';

type AddToCartButtonProps = ButtonProps & {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    size: string;
  };
  quantity: number;
};
export const AddToCartButton: FunctionComponent<AddToCartButtonProps> = ({
  product,
  quantity,
  ...props
}) => {
  const { addItem, items, updateItemQuantity } = useCart();
  const [loading, setLoading] = useState(false);

  function handleClick() {
    setLoading(true);
    const item = items.find((i) => i.id === product.id);
    if (item) {
      updateItemQuantity(product.id, (item.quantity ?? 0) + quantity);
    } else {
      addItem(product, quantity);
    }
    setTimeout(() => setLoading(false), 200);
  }

  return (
    <Button
      {...props}
      variant='solid'
      colorScheme='pink'
      onClick={handleClick}
      isLoading={loading}
    >
      Add to cart
    </Button>
  );
};
