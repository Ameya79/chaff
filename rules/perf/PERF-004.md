---
id: PERF-004
title: Animating geometry layout properties instead of composite transforms
severity: high
levels: [1, 2, 3]
detect: static
fix_class: animation
bad: ".collapsible-panel { transition: height 0.35s ease, margin-top 0.2s ease; } .collapsible-panel:hover { height: 400px; margin-top: -8px; }"
good: ".collapsible-panel { transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease; will-change: transform; } .collapsible-panel:hover { transform: translateY(-8px) scale(1.02); }"
why: "Animating layout-triggering properties (width, height, top, left, margin, padding) forces the browser engine to run recalculate style, layout reflow, and repaint cycles on every single frame, causing dropped frames and jank on mobile CPUs instead of GPU-composited transform and opacity."
exceptions: "Native CSS accordion expansions using CSS Grid grid-template-rows: 0fr -> 1fr where no transform can physically simulate height expansion without clipping content."
---

## Context & Problem
AI agents regularly create hover or entrance animations by animating layout properties like `height`, `width`, `top`, `left`, or `margin`. Every single animation frame (16.7ms at 60Hz or 8.3ms at 120Hz) mutates geometric layout properties. This forces the browser rendering engine through expensive Style Recalculation, Layout Reflow, and Paint stages on the main thread, causing severe frame drops, stuttering, and device battery drain.

## Detection Logic
Static AST and CSS parser scans stylesheets and Tailwind transition utilities for properties that trigger layout reflow: `width`, `height`, `top`, `bottom`, `left`, `right`, `margin`, `padding`, `max-height`. In Framer Motion declarations, it flags `animate={{ width: ... }}` or `animate={{ top: ... }}`.

## Remediation Steps
1. Replace `top`, `bottom`, `left`, `right`, and `margin` shifts with `transform: translate3d(x, y, 0)`.
2. Replace `width` and `height` expansion animations with `transform: scale(x, y)` combined with `transform-origin`.
3. Restrict `transition-property` strictly to composite properties: `transform, opacity`.
4. For accordions, use modern CSS Grid row transitions (`grid-template-rows: 0fr` to `1fr`) which minimize layout calculation overhead.

## Verification
Record timeline trace in Chrome DevTools Performance panel: verify animation achieves steady 60fps or 120fps with zero layout reflows during the transition duration. Audit CSS stylesheets for absence of geometry properties in transition definitions.
