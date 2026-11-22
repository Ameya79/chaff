---
id: MOBILE-005
title: Enforce 16px base font size on form inputs to prevent iOS auto-zoom
severity: medium
levels: [1, 2, 3]
detect: static
fix_class: form
bad: "<input type=\"text\" placeholder=\"Enter coupon code\" className=\"text-xs sm:text-sm px-3 py-1.5 border rounded\" />"
good: "<input type=\"text\" placeholder=\"Enter coupon code\" className=\"text-base sm:text-sm px-3 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-stone-900\" />"
why: "iOS Safari automatically magnifies the entire webpage whenever an input element with a font size smaller than 16px (1rem) receives focus. This disorients users, shifts the viewport off-center, and requires manual pinch-to-zoom out."
exceptions: "Read-only or disabled form controls that never receive interactive input focus."
---

## Context & Problem
Mobile Safari on iOS enforces an automated heuristic: whenever an `<input>`, `<select>`, or `<textarea>` element receives user focus with a computed `font-size` below 16px (1rem), Safari immediately zooms into the input field. This automatic magnification displaces fixed navigation bars, scrolls page content horizontally out of the visible screen frame, and blurs surrounding layout elements. When the user finishes typing or taps outside the field, Safari does not automatically zoom out, leaving the user trapped in an off-center zoomed perspective.

## Detection Logic
Static AST analysis searches for JSX form components (`<input>`, `<textarea>`, `<select>`) or CSS rules applied to form controls that specify `text-xs` (12px), `text-sm` (14px), or explicit CSS `font-size: < 16px` without a responsive desktop modifier or media query override (such as `text-base sm:text-sm`).

## Remediation Steps
1. Apply a mobile-first 16px font size to all form inputs using `text-base` by default, followed by responsive downscaling on tablet/desktop if desired: `className="text-base sm:text-sm px-3 py-2"`.
2. In global stylesheets, configure a base input rule:
   `input, select, textarea { font-size: 16px; } @media (min-width: 640px) { input, select, textarea { font-size: 14px; } }`.
3. Ensure adequate vertical padding (minimum `py-2`) so the 16px text renders with comfortable vertical breathing room inside the control.
4. Avoid using `transform: scale()` on inputs, as scaled elements can still trigger WebKit's font size threshold detection.

## Verification
Inspect computed styles of all input, textarea, and select controls inside a mobile viewport (<= 640px). Assert that computed `fontSize` is greater than or equal to 16px. Trigger click and focus events in iOS WebKit preview to confirm viewport coordinates remain stationary.
