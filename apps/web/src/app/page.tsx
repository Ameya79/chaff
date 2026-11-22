import React from 'react';
import { HomeHero } from '../components/HomeHero';
import { SplitSheetInspection } from '../components/SplitSheetInspection';
import { WindControl } from '../components/WindControl';
import { ProtocolSection } from '../components/ProtocolSection';
import { TaxonomyLedger } from '../components/TaxonomyLedger';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-24">
      {/* 1. Asymmetric Editorial Hero with Live Transformation Sheet */}
      <HomeHero />

      {/* 1.5. The Signature Split Sheet Inspection: Slop vs Grain */}
      <SplitSheetInspection />

      {/* 2. Signature Moment: The Winnowing Wind Control */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)]">
            02 / WINNOWING FLOOR SIMULATION
          </span>
          <div className="flex-1 hairline-b" />
        </div>
        <WindControl />
      </section>

      {/* 3. The 7-Step Autonomous Workflow */}
      <ProtocolSection />

      {/* 4. Core Taxonomy of 72 Rules */}
      <TaxonomyLedger />
    </div>
  );
}
