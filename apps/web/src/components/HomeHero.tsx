'use client';

import React from 'react';
import Link from 'next/link';
import { RollingCounter } from './RollingCounter';

export function HomeHero() {
  return (
    <section className="pt-2 sm:pt-6">
      {/* Editorial Masthead Rule */}
      <div className="flex items-center justify-between gap-4 hairline-b pb-3 mb-8 font-mono text-xs text-[var(--text-dim)]">
        <div className="flex items-center gap-2">
          <span className="text-[var(--accent-ember)] font-bold">01 //</span>
          <span className="uppercase tracking-widest text-[var(--text-main)] font-semibold">THE WINNOWING STANDARD</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>SPEC: PROTOCOL V0.1</span>
          <span>•</span>
          <span>IDENTITY LOCK: ENFORCED</span>
          <span>•</span>
          <span className="text-[var(--status-sage)] font-semibold">ALL GATES ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Asymmetric Editorial Manifest */}
        <div className="lg:col-span-7 space-y-6">
          <h1 className="tracking-tight text-[var(--text-main)] font-serif leading-[1.08]">
            Winnow the husk from the grain.
          </h1>

          <p className="text-lg text-[var(--text-dim)] leading-relaxed measure">
            AI coding agents flood codebases with identical fingerprints: purple/blue glow gradients, centered heroes, three equal cards, and synthetic metrics.
            Chaff audits the rendered page as it loads, locks intentional brand tokens, enforces three operational contracts, and fails the pull request when performance degrades.
          </p>

          {/* Continuous Ruled Install Ledger Row */}
          <div className="hairline-y py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-[var(--text-main)]">
              <span className="text-[var(--accent-ember)] font-bold">$</span>
              <code className="text-sm font-semibold">npx chaff init --level 2</code>
            </div>
            <span className="text-[11px] text-[var(--text-dim)] uppercase tracking-wider">
              Auto-detects IDE // Zero config
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/install" className="btn primary">
              Install Toolkit
            </Link>
            <Link href="/rules" className="btn">
              Browse 72 Rules
            </Link>
            <Link
              href="/playground"
              className="btn bg-transparent border-transparent hover:border-[var(--border-line)] text-[var(--text-dim)] hover:text-[var(--text-main)]"
            >
              Open Sandbox &rarr;
            </Link>
          </div>
        </div>

        {/* Right Column: Continuous Ruled Inspection Ledger (Integrated Broadsheet Grid, Zero Floating Card) */}
        <div className="lg:col-span-5 pt-8 lg:pt-0 lg:pl-10 lg:border-l border-[var(--border-line)] flex flex-col justify-between space-y-6">
          {/* Ledger Sheet Header */}
          <div className="flex justify-between items-baseline hairline-b pb-4">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent-ember)] font-bold block">
                SPECIMEN // SAAS-LANDING
              </span>
              <span className="font-serif text-xl font-bold text-[var(--text-main)] mt-0.5 block">
                Empirical Transformation Ledger
              </span>
            </div>
            <div className="text-right">
              <span className="font-mono text-sm text-[var(--status-sage)] font-bold block">
                <RollingCounter value={48} prefix="+" suffix="pt Delta" />
              </span>
              <span className="font-mono text-[10px] text-[var(--text-dim)] uppercase">Net Score Leap</span>
            </div>
          </div>

          {/* Continuous Columnar Score Registers (Zero Boxed Cards) */}
          <div className="grid grid-cols-2 hairline-b pb-5 divide-x divide-[var(--border-line)]">
            <div className="pr-4 sm:pr-6 space-y-1">
              <span className="block text-[10px] font-mono text-[var(--status-warn)] uppercase font-bold tracking-wider">
                Before Chaff //
              </span>
              <div className="pt-1">
                <RollingCounter value={48} className="font-serif text-5xl text-[var(--text-main)]" />
              </div>
              <span className="text-[11px] text-[var(--text-dim)] font-mono block pt-1">
                14 open AI design tells
              </span>
            </div>

            <div className="pl-4 sm:pl-6 space-y-1">
              <span className="block text-[10px] font-mono text-[var(--status-sage)] uppercase font-bold tracking-wider">
                After Chaff //
              </span>
              <div className="pt-1">
                <RollingCounter value={96} className="font-serif text-5xl text-[var(--status-sage)] font-bold" />
              </div>
              <span className="text-[11px] text-[var(--status-sage)] font-mono block pt-1">
                0 tells • 1 brand waived
              </span>
            </div>
          </div>

          {/* Ruled Breakdown Rows */}
          <div className="space-y-3 font-mono text-xs divide-y divide-[var(--border-line)]">
            <div className="pt-2 flex justify-between items-center text-[var(--text-dim)]">
              <span>Visual &amp; Layout Rhythm</span>
              <span className="text-[var(--text-main)] font-bold tabular-nums">94 / 100</span>
            </div>

            <div className="pt-2 flex justify-between items-center text-[var(--text-dim)]">
              <span>Copy Authenticity</span>
              <span className="text-[var(--text-main)] font-bold tabular-nums">100 / 100</span>
            </div>

            <div className="pt-2 flex justify-between items-center text-[var(--text-dim)]">
              <span>Performance &amp; Mobile Gate</span>
              <span className="text-[var(--text-main)] font-bold tabular-nums">95 / 100</span>
            </div>
          </div>

          {/* Ruled Marginalia Footer */}
          <div className="pt-3 hairline-t flex flex-wrap justify-between items-center text-[11px] font-mono text-[var(--text-dim)] gap-2">
            <span>Identity Lock: <strong className="text-[var(--status-sage)]">CONFIRMED</strong></span>
            <span>Tally: <strong className="text-[var(--text-main)]">|||| |||| |||| ||</strong></span>
            <span>Waivers: <strong className="text-[var(--text-main)]">1 Approved</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}
