import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getCachedRules } from '../../lib/rules-loader';
import { RulesClientLedger, RulePublicDto } from '../../components/RulesClientLedger';
import { PageHeader } from '../../components/PageHeader';

export const metadata: Metadata = {
  title: '72 Rules',
  description:
    'Search and inspect all 72 Chaff design, accessibility, mobile, motion, and Level 3 WebGL rules.',
};

export default async function RulesPage() {
  const fullRules = await getCachedRules();

  // Strip local filesystem paths and unrendered markdown sections before RSC serialization
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
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20 space-y-10">
      <PageHeader
        eyebrow="Specification · 8 Domains"
        title="72 Architectural Rules"
        lead="Canonical bad-vs-good patterns and waiver rules across Levels 1–3."
      />

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
