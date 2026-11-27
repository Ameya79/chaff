import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FrameworkRail } from '../components/FrameworkRail';
import { HeroTransformationStage } from '../components/HeroTransformationStage';
import { ProtocolSection } from '../components/ProtocolSection';
import { TaxonomyLedger } from '../components/TaxonomyLedger';

export const metadata: Metadata = {
  title: 'Chaff — Paste the repo. Keep what is yours.',
  description:
    'Give a small coding agent a design brief, visual references and a browser check with one GitHub link.',
};

export default function HomePage() {
  return (
    <div>
      <HeroTransformationStage />
      <FrameworkRail />

      {/* Section 3: Concise 7-Step Protocol Index */}
      <ProtocolSection />

      {/* Section 4: 72 Rules Across 8 Domains */}
      <TaxonomyLedger />

      {/* Section 5: Clean Minimal Closing Action Band */}
      <section className="closing-panel py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-8 hairline-t">
        <div className="scroll-sheet flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3 max-w-xl">

            <h2 className="font-display text-[var(--text-main)]">
              Try Chaff on your interface.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/install" className="btn primary font-mono text-xs">
              Chat Prompt &amp; Setup &rarr;
            </Link>
            <Link href="/playground" className="btn font-mono text-xs">
              Playground
            </Link>
            <Link href="/gate" className="btn ghost font-mono text-xs">
              Gate Telemetry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
