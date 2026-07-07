'use client';

import { use } from 'react';
import { gql } from '@apollo/client';
import { useSuspenseQuery } from '@apollo/client/react';
import Link from 'next/link';
import { ProductCard } from '../../../components/shop/ProductCard';

const query = gql`
  query CategoryPage($slug: String) {
    category(where: { slug: $slug }) {
      name
      id
      products(first: 100) {
        id
        name
        slug
        image
      }
    }
  }
`;

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const { data } = useSuspenseQuery(query, {
    fetchPolicy: 'cache-first',
    variables: { slug },
  });

  const { category } = data as any;

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
          marginBottom: 'clamp(20px, 3vw, 32px)',
          fontSize: '15px',
        }}
      >
        <Link href="/" style={{ color: '#8A776E', textDecoration: 'none' }}>
          Home
        </Link>
        <span style={{ color: '#8A776E', padding: '0 8px' }}>/</span>
        <Link href="/shop" style={{ color: '#8A776E', textDecoration: 'none' }}>
          Shop
        </Link>
        <span style={{ color: '#8A776E', padding: '0 8px' }}>/</span>
        <span style={{ color: '#DB6E93', fontWeight: 600 }}>{category.name}</span>
      </nav>

      {/* Page Title */}
      <h1
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 600,
          fontSize: 'clamp(2rem, 4.5vw, 3.1rem)',
          margin: '0 0 clamp(32px, 4vw, 48px)',
          lineHeight: 1.1,
          color: '#41B9D2',
        }}
      >
        {category.name}
      </h1>

      {/* Products Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 'clamp(20px, 3vw, 32px)',
          marginBottom: 'clamp(40px, 5vw, 60px)',
        }}
      >
        {category.products.map((product: any) => (
          <ProductCard
            key={product.id}
            name={product.name}
            image={product.image.public_id}
            price={product.price}
            slug={product.slug}
            id={product.id}
          />
        ))}
      </div>

      {/* Order CTA Button */}
      <div style={{ textAlign: 'center' }}>
        <Link
          href="/#quote"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            background: '#41B9D2',
            color: '#FFF',
            padding: '15px 32px',
            borderRadius: '999px',
            fontSize: '16px',
            fontWeight: 700,
            boxShadow: '0 10px 22px -10px rgba(65, 185, 210, 0.9)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#2E9FBE';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 15px 30px -15px rgba(65, 185, 210, 0.95)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#41B9D2';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 22px -10px rgba(65, 185, 210, 0.9)';
          }}
        >
          Order this style →
        </Link>
      </div>
    </main>
  );
}
