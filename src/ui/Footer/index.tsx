'use client';

import { gql, useQuery } from '@apollo/client';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const query = gql`
  query StoreQuery {
    store(where: { slug: "london" }) {
      email
      facebook
      address
      instagram
      phone
      youtube
    }
  }
`;

export function Footer() {
  const { data, loading, error } = useQuery(query, {
    fetchPolicy: 'cache-first',
  });

  if (loading) return null;
  if (error) return null;

  const { store } = data as any;

  return (
    <footer style={{ background: '#F9D7DC', padding: 'clamp(48px, 6vw, 72px) clamp(20px, 5vw, 56px) clamp(32px, 4vw, 48px)' }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        {/* Main Content - 3 Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(28px, 5vw, 64px)',
            alignItems: 'start',
            marginBottom: 'clamp(32px, 4vw, 48px)',
          }}
        >
          {/* Left Column - Logo & Tagline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: '#41B9D2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Image src="/new_logo.png" alt="Tia Bakery Logo" width={52} height={52} style={{ objectFit: 'cover' }} />
              </div>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '30px',
                  fontWeight: 600,
                  color: '#2E9FBE',
                  letterSpacing: '0.5px',
                }}
              >
                Tia Bakery
              </span>
            </div>
            <p style={{ fontSize: '15px', color: '#7E6B62', lineHeight: 1.6, margin: 0 }}>
              Custom cakes crafted with love in London, Ontario — one celebration at a time.
            </p>
          </div>

          {/* Center Column - Contact */}
          <div>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: '#41B9D2',
                marginBottom: '16px',
              }}
            >
              CONTACT ME
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a
                href={`tel:${store.phone.replace(/\s/g, '')}`}
                style={{ color: '#7E6B62', textDecoration: 'none', fontSize: '15px' }}
              >
                {store.phone}
              </a>
              <a href={`mailto:${store.email}`} style={{ color: '#7E6B62', textDecoration: 'none', fontSize: '15px' }}>
                {store.email}
              </a>
              <p style={{ fontSize: '15px', color: '#7E6B62', margin: 0 }}>{store.address}</p>
            </div>
          </div>

          {/* Right Column - Social & CTA */}
          <div>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: '#41B9D2',
                marginBottom: '16px',
              }}
            >
              FOLLOW ALONG
            </p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <a
                href={store.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#41B9D2',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                }}
              >
                <FaFacebook size={22} />
              </a>
              <a
                href={store.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#41B9D2',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                }}
              >
                <FaInstagram size={22} />
              </a>
              <a
                href={store.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#41B9D2',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                }}
              >
                <FaYoutube size={22} />
              </a>
            </div>
            <a
              href="#quote"
              style={{
                color: '#DB6E93',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 700,
              }}
            >
              Order your cake →
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: '1px solid #F0DDE2',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <p style={{ fontSize: '13px', color: '#8A776E', margin: 0 }}>
            © {new Date().getFullYear()} Tia Bakery. All rights reserved.
          </p>
          <p style={{ fontSize: '13px', color: '#8A776E', margin: 0 }}>Made with love in London, Ontario</p>
        </div>
      </div>
    </footer>
  );
}
