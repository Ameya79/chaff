import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getCachedRules } from '../../lib/rules-loader';
import { RulesClientLedger, RulePublicDto } from '../../components/RulesClientLedger';

export const metadata: Metadata = {
  title: '72 Architectural Rules Directory',
  description:
    'Search and inspect all 72 Chaff design, accessibility, mobile, motion, and Level 3 WebGL rules with canonical bad-vs-good patterns.',
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
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      <header className="space-y-3 pb-6 hairline-b">
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-[var(--text-dim)]">
          <span className="uppercase tracking-[0.16em] text-[var(--accent-ember)] font-semibold">
            Canonical Specification
          </span>
          <span>72 Rules Across 8 Domains</span>
        </div>
        <h1 className="font-serif text-[var(--text-main)]">
          Architectural Rules Index
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-dim)] max-w-[65ch] leading-relaxed">
          Every Chaff rule pairs reproducible AI tell anti-patterns with concrete craft remediations, detection heuristics, and explicit brand waiver criteria.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="p-8 hairline bg-[var(--bg-surface)] font-mono text-xs text-[var(--text-dim)]">
            Loading 72 canonical rules...
          </div>
        }
      >
        <RulesClientLedger initialRules={publicRules} />
      </Suspense>
    </div>
  );
}
