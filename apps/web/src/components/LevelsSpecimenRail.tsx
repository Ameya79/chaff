'use client';

import React, { useState } from 'react';
import type { DeviceTier } from '@chaff/tier';

export function LevelsSpecimenRail() {
  const [simulatedTier, setSimulatedTier] = useState<DeviceTier>('full');

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-xs text-[var(--text-dim)]">
        <span className="uppercase font-semibold text-[var(--text-main)]">
          Interactive Comparative Rail (Level 1 &rarr; Level 2 &rarr; Level 3)
        </span>
        <span>Inspect how the same component evolves across levels</span>
      </div>

      {/* Horizontal 3-column comparative rail on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 hairline bg-[var(--bg-surface)] divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-line)]">
        {/* Level 1: Clean */}
        <article className="p-6 flex flex-col justify-between gap-6 min-w-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 hairline-b font-mono text-xs">
              <span className="font-bold text-[var(--accent-ember)]">LEVEL 01</span>
              <span className="px-2 py-0.5 bg-[var(--bg-inset)] text-[var(--text-dim)]">
                Diff &le; 200 lines
              </span>
            </div>

            <div>
              <h2 className="font-serif text-3xl text-[var(--text-main)]">Clean</h2>
              <p className="font-mono text-xs text-[var(--text-dim)] mt-0.5">
                Safe Tell Removal · Zero Layout Rewrites
              </p>
            </div>

            <p className="text-sm text-[var(--text-dim)] leading-relaxed">
              Eliminates unwaived purple glows, buzzword copy, AA contrast failures, and 100vh bugs without altering grid geometry or adding packages.
            </p>

            {/* Live L1 Mini-Specimen */}
            <div className="p-4 hairline bg-[var(--bg-inset)] space-y-2">
              <span className="font-mono text-[10px] uppercase text-[var(--status-sage)] font-bold block">
                L1 Live Specimen · Contrasts Fixed
              </span>
              <div className="p-3 bg-[var(--bg-surface)] hairline space-y-1.5">
                <div className="font-serif text-base text-[var(--text-main)]">
                  Order Router Telemetry
                </div>
                <p className="text-xs text-[var(--text-dim)]">
                  AA contrast &ge; 4.5:1, dvh viewport height, 44px button floor.
                </p>
                <span className="inline-block font-mono text-[11px] font-bold text-[var(--status-sage)] tabular-nums">
                  11.8 ms median
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 hairline-t space-y-1.5 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--text-dim)]">Allowed:</span>
              <span className="text-[var(--text-main)]">next/font, AA tokens, copy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-dim)]">Forbidden:</span>
              <span className="text-[var(--accent-ember)]">Grid changes, motion libs</span>
            </div>
          </div>
        </article>

        {/* Level 2: Authored */}
        <article className="p-6 flex flex-col justify-between gap-6 bg-[var(--bg-inset)]/40 min-w-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 hairline-b font-mono text-xs">
              <span className="font-bold text-[var(--accent-ember)]">LEVEL 02</span>
              <span className="px-2 py-0.5 bg-[var(--accent-ember-soft)] text-[var(--accent-ember)] font-bold">
                3 Pitches Required
              </span>
            </div>

            <div>
              <h2 className="font-serif text-3xl text-[var(--text-main)]">Authored</h2>
              <p className="font-mono text-xs text-[var(--text-dim)] mt-0.5">
                Editorial Point of View · Signature Interaction
              </p>
            </div>

            <p className="text-sm text-[var(--text-dim)] leading-relaxed">
              Authors 3 diverse Concept Pitches in .chaff/pitches/, pauses for signoff, and builds asymmetric layouts with custom SVG data visuals.
            </p>

            {/* Live L2 Mini-Specimen */}
            <div className="p-4 hairline bg-[var(--bg-surface)] space-y-2">
              <span className="font-mono text-[10px] uppercase text-[var(--brand-violet)] font-bold block">
                L2 Live Specimen · Asymmetric + #6D28D9 Kept
              </span>
              <div className="grid grid-cols-12 gap-2 items-center p-2.5 bg-[var(--bg-inset)] hairline">
                <div className="col-span-7 space-y-1">
                  <span className="font-serif text-sm text-[var(--text-main)] block leading-tight">
                    14 Venues Routed
                  </span>
                  <span
                    className="inline-block px-2 py-0.5 text-[10px] font-mono text-white"
                    style={{ backgroundColor: '#6D28D9' }}
                  >
                    Deploy
                  </span>
                </div>
                <div className="col-span-5">
                  <svg viewBox="0 0 80 34" width="80" height="34" className="w-full h-8" aria-hidden="true">
                    <rect x="2" y="4" width="54" height="7" rx="1" fill="#6D28D9" />
                    <rect x="22" y="14" width="44" height="7" rx="1" fill="#354A21" />
                    <rect x="40" y="24" width="34" height="7" rx="1" fill="#9E3308" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 hairline-t space-y-1.5 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--text-dim)]">Allowed:</span>
              <span className="text-[var(--text-main)]">Asymmetry, SVG, max 1 lib</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-dim)]">Forbidden:</span>
              <span className="text-[var(--accent-ember)]">WebGL/3D, tasks &gt; 50ms</span>
            </div>
          </div>
        </article>

        {/* Level 3: Risk */}
        <article className="p-6 flex flex-col justify-between gap-6 min-w-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 hairline-b font-mono text-xs">
              <span className="font-bold text-[var(--accent-ember)]">LEVEL 03</span>
              <span className="px-2 py-0.5 bg-[var(--status-sage-soft)] text-[var(--status-sage)] font-bold">
                5-Part Contract
              </span>
            </div>

            <div>
              <h2 className="font-serif text-3xl text-[var(--text-main)]">Risk</h2>
              <p className="font-mono text-xs text-[var(--text-dim)] mt-0.5">
                WebGL2 / GLSL Shaders · Hard Gate Enforced
              </p>
            </div>

            <p className="text-sm text-[var(--text-dim)] leading-relaxed">
              Unlocks custom WebGL2 shaders and spatial interaction, strictly governed by @chaff/tier with static poster fallback and 1.5 DPR ceiling.
            </p>

            {/* Live L3 Interactive Tier Simulator */}
            <div className="p-4 hairline bg-[#110F0C] text-[#EFE6D2] space-y-2.5">
              <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
                <span className="uppercase text-[#F08048] font-bold">
                  Simulate @chaff/tier
                </span>
                <span className="text-[#8EB86B]">
                  {simulatedTier === 'full'
                    ? '360 GLSL Particles'
                    : simulatedTier === 'lite'
                    ? '110 Lite Particles'
                    : '0 GPU · Static SVG'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1 font-mono text-[11px]">
                {(['full', 'lite', 'poster'] as DeviceTier[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSimulatedTier(t)}
                    aria-pressed={simulatedTier === t}
                    className={`min-h-[44px] px-2 border uppercase transition-colors ${
                      simulatedTier === t
                        ? 'bg-[#F08048] text-[#110F0C] border-[#F08048] font-bold'
                        : 'bg-[#191612] text-[#EFE6D2] border-[#302A22]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 hairline-t space-y-1.5 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--text-dim)]">Allowed:</span>
              <span className="text-[var(--text-main)]">GLSL shaders, R3F, WebGPU</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-dim)]">Iron Rule:</span>
              <span className="text-[var(--status-sage)] font-bold">Downgrade effect, not budget</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
