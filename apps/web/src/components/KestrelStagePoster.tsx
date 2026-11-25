import React from 'react';

interface KestrelStagePosterProps {
  wipePercent?: number;
  stageMode?: 'side' | 'curtain' | 'before' | 'after';
  reason?: string;
}

/**
 * Level 3 Fallback Contract Part 2:
 * High-fidelity SSR static SVG poster rendered prior to client hydration and permanently
 * on Tier 0 / prefers-reduced-motion / saveData devices with zero GPU overhead.
 */
export function KestrelStagePoster({
  wipePercent = 50,
  stageMode = 'side',
  reason = 'Static Vector Poster Active',
}: KestrelStagePosterProps) {
  const seamX = (wipePercent / 100) * 1200;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      aria-hidden="true"
    >
      {stageMode === 'curtain' && (
        <svg
          viewBox="0 0 1200 500"
          width="1200"
          height="500"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="winnowSweep" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9E3308" stopOpacity="0" />
              <stop offset="50%" stopColor="#9E3308" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#6D28D9" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect
            x={Math.max(0, seamX - 28)}
            y="0"
            width="56"
            height="500"
            fill="url(#winnowSweep)"
          />
          {[80, 160, 240, 320, 410].map((y, idx) => (
            <g key={y} opacity="0.65">
              <circle cx={seamX + (idx % 2 === 0 ? 14 : -14)} cy={y} r={3} fill="#C49A45" />
              <ellipse
                cx={seamX + 24}
                cy={y - 10}
                rx="6"
                ry="2"
                fill="#9E3308"
                transform={`rotate(-16 ${seamX + 24} ${y - 10})`}
              />
            </g>
          ))}
        </svg>
      )}
      <span className="sr-only">{reason}</span>
    </div>
  );
}
