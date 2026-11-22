import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Chaff Operational Levels — Clean, Authored & Risk',
  description: 'The 3 creative operational contracts for AI coding agents and the 5-part Fallback Contract.',
};

export default function LevelsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      <div>
        <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] px-2.5 py-1 hairline rounded bg-[var(--bg-surface)] mb-4">
          <span>OPERATIONAL CONTRACTS</span>
          <span>/</span>
          <span>LEVELS 1 - 3</span>
        </div>
        <h1 className="tracking-tight text-[var(--text-main)]">The Three Creative Levels</h1>
        <p className="text-[var(--text-dim)] mt-2 max-w-[65ch]">
          Levels are contracts between you and the agent. At every level, the Identity Lock holds: intentional brand tokens are never altered.
        </p>
      </div>

      {/* Level Contracts Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Level 1 */}
        <div className="hairline p-6 bg-[var(--bg-surface)] rounded-md space-y-4">
          <div className="flex justify-between items-baseline hairline-b pb-3">
            <span className="font-mono text-xs text-[var(--accent-ember)] font-bold">LEVEL 1</span>
            <span className="font-mono text-xs text-[var(--text-dim)]">Strict Diff Budget</span>
          </div>
          <h2 className="font-serif text-2xl">Clean</h2>
          <p className="text-xs text-[var(--text-dim)] leading-relaxed">
            Safe tell removal with minimal diff footprint. Removes AI tells, purple gradients, and buzzwords without restructuring layout.
          </p>
          <div className="space-y-2 text-xs font-mono pt-2">
            <div><strong className="text-[var(--text-main)]">Allowed:</strong> Typographic hygiene, contrast fixes, copy pruning, dvh units.</div>
            <div><strong className="text-red-600">Forbidden:</strong> Layout overhauls, external animation libraries, WebGL.</div>
            <div><strong className="text-[var(--text-main)]">Diff Budget:</strong> &le; 10 files, &le; 200 lines net diff.</div>
          </div>
        </div>

        {/* Level 2 */}
        <div className="hairline p-6 bg-[var(--bg-surface)] rounded-md space-y-4 border-[var(--accent-ember)]">
          <div className="flex justify-between items-baseline hairline-b pb-3">
            <span className="font-mono text-xs text-[var(--accent-ember)] font-bold">LEVEL 2</span>
            <span className="font-mono text-xs text-[var(--status-sage)] font-bold">Default Mode</span>
          </div>
          <h2 className="font-serif text-2xl">Authored</h2>
          <p className="text-xs text-[var(--text-dim)] leading-relaxed">
            High-craft editorial redesign. The agent generates three Concept Pitches first, pauses for human approval, then builds the chosen direction.
          </p>
          <div className="space-y-2 text-xs font-mono pt-2">
            <div><strong className="text-[var(--text-main)]">Allowed:</strong> Editorial asymmetric layouts, custom SVG data viz, 1 signature interaction.</div>
            <div><strong className="text-red-600">Forbidden:</strong> WebGL, canvas heroes, blocking main thread &gt; 50ms.</div>
            <div><strong className="text-[var(--text-main)]">Gate Requirement:</strong> 3 distinct pitches in .chaff/pitches/.</div>
          </div>
        </div>

        {/* Level 3 */}
        <div className="hairline p-6 bg-[var(--bg-surface)] rounded-md space-y-4">
          <div className="flex justify-between items-baseline hairline-b pb-3">
            <span className="font-mono text-xs text-[var(--accent-ember)] font-bold">LEVEL 3</span>
            <span className="font-mono text-xs text-[var(--text-dim)]">Ultra Creative</span>
          </div>
          <h2 className="font-serif text-2xl">Risk</h2>
          <p className="text-xs text-[var(--text-dim)] leading-relaxed">
            Unforgettable web experiences utilizing WebGL, Three.js, shaders, and tactile simulations. Risk is allowed; user harm is not.
          </p>
          <div className="space-y-2 text-xs font-mono pt-2">
            <div><strong className="text-[var(--text-main)]">Allowed:</strong> Three.js, R3F, GLSL shaders, scroll choreography, spatial geometry.</div>
            <div><strong className="text-red-600">Forbidden:</strong> Bypassing the Fallback Contract, uncapped DPR &gt; 1.5, memory leaks.</div>
            <div><strong className="text-[var(--text-main)]">Iron Rule:</strong> Downgrade effect complexity, never loosen budget.</div>
          </div>
        </div>
      </div>

      {/* The 5-Part Fallback Contract */}
      <section className="hairline p-8 bg-[var(--bg-surface)] rounded-md space-y-6">
        <div className="flex justify-between items-baseline hairline-b pb-4">
          <div>
            <span className="font-mono text-xs text-[var(--accent-ember)] uppercase tracking-wider block">
              Level 3 Iron Rule
            </span>
            <h2 className="font-serif text-2xl mt-1">The Mandatory 5-Part Fallback Contract</h2>
          </div>
          <span className="font-mono text-xs text-[var(--status-sage)] font-bold">Hard Gate Enforced</span>
        </div>

        <p className="text-sm text-[var(--text-dim)] max-w-[65ch]">
          Every 3D scene, canvas hero, or WebGL element authored under Level 3 must implement all five fallback guarantees.
          If any clause is missing, <code className="mono">chaff gate</code> fails the build.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {[
            {
              part: 'Part 1',
              title: 'Lazy Loading of 3D Canvas',
              desc: 'Dynamic import post-hydration (next/dynamic with ssr: false). The 3D bundle never participates in or blocks Largest Contentful Paint (LCP).',
            },
            {
              part: 'Part 2',
              title: 'Static Poster Fallback',
              desc: 'High-fidelity static poster (WebP/AVIF/SVG) rendered during SSR. Permanently served when prefers-reduced-motion, saveData, or no WebGL is detected.',
            },
            {
              part: 'Part 3',
              title: 'Device Tiering via @chaff/tier',
              desc: 'Deterministic classification: Full (Tier 2), Lite (Tier 1), or Poster (Tier 0). Tier 0 hardware (<4GB RAM) never allocates WebGL contexts.',
            },
            {
              part: 'Part 4',
              title: 'Frame Governor & 1.5 DPR Cap',
              desc: 'Enforces setPixelRatio(Math.min(window.devicePixelRatio, 1.5)). Pauses loop offscreen via IntersectionObserver and when tab is hidden.',
            },
            {
              part: 'Part 5',
              title: '3D Payload Under 250 KB',
              desc: 'Combined initial 3D bundle chunk plus Draco/Meshopt compressed model geometry strictly under 250 KB gzipped.',
            },
          ].map((item) => (
            <div key={item.part} className="hairline p-4 rounded bg-[var(--bg-canvas)] space-y-2">
              <span className="font-mono text-xs font-bold text-[var(--accent-ember)]">{item.part}</span>
              <h3 className="font-serif text-base">{item.title}</h3>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
