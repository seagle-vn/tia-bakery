import {
  Box,
  Image,
  Link,
  Stack,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { useCart } from 'react-use-cart';
import { QuantitySelect } from './QuantitySelect';

export type CartProductMetaProps = {
  name: string;
  description: string;
  image: string;
  quantity: number;
  id: string;
  link: string;
};

export const CartProductMeta = ({
  image,
  name,
  description,
  quantity,
  id,
  link,
}: CartProductMetaProps) => {
  const { updateItemQuantity } = useCart();

  return (
    <Stack direction='row' spacing='5' width='full'>
      <Link href={link}>
        <Image
          rounded='lg'
          width='120px'
          height='120px'
          fit='cover'
          src={image}
          alt={name}
          draggable='false'
          loading='lazy'
        />
      </Link>
      <Box pt='4'>
        <Stack spacing='2'>
          <Text fontWeight='medium'>{name}</Text>
          <Text color={mode('gray.600', 'gray.400')} fontSize='sm'>
            {description}
          </Text>
          <QuantitySelect
            onChange={(value) => {
              updateItemQuantity(id, value);
            }}
            defaultValue={quantity}
          />
        </Stack>
      </Box>
    </Stack>
  );
};
