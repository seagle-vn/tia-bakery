import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends Omit<ChakraButtonProps, 'variant' | 'leftIcon' | 'rightIcon'> {
  variant?: ButtonVariant;
  loading?: boolean;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      loading = false,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'primary':
          return {
            bg: 'blue.400',
            color: 'white',
            _hover: { bg: 'blue.500', transform: 'translateY(-2px)', shadow: 'md' },
            _active: { bg: 'blue.600', transform: 'translateY(0)' },
          };
        case 'secondary':
          return {
            bg: 'transparent',
            color: 'pink.500',
            borderWidth: '2px',
            borderColor: 'pink.500',
            _hover: { bg: 'pink.50', transform: 'translateY(-2px)', shadow: 'sm' },
            _active: { bg: 'pink.100', transform: 'translateY(0)' },
          };
        case 'ghost':
          return {
            bg: 'transparent',
            color: 'text.dark',
            _hover: { bg: 'bg.card' },
            _active: { bg: 'bg.secondary' },
          };
        default:
          return {};
      }
    };

    return (
      <ChakraButton
        ref={ref}
        borderRadius='full'
        fontWeight='600'
        isLoading={loading}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        {...getVariantStyles()}
        {...props}
      >
        {children}
      </ChakraButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;
