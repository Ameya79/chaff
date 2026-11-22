import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Chaff Operational Levels — Clean, Authored & Risk',
  description:
    'The 3 creative operational contracts for AI coding agents and the mandatory 5-part Fallback Contract.',
};

const LEVELS_SPEC = [
  {
    num: '01',
    name: 'Clean',
    subtitle: 'Safe Tell Removal',
    tag: 'Diff: \u2264 200 lines',
    desc: 'Winnows synthetic purple glows, buzzwords, and spacing inconsistencies without altering structural layout or adding runtime dependencies.',
    allowed: 'Typographic optical sizes, WCAG AA contrast adjustments, copy pruning, dvh units, touch target padding.',
    forbidden: 'Layout restructurings, animation libraries (Framer Motion / GSAP), WebGL, new UI framework dependencies.',
    fixture: 'fixtures/blog',
    lh: '99 / 100',
    leap: '46 \u2192 98 (+52 pts)',
    isDefault: false,
  },
  {
    num: '02',
    name: 'Authored',
    subtitle: '3 Pitches First \u2022 Editorial Craft',
    tag: 'RECOMMENDED DEFAULT',
    desc: 'Human-authored editorial redesign. The agent generates three diverse Concept Pitches in .chaff/pitches/, pauses for signoff, and implements with editorial rhythm.',
    allowed: 'Editorial asymmetric grids, split sheets, ruled ledgers, SVG data visualizations, 1 signature interaction, max 1 motion library.',
    forbidden: '3D WebGL canvases, heavy video backgrounds, main-thread blocking > 50ms, committing without pitch approval.',
    fixture: 'fixtures/saas-landing',
    lh: '96 / 100',
    leap: '48 \u2192 96 (+48 pts)',
    isDefault: true,
  },
  {
    num: '03',
    name: 'Risk',
    subtitle: 'WebGL & Spatial Choreography',
    tag: 'Hard Gate Enforced',
    desc: 'High-ambition digital craft utilizing WebGL, Three.js, shaders, and tactile simulations. The Iron Rule is absolute: downgrade effect complexity, never loosen budget.',
    allowed: 'Three.js, React Three Fiber, GLSL shaders, physical particle simulations, scrubbable spatial choreography.',
    forbidden: 'Uncapped DPR > 1.5, synchronous 3D bundle imports affecting LCP, omitting poster fallback, memory leaks on unmount.',
    fixture: 'examples/l3-hero',
    lh: '91 (WebGL) / 100 (Poster)',
    leap: 'Automatic Tier 0',
    isDefault: false,
  },
];

const FALLBACK_CLAUSES = [
  { part: '\u00A7 01', title: 'Lazy Dynamic Island', desc: 'Dynamic post-hydration import (next/dynamic with ssr: false). The 3D chunk never blocks LCP.' },
  { part: '\u00A7 02', title: 'Static Poster Fallback', desc: 'High-fidelity CSS/SVG poster rendered immediately for poster tier or prefers-reduced-motion.' },
  { part: '\u00A7 03', title: '1.5 DPR Governor Ceiling', desc: 'Device pixel ratio capped at 1.5 ceiling. High-density screens clamped to protect GPU.' },
  { part: '\u00A7 04', title: 'Offscreen Frame Pausing', desc: 'IntersectionObserver halts requestAnimationFrame when canvas scrolls out of viewport.' },
  { part: '\u00A7 05', title: 'Teardown & Memory Disposal', desc: 'Explicit cleanup on unmount: geometries, textures, and contexts disposed cleanly.' },
  { part: 'VERIFY', title: 'Deterministic Budget Gate', desc: 'Evaluated in CI via @chaff/tier and chaff gate. Downgrades effects gracefully.' },
];

