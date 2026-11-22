# Chaff Bench v0: Autonomous Agent Design & Budget Methodology

## 1. Objective
Chaff Bench is the first empirical leaderboard measuring how autonomous AI coding agents perform on web design authenticity, tell elimination, brand preservation, and performance budget enforcement.

Instead of subjective grading, Chaff Bench scores agents on empirical criteria:
1. **Slop Reduction Rate**: Percentage of AI-generated design tells (purple glows, centered cards, synthetic metrics, non-semantic buttons) successfully identified and winnowed.
2. **Brand Preservation**: Zero modification to deliberate design tokens locked in `.chaff/identity.json`.
3. **Budget Gate Pass Rate**: Percentage of refactors passing the 5 Core Web Vitals and Mobile budgets.
4. **Diff Restraint**: Net lines changed under Level 1 (Clean) and Level 2 (Authored) diff budgets.

---

## 2. Fixture Corpus
The benchmark tests 10 diverse, real-world representative fixtures:

| Fixture | Category | Architecture | Primary Challenge |
| :--- | :--- | :--- | :--- |
| `saas-landing` | Marketing | Next.js App Router, Tailwind | Eliminate purple/blue glow, centered 3-card grid, buzzwords |
| `dashboard` | Enterprise | Next.js App Router, CSS | Non-semantic `<div onClick>`, low contrast, keyboard focus |
| `portfolio` | Editorial | Next.js App Router, Tailwind | Cumulative layout shift (CLS), missing reduced motion |
| `ecommerce-shop` | Commerce | Next.js App Router, Tailwind | Touch targets < 44px, missing form labels, mobile overflow |
| `blog` | Publishing | Next.js App Router, CSS | Typographic hierarchy, line-length constraints, font weights |
| `docs-site` | Documentation | Next.js App Router, Tailwind | Code block accessibility, copy contrast, anchor tags |
| `legacy-pages-router`| Legacy | Next.js Pages Router | Routing migration compatibility, static asset paths |
| `tailwind-v4` | Modern CSS | Tailwind CSS v4 (`@theme`) | CSS custom property tokens, no `tailwind.config.js` |
| `vite-react` | SPA | Vite + React 18 | Synchronous Three.js payload, uncapped DPR |
| `monorepo` | Workspace | Turborepo / pnpm | Multi-package workspace resolution, shared token imports |

---

## 3. Evaluation Protocol
Each agent is provided with an identical initial environment containing:
- The target fixture codebase.
- The project `DESIGN.md` or brand specification.
- The Chaff universal pointer (`AGENTS.md`, `CLAUDE.md`, or IDE adapter).
- The `@chaff/mcp` Model Context Protocol server.

The agent executes the invariant 7-step autonomous lifecycle:
1. **Read**: Inspect codebase and form Identity Lock.
2. **Look**: Evaluate visual DOM metrics at 390px and 1440px viewports.
3. **Audit**: Formulate findings and score out of 100.
4. **Plan**: Generate ordered fixes (Level 1) or 3 diverse Concept Pitches (Level 2).
5. **Approve**: Seek user/test harness waiver confirmation.
6. **Implement**: Small, atomic commits tagged with rule IDs.
7. **Verify**: Typecheck, lint, build, test, and pass `chaff gate`.

---

## 4. Scoring Metrics Formula

$$\text{Slop Index} = \min\left(100, (\text{Findings} \times 7) + (\text{High-Severity Tells} \times 12)\right)$$

$$\text{Overall Score} = 100 - \sum \text{Deductions} + \text{Waived Exemptions}$$

$$\text{Gate Pass} = \begin{cases} 1 & \text{if all 5 performance \& mobile budgets pass} \\ 0 & \text{if any budget fails} \end{cases}$$

---

## 5. Reproducibility
To reproduce the Chaff Bench v0 evaluation locally:
```bash
# 1. Clone repository and install dependencies
git clone https://github.com/chaff-dev/chaff.git
cd chaff
pnpm install

# 2. Run the automated fixture benchmark runner
pnpm bench

# 3. View empirical results
cat bench/results.json
```
