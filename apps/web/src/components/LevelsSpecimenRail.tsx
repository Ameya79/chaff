'use client';

import React, { useState } from 'react';
import type { DeviceTier } from '@chaff/tier';

export function LevelsSpecimenRail() {
  const [simulatedTier, setSimulatedTier] = useState<DeviceTier>('full');

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 hairline-t pt-12">
      {/* Level 1: Clean */}
      <article className="flex flex-col justify-between gap-6 min-w-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[var(--accent-ember)] font-semibold">LEVEL 01</span>
            <span className="text-[var(--text-dim)]">&le; 200 lines</span>
          </div>

          <h2 className="font-serif text-3xl text-[var(--text-main)]">Clean</h2>

          <p className="text-sm text-[var(--text-dim)] leading-relaxed">
            Safe tell removal. Fixes contrast, copy, and dvh heights with zero layout changes.
          </p>

          <div className="rounded-2xl bg-[var(--bg-surface)] p-5 space-y-2">
            <span className="font-mono text-[11px] text-[var(--status-sage)] block">
              AA Contrast · 44px Targets
            </span>
            <div className="font-serif text-lg text-[var(--text-main)]">
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
      <article className="flex flex-col justify-between gap-6 min-w-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[var(--accent-ember)] font-semibold">LEVEL 02</span>
            <span className="text-[var(--brand-violet)]">3 Pitches</span>
          </div>

          <h2 className="font-serif text-3xl text-[var(--text-main)]">Authored</h2>

          <p className="text-sm text-[var(--text-dim)] leading-relaxed">
            Asymmetric layout, custom SVG visuals, and one signature interaction.
          </p>

          <div className="rounded-2xl bg-[var(--bg-surface)] p-5 space-y-3">
            <span className="font-mono text-[11px] text-[var(--brand-violet)] block">
              Brand #6D28D9 Locked
            </span>
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-7 space-y-1.5">
                <span className="font-serif text-base text-[var(--text-main)] block">
                  14 Venues
                </span>
                <span
                  className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono text-white"
                  style={{ backgroundColor: '#6D28D9' }}
                >
                  Deploy
                </span>
              </div>
              <div className="col-span-5">
                <svg viewBox="0 0 80 34" width="80" height="34" className="w-full h-8" aria-hidden="true">
                  <rect x="2" y="4" width="54" height="6" rx="3" fill="#6D28D9" />
                  <rect x="22" y="14" width="44" height="6" rx="3" fill="var(--status-sage)" />
                  <rect x="40" y="24" width="34" height="6" rx="3" fill="var(--accent-ember)" />
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
      <article className="flex flex-col justify-between gap-6 min-w-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[var(--accent-ember)] font-semibold">LEVEL 03</span>
            <span className="text-[var(--status-sage)]">5-Part Contract</span>
          </div>

          <h2 className="font-serif text-3xl text-[var(--text-main)]">Risk</h2>

          <p className="text-sm text-[var(--text-dim)] leading-relaxed">
            Three.js and GLSL shaders governed by @chaff/tier and 1.5 DPR cap.
          </p>

          <div className="rounded-2xl bg-[var(--bg-surface)] p-5 space-y-3">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-[var(--accent-ember)]">@chaff/tier</span>
              <span className="text-[var(--status-sage)]">
                {simulatedTier === 'full'
                  ? '140 / 220 3D Mesh'
                  : simulatedTier === 'lite'
                  ? '35 / 55 Lite Mesh'
                  : '0 GPU · SVG Poster'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 rounded-full bg-[var(--bg-surface-elevated)] p-1 font-mono text-xs">
              {(['full', 'lite', 'poster'] as DeviceTier[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSimulatedTier(t)}
                  aria-pressed={simulatedTier === t}
                  className={`min-h-[44px] min-w-[44px] px-2 rounded-full uppercase transition-colors ${
                    simulatedTier === t
                      ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-semibold'
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
          <span className="text-[var(--status-sage)]">Downgrade effect</span>
        </div>
      </article>
    </section>
  );
}
