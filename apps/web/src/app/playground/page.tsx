import React from 'react';
import type { Metadata } from 'next';
import { getCachedRules } from '../../lib/rules-loader';
import { PlaygroundWorkbench, CanonicalRuleSummary } from '../../components/PlaygroundWorkbench';

export const metadata: Metadata = {
  title: 'Playground',
  description:
    'Run Chaff static checks live in the browser and preview automated fixes.',
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
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20 space-y-10">
      <header className="space-y-3">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-ember)] block">
          @chaff/checks/browser
        </span>
        <h1 className="font-serif text-[var(--text-main)]">
          Live AST Playground
        </h1>
        <p className="text-base text-[var(--text-dim)] max-w-[46ch]">
          Paste JSX below to score rules locally and apply fixes.
        </p>
      </header>

      <PlaygroundWorkbench rulesMap={rulesMap} />
    </div>
  );
}
