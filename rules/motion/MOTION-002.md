---
id: MOTION-002
title: Restrict animating properties to compositor-only transform and opacity
severity: high
levels: [1, 2, 3]
detect: static
fix_class: compositor_optimization
bad: ".dropdown-menu { transition: height 300ms ease, top 200ms ease, width 300ms ease; } .dropdown-menu.open { height: 240px; top: 48px; width: 320px; }"
good: ".dropdown-menu { transform-origin: top center; transform: scaleY(0.95); opacity: 0; transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 150ms ease; will-change: transform, opacity; } .dropdown-menu.open { transform: scaleY(1); opacity: 1; }"
why: "Animating geometry properties such as width, height, top, left, margin, or padding forces the browser layout engine to recalculate layout and repaint on every animation frame, leading to severe frame drops below 60fps and high Interaction to Next Paint (INP). Only transform and opacity are handled entirely on the compositor thread."
exceptions: "Sub-pixel hair line width adjustments in SVG vector renderers or native details disclosure elements where CSS grid auto-height interpolation grid-template-rows: 0fr -> 1fr is required without JS measurement."
---

## Context & Problem
The browser rendering pipeline processes style updates through three successive stages: Layout (Reflow), Paint, and Composite. When CSS transitions or keyframe animations target layout properties (such as `width`, `height`, `top`, `left`, `right`, `bottom`, `margin`, or `padding`), the browser engine must execute expensive geometry calculations and rasterize pixel layers on every single 16ms animation frame. On mobile hardware and lower-powered devices, this main-thread burden causes stuttering animations, frame drops below 30fps, and severe input lag (high INP). In contrast, `transform` and `opacity` are executed directly by the GPU compositor without invalidating document layout or paint trees.

## Detection Logic
Static PostCSS AST analysis inspects all CSS stylesheets, CSS-in-JS templates, and inline styles. It flags any `transition-property` or `@keyframes` block containing layout or paint properties:
`\b(?:width|height|top|left|bottom|right|margin(?:-[a-z]+)?|padding(?:-[a-z]+)?|border-width)\b`.

## Remediation Steps
1. Replace position transitions (`top`, `left`) with CSS transform translation: use `transform: translate3d(x, y, 0);` or Tailwind `translate-x-*` / `translate-y-*`.
2. Replace size transitions (`width`, `height`) with CSS transform scaling (`scale`, `scaleX`, `scaleY`) paired with appropriate `transform-origin` adjustments.
3. For accordion components that must animate content expansion without fixed pixel heights, use modern CSS grid row interpolation:
   `display: grid; grid-template-rows: 0fr; transition: grid-template-rows 250ms ease;` expanding to `grid-template-rows: 1fr;` with an inner `overflow: hidden;` child.
4. Restrict hardware layer acceleration exclusively to compositor targets: `will-change: transform, opacity;`.

## Verification
Record a timeline trace using Chrome DevTools Performance panel while triggering UI transitions. Verify that zero "Layout" or "Recalculate Style" events occur during the animation playback phase and that framerate maintains a steady 60fps or 120fps lock.
