import React from 'react';
import type { Metadata } from 'next';
import { InstallAdaptersWorkbench } from '../../components/InstallAdaptersWorkbench';

export const metadata: Metadata = {
  title: 'Install',
  description:
    'Install Chaff CLI, generate IDE adapters, and connect the local MCP server.',
};

export default function InstallPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20 space-y-12">
      <header className="space-y-3">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-ember)] block">
          CLI &amp; MCP
        </span>
        <h1 className="font-serif text-[var(--text-main)]">
          Install &amp; Integrate
        </h1>
        <p className="text-base text-[var(--text-dim)] max-w-[46ch]">
          100% local execution with zero telemetry.
        </p>
      </header>

      <InstallAdaptersWorkbench />
    </div>
  );
}
