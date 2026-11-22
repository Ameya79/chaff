---
id: MOTION-004
title: Prevent scroll-linked jank with passive listeners and native scroll timelines
severity: high
levels: [1, 2, 3]
detect: static
fix_class: scroll_performance
bad: "window.addEventListener('scroll', () => { const scrolled = window.scrollY; document.getElementById('header').style.top = scrolled > 100 ? '-80px' : '0px'; document.getElementById('progressBar').style.width = (scrolled / 1000) * 100 + '%'; });"
good: "@keyframes progressTrack { from { transform: scaleX(0); } to { transform: scaleX(1); } } #progressBar { transform-origin: left center; animation: progressTrack linear; animation-timeline: scroll(); }"
why: "Binding synchronous scroll event listeners on the window forces the main thread to block smooth viewport scrolling during style recalculations and script execution. Native CSS scroll-driven animations run off-thread on the compositor, ensuring fluid 60fps scrolling."
exceptions: "Complex multi-axis canvas scroll choreography where CSS scroll-driven animations are polyfilled with passive IntersectionObserver callbacks."
---

## Context & Problem
Scroll-linked visual effects—such as reading progress bars, sticky header collapses, parallax card shifts, and scroll reveal animations—are frequently implemented in AI templates by attaching an unthrottled `scroll` event listener directly to `window`. Because non-passive scroll event listeners can call `event.preventDefault()`, mobile browser engines must pause scrolling until JavaScript execution finishes, introducing noticeable touch latency and stuttering frame drops. Mutating inline DOM styles inside scroll handlers further triggers continuous forced synchronous layouts.

## Detection Logic
Static source scanner parses JavaScript and TypeScript source files and flags:
1. `window.addEventListener('scroll', ...)` or `document.addEventListener('touchmove', ...)` calls that do not include `{ passive: true }` in their event options.
2. Synchronous mutations of DOM geometry or styles (`element.style.*`) located directly inside a scroll event callback rather than being deferred to `requestAnimationFrame` or handled natively via CSS.

## Remediation Steps
1. Wherever supported, migrate scroll-driven visual progress and reveal effects to modern CSS scroll-driven animations:
   `animation-timeline: scroll(); animation: revealEffect linear;`.
2. Where JavaScript scroll handling is strictly necessary, always register event listeners with `{ passive: true }`:
   `window.addEventListener('scroll', handleScroll, { passive: true });`.
3. Decouple scroll reading from DOM mutation using `requestAnimationFrame` debouncing or use modern `IntersectionObserver` thresholds to detect entry points without measuring pixel coordinates.
4. Animate visual properties using compositor-friendly transforms (`transform: scaleX(...)`, `transform: translateY(...)`) rather than adjusting `width` or `top`.

## Verification
Run automated audit checking that all scroll and touch listeners declare `{ passive: true }`. Profile touch-scrolling performance in Chrome DevTools Performance panel to verify that touch gesture scrolling achieves a consistent 60fps frame rate with zero main-thread blocking alerts.
