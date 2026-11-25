import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroTransformationStage } from '../components/HeroTransformationStage';
import { ProtocolSection } from '../components/ProtocolSection';
import { TaxonomyLedger } from '../components/TaxonomyLedger';

export const metadata: Metadata = {
  title: 'Chaff — Archival Proof Sheet & Level 3 Showcase',
  description:
    'Watch generic AI slop transform into authored UI while preserving locked brand identity and passing strict Level 3 WebGL performance gates.',
};

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-5 space-y-14 sm:space-y-20">
      <HeroTransformationStage />

      <ProtocolSection />

      <TaxonomyLedger />

      {/* Direct Verification Pathways */}
      <section className="hairline bg-[var(--bg-surface)] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-[60ch]">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--status-sage)] font-semibold block">
            Empirical Proof
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-main)]">
            Verify on real workspace fixtures or paste your own JSX
          </h2>
          <p className="text-sm text-[var(--text-dim)] leading-relaxed">
            Compare Before and After rendered browser frames across five local fixtures in the Gallery, or test live AST checks and one-click fixes in the Playground.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/gallery" className="btn primary text-sm">
            Inspect 5 Visual Case Studies
          </Link>
          <Link href="/playground" className="btn text-sm">
            Open Live Playground
          </Link>
          <Link href="/gate" className="btn text-sm">
            Check Level 3 Gate
          </Link>
        </div>
      </section>
    </div>
  );
}
