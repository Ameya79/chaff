---
id: PERF-005
title: CSS animations and transitions lacking prefers-reduced-motion
severity: high
levels: [1, 2, 3]
detect: static
fix_class: accessibility
bad: "@keyframes pulseGlow { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.15); opacity: 1; } } .pulsing-hero { animation: pulseGlow 2s infinite ease-in-out; }"
good: "@keyframes pulseGlow { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.15); opacity: 1; } } .pulsing-hero { animation: pulseGlow 2s infinite ease-in-out; } @media (prefers-reduced-motion: reduce) { .pulsing-hero { animation: none; } }"
why: "Non-essential continuous motion, parallax scrolling, bouncing keyframes, and rapid transitions without @media (prefers-reduced-motion: reduce) cause vestibular disorientation, nausea, and motion sickness for users with vestibular disorders, violating WCAG 2.3.3."
exceptions: "Subtle, instantaneous opacity transitions (<= 150ms) or progress indicators where motion communicates essential real-time operation status."
---

## Context & Problem
AI generators add decorative animations—infinite pulsing glows, bouncing badges, auto-scrolling carousels, and parallax hero movements—without accounting for the user's motion preferences. For individuals with vestibular disorders or motion sensitivities, unexpected or infinite screen movement induces physical dizziness, nausea, and disorientation. Respecting the user's OS-level motion preference is a strict accessibility and usability mandate.

## Detection Logic
Static AST and CSS parser identifies stylesheet rules defining `@keyframes` or `animation` declarations that lack an accompanying `@media (prefers-reduced-motion: reduce)` block. In Tailwind CSS, it detects animation utility classes lacking `motion-safe:` or `motion-reduce:` modifiers. In motion libraries, it flags hooks lacking `useReducedMotion()`.

## Remediation Steps
1. Add a global reset in `globals.css`:
   `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }`.
2. In Tailwind components, wrap dynamic animations in `motion-safe:` (e.g. `motion-safe:animate-bounce` or `motion-reduce:transform-none`).
3. In JavaScript motion libraries, verify `prefers-reduced-motion` and disable parallax or spring physics accordingly.

## Verification
In Chrome DevTools Rendering tab, emulate `prefers-reduced-motion: reduce`. Verify that all decorative keyframes and infinite animations immediately stop or collapse to static states.
