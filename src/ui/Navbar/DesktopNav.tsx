import { FunctionComponent, useRef } from 'react';
import { BsCart3 } from 'react-icons/bs';
import { useCart } from 'react-use-cart';

export const DesktopNav: FunctionComponent<{ onCartOpen: () => void }> = ({
  onCartOpen,
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const { totalItems } = useCart();

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav
      style={{
        display: 'none',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#FBF6EC',
        borderBottom: '1px solid #F0DDE2',
        width: '100%',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '18px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '32px',
        }}
      >
        <style>{`
          @media (min-width: 768px) {
            nav { display: block !important; }
          }
        `}</style>

        {/* Left - Logo & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
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
              }}
            >
              <img
                src="/new_logo.png"
                alt="Tia Bakery Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </a>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '28px',
              fontWeight: 600,
              color: '#2E9FBE',
              letterSpacing: '0.5px',
            }}
          >
            Tia Bakery
          </span>
        </div>

        {/* Center & Right - Navigation Links */}
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
          <a
            href="#menu"
            onClick={(e) => handleSmoothScroll(e, '#menu')}
            style={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#7E6B62',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#41B9D2')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#7E6B62')}
          >
            Menu
          </a>
          <a
            href="#gallery"
            onClick={(e) => handleSmoothScroll(e, '#gallery')}
            style={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#7E6B62',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#41B9D2')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#7E6B62')}
          >
            Gallery
          </a>
          <a
            href="#about"
            onClick={(e) => handleSmoothScroll(e, '#about')}
            style={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#7E6B62',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#41B9D2')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#7E6B62')}
          >
            About
          </a>
          <a
            href="#faq"
            onClick={(e) => handleSmoothScroll(e, '#faq')}
            style={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#7E6B62',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#41B9D2')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#7E6B62')}
          >
            FAQ
          </a>
          <a
            href="#quote"
            onClick={(e) => handleSmoothScroll(e, '#quote')}
            style={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#7E6B62',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#41B9D2')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#7E6B62')}
          >
            Contact
          </a>

          {/* CTA Button */}
          <a
            href="#quote"
            onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector('#quote');
              if (element) {
                const headerOffset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
              }
            }}
            style={{
              background: '#41B9D2',
              color: '#FFF',
              padding: '15px 30px',
              borderRadius: '999px',
              fontSize: '16px',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.2s',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 10px 22px -10px rgba(65, 185, 210, 0.9)',
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
            Order Your Cake
          </a>
        </div>
      </div>
    </nav>
  );
};
