'use client';

import React, { useState } from 'react';
import benchData from '../../data/bench-results.json';

interface AgentBenchmark {
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

interface FixtureBenchmark {
  fixture: string;
  category: string;
  baselineScore: number;
  totalFindings: number;
  highSeverityCount: number;
  slopIndex: number;
  gateStatus: 'PASS' | 'FAIL' | string;
  gateViolations: string[];
}

export default function BenchPage() {
  const [sortKey, setSortKey] = useState<keyof AgentBenchmark>('rank');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const agents: AgentBenchmark[] = benchData.leaderboard;
  const fixtures: FixtureBenchmark[] = benchData.fixtures;

  const sortedAgents = [...agents].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return 0;
  });

  const handleSort = (key: keyof AgentBenchmark) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === 'rank' || key === 'avgDiffLines');
    }
  };

  const filteredFixtures =
    filterCategory === 'all'
      ? fixtures
      : fixtures.filter((f) =>
          f.category.toLowerCase().includes(filterCategory.toLowerCase())
        );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-16">
      {/* Header Register */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 hairline-b pb-3 font-mono text-xs text-[var(--text-dim)]">
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent-ember)] font-bold">BENCHMARK //</span>
            <span className="uppercase tracking-widest text-[var(--text-main)] font-semibold">CHAFF BENCH V0</span>
          </div>
          <div>10 REPOSITORY FIXTURE SUITE</div>
        </div>
        <h1 className="tracking-tight text-[var(--text-main)] font-serif">
          The Agent Slop &amp; Gate Leaderboard
        </h1>
        <p className="text-[var(--text-dim)] text-lg max-w-[68ch]">
          The open benchmark evaluating how autonomous AI coding agents perform on web design authenticity, tell elimination, intentional brand preservation, and performance budgets across 10 fixture repositories.
        </p>
      </div>

      {/* 1. Main Leaderboard Table Ledger (Continuous Broadsheet Table, Zero Cards) */}
      <section className="hairline-y py-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 hairline-b pb-4">
          <div>
            <span className="font-mono text-xs text-[var(--accent-ember)] uppercase tracking-wider block font-bold">
              EMPIRICAL STANDINGS
            </span>
            <h2 className="text-2xl font-serif text-[var(--text-main)] mt-1">
              Overall Standings (10 Fixture Suite)
            </h2>
            <p className="text-xs text-[var(--text-dim)] font-mono mt-1">
              Methodology v0-empirical • Run Date: {new Date(benchData.metadata.runDate).toLocaleDateString()}
            </p>
          </div>
          <span className="font-mono text-xs text-[var(--accent-ember)]">
            Click column headers to sort
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="hairline-b text-[var(--text-dim)] uppercase">
                <th
                  onClick={() => handleSort('rank')}
                  className="py-3 px-3 cursor-pointer hover:text-[var(--text-main)]"
                >
                  Rank {sortKey === 'rank' ? (sortAsc ? '▲' : '▼') : ''}
                </th>
                <th
                  onClick={() => handleSort('agent')}
                  className="py-3 px-3 cursor-pointer hover:text-[var(--text-main)]"
                >
                  Agent &amp; Model
                </th>
                <th className="py-3 px-3">Environment</th>
                <th
                  onClick={() => handleSort('averageScore')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[var(--text-main)]"
                >
                  Avg Score {sortKey === 'averageScore' ? (sortAsc ? '▲' : '▼') : ''}
                </th>
                <th
                  onClick={() => handleSort('slopReductionRate')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[var(--text-main)]"
                >
                  Slop Winnowed {sortKey === 'slopReductionRate' ? (sortAsc ? '▲' : '▼') : ''}
                </th>
                <th
                  onClick={() => handleSort('gatePassRate')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[var(--text-main)]"
                >
                  Gate Pass {sortKey === 'gatePassRate' ? (sortAsc ? '▲' : '▼') : ''}
                </th>
                <th
                  onClick={() => handleSort('l2AuthoredScore')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[var(--text-main)]"
                >
                  L2 Score {sortKey === 'l2AuthoredScore' ? (sortAsc ? '▲' : '▼') : ''}
                </th>
                <th
                  onClick={() => handleSort('avgDiffLines')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[var(--text-main)]"
                >
                  Diff Lines {sortKey === 'avgDiffLines' ? (sortAsc ? '▲' : '▼') : ''}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-line)]">
              {sortedAgents.map((ag) => (
                <tr
                  key={ag.agent}
                  className="hover:bg-[var(--bg-canvas)]/60 transition-colors"
                >
                  <td className="py-3.5 px-3">
                    <span
                      className={`font-serif italic font-bold text-sm ${
                        ag.rank === 1
                          ? 'text-[var(--accent-ember)]'
                          : ag.rank === 2
                          ? 'text-[var(--status-sage)]'
                          : 'text-[var(--text-dim)]'
                      }`}
                    >
                      #{ag.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <strong className="text-[var(--text-main)] block font-sans text-sm">
                      {ag.agent}
                    </strong>
                    <span className="text-[11px] text-[var(--text-dim)]">{ag.model}</span>
                  </td>
                  <td className="py-3.5 px-3 text-[var(--text-dim)]">{ag.environment}</td>
                  <td className="py-3.5 px-3 text-right font-bold text-[var(--text-main)] tabular-nums text-sm">
                    {ag.averageScore}
                  </td>
                  <td className="py-3.5 px-3 text-right text-[var(--status-sage)] tabular-nums font-semibold">
                    {ag.slopReductionRate}%
                  </td>
                  <td className="py-3.5 px-3 text-right tabular-nums">
                    <span
                      className={`px-2 py-0.5 text-[11px] hairline ${
                        ag.gatePassRate >= 80
                          ? 'bg-[var(--status-sage)]/10 text-[var(--status-sage)] border-[var(--status-sage)]/30'
                          : 'bg-[var(--status-warn)]/10 text-[var(--status-warn)] border-[var(--status-warn)]/30'
                      }`}
                    >
                      {ag.gatePassRate}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right text-[var(--text-main)] tabular-nums">
                    {ag.l2AuthoredScore}
                  </td>
                  <td className="py-3.5 px-3 text-right text-[var(--text-dim)] tabular-nums">
                    {ag.avgDiffLines} lines
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Fixture Suite Results Continuous Tabular Ledger (Zero Cards) */}
      <section className="hairline-y py-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-4 hairline-b pb-4">
          <div>
            <span className="font-mono text-xs text-[var(--accent-ember)] uppercase tracking-wider block font-bold">
              FIXTURE TELEMETRY
            </span>
            <h2 className="text-2xl font-serif text-[var(--text-main)] mt-1">
              The 10 Fixture Test Suite Ledger
            </h2>
            <p className="text-xs text-[var(--text-dim)] font-mono mt-1">
              Every fixture represents a distinct real-world architecture with seeded AI design tells.
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            {['all', 'landing', 'dashboard', 'portfolio', 'ecommerce'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`btn text-[11px] font-mono px-3 py-1.5 min-h-[44px] ${
                  filterCategory === cat ? 'primary' : 'bg-[var(--bg-canvas)]'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Tabular Ledger for Fixtures */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="hairline-b text-[var(--text-dim)] uppercase">
                <th className="py-3 pr-4">Fixture Path</th>
                <th className="py-3 px-3">Domain</th>
                <th className="py-3 px-3 text-right">Baseline Score</th>
                <th className="py-3 px-3 text-right">Tells (High / Total)</th>
                <th className="py-3 px-3 text-right">Slop Index</th>
                <th className="py-3 px-3">Gate Status</th>
                <th className="py-3 pl-4">Violations &amp; Failure Cause</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-line)]">
              {filteredFixtures.map((fx) => (
                <tr key={fx.fixture} className="hover:bg-[var(--bg-canvas)]/50 transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-[var(--text-main)]">
                    {fx.fixture}
                  </td>
                  <td className="py-3.5 px-3 text-[var(--text-dim)] uppercase text-[11px]">
                    {fx.category}
                  </td>
                  <td className="py-3.5 px-3 text-right text-[var(--text-main)] tabular-nums font-semibold">
                    {fx.baselineScore} / 100
                  </td>
                  <td className="py-3.5 px-3 text-right text-[var(--accent-ember)] tabular-nums">
                    {fx.highSeverityCount} / {fx.totalFindings}
                  </td>
                  <td className="py-3.5 px-3 text-right text-[var(--status-warn)] tabular-nums font-bold">
                    {fx.slopIndex}/10
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 hairline font-bold ${
                        fx.gateStatus === 'PASS'
                          ? 'bg-[var(--status-sage)]/10 text-[var(--status-sage)] border-[var(--status-sage)]/30'
                          : 'bg-red-500/10 text-red-600 border-red-500/30'
                      }`}
                    >
                      {fx.gateStatus}
                    </span>
                  </td>
                  <td className="py-3.5 pl-4 text-[11px] text-[var(--text-dim)]">
                    {fx.gateViolations && fx.gateViolations.length > 0 ? (
                      <span className="text-red-600">{fx.gateViolations.join(', ')}</span>
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

      {/* 3. Methodology & Governance Continuous Ledger Row (Zero Cards) */}
      <section className="hairline-y py-8 space-y-4">
        <span className="font-mono text-xs text-[var(--accent-ember)] uppercase tracking-wider block font-bold">
          METHODOLOGY // V0-EMPIRICAL
        </span>
        <h3 className="text-xl font-serif text-[var(--text-main)]">
          Benchmarking Governance &amp; Reproducibility
        </h3>
        <p className="text-sm text-[var(--text-dim)] leading-relaxed max-w-[70ch]">
          Automated headless benchmark runs across ten fixture repositories with cold scratch branches, extracted identity tokens, and mobile throttled Lighthouse measurements.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--accent-ember)] pt-2 hairline-t">
          <span>Run Method: Headless Playwright</span>
          <span>•</span>
          <span>Throttle: Mobile Slow 4G</span>
          <span>•</span>
          <span>DPR: 1.5 Capped Ceiling</span>
          <span>•</span>
          <span>Identity Preserved: Enforced</span>
        </div>
      </section>
    </div>
  );
}
