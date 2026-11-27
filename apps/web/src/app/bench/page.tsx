import React from 'react';
import type { Metadata } from 'next';
import benchData from '../../data/bench-results.json';
import {
  BenchClientTable,
  AgentBenchmarkDto,
  FixtureBenchmarkDto,
} from '../../components/BenchClientTable';
import { PageHeader } from '../../components/PageHeader';

export const metadata: Metadata = {
  title: 'Bench',
  description:
    'Measured static audit and gate runs across 10 workspace fixtures and agent profiles.',
};

export default function BenchPage() {
  const formattedRunDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(benchData.metadata.runDate));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20 space-y-12">
      <PageHeader
        eyebrow="Telemetry · 10 Fixtures"
        title="Chaff Bench"
        lead="Measured fixture scores, slop indices, and harness comparison baselines."
      />

      <BenchClientTable
        agents={benchData.leaderboard as AgentBenchmarkDto[]}
        fixtures={benchData.fixtures as FixtureBenchmarkDto[]}
        formattedRunDate={formattedRunDate}
      />
    </div>
  );
}
