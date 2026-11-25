import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LevelsSpecimenRail } from '../../components/LevelsSpecimenRail';

export const metadata: Metadata = {
  title: 'Operational Levels — Clean, Authored & Risk',
  description:
    'Understand Chaff Level 1 (Clean), Level 2 (Authored), Level 3 (Risk), and the mandatory 5-part Fallback Contract.',
};

const FALLBACK_CLAUSES = [
  { part: '01', title: 'Lazy Dynamic Import', desc: 'Load 3D scenes post-hydration via next/dynamic({ ssr: false }) so FCP and LCP remain unblocked.' },
  { part: '02', title: 'Static SVG / Image Poster', desc: 'Render an SSR-ready static poster immediately for Tier 0, reduced motion, and data-saver clients.' },
  { part: '03', title: 'Device Profiling (@chaff/tier)', desc: 'Classify hardware into full, lite, or poster tiers deterministically before allocating GPU state.' },
  { part: '04', title: '1.5 DPR Cap & Offscreen Pause', desc: 'Clamp devicePixelRatio at 1.5, pause via IntersectionObserver and document.hidden, and auto-degrade below 45 fps.' },
  { part: '05', title: 'Resource Disposal & <250KB Cap', desc: 'Explicitly dispose buffers, shaders, textures, and contexts on unmount while keeping lazy 3D payloads under 250 KB gzip.' },
];

export default function LevelsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-12">
      <header className="space-y-3 pb-6 hairline-b">
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-[var(--text-dim)]">
          <span className="uppercase tracking-[0.16em] text-[var(--accent-ember)] font-semibold">
            Contracts &amp; Guardrails
          </span>
          <span>Identity Lock Enforced Across Levels 1–3</span>
        </div>
        <h1 className="font-serif text-[var(--text-main)]">
          Three Progressive Creative Levels
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-dim)] max-w-[65ch] leading-relaxed">
          Chaff separates safe cleanup from editorial redesign and experimental WebGL. Every level preserves locked identity tokens in <code className="mono">.chaff/identity.json</code>.
        </p>
      </header>

      <LevelsSpecimenRail />

      {/* 5-Part Fallback Contract */}
      <section className="hairline bg-[var(--bg-surface)] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-3 min-w-0">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent-ember)] font-bold block">
            Level 3 Guarantee
          </span>
          <h2 className="font-serif text-3xl text-[var(--text-main)]">
            Mandatory 5-Part Fallback Contract
          </h2>
          <p className="text-sm text-[var(--text-dim)] leading-relaxed">
            Every WebGL or 3D experience must satisfy all five clauses verified by <code className="mono">chaff gate --level 3</code>. If a check fails, Chaff downgrades the visual effect, never the performance budget.
          </p>
          <div className="pt-2">
            <Link href="/gate" className="btn primary text-xs font-mono">
              Inspect Live Gate Verification
            </Link>
          </div>
        </div>

        <div className="lg:col-span-8 lg:border-l border-[var(--border-line)] lg:pl-8 divide-y divide-[var(--border-line)] min-w-0">
          {FALLBACK_CLAUSES.map((c) => (
            <div key={c.part} className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-baseline">
              <span className="sm:col-span-2 font-mono text-xs font-bold text-[var(--accent-ember)]">
                Part {c.part}
              </span>
              <h3 className="sm:col-span-4 font-serif text-lg text-[var(--text-main)]">
                {c.title}
              </h3>
              <p className="sm:col-span-6 text-xs sm:text-sm text-[var(--text-dim)] leading-relaxed">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
