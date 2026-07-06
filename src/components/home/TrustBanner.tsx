export default function TrustBanner() {
  return (
    <div
      style={{
        borderBlock: '1px solid #F0DDE2',
        background: '#F9D7DC',
      }}
    >
      <div
        style={{
          maxWidth: '100%',
          margin: '0 auto',
          padding: '16px clamp(20px, 5vw, 56px)',
          display: 'flex',
          columnGap: 'clamp(10px, 2.4vw, 48px)',
          rowGap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(13px, 1.6vw, 21px)',
          color: '#2E9FBE',
        }}
      >
        <span>Made fresh to order</span>
        <span style={{ color: '#EBA8B6' }}>•</span>
        <span>Custom designs welcome</span>
        <span style={{ color: '#EBA8B6' }}>•</span>
        <span>Local pickup & delivery</span>
        <span style={{ color: '#EBA8B6' }}>•</span>
        <span>Weddings & celebrations</span>
      </div>
    </div>
  );
}
