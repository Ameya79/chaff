import React from 'react';
import Link from 'next/link';
import { WindControl } from '../components/WindControl';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-24">
      {/* 1. Asymmetric Editorial Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] px-2.5 py-1 hairline rounded bg-[var(--bg-surface)]">
            <span>01</span>
            <span>/</span>
            <span>Design Audit & Enforcement Toolkit</span>
          </div>

          <h1 className="tracking-tight text-[var(--text-main)]">
            Winnow the husk from the grain.
          </h1>

          <p className="text-lg text-[var(--text-dim)] leading-relaxed">
            AI coding agents generate web UI with identical fingerprints: purple glows, centered heroes, three equal cards, and hollow buzzwords.
            Chaff audits the rendered page, locks your intentional brand tokens, enforces three creative contracts, and fails the pull request when the page gets slow.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/install" className="btn primary">
              Install Toolkit
            </Link>
            <Link href="/rules" className="btn">
              Browse 72 Rules
            </Link>
            <Link href="/playground" className="btn border-transparent text-[var(--text-dim)] hover:text-[var(--text-main)]">
              Open Playground →
            </Link>
          </div>
        </div>

        {/* Live Transformation Metric Card */}
        <div className="lg:col-span-5 hairline p-6 bg-[var(--bg-surface)] rounded-md space-y-6">
          <div className="flex justify-between items-baseline hairline-b pb-4">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-dim)]">
              Audit Transformation
            </span>
            <span className="font-mono text-xs text-[var(--status-sage)] font-bold">
              +48pt Improvement
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="hairline p-4 rounded bg-[var(--bg-canvas)]">
              <span className="block text-xs font-mono text-[var(--status-warn)] uppercase">Before Chaff</span>
              <span className="font-serif text-4xl font-bold text-[var(--text-main)] block mt-1">48</span>
              <span className="text-xs text-[var(--text-dim)] font-mono">14 open tells</span>
            </div>
            <div className="hairline p-4 rounded bg-[var(--bg-canvas)] border-[var(--status-sage)]">
              <span className="block text-xs font-mono text-[var(--status-sage)] uppercase">After Chaff</span>
              <span className="font-serif text-4xl font-bold text-[var(--text-main)] block mt-1">96</span>
              <span className="text-xs text-[var(--status-sage)] font-mono">0 open • 1 waived</span>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-[var(--text-dim)] mb-1">
                <span>Visual & Layout</span>
                <span>94 / 100</span>
              </div>
              <div className="w-full bg-[var(--border-line)] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[var(--status-sage)] h-full w-[94%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[var(--text-dim)] mb-1">
                <span>Copy Authenticity</span>
                <span>100 / 100</span>
              </div>
              <div className="w-full bg-[var(--border-line)] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[var(--status-sage)] h-full w-[100%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[var(--text-dim)] mb-1">
                <span>Performance & Mobile</span>
                <span>95 / 100</span>
              </div>
              <div className="w-full bg-[var(--border-line)] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[var(--status-sage)] h-full w-[95%]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Signature Moment: The Wind Control */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-dim)]">02 / INTERACTION</span>
          <div className="flex-1 hairline-b" />
        </div>
        <WindControl />
      </section>

      {/* 3. The 7-Step Autonomous Protocol */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-dim)]">03 / AGENT PROTOCOL</span>
          <div className="flex-1 hairline-b" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif">The Invariant 7-Step Workflow</h2>
          <p className="text-[var(--text-dim)]">
            Every AI coding agent executing Chaff adheres to a strict linear contract. It never modifies working files without auditing and plan approval first.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '01', name: 'Read', desc: 'Scan framework, tokens, and fonts. Write .chaff/identity.json. Modify nothing.' },
            { step: '02', name: 'Look', desc: 'Run rendered-page audit at 390px and 1440px across light and dark themes.' },
            { step: '03', name: 'Audit', desc: 'Generate chaff-report.md scoring out of 100 across 4 areas. Waive locked items.' },
            { step: '04', name: 'Plan', desc: 'Produce ordered fix list. At L2/L3, pitch 3 distinct concepts and pause for approval.' },
            { step: '05', name: 'Approve', desc: 'Wait for human confirmation on chosen direction. Proceed only when approved.' },
            { step: '06', name: 'Implement', desc: 'Atomic commits tagged with rule IDs. Respect existing code idioms.' },
            { step: '07', name: 'Verify & Report', desc: 'Typecheck, lint, build, test, and run chaff gate. Green only.' },
          ].map((s) => (
            <div key={s.step} className="hairline p-5 bg-[var(--bg-surface)] rounded-md space-y-2">
              <span className="font-mono text-xs font-bold text-[var(--accent-ember)]">{s.step}</span>
              <h3 className="font-serif text-base">{s.name}</h3>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Taxonomy Categories */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-dim)]">04 / CORE TAXONOMY</span>
          <div className="flex-1 hairline-b" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="font-serif">72 Verified Detection Rules</h2>
            <p className="text-[var(--text-dim)] mt-1">9 rules per category across 8 architectural domains.</p>
          </div>
          <Link href="/rules" className="btn text-sm">
            View All Rules →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { cat: 'ui', name: 'UI & Layout', count: 9, tag: 'UI-001..009', desc: '4/8px spatial rhythm, anti-template compositions, contrast AA.' },
            { cat: 'copy', name: 'Copy & Voice', count: 9, tag: 'COPY-001..009', desc: 'Ban buzzwords, eliminate synthetic metrics, real examples.' },
            { cat: 'code', name: 'React & Next.js', count: 9, tag: 'CODE-001..009', desc: 'Semantic HTML, hydration hygiene, Server Components.' },
            { cat: 'perf', name: 'Performance', count: 9, tag: 'PERF-001..009', desc: 'Core Web Vitals, self-hosted fonts, CLS prevention.' },
            { cat: 'mobile', name: 'Mobile Ergonomics', count: 9, tag: 'MOBILE-001..009', desc: 'Dynamic viewport dvh, >=44px touch targets, zero 320px overflow.' },
            { cat: 'a11y', name: 'Accessibility', count: 9, tag: 'A11Y-001..009', desc: 'Visible focus rings, screen reader labels, form accessibility.' },
            { cat: 'motion', name: 'Motion Physics', count: 9, tag: 'MOTION-001..009', desc: 'prefers-reduced-motion, transform/opacity only, tactile springs.' },
            { cat: 'three', name: '3D & WebGL', count: 9, tag: 'THREE-001..009', desc: 'Mandatory 5-part Fallback Contract, @chaff/tier runtime.' },
          ].map((c) => (
            <Link
              key={c.cat}
              href={`/rules?category=${c.cat}`}
              className="hairline p-4 rounded-md bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] transition-colors text-decoration-none block space-y-2 group"
            >
              <div className="flex justify-between items-baseline font-mono text-xs text-[var(--accent-ember)]">
                <span>{c.tag}</span>
                <span className="font-bold">{c.count}</span>
              </div>
              <h3 className="font-serif text-base text-[var(--text-main)] group-hover:text-[var(--accent-ember)]">
                {c.name}
              </h3>
              <p className="text-xs text-[var(--text-dim)]">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
