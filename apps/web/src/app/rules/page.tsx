import React from 'react';
import path from 'node:path';
import { loadAllRules } from '@chaff/core';

export const metadata = {
  title: 'Chaff Rules Index — 72 Detection Rules',
  description: 'Complete directory of 72 automated detection and remediation rules across 8 categories.',
};

export default async function RulesPage({
  searchParams,
}: {
  searchParams?: { category?: string; query?: string };
}) {
  const rulesDir = path.resolve(process.cwd(), '..', '..', 'rules');
  // Fallback to process.cwd() / rules if running from repo root
  let rules = await loadAllRules(rulesDir);
  if (rules.length === 0) {
    rules = await loadAllRules(path.resolve(process.cwd(), 'rules'));
  }

  const selectedCategory = searchParams?.category || 'all';
  const query = (searchParams?.query || '').toLowerCase();

  const filteredRules = rules.filter((r) => {
    const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesQuery =
      !query ||
      r.id.toLowerCase().includes(query) ||
      r.title.toLowerCase().includes(query) ||
      r.fix_class.toLowerCase().includes(query) ||
      r.why.toLowerCase().includes(query);
    return matchesCat && matchesQuery;
  });

  const categories = [
    { id: 'all', name: 'All Categories', count: rules.length },
    { id: 'ui', name: 'UI & Layout', count: rules.filter((r) => r.category === 'ui').length },
    { id: 'copy', name: 'Copy & Voice', count: rules.filter((r) => r.category === 'copy').length },
    { id: 'code', name: 'Code Patterns', count: rules.filter((r) => r.category === 'code').length },
    { id: 'perf', name: 'Performance', count: rules.filter((r) => r.category === 'perf').length },
    { id: 'mobile', name: 'Mobile Ergonomics', count: rules.filter((r) => r.category === 'mobile').length },
    { id: 'a11y', name: 'Accessibility', count: rules.filter((r) => r.category === 'a11y').length },
    { id: 'motion', name: 'Motion Physics', count: rules.filter((r) => r.category === 'motion').length },
    { id: 'three', name: '3D & WebGL', count: rules.filter((r) => r.category === 'three').length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div>
        <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] px-2.5 py-1 hairline rounded bg-[var(--bg-surface)] mb-4">
          <span>TAXONOMY</span>
          <span>/</span>
          <span>72 RULES</span>
        </div>
        <h1 className="tracking-tight text-[var(--text-main)]">Rules Directory</h1>
        <p className="text-[var(--text-dim)] mt-2 max-w-[65ch]">
          Every rule contains verifiable detection logic, explicit bad and good code snippets, performance rationale, and approved exception criteria.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 hairline-b pb-4">
        {categories.map((c) => {
          const isActive = selectedCategory === c.id;
          return (
            <a
              key={c.id}
              href={`/rules?category=${c.id}`}
              className={`btn text-xs px-3 py-1.5 font-mono ${
                isActive ? 'primary' : 'bg-[var(--bg-surface)] border-[var(--border-line)]'
              }`}
            >
              <span>{c.name}</span>
              <span className="opacity-70">({c.count})</span>
            </a>
          );
        })}
      </div>

      {/* Rules Grid */}
      <div className="space-y-6">
        <div className="flex justify-between items-center text-xs font-mono text-[var(--text-dim)]">
          <span>Showing {filteredRules.length} of {rules.length} rules</span>
          <span>Filtered by: <strong className="text-[var(--text-main)] uppercase">{selectedCategory}</strong></span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredRules.map((r) => (
            <article key={r.id} className="hairline p-6 bg-[var(--bg-surface)] rounded-md space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-4 hairline-b pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-[var(--accent-ember)] px-2 py-0.5 hairline rounded bg-[var(--bg-canvas)]">
                    {r.id}
                  </span>
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded hairline text-[var(--text-dim)]">
                    Category: {r.category}
                  </span>
                  <span className={`text-xs font-mono uppercase px-2 py-0.5 rounded hairline ${
                    r.severity === 'high' ? 'bg-red-500/10 text-red-600 border-red-500/30' : 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                  }`}>
                    {r.severity} severity
                  </span>
                </div>
                <div className="font-mono text-xs text-[var(--text-dim)]">
                  Levels: [{r.levels.join(', ')}] • Detect: {r.detect} • Fix: {r.fix_class}
                </div>
              </div>

              <h2 className="font-serif text-xl text-[var(--text-main)] leading-snug">
                {r.title}
              </h2>

              <p className="text-sm text-[var(--text-dim)] leading-relaxed">
                {r.why}
              </p>

              {/* Bad vs Good Code Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
                <div className="hairline p-4 rounded bg-[var(--bg-canvas)] border-red-500/20">
                  <span className="font-mono text-xs text-red-600 block mb-2 font-semibold">✗ AI Tell / Violation</span>
                  <pre className="text-xs font-mono text-[var(--text-main)] overflow-x-auto p-2 bg-[var(--bg-surface)] rounded">
                    <code>{r.bad}</code>
                  </pre>
                </div>
                <div className="hairline p-4 rounded bg-[var(--bg-canvas)] border-[var(--status-sage)]/40">
                  <span className="font-mono text-xs text-[var(--status-sage)] block mb-2 font-semibold">✓ Genuine Craft Solution</span>
                  <pre className="text-xs font-mono text-[var(--text-main)] overflow-x-auto p-2 bg-[var(--bg-surface)] rounded">
                    <code>{r.good}</code>
                  </pre>
                </div>
              </div>

              {r.exceptions && (
                <div className="text-xs font-mono text-[var(--text-dim)] pt-2 hairline-t">
                  <strong>Approved Exceptions:</strong> {r.exceptions}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
