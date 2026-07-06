'use client';

import { getOptimizedImage } from '@/lib/imageUtils';
import { Image } from '@chakra-ui/next-js';
import { Spinner } from '@chakra-ui/react';
import Link from 'next/link';
import BuildYourCakeCard from './BuildYourCakeCard';

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
  cakeBuilder?: {
    title: string;
    subtitle: string;
    cakeTypes: Array<{
      id: string;
      name: string;
      cakeFlavours: Array<{ id: string; name: string }>;
      frostingFlavours: Array<{ id: string; name: string }>;
      fillingOptions: Array<{ id: string; name: string }>;
      toppingOptions: Array<{ id: string; name: string }>;
    }>;
  } | null;
  cakeBuilderLoading?: boolean;
}

export default function MenuSection({ products, cakeBuilder, cakeBuilderLoading }: MenuSectionProps) {
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
          alignItems: 'stretch',
        }}
      >
        {signatureCakes.map((cake) => {
          const optimizedImage = getOptimizedImage(cake.image.public_id, 672, 378);

          return (
            <Link key={cake.id} href={`/products/${cake.slug}`} style={{ textDecoration: 'none', display: 'flex' }}>
              <div
                style={{
                  background: '#FCF8EF',
                  border: '1.5px solid #F3DCE3',
                  borderRadius: '22px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                <Image
                  src={optimizedImage}
                  alt={cake.name}
                  width={672}
                  height={378}
                  style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: '16/9', objectFit: 'cover' }}
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
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {cake.description.text.replace(/\\n/g, ' ')}
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
          alignItems: 'stretch',
        }}
      >
        {treats.map((treat) => {
          const optimizedImage = getOptimizedImage(treat.image.public_id, 672, 378);

          return (
            <Link key={treat.id} href={`/products/${treat.slug}`} style={{ textDecoration: 'none', display: 'flex' }}>
              <div
                style={{
                  background: '#FCF8EF',
                  border: '1.5px solid #F3DCE3',
                  borderRadius: '22px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                <Image
                  src={optimizedImage}
                  alt={treat.name}
                  width={672}
                  height={378}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '16/9',
                    objectFit: 'cover',
                  }}
                  loading="lazy"
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
                      {treat.name}
                    </span>
                  </div>
                  {treat.description?.text && (
                    <p
                      style={{
                        fontSize: '14px',
                        lineHeight: 1.5,
                        color: '#8A776E',
                        margin: '0 0 16px',
                        textAlign: 'center',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {treat.description.text.replace(/\\n/g, ' ')}
                    </p>
                  )}
                  {treat.sizes && treat.sizes.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: 'auto' }}>
                      {treat.sizes.map((size, index) => (
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

      {/* Build Your Cake - Full Width Section */}
      {(cakeBuilderLoading || (cakeBuilder && cakeBuilder.cakeTypes && cakeBuilder.cakeTypes.length > 0)) && (
        <div
          style={{
            marginLeft: 'calc(-1 * clamp(20px, 5vw, 56px))',
            marginRight: 'calc(-1 * clamp(20px, 5vw, 56px))',
            background: 'linear-gradient(to bottom, #FBF6EC 0%, #F9F3E8 100%)',
            padding: 'clamp(40px, 6vw, 70px) clamp(20px, 5vw, 56px)',
          }}
        >
          <div
            style={{
              maxWidth: '1340px',
              margin: '0 auto',
            }}
          >
            {cakeBuilderLoading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '300px',
                }}
              >
                <Spinner size="xl" color="#41B9D2" thickness="4px" />
              </div>
            ) : (
              <>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 600,
                    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                    color: '#D4859E',
                    margin: '0 0 16px',
                    textAlign: 'center',
                  }}
                >
                  {cakeBuilder?.title}
                </h3>
                {cakeBuilder?.subtitle && (
                  <p
                    style={{
                      fontSize: 'clamp(14px, 1.8vw, 16px)',
                      color: '#6D5F5A',
                      textAlign: 'center',
                      maxWidth: '740px',
                      margin: '0 auto 40px',
                      lineHeight: 1.6,
                    }}
                  >
                    {cakeBuilder.subtitle}
                  </p>
                )}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 'clamp(28px, 3.5vw, 48px)',
                  }}
                  className="cake-builder-grid"
                >
                  {cakeBuilder?.cakeTypes.map((cakeType) => (
                    <BuildYourCakeCard key={cakeType.id} cakeType={cakeType} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
