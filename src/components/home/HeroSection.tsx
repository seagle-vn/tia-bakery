'use client';

import { Image } from '@chakra-ui/next-js';
import Link from 'next/link';
import { getOptimizedImage } from '@/lib/imageUtils';

interface HeroSectionProps {
  heroImage: string;
  heroTitle: string;
  heroText: string;
}

export default function HeroSection({
  heroImage,
  heroTitle,
  heroText,
}: HeroSectionProps) {
  const optimizedImage = getOptimizedImage(heroImage, 900, 600);

  return (
    <section
      id="home"
      style={{
        maxWidth: '1160px',
        margin: '0 auto',
        padding: 'clamp(32px, 6vw, 72px) clamp(20px, 5vw, 56px)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(28px, 5vw, 64px)',
          alignItems: 'center',
        }}
      >
        {/* Left Column - Text */}
        <div style={{ animation: 'tiaUp 0.7s ease both' }}>
          <div
            style={{
              display: 'inline-block',
              fontSize: '13px',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              color: '#41B9D2',
              fontWeight: 700,
              marginBottom: '18px',
            }}
          >
            London, Ontario
          </div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: 'clamp(2.6rem, 6vw, 4.3rem)',
              lineHeight: 1.05,
              margin: '0 0 20px',
              color: '#2E9FBE',
            }}
          >
            {heroTitle}
          </h1>
          <p
            style={{
              fontSize: 'clamp(16px, 1.9vw, 19px)',
              lineHeight: 1.6,
              color: '#7E6B62',
              maxWidth: '48ch',
              margin: '0 0 30px',
            }}
          >
            {heroText}
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              href="#quote"
              style={{
                textDecoration: 'none',
                background: '#41B9D2',
                color: '#FFF',
                padding: '15px 30px',
                borderRadius: '999px',
                fontSize: '16px',
                fontWeight: 700,
                boxShadow: '0 10px 22px -10px rgba(65, 185, 210, 0.9)',
              }}
            >
              Order Your Cake
            </Link>
            <Link
              href="#menu"
              style={{
                textDecoration: 'none',
                background: 'transparent',
                color: '#DB6E93',
                padding: '15px 28px',
                borderRadius: '999px',
                fontSize: '16px',
                fontWeight: 700,
                border: '1.5px solid #F1B9C6',
              }}
            >
              Browse the Menu
            </Link>
          </div>
        </div>

        {/* Right Column - Image */}
        <div style={{ animation: 'tiaUp 0.9s ease both' }}>
          <Image
            src={optimizedImage}
            alt="Signature cake"
            width={900}
            height={600}
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              aspectRatio: '3/2',
              borderRadius: '26px',
              boxShadow: '0 24px 60px -28px rgba(150, 90, 110, 0.55)',
              objectFit: 'cover',
            }}
            priority
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes tiaUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
