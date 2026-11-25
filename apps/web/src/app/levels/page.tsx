import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LevelsSpecimenRail } from '../../components/LevelsSpecimenRail';

export const metadata: Metadata = {
  title: 'Levels',
  description:
    'Chaff Level 1 (Clean), Level 2 (Authored), Level 3 (Risk), and the 5-part Fallback Contract.',
};

const FALLBACK_CLAUSES = [
  { part: '01', title: 'Lazy Import', desc: 'Load 3D via next/dynamic({ ssr: false }) after initial paint.' },
  { part: '02', title: 'Static Poster', desc: 'Render SSR SVG poster for Tier 0, reduced motion, and saveData.' },
  { part: '03', title: '@chaff/tier', desc: 'Classify full, lite, or poster tiers before GPU allocation.' },
  { part: '04', title: '1.5 DPR Cap', desc: 'Clamp DPR <= 1.5, pause offscreen and hidden, step down < 45 fps.' },
  { part: '05', title: 'Disposal & Budget', desc: 'Dispose GPU buffers on unmount and keep lazy 3D <= 250 KB gzip.' },
];

export default function LevelsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20 space-y-20">
      <header className="space-y-3">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-ember)] block">
          Contracts
        </span>
        <h1 className="font-serif text-[var(--text-main)]">
          Three Creative Levels
        </h1>
        <p className="text-base text-[var(--text-dim)] max-w-[46ch]">
          Every level preserves locked identity tokens in <code className="mono">.chaff/identity.json</code>.
        </p>
      </header>

      <LevelsSpecimenRail />

      {/* 5-Part Fallback Contract */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start hairline-t pt-14">
        <div className="lg:col-span-4 space-y-4 min-w-0">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-ember)] block">
            Level 3 Contract
          </span>
          <h2 className="font-serif text-3xl text-[var(--text-main)]">
            5-Part Fallback
          </h2>
          <p className="text-sm text-[var(--text-dim)]">
            Verified automatically by <code className="mono">chaff gate --level 3</code>.
          </p>
          <div className="pt-2">
            <Link href="/gate" className="btn primary text-xs font-mono">
              Live Gate &rarr;
            </Link>
          </div>
        </div>

        <div className="lg:col-span-8 divide-y divide-[var(--border-line)] min-w-0">
          {FALLBACK_CLAUSES.map((c) => (
            <div key={c.part} className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-baseline">
              <span className="sm:col-span-2 font-mono text-xs text-[var(--accent-ember)]">
                Part {c.part}
              </span>
              <h3 className="sm:col-span-4 font-serif text-lg text-[var(--text-main)]">
                {c.title}
              </h3>
              <p className="sm:col-span-6 text-sm text-[var(--text-dim)]">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
