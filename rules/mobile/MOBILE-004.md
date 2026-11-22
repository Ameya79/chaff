---
id: MOBILE-004
title: Standardize viewport meta tag and prevent zoom disabling
severity: high
levels: [1, 2, 3]
detect: static
fix_class: meta
bad: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\" />"
good: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />"
why: "Disabling user zoom with user-scalable=no or maximum-scale=1.0 prevents visually impaired users from magnifying text and UI controls, violating WCAG 1.4.4. Modern responsive interfaces must adapt fluidly without locking user zoom."
exceptions: "Standalone native Progressive Web Apps (PWAs) operating in fullscreen kiosk display mode with dedicated OS-level accessibility magnification."
---

## Context & Problem
AI-generated boilerplate and legacy mobile templates frequently inject `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">` in an attempt to prevent double-tap zoom delays or lock down component layouts. This practice directly violates WCAG 2.1 Success Criterion 1.4.4 (Resize Text), as it deprives users with low vision or presbyopia from using native pinch-to-zoom gestures to read small text or inspect fine details. Modern mobile browsers automatically eliminate double-tap delays when `width=device-width` is present, making zoom suppression completely obsolete.

## Detection Logic
Static source code scanner parses HTML entry points (`index.html`, `app/layout.tsx`, `pages/_document.tsx`, Next.js `Viewport` export) and searches for:
`user-scalable\s*=\s*(?:no|0)` or `maximum-scale\s*=\s*1(?:\.0)?` within `<meta name="viewport">` content attributes or Next.js metadata objects.

## Remediation Steps
1. In Next.js 14+ App Router, define standard scalable viewport settings in `app/layout.tsx`:
   `export const viewport: Viewport = { width: 'device-width', initialScale: 1 };`.
2. In static HTML files, replace restrictive viewport definitions with:
   `<meta name="viewport" content="width=device-width, initial-scale=1" />`.
3. Remove all occurrences of `maximum-scale=1.0`, `minimum-scale=1.0`, and `user-scalable=no`.
4. Ensure responsive typography and container layouts accommodate up to 200% browser zoom magnification without overlapping text or clipped controls.

## Verification
Static verification confirms that neither `user-scalable=no` nor `maximum-scale=1` exists in any layout metadata. In rendered browser testing, perform a pinch-to-zoom gesture or scale zoom to 200% to confirm the viewport expands freely without obstruction.
