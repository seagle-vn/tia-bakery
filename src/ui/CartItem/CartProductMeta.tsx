import {
  Box,
  Image,
  Stack,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { QuantitySelect } from './QuantitySelect';

export type CartProductMetaProps = {
  name: string;
  description: string;
  image: string;
  onChangeQuantity?: (quantity: number) => void;
  quantity: number;
};

export const CartProductMeta = ({
  image,
  name,
  description,
  onChangeQuantity,
  quantity,
}: CartProductMetaProps) => {
  return (
    <Stack direction='row' spacing='5' width='full'>
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
      <Box pt='4'>
        <Stack spacing='2'>
          <Text fontWeight='medium'>{name}</Text>
          <Text color={mode('gray.600', 'gray.400')} fontSize='sm'>
            {description}
          </Text>
          <QuantitySelect
            value={quantity}
            onChange={(e) => {
              onChangeQuantity?.(+e.currentTarget.value);
            }}
          />
        </Stack>
      </Box>
    </Stack>
  );
};
