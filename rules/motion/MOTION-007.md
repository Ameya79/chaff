---
id: MOTION-007
title: Eliminate layout thrashing and interleaved DOM reads/writes in animation loops
severity: high
levels: [1, 2, 3]
detect: static
fix_class: raf_optimization
bad: "function onTick() { cards.forEach((card) => { const height = card.offsetHeight; card.style.transform = `translateY(${height * 0.1}px)`; }); requestAnimationFrame(onTick); }"
good: "function onTick() { const heights = cards.map((card) => card.offsetHeight); cards.forEach((card, i) => { card.style.transform = `translate3d(0, ${heights[i] * 0.1}px, 0)`; }); requestAnimationFrame(onTick); }"
why: "Interleaving geometric layout reads (offsetHeight, getBoundingClientRect) with style writes inside requestAnimationFrame forces synchronous reflows on every item in every frame. This triggers massive layout thrashing and drops framerates to single digits."
exceptions: "One-time initialization measurements conducted before an animation sequence commences."
---

## Context & Problem
When custom JavaScript animation routines or canvas overlays track multiple DOM elements, code frequently alternates between reading element layout metrics (e.g., `offsetHeight`, `offsetWidth`, `scrollTop`, `getBoundingClientRect()`) and writing style updates (e.g., `element.style.transform = ...`). Each layout read forces the browser engine to halt execution and synchronously recompute the document layout (forced synchronous layout). When executed inside a loop over dozens of elements on every animation frame, this "layout thrashing" causes extreme frame rate drops (often dropping from 60fps to under 15fps), high CPU utilization, and thermal throttling.

## Detection Logic
Static AST analysis parses JavaScript callbacks registered with `requestAnimationFrame` or `setInterval` and detects patterns where layout reading properties/methods (`offsetHeight`, `offsetWidth`, `clientHeight`, `clientWidth`, `scrollTop`, `scrollLeft`, `getBoundingClientRect`, `getComputedStyle`) are called in interleaved sequence with layout writing operations (`style.*`, `className`, `classList.*`, DOM node insertion/removal).

## Remediation Steps
1. Enforce a strict two-phase batching pattern inside all animation ticks:
   - Phase 1 (Batch Reads): Query and cache all layout dimensions from all target elements in a single sequential pass.
   - Phase 2 (Batch Writes): Apply all computed style mutations or transform changes in a subsequent single pass.
2. Cache invariant layout properties outside the animation loop whenever possible, recalculating only when window resize or viewport orientation changes occur.
3. Leverage modern browser observation APIs such as `ResizeObserver` and `IntersectionObserver` to receive asynchronous measurement notifications off the critical animation tick path.
4. Utilize `transform: translate3d(...)` for spatial positioning rather than mutating `top`, `left`, or `margin`.

## Verification
Profile animation sequences in Chrome DevTools Performance tab. Verify that zero "Forced reflow is a likely bottleneck" warnings appear in the flame chart and that style recalculation takes less than 2ms per frame.
