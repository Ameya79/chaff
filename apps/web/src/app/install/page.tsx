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
4. L2: Pitch 3 concepts in .chaff/pitches/; pause for approval
5. Small commits with rule IDs; verify test & gate`,
    notes: 'Stored in .cursor/rules/chaff.mdc. Applied automatically on every generation in your repository.',
  },
  {
    id: 'claude',
    name: 'Claude Code',
    targetPath: 'CLAUDE.md',
    description: 'Single-file workspace entry point and skill pointer for Claude Code CLI.',
    content: `# CLAUDE.md — Chaff Audit Pointer
See CHAFF.md for full protocol. Dedicated levels in levels/level-[1-3].md.
INVARIANT WORKFLOW:
1. Read -> .chaff/identity.json (Modify nothing).
2. Look -> Dev server @ 390px & 1440px (light/dark).
3. Audit -> chaff-report.md. Waive locked identity items.
4. Plan -> L1: fixes. L2/L3: 3 Concept Pitches first. Pause.
5. Implement -> Small commits with rule IDs.
6. Verify -> Run pnpm test && chaff gate.
7. Report -> Before/after scores, preserved brand tokens.`,
    notes: 'Claude Code reads CLAUDE.md at the repository root automatically upon launching.',
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    targetPath: '.windsurf/rules/chaff.md',
    description: 'Windsurf Cascade character and protocol rule file.',
    content: `# Windsurf Chaff Rules
- Inspect .chaff/identity.json before modifying styles.
- Locked brand tokens (confidence > 0.80) must never be overridden.
- Level 2 requires 3 concept pitches before implementation.
- All interactive touch targets must measure >= 44x44px.
- Zero horizontal overflow allowed at 320px viewport width.
- Level 3 3D elements must obey the 5-part Fallback Contract.`,
    notes: 'Read by Windsurf Cascade across all multi-file edits.',
  },
  {
    id: 'antigravity',
    name: 'Antigravity / Universal',
    targetPath: 'AGENTS.md',
    description: 'Universal vendor-neutral instruction file recognized by Antigravity, Codex, and agent harnesses.',
    content: `# AGENTS.md — Universal Chaff Protocol Pointer
## Invariant 7-Step Autonomous Workflow
1. Read: Inspect framework & styles. Write .chaff/identity.json.
2. Look: Dev server @ 390px & 1440px (light/dark).
3. Audit: Produce chaff-report.md. Score out of 100.
4. Plan: L1: fixes. L2/L3: 3 Concept Pitches first. Pause for approval.
5. Implement: Small commits with rule IDs.
6. Verify: Typecheck, lint, build, test, and chaff gate.
7. Report: Before/after score, preserved items.`,
    notes: 'Universal standard supported across autonomous coding agents.',
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    targetPath: '.github/copilot-instructions.md',
    description: 'Repository-level custom instructions for GitHub Copilot Workspace and Chat.',
    content: `# Custom Instructions for GitHub Copilot
