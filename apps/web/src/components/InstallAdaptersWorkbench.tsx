'use client';

import React, { useState, useEffect } from 'react';

interface AdapterGuide {
  id: string;
  name: string;
  targetPath: string;
  content: string;
}

const ADAPTERS: AdapterGuide[] = [
  {
    id: 'antigravity',
    name: 'Antigravity / Universal',
    targetPath: 'AGENTS.md',
    content: `# AGENTS.md — Universal Chaff Protocol Pointer
1. Read CHAFF.md and inspect the user's own project first (.chaff/identity.json).
2. Capture live UI @ 390px & 1440px (Light and Dark themes).
3. Audit tells across 72 rules; waive locked brand tokens.
Follow https://github.com/Ameya79/chaff/blob/main/docs/link-run.md and choose a direction autonomously.
5. Apply small, rule-tagged commits and run chaff audit + chaff gate.`,
  },
  {
    id: 'claude',
    name: 'Claude Code',
    targetPath: 'CLAUDE.md',
    content: `# CLAUDE.md — Chaff Protocol Pointer
See CHAFF.md for full protocol. Dedicated levels in levels/level-[1-3].md.
1. Inspect the user's project tokens, fonts & routes -> .chaff/identity.json.
2. Inspect rendered UI @ 390px & 1440px.
Follow https://github.com/Ameya79/chaff/blob/main/docs/link-run.md and choose a direction autonomously.
4. Implement surgical commits tagged with rule IDs.
5. Verify -> run pnpm test && chaff gate.`,
  },
  {
    id: 'cursor',
    name: 'Cursor',
    targetPath: '.cursor/rules/chaff.mdc',
    content: `---
description: Chaff chat-first UI craft protocol and Level 1-3 gates
globs: **/*.{tsx,jsx,ts,js,svelte,vue,astro,html,css,scss}
alwaysApply: true
---
# CHAFF PROTOCOL
1. Read user project framework & styles -> .chaff/identity.json
2. Inspect dev server @ 390px & 1440px
3. Score against 72 rules; waive locked tokens
Follow https://github.com/Ameya79/chaff/blob/main/docs/link-run.md and choose a direction autonomously.
5. Small commits with rule IDs; verify test & gate`,
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    targetPath: '.windsurf/rules/chaff.md',
    content: `# Windsurf Chaff Rules
- Inspect .chaff/identity.json before modifying styles.
- Locked brand tokens (confidence > 0.80) must never be overridden.
- Tailor Level 1/2/3 choices directly to the user's project domain.
- All interactive touch targets must measure >= 44x44px.
- Zero horizontal overflow allowed at 320px viewport width.
- Level 3 WebGL scenes must obey the 5-part Fallback Contract.`,
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    targetPath: '.github/copilot-instructions.md',
    content: `# Custom Instructions for GitHub Copilot
- Inspect the user's own tokens before applying UI rules.
- Avoid unwaived glow gradients or clipped-gradient headlines.
- Ensure interactive controls meet >= 44x44px touch targets.
- Use tabular-nums on telemetry figures.
- Respect prefers-reduced-motion across animations and shaders.`,
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

const CHAT_SNIPPET =
  'https://github.com/Ameya79/chaff';

export function InstallAdaptersWorkbench() {
  const [selectedAdapter, setSelectedAdapter] = useState<string>('antigravity');
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
    <div className="space-y-20 sheet-in" style={{ '--d': '120ms' } as React.CSSProperties}>
      {/* Zero-Config Paste In Chat */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start hairline-t pt-12">
        <div className="lg:col-span-4 space-y-2 min-w-0">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent)] font-medium block">
            Recommended · Zero Setup
          </span>
          <h2 className="font-display text-3xl text-[var(--text-main)]">
            Paste in Chat
          </h2>
          <p className="text-sm text-[var(--text-dim)] leading-relaxed">
            Open your project in a coding agent and paste this GitHub link. The agent picks a route, builds a direction, then checks the rendered result on phone and desktop.
          </p>
        </div>

        <div className="lg:col-span-8 space-y-4 min-w-0">
          <div className="rounded-[10px] bg-[var(--bg-surface)] hairline-box p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <code className="font-mono text-xs sm:text-sm text-[var(--text-main)] leading-relaxed">
              {CHAT_SNIPPET}
            </code>
            <button
              type="button"
              onClick={() => copyToClipboard(CHAT_SNIPPET, 'chat-snippet')}
              className="btn accent text-xs font-mono shrink-0"
            >
              {copiedId === 'chat-snippet' ? 'Copied' : 'Copy GitHub link'}
            </button>
          </div>
        </div>
      </section>

      {/* Optional CLI Verification Commands */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start hairline-t pt-12">
        <div className="lg:col-span-4 space-y-2 min-w-0">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent)] font-medium block">
            Optional CI / Local Gate
          </span>
          <h2 className="font-display text-3xl text-[var(--text-main)]">
            CLI Verification
          </h2>
        </div>

        <div className="lg:col-span-8 divide-y divide-[var(--border-line)] hairline-y min-w-0">
          {[
            { id: 'cli-init', cmd: 'npx @chaff/cli init', label: 'Save .chaff/identity.json lock' },
            { id: 'cli-gate', cmd: 'npx @chaff/cli audit && npx @chaff/cli gate --level 3', label: 'Run audit + gate checks' },
          ].map((item) => (
            <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <span className="font-mono text-xs text-[var(--text-dim)] block">
                  {item.label}
                </span>
                <code className="font-mono text-xs sm:text-sm text-[var(--text-main)] block overflow-x-auto">
                  $ {item.cmd}
                </code>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(item.cmd, item.id)}
                className="btn text-xs font-mono shrink-0"
              >
                {copiedId === item.id ? 'Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* IDE Harness Adapters */}
      <section className="scroll-sheet grid grid-cols-1 lg:grid-cols-12 gap-8 items-start hairline-t pt-12">
        <div className="lg:col-span-4 space-y-4 min-w-0">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent)] font-medium block">
            Adapters
          </span>
          <h2 className="font-display text-3xl text-[var(--text-main)]">
            Pin to Workspace
          </h2>
          <div className="divide-y divide-[var(--border-line)] hairline-y">
            {ADAPTERS.map((a) => {
              const active = a.id === selectedAdapter;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => handleSelectAdapter(a.id)}
                  aria-pressed={active}
                  className={`w-full text-left px-3 py-3 min-h-[44px] font-mono text-xs flex items-center justify-between gap-2 transition-colors duration-200 border-l-2 ${
                    active
                      ? 'border-[var(--accent)] bg-[var(--bg-surface)] text-[var(--text-main)] font-semibold'
                      : 'border-transparent text-[var(--text-dim)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <span>{a.name}</span>
                  <span className="text-[11px] opacity-80 truncate">{a.targetPath}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div key={currentAdapter.id} className="lg:col-span-8 space-y-4 min-w-0 panel-enter">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-xs text-[var(--accent)]">
              {currentAdapter.targetPath}
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard(currentAdapter.content, 'adapter-code')}
              className="btn primary text-xs font-mono shrink-0"
            >
              {copiedId === 'adapter-code' ? 'Copied' : 'Copy Adapter'}
            </button>
          </div>

          <pre className="p-5 rounded-[8px] bg-[var(--bg-surface)] hairline-box font-mono text-xs text-[var(--text-main)] overflow-x-auto leading-relaxed">
            <code>{currentAdapter.content}</code>
          </pre>
        </div>
      </section>

      {/* MCP Server Config */}
      <section className="scroll-sheet grid grid-cols-1 lg:grid-cols-12 gap-8 items-start hairline-t pt-12">
        <div className="lg:col-span-4 space-y-2 min-w-0">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent)] font-medium block">
            Stdio MCP
          </span>
          <h2 className="font-display text-3xl text-[var(--text-main)]">
            MCP Server
          </h2>
          <p className="text-sm text-[var(--text-dim)]">
            Exposes audit, plan, gate, get_rule, waive, and revert over stdio.
          </p>
        </div>

        <div className="lg:col-span-8 space-y-3 min-w-0">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => copyToClipboard(MCP_CONFIG, 'mcp-config')}
              className="btn text-xs font-mono"
            >
              {copiedId === 'mcp-config' ? 'Copied' : 'Copy JSON'}
            </button>
          </div>
          <pre className="p-5 rounded-[8px] bg-[var(--bg-surface)] hairline-box font-mono text-xs text-[var(--text-main)] overflow-x-auto">
            <code>{MCP_CONFIG}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
