import { FunctionComponent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getOptimizedImage } from '@/lib/imageUtils';

interface ProductCardProps {
  slug: string;
  image: string;
  name: string;
  price: number;
  id: string;
}

export const ProductCard: FunctionComponent<ProductCardProps> = ({
  slug,
  image,
  name,
}) => {
  const optimizedImage = getOptimizedImage(image, 460, 460);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Card */}
      <Link
        href={`/products/${slug}`}
        style={{
          textDecoration: 'none',
          display: 'block',
        }}
      >
        <div
          style={{
            background: '#FCF8EF',
            border: '1.5px solid #F3DCE3',
            borderRadius: '22px',
            overflow: 'hidden',
            aspectRatio: '1/1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 40px -20px rgba(150, 90, 110, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Image
            src={optimizedImage}
            alt={name}
            width={460}
            height={460}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </Link>

      {/* Product Name Link */}
      <Link
        href={`/products/${slug}`}
        style={{
          textDecoration: 'none',
          color: '#41B9D2',
          fontSize: '16px',
          fontWeight: 600,
          textAlign: 'center',
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#2E9FBE';
          e.currentTarget.style.textDecoration = 'underline';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#41B9D2';
          e.currentTarget.style.textDecoration = 'none';
        }}
      >
        {name}
      </Link>
    </div>
  );
};
