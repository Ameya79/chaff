---
id: PERF-009
title: High-frequency window event listeners without passive flags
severity: medium
levels: [1, 2, 3]
detect: static
fix_class: event_listener
bad: "useEffect(() => { const handleScroll = () => { setScrollY(window.scrollY); }; window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, []);"
good: "useEffect(() => { const handleScroll = () => { setScrollY(window.scrollY); }; window.addEventListener('scroll', handleScroll, { passive: true }); return () => window.removeEventListener('scroll', handleScroll); }, []);"
why: "Attaching un-debounced, non-passive event listeners to window for scroll, touchmove, or wheel forces the browser to wait for JavaScript execution before performing smooth compositor scrolling, producing noticeable scroll lag and high input latency."
exceptions: "Touch drag-and-drop or canvas drawing surfaces that explicitly call event.preventDefault() to prevent native browser view scrolling."
---

## Context & Problem
AI models frequently implement scroll-linked visual effects or sticky headers by attaching unadorned `window.addEventListener('scroll', handler)` listeners inside `useEffect`. Because the browser does not know whether the handler might invoke `event.preventDefault()`, it pauses page scrolling on the compositor thread until JavaScript executes on the main thread. This causes severe touch latency and stuttering scroll behavior on mobile devices.

## Detection Logic
Static AST analysis searches for `CallExpression[callee.property.name="addEventListener"]` where the first argument is `'scroll'`, `'touchmove'`, or `'wheel'`, and the third options argument is either omitted or does not set `{ passive: true }`. Lighthouse flags this condition in its "Does not use passive listeners to improve scrolling performance" audit.

## Remediation Steps
1. Pass `{ passive: true }` in the third options argument of `addEventListener`: `window.addEventListener('scroll', handler, { passive: true });`.
2. Wrap the callback handler with `requestAnimationFrame` or a throttling utility so calculations run at most once per frame.
3. Where feasible, replace scroll listeners with `IntersectionObserver` or modern CSS scroll-driven animations (`animation-timeline: scroll()`).
4. Ensure `removeEventListener` is properly called in the cleanup return function of `useEffect`.

## Verification
Search codebase for `addEventListener('scroll'` and `addEventListener('touchmove'`: verify all instances include `{ passive: true }`. Run Lighthouse Mobile audit: confirm "Uses passive listeners to improve scrolling performance" audit passes with 100% score.
