import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { WinnowThreeHero } from '../components/WinnowThreeHero';
import { HeroTransformationStage } from '../components/HeroTransformationStage';
import { ProtocolSection } from '../components/ProtocolSection';
import { TaxonomyLedger } from '../components/TaxonomyLedger';

export const metadata: Metadata = {
  title: 'Chaff — Paste the repo. Keep what is yours.',
  description:
    'Share the Chaff repo link alongside your prompt in chat. Agents inspect your project first, ask tailored Level 1–3 questions, and enforce strict WebGL & accessibility budgets.',
};

export default function HomePage() {
  return (
    <div>
      {/* Section 1: Minimal Chat-First Hero + Refractive WebGL2 Wave */}
      <WinnowThreeHero />

      {/* Section 2: Interactive Repo-Paste -> Tailored Questions -> Transformation Stage */}
      <HeroTransformationStage />

      {/* Section 3: Concise 7-Step Protocol Index */}
      <ProtocolSection />

      {/* Section 4: 72 Rules Across 8 Domains */}
      <TaxonomyLedger />

      {/* Section 5: Clean Minimal Closing Action Band */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8 hairline-t">
        <div className="scroll-sheet flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent)] font-medium block">
              Start In Seconds
            </span>
            <h2 className="font-display text-[var(--text-main)]">
              Paste the link in chat or test live AST rules here.
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
