'use client';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const STORE_VIDEOS_QUERY = gql`
  query StoreVideosQuery {
    store(where: { slug: "london" }) {
      videoUrl
      videoUrl2
      videoUrl3
    }
  }
`;

const extractYouTubeId = (url: string): string => {
  if (!url) return '';

  // Handle different YouTube URL formats including Shorts
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/, // Standard watch URL
    /(?:youtu\.be\/)([^&\s]+)/, // Short URL
    /(?:youtube\.com\/embed\/)([^&\s]+)/, // Embed URL
    /(?:youtube\.com\/shorts\/)([^&\s]+)/, // Shorts URL
    /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }

  return url; // Return as-is if no pattern matches
};

export default function WatchSection() {
  const { data, loading, error } = useQuery(STORE_VIDEOS_QUERY, {
    fetchPolicy: 'cache-first',
  });

  const videos = [
    { id: extractYouTubeId(data?.store?.videoUrl || ''), title: 'Cake Making Process' },
    { id: extractYouTubeId(data?.store?.videoUrl2 || ''), title: 'Behind the Scenes' },
    { id: extractYouTubeId(data?.store?.videoUrl3 || ''), title: 'Custom Cake Tutorial' },
  ].filter(video => video.id); // Filter out empty video IDs

  if (loading) return null;
  if (error) return null;
  if (videos.length === 0) return null;

  return (
    <section
      id="watch"
      style={{
        background: '#F9D7DC',
        borderBlock: '1px solid #F0DDE2',
      }}
    >
      <div
        style={{
          maxWidth: '1160px',
          margin: '0 auto',
          padding: 'clamp(48px, 7vw, 84px) clamp(20px, 5vw, 56px)',
        }}
      >
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
              Watch my story
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                margin: 0,
                lineHeight: 1.1,
                color: '#2E9FBE',
              }}
            >
              Cakes in the making
            </h2>
          </div>
          <a
            href="https://www.youtube.com/@TiaBakery2019"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              color: '#DB6E93',
              fontWeight: 700,
              fontSize: '15px',
            }}
          >
            See all reels →
          </a>
        </div>

        {/* Video Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(16px, 2.5vw, 24px)',
          }}
        >
          {videos.map((video, index) => (
            <div
              key={index}
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 14px 30px -20px rgba(150, 90, 110, 0.55)',
                background: '#FFF',
              }}
            >
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
