---
id: MOBILE-001
title: Enforce dynamic viewport height (dvh) over static viewport units
severity: high
levels: [1, 2, 3]
detect: static
fix_class: viewport
bad: "<section className=\"min-h-screen h-screen flex flex-col justify-between\">"
good: "<section className=\"min-h-screen min-h-[100dvh] flex flex-col justify-between\">"
why: "Static 100vh calculates viewport height assuming browser toolbars are fully collapsed. On mobile devices with dynamic address bars (iOS Safari, Android Chrome), 100vh pushes bottom content and action buttons beneath browser chrome, creating trapped interfaces and unwanted vertical scrolling."
exceptions: "Desktop-only embedded iframes, modals with fixed coordinates, or print stylesheets."
---

## Context & Problem
Dynamic UI chrome on mobile WebKit and Blink engines shifts viewport boundaries as users scroll. When an interface relies on `100vh` or Tailwind's `h-screen`, the CSS engine calculates dimensions using the largest possible viewport height (equivalent to `100lvh`), disregarding the presence of the navigation toolbar and address bar. Consequently, critical action buttons, sticky footers, and bottom navigation controls are pushed below the visible fold and hidden beneath browser chrome. Users attempting to interact with controls inadvertently trigger address bar expansion or unexpected vertical page scrolling.

## Detection Logic
Static AST and CSS inspection detects usage of `height: 100vh`, `min-height: 100vh`, `h-screen`, or `min-h-screen` across CSS files, Tailwind classes, and styled components where modern dynamic viewport units are omitted. The scanner matches:
`\b(?:min-)?h(?:eight)?:\s*(?:100)?vh\b` or `\b(?:min-)?h-screen\b` without an accompanying `dvh` fallback rule or replacement.

## Remediation Steps
1. Replace legacy `h-screen` or `min-h-screen` classes with `min-h-[100dvh]` or Tailwind v3.4+ `min-h-dvh`.
2. In vanilla CSS stylesheets, provide progressive enhancement fallbacks: declare `min-height: 100vh;` followed immediately by `min-height: 100dvh;`.
3. For full-height layout containers containing fixed headers and footers, apply `display: flex; flex-direction: column; min-height: 100dvh;` to allow inner content areas (`flex: 1 1 auto; overflow-y: auto;`) to scroll cleanly within the visible viewport bounds.
4. Verify that touch scroll boundaries do not trigger elastic rubber-banding on parent containers by setting `overscroll-behavior-y: none;` on fixed modals.

## Verification
Render the application inside a simulated mobile viewport (e.g. 390x844px iPhone layout) with simulated browser chrome. Inspect the computed bounding client rect of full-height containers to verify that `height` exactly equals the visible viewport area (`window.innerHeight`), with zero vertical scroll overflow on initial load.
