import React from 'react';
import { pageMetadata } from '../../lib/discovery';
import { getCachedRules } from '../../lib/rules-loader';
import { PlaygroundWorkbench, CanonicalRuleSummary } from '../../components/PlaygroundWorkbench';
import { PageHeader } from '../../components/PageHeader';

export const metadata = pageMetadata('/playground');

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
      <PageHeader
        eyebrow="@chaff/checks/browser"
        title="Live AST Playground"
        lead="Paste JSX below to score rules locally and apply fixes."
      />

      <PlaygroundWorkbench rulesMap={rulesMap} />
    </div>
  );
}
