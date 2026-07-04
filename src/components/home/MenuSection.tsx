'use client';

import { Image } from '@chakra-ui/next-js';
import Link from 'next/link';
import { getOptimizedImage } from '@/lib/imageUtils';

interface Product {
  id: string;
  name: string;
  slug: string;
  image: { public_id: string };
  description?: { text: string };
  sizes?: Array<{ name: string; price: number }>;
  category?: string;
}

interface MenuSectionProps {
  products: Product[];
}

export default function MenuSection({ products }: MenuSectionProps) {
  // Filter products by category
  const signatureCakes = products.filter((p) => p.category === 'Signature Cakes').slice(0, 3);
  const treats = products.filter((p) => p.category === 'Treats').slice(0, 4);

  return (
    <section
      id="menu"
      style={{
        maxWidth: '1160px',
        margin: '0 auto',
        padding: 'clamp(48px, 7vw, 90px) clamp(20px, 5vw, 56px)',
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(26px, 3.5vw, 40px)' }}>
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
          The Menu
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
          Cakes for every celebration
        </h2>
      </div>

      {/* Pricing Disclaimer */}
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto clamp(34px, 4.5vw, 52px)',
          background: '#F9D7DC',
          borderRadius: '14px',
          padding: '13px 22px',
          textAlign: 'center',
          fontSize: '14.5px',
          fontWeight: 600,
          color: '#2E9FBE',
        }}
      >
        Listed prices are <strong>starting prices</strong> — the final price varies with your
        custom design.
      </div>

      {/* Signature Cakes */}
      <h3
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 600,
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          color: '#DB6E93',
          margin: '0 0 20px',
          textAlign: 'center',
        }}
      >
        Signature Cakes
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(18px, 2.4vw, 26px)',
        }}
      >
        {signatureCakes.map((cake) => {
          const optimizedImage = getOptimizedImage(cake.image.public_id, 672, 504);

          return (
            <Link key={cake.id} href={`/products/${cake.slug}`} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: '#FCF8EF',
                  border: '1.5px solid #F3DCE3',
                  borderRadius: '22px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Image
                  src={optimizedImage}
                  alt={cake.name}
                  width={672}
                  height={504}
                  style={{ display: 'block', width: '100%', aspectRatio: '4/3', objectFit: 'cover' }}
                />
                <div
                  style={{
                    padding: 'clamp(20px, 2.4vw, 26px)',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      background: '#FBE3EC',
                      border: '2px solid #C24D93',
                      borderRadius: '12px',
                      padding: '9px 14px',
                      textAlign: 'center',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '14px',
                        letterSpacing: '0.8px',
                        color: '#E58699',
                        textTransform: 'uppercase',
                      }}
                    >
                      {cake.name}
                    </span>
                  </div>
                  {cake.description?.text && (
                    <p
                      style={{
                        fontSize: '14px',
                        lineHeight: 1.5,
                        color: '#8A776E',
                        margin: '0 0 16px',
                        textAlign: 'center',
                      }}
                    >
                      {cake.description.text}
                    </p>
                  )}
                  {cake.sizes && cake.sizes.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: 'auto' }}>
                      {cake.sizes.map((size, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent: 'space-between',
                            gap: '12px',
                            padding: '9px 4px',
                            borderBottom: '1px dashed #EFD9E0',
                          }}
                        >
                          <span style={{ fontSize: '15px', fontWeight: 600, color: '#7E6B62' }}>
                            {size.name}
                          </span>
                          <span
                            style={{
                              fontSize: '16px',
                              fontWeight: 700,
                              color: '#41B9D2',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            ${size.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Treats */}
      <h3
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 600,
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          color: '#DB6E93',
          margin: 'clamp(40px, 5vw, 60px) 0 20px',
          textAlign: 'center',
        }}
      >
        Cupcakes & Treats
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'clamp(18px, 2.4vw, 26px)',
        }}
      >
        {treats.map((treat) => {
          const optimizedImage = getOptimizedImage(treat.image.public_id, 460, 460);

          return (
            <Link key={treat.id} href={`/products/${treat.slug}`} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: '#FCF8EF',
                  border: '1.5px solid #F3DCE3',
                  borderRadius: '22px',
                  padding: 'clamp(20px, 2.4vw, 26px)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    background: '#FBE3EC',
                    border: '2px solid #C24D93',
                    borderRadius: '12px',
                    padding: '9px 14px',
                    textAlign: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '14px',
                      letterSpacing: '0.8px',
                      color: '#E58699',
                      textTransform: 'uppercase',
                    }}
                  >
                    {treat.name}
                  </span>
                </div>
                {treat.description?.text && (
                  <p
                    style={{
                      fontSize: '14px',
                      lineHeight: 1.5,
                      color: '#8A776E',
                      margin: '0 0 14px',
                      textAlign: 'center',
                    }}
                  >
                    {treat.description.text}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
