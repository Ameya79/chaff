'use client';

import React, { useState, useEffect } from 'react';

interface AdapterGuide {
  id: string;
  name: string;
  targetPath: string;
  description: string;
  content: string;
  notes: string;
}

const ADAPTERS: AdapterGuide[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    targetPath: '.cursor/rules/chaff.mdc',
    description: 'Project-level MDC rule file with glob pattern matching and autonomous workflow.',
    content: `---
description: Chaff design audit and level enforcement protocol
globs: **/*.{tsx,jsx,ts,js,css}
alwaysApply: true
---
# CHAFF DESIGN AUDIT PROTOCOL
1. Read framework & styles -> .chaff/identity.json
2. Dev server @ 390px & 1440px -> inspect geometry
3. Score against 72 rules; waive locked tokens
4. L2/L3: Pitch 3 concepts in .chaff/pitches/; pause for approval
5. Small commits with rule IDs; verify test & gate`,
    notes: 'Stored in .cursor/rules/chaff.mdc and applied across repository edits.',
  },
  {
    id: 'claude',
    name: 'Claude Code',
    targetPath: 'CLAUDE.md',
    description: 'Single-file workspace entry point and skill pointer for Claude Code CLI.',
    content: `# CLAUDE.md — Chaff Audit Pointer
See CHAFF.md for full protocol. Dedicated levels in levels/level-[1-3].md.
1. Read -> .chaff/identity.json (Modify nothing).
2. Look -> Dev server @ 390px & 1440px (light/dark).
3. Audit -> chaff-report.md. Waive locked identity items.
4. Plan -> L1: fixes. L2/L3: 3 Concept Pitches first. Pause.
5. Implement -> Small commits with rule IDs.
6. Verify -> Run pnpm test && chaff gate.`,
    notes: 'Claude Code reads CLAUDE.md at repository root automatically.',
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    targetPath: '.windsurf/rules/chaff.md',
    description: 'Windsurf Cascade character and protocol rule file.',
    content: `# Windsurf Chaff Rules
- Inspect .chaff/identity.json before modifying styles.
- Locked brand tokens (confidence > 0.80) must never be overridden.
- Level 2/3 requires 3 concept pitches before implementation.
- All interactive touch targets must measure >= 44x44px.
- Zero horizontal overflow allowed at 320px viewport width.
- Level 3 3D elements must obey the 5-part Fallback Contract.`,
    notes: 'Loaded automatically by Windsurf Cascade across edits.',
  },
  {
    id: 'antigravity',
    name: 'Antigravity / AGENTS.md',
    targetPath: 'AGENTS.md',
    description: 'Universal instruction file recognized by Antigravity, Codex, and agent harnesses.',
    content: `# AGENTS.md — Universal Chaff Protocol Pointer
1. Read: Inspect framework & styles. Write .chaff/identity.json.
2. Look: Dev server @ 390px & 1440px (light/dark).
3. Audit: Produce chaff-report.md. Score out of 100.
4. Plan: L1: fixes. L2/L3: 3 Concept Pitches first. Pause for approval.
5. Implement: Small commits with rule IDs.
6. Verify: Typecheck, lint, build, test, and chaff gate.`,
    notes: 'Vendor-neutral standard supported across coding agents.',
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    targetPath: '.github/copilot-instructions.md',
    description: 'Repository-level custom instructions for GitHub Copilot Workspace and Chat.',
    content: `# Custom Instructions for GitHub Copilot
- Always run Chaff checks before generating frontend components.
- Never generate unwaived purple/blue glow gradients or gradient text masks.
- Ensure interactive controls have minimum 44x44px touch targets.
- Use tabular-nums on all telemetry numbers.
- Respect prefers-reduced-motion on all animations and shaders.`,
    notes: 'Loaded automatically in VS Code and GitHub Copilot.',
  },
];

const MCP_CONFIG = `{
  "mcpServers": {
    "chaff": {
      "command": "npx",
      "args": ["-y", "@chaff/cli", "mcp"]
    }
  }
}`;

