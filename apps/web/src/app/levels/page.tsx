import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Chaff Operational Levels — Clean, Authored & Risk',
  description:
    'The 3 creative operational contracts for AI coding agents and the mandatory 5-part Fallback Contract.',
};

export default function LevelsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-16">
      {/* Header Register */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] px-3 py-1 hairline rounded bg-[var(--bg-surface)]">
          <span>OPERATIONAL CONTRACTS</span>
          <span>/</span>
          <span>LEVELS 1 - 3</span>
        </div>
        <h1 className="tracking-tight text-[var(--text-main)] font-serif">
          The Three Creative Levels
        </h1>
        <p className="text-[var(--text-dim)] text-lg max-w-[68ch]">
          Levels define binding contracts between the engineer and the coding agent. At every level, the Identity Lock holds: intentional brand tokens are never overridden without explicit approval.
        </p>
      </div>

      {/* Horizontal Rail on Desktop, Stacked on Mobile (PRD 7.2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Level 1: Clean */}
        <div className="hairline p-6 sm:p-7 bg-[var(--bg-surface)] rounded-md flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-baseline hairline-b pb-3">
              <span className="font-mono text-xs font-bold text-[var(--accent-ember)] px-2.5 py-1 hairline rounded bg-[var(--bg-canvas)]">
                LEVEL 1
              </span>
              <span className="font-mono text-[11px] text-[var(--text-dim)]">
                Budget: &le; 200 lines diff
              </span>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[var(--text-main)]">Clean</h2>
              <span className="font-mono text-xs text-[var(--text-dim)] block mt-0.5">Safe Tell Removal</span>
            </div>

            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              Winnows synthetic purple glows, buzzwords, and spacing inconsistencies without altering existing structural layout or adding runtime dependencies.
            </p>

            <div className="space-y-3 font-mono text-xs pt-1">
              <div className="p-3 rounded hairline bg-[var(--bg-canvas)] space-y-1 border-[var(--status-sage)]/40">
                <span className="text-[var(--status-sage)] font-bold block uppercase text-[10px]">
                  [ALLOWED] In Scope
                </span>
                <p className="text-[var(--text-dim)] font-sans text-xs">
                  Typographic optical sizes, WCAG AA contrast adjustments, copy pruning, dvh units, touch target padding.
                </p>
              </div>

              <div className="p-3 rounded hairline bg-[var(--bg-canvas)] space-y-1 border-[var(--accent-ember)]/40">
                <span className="text-[var(--accent-ember)] font-bold block uppercase text-[10px]">
                  [FORBIDDEN] Out of Scope
                </span>
                <p className="text-[var(--text-dim)] font-sans text-xs">
                  Layout restructurings, animation libraries (Framer Motion / GSAP), WebGL, new UI framework dependencies.
                </p>
              </div>
            </div>
          </div>

          {/* Real Example & Verified Lighthouse Numbers (PRD 7.2) */}
          <div className="hairline-t pt-4 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-[11px] text-[var(--text-dim)]">
              <span>Verified Fixture:</span>
              <strong className="text-[var(--text-main)]">fixtures/blog</strong>
            </div>
            <div className="flex justify-between text-[11px] text-[var(--text-dim)]">
              <span>Lighthouse Mobile:</span>
              <strong className="text-[var(--status-sage)] font-bold">99 / 100</strong>
            </div>
            <div className="flex justify-between text-[11px] text-[var(--text-dim)]">
              <span>Score Leap:</span>
              <strong className="text-[var(--status-sage)]">46 &rarr; 98 (+52 pts)</strong>
            </div>
          </div>
        </div>

        {/* Level 2: Authored (Highlighted Default) */}
        <div className="hairline p-6 sm:p-7 bg-[var(--bg-surface)] rounded-md flex flex-col justify-between space-y-6 border-[var(--accent-ember)] relative shadow-sm">
          <div className="absolute top-0 right-6 -translate-y-1/2 font-mono text-[10px] uppercase font-bold tracking-widest px-3 py-0.5 rounded bg-[var(--accent-ember)] text-[var(--btn-primary-text)]">
            RECOMMENDED DEFAULT
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-baseline hairline-b pb-3">
              <span className="font-mono text-xs font-bold text-[var(--accent-ember)] px-2.5 py-1 hairline rounded bg-[var(--bg-canvas)]">
                LEVEL 2
              </span>
              <span className="font-mono text-[11px] text-[var(--status-sage)] font-semibold">
                3 Pitches First
              </span>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[var(--text-main)]">Authored</h2>
              <span className="font-mono text-xs text-[var(--text-dim)] block mt-0.5">Confident Editorial Craft</span>
            </div>

            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              Human-authored editorial redesign. The agent generates three diverse Concept Pitches in <code className="mono">.chaff/pitches/</code>, pauses for human signoff, and implements with editorial rhythm.
            </p>

            <div className="space-y-3 font-mono text-xs pt-1">
              <div className="p-3 rounded hairline bg-[var(--bg-canvas)] space-y-1 border-[var(--status-sage)]/40">
                <span className="text-[var(--status-sage)] font-bold block uppercase text-[10px]">
                  [ALLOWED] In Scope
                </span>
                <p className="text-[var(--text-dim)] font-sans text-xs">
                  Editorial asymmetric grids, split sheets, ruled ledgers, SVG data visualizations, 1 signature interaction, max 1 motion library.
                </p>
              </div>

              <div className="p-3 rounded hairline bg-[var(--bg-canvas)] space-y-1 border-[var(--accent-ember)]/40">
                <span className="text-[var(--accent-ember)] font-bold block uppercase text-[10px]">
                  [FORBIDDEN] Out of Scope
                </span>
                <p className="text-[var(--text-dim)] font-sans text-xs">
                  3D WebGL canvases, heavy video backgrounds, main-thread blocking &gt; 50ms, committing without pitch approval.
                </p>
              </div>
            </div>
          </div>

          {/* Real Example & Verified Lighthouse Numbers (PRD 7.2) */}
          <div className="hairline-t pt-4 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-[11px] text-[var(--text-dim)]">
              <span>Verified Fixture:</span>
              <strong className="text-[var(--text-main)]">fixtures/saas-landing</strong>
            </div>
            <div className="flex justify-between text-[11px] text-[var(--text-dim)]">
              <span>Lighthouse Mobile:</span>
              <strong className="text-[var(--status-sage)] font-bold">96 / 100</strong>
            </div>
            <div className="flex justify-between text-[11px] text-[var(--text-dim)]">
              <span>Score Leap:</span>
              <strong className="text-[var(--status-sage)]">48 &rarr; 96 (+48 pts)</strong>
            </div>
          </div>
        </div>

        {/* Level 3: Risk */}
        <div className="hairline p-6 sm:p-7 bg-[var(--bg-surface)] rounded-md flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-baseline hairline-b pb-3">
              <span className="font-mono text-xs font-bold text-[var(--accent-ember)] px-2.5 py-1 hairline rounded bg-[var(--bg-canvas)]">
                LEVEL 3
              </span>
              <span className="font-mono text-[11px] text-[var(--accent-ember)] font-semibold">
                Hard Gate Enforced
              </span>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[var(--text-main)]">Risk (WebGL & Spatial)</h2>
              <span className="font-mono text-xs text-[var(--text-dim)] block mt-0.5">Ultra Creative Ambition</span>
            </div>

            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              High-ambition digital craft utilizing WebGL, Three.js, shaders, and tactile physical simulations. The Iron Rule is absolute: <strong>downgrade effect complexity, never loosen the budget</strong>.
            </p>

            <div className="space-y-3 font-mono text-xs pt-1">
              <div className="p-3 rounded hairline bg-[var(--bg-canvas)] space-y-1 border-[var(--status-sage)]/40">
                <span className="text-[var(--status-sage)] font-bold block uppercase text-[10px]">
                  [ALLOWED] In Scope
                </span>
                <p className="text-[var(--text-dim)] font-sans text-xs">
                  Three.js, React Three Fiber, GLSL shaders, physical particle simulations, scrubbable spatial choreography.
                </p>
              </div>

              <div className="p-3 rounded hairline bg-[var(--bg-canvas)] space-y-1 border-[var(--accent-ember)]/40">
                <span className="text-[var(--accent-ember)] font-bold block uppercase text-[10px]">
                  [FORBIDDEN] Out of Scope
                </span>
                <p className="text-[var(--text-dim)] font-sans text-xs">
                  Uncapped DPR &gt; 1.5, synchronous 3D bundle imports affecting LCP, omitting poster fallback, memory leaks on unmount.
                </p>
              </div>
            </div>
          </div>

          {/* Real Example & Verified Lighthouse Numbers (PRD 7.2) */}
          <div className="hairline-t pt-4 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-[11px] text-[var(--text-dim)]">
              <span>Verified Fixture:</span>
              <strong className="text-[var(--text-main)]">examples/l3-hero</strong>
            </div>
            <div className="flex justify-between text-[11px] text-[var(--text-dim)]">
              <span>Lighthouse Mobile:</span>
              <strong className="text-[var(--status-sage)] font-bold">91 (WebGL) / 100 (Poster)</strong>
            </div>
            <div className="flex justify-between text-[11px] text-[var(--text-dim)]">
              <span>Fallback Mode:</span>
              <strong className="text-[var(--status-sage)]">Automatic Tier 0</strong>
            </div>
          </div>
        </div>
      </div>

      {/* The Mandatory 5-Part Fallback Contract */}
      <section className="hairline p-6 sm:p-8 bg-[var(--bg-surface)] rounded-md space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2 hairline-b pb-4">
          <div>
            <span className="font-mono text-xs text-[var(--accent-ember)] uppercase tracking-wider block">
              LEVEL 3 ARCHITECTURAL SPEC
            </span>
            <h2 className="font-serif text-2xl text-[var(--text-main)] mt-1">
              The Mandatory 5-Part Fallback Contract
            </h2>
          </div>
          <span className="font-mono text-xs text-[var(--status-sage)] font-semibold">
            Checked by chaff gate
          </span>
        </div>

        <p className="text-sm text-[var(--text-dim)] max-w-[68ch]">
          Any interactive 3D, canvas, or WebGL element authored at Level 3 must satisfy all five contractual clauses. If any clause fails verification, the build is rejected in CI.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {[
            {
              part: 'Clause 1',
              title: 'Lazy Dynamic Island',
              desc: 'Dynamic post-hydration import (next/dynamic with ssr: false). The 3D chunk never blocks Largest Contentful Paint (LCP).',
            },
            {
              part: 'Clause 2',
              title: 'Static Poster Fallback',
              desc: 'High-fidelity CSS/SVG poster rendered immediately for devices on poster tier, data-saver mode, or prefers-reduced-motion.',
            },
            {
              part: 'Clause 3',
              title: '1.5 DPR Governor Ceiling',
              desc: 'Device pixel ratio is strictly capped at 1.5 ceiling. High-density screens (3.0x retina) are clamped to protect GPU fill-rate.',
            },
            {
              part: 'Clause 4',
              title: 'Offscreen Frame Pausing',
              desc: 'IntersectionObserver and document visibility triggers halt requestAnimationFrame when the canvas scrolls out of viewport.',
            },
            {
              part: 'Clause 5',
              title: 'Teardown & Memory Disposal',
              desc: 'Explicit cleanup on unmount: geometries, textures, materials, and WebGL contexts disposed to prevent SPA memory accumulation.',
            },
            {
              part: 'Verification',
              title: 'Deterministic Budget Gate',
              desc: 'Evaluated automatically in CI via @chaff/tier and chaff gate. Downgrades effects gracefully without manual intervention.',
            },
          ].map((c) => (
            <div key={c.part} className="hairline p-4 rounded bg-[var(--bg-canvas)] space-y-2">
              <span className="font-mono text-xs font-bold text-[var(--accent-ember)]">
                {c.part}
              </span>
              <h3 className="font-serif text-base text-[var(--text-main)]">{c.title}</h3>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Budget Table */}
      <section className="hairline p-6 sm:p-8 bg-[var(--bg-surface)] rounded-md space-y-6">
        <div className="flex justify-between items-baseline hairline-b pb-4">
          <h2 className="font-serif text-2xl text-[var(--text-main)]">
            Performance Budget Thresholds
          </h2>
          <Link href="/gate" className="btn text-xs font-mono">
            View Measured Gate CI &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="hairline-b text-[var(--text-dim)] uppercase">
                <th className="py-3 pr-4">Metric</th>
                <th className="py-3 px-4">Level 1 & Level 2 Budget</th>
                <th className="py-3 px-4">Level 3 Budget</th>
                <th className="py-3 pl-4">Remediation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-line)]">
              <tr>
                <td className="py-3 pr-4 font-bold text-[var(--text-main)]">Largest Contentful Paint (LCP)</td>
                <td className="py-3 px-4 text-[var(--status-sage)]">&le; 2.5 seconds</td>
                <td className="py-3 px-4 text-[var(--status-sage)]">&le; 2.5 seconds (poster counts)</td>
                <td className="py-3 pl-4 text-[var(--text-dim)]">Preload font subsets, defer 3D</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold text-[var(--text-main)]">Cumulative Layout Shift (CLS)</td>
                <td className="py-3 px-4 text-[var(--status-sage)]">&le; 0.10</td>
                <td className="py-3 px-4 text-[var(--status-sage)]">&le; 0.10</td>
                <td className="py-3 pl-4 text-[var(--text-dim)]">Fixed aspect ratio containers</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold text-[var(--text-main)]">Total Blocking Time (TBT)</td>
                <td className="py-3 px-4 text-[var(--status-sage)]">&le; 200 ms</td>
                <td className="py-3 px-4 text-[var(--status-sage)]">&le; 300 ms</td>
                <td className="py-3 pl-4 text-[var(--text-dim)]">Chunk heavy computation, requestIdle</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold text-[var(--text-main)]">First-Load Route JS</td>
                <td className="py-3 px-4 text-[var(--status-sage)]">&le; 170 KB gzip</td>
                <td className="py-3 px-4 text-[var(--status-sage)]">170 KB + 250 KB lazy 3D island</td>
                <td className="py-3 pl-4 text-[var(--text-dim)]">Tree-shake libraries, dynamic imports</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold text-[var(--text-main)]">320px Viewport Overflow</td>
                <td className="py-3 px-4 text-[var(--status-sage)]">Zero horizontal scroll</td>
                <td className="py-3 px-4 text-[var(--status-sage)]">Zero horizontal scroll</td>
                <td className="py-3 pl-4 text-[var(--text-dim)]">Replace min-w or fixed pixel widths</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold text-[var(--text-main)]">Touch Target Size</td>
                <td className="py-3 px-4 text-[var(--status-sage)]">&ge; 44 &times; 44px</td>
                <td className="py-3 px-4 text-[var(--status-sage)]">&ge; 44 &times; 44px</td>
                <td className="py-3 pl-4 text-[var(--text-dim)]">min-h-[44px] min-w-[44px] on interactives</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}