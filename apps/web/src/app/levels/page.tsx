import React from 'react';
import { pageMetadata } from '../../lib/discovery';
import Link from 'next/link';
import { LevelsSpecimenRail } from '../../components/LevelsSpecimenRail';
import { PageHeader } from '../../components/PageHeader';

export const metadata = pageMetadata('/levels');

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
      <PageHeader
        eyebrow="Contracts"
        title="Three Creative Levels"
        lead={
          <>
            Every level preserves locked identity tokens in{' '}
            <code className="mono">.chaff/identity.json</code>.
          </>
        }
      />

      <LevelsSpecimenRail />

      {/* 5-Part Fallback Contract */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-4">
        <div className="scroll-sheet lg:col-span-4 space-y-4 min-w-0">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent)] font-medium block">
            Level 3 Contract
          </span>
          <h2 className="font-display text-3xl text-[var(--text-main)]">
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

        <div className="lg:col-span-8 divide-y divide-[var(--border-line)] hairline-y min-w-0">
          {FALLBACK_CLAUSES.map((c) => (
            <div
              key={c.part}
              className="scroll-sheet py-5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-baseline"
            >
              <span className="sm:col-span-2 font-mono text-sm font-semibold text-[var(--accent)] tabular-nums">
                {c.part}.
              </span>
              <h3 className="sm:col-span-4 font-semibold text-base text-[var(--text-main)]">
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
