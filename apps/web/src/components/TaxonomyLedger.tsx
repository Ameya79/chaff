import React from 'react';
import { DomainPrint } from './DomainPrint';
import Link from 'next/link';

const CATEGORIES = [
  { idx: '01', cat: 'ui', name: 'UI & Layout', tag: 'UI-001..009', caption: 'Visual hierarchy, balanced grids, crisp contrast.' },
  { idx: '02', cat: 'copy', name: 'Copy Voice', tag: 'COPY-001..009', caption: 'Product-voiced prose without AI filler.' },
  { idx: '03', cat: 'code', name: 'Framework code', tag: 'CODE-001..009', caption: 'Semantic controls and framework-specific patterns.' },
  { idx: '04', cat: 'perf', name: 'Performance', tag: 'PERF-001..009', caption: 'Swapped fonts, zero CLS, lean baseline JS.' },
  { idx: '05', cat: 'mobile', name: 'Mobile Fit', tag: 'MOBILE-001..009', caption: 'dvh sizing, 44px tap targets, zero overflow.' },
  { idx: '06', cat: 'a11y', name: 'Accessibility', tag: 'A11Y-001..009', caption: 'WCAG AA contrast, clear focus, labeled controls.' },
  { idx: '07', cat: 'motion', name: 'Motion', tag: 'MOTION-001..009', caption: 'Reduced-motion rules and GPU-only keyframes.' },
  { idx: '08', cat: 'three', name: '3D & WebGL', tag: 'THREE-001..009', caption: 'Lazy scenes, DPR <= 1.5, < 250 KB chunk limit.' },
];

export function TaxonomyLedger() {
  return (
    <section className="rule-index py-10 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8 space-y-10 hairline-t">
      <div className="scroll-sheet flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-2">
          <h2 className="font-display text-[var(--text-main)]">
            72 rules across 8 domains.
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="print-pause"><input type="checkbox" /> Pause illustrations</label>
          <Link href="/rules" className="btn text-xs font-mono shrink-0">
          Browse All 72 &rarr;
          </Link>
        </div>
      </div>



      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-[var(--border-line)]">
        {CATEGORIES.map((c) => (
          <Link
            key={c.cat}
            href={`/rules?category=${c.cat}`}
            className="domain-link group relative border-t border-[var(--border-line)] sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0 p-3 sm:p-6  space-y-2.5 min-h-[44px] min-w-0 block"
          >
            <DomainPrint category={c.cat} />
            <div className="flex items-baseline justify-between gap-2 font-mono text-xs">
              <span className="text-[var(--text-dim)] group-hover:text-[var(--accent)] transition-colors duration-200 tabular-nums">
                {c.idx}
              </span>
              <span className="text-[11px] text-[var(--accent)] font-medium">
                {c.tag}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium text-base text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors duration-200">
                {c.name}
              </h3>
              <span
                className="font-mono text-xs text-[var(--text-dim)] group-hover:text-[var(--accent)] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
                aria-hidden="true"
              >
                &rarr;
              </span>
            </div>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              {c.caption}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
