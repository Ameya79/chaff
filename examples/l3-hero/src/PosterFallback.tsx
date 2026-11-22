import React from 'react';

/**
 * Clause 2 of Fallback Contract:
 * High-fidelity static poster rendered during SSR, low-power mode, or reduced-motion.
 * Explicit width/height to ensure 0.00 Cumulative Layout Shift (CLS).
 */
export function PosterFallback() {
  return (
    <div className="relative w-full aspect-[16/9] max-w-5xl mx-auto overflow-hidden rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center">
      <svg
        viewBox="0 0 1200 675"
        width="1200"
        height="675"
        className="w-full h-full object-cover"
        aria-label="Interactive 3D geometry showcase poster fallback"
      >
        <defs>
          <linearGradient id="posterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#292524" />
            <stop offset="50%" stopColor="#1c1917" />
            <stop offset="100%" stopColor="#0c0a09" />
          </linearGradient>
          <radialGradient id="emberGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ea580c" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1200" height="675" fill="url(#posterGrad)" />
        <circle cx="600" cy="337" r="280" fill="url(#emberGlow)" />
        <polygon
          points="600,160 760,260 760,440 600,540 440,440 440,260"
          fill="none"
          stroke="#fed7aa"
          strokeWidth="2"
          opacity="0.8"
        />
        <text
          x="600"
          y="350"
          textAnchor="middle"
          fill="#f5f5f4"
          fontFamily="sans-serif"
          fontSize="24"
          letterSpacing="0.05em"
        >
          CHAFF LEVEL 3 HERO — STATIC POSTER
        </text>
      </svg>
    </div>
  );
}
