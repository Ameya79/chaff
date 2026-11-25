import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Chaff — Obsidian Atelier & Level 3 Gate';
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
          backgroundColor: '#09090B',
          color: '#F4F1EA',
          padding: '64px 72px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '20px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#F2713A',
            fontWeight: 600,
          }}
        >
          <span>CHAFF · LEVEL 3</span>
          <span style={{ color: '#9D968B' }}>72 RULES</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '940px' }}>
          <div style={{ fontSize: '84px', fontWeight: 500, lineHeight: 1.0, letterSpacing: '-0.04em' }}>
            Winnow the slop. Keep the grain.
          </div>
          <div style={{ fontSize: '28px', color: '#9D968B', lineHeight: 1.35 }}>
            Audits rendered UI, locks brand identity, and enforces Level 3 WebGL budgets.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(244, 241, 234, 0.12)',
            paddingTop: '24px',
            fontSize: '22px',
          }}
        >
          <span style={{ color: '#7DC885', fontWeight: 600 }}>Identity Lock · #A78BFA Preserved</span>
          <span style={{ color: '#F4F1EA' }}>npx chaff init --level 3</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
