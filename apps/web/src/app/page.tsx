import { RepositorySupport } from '../components/RepositorySupport';
import React from 'react';
import { pageMetadata } from '../lib/discovery';
import Link from 'next/link';
import { FrameworkRail } from '../components/FrameworkRail';
import { HeroTransformationStage } from '../components/HeroTransformationStage';
import { ProtocolSection } from '../components/ProtocolSection';
import { TaxonomyLedger } from '../components/TaxonomyLedger';

export const metadata = pageMetadata('/');

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
              Support Chaff.
            </h2>
            <p>Use Chaff with smaller models in Codex, Claude Code, Antigravity, Windsurf, or Cursor. If the guide improves a real screen, star the project on GitHub.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/install" className="btn primary font-mono text-xs">
              Chat Prompt &amp; Setup &rarr;
            </Link>
            <Link href="/playground" className="btn font-mono text-xs">
              Playground
            </Link>
            <RepositorySupport />
          </div>
        </div>
      </section>
    </div>
  );
}