const BUDGET_ROWS = [
  { metric: 'Largest Contentful Paint (LCP)', l1l2: '\u2264 2.5 seconds', l3: '\u2264 2.5 seconds (poster counts)', action: 'Preload font subsets, defer 3D' },
  { metric: 'Cumulative Layout Shift (CLS)', l1l2: '\u2264 0.10', l3: '\u2264 0.10', action: 'Fixed aspect ratio containers' },
  { metric: 'Total Blocking Time (TBT)', l1l2: '\u2264 200 ms', l3: '\u2264 300 ms', action: 'Chunk computation, requestIdle' },
  { metric: 'First-Load Route JS', l1l2: '\u2264 170 KB gzip', l3: '170 KB + 250 KB lazy 3D island', action: 'Tree-shake libraries, dynamic imports' },
  { metric: '320px Viewport Overflow', l1l2: 'Zero horizontal scroll', l3: 'Zero horizontal scroll', action: 'Replace min-w or fixed pixel widths' },
  { metric: 'Touch Target Size', l1l2: '\u2265 44 \u00D7 44px', l3: '\u2265 44 \u00D7 44px', action: 'min-h-[44px] min-w-[44px] on interactives' },
];

export default function LevelsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-16">
      {/* Header Register */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 hairline-b pb-3 font-mono text-xs text-[var(--text-dim)]">
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent-ember)] font-bold">SPEC //</span>
            <span className="uppercase tracking-widest text-[var(--text-main)] font-semibold">OPERATIONAL CONTRACTS</span>
          </div>
          <div>LEVELS 1 - 3 SPECIFICATION</div>
        </div>
        <h1 className="tracking-tight text-[var(--text-main)] font-serif">
          The Three Creative Levels
        </h1>
        <p className="text-[var(--text-dim)] text-lg max-w-[68ch]">
          Levels define binding contracts between the engineer and the coding agent. At every level, the Identity Lock holds: intentional brand tokens are never overridden without explicit approval.
        </p>
      </div>

      {/* The Continuous 3-Column Comparative Broadsheet (Single Shared Top/Bottom Rules, Zero Cards) */}
      <section className="space-y-3">
        <div className="flex justify-between items-baseline font-mono text-xs text-[var(--text-dim)] pb-1">
          <span className="uppercase font-semibold text-[var(--text-main)]">Comparative Level Matrix</span>
          <span>Horizontal Comparative Broadsheet</span>
        </div>

        <div className="hairline-y grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-line)] items-stretch">
          {LEVELS_SPEC.map((lvl) => (
            <div
              key={lvl.num}
              className={`py-6 px-4 sm:p-8 flex flex-col justify-between space-y-6 ${
                lvl.isDefault ? 'bg-[var(--bg-surface)]/40' : ''
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-baseline hairline-b pb-3">
                  <span className="font-mono text-xs font-bold text-[var(--accent-ember)]">
                    LEVEL {lvl.num} //
                  </span>
                  <span
                    className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 hairline ${
                      lvl.isDefault
                        ? 'text-[var(--accent-ember)] bg-[var(--accent-ember-soft)]/50'
                        : 'text-[var(--text-dim)]'
                    }`}
                  >
                    {lvl.tag}
                  </span>
                </div>

                <div>
                  <h2 className="font-serif text-3xl text-[var(--text-main)]">{lvl.name}</h2>
                  <span className="font-mono text-xs text-[var(--text-dim)] block mt-0.5">{lvl.subtitle}</span>
                </div>

                <p className="text-sm text-[var(--text-dim)] leading-relaxed">{lvl.desc}</p>

                <div className="hairline-y py-3 space-y-3 font-mono text-xs">
                  <div className="space-y-1">
                    <span className="text-[var(--status-sage)] font-bold block uppercase text-[10px]">
                      [ALLOWED] In Scope
                    </span>
                    <p className="text-[var(--text-dim)] font-sans text-xs">{lvl.allowed}</p>
                  </div>

                  <div className="space-y-1 hairline-t pt-2">
                    <span className="text-[var(--accent-ember)] font-bold block uppercase text-[10px]">
                      [FORBIDDEN] Out of Scope
                    </span>
                    <p className="text-[var(--text-dim)] font-sans text-xs">{lvl.forbidden}</p>
                  </div>
                </div>
              </div>

              <div className="hairline-t pt-4 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-[11px] text-[var(--text-dim)]">
                  <span>Verified Fixture:</span>
                  <strong className="text-[var(--text-main)]">{lvl.fixture}</strong>
                </div>
                <div className="flex justify-between text-[11px] text-[var(--text-dim)]">
                  <span>Lighthouse Mobile:</span>
                  <strong className="text-[var(--status-sage)] font-bold">{lvl.lh}</strong>
                </div>
                <div className="flex justify-between text-[11px] text-[var(--text-dim)]">
                  <span>Score Leap:</span>
                  <strong className="text-[var(--status-sage)]">{lvl.leap}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Mandatory 5-Part Fallback Contract Specification (Broadsheet Marginalia, Zero Cards) */}
      <section className="hairline-y py-10 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-3">
            <span className="font-mono text-xs text-[var(--accent-ember)] uppercase tracking-wider block font-bold">
              SPEC // MANDATORY CONTRACT
            </span>
            <h2 className="font-serif text-3xl text-[var(--text-main)]">
              The Mandatory 5-Part Fallback Contract
            </h2>
            <p className="text-sm text-[var(--text-dim)] leading-relaxed">
              Any interactive 3D, canvas, or WebGL element authored at Level 3 must satisfy all five contractual clauses. If any clause fails verification, the build is rejected in CI.
            </p>
            <div className="pt-2 text-xs font-mono text-[var(--status-sage)] font-semibold flex items-center gap-2">
              <span>●</span>
              <span>Checked automatically by chaff gate</span>
            </div>
            <div className="font-mono text-xs text-[var(--text-dim)] pt-1">
              Clause Index: <strong className="text-[var(--text-main)]">|||| / (5 Clauses + 1 Gate)</strong>
            </div>
          </div>

          <div className="lg:col-span-8 lg:border-l border-[var(--border-line)] lg:pl-8 divide-y divide-[var(--border-line)] hairline-t lg:hairline-t-0">
            {FALLBACK_CLAUSES.map((c) => (
              <div key={c.part} className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-baseline">
                <span className="sm:col-span-2 font-mono text-xs font-bold text-[var(--accent-ember)]">
                  {c.part} //
                </span>
                <h3 className="sm:col-span-4 font-serif text-base text-[var(--text-main)]">
                  {c.title}
                </h3>
                <p className="sm:col-span-6 text-xs text-[var(--text-dim)] leading-relaxed font-sans">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Budget Table Ledger (Broadsheet Marginalia, Zero Cards) */}
      <section className="hairline-y py-10 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3 space-y-3">
            <span className="font-mono text-xs text-[var(--accent-ember)] uppercase tracking-wider block font-bold">
              BUDGET LEDGER // THRESHOLDS
            </span>
            <h2 className="font-serif text-2xl text-[var(--text-main)]">
              Performance Budget Thresholds
            </h2>
            <p className="text-xs text-[var(--text-dim)] font-mono leading-relaxed">
              Enforced across Level 1, 2, and 3. The Iron Rule is absolute: downgrade effect complexity, never loosen the budget.
            </p>
            <div className="pt-2">
              <Link href="/gate" className="btn text-xs font-mono">
                View Measured Gate CI &rarr;
              </Link>
            </div>
          </div>

          <div className="lg:col-span-9 lg:border-l border-[var(--border-line)] lg:pl-8 overflow-x-auto hairline-t lg:hairline-t-0 pt-6 lg:pt-0">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="hairline-b text-[var(--text-dim)] uppercase">
                  <th className="py-3 pr-4">Metric</th>
                  <th className="py-3 px-4">Level 1 &amp; Level 2 Budget</th>
                  <th className="py-3 px-4">Level 3 Budget</th>
                  <th className="py-3 pl-4">Remediation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-line)]">
                {BUDGET_ROWS.map((b) => (
                  <tr key={b.metric}>
                    <td className="py-3 pr-4 font-bold text-[var(--text-main)]">{b.metric}</td>
                    <td className="py-3 px-4 text-[var(--status-sage)]">{b.l1l2}</td>
                    <td className="py-3 px-4 text-[var(--status-sage)]">{b.l3}</td>
                    <td className="py-3 pl-4 text-[var(--text-dim)]">{b.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
