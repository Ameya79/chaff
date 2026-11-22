import React from 'react';
import Link from 'next/link';

const CATEGORIES = [
  {
    cat: 'ui',
    name: 'UI & Layout Hygiene',
    tag: 'UI-001..009',
    count: 9,
    description: 'Anti-template layouts, straw/bark palette, 4/8px spatial rhythm, and WCAG AA contrast.',
    topTell: 'Bans purple/blue glow gradients and centered 3-card grids',
  },
  {
    cat: 'copy',
    name: 'Copy Authenticity & Voice',
    tag: 'COPY-001..009',
    count: 9,
    description: 'Elimination of LLM buzzwords, hollow adjectives, and synthetic claims.',
    topTell: 'Bans synthetic buzzwords, empty marketing claims, and unverified round numbers',
  },
  {
    cat: 'code',
    name: 'React & Next.js Idioms',
    tag: 'CODE-001..009',
    count: 9,
    description: 'Semantic markup, hydration purity, Server Components default, zero-any types.',
    topTell: 'Bans clickable divs and useEffect data fetching',
  },
  {
    cat: 'perf',
    name: 'Performance & Web Vitals',
    tag: 'PERF-001..009',
    count: 9,
    description: 'Self-hosted next/font, CLS under 0.10, LCP under 2.5s, route JS under 170 KB.',
    topTell: 'Bans layout-shifting banners and unoptimized raw assets',
  },
  {
    cat: 'mobile',
    name: 'Mobile Ergonomics',
    tag: 'MOBILE-001..009',
    count: 9,
    description: 'Dynamic viewport units (dvh), >=44px touch targets, zero 320px overflow.',
    topTell: 'Bans static screen-height units and viewport user-scalable=no',
  },
  {
    cat: 'a11y',
    name: 'Strict Accessibility',
    tag: 'A11Y-001..009',
    count: 9,
    description: 'WCAG AA color contrast, visible focus rings, ARIA labels, keyboard navigability.',
    topTell: 'Bans outline:none without visible fallback ring',
  },
  {
    cat: 'motion',
    name: 'Platform-Native Motion',
    tag: 'MOTION-001..009',
    count: 9,
    description: 'prefers-reduced-motion compliance, transform/opacity only, tactile springs.',
    topTell: 'Bans animating layout properties (width, height, top, left)',
  },
  {
    cat: 'three',
    name: '3D, WebGL & Shaders',
    tag: 'THREE-001..009',
    count: 9,
    description: '5-part Fallback Contract, @chaff/tier governor, 1.5 DPR cap, memory disposal.',
    topTell: 'Bans synchronous 3D imports blocking initial LCP',
  },
];

export function TaxonomyLedger() {
  return (
    <section className="space-y-6">
      {/* Broadsheet Masthead Header */}
      <div className="flex items-center justify-between gap-4 hairline-b pb-3 font-mono text-xs text-[var(--text-dim)]">
        <div className="flex items-center gap-2">
          <span className="text-[var(--accent-ember)] font-bold">04 //</span>
          <span className="uppercase tracking-widest text-[var(--text-main)] font-semibold">CORE TAXONOMY</span>
        </div>
        <div className="hidden sm:block">
          72 AUTOMATED VERIFICATION RULES // 8 DOMAINS
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-2">
        <div>
          <h2 className="font-serif text-3xl text-[var(--text-main)]">
            Architectural Category Ledger
          </h2>
          <p className="text-[var(--text-dim)] mt-1 max-w-[65ch]">
            Nine rules per category across eight domains. Each rule specifies verifiable detection logic and concrete craft solutions.
          </p>
        </div>
        <Link href="/rules" className="btn text-xs font-mono">
          Browse Full Rules Directory &rarr;
        </Link>
      </div>

      {/* Continuous Ruled Broadsheet Ledger (Zero Cards) */}
      <div className="hairline-y divide-y divide-[var(--border-line)]">
        {CATEGORIES.map((c) => (
          <Link
            key={c.cat}
            href={`/rules?category=${c.cat}`}
            className="group py-5 px-3 sm:px-4 transition-colors hover:bg-[var(--bg-surface)]/60 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline min-h-[44px]"
          >
            {/* Column 1: Code Tag & Rule Count */}
            <div className="md:col-span-3 flex items-baseline justify-between md:justify-start gap-4">
              <span className="font-mono text-sm font-bold text-[var(--accent-ember)]">
                {c.tag}
              </span>
              <span className="font-mono text-[11px] text-[var(--text-dim)] uppercase">
                [{c.count} Rules]
              </span>
            </div>

            {/* Column 2: Category Name */}
            <div className="md:col-span-3">
              <h3 className="font-serif text-lg text-[var(--text-main)] group-hover:text-[var(--accent-ember)] transition-colors">
                {c.name}
              </h3>
            </div>

            {/* Column 3: Craft Description */}
            <div className="md:col-span-4">
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                {c.description}
              </p>
              <div className="pt-1.5 font-mono text-[11px] text-[var(--status-warn)]">
                <span className="font-semibold">Bans: </span>
                <span>{c.topTell}</span>
              </div>
            </div>

            {/* Column 4: Action Indicator */}
            <div className="md:col-span-2 flex justify-end items-center font-mono text-xs text-[var(--text-dim)] group-hover:text-[var(--accent-ember)] transition-colors">
              <span>Inspect &rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
