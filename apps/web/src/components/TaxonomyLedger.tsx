import React from 'react';
import Link from 'next/link';

const CATEGORIES = [
  {
    cat: 'ui',
    name: 'UI & Layout',
    tag: 'UI-001..009',
    caption: 'Asymmetric grids, tinted surfaces, balanced type.',
  },
  {
    cat: 'copy',
    name: 'Copy Voice',
    tag: 'COPY-001..009',
    caption: 'Domain nouns and real telemetry over buzzwords.',
  },
  {
    cat: 'code',
    name: 'React & Next',
    tag: 'CODE-001..009',
    caption: 'Server Components, semantic buttons, strict types.',
  },
  {
    cat: 'perf',
    name: 'Performance',
    tag: 'PERF-001..009',
    caption: 'Swap fonts, zero CLS, lean baseline bundles.',
  },
  {
    cat: 'mobile',
    name: 'Mobile Fit',
    tag: 'MOBILE-001..009',
    caption: 'dvh heights, 44px targets, 320px zero overflow.',
  },
  {
    cat: 'a11y',
    name: 'Accessibility',
    tag: 'A11Y-001..009',
    caption: 'AA contrast, focus rings, labeled controls.',
  },
  {
    cat: 'motion',
    name: 'Motion',
    tag: 'MOTION-001..009',
    caption: 'Reduced motion queries, transform and opacity only.',
  },
  {
    cat: 'three',
    name: '3D & WebGL',
    tag: 'THREE-001..009',
    caption: '5-part contract, 1.5 DPR cap, < 250 KB lazy chunk.',
  },
];

export function TaxonomyLedger() {
  return (
    <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-ember)] block">
            Taxonomy
          </span>
          <h2 className="font-serif text-[var(--text-main)]">
            72 rules across 8 domains.
          </h2>
        </div>

        <Link href="/rules" className="btn text-xs font-mono shrink-0">
          All 72 Rules &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 hairline-t pt-8">
        {CATEGORIES.map((c) => (
          <Link
            key={c.cat}
            href={`/rules?category=${c.cat}`}
            className="group rounded-xl p-4 -mx-4 hover:bg-[var(--bg-surface)] transition-colors space-y-2 min-h-[44px] min-w-0 block"
          >
            <span className="font-mono text-[11px] text-[var(--accent-ember)] block">
              {c.tag}
            </span>
            <h3 className="font-serif text-xl text-[var(--text-main)] group-hover:text-[var(--accent-ember)] transition-colors">
              {c.name}
            </h3>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              {c.caption}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
