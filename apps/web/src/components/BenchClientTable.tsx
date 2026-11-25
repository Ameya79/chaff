'use client';

import React, { useState, useMemo } from 'react';

export interface AgentBenchmarkDto {
  agent: string;
  model: string;
  environment: string;
  averageScore: number;
  slopReductionRate: number;
  gatePassRate: number;
  l1CleanScore: number;
  l2AuthoredScore: number;
  l3RiskScore: number;
  avgDiffLines: number;
  rank: number;
}

export interface FixtureBenchmarkDto {
  fixture: string;
  category: string;
  baselineScore: number;
  totalFindings: number;
  highSeverityCount: number;
  slopIndex: number;
  gateStatus: string;
  gateViolations: string[];
}

interface BenchClientTableProps {
  agents: AgentBenchmarkDto[];
  fixtures: FixtureBenchmarkDto[];
  formattedRunDate: string;
}

export function BenchClientTable({
  agents,
  fixtures,
  formattedRunDate,
}: BenchClientTableProps) {
  const [sortKey, setSortKey] = useState<keyof AgentBenchmarkDto>('rank');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const sortedAgents = useMemo(() => {
    return [...agents].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return String(valA).localeCompare(String(valB)) * (sortAsc ? 1 : -1);
    });
  }, [agents, sortKey, sortAsc]);

  const handleSort = (key: keyof AgentBenchmarkDto) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === 'rank' || key === 'avgDiffLines');
    }
  };

  const filteredFixtures = useMemo(() => {
    if (filterCategory === 'all') return fixtures;
    return fixtures.filter((f) => {
      const cat = f.category.toLowerCase();
      if (filterCategory === 'landing') return cat.includes('marketing');
      if (filterCategory === 'dashboard') return cat.includes('enterprise');
      if (filterCategory === 'portfolio') return cat.includes('editorial');
      if (filterCategory === 'commerce') return cat.includes('commerce');
      return cat.includes(filterCategory);
    });
  }, [fixtures, filterCategory]);

  const sortArrow = (key: keyof AgentBenchmarkDto) =>
    sortKey === key ? (sortAsc ? '↑' : '↓') : '';

  return (
    <div className="space-y-12">
      {/* 1. Measured 10-Fixture Corpus Scans */}
      <section className="hairline bg-[var(--bg-surface)] p-5 sm:p-6 space-y-5 min-w-0">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 pb-4 hairline-b">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--status-sage)] font-bold block">
              Measured Static &amp; Gate Scans · {formattedRunDate}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-main)]">
              10-Fixture Baseline Corpus
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-dim)]">
              Executed locally across all ten workspace fixtures via <code className="mono">pnpm bench</code>.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['all', 'landing', 'dashboard', 'portfolio', 'commerce'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                aria-pressed={filterCategory === cat}
                className={`px-3 py-1.5 min-h-[44px] font-mono text-xs border transition-colors ${
                  filterCategory === cat
                    ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] border-[var(--accent-ember)] font-bold'
                    : 'bg-[var(--bg-canvas)] text-[var(--text-main)] border-[var(--border-line)] hover:bg-[var(--bg-surface-elevated)]'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full max-w-full overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="hairline-b text-[var(--text-dim)] uppercase">
                <th className="py-3 pr-4 whitespace-nowrap">Fixture</th>
                <th className="py-3 px-3 whitespace-nowrap">Domain</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">Score</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">Tells (High/All)</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">Slop Index</th>
                <th className="py-3 px-3 whitespace-nowrap">Gate</th>
                <th className="py-3 pl-4 whitespace-nowrap">Violations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-line)]">
              {filteredFixtures.map((fx) => (
                <tr key={fx.fixture} className="hover:bg-[var(--bg-inset)] transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-[var(--text-main)] whitespace-nowrap">
                    {fx.fixture}
                  </td>
                  <td className="py-3.5 px-3 text-[var(--text-dim)] uppercase whitespace-nowrap">
                    {fx.category}
                  </td>
                  <td className="py-3.5 px-3 text-right text-[var(--text-main)] tabular-nums font-semibold whitespace-nowrap">
                    {fx.baselineScore} / 100
                  </td>
                  <td className="py-3.5 px-3 text-right text-[var(--accent-ember)] tabular-nums whitespace-nowrap">
                    {fx.highSeverityCount} / {fx.totalFindings}
                  </td>
                  <td className="py-3.5 px-3 text-right text-[var(--status-warn)] tabular-nums font-bold whitespace-nowrap">
                    {fx.slopIndex} / 100
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`text-[11px] font-mono uppercase px-2 py-0.5 font-bold ${
                        fx.gateStatus === 'PASS'
                          ? 'bg-[var(--status-sage-soft)] text-[var(--status-sage)]'
                          : 'bg-[var(--accent-ember-soft)] text-[var(--accent-ember)]'
                      }`}
                    >
                      {fx.gateStatus}
                    </span>
                  </td>
                  <td className="py-3.5 pl-4 text-xs">
                    {fx.gateViolations && fx.gateViolations.length > 0 ? (
                      <span className="text-[var(--accent-ember)] font-semibold">
                        {fx.gateViolations.join(', ')}
                      </span>
                    ) : (
                      <span className="text-[var(--status-sage)]">Zero gate violations</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Reference Agent Harness Profiles */}
      <section className="hairline bg-[var(--bg-surface)] p-5 sm:p-6 space-y-5 min-w-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 hairline-b">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent-ember)] font-bold block">
              Benchmark Reference Profiles · Methodology v0
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-main)]">
              Agent Harness Comparison Model
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-dim)] max-w-[65ch]">
              Reference benchmark baselines recorded from harness evaluations under <code className="mono">bench/METHODOLOGY.md</code> (sortable by metric).
            </p>
          </div>
          <span className="font-mono text-xs text-[var(--text-dim)]">
            Use column buttons to sort
          </span>
        </div>

        <div className="w-full max-w-full overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="hairline-b text-[var(--text-dim)] uppercase">
                <th className="py-2 pr-2">
                  <button
                    type="button"
                    onClick={() => handleSort('rank')}
                    className="min-h-[44px] min-w-[44px] px-2.5 text-left font-bold hover:text-[var(--text-main)] whitespace-nowrap"
                  >
                    Rank {sortArrow('rank')}
                  </button>
                </th>
                <th className="py-2 px-2">
                  <button
                    type="button"
                    onClick={() => handleSort('agent')}
                    className="min-h-[44px] min-w-[44px] px-2.5 text-left font-bold hover:text-[var(--text-main)] whitespace-nowrap"
                  >
                    Harness {sortArrow('agent')}
                  </button>
                </th>
                <th className="py-2 px-3 whitespace-nowrap">Adapter</th>
                <th className="py-2 px-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('averageScore')}
                    className="min-h-[44px] min-w-[44px] px-2.5 text-right font-bold hover:text-[var(--text-main)] whitespace-nowrap"
                  >
                    Avg {sortArrow('averageScore')}
                  </button>
                </th>
                <th className="py-2 px-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('slopReductionRate')}
                    className="min-h-[44px] min-w-[44px] px-2.5 text-right font-bold hover:text-[var(--text-main)] whitespace-nowrap"
                  >
                    Winnowed {sortArrow('slopReductionRate')}
                  </button>
                </th>
                <th className="py-2 px-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('gatePassRate')}
                    className="min-h-[44px] min-w-[44px] px-2.5 text-right font-bold hover:text-[var(--text-main)] whitespace-nowrap"
                  >
                    Gate Pass {sortArrow('gatePassRate')}
                  </button>
                </th>
                <th className="py-2 pl-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('avgDiffLines')}
                    className="min-h-[44px] min-w-[44px] px-2.5 text-right font-bold hover:text-[var(--text-main)] whitespace-nowrap"
                  >
                    Diff Lines {sortArrow('avgDiffLines')}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-line)]">
              {sortedAgents.map((ag) => (
                <tr key={ag.agent} className="hover:bg-[var(--bg-inset)] transition-colors">
                  <td className="py-3.5 px-2 font-serif italic font-bold text-sm text-[var(--accent-ember)]">
                    #{ag.rank}
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <strong className="text-[var(--text-main)] block font-sans text-sm">
                      {ag.agent}
                    </strong>
                    <span className="text-[11px] text-[var(--text-dim)]">{ag.model}</span>
                  </td>
                  <td className="py-3.5 px-3 text-[var(--text-dim)] whitespace-nowrap">
                    {ag.environment}
                  </td>
                  <td className="py-3.5 px-2 text-right font-bold text-[var(--text-main)] tabular-nums text-sm">
                    {ag.averageScore}
                  </td>
                  <td className="py-3.5 px-2 text-right text-[var(--status-sage)] tabular-nums font-semibold">
                    {ag.slopReductionRate}%
                  </td>
                  <td className="py-3.5 px-2 text-right tabular-nums">
                    <span className="px-2 py-0.5 bg-[var(--status-sage-soft)] text-[var(--status-sage)] font-semibold">
                      {ag.gatePassRate}%
                    </span>
                  </td>
                  <td className="py-3.5 pl-2 text-right text-[var(--text-dim)] tabular-nums whitespace-nowrap">
                    {ag.avgDiffLines} lines
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
