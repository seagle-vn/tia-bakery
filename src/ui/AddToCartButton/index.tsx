'use client';

import { Button, ButtonProps, useToast } from '@chakra-ui/react';
import { FunctionComponent, useState } from 'react';
import { useCart } from 'react-use-cart';

type AddToCartButtonProps = ButtonProps & {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    size: string;
    slug: string;
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
  const toast = useToast();

  function handleClick() {
    setLoading(true);
    const item = items.find((i) => i.id === product.id);
    if (item) {
      updateItemQuantity(product.id, (item.quantity ?? 0) + quantity);
    } else {
      // Add product URL to cart item
      const productWithUrl = {
        ...product,
        product_url: `https://www.tiabakery.ca/products/${product.slug}`,
      };
      addItem(productWithUrl, quantity);
    }

    toast({
      title: 'Added to quote',
      description: `${product.name} has been added to your quote.`,
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'bottom-right',
    });

    setTimeout(() => setLoading(false), 200);
  }

  return (
    <Button
      {...props}
      bg='blue.400'
      color='white'
      borderRadius='full'
      fontWeight='600'
      onClick={handleClick}
      isLoading={loading}
      _hover={{
        bg: 'blue.500',
        transform: 'translateY(-2px)',
        shadow: 'md',
      }}
      _active={{
        bg: 'blue.600',
        transform: 'translateY(0)',
      }}
    >
      Add to Quote
    </Button>
  );
};
