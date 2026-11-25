import React from 'react';
import type { Metadata } from 'next';
import { getCachedRules } from '../../lib/rules-loader';
import { PlaygroundWorkbench, CanonicalRuleSummary } from '../../components/PlaygroundWorkbench';

export const metadata: Metadata = {
  title: 'Interactive Static Audit Playground',
  description:
    'Run Chaff static checks live in the browser against canonical rules, inspect rendered specimens, and preview automated fixes.',
};

export default async function PlaygroundPage() {
  const rules = await getCachedRules();
  const rulesMap: Record<string, CanonicalRuleSummary> = {};
  for (const r of rules) {
    rulesMap[r.id] = {
      id: r.id,
      title: r.title,
      severity: r.severity,
    };
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      <header className="space-y-3 pb-6 hairline-b">
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-[var(--text-dim)]">
          <span className="uppercase tracking-[0.16em] text-[var(--accent-ember)] font-semibold">
            Live Analyzer
          </span>
          <span>Powered by @chaff/checks/browser</span>
        </div>
        <h1 className="font-serif text-[var(--text-main)]">
          Chaff Static &amp; Specimen Playground
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-dim)] max-w-[65ch] leading-relaxed">
          Edit or paste JSX below to execute Chaff&apos;s real static checks against canonical rules, inspect the rendered UI preview, and test automated remediation.
        </p>
      </header>

      <PlaygroundWorkbench rulesMap={rulesMap} />
    </div>
  );
}
