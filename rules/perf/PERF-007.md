---
id: PERF-007
title: Responsive images missing responsive sizes attribute
severity: medium
levels: [1, 2, 3]
detect: static
fix_class: responsive
bad: "<Image src=\"/gallery/feature.jpg\" alt=\"Feature preview\" fill className=\"object-cover\" />"
good: "<Image src=\"/gallery/feature.jpg\" alt=\"Feature preview\" fill sizes=\"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw\" className=\"object-cover\" />"
why: "Using next/image with fill or dynamic widths without specifying a concrete sizes attribute causes the browser to assume the image takes 100vw, forcing mobile viewports to download massive desktop-resolution images that waste cellular bandwidth and degrade LCP."
exceptions: "Fixed-dimension images with static integer width and height attributes (such as 32x32 avatars or 24x24 icons) where responsive viewport scaling does not occur."
---

## Context & Problem
When using Next.js `next/image` with the `fill` property, omitting the `sizes` prop causes Next.js to assign a default `sizes="100vw"`. This informs the browser that the image will always occupy 100% of the viewport width. In a three-column grid on desktop, the image may actually render at only 300px, yet a mobile phone on a high-density screen will download a massive 2000px wide image asset. This burns mobile bandwidth and severely degrades Largest Contentful Paint (LCP).

## Detection Logic
Static AST analysis searches for `JSXOpeningElement[name.name="Image"]` having attribute `fill` (or `fill={true}`) while lacking attribute `sizes`. In development, Next.js emits a console warning: `Image with src ... has "fill" and is missing "sizes" prop`.

## Remediation Steps
1. Add the `sizes` attribute to every `Image` component configured with `fill`.
2. Define the responsive media query string reflecting actual layout breakpoints: e.g. `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`.
3. If the image is fixed in size across all screens, specify the exact pixel dimension: `sizes="384px"`.
4. Provide appropriate `priority` prop for above-the-fold hero images.

## Verification
Inspect Next.js terminal during dev: confirm absence of missing `sizes` prop warnings. In a simulated mobile device viewport (390px), inspect the Network tab: confirm the browser requests the smaller generated image variant (e.g. 640w instead of 1920w).