export function InstallAdaptersWorkbench() {
  const [selectedAdapter, setSelectedAdapter] = useState<string>('cursor');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('chaff-ide-choice')
        : null;
    if (saved && ADAPTERS.some((a) => a.id === saved)) {
      setSelectedAdapter(saved);
    }
  }, []);

  const handleSelectAdapter = (id: string) => {
    setSelectedAdapter(id);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('chaff-ide-choice', id);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  const currentAdapter =
    ADAPTERS.find((a) => a.id === selectedAdapter) || ADAPTERS[0];

  return (
    <div className="space-y-10">
      {/* CLI Quickstart */}
      <section className="hairline bg-[var(--bg-surface)] p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-2 min-w-0">
          <span className="font-mono text-xs uppercase text-[var(--accent-ember)] font-bold block">
            CLI Quickstart
          </span>
          <h2 className="font-serif text-2xl text-[var(--text-main)]">
            Initialize &amp; Gate in Two Commands
          </h2>
          <p className="text-sm text-[var(--text-dim)] leading-relaxed">
            Auto-detects Next.js, Vite, or Tailwind tokens, locks your brand identity, and writes IDE adapters.
          </p>
        </div>

        <div className="lg:col-span-8 space-y-4 min-w-0">
          {[
            { id: 'cli-init', cmd: 'npx chaff init --level 3', label: 'Initialize Identity Lock & adapters' },
            { id: 'cli-gate', cmd: 'npx chaff audit && npx chaff gate --level 3', label: 'Run audit + CI budget gate' },
          ].map((item) => (
            <div key={item.id} className="space-y-1.5">
              <span className="font-mono text-xs text-[var(--text-dim)] block">
                {item.label}
              </span>
              <div className="p-3 bg-[var(--bg-inset)] hairline flex items-center justify-between gap-3 font-mono text-xs sm:text-sm">
                <code className="text-[var(--text-main)] font-semibold overflow-x-auto">
                  $ {item.cmd}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(item.cmd, item.id)}
                  className="btn text-xs font-mono shrink-0"
                >
                  {copiedId === item.id ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* IDE Harness Adapters */}
      <section className="hairline bg-[var(--bg-surface)] p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-3 min-w-0">
          <span className="font-mono text-xs uppercase text-[var(--accent-ember)] font-bold block">
            Harness Adapters
          </span>
          <h2 className="font-serif text-2xl text-[var(--text-main)]">
            Select Agent Environment
          </h2>
          <div className="hairline divide-y divide-[var(--border-line)]">
            {ADAPTERS.map((a) => {
              const active = a.id === selectedAdapter;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => handleSelectAdapter(a.id)}
                  aria-pressed={active}
                  className={`w-full text-left px-3.5 py-2.5 min-h-[44px] font-mono text-xs flex items-center justify-between gap-2 transition-colors ${
                    active
                      ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-bold'
                      : 'bg-[var(--bg-surface)] text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]'
                  }`}
                >
                  <span>{a.name}</span>
                  <span className="text-[11px] opacity-80 truncate">{a.targetPath}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4 lg:border-l border-[var(--border-line)] lg:pl-6 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 hairline-b">
            <div className="min-w-0">
              <span className="font-mono text-xs font-bold text-[var(--accent-ember)] block">
                {currentAdapter.targetPath}
              </span>
              <p className="text-xs text-[var(--text-dim)] mt-0.5">
                {currentAdapter.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(currentAdapter.content, 'adapter-code')}
              className="btn primary text-xs font-mono shrink-0"
            >
              {copiedId === 'adapter-code' ? 'Copied' : 'Copy Adapter'}
            </button>
          </div>

          <pre className="p-4 bg-[var(--bg-inset)] hairline font-mono text-xs text-[var(--text-main)] overflow-x-auto leading-relaxed">
            <code>{currentAdapter.content}</code>
          </pre>

          <p className="font-mono text-xs text-[var(--status-sage)]">
            {currentAdapter.notes}
          </p>
        </div>
      </section>

      {/* MCP Server Config */}
      <section className="hairline bg-[var(--bg-surface)] p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-2 min-w-0">
          <span className="font-mono text-xs uppercase text-[var(--accent-ember)] font-bold block">
            Model Context Protocol
          </span>
          <h2 className="font-serif text-2xl text-[var(--text-main)]">
            Connect Chaff MCP Server
          </h2>
          <p className="text-sm text-[var(--text-dim)] leading-relaxed">
            Exposes <code className="mono">audit</code>, <code className="mono">plan</code>, <code className="mono">gate</code>, <code className="mono">get_rule</code>, <code className="mono">explain_finding</code>, <code className="mono">waive</code>, and <code className="mono">revert</code> locally over stdio.
          </p>
        </div>

        <div className="lg:col-span-8 space-y-4 min-w-0">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => copyToClipboard(MCP_CONFIG, 'mcp-config')}
              className="btn text-xs font-mono"
            >
              {copiedId === 'mcp-config' ? 'Copied' : 'Copy MCP JSON'}
            </button>
          </div>
          <pre className="p-4 bg-[var(--bg-inset)] hairline font-mono text-xs text-[var(--text-main)] overflow-x-auto">
            <code>{MCP_CONFIG}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
