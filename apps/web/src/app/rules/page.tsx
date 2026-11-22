import React from 'react';
import path from 'node:path';
import fs from 'node:fs';
import { loadAllRules } from '@chaff/core';
import { RulesClientLedger } from '../../components/RulesClientLedger';

export const metadata = {
  title: 'Chaff Rules Index — 72 Architectural Rules',
  description:
    'Complete directory of 72 automated detection and remediation rules across 8 architectural categories.',
};

function getRulesDir(): string {
  let cur = path.resolve(process.cwd());
  while (cur !== path.dirname(cur)) {
    const candidate = path.join(cur, 'rules');
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    cur = path.dirname(cur);
  }
  return path.resolve(process.cwd(), 'rules');
}

export default async function RulesPage({
  searchParams,
}: {
  searchParams?: { category?: string; query?: string };
}) {
  const rules = await loadAllRules(getRulesDir());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10">
      {/* Header Register */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 hairline-b pb-3 font-mono text-xs text-[var(--text-dim)]">
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent-ember)] font-bold">SPEC //</span>
            <span className="uppercase tracking-widest text-[var(--text-main)] font-semibold">ARCHITECTURAL TAXONOMY</span>
          </div>
          <div>72 ENFORCEMENT RULES</div>
        </div>
        <h1 className="tracking-tight text-[var(--text-main)] font-serif">
          The Rules Directory
        </h1>
        <p className="text-[var(--text-dim)] text-lg max-w-[68ch]">
          Every rule provides AST and rendered-page detection logic, reproducible AI tell anti-patterns, craft-authored solutions, and documented exception criteria.
        </p>
      </div>

      {/* Interactive Rules Catalog Ledger */}
      <RulesClientLedger
        initialRules={rules}
        initialCategory={searchParams?.category || 'all'}
        initialQuery={searchParams?.query || ''}
      />
    </div>
  );
}
