import React from 'react';

interface WinnowScenePosterProps {
  className?: string;
  tierLabel?: string;
}

export function WinnowScenePoster({
  className = '',
  tierLabel,
}: WinnowScenePosterProps) {
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center ${className}`}
      aria-label={tierLabel ? `Crystal artifact fallback (${tierLabel})` : 'Crystal artifact fallback'}
    >
      <svg
        viewBox="0 0 320 320"
        width="320"
        height="320"
        role="img"
        aria-label="Faceted sage grain core enclosed in calibration rings"
        className="w-full h-full max-w-sm select-none"
      >
        <g fill="none" strokeLinecap="round">
          <ellipse
            cx="160"
            cy="160"
            rx="128"
            ry="50"
            transform="rotate(-24 160 160)"
            stroke="var(--text-main)"
            strokeOpacity="0.22"
            strokeWidth="1"
          />
          <ellipse
            cx="160"
            cy="160"
            rx="104"
            ry="41"
            transform="rotate(34 160 160)"
            stroke="var(--text-main)"
            strokeOpacity="0.34"
            strokeWidth="1.15"
          />
          <ellipse
            cx="160"
            cy="160"
            rx="78"
            ry="31"
            transform="rotate(-56 160 160)"
            stroke="var(--accent)"
            strokeOpacity="0.82"
            strokeWidth="1.35"
          />
          <circle cx="204" cy="95" r="3.2" fill="var(--accent)" stroke="none" />
          <circle cx="116" cy="225" r="3.2" fill="var(--accent)" stroke="none" />
        </g>

        {/* Central Sleek Faceted Botanical Quartz Obelisk */}
        <polygon points="160,94 188,160 160,226" fill="var(--accent)" opacity="0.92" />
        <polygon points="160,94 132,160 160,226" fill="var(--accent-mid, #5E8C72)" opacity="0.82" />
        <polygon points="160,94 188,160 160,148" fill="#FFFFFF" opacity="0.28" />
        <line x1="130" y1="160" x2="190" y2="160" stroke="var(--accent)" strokeWidth="1.2" strokeOpacity="0.85" />
      </svg>
    </div>
  );
}
