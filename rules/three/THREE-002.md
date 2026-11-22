---
id: THREE-002
title: Provide high-fidelity static poster image or SVG fallback for SSR and low-capability clients
severity: high
levels: [3]
detect: rendered
fix_class: ssr_fallback
bad: "const LazyScene = dynamic(() => import('./Scene'), {\n  ssr: false,\n  loading: () => <div className=\"spinner\">Loading 3D...</div>\n});"
good: "const LazyScene = dynamic(() => import('./Scene'), {\n  ssr: false,\n  loading: () => (\n    <picture>\n      <source srcSet=\"/hero-poster.avif\" type=\"image/avif\" />\n      <source srcSet=\"/hero-poster.webp\" type=\"image/webp\" />\n      <img src=\"/hero-poster.jpg\" alt=\"Interactive 3D geometry showcase\" width=\"1200\" height=\"800\" className=\"w-full h-full object-cover\" />\n    </picture>\n  )\n});"
why: "Displaying blank rectangles or generic loading spinners while 3D assets download causes visual jarring and layout instability. Clause 2 of the Fallback Contract mandates a high-fidelity static poster image rendered during SSR that provides an immediate, complete visual experience for low-power, reduced-motion, and no-WebGL clients."
exceptions: "Generative interactive canvases whose initial state is calculated entirely deterministically from a 1 KB inline SVG."
---

## Context & Problem
When 3D scenes are deferred or lazy-loaded, naive implementations display a generic loading spinner, a blank gray rectangle, or nothing at all while 3D geometry bundles download. On slow mobile connections, users stare at an empty canvas hole for multiple seconds. Moreover, search engine crawlers, assistive technology devices, clients with WebGL disabled, and users with `prefers-reduced-motion` enabled are left with a broken visual interface. Part 2 of the Chaff Fallback Contract dictates that every 3D hero must render an authentic, high-fidelity static poster image or vector SVG during server-side rendering.

## Detection Logic
Rendered headless browser evaluation disables WebGL support (`--disable-webgl`) and intercepts network requests to block 3D asset downloads. Evaluator confirms that:
1. The DOM contains a valid `<picture>`, `<img>`, or `<svg>` poster fallback component rendered during SSR.
2. The poster element has natural dimensions (`width`, `height`) and achieves an effective Cumulative Layout Shift (CLS) of 0 during subsequent hydration.

## Remediation Steps
1. Capture a high-resolution, professionally graded resting-state render of the 3D scene in WebP and AVIF formats with responsive srcset variations.
2. Render this static poster inside the dynamic import's `loading` fallback slot and during SSR.
3. Apply `object-cover w-full h-full` and explicit aspect-ratio constraints (`aspect-[16/9]` or `aspect-[4/3]`) to prevent layout shifts when transitioning between the poster and the live canvas.
4. If the client environment indicates reduced motion or data saver mode, retain the static poster permanently without instantiating the WebGL context.

## Verification
Execute automated Playwright test with `--disable-webgl` flag enabled. Assert that the static poster image renders cleanly, with zero layout shift (CLS = 0.00) and zero unhandled JavaScript runtime exceptions.
