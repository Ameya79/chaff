---
id: CODE-001
title: Unoptimized raw <img> tags instead of next/image
severity: high
levels: [1, 2, 3]
detect: static
fix_class: performance
bad: "<img src=\"/hero.png\" alt=\"Product dashboard preview\" className=\"w-full h-auto\" />"
good: "<Image src=\"/hero.png\" alt=\"Product dashboard preview\" width={1200} height={675} priority className=\"w-full h-auto\" />"
why: "Raw HTML <img> elements bypass Next.js automatic image optimization, responsive srcset generation, lazy loading, WebP/AVIF transcoding, and aspect-ratio reservation, leading to large payload bloat and severe Cumulative Layout Shift (CLS)."
exceptions: "External SVGs requiring raw inline rendering, single-pixel tracking beacons, or static badge assets rendered outside the Next.js runtime environment."
---

## Context & Problem
AI coding assistants frequently emit raw HTML `<img src="...">` elements because they default to baseline HTML syntax. In modern Next.js applications, raw `<img>` tags bypass the Next.js image optimization pipeline. This causes three distinct regressions: (1) images are delivered uncompressed in their original format rather than modern AVIF or WebP, (2) missing intrinsic dimension attributes force the browser to compute dimensions after download, triggering jarring layout shifts (CLS), and (3) all images load eagerly by default, consuming mobile bandwidth on below-the-fold assets.

## Detection Logic
Static AST analysis searches JSX code for `JSXOpeningElement[name.name="img"]`. It flags raw `<img>` tags inside Next.js project routes and components that are not enclosed within an `<svg>` element or carrying an explicit waiver attribute. It maps directly to Next.js ESLint rule `@next/next/no-img-element`.

## Remediation Steps
1. Import the Next.js Image component: `import Image from 'next/image';`.
2. Replace `<img ... />` with `<Image ... />`.
3. Define intrinsic `width` and `height` integer properties matching the asset's aspect ratio, or specify `fill` if the image scales within an explicit parent container.
4. For hero images and above-the-fold content, add the `priority` property to preload the Largest Contentful Paint (LCP) element.
5. Provide a descriptive `alt` attribute describing the visual content for screen readers.

## Verification
Run `npx eslint . --rule "@next/next/no-img-element: error"` or execute Next.js build. Inspect Lighthouse audit: ensure "Serve images in next-gen formats" and "Properly size images" pass with zero warnings.
