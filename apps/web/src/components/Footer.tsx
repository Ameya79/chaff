import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="hairline-t bg-[var(--bg-surface)] py-14 px-4 sm:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5 space-y-4 min-w-0">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-2xl font-bold tracking-tight text-[var(--text-main)]">
              CHAFF
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)]">
              Open-Source Audit Toolkit
            </span>
          </div>
          <p className="text-sm text-[var(--text-dim)] leading-relaxed max-w-[52ch]">
            Chaff audits the rendered page, locks intentional brand tokens, enforces three operational contracts, and fails the pull request when the page gets slow. Slop is the husk. Genuine craft is the grain.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--text-dim)] pt-1">
            <span>Protocol v0.1.0</span>
            <span aria-hidden="true">·</span>
            <span>Zero Telemetry</span>
            <span aria-hidden="true">·</span>
            <span>100% Local Execution</span>
          </div>
        </div>

        <div className="md:col-span-3 space-y-3 min-w-0">
          <h4 className="font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] font-semibold">
            Specification
          </h4>
          <ul className="space-y-1 text-sm">
            {[
              { href: '/rules', label: '72 Detection Rules' },
              { href: '/levels', label: 'The 3 Creative Levels' },
              { href: '/gallery', label: 'Visual Case Studies' },
              { href: '/playground', label: 'Live Static Checker' },
              { href: '/bench', label: 'Chaff Bench Suite' },
              { href: '/gate', label: 'Performance & Mobile Gate' },
              { href: '/install', label: 'IDE Adapters & MCP Server' },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex items-center min-h-[44px] py-1 text-[var(--text-main)] hover:text-[var(--accent-ember)] transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4 space-y-3 min-w-0">
          <h4 className="font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] font-semibold">
            Enforcement Invariants
          </h4>
          <ul className="hairline-y py-3 space-y-2 text-xs font-mono text-[var(--text-dim)] list-none">
            <li>No unwaived synthetic purple/blue glow gradients</li>
            <li>No fabricated metrics or LLM buzzword copy</li>
            <li>Asymmetric editorial structure over 3-card templates</li>
            <li>5-part Fallback Contract on all Level 3 WebGL scenes</li>
            <li className="text-[var(--status-sage)] pt-1 font-semibold">
              Iron Rule: Downgrade effect complexity, never loosen budget.
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto hairline-t mt-10 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs font-mono text-[var(--text-dim)] gap-4">
        <span>Built for human craftspeople and autonomous coding agents.</span>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/chaff-dev/chaff"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center min-h-[44px] hover:text-[var(--accent-ember)] transition-colors"
          >
            GitHub Repository
          </a>
          <span aria-hidden="true">·</span>
          <Link
            href="/rules"
            className="inline-flex items-center min-h-[44px] hover:text-[var(--accent-ember)] transition-colors"
          >
            Rule Catalog
          </Link>
        </div>
      </div>
    </footer>
  );
}
