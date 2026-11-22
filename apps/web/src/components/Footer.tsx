import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="hairline-t bg-[var(--bg-surface)] py-12 px-4 sm:px-8 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <span className="font-serif text-xl font-bold tracking-tight">CHAFF</span>
          <p className="text-sm text-[var(--text-dim)] mt-3 max-w-[48ch]">
            Chaff audits the web page as it renders, locks what is yours, ships the runtime for risky 3D, and fails the pull request when the page gets slow. Slop is the husk. Your design is the grain.
          </p>
          <p className="text-xs font-mono text-[var(--text-dim)] mt-4">
            v0.1.0 • Built with the Chaff Protocol
          </p>
        </div>

        <div>
          <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-dim)] mb-3">
            Core Toolkit
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/rules" className="text-[var(--text-main)] hover:text-[var(--accent-ember)]">72 Rules Taxonomy</Link></li>
            <li><Link href="/levels" className="text-[var(--text-main)] hover:text-[var(--accent-ember)]">3 Operational Levels</Link></li>
            <li><Link href="/install" className="text-[var(--text-main)] hover:text-[var(--accent-ember)]">CLI & MCP Server</Link></li>
            <li><Link href="/playground" className="text-[var(--text-main)] hover:text-[var(--accent-ember)]">Interactive Sandbox</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-dim)] mb-3">
            Philosophy
          </h4>
          <ul className="space-y-2 text-sm text-[var(--text-dim)]">
            <li>No synthetic glow gradients</li>
            <li>No fake round statistics</li>
            <li>No centered hero + 3 cards</li>
            <li>Downgrade effect, never budget</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
