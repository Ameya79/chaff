# CHAFF

> **Keep the grain.**  
> Chaff audits the page as it renders, locks what is yours, ships the runtime for risky 3D, and fails the pull request when the page gets slow.

[![CI Status](https://github.com/chaff-dev/chaff/actions/workflows/chaff.yml/badge.svg)](https://github.com/chaff-dev/chaff)
[![Rules](https://img.shields.io/badge/rules-72%20verified-2d6a4f.svg)](#core-rules-taxonomy)
[![Creative Levels](https://img.shields.io/badge/levels-1%20%7C%202%20%7C%203-c2410c.svg)](#the-three-creative-levels)
[![MCP Protocol](https://img.shields.io/badge/mcp-7%20tools%20ready-1c1917.svg)](#model-context-protocol-mcp-server)
[![License](https://img.shields.io/badge/license-MIT-6e655f.svg)](LICENSE)

---

```
┌───────────────────────────────────────┐   winnow   ┌───────────────────────────────────────┐
│           BEFORE: AI SLOP             │  ────────> │         AFTER: CLEAN GRAIN            │
│ 48/100 • 14 tells detected            │            │ 98/100 • 0 open tells, 1 waived       │
├───────────────────────────────────────┤            ├───────────────────────────────────────┤
│ • Generic purple/blue glow gradient   │            │ • Purposeful warm straw paper palette │
│ • Text-clipping gradient headlines    │            │ • High-contrast editorial typography  │
│ • Centered hero with 3 identical cards│            │ • Asymmetric 7/5 telemetry grid       │
│ • "Revolutionary next-gen synergy"    │            │ • Plain domain nouns and fill rates   │
│ • Non-semantic <div onClick> handlers │            │ • Keyboard-accessible <button> tags   │
│ • Fixed 600px width blowing 320px view│            │ • Responsive fluid clamp() layout     │
└───────────────────────────────────────┘            └───────────────────────────────────────┘
```

---

## Quickstart in 30 Seconds

### Option A: The Universal AGENTS.md Pointer (Zero Dependencies)
Drop this lightweight 43-line pointer into your repository root. Every autonomous agent (Claude Code, Cursor, Windsurf, Google Antigravity) will automatically execute the 7-step winnowing lifecycle:

```bash
# Add AGENTS.md pointer to your repo
npx @chaff/cli init
```

### Option B: Local CLI Audit
Run Chaff directly on any project:

```bash
# Audit workspace for AI tells and score out of 100
npx @chaff/cli audit

# Run Performance & Mobile Gate (fails on regressions)
npx @chaff/cli gate
```

---

## The 7-Step Autonomous Agent Workflow

Autonomous agents running Chaff execute an invariant 7-step lifecycle:

```
[1. Read] ──> [2. Look] ──> [3. Audit] ──> [4. Plan] ──> [5. Approve] ──> [6. Implement] ──> [7. Verify]
```

1. **Read**: Inspect framework, router, typography, and design tokens. Formulate intentional brand lock at `.chaff/identity.json`.
2. **Look**: Boot development server; capture rendered DOM metrics at 390px (mobile) and 1440px (desktop) viewports across light/dark themes.
3. **Audit**: Formulate findings against 72 core rules. Deduct points from 100. Waive locked brand tokens.
4. **Plan**:
   - **Level 1**: Ordered minimal fix list.
   - **Level 2 / 3**: Generate 3 diverse **Concept Pitches** (Editorial, Tactile, Technical) and wait for user approval.
5. **Approve**: Document user waivers or concept selection before modifying files.
6. **Implement**: Small, atomic commits tagged with rule IDs (e.g., `git commit -m "fix(chaff): replace gradient headline [UI-002]"`).
7. **Verify**: Typecheck, lint, build, test, and run `chaff gate`. Block PR if Core Web Vitals regress.

---

## The Three Creative Levels

Chaff contracts your agent to a specific creative latitude:

| Level | Name | Diff Budget | Motion & Media | Allowed Operations |
| :--- | :--- | :--- | :--- | :--- |
| **Level 1** | **Clean** | $\le 10$ files, $\le 200$ lines | No animation libs | Safe tell removal, contrast AA fixes, copy pruning, dvh units. Zero layout restructuring. |
| **Level 2** | **Authored** | $\le 25$ files, $\le 800$ lines | Max 1 motion lib | 3 Concept Pitches first. Asymmetric editorial layouts, custom spatial rhythm, 1 signature interaction. |
| **Level 3** | **Risk** | Feature-scoped | WebGL / 3D enabled | Three.js / Canvas experiences strictly governed by the 5-part Fallback Contract. |

### The 5-Part Fallback Contract (Level 3)
Any Level 3 3D/WebGL feature must satisfy all 5 requirements:
1. **Dynamic Import**: Lazy-load canvas via `next/dynamic` or `React.lazy`.
2. **Static Poster Fallback**: Render lightweight image/SVG when WebGL is unavailable or user has `prefers-reduced-motion` / `save-data`.
3. **Device Tiering (`@chaff/tier`)**: Determine GPU capabilities and downgrade complexity on low-tier hardware.
4. **Frame Governor**: Cap device pixel ratio at $\le 1.5$ and pause render loop when offscreen via `IntersectionObserver`.
5. **Payload Budget**: Compressed 3D asset bundle must remain under 250 KB gzipped.

---

## Core Rules Taxonomy (72 Rules)

Rules are organized across 8 categories with 10-field YAML frontmatter and 4 required markdown sections:

- **UI (`rules/ui/`)**: `UI-001` through `UI-009` — Gradient glows, gradient text, centered hero + 3-card grids, backdrop blur illegibility, min-h-screen mobile jumping.
- **Copy (`rules/copy/`)**: `COPY-001` through `COPY-009` — Buzzword salad ("seamless synergy"), synthetic metrics ("10,000+ satisfied clients"), generic testimonials.
- **Code (`rules/code/`)**: `CODE-001` through `CODE-009` — Non-semantic `div onClick`, raw `<img>` layout shifts, internal `<a>` links, missing TypeScript types.
- **Performance (`rules/perf/`)**: `PERF-001` through `PERF-009` — Unsized media, unmemoized SVG loops, synchronous script tags, font flash (FOIT/FOUT).
- **Mobile (`rules/mobile/`)**: `MOBILE-001` through `MOBILE-009` — 320px viewport horizontal overflow, touch targets < 44px, disabled pinch-zoom.
- **Accessibility (`rules/a11y/`)**: `A11Y-001` through `A11Y-009` — WCAG AA contrast (4.5:1), visible focus rings, ARIA labels, form input associations.
- **Motion (`rules/motion/`)**: `MOTION-001` through `MOTION-009` — Mandatory `prefers-reduced-motion`, `transform`/`opacity` transitions only.
- **Three / 3D (`rules/three/`)**: `THREE-001` through `THREE-009` — WebGL context loss handling, DPR ceiling 1.5, geometry disposal.

---

## Model Context Protocol (MCP) Server

Connect Chaff directly to Cursor, Windsurf, Claude Code, or any MCP client via JSON-RPC 2.0 stdio:

```json
{
  "mcpServers": {
    "chaff": {
      "command": "npx",
      "args": ["-y", "@chaff/cli", "mcp"]
    }
  }
}
```

### The 7 MCP Tools
- `audit`: Scan workspace and return findings with overall score out of 100.
- `plan`: Generate ordered fixes (Level 1) or 3 diverse Concept Pitches (Level 2).
- `gate`: Evaluate performance budgets and fail on regressions.
- `get_rule`: Retrieve the complete specification and bad/good examples for any rule ID.
- `explain_finding`: Detailed rationale and smallest surgical fix instructions.
- `waive`: Persist an approved brand exemption in `.chaff/identity.json`.
- `revert`: Safely rollback changes associated with a specific rule ID.

---

## GitHub Actions CI Integration

Fail pull requests that introduce AI slop or exceed performance budgets:

```yaml
name: Chaff Gate

on:
  pull_request:
    branches: [main]

jobs:
  chaff:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - uses: chaff-dev/action@v1
        with:
          level: '2'
          fail-on-regressions: true
          comment-pr: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Chaff Bench v0 Leaderboard

Empirical evaluation of major autonomous AI coding agents across the 10 reference fixtures:

| Rank | Agent | Model | Integration | Score | Slop Cut | Gate Pass | Net Diff |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **#1** | **Google Antigravity** | Gemini 2.5 Pro | `AGENTS.md` / Universal Protocol | **97.4 / 100** | **98.2%** | **100%** | 142 lines |
| **#2** | **Claude Code** | Claude 3.5 Sonnet | `CLAUDE.md` / Native MCP | **96.2 / 100** | **96.5%** | **90%** | 168 lines |
| **#3** | **Cursor** | Claude 3.5 Sonnet | `.cursorrules` / MCP stdio | **93.8 / 100** | **92.4%** | **90%** | 194 lines |
| **#4** | **Windsurf** | Cascade (Sonnet) | `.windsurfrules` / MCP stdio | **91.5 / 100** | **89.8%** | **80%** | 210 lines |

*Full methodology, test runner, and reproducibility notes available in [bench/METHODOLOGY.md](bench/METHODOLOGY.md).*

---

## Repository Structure

```
chaff/
├── CHAFF.md                   # Single-file master autonomous agent protocol
├── AGENTS.md                  # 43-line universal pointer for AI agents
├── CLAUDE.md                  # Claude Code native instructions pointer
├── rules/                     # 72 detection rules across 8 categories
│   ├── ui/                    # UI-001 to UI-009
│   ├── copy/                  # COPY-001 to COPY-009
│   ├── code/                  # CODE-001 to CODE-009
│   ├── perf/                  # PERF-001 to PERF-009
│   ├── mobile/                # MOBILE-001 to MOBILE-009
│   ├── a11y/                  # A11Y-001 to A11Y-009
│   ├── motion/                # MOTION-001 to MOTION-009
│   └── three/                 # THREE-001 to THREE-009
├── levels/                    # Dedicated creative operational contracts
│   ├── level-1.md             # Clean: safe tell removal, strict diff budget
│   ├── level-2.md             # Authored: 3 Concept Pitches, signature moment
│   └── level-3.md             # Risk: WebGL / 3D Fallback Contract
├── packages/
│   ├── core/                  # Rules loader, Identity Lock, adapters, scoring
│   ├── checks/                # Source analyzers and rendered performance gate
│   ├── tier/                  # Device classification runtime (~2 KB)
│   ├── mcp/                   # JSON-RPC 2.0 stdio Model Context Protocol server
│   └── cli/                   # chaff CLI (init, doctor, audit, level, gate, mcp)
├── action/                    # GitHub Action with sticky PR comment generator
├── apps/
│   └── web/                   # High-craft Next.js showcase site & playground
├── fixtures/                  # 10 test fixtures covering diverse web architectures
├── bench/                     # Chaff Bench v0 empirical runner and methodology
└── tests/                     # 61-test Python opaque-box validation suite
```

---

## License

MIT © [Chaff Contributors](https://github.com/chaff-dev/chaff). Keep the grain.
