---
id: MOBILE-003
title: Eliminate horizontal viewport overflow at 320px
severity: high
levels: [1, 2, 3]
detect: rendered
fix_class: layout
bad: "<div className=\"w-[380px] p-6 flex gap-4\"><div className=\"min-w-[180px]\">Metric A</div><div className=\"min-w-[180px]\">Metric B</div></div>"
good: "<div className=\"w-full max-w-sm p-4 flex flex-col sm:flex-row gap-4 overflow-hidden\"><div className=\"w-full sm:min-w-[140px]\">Metric A</div><div className=\"w-full sm:min-w-[140px]\">Metric B</div></div>"
why: "Horizontal overflow on mobile screens triggers unintended horizontal scrollbars, breaks viewport boundary snapping, and disrupts natural swipe interactions. Layouts must render cleanly down to 320px width without root horizontal scrolling."
exceptions: "Explicit horizontally swipeable carousels or tabular data grids contained within dedicated overflow-x-auto scroll wrappers."
---

## Context & Problem
Fixed pixel widths, unscaled imagery, unpadded preformatted code blocks, or negative margins routinely introduce unwanted horizontal document overflow. When rendered on narrow mobile viewports (such as 320px on iPhone SE first-generation or compact foldables), any child element exceeding 320px forces the root document to scroll horizontally. This breaks page gesture alignment, introduces white gutters on swipe, truncates content, and causes accidental panning when users attempt vertical scrolling.

## Detection Logic
Automated headless browser evaluation sets the browser viewport to 320x568px and executes:
`document.documentElement.scrollWidth > document.documentElement.clientWidth` or `window.innerWidth < document.body.scrollWidth`.
If true, the evaluator identifies protruding DOM elements by querying `Array.from(document.querySelectorAll('*')).filter(el => el.getBoundingClientRect().right > window.innerWidth)`.

## Remediation Steps
1. Replace fixed pixel widths (e.g. `w-[360px]`, `min-w-[400px]`) with responsive constraints: `w-full max-w-sm` or percentage widths.
2. Ensure all media elements (`<img>`, `<video>`, `<svg>`, `<canvas>`) include `max-width: 100%; height: auto; display: block;`.
3. Wrap preformatted code blocks, wide tables, or data sheets in localized horizontal containers: `<div className="w-full overflow-x-auto -mx-4 px-4">`.
4. Apply `overflow-wrap: break-word; word-break: break-word;` to heading and paragraph elements to prevent long unbroken strings or URLs from forcing layout expansion.

## Verification
Run headless audit at 320px screen width. Assert that `document.documentElement.scrollWidth <= document.documentElement.clientWidth` across all application routes and that zero elements extend beyond the right boundary of the viewport.
