import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="hairline-t bg-[var(--bg-surface)] py-16 px-4 sm:px-8 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-2xl font-bold tracking-tight text-[var(--text-main)]">
              CHAFF
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)]">
              Open-Source Audit Toolkit
            </span>
          </div>
          <p className="text-sm text-[var(--text-dim)] leading-relaxed max-w-[50ch]">
            Chaff audits the rendered page, locks intentional brand tokens, enforces three operational contracts, and fails the pull request when the page gets slow. Slop is the husk. Genuine craft is the grain.
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-dim)] pt-2">
            <span>Protocol v0.1.0</span>
            <span>•</span>
            <span>Zero Telemetry</span>
            <span>•</span>
            <span>100% Local Execution</span>
          </div>
        </div>

        <div className="md:col-span-3 space-y-3">
          <h4 className="font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)]">
            ARCHITECTURAL SPEC
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/rules" className="text-[var(--text-main)] hover:text-[var(--accent-ember)] transition-colors">
                72 Detection Rules
              </Link>
            </li>
            <li>
              <Link href="/levels" className="text-[var(--text-main)] hover:text-[var(--accent-ember)] transition-colors">
                The 3 Creative Levels
              </Link>
            </li>
            <li>
              <Link href="/install" className="text-[var(--text-main)] hover:text-[var(--accent-ember)] transition-colors">
                IDE Adapters & MCP Server
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="text-[var(--text-main)] hover:text-[var(--accent-ember)] transition-colors">
                Empirical Case Studies
              </Link>
            </li>
            <li>
              <Link href="/bench" className="text-[var(--text-main)] hover:text-[var(--accent-ember)] transition-colors">
                Chaff Bench Leaderboard
              </Link>
            </li>
            <li>
              <Link href="/gate" className="text-[var(--text-main)] hover:text-[var(--accent-ember)] transition-colors">
                Performance & Mobile Gate
              </Link>
            </li>
            <li>
              <Link href="/playground" className="text-[var(--text-main)] hover:text-[var(--accent-ember)] transition-colors">
                Interactive Static Checker
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4 space-y-3">
          <h4 className="font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] font-bold">
            THE WINNOWING STANDARD //
          </h4>
          <div className="hairline-y py-3 space-y-2 text-xs font-mono text-[var(--text-dim)]">
            <div className="text-[var(--text-main)] font-semibold">Invariant Directives:</div>
            <div>- No purple/blue synthetic glow gradients</div>
            <div>- No unverified metrics or buzzword salads</div>
            <div>- Asymmetric broadsheets over template card grids</div>
            <div>- 5-part Fallback Contract on all Level 3 3D/WebGL</div>
            <div className="text-[var(--status-sage)] pt-1 font-semibold">
              Rule: Downgrade effect, never loosen budget.
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto hairline-t mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-[var(--text-dim)] gap-4">
        <div>
          <span>Crafted for human engineers & autonomous agents.</span>
        </div>
        <div className="flex gap-4">
          <a
            href="https://github.com/chaff-dev/chaff"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent-ember)] transition-colors"
          >
            GitHub Repository
          </a>
          <span>•</span>
          <Link href="/rules" className="hover:text-[var(--accent-ember)] transition-colors">
            Changelog & RFCs
          </Link>
        </div>
      </div>
    </footer>
  );
}
