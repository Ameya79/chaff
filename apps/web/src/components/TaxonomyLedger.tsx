import React from 'react';
import Link from 'next/link';

const CATEGORIES = [
  {
    cat: 'ui',
    name: 'UI & Layout Hygiene',
    tag: 'UI-001..009',
    description: 'Asymmetric layouts, tinted neutrals, tabular numerals, and balanced display typography.',
    bans: 'Purple glow orbs and 3-card boilerplate grids',
  },
  {
    cat: 'copy',
    name: 'Copy Authenticity',
    tag: 'COPY-001..009',
    description: 'Domain-specific technical prose, verifiable measurements, and honest product copy.',
    bans: 'LLM buzzword salads and unattributed round statistics',
  },
  {
    cat: 'code',
    name: 'React & Next.js Idioms',
    tag: 'CODE-001..009',
    description: 'Server Components by default, semantic controls, next/image, and strict TypeScript.',
    bans: 'Clickable divs, console logs, and premature use client',
  },
  {
    cat: 'perf',
    name: 'Performance & Vitals',
    tag: 'PERF-001..009',
    description: 'Self-hosted next/font with swap, zero CLS, and lean baseline JS budgets.',
    bans: 'Layout-shifting media and monolithic client bundles',
  },
  {
    cat: 'mobile',
    name: 'Mobile Ergonomics',
    tag: 'MOBILE-001..009',
    description: 'Dynamic viewport height (dvh), >= 44px touch targets, 16px form controls, 320px fit.',
    bans: 'Horizontal overflow, sub-44px targets, and 100vh traps',
  },
  {
    cat: 'a11y',
    name: 'Strict Accessibility',
    tag: 'A11Y-001..009',
    description: 'WCAG AA contrast >= 4.5:1, visible focus rings, landmarks, and labeled inputs.',
    bans: 'Low-contrast gray labels and stripped focus outlines',
  },
  {
    cat: 'motion',
    name: 'Platform-Native Motion',
    tag: 'MOTION-001..009',
    description: 'prefers-reduced-motion compliance and compositor-only transform/opacity transitions.',
    bans: 'Layout property animation and stacked animation packages',
  },
  {
    cat: 'three',
    name: '3D, WebGL & Shaders',
    tag: 'THREE-001..009',
    description: '5-part Fallback Contract, @chaff/tier profiling, 1.5 DPR cap, and clean disposal.',
    bans: 'Uncapped DPR, blocking 3D bundles, and zombie WebGL contexts',
  },
];

export function TaxonomyLedger() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 hairline-b">
        <div className="space-y-1.5">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent-ember)] font-semibold block">
            72 Automated Rules
          </span>
          <h2 className="font-serif text-[var(--text-main)]">
            Eight audit domains enforced in CI
          </h2>
          <p className="text-sm text-[var(--text-dim)] max-w-[60ch]">
            Select any domain below to inspect canonical bad-vs-good code patterns, detection logic, and documented waiver criteria.
          </p>
        </div>

        <Link href="/rules" className="btn text-xs font-mono shrink-0">
          Open Full Rule Catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-line)] hairline-y">
        {CATEGORIES.map((c) => (
          <Link
            key={c.cat}
            href={`/rules?category=${c.cat}`}
            className="group p-5 bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] transition-colors flex flex-col justify-between gap-3 min-h-[44px] min-w-0"
          >
            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-serif text-xl text-[var(--text-main)] group-hover:text-[var(--accent-ember)] transition-colors">
                  {c.name}
                </h3>
                <span className="font-mono text-xs font-bold text-[var(--accent-ember)] shrink-0">
                  {c.tag}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-dim)] leading-relaxed">
                {c.description}
              </p>
            </div>

            <div className="pt-2 hairline-t flex items-center justify-between gap-2 font-mono text-xs">
              <span className="text-[var(--status-warn)] truncate">
                Flags: {c.bans}
              </span>
              <span className="text-[var(--text-main)] group-hover:text-[var(--accent-ember)] shrink-0 font-semibold">
                Inspect
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
