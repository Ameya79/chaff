'use client';

import React from 'react';
import Link from 'next/link';
import { RollingCounter } from './RollingCounter';

export function HomeHero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-4 sm:pt-8">
      {/* Left Column: Asymmetric Editorial Manifest */}
      <div className="lg:col-span-7 space-y-6">
        <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] px-3 py-1 hairline rounded bg-[var(--bg-surface)]">
          <span className="font-bold">01</span>
          <span>/</span>
          <span>THE WINNOWING STANDARD</span>
        </div>

        <h1 className="tracking-tight text-[var(--text-main)] font-serif">
          Winnow the husk from the grain.
        </h1>

        <p className="text-lg text-[var(--text-dim)] leading-relaxed">
          AI coding agents flood codebases with identical fingerprints: purple/blue glow gradients, centered heroes, three equal cards, and synthetic metrics.
          Chaff audits the rendered page as it loads, locks intentional brand tokens, enforces three operational contracts, and fails the pull request when performance degrades.
        </p>

        {/* Quick Install Ledger Callout */}
        <div className="hairline p-4 rounded bg-[var(--bg-surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-main)]">
            <span className="text-[var(--accent-ember)] font-bold">$</span>
            <code>npx chaff init --level 2</code>
          </div>
          <span className="font-mono text-[11px] text-[var(--text-dim)] uppercase">
            Auto-detects IDE • Zero config
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
            Open Sandbox →
          </Link>
        </div>
      </div>

      {/* Right Column: Live Audit Transformation Sheet with Rolling Odometer */}
      <div className="lg:col-span-5 hairline p-6 sm:p-7 bg-[var(--bg-surface)] rounded-md space-y-6 shadow-sm">
        <div className="flex justify-between items-baseline hairline-b pb-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-dim)] block">
              EMPIRICAL AUDIT REPORT
            </span>
            <span className="font-serif text-lg font-bold text-[var(--text-main)] mt-0.5 block">
              Fixture: saas-landing
            </span>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs text-[var(--status-sage)] font-bold block">
              <RollingCounter value={48} prefix="+" suffix="pt Delta" />
            </span>
            <span className="font-mono text-[10px] text-[var(--text-dim)]">Net Score Leap</span>
          </div>
        </div>

        {/* Before vs After Score Registers */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="hairline p-4 rounded bg-[var(--bg-canvas)] border-[var(--status-warn)]/30">
            <span className="block text-[11px] font-mono text-[var(--status-warn)] uppercase font-semibold">
              Before Chaff
            </span>
            <div className="mt-1">
              <RollingCounter value={48} className="font-serif text-4xl text-[var(--text-main)]" />
            </div>
            <span className="text-[11px] text-[var(--text-dim)] font-mono block mt-1">
              14 open AI tells
            </span>
          </div>

          <div className="hairline p-4 rounded bg-[var(--bg-canvas)] border-[var(--status-sage)]">
            <span className="block text-[11px] font-mono text-[var(--status-sage)] uppercase font-semibold">
              After Chaff
            </span>
            <div className="mt-1">
              <RollingCounter value={96} className="font-serif text-4xl text-[var(--text-main)]" />
            </div>
            <span className="text-[11px] text-[var(--status-sage)] font-mono block mt-1">
              0 open • 1 brand waived
            </span>
          </div>
        </div>

        {/* Ruled Area Breakdown Ledger */}
        <div className="space-y-3 font-mono text-xs pt-1">
          <div>
            <div className="flex justify-between text-[var(--text-dim)] mb-1">
              <span>Visual & Layout Rhythm</span>
              <span className="text-[var(--text-main)] font-bold">94 / 100</span>
            </div>
            <div className="w-full bg-[var(--border-line)] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[var(--status-sage)] h-full w-[94%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[var(--text-dim)] mb-1">
              <span>Copy Authenticity</span>
              <span className="text-[var(--text-main)] font-bold">100 / 100</span>
            </div>
            <div className="w-full bg-[var(--border-line)] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[var(--status-sage)] h-full w-[100%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[var(--text-dim)] mb-1">
              <span>Performance & Mobile Gate</span>
              <span className="text-[var(--text-main)] font-bold">95 / 100</span>
            </div>
            <div className="w-full bg-[var(--border-line)] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[var(--status-sage)] h-full w-[95%]" />
            </div>
          </div>
        </div>

        {/* Tally Mark Guarantee */}
        <div className="pt-2 hairline-t flex justify-between items-center text-[11px] font-mono text-[var(--text-dim)]">
          <span>Identity Lock: <strong className="text-[var(--status-sage)]">CONFIRMED</strong></span>
          <span>Waivers: <strong className="text-[var(--text-main)]">1 Approved</strong></span>
        </div>
      </div>
    </section>
  );
}
