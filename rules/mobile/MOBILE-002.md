---
id: MOBILE-002
title: Enforce minimum 44x44px touch target bounding box
severity: high
levels: [1, 2, 3]
detect: rendered
fix_class: touch
bad: "<button onClick={toggleMenu} className=\"p-1 text-gray-500 hover:text-black\"><MenuIcon className=\"w-5 h-5\" /></button>"
good: "<button onClick={toggleMenu} className=\"min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 text-stone-600 hover:text-stone-900 focus-visible:outline-2\" aria-label=\"Toggle navigation menu\"><MenuIcon className=\"w-5 h-5\" aria-hidden=\"true\" /></button>"
why: "Human fingertips require an interactive contact area of approximately 7 to 10mm. Target dimensions under 44x44px violate WCAG 2.5.5 and Apple HIG guidelines, leading to frequent mis-taps, user frustration, and accidental activations."
exceptions: "Inline text hyperlinks within continuous running paragraphs where expanding the target would disrupt text flow."
---

## Context & Problem
Uncrafted AI-generated code frequently produces compact buttons with minimal padding (e.g., `p-1` or `h-6 w-6`), resulting in physical rendered bounding boxes between 20px and 32px. On mobile touchscreens, human fingertips have an average contact diameter of 10mm (approximately 44 to 48 CSS pixels). Sub-44px touch targets force users to tap repeatedly with extreme precision, creating high error rates, accidental neighbor-element activations, and severe accessibility barriers for individuals with motor impairments or tremors.

## Detection Logic
Automated rendered audit in Playwright or Puppeteer queries all interactive elements (`button`, `a`, `input`, `select`, `textarea`, `[role='button']`, `[role='link']`) and computes `el.getBoundingClientRect()`. Flags any interactive element where:
`rect.width < 44 || rect.height < 44`
excluding inline links inside `<p>` or `<span>` blocks with sibling text content.

## Remediation Steps
1. Add utility constraints `min-h-[44px] min-w-[44px]` and `inline-flex items-center justify-center` to all button and link components.
2. For compact icon elements where visual design requires a smaller icon footprint (e.g., 20x20px icon), expand the clickable hit area using transparent padding (`p-3`) or an expanded pseudo-element (`relative after:absolute after:-inset-2 after:content-['']`).
3. Ensure adequate spacing between adjacent touch targets: maintain at least 8px of clearance between touch bounding boxes to prevent overlapping tap activation zones.
4. Set `touch-action: manipulation;` on interactive targets to eliminate double-tap gesture delays on legacy mobile browsers.

## Verification
Execute the Playwright mobile test runner at 390px viewport width. Traverse all interactive controls and verify that 100% of interactive DOM nodes report a computed `getBoundingClientRect()` width and height of at least 44px.
