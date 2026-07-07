'use client';

import { gql } from '@apollo/client';
import { useSuspenseQuery } from '@apollo/client/react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getOptimizedImage } from '@/lib/imageUtils';
import { AddToCartButton } from '../../../ui/AddToCartButton';

const query = gql`
  query PageProduct($slug: String) {
    product(where: { slug: $slug }) {
      id
      name
      slug
      image
      description {
        html
        text
      }
      sizes {
        id
        name
        price
      }
      price
      categories {
        id
        name
        slug
      }
    }
  }
`;

export function ProductClientPage({ params }: { params: { slug: string } }) {
  const { data } = useSuspenseQuery(query, {
    variables: { slug: params.slug },
    fetchPolicy: 'cache-first',
  });

  const { product } = data as any;

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(product.sizes?.[0]?.name || '6"');

  const price =
    product.sizes?.find((s: any) => s.name === size)?.price ??
    product.price ??
    30;

  const optimizedImage = getOptimizedImage(product.image.public_id, 672, 672);
  const category = product.categories?.[0];

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <main
      style={{
        maxWidth: '1160px',
        margin: '0 auto',
        padding: 'clamp(32px, 5vw, 64px) clamp(20px, 5vw, 56px)',
      }}
    >
      {/* Breadcrumb */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 'clamp(28px, 4vw, 40px)',
          fontSize: '15px',
        }}
      >
        <Link href="/" style={{ color: '#8A776E', textDecoration: 'none' }}>
          Home
        </Link>
        <span style={{ color: '#8A776E', padding: '0 8px' }}>/</span>
        {category && (
          <>
            <Link href={`/shop/${category.slug}`} style={{ color: '#8A776E', textDecoration: 'none' }}>
              {category.name}
            </Link>
            <span style={{ color: '#8A776E', padding: '0 8px' }}>/</span>
          </>
        )}
        <span style={{ color: '#DB6E93', fontWeight: 600 }}>{product.name}</span>
      </nav>

      {/* Product Content - 2 Column Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(32px, 5vw, 64px)',
          alignItems: 'start',
        }}
      >
        {/* Left Column - Image */}
        <div>
          <Image
            src={optimizedImage}
            alt={product.name}
            width={672}
            height={672}
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              borderRadius: '22px',
              boxShadow: '0 20px 40px -20px rgba(150, 90, 110, 0.3)',
            }}
            priority
          />
        </div>

        {/* Right Column - Product Details */}
        <div>
          {/* Category Label */}
          {category && (
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
              {category.name}
            </div>
          )}

          {/* Product Title */}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              margin: '0 0 20px',
              lineHeight: 1.1,
              color: '#41B9D2',
            }}
          >
            {product.name}
          </h1>

          {/* Description */}
          {product.description?.html && (
            <div
              dangerouslySetInnerHTML={{ __html: product.description.html }}
              style={{
                fontSize: '16px',
                lineHeight: 1.6,
                color: '#7E6B62',
                marginBottom: '32px',
              }}
            />
          )}

          {/* Quantity and Size Selection */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '20px',
              marginBottom: '24px',
            }}
          >
            {/* Quantity */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#7E6B62',
                  marginBottom: '8px',
                }}
              >
                Quantity
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleDecrement}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#41B9D2',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#2E9FBE')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#41B9D2')}
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: '64px',
                    height: '44px',
                    borderRadius: '8px',
                    border: '1.5px solid #F3DCE3',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#7E6B62',
                  }}
                  min="1"
                />
                <button
                  onClick={handleIncrement}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#41B9D2',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#2E9FBE')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#41B9D2')}
                >
                  +
                </button>
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div>
                <label
                  htmlFor="size-select"
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#7E6B62',
                    marginBottom: '8px',
                  }}
                >
                  Select size
                </label>
                <select
                  id="size-select"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  style={{
                    width: '100%',
                    height: '44px',
                    borderRadius: '8px',
                    border: '1.5px solid #F3DCE3',
                    padding: '0 12px',
                    fontSize: '16px',
                    color: '#7E6B62',
                    background: 'white',
                    cursor: 'pointer',
                  }}
                >
                  {product.sizes.map((s: any) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Add to Quote Button */}
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price,
              image: optimizedImage,
              slug: product.slug,
              size,
            }}
            quantity={quantity}
            style={{
              width: '100%',
              maxWidth: '400px',
              marginBottom: '24px',
            }}
          />

          {/* Back Link */}
          {category && (
            <Link
              href={`/shop/${category.slug}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#8A776E',
                textDecoration: 'underline',
                fontSize: '15px',
                fontWeight: 500,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#41B9D2')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#8A776E')}
            >
              ← Back to {category.name}
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
