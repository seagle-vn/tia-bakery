'use client';

import { getOptimizedImage } from '@/lib/imageUtils';
import { Image } from '@chakra-ui/next-js';

interface AboutSectionProps {
  aboutImage?: string;
}

export default function AboutSection({ aboutImage }: AboutSectionProps) {
  // You can replace this with your baker's image URL
  const defaultImage = '/new_logo.png';
  const optimizedImage = aboutImage
    ? getOptimizedImage(aboutImage, 600, 900)
    : defaultImage;

  return (
    <section
      id="about"
      style={{
        maxWidth: '1160px',
        margin: '0 auto',
        padding: 'clamp(48px, 7vw, 96px) clamp(20px, 5vw, 56px)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.3fr 1fr',
          gap: 'clamp(28px, 5vw, 64px)',
          alignItems: 'center',
        }}
        className="about-section-grid"
      >
        {/* Left Column - Image */}
        <div
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px -30px rgba(150, 90, 110, 0.55)',
          }}
          className="baker-image-container"
        >
          <Image
            src={optimizedImage}
            alt="Photo of the baker"
            width={600}
            height={900}
            style={{
              display: 'block',
              width: '100%',
              aspectRatio: '2/3',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Right Column - Content */}
        <div>
          <div
            style={{
              fontSize: '13px',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              color: '#41B9D2',
              fontWeight: 700,
              marginBottom: '14px',
            }}
          >
            Meet the baker
          </div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              margin: '0 0 20px',
              lineHeight: 1.12,
              color: '#2E9FBE',
            }}
          >
            Every cake starts with your story
          </h2>
          <p
            style={{
              fontSize: '16.5px',
              lineHeight: 1.7,
              color: '#7E6B62',
              margin: '0 0 16px',
            }}
          >
            Tia Bakery is a home-based cake studio in London, Ontario, creating custom cakes for
            weddings, birthdays, and every celebration in between. Every order is made fresh to
            design — no two cakes alike.
          </p>
          <p
            style={{
              fontSize: '16.5px',
              lineHeight: 1.7,
              color: '#7E6B62',
              margin: '0 0 26px',
            }}
          >
            From delicate sponge cakes with whipping cream to rich golden buttercream creations,
            cupcakes, bouquets, and bento cakes — I&apos;d love to bring your vision to life with care
            and attention to detail.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 'clamp(20px, 4vw, 44px)', flexWrap: 'wrap' }}>
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '38px',
                  fontWeight: 600,
                  color: '#41B9D2',
                  lineHeight: 1,
                }}
              >
                Custom
              </div>
              <div style={{ fontSize: '13.5px', color: '#8A776E', marginTop: '6px' }}>
                Made to design
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '38px',
                  fontWeight: 600,
                  color: '#41B9D2',
                  lineHeight: 1,
                }}
              >
                Fresh
              </div>
              <div style={{ fontSize: '13.5px', color: '#8A776E', marginTop: '6px' }}>
                Baked to order
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '38px',
                  fontWeight: 600,
                  color: '#41B9D2',
                  lineHeight: 1,
                }}
              >
                Local
              </div>
              <div style={{ fontSize: '13.5px', color: '#8A776E', marginTop: '6px' }}>
                London, Ontario
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
