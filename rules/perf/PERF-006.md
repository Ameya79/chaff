---
id: PERF-006
title: Main-thread blocking long tasks exceeding 50ms during hydration
severity: high
levels: [1, 2, 3]
detect: rendered
fix_class: runtime
bad: "function FilterableList({ items }) { const sorted = items.slice().sort((a, b) => complexRegExMatch(a) - complexRegExMatch(b)); return <ul>{sorted.map(renderItem)}</ul>; }"
good: "function FilterableList({ items }) { const deferredItems = useDeferredValue(items); const sorted = useMemo(() => deferredItems.slice().sort((a, b) => complexRegExMatch(a) - complexRegExMatch(b)), [deferredItems]); return <ul>{sorted.map(renderItem)}</ul>; }"
why: "Synchronous execution of expensive computations, heavy regex parsing, or large JSON deserialization during React hydration freezes the browser main thread for >50ms, causing sluggish interaction, high Total Blocking Time (TBT), and delayed Interaction to Next Paint (INP)."
exceptions: "Non-deferrable cryptographic operations (e.g. webauthn signature verification) performed immediately upon explicit user confirmation."
---

## Context & Problem
AI-generated components often execute heavy synchronous operations (sorting thousands of items, parsing large markdown strings, or evaluating nested regexes) directly in the component body during initial mount. When this occurs during hydration, it blocks the main thread for more than 50ms (the W3C definition of a "Long Task"). The browser becomes completely unresponsive to user taps and keyboard inputs, resulting in severe Total Blocking Time (TBT) and poor Interaction to Next Paint (INP).

## Detection Logic
Rendered runtime profiler attaches a `PerformanceObserver` with `entryTypes: ['longtask']` during initial page load and hydration. Any long task exceeding 50ms duration triggers a violation. In automated testing, Lighthouse audits evaluate Total Blocking Time (TBT), flagging runs where TBT exceeds 200ms on simulated mobile profiles.

## Remediation Steps
1. Move data transformation, filtering, and sorting up into the Server Component so calculations occur on the server before streaming HTML to the client.
2. Memoize expensive client-side calculations using `useMemo`.
3. Wrap non-urgent state updates in `startTransition` or `useDeferredValue` so user typing and clicking take immediate precedence.
4. Offload heavy numerical processing, syntax parsing, or encryption to a Web Worker.

## Verification
Run Lighthouse Mobile performance test: verify Total Blocking Time (TBT) <= 200ms. Review Chrome Performance trace: confirm zero Long Tasks (>50ms) during the hydration window.
