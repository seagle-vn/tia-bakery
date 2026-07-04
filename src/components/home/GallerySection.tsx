'use client';

import { Image } from '@chakra-ui/next-js';
import Link from 'next/link';
import { getOptimizedImage } from '@/lib/imageUtils';

interface Product {
  id: string;
  name: string;
  slug: string;
  image: { public_id: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  products: Product[];
}

interface GallerySectionProps {
  categories: Category[];
}

export default function GallerySection({ categories }: GallerySectionProps) {
  return (
    <section
      id="gallery"
      style={{
        background: '#F9D7DC',
        borderBlock: '1px solid #F0DDE2',
      }}
    >
      <div
        style={{
          maxWidth: '1160px',
          margin: '0 auto',
          padding: 'clamp(48px, 7vw, 90px) clamp(20px, 5vw, 56px)',
        }}
      >
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: 'clamp(28px, 4vw, 44px)',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '13px',
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                color: '#41B9D2',
                fontWeight: 700,
                marginBottom: '12px',
              }}
            >
              Gallery
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                fontSize: 'clamp(2rem, 4.5vw, 3.1rem)',
                margin: 0,
                lineHeight: 1.1,
                color: '#2E9FBE',
              }}
            >
              Recent bakes
            </h2>
          </div>
          <Link
            href="#quote"
            style={{
              textDecoration: 'none',
              color: '#DB6E93',
              fontWeight: 700,
              fontSize: '15px',
            }}
          >
            Start your order →
          </Link>
        </div>

        {/* Category Galleries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(34px, 4.5vw, 54px)' }}>
          {categories.map((category) => (
            <CategoryGallery key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryGallery({ category }: { category: Category }) {
  return (
    <div>
      {/* Category Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            color: '#2E9FBE',
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            margin: 0,
          }}
        >
          {category.name}
        </h3>
        <Link
          href={`/shop/${category.slug}`}
          style={{
            textDecoration: 'none',
            color: '#DB6E93',
            fontWeight: 700,
            fontSize: '14px',
            whiteSpace: 'nowrap',
          }}
        >
          See all →
        </Link>
      </div>

      {/* Horizontal Scrolling Grid */}
      <div
        style={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: 'minmax(230px, 1fr)',
          gap: 'clamp(12px, 1.6vw, 18px)',
          overflowX: 'auto',
          paddingBottom: '12px',
          scrollSnapType: 'x mandatory',
        }}
      >
        {category.products.map((product) => {
          const optimizedImage = getOptimizedImage(product.image.public_id, 460, 345);

          return (
            <div key={product.id} style={{ position: 'relative', scrollSnapAlign: 'start' }}>
              <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
                <Image
                  src={optimizedImage}
                  alt={product.name}
                  width={460}
                  height={345}
                  style={{
                    display: 'block',
                    width: '100%',
                    aspectRatio: '4/3',
                    borderRadius: '16px',
                    boxShadow: '0 14px 30px -20px rgba(150, 90, 110, 0.55)',
                    objectFit: 'cover',
                  }}
                  loading="lazy"
                />
                <span
                  style={{
                    position: 'absolute',
                    left: '12px',
                    right: '12px',
                    bottom: '12px',
                    color: '#FFF',
                    fontSize: '14px',
                    fontWeight: 700,
                    lineHeight: 1.25,
                    pointerEvents: 'none',
                    textShadow: '0 1px 8px rgba(0, 0, 0, 0.55)',
                  }}
                >
                  {product.name}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
