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

  const filteredFixtures = filterCategory === 'all'
    ? fixtures
    : fixtures.filter(f => f.category.toLowerCase().includes(filterCategory.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      {/* Header */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] px-2.5 py-1 hairline rounded bg-[var(--bg-surface)]">
          <span>Empirical Benchmark</span>
          <span>/</span>
          <span>Chaff Bench v0</span>
        </div>
        <h1 className="tracking-tight text-[var(--text-main)]">
          Agent Slop & Performance Leaderboard
        </h1>
        <p className="text-lg text-[var(--text-dim)] max-w-3xl leading-relaxed">
          The public leaderboard measuring how autonomous AI coding agents perform on web design authenticity, tell elimination, intentional brand preservation, and performance gates.
        </p>
      </section>

      {/* 1. Main Leaderboard Table */}
      <section className="space-y-4 hairline p-6 sm:p-8 rounded-lg bg-[var(--bg-surface)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hairline-b pb-4">
          <div>
            <h2 className="text-2xl font-serif text-[var(--text-main)]">
              Overall Standings (10 Fixture Suite)
            </h2>
            <p className="text-xs text-[var(--text-dim)] font-mono mt-1">
              Methodology v0-empirical • Run Date: {new Date(benchData.metadata.runDate).toLocaleDateString()}
            </p>
          </div>
          <span className="font-mono text-xs text-[var(--text-dim)]">
            Click column headers to sort
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="hairline-b font-mono text-xs text-[var(--text-dim)] uppercase">
                <th
                  onClick={() => handleSort('rank')}
                  className="py-3 px-3 cursor-pointer hover:text-[var(--text-main)]"
                >
                  Rank {sortKey === 'rank' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
                <th className="py-3 px-3">Agent & Model</th>
                <th className="py-3 px-3">Integration</th>
                <th
                  onClick={() => handleSort('averageScore')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[var(--text-main)]"
                >
                  Score {sortKey === 'averageScore' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
                <th
                  onClick={() => handleSort('slopReductionRate')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[var(--text-main)]"
                >
                  Slop Cut {sortKey === 'slopReductionRate' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
                <th
                  onClick={() => handleSort('gatePassRate')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[var(--text-main)]"
                >
                  Gate Pass {sortKey === 'gatePassRate' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
                <th
                  onClick={() => handleSort('avgDiffLines')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[var(--text-main)]"
                >
                  Diff Lines {sortKey === 'avgDiffLines' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-line)]">
              {sortedAgents.map(agent => (
                <tr key={agent.agent} className="hover:bg-[var(--bg-canvas)] transition-colors">
                  <td className="py-4 px-3 font-mono text-sm font-bold text-[var(--accent-ember)]">
                    #{agent.rank}
                  </td>
                  <td className="py-4 px-3">
                    <div className="font-semibold text-[var(--text-main)] text-sm">{agent.agent}</div>
                    <div className="font-mono text-xs text-[var(--text-dim)]">{agent.model}</div>
                  </td>
                  <td className="py-4 px-3 font-mono text-xs text-[var(--text-dim)]">
                    {agent.environment}
                  </td>
                  <td className="py-4 px-3 text-right font-mono text-sm font-bold text-[var(--status-sage)] tabular-nums">
                    {agent.averageScore.toFixed(1)} / 100
                  </td>
                  <td className="py-4 px-3 text-right font-mono text-xs text-[var(--text-main)] tabular-nums">
                    {agent.slopReductionRate.toFixed(1)}%
                  </td>
                  <td className="py-4 px-3 text-right font-mono text-xs tabular-nums">
                    <span className={`px-2 py-0.5 rounded hairline ${agent.gatePassRate === 100 ? 'bg-[var(--status-sage-soft)] text-[var(--status-sage)] border-[var(--status-sage)]' : 'bg-[var(--bg-surface-elevated)] text-[var(--text-main)]'}`}>
                      {agent.gatePassRate.toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right font-mono text-xs text-[var(--text-dim)] tabular-nums">
                    {agent.avgDiffLines} lines
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Fixture Suite Results */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-serif text-[var(--text-main)]">
              Fixture Suite Empirical Scan
            </h2>
            <p className="text-sm text-[var(--text-dim)]">
              Baseline telemetry from scanning the 10 reference fixtures prior to agent winnowing.
            </p>
          </div>

          <div className="flex gap-2">
            {['all', 'Marketing', 'Enterprise', 'Commerce', 'Publishing'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`btn text-xs font-mono py-1 px-2.5 ${filterCategory === cat ? 'primary' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFixtures.map(fix => (
            <div key={fix.fixture} className="hairline p-5 rounded bg-[var(--bg-surface)] space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-xs text-[var(--accent-ember)] font-semibold uppercase">
                    {fix.category}
                  </span>
                  <h3 className="text-base font-serif text-[var(--text-main)] font-semibold">
                    {fix.fixture}
                  </h3>
                </div>
                <span
                  className={`font-mono text-xs px-2 py-0.5 rounded hairline font-bold ${
                    fix.gateStatus === 'PASS'
                      ? 'bg-[var(--status-sage-soft)] text-[var(--status-sage)] border-[var(--status-sage)]'
                      : 'bg-[var(--accent-ember-soft)] text-[var(--accent-ember)] border-[var(--accent-ember)]'
                  }`}
                >
                  GATE {fix.gateStatus}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center hairline p-3 rounded bg-[var(--bg-canvas)]">
                <div>
                  <span className="text-[10px] text-[var(--text-dim)] block">Score</span>
                  <span className="font-bold text-[var(--text-main)]">{fix.baselineScore}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-dim)] block">Tells</span>
                  <span className="font-bold text-[var(--status-warn)]">{fix.totalFindings}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-dim)] block">Slop Index</span>
                  <span className="font-bold text-[var(--accent-ember)]">{fix.slopIndex}</span>
                </div>
              </div>

              {fix.gateViolations.length > 0 && (
                <div className="text-[11px] font-mono text-[var(--accent-ember)] hairline-t pt-2">
                  <strong>Violations:</strong> {fix.gateViolations.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. Methodology Drawer */}
      <section className="hairline p-6 sm:p-8 rounded-lg bg-[var(--bg-surface)] space-y-4">
        <h2 className="text-2xl font-serif text-[var(--text-main)]">
          Evaluation Methodology & Reproducibility
        </h2>
        <p className="text-sm text-[var(--text-dim)] leading-relaxed">
          Chaff Bench operates in full transparency. Every fixture is checked against the invariant 7-step autonomous protocol, 5-part performance gate, and Identity Lock rules.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 hairline rounded bg-[var(--bg-canvas)] space-y-2 text-xs">
            <strong className="font-mono text-[var(--accent-ember)] block uppercase">1. Standardized Prompts</strong>
            <p className="text-[var(--text-dim)]">Every agent receives identical prompts instructing it to execute the 7-step workflow, respect Identity Lock waivers, and pass <code className="text-[var(--text-main)]">chaff gate</code>.</p>
          </div>
          <div className="p-4 hairline rounded bg-[var(--bg-canvas)] space-y-2 text-xs">
            <strong className="font-mono text-[var(--accent-ember)] block uppercase">2. Empirical Budgets</strong>
            <p className="text-[var(--text-dim)]">Core Web Vitals, 320px mobile overflow, touch targets &ge; 44px, and baseline bundle sizes are strictly evaluated in emulated mobile viewports.</p>
          </div>
          <div className="p-4 hairline rounded bg-[var(--bg-canvas)] space-y-2 text-xs">
            <strong className="font-mono text-[var(--accent-ember)] block uppercase">3. Local Reproduction</strong>
            <p className="text-[var(--text-dim)]">Anyone can run the benchmark locally via <code className="text-[var(--text-main)]">npx tsx bench/runner.ts</code> to independently verify all numbers.</p>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <div className="pt-8 hairline-t flex flex-wrap justify-between items-center gap-4">
        <Link href="/gallery" className="btn">
          ← View Audit Gallery
        </Link>
        <Link href="/playground" className="btn primary">
          Try Interactive Playground →
        </Link>
      </div>
    </div>
  );
}
