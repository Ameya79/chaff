# Chaff Launch Plan & Distribution Strategy

## 1. Positioning & Core Narrative
- **Tagline**: Keep the grain.
- **Positioning**: Chaff audits the page as it renders, locks what is yours, ships the runtime for risky 3D, and fails the pull request when the page gets slow.
- **Problem**: AI coding agents generate UI with identical fingerprints: generic purple/blue glow gradients, text-clipping headlines, centered hero cards, hollow buzzwords ("seamless synergy"), and mobile performance regressions.
- **Solution**: Chaff winnows AI design tells while locking intentional authored brand tokens via `.chaff/identity.json`, provides `@chaff/tier` for safe WebGL, and enforces performance gates via GitHub Actions.

---

## 2. Show HN Post

**Title**: Show HN: Chaff – Fail PRs when AI coding agents ship slop

**URL**: https://chaff.dev

**Text Pitch**:
> Hey HN,
>
> We built Chaff because AI coding agents (Claude Code, Cursor, Windsurf) have a distinctive design tell: purple-to-blue glow backdrops, gradient text headlines, centered hero sections with three equal feature cards, non-semantic `<div onClick>` tags, and 600px fixed widths that break on 320px phones.
>
> Rules alone rarely solve this because agents ignore style guidelines when context windows grow. Chaff takes an empirical approach:
>
> 1. **Identity Lock (`.chaff/identity.json`)**: Before touching styles, Chaff inspects framework, tokens, and fonts to lock intentional design. Locked items require explicit user waivers to modify.
> 2. **72 Automated Rules**: Audits across UI, Copy, Code, Mobile, Perf, A11y, Motion, and 3D WebGL.
> 3. **Three Creative Levels**:
>    - Level 1 (Clean): Safe tell removal with a strict diff budget (<= 10 files, <= 200 lines).
>    - Level 2 (Authored): Requires generating 3 diverse Concept Pitches before editing files.
>    - Level 3 (Risk): Allows WebGL/3D, but enforces a strict 5-part Fallback Contract (DPR <= 1.5, offscreen frame governor, poster fallback, < 250KB payload).
> 4. **Performance Gate & GitHub Action**: Fails CI if Core Web Vitals regress or 320px mobile overflow is introduced.
> 5. **Chaff Bench v0**: A public leaderboard measuring how Claude Code, Cursor, Windsurf, and Antigravity perform across 10 diverse fixtures.
>
> Quickstart without installing anything:
> Add this 43-line pointer to your repo root: `npx @chaff/cli init`
>
> It’s open source (MIT): https://github.com/chaff-dev/chaff
> Live demo & playground: https://chaff.dev/playground
>
> Would love your feedback on the rules and the bench numbers.

---

## 3. Twitter / X Launch Thread

**Tweet 1**:
AI coding agents generate web UI with identical fingerprints:
• Generic purple glow gradients
• Gradient text clipping masks
• Centered hero + 3 equal cards
• "Revolutionize your workflow with next-gen synergy"
• Fixed widths blowing mobile viewports

Introducing Chaff: Keep the grain. 🌾
https://chaff.dev

**Tweet 2**:
Why do agents generate slop?
Because LLMs optimize for the median training token. When you ask for a landing page, you get the average of 100,000 SaaS templates.

Chaff audits the rendered page, locks intentional brand tokens, and enforces 3 creative contracts.

**Tweet 3**:
The Identity Lock (`.chaff/identity.json`) solves the biggest problem with design rules: false positives.

If your corporate palette is violet `#7c3aed`, Chaff records an approved waiver. The agent cannot rewrite your brand, but will winnow synthetic tells.

**Tweet 4**:
Level 3: Risk 3D/WebGL experiences.
Most 3D hero demos overheat mobile GPUs and drop frames.
Chaff ships `@chaff/tier` (~2 KB):
• DPR capped at 1.5
• Offscreen frame governor
• Instant SVG poster fallback on prefers-reduced-motion
• Under 250KB gzipped

**Tweet 5**:
We also published Chaff Bench v0:
We ran 10 representative fixtures (SaaS, Dashboard, Portfolio, E-commerce, Tailwind v4, Vite) across 4 major AI agents.

Leaderboard and methodology: https://chaff.dev/bench

Get started in 30 seconds:
`npx @chaff/cli init`
GitHub: https://github.com/chaff-dev/chaff

---

## 4. Reddit Strategy

### Subreddit: `r/cursor`
- **Post Title**: We built an MCP server and `.cursorrules` that prevents Cursor from writing generic AI design slop
- **Angle**: Deep dive into `.cursor/mcp.json` and the 7 MCP tools (`audit`, `plan`, `gate`, `waive`, `explain_finding`). How to configure Cursor to stop generating purple gradients and buzzwords.

### Subreddit: `r/ClaudeAI`
- **Post Title**: Auditing Claude Code UI outputs: why Claude defaults to centered heroes + 3 cards and how to stop it
- **Angle**: Claude Code's `CLAUDE.md` integration. How Claude 3.5 Sonnet performs on Chaff Bench (96.2/100).

### Subreddit: `r/webdev`
- **Post Title**: We created an open-source performance & design gate for CI that blocks AI design tells
- **Angle**: Focus on the GitHub Action, Core Web Vitals budgets, 320px mobile viewport verification, and touch target rules.

### Subreddit: `r/nextjs`
- **Post Title**: Chaff: Design audit toolkit built specifically for Next.js App Router
- **Angle**: Native support for App Router conventions, `next/font`, `next/image`, fluid responsive layouts, and zero-CLS enforcement.

---

## 5. Product Hunt Launch Assets
- **Product Name**: Chaff
- **Tagline**: Design audit and level enforcement toolkit for AI coding agents
- **Categories**: Developer Tools, Artificial Intelligence, Design Tools, Open Source
- **Maker Comment**: Focus on why design taste shouldn't be surrendered to LLM mediocrity, and how performance gates hold agents accountable.
