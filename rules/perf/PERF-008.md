---
id: PERF-008
title: Excessive DOM tree depth exceeding 32 levels
severity: medium
levels: [1, 2, 3]
detect: rendered
fix_class: dom_size
bad: "<div className=\"card-outer\"><div className=\"card-border\"><div className=\"card-shadow\"><div className=\"card-bg\"><div className=\"card-content\"><div className=\"card-body\"><div className=\"card-row\"><div className=\"card-col\"><div className=\"card-inner\"><span>Content</span></div></div></div></div></div></div></div></div></div>"
good: "<article className=\"p-6 bg-neutral-900 border border-neutral-800 rounded-xl shadow-sm\"><h3 className=\"text-lg font-semibold text-white\">Title</h3><p className=\"mt-2 text-neutral-400\">Content</p></article>"
why: "DOM trees exceeding 32 levels deep (or containing >1,500 total nodes) drastically inflate browser memory footprints, slow down CSS style recalculations, and degrade scrolling and rendering performance on lower-tier mobile hardware."
exceptions: "Complex interactive data grids, spreadsheet emulators, or rich code editors with virtualized windowing where hidden off-screen nodes are actively unmounted."
---

## Context & Problem
AI generators often construct layouts by stacking nested wrapper divs for borders, paddings, backgrounds, and drop shadows, compounding depth when components are nested within components. Deep DOM trees (depth > 32 or > 1,500 total nodes) drastically increase memory usage in the browser engine. Every style change or DOM mutation forces recursive tree traversal, causing scroll jank and high memory pressure on mobile devices.

## Detection Logic
Headless Playwright audit traverses the live rendered DOM tree to calculate maximum node depth and total node count: flags if `maxDepth(document.body) > 32` or total element count exceeds 1,500 nodes. Lighthouse reports check the `dom-size` performance diagnostic.

## Remediation Steps
1. Flatten component hierarchy by combining decorative classes (borders, backgrounds, shadows, and paddings) onto a single container element.
2. Replace nested wrapper hierarchies with CSS Grid or Flexbox gap properties.
3. For large lists or tables, implement virtualized rendering (e.g. `@tanstack/react-virtual`) so only visible rows exist in the DOM.
4. Replace redundant wrapper divs with React Fragments `<> ... </>`.

## Verification
Run Lighthouse audit on target routes: verify `dom-size` check passes with depth <= 32 and total DOM nodes <= 800. Run Playwright DOM evaluation script confirming max depth is within acceptable limits.
