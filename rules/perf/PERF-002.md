---
id: PERF-002
title: Layout-shifting unsized media elements causing CLS
severity: high
levels: [1, 2, 3]
detect: rendered
fix_class: layout_shift
bad: "<video src=\"/promo.mp4\" autoPlay loop muted playsInline className=\"w-full\" />"
good: "<div className=\"aspect-video w-full overflow-hidden rounded-xl\"><video src=\"/promo.mp4\" width={1920} height={1080} autoPlay loop muted playsInline className=\"h-full w-full object-cover\" /></div>"
why: "Media elements (<img>, <video>, <iframe>, <canvas>) rendered without explicit width, height, or aspect-ratio CSS rules collapse to 0 height before loading, causing sudden jarring page reflows and severe Cumulative Layout Shift (CLS > 0.1) that violates Core Web Vitals."
exceptions: "Media rendered inside a rigidly constrained parent container with fixed dimensions and object-fit: cover that prevents layout shifting during image decoding."
---

## Context & Problem
When media elements (`<video>`, `<iframe>`, `<img>`, `<canvas>`) are inserted into markup without explicit width and height attributes or CSS aspect ratios, the browser cannot calculate the required vertical space until the media metadata is retrieved over the network. As media loads, the layout suddenly snaps downward, causing Cumulative Layout Shift (CLS). This frustrates users, triggers accidental clicks, and fails Google Core Web Vitals.

## Detection Logic
Headless Playwright and Chrome DevTools Protocol analysis listens for `PerformanceObserver` layout-shift entries during page load. It flags any shift where `hadRecentInput === false` and cumulative score exceeds 0.05. DOM inspection also flags media elements lacking intrinsic HTML dimensions and CSS aspect-ratio properties.

## Remediation Steps
1. Add native `width` and `height` integer attributes corresponding to the media's natural aspect ratio.
2. Enclose responsive media in a container with a defined aspect ratio utility (e.g. Tailwind `aspect-video` or `aspect-[16/9]`).
3. Apply `w-full h-full object-cover` to the media element within its aspect-ratio parent.
4. For images, utilize `next/image` which automatically computes intrinsic aspect ratio reservations.

## Verification
Run Lighthouse Mobile performance audit: verify Cumulative Layout Shift (CLS) is less than 0.05. Inspect layout with network throttling enabled: verify placeholder dimensions are reserved prior to media download.
