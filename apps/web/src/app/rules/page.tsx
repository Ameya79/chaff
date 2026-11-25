import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getCachedRules } from '../../lib/rules-loader';
import { RulesClientLedger, RulePublicDto } from '../../components/RulesClientLedger';

export const metadata: Metadata = {
  title: '72 Rules',
  description:
    'Search and inspect all 72 Chaff design, accessibility, mobile, motion, and Level 3 WebGL rules.',
};

export default async function RulesPage() {
  const fullRules = await getCachedRules();

  // Strip local filesystem paths (filePath) and rawContent before RSC serialization
  const publicRules: RulePublicDto[] = fullRules.map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    severity: r.severity,
    levels: r.levels,
    detect: r.detect,
    fix_class: r.fix_class,
    bad: r.bad,
    good: r.good,
    why: r.why,
    exceptions: r.exceptions,
    detectionLogic: r.detectionLogic,
    remediationSteps: r.remediationSteps,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20 space-y-10">
      <header className="space-y-3">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-ember)] block">
          Specification · 8 Domains
        </span>
        <h1 className="font-serif text-[var(--text-main)]">
          72 Architectural Rules
        </h1>
        <p className="text-base text-[var(--text-dim)] max-w-[48ch]">
          Canonical bad-vs-good patterns and waiver rules across Levels 1–3.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="py-12 font-mono text-xs text-[var(--text-dim)]">
            Loading 72 rules...
          </div>
        }
      >
        <RulesClientLedger initialRules={publicRules} />
      </Suspense>
    </div>
  );
}
