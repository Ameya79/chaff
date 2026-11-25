import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { WinnowThreeHero } from '../components/WinnowThreeHero';
import { HeroTransformationStage } from '../components/HeroTransformationStage';
import { ProtocolSection } from '../components/ProtocolSection';
import { TaxonomyLedger } from '../components/TaxonomyLedger';

export const metadata: Metadata = {
  title: 'Chaff — Winnow the slop. Keep the grain.',
  description:
    'Dark Obsidian Atelier showcase for Chaff: full-bleed Three.js 3D winnowing field, Kestrel transformation, and Level 3 performance gates.',
};

export default function HomePage() {
  return (
    <div>
      <WinnowThreeHero />

      <HeroTransformationStage />

      <ProtocolSection />

      <TaxonomyLedger />

      {/* Open Closing Pathway */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8 hairline-t flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--status-sage)] block">
            Verify Locally
          </span>
          <h2 className="font-serif text-[var(--text-main)]">
            Test your own JSX.
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/playground" className="btn primary text-sm">
            Open Playground
          </Link>
          <Link href="/gallery" className="btn text-sm">
            5 Case Studies
          </Link>
          <Link href="/gate" className="btn text-sm">
            Level 3 Gate
          </Link>
        </div>
      </section>
    </div>
  );
}