- Always run Chaff checks before generating frontend components.
- Do not generate purple or blue glow gradients or transparent text clippings.
- Ensure all interactive elements have minimum 44px touch targets.
- Ensure all numbers and scores use tabular-nums font formatting.
- Respect prefers-reduced-motion for all CSS transitions and canvas animations.`,
    notes: 'Copilot loads these instructions automatically in VS Code and GitHub web editor.',
  },
];

export default function InstallPage() {
  const [selectedAdapter, setSelectedAdapter] = useState<string>('cursor');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Read from cookie first, fallback to localStorage
    const match = typeof document !== 'undefined' && document.cookie.match(/(?:^|;\s*)chaff-ide-choice=([^;]+)/);
    const cookieChoice = match ? decodeURIComponent(match[1]) : null;
    const saved = cookieChoice || (typeof localStorage !== 'undefined' ? localStorage.getItem('chaff-ide-choice') : null);
    if (saved && ADAPTERS.some((a) => a.id === saved)) {
      setSelectedAdapter(saved);
    }
  }, []);

  const handleSelectAdapter = (id: string) => {
    setSelectedAdapter(id);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('chaff-ide-choice', id);
    }
    if (typeof document !== 'undefined') {
      document.cookie = `chaff-ide-choice=${encodeURIComponent(id)}; path=/; max-age=31536000; SameSite=Lax`;
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentAdapter = ADAPTERS.find((a) => a.id === selectedAdapter) || ADAPTERS[0];

  const mcpConfig = `{
  "mcpServers": {
    "chaff": {
      "command": "npx",
      "args": ["-y", "@chaff/cli", "mcp"]
    }
  }
}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-16">
      {/* Header Register */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 hairline-b pb-3 font-mono text-xs text-[var(--text-dim)]">
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent-ember)] font-bold">SPEC //</span>
            <span className="uppercase tracking-widest text-[var(--text-main)] font-semibold">DEPLOYMENT SPECIFICATION</span>
          </div>
          <div>CLI RUNTIME &amp; MCP SERVER</div>
        </div>
        <h1 className="tracking-tight text-[var(--text-main)] font-serif">
          Install Chaff &amp; Connect MCP
        </h1>
        <p className="text-[var(--text-dim)] text-lg max-w-[68ch]">
          Install via one CLI command, link the native adapter for your preferred coding environment, or connect the Chaff MCP server for tool-driven audits.
        </p>
      </div>

      {/* 1. Quick Start Terminal Ledger (Margin Headers, Zero Cards) */}
      <section className="hairline-y py-10 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Margin Header */}
          <div className="lg:col-span-3 space-y-3 font-mono text-xs">
            <span className="font-mono text-xs text-[var(--accent-ember)] uppercase tracking-wider block font-bold">
              01 // QUICKSTART CLI
            </span>
            <h2 className="font-serif text-2xl text-[var(--text-main)] font-normal">
              Initialize with One Command
            </h2>
            <p className="text-xs text-[var(--text-dim)] font-sans leading-relaxed">
              Zero local dependencies. Works with npm, pnpm, yarn, or bun.
            </p>
            <div className="pt-2 text-[11px] text-[var(--text-dim)]">
              Tally: <strong className="text-[var(--text-main)]">||||</strong>
            </div>
          </div>

          {/* Right Main Stream */}
          <div className="lg:col-span-9 lg:border-l border-[var(--border-line)] lg:pl-8 space-y-6">
            <div className="space-y-3">
              <span className="font-mono text-xs text-[var(--text-dim)] block">
                Auto-detect framework, style tokens &amp; IDE adapter:
              </span>
              <div className="hairline-y py-3 px-4 bg-[var(--bg-canvas)] flex justify-between items-center font-mono text-sm">
                <code className="text-[var(--text-main)] font-semibold">$ npx chaff init --level 2</code>
                <button
                  onClick={() => copyToClipboard('npx chaff init --level 2', 'cli-init')}
                  className="btn text-xs px-3 py-1.5 min-h-[44px]"
                >
                  {copiedId === 'cli-init' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-[var(--text-dim)] font-mono">
                Scans your styling tokens, writes <code className="mono">.chaff/identity.json</code>, and creates IDE adapter files.
              </p>
            </div>

            <div className="space-y-3 hairline-t pt-4">
              <span className="font-mono text-xs text-[var(--text-dim)] block">
                Audit the project and enforce performance gate in CI:
              </span>
              <div className="hairline-y py-3 px-4 bg-[var(--bg-canvas)] flex justify-between items-center font-mono text-sm">
                <code className="text-[var(--text-main)] font-semibold">$ npx chaff audit &amp;&amp; npx chaff gate</code>
                <button
                  onClick={() => copyToClipboard('npx chaff audit && npx chaff gate', 'cli-audit')}
                  className="btn text-xs px-3 py-1.5 min-h-[44px]"
                >
                  {copiedId === 'cli-audit' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-[var(--text-dim)] font-mono">
                Outputs <code className="mono">chaff-report.md</code> with scores out of 100 and fails CI on performance regression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Asymmetric IDE Adapter Broadsheet Sheet (Margin Headers, Zero Cards) */}
      <section className="hairline-y py-10 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left IDE Switcher Rail & Margin Header */}
          <div className="lg:col-span-4 space-y-3 lg:pr-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] font-bold block">
              02 // HARNESS ADAPTERS
            </span>
            <h2 className="font-serif text-2xl text-[var(--text-main)] font-normal">
              Autonomous Agent Harness Adapters
            </h2>
            <p className="text-xs text-[var(--text-dim)] font-sans leading-relaxed">
              Select your coding environment. Chaff generates project-level instruction files tailored to each harness.
            </p>
            <div className="hairline-y divide-y divide-[var(--border-line)] pt-1">
              {ADAPTERS.map((a) => {
                const isSelected = selectedAdapter === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => handleSelectAdapter(a.id)}
                    className={`w-full text-left py-3 px-3 text-xs font-mono flex items-center justify-between transition-colors min-h-[44px] ${
                      isSelected
                        ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-semibold'
                        : 'text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]'
                    }`}
                  >
                    <span>{a.name}</span>
                    <span className="text-[10px] opacity-75">{a.targetPath}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] font-mono text-[var(--text-dim)] pt-2">
              Choice is remembered locally in your browser for return visits.
            </p>
          </div>

          {/* Right Adapter Code Sheet */}
          <div className="lg:col-span-8 space-y-4 lg:border-l border-[var(--border-line)] lg:pl-8 pt-6 lg:pt-0">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 hairline-b pb-3">
              <div>
                <span className="font-mono text-xs text-[var(--accent-ember)] font-bold block">
                  FILE TARGET: {currentAdapter.targetPath}
                </span>
                <p className="text-xs text-[var(--text-dim)] mt-0.5">
                  {currentAdapter.description}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(currentAdapter.content, 'adapter-code')}
                className="btn primary text-xs px-3.5 py-2 min-h-[44px]"
              >
                {copiedId === 'adapter-code' ? 'Copied' : 'Copy Adapter Content'}
              </button>
            </div>

            <pre className="text-xs font-mono text-[var(--text-main)] overflow-x-auto p-4 bg-[var(--bg-canvas)] hairline leading-relaxed">
              <code>{currentAdapter.content}</code>
            </pre>

            <div className="pt-2 text-xs font-mono text-[var(--text-dim)] flex items-center gap-2">
              <span className="text-[var(--status-sage)] font-bold">[NOTE]</span>
              <span>{currentAdapter.notes}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MCP Server Configuration (Margin Headers, Zero Cards) */}
      <section className="hairline-y py-10 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Margin Header */}
          <div className="lg:col-span-3 space-y-3 font-mono text-xs">
            <span className="font-mono text-xs text-[var(--accent-ember)] uppercase tracking-wider block font-bold">
              03 // MCP SERVER
            </span>
            <h2 className="font-serif text-2xl text-[var(--text-main)] font-normal">
              Connect Chaff MCP Server
            </h2>
            <p className="text-xs text-[var(--text-dim)] font-sans leading-relaxed">
              stdio JSON-RPC protocol. Enables agent tool invocation for audit, plan, gate, get_rule, and waive.
            </p>
            <div className="pt-2 text-[11px] text-[var(--text-dim)]">
              Tally: <strong className="text-[var(--text-main)]">|||| |</strong>
            </div>
          </div>

          {/* Right MCP Content Stream */}
          <div className="lg:col-span-9 lg:border-l border-[var(--border-line)] lg:pl-8 space-y-6">
            <p className="text-sm text-[var(--text-dim)] max-w-[68ch]">
              Add Chaff to your MCP client configuration (Claude Desktop, Cursor MCP, Windsurf MCP, or Antigravity) to enable native agent tool invocation for <code className="mono">audit</code>, <code className="mono">plan</code>, <code className="mono">gate</code>, <code className="mono">get_rule</code>, and <code className="mono">waive</code>.
            </p>

            <div className="relative">
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => copyToClipboard(mcpConfig, 'mcp-config')}
                  className="btn text-xs px-3 py-1.5 min-h-[44px] bg-[var(--bg-surface)]"
                >
                  {copiedId === 'mcp-config' ? 'Copied' : 'Copy JSON'}
                </button>
              </div>
              <pre className="text-xs font-mono text-[var(--text-main)] overflow-x-auto p-4 bg-[var(--bg-canvas)] hairline">
                <code>{mcpConfig}</code>
              </pre>
            </div>

            {/* 3 Security Directives: Continuous Ruled Columns (Zero Cards) */}
            <div className="hairline-y py-4 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-line)] font-mono text-xs text-[var(--text-dim)]">
              <div className="py-2 sm:py-0 sm:px-4">
                <strong className="text-[var(--text-main)] block mb-1">Local &amp; Private:</strong>
                Never sends code to external cloud endpoints.
              </div>
              <div className="py-2 sm:py-0 sm:px-4">
                <strong className="text-[var(--text-main)] block mb-1">Zero Secrets:</strong>
                Strictly forbids reading .env or credentials.
              </div>
              <div className="py-2 sm:py-0 sm:px-4">
                <strong className="text-[var(--text-main)] block mb-1">Untrusted Guard:</strong>
                Treats repo files as data, never prompt instructions.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
