'use client';

import React, { useState } from 'react';
import type { DeviceTier } from '@chaff/tier';

export function LevelsSpecimenRail() {
  const [simulatedTier, setSimulatedTier] = useState<DeviceTier>('full');

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-line)] hairline-y">
      {/* Level 1: Clean */}
      <article
        className="sheet-in flex flex-col justify-between gap-6 py-8 lg:pr-8 min-w-0"
        style={{ '--d': '100ms' } as React.CSSProperties}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[var(--accent)] font-medium">LEVEL 01</span>
            <span className="text-[var(--text-dim)]">&le; 200 lines</span>
          </div>

          <h2 className="font-display text-3xl text-[var(--text-main)]">Clean</h2>

          <p className="text-sm text-[var(--text-dim)] leading-relaxed">
            Safe tell removal inside your current layout. Contrast, copy voice, tap targets, and overflow fixed without rewriting grid architecture.
          </p>

          <div className="hairline-t pt-4 space-y-1.5">
            <span className="font-mono text-[11px] text-[var(--status-pass)] block">
              AA Contrast · 44px Targets
            </span>
            <div className="font-medium text-base text-[var(--text-main)]">
              Order Router Telemetry
            </div>
            <span className="font-mono text-xs text-[var(--text-dim)] tabular-nums block">
              11.8 ms median · Zero grid rewrites
            </span>
          </div>
        </div>

        <div className="hairline-t pt-3 flex justify-between font-mono text-xs text-[var(--text-dim)]">
          <span>No motion libs</span>
          <span className="text-[var(--text-main)]">Safe diff</span>
        </div>
      </article>

      {/* Level 2: Authored */}
      <article
        className="sheet-in flex flex-col justify-between gap-6 py-8 lg:px-8 min-w-0"
        style={{ '--d': '165ms' } as React.CSSProperties}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[var(--accent)] font-medium">LEVEL 02</span>
            <span className="text-[var(--brand-violet)]">3 Pitches</span>
          </div>

          <h2 className="font-display text-3xl text-[var(--text-main)]">Authored</h2>

          <p className="text-sm text-[var(--text-dim)] leading-relaxed">
            Asymmetric layout, 3 tailored directions shaped around your brand tokens, and one crisp signature interaction.
          </p>

          <div className="hairline-t pt-4 space-y-3">
            <span className="font-mono text-[11px] text-[var(--brand-violet)] block">
              User Token #6D28D9 Locked
            </span>
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-7 space-y-1.5">
                <span className="font-medium text-base text-[var(--text-main)] block">
                  14 Venues
                </span>
                <span
                  className="inline-block px-2.5 py-0.5 rounded-[4px] text-[10px] font-mono text-white"
                  style={{ backgroundColor: '#6D28D9' }}
                >
                  Deploy
                </span>
              </div>
              <div className="col-span-5">
                <svg viewBox="0 0 80 34" width="80" height="34" className="w-full h-8" aria-hidden="true">
                  <rect x="2" y="4" width="54" height="6" rx="1" fill="#6D28D9" />
                  <rect x="22" y="14" width="44" height="6" rx="1" fill="var(--status-pass)" />
                  <rect x="40" y="24" width="34" height="6" rx="1" fill="var(--accent)" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="hairline-t pt-3 flex justify-between font-mono text-xs text-[var(--text-dim)]">
          <span>Max 1 motion lib</span>
          <span className="text-[var(--text-main)]">No WebGL</span>
        </div>
      </article>

      {/* Level 3: Risk */}
      <article
        className="sheet-in flex flex-col justify-between gap-6 py-8 lg:pl-8 min-w-0"
        style={{ '--d': '230ms' } as React.CSSProperties}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[var(--accent)] font-medium">LEVEL 03</span>
            <span className="text-[var(--status-pass)]">5-Part Contract</span>
          </div>

          <h2 className="font-display text-3xl text-[var(--text-main)]">Risk</h2>

          <p className="text-sm text-[var(--text-dim)] leading-relaxed">
            Interactive WebGL2 &amp; custom GLSL shaders scaled dynamically by @chaff/tier with 1.5x DPR cap and SVG poster fallback.
          </p>

          <div className="hairline-t pt-4 space-y-3">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-[var(--accent)]">@chaff/tier</span>
              <span className="text-[var(--status-pass)]">
                {simulatedTier === 'full'
                  ? '104x104 Mesh · 60fps'
                  : simulatedTier === 'lite'
                  ? '58x58 Lite · 60fps'
                  : '0 GPU · SVG Poster'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 rounded-[6px] bg-[var(--bg-surface-elevated)] border border-[var(--border-line)] p-1 font-mono text-xs">
              {(['full', 'lite', 'poster'] as DeviceTier[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSimulatedTier(t)}
                  aria-pressed={simulatedTier === t}
                  className={`min-h-[44px] min-w-[44px] px-2 rounded-[4px] uppercase transition-colors duration-200 ${
                    simulatedTier === t
                      ? 'bg-[var(--text-main)] text-[var(--btn-primary-text)] font-medium'
                      : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hairline-t pt-3 flex justify-between font-mono text-xs text-[var(--text-dim)]">
          <span>&le; 250 KB lazy 3D</span>
          <span className="text-[var(--status-pass)]">Downgrade effect</span>
        </div>
      </article>
    </section>
  );
}
