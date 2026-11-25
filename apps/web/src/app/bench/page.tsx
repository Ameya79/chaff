import React from 'react';
import type { Metadata } from 'next';
import benchData from '../../data/bench-results.json';
import {
  BenchClientTable,
  AgentBenchmarkDto,
  FixtureBenchmarkDto,
} from '../../components/BenchClientTable';

export const metadata: Metadata = {
  title: 'Chaff Bench — Fixture Suite & Agent Profiles',
  description:
    'Measured static audit and gate runs across 10 workspace fixtures alongside Chaff Bench v0 agent evaluation profiles.',
};

export default function BenchPage() {
  const formattedRunDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(benchData.metadata.runDate));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      <header className="space-y-3 pb-6 hairline-b">
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-[var(--text-dim)]">
          <span className="uppercase tracking-[0.16em] text-[var(--accent-ember)] font-semibold">
            Benchmark Telemetry
          </span>
          <span>10 Fixture Suite · Methodology v0</span>
        </div>
        <h1 className="font-serif text-[var(--text-main)]">
          Chaff Bench &amp; Fixture Telemetry
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-dim)] max-w-[65ch] leading-relaxed">
          Measured baseline scores, slop indices (/100), and performance gate outcomes across ten real fixture repositories, paired with reference harness comparison baselines.
        </p>
      </header>

      <BenchClientTable
        agents={benchData.leaderboard as AgentBenchmarkDto[]}
        fixtures={benchData.fixtures as FixtureBenchmarkDto[]}
        formattedRunDate={formattedRunDate}
      />
    </div>
  );
}
