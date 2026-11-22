---
id: MOTION-009
title: Enforce single motion library dependency budget and prohibit multi-library stacking
severity: high
levels: [1, 2]
detect: static
fix_class: dependency_budget
bad: "{\n  \"dependencies\": {\n    \"framer-motion\": \"^11.0.0\",\n    \"gsap\": \"^3.12.5\",\n    \"animejs\": \"^3.2.2\"\n  }\n}"
good: "{\n  \"dependencies\": {\n    \"motion\": \"^10.18.0\"\n  }\n}"
why: "Stacking multiple redundant motion packages bloats JavaScript bundles by 50-150 KB, degrades First Load JS budgets, and creates conflicting animation schedulers fighting for rAF ticks. Level 1 allows zero motion libraries; Level 2 allows at most one small library only when native CSS cannot achieve the authored interaction."
exceptions: "Standalone dedicated landing pages operating under Level 3 creative risk contracts where GSAP ScrollTrigger orchestrates complex multi-stage canvas timelines."
---

## Context & Problem
AI-generated codebases frequently stack multiple third-party animation libraries simultaneously (such as installing `framer-motion`, `gsap`, `animejs`, and `lottie-web` concurrently) whenever different component prompts require animations. Stacking animation libraries introduces severe bundle bloat—often adding 50 KB to 200 KB of gzipped JavaScript—which degrades First Load JS and blows past core web vitals budgets. Furthermore, running multiple independent animation runtime loops on the same page creates conflicting frame schedulers, memory overhead, and unpredictable animation jank.

## Detection Logic
Static `package.json` and dependency graph scanner checks all production dependencies for recognized animation packages: `framer-motion`, `gsap`, `motion`, `animejs`, `remotion`, `popmotion`, `react-spring`, `@react-spring/web`, `lottie-react`, `lottie-web`. Flags:
1. Any animation library present under Level 1 (Clean) contracts (where the budget allows exactly 0 animation libraries).
2. More than 1 animation library present under Level 2 (Authored) contracts.

## Remediation Steps
1. For Level 1 projects, uninstall all external animation libraries and implement required UI transitions using native CSS transforms, transitions, and the native Web Animations API (WAAPI).
2. For Level 2 projects, select at most one lightweight, tree-shakeable motion library (such as `motion` or lightweight primitives) if and only if native CSS cannot achieve the authored interaction signature.
3. Consolidate disparate animations onto the single chosen runtime, pruning unused dependencies:
   `npm uninstall gsap animejs lottie-web`.
4. Ensure the selected animation library is code-split and dynamically imported if used only on specific sub-routes.

## Verification
Static scanner checks `package.json` dependencies against the active Level contract: asserts 0 animation libraries for Level 1 and <= 1 animation library for Level 2. Next.js bundle analyzer confirms first-load shared JavaScript remains under 170 KB gzipped.
