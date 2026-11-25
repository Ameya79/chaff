import React from 'react';

interface WinnowScenePosterProps {
  theme?: 'dark' | 'light';
  reason?: string;
}

/**
 * Level 3 Fallback Contract Part 2:
 * SSR-ready static SVG sculptural poster displayed during initial mount
 * and permanently on Tier 0 / prefers-reduced-motion / saveData / context loss.
 * Uses CSS custom properties so theme hydration never flashes mismatched colors.
 */
export function WinnowScenePoster({
  reason = 'Static SVG sculpture poster active',
}: WinnowScenePosterProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 840"
        width="1440"
        height="840"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full opacity-90"
      >
        <defs>
          <radialGradient id="obsidianCoreGlow" cx="69%" cy="49%" r="34%">
            <stop offset="0%" style={{ stopColor: 'var(--accent-ember)', stopOpacity: 0.14 }} />
            <stop offset="52%" style={{ stopColor: 'var(--brand-violet)', stopOpacity: 0.07 }} />
            <stop offset="100%" style={{ stopColor: 'var(--bg-canvas)', stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        <rect width="1440" height="840" fill="url(#obsidianCoreGlow)" />

        {/* Keplerian Orbital Wind Vectors */}
        <g
          fill="none"
          style={{ stroke: 'var(--accent-ember)' }}
          strokeOpacity="0.32"
          strokeWidth="1.1"
        >
          <ellipse cx="990" cy="410" rx="250" ry="96" transform="rotate(-24 990 410)" />
          <ellipse cx="990" cy="410" rx="310" ry="138" transform="rotate(20 990 410)" opacity="0.58" />
          <path d="M 880 370 C 1020 270, 1200 245, 1410 175" strokeDasharray="5 9" />
          <path d="M 895 455 C 1045 380, 1220 375, 1430 295" strokeDasharray="4 11" />
        </g>

        {/* Fibonacci Faceted Golden Grain Core */}
        <g
          style={{
            stroke: 'var(--status-warn)',
            fill: 'var(--status-warn)',
          }}
          strokeWidth="1.25"
          fillOpacity="0.22"
        >
          {[
            [990, 410, 18],
            [952, 392, 13],
            [1028, 428, 13],
            [974, 366, 11],
            [1016, 374, 10],
            [940, 434, 11],
            [998, 456, 11],
            [1054, 398, 9],
            [922, 405, 8],
          ].map(([cx, cy, r], idx) => (
            <polygon
              key={idx}
              points={`${cx},${cy - r} ${cx + r * 0.86},${cy - r * 0.32} ${cx + r * 0.55},${cy + r * 0.8} ${cx - r * 0.55},${cy + r * 0.8} ${cx - r * 0.86},${cy - r * 0.32}`}
            />
          ))}
        </g>

        {/* Fractured Husk Shards Drifting Outward */}
        <g style={{ stroke: 'var(--brand-violet)' }} strokeOpacity="0.34" strokeWidth="1" fill="none">
          {[
            [1150, 310, 22, -24],
            [1215, 250, 26, -15],
            [1280, 345, 18, 18],
            [1190, 465, 20, 26],
            [1320, 210, 24, -32],
            [1120, 520, 18, 35],
          ].map(([x, y, s, rot], idx) => (
            <polygon
              key={idx}
              points={`${x},${y} ${x + s},${y - s * 0.25} ${x + s * 0.55},${y + s * 0.35}`}
              transform={`rotate(${rot} ${x} ${y})`}
            />
          ))}
        </g>
      </svg>
      <span className="sr-only">{reason}</span>
    </div>
  );
}
