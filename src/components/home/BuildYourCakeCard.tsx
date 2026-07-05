'use client';

interface CakeTypeData {
  id: string;
  name: string;
  cakeFlavours: Array<{ id: string; name: string }>;
  frostingFlavours: Array<{ id: string; name: string }>;
  fillingOptions: Array<{ id: string; name: string }>;
  toppingOptions: Array<{ id: string; name: string }>;
}

interface BuildYourCakeCardProps {
  cakeType: CakeTypeData;
}

export default function BuildYourCakeCard({ cakeType }: BuildYourCakeCardProps) {
  return (
    <div
      style={{
        background: '#FAF7F0',
        border: '2px solid #E0A5B8',
        borderRadius: '20px',
        padding: 'clamp(28px, 3.5vw, 40px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(20px, 2.5vw, 28px)',
      }}
    >
      {/* Pink Header Box */}
      <div
        style={{
          background: '#F5E1E9',
          border: '2px solid #D4859E',
          borderRadius: '12px',
          padding: '12px 20px',
          textAlign: 'center',
        }}
      >
        <h4
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            color: '#D4859E',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          {cakeType.name}
        </h4>
      </div>

      {/* Two Column Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(32px, 4vw, 56px)',
        }}
        className="cake-builder-columns"
      >
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 2.5vw, 24px)' }}>
          {/* Cake Flavours */}
          {cakeType.cakeFlavours && cakeType.cakeFlavours.length > 0 && (
            <div>
              <h5
                style={{
                  fontWeight: 600,
                  fontSize: 'clamp(14px, 1.8vw, 16px)',
                  color: '#D4859E',
                  margin: '0 0 10px',
                }}
              >
                Cake flavour
              </h5>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {cakeType.cakeFlavours.map((flavour) => (
                  <li
                    key={flavour.id}
                    style={{
                      fontSize: 'clamp(13px, 1.6vw, 15px)',
                      color: '#6D5F5A',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: '#5AADBB',
                        flexShrink: 0,
                        marginTop: '7px',
                      }}
                    />
                    {flavour.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Filling Options */}
          {cakeType.fillingOptions && cakeType.fillingOptions.length > 0 && (
            <div>
              <h5
                style={{
                  fontWeight: 600,
                  fontSize: 'clamp(14px, 1.8vw, 16px)',
                  color: '#D4859E',
                  margin: '0 0 10px',
                }}
              >
                Filling (extra fee)
              </h5>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {cakeType.fillingOptions.map((filling) => (
                  <li
                    key={filling.id}
                    style={{
                      fontSize: 'clamp(13px, 1.6vw, 15px)',
                      color: '#6D5F5A',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: '#5AADBB',
                        flexShrink: 0,
                        marginTop: '7px',
                      }}
                    />
                    {filling.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 2.5vw, 24px)' }}>
          {/* Frosting Flavours */}
          {cakeType.frostingFlavours && cakeType.frostingFlavours.length > 0 && (
            <div>
              <h5
                style={{
                  fontWeight: 600,
                  fontSize: 'clamp(14px, 1.8vw, 16px)',
                  color: '#D4859E',
                  margin: '0 0 10px',
                }}
              >
                Frosting flavour
              </h5>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {cakeType.frostingFlavours.map((flavour) => (
                  <li
                    key={flavour.id}
                    style={{
                      fontSize: 'clamp(13px, 1.6vw, 15px)',
                      color: '#6D5F5A',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: '#5AADBB',
                        flexShrink: 0,
                        marginTop: '7px',
                      }}
                    />
                    {flavour.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Topping Options */}
          {cakeType.toppingOptions && cakeType.toppingOptions.length > 0 && (
            <div>
              <h5
                style={{
                  fontWeight: 600,
                  fontSize: 'clamp(14px, 1.8vw, 16px)',
                  color: '#D4859E',
                  margin: '0 0 10px',
                }}
              >
                Topping (extra fee)
              </h5>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {cakeType.toppingOptions.map((topping) => (
                  <li
                    key={topping.id}
                    style={{
                      fontSize: 'clamp(13px, 1.6vw, 15px)',
                      color: '#6D5F5A',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: '#5AADBB',
                        flexShrink: 0,
                        marginTop: '7px',
                      }}
                    />
                    {topping.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
