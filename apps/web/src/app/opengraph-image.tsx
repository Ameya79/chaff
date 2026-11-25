import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Chaff — Archival Design Audit & Level 3 Enforcement Toolkit';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#FBF7EE',
          color: '#16120E',
          padding: '56px 64px',
          border: '12px solid #16120E',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #DDD4C3',
            paddingBottom: '20px',
            fontSize: '20px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#9E3308',
            fontWeight: 700,
          }}
        >
          <span>CHAFF PROTOCOL V0.1</span>
          <span>LEVEL 1 · LEVEL 2 · LEVEL 3</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '980px' }}>
          <div style={{ fontSize: '74px', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            Keep the grain. Winnow the slop.
          </div>
          <div style={{ fontSize: '28px', color: '#544B40', lineHeight: 1.4 }}>
            Audits rendered UI against 72 rules, locks deliberate brand identity, and enforces strict mobile and WebGL performance gates.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '2px solid #DDD4C3',
            paddingTop: '24px',
            fontSize: '22px',
          }}
        >
          <span style={{ color: '#354A21', fontWeight: 700 }}>Identity Lock: Enforced (#6D28D9 Preserved)</span>
          <span style={{ color: '#16120E', fontWeight: 600 }}>npx chaff init --level 3</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
