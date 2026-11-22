import React from 'react';
import { HomeHero } from '../components/HomeHero';
import { SplitSheetInspection } from '../components/SplitSheetInspection';
import { WindControl } from '../components/WindControl';
import { ProtocolSection } from '../components/ProtocolSection';
import { TaxonomyLedger } from '../components/TaxonomyLedger';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-20 sm:space-y-24">
      {/* 1. Asymmetric Editorial Masthead with Live Transformation Ledger */}
      <HomeHero />

      {/* 1.5. The Signature Split Sheet Inspection: Slop vs Grain */}
      <SplitSheetInspection />

      {/* 2. Signature Moment: The Winnowing Wind Control */}
      <WindControl />

      {/* 3. The 7-Step Autonomous Workflow Broadsheet */}
      <ProtocolSection />

      {/* 4. Core Taxonomy of 72 Rules Ledger */}
      <TaxonomyLedger />
    </div>
  );
}
