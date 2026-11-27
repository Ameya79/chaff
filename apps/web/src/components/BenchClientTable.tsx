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
    <div className="space-y-20 sheet-in" style={{ '--d': '120ms' } as React.CSSProperties}>
      {/* 10-Fixture Baseline Corpus */}
      <section className="space-y-6 min-w-0">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 hairline-b pb-3">
          <div className="space-y-1">
            <span className="font-mono text-xs text-[var(--status-pass)] block">
              Measured · {formattedRunDate}
            </span>
            <h2 className="font-display text-3xl text-[var(--text-main)]">
              Fixture Corpus
            </h2>
          </div>

          <div className="flex flex-wrap gap-1">
            {['all', 'landing', 'dashboard', 'portfolio', 'commerce'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                aria-pressed={filterCategory === cat}
                className={`px-3.5 py-2 rounded-[6px] border-b-2 min-h-[44px] min-w-[44px] font-mono text-xs uppercase transition-colors duration-200 ${
                  filterCategory === cat
                    ? 'border-[var(--accent)] bg-[var(--bg-surface)] text-[var(--text-main)] font-medium'
                    : 'border-transparent text-[var(--text-dim)] hover:text-[var(--text-main)]'
                }`}
              >
                {cat}
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
                <th className="py-3 px-3 text-right whitespace-nowrap">Tells</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">Slop</th>
                <th className="py-3 px-3 whitespace-nowrap">Gate</th>
                <th className="py-3 pl-4 whitespace-nowrap">Violations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-line)]">
              {filteredFixtures.map((fx) => (
                <tr key={fx.fixture} className="hover:bg-[var(--bg-surface-hover)] transition-colors duration-200">
                  <td className="py-4 pr-4 font-medium text-[var(--text-main)] whitespace-nowrap">
                    {fx.fixture}
                  </td>
                  <td className="py-4 px-3 text-[var(--text-dim)] whitespace-nowrap">
                    {fx.category}
                  </td>
                  <td className="py-4 px-3 text-right text-[var(--text-main)] tabular-nums whitespace-nowrap">
                    {fx.baselineScore}
                  </td>
                  <td className="py-4 px-3 text-right text-[var(--accent)] tabular-nums whitespace-nowrap">
                    {fx.highSeverityCount}/{fx.totalFindings}
                  </td>
                  <td className="py-4 px-3 text-right text-[var(--status-warn)] tabular-nums whitespace-nowrap">
                    {fx.slopIndex}
                  </td>
                  <td className="py-4 px-3 whitespace-nowrap">
                    <span
                      className={`text-[11px] uppercase px-2.5 py-0.5 rounded-[4px] ${
                        fx.gateStatus === 'PASS'
                          ? 'bg-[var(--status-pass-soft)] text-[var(--status-pass)]'
                          : 'bg-[var(--status-fail-soft)] text-[var(--status-fail)]'
                      }`}
                    >
                      {fx.gateStatus}
                    </span>
                  </td>
                  <td className="py-4 pl-4 text-xs">
                    {fx.gateViolations && fx.gateViolations.length > 0 ? (
                      <span className="text-[var(--status-fail)]">
                        {fx.gateViolations.join(', ')}
                      </span>
                    ) : (
                      <span className="text-[var(--text-dim)]">None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Agent Harness Model */}
      <section className="scroll-sheet space-y-6 min-w-0">
        <div className="space-y-1">
          <span className="font-mono text-xs text-[var(--accent)] block">
            Methodology v0
          </span>
          <h2 className="font-display text-3xl text-[var(--text-main)]">
            Agent Harness Baselines
          </h2>
        </div>

        <div className="w-full max-w-full overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="hairline-b text-[var(--text-dim)] uppercase">
                <th className="py-2 pr-2">
                  <button
                    type="button"
                    onClick={() => handleSort('rank')}
                    className="min-h-[44px] min-w-[44px] px-2 text-left hover:text-[var(--text-main)] whitespace-nowrap"
                  >
                    Rank {sortArrow('rank')}
                  </button>
                </th>
                <th className="py-2 px-2">
                  <button
                    type="button"
                    onClick={() => handleSort('agent')}
                    className="min-h-[44px] min-w-[44px] px-2 text-left hover:text-[var(--text-main)] whitespace-nowrap"
                  >
                    Harness {sortArrow('agent')}
                  </button>
                </th>
                <th className="py-2 px-3 whitespace-nowrap">Adapter</th>
                <th className="py-2 px-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('averageScore')}
                    className="min-h-[44px] min-w-[44px] px-2 text-right hover:text-[var(--text-main)] whitespace-nowrap"
                  >
                    Avg {sortArrow('averageScore')}
                  </button>
                </th>
                <th className="py-2 px-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('slopReductionRate')}
                    className="min-h-[44px] min-w-[44px] px-2 text-right hover:text-[var(--text-main)] whitespace-nowrap"
                  >
                    Winnowed {sortArrow('slopReductionRate')}
                  </button>
                </th>
                <th className="py-2 px-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('gatePassRate')}
                    className="min-h-[44px] min-w-[44px] px-2 text-right hover:text-[var(--text-main)] whitespace-nowrap"
                  >
                    Gate {sortArrow('gatePassRate')}
                  </button>
                </th>
                <th className="py-2 pl-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('avgDiffLines')}
                    className="min-h-[44px] min-w-[44px] px-2 text-right hover:text-[var(--text-main)] whitespace-nowrap"
                  >
                    Diff {sortArrow('avgDiffLines')}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-line)]">
              {sortedAgents.map((ag) => (
                <tr key={ag.agent} className="hover:bg-[var(--bg-surface-hover)] transition-colors duration-200">
                  <td className="py-4 px-2 font-mono text-sm font-semibold text-[var(--accent)] tabular-nums">
                    #{ag.rank}
                  </td>
                  <td className="py-4 px-2 whitespace-nowrap">
                    <strong className="text-[var(--text-main)] block font-sans text-sm font-medium">
                      {ag.agent}
                    </strong>
                    <span className="text-[11px] text-[var(--text-dim)]">{ag.model}</span>
                  </td>
                  <td className="py-4 px-3 text-[var(--text-dim)] whitespace-nowrap">
                    {ag.environment}
                  </td>
                  <td className="py-4 px-2 text-right font-semibold text-[var(--text-main)] tabular-nums text-sm">
                    {ag.averageScore}
                  </td>
                  <td className="py-4 px-2 text-right text-[var(--status-pass)] tabular-nums">
                    {ag.slopReductionRate}%
                  </td>
                  <td className="py-4 px-2 text-right tabular-nums text-[var(--status-pass)]">
                    {ag.gatePassRate}%
                  </td>
                  <td className="py-4 pl-2 text-right text-[var(--text-dim)] tabular-nums whitespace-nowrap">
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
