'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-16">
      {/* Header Register */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] px-3 py-1 hairline rounded bg-[var(--bg-surface)]">
          <span>EMPIRICAL BENCHMARK</span>
          <span>/</span>
          <span>CHAFF BENCH V0</span>
        </div>
        <h1 className="tracking-tight text-[var(--text-main)] font-serif">
          The Agent Slop & Gate Leaderboard
        </h1>
        <p className="text-[var(--text-dim)] text-lg max-w-[68ch]">
          The open benchmark evaluating how autonomous AI coding agents perform on web design authenticity, tell elimination, intentional brand preservation, and performance budgets across 10 fixture repositories.
        </p>
      </div>

      {/* 1. Main Leaderboard Table */}
      <section className="hairline p-6 sm:p-8 rounded-md bg-[var(--bg-surface)] space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 hairline-b pb-4">
          <div>
            <h2 className="text-2xl font-serif text-[var(--text-main)]">
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
                  Agent & Model
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
                      className={`px-2 py-0.5 rounded text-[11px] hairline ${
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

      {/* 2. Fixture Suite Results Register */}
      <section className="hairline p-6 sm:p-8 rounded-md bg-[var(--bg-surface)] space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-4 hairline-b pb-4">
          <div>
            <h2 className="text-2xl font-serif text-[var(--text-main)]">
              The 10 Fixture Test Suite
            </h2>
            <p className="text-xs text-[var(--text-dim)] font-mono mt-1">
              Every fixture represents a distinct real-world architecture with seeded AI design tells.
            </p>
          </div>
          <div className="flex gap-2">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFixtures.map((fx) => (
            <div
              key={fx.fixture}
              className="hairline p-4 rounded bg-[var(--bg-canvas)] space-y-3"
            >
              <div className="flex justify-between items-baseline hairline-b pb-2">
                <span className="font-mono text-xs font-bold text-[var(--accent-ember)]">
                  {fx.fixture}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded hairline ${
                    fx.gateStatus === 'PASS'
                      ? 'bg-[var(--status-sage)]/10 text-[var(--status-sage)] border-[var(--status-sage)]/30'
                      : 'bg-red-500/10 text-red-600 border-red-500/30'
                  }`}
                >
                  Gate: {fx.gateStatus}
                </span>
              </div>

              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--text-dim)]">Category: {fx.category}</span>
                <span className="text-[var(--text-main)] font-semibold tabular-nums">
                  Baseline: {fx.baselineScore} / 100
                </span>
              </div>

              <div className="text-[11px] font-mono text-[var(--text-dim)] flex justify-between">
                <span>Total Tells: <strong className="text-[var(--text-main)]">{fx.totalFindings}</strong></span>
                <span>High Severity: <strong className="text-[var(--accent-ember)]">{fx.highSeverityCount}</strong></span>
                <span>Slop Index: <strong className="text-[var(--status-warn)]">{fx.slopIndex}/10</strong></span>
              </div>

              {fx.gateViolations && fx.gateViolations.length > 0 && (
                <div className="pt-2 hairline-t text-[11px] font-mono text-red-600">
                  <span>Fail Causes: {fx.gateViolations.join(', ')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. Methodology & Governance Ledger */}
      <section className="hairline p-6 sm:p-8 rounded-md bg-[var(--bg-surface)] space-y-4">
        <h3 className="text-xl font-serif text-[var(--text-main)]">
          Benchmarking Governance & Methodology
        </h3>
        <p className="text-sm text-[var(--text-dim)] leading-relaxed max-w-[70ch]">
          Chaff Bench runs automated headless test runs across ten fixture repositories. Each run uses cold scratch branches, extracts identity tokens into <code className="mono">.chaff/identity.json</code>, executes source and rendered-page checks, and measures mobile throttled performance through Lighthouse. Rankings are computed deterministically without manual intervention.
        </p>
        <div className="flex items-center gap-4 text-xs font-mono text-[var(--accent-ember)] pt-2">
          <span>Run Method: Headless Playwright</span>
          <span>•</span>
          <span>Throttle: Mobile Slow 4G</span>
          <span>•</span>
          <span>DPR: 1.5 Capped</span>
        </div>
      </section>
    </div>
  );
}
