import React from 'react';
import Link from 'next/link';

const CATEGORIES = [
  {
    cat: 'ui',
    name: 'UI & Layout Hygiene',
    tag: 'UI-001..009',
    count: 9,
    description: 'Anti-template compositions, straw/bark palette, 4/8px spatial grid, and WCAG AA contrast enforcement.',
    topTell: 'Bans purple/blue glow gradients and centered 3-card grids',
  },
  {
    cat: 'copy',
    name: 'Copy Authenticity & Voice',
    tag: 'COPY-001..009',
    count: 9,
    description: 'Elimination of generic LLM synthetic rhetoric, hollow adjectives, and round statistical claims.',
    topTell: 'Bans synthetic buzzwords, empty marketing claims, and unverified round numbers',
  },
  {
    cat: 'code',
    name: 'React & Next.js Idioms',
    tag: 'CODE-001..009',
    count: 9,
    description: 'Semantic HTML markup, hydration purity, Server Components by default, and strict zero-any types.',
    topTell: 'Bans clickable divs and useEffect data fetching',
  },
  {
    cat: 'perf',
    name: 'Performance & Web Vitals',
    tag: 'PERF-001..009',
    count: 9,
    description: 'Enforces self-hosted next/font, CLS under 0.10, LCP under 2.5s, and route JS under 170 KB gzip.',
    topTell: 'Bans layout-shifting banners and unoptimized raw assets',
  },
  {
    cat: 'mobile',
    name: 'Mobile Ergonomics',
    tag: 'MOBILE-001..009',
    count: 9,
    description: 'Dynamic viewport units (dvh), >=44px physical touch targets, and zero horizontal overflow at 320px.',
    topTell: 'Bans static screen-height units and viewport user-scalable=no',
  },
  {
    cat: 'a11y',
    name: 'Strict Accessibility',
    tag: 'A11Y-001..009',
    count: 9,
    description: 'Uncompromising WCAG AA color contrast, visible focus rings, ARIA labels, and keyboard navigability.',
    topTell: 'Bans outline:none without visible fallback ring',
  },
  {
    cat: 'motion',
    name: 'Platform-Native Motion',
    tag: 'MOTION-001..009',
    count: 9,
    description: 'Strict prefers-reduced-motion compliance, hardware-accelerated transform/opacity only, tactile springs.',
    topTell: 'Bans animating layout properties (width, height, top, left)',
  },
  {
    cat: 'three',
    name: '3D, WebGL & Shaders',
    tag: 'THREE-001..009',
    count: 9,
    description: 'The mandatory 5-part Fallback Contract, @chaff/tier governor, 1.5 DPR cap, and memory disposal.',
    topTell: 'Bans synchronous 3D imports blocking initial LCP',
  },
];

export function TaxonomyLedger() {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)]">
          04 / CORE TAXONOMY
        </span>
        <div className="flex-1 hairline-b" />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-serif text-3xl text-[var(--text-main)]">
            72 Automated Verification Rules
          </h2>
          <p className="text-[var(--text-dim)] mt-1">
            Nine rules per category across eight domains. Each rule specifies verifiable detection logic and concrete craft solutions.
          </p>
        </div>
        <Link href="/rules" className="btn text-xs font-mono">
          Browse Rules Directory →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((c) => (
          <Link
            key={c.cat}
            href={`/rules?category=${c.cat}`}
            className="hairline p-5 rounded-md bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] transition-colors group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-baseline font-mono text-xs text-[var(--accent-ember)]">
                <span className="font-bold">{c.tag}</span>
                <span className="px-1.5 py-0.5 rounded hairline bg-[var(--bg-canvas)] text-[var(--text-main)] text-[10px]">
                  {c.count} Rules
                </span>
              </div>
              <h3 className="font-serif text-lg text-[var(--text-main)] group-hover:text-[var(--accent-ember)] transition-colors">
                {c.name}
              </h3>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                {c.description}
              </p>
            </div>

            <div className="pt-2 hairline-t font-mono text-[11px] text-[var(--text-dim)]">
              <span className="text-[var(--status-warn)] block font-semibold">Tells Prevented:</span>
              <span className="line-clamp-2">{c.topTell}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
