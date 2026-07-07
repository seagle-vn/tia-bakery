import { Badge as ChakraBadge, BadgeProps as ChakraBadgeProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export type BadgeColor = 'pink' | 'blue' | 'neutral';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends Omit<ChakraBadgeProps, 'colorScheme' | 'variant'> {
  label: string;
  color?: BadgeColor;
  size?: BadgeSize;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ label, color = 'pink', size = 'md', ...props }, ref) => {
    const getColorStyles = () => {
      switch (color) {
        case 'pink':
          return { bg: 'pink.100', color: 'pink.600', borderColor: 'pink.600' };
        case 'blue':
          return { bg: 'blue.50', color: 'blue.600', borderColor: 'blue.400' };
        case 'neutral':
          return { bg: 'bg.card', color: 'text.dark', borderColor: 'border.medium' };
        default:
          return {};
      }
    };

    return (
      <ChakraBadge
        ref={ref}
        px={size === 'sm' ? 2 : 3}
        py={size === 'sm' ? 0.5 : 1}
        fontSize={size === 'sm' ? 'xs' : 'sm'}
        fontWeight='semibold'
        textTransform='uppercase'
        letterSpacing='wider'
        borderRadius='xl'
        borderWidth='2px'
        {...getColorStyles()}
        {...props}
      >
        {label}
      </ChakraBadge>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
