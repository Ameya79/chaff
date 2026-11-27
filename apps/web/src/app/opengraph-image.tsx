import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Chaff — Paste the repo. Keep what is yours.';
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
          backgroundColor: '#F1F2EC',
          color: '#141A15',
          padding: '64px 72px',
          border: '1px solid rgba(20, 26, 21, 0.10)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '20px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#2E6648',
            fontWeight: 600,
          }}
        >
          <span>CHAFF PROTOCOL · LEVELS 1–3</span>
          <span style={{ color: '#4F5A51' }}>72 RULES</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '940px' }}>
          <div style={{ fontSize: '82px', fontWeight: 600, lineHeight: 1.04, letterSpacing: '-0.04em' }}>
            Strip the slop. Keep your craft.
          </div>
          <div style={{ fontSize: '28px', color: '#4F5A51', lineHeight: 1.4 }}>
            Paste the repo link in chat. Tailored around your project, locked identity, and verified budgets.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(20, 26, 21, 0.12)',
            paddingTop: '24px',
            fontSize: '22px',
          }}
        >
          <span style={{ color: '#1F6843', fontWeight: 600 }}>Identity Lock · Tailored Questions</span>
          <span style={{ color: '#141A15' }}>github.com/Ameya79/chaff</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
