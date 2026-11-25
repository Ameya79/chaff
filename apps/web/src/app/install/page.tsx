import React from 'react';
import type { Metadata } from 'next';
import { InstallAdaptersWorkbench } from '../../components/InstallAdaptersWorkbench';

export const metadata: Metadata = {
  title: 'Install Chaff CLI & MCP Server',
  description:
    'Install Chaff CLI, generate Cursor, Claude Code, Windsurf, Copilot, and AGENTS.md adapters, and connect the local MCP server.',
};

export default function InstallPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      <header className="space-y-3 pb-6 hairline-b">
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-[var(--text-dim)]">
          <span className="uppercase tracking-[0.16em] text-[var(--accent-ember)] font-semibold">
            Setup &amp; Integrations
          </span>
          <span>100% Local · Zero Cloud Telemetry</span>
        </div>
        <h1 className="font-serif text-[var(--text-main)]">
          Install Chaff &amp; Connect MCP
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-dim)] max-w-[65ch] leading-relaxed">
          Bootstrap Identity Lock and rules across your workspace with one command, or wire the local stdio MCP server into your coding agent.
        </p>
      </header>

      <InstallAdaptersWorkbench />
    </div>
  );
}
