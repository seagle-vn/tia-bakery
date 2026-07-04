import { Box, BoxProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export interface CardProps extends BoxProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      padding = 'md',
      hover = false,
      shadow = 'none',
      children,
      ...props
    },
    ref
  ) => {
    const paddingMap = {
      none: 0,
      sm: 4,
      md: 6,
      lg: 8,
    };

    return (
      <Box
        ref={ref}
        bg='bg.card'
        borderWidth='1.5px'
        borderColor='border.medium'
        borderRadius='22px'
        p={paddingMap[padding]}
        boxShadow={shadow}
        transition='all 0.2s'
        _hover={
          hover
            ? {
                transform: 'translateY(-4px)',
                boxShadow: 'lg',
              }
            : undefined
        }
        cursor={hover ? 'pointer' : 'default'}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

Card.displayName = 'Card';

export default Card;
