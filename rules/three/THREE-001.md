---
id: THREE-001
title: Lazy load 3D canvas and scene chunks to prevent critical path and LCP blocking
severity: high
levels: [3]
detect: static
fix_class: lazy_loading
bad: "import { Canvas } from '@react-three/fiber';\nimport Scene from './Scene';\n\nexport default function Hero() {\n  return (\n    <div className=\"hero-container\">\n      <Canvas><Scene /></Canvas>\n    </div>\n  );\n}"
good: "import dynamic from 'next/dynamic';\nimport PosterFallback from './PosterFallback';\n\nconst DynamicCanvas = dynamic(() => import('./SceneCanvas'), {\n  ssr: false,\n  loading: () => <PosterFallback />\n});\n\nexport default function Hero() {\n  return (\n    <div className=\"hero-container\">\n      <DynamicCanvas />\n    </div>\n  );\n}"
why: "Three.js and 3D canvas libraries carry heavy runtime footprints (150-600 KB). Synchronously importing 3D canvases into critical page bundles blocks First Contentful Paint (FCP) and delays Largest Contentful Paint (LCP) beyond the 2.5s mobile threshold. Clause 1 of the Fallback Contract mandates dynamic import after initial DOM paint."
exceptions: "Full-screen standalone WebGL applications (such as 3D game viewports or spatial CAD viewers) where the canvas is the primary application interface."
---

## Context & Problem
Three.js, React Three Fiber (`@react-three/fiber`), and associated 3D utilities carry substantial JavaScript runtime footprints (frequently 150 KB to 500 KB gzipped). When developers or AI tools synchronously import 3D canvas components directly into top-level entry routes or page heroes, the entire Three.js runtime is bundled into the critical initial JavaScript chunk. This delays browser parsing, blocks First Contentful Paint (FCP), and causes Largest Contentful Paint (LCP) to spike past 3.5 seconds on mobile connections. Furthermore, server-side rendering (SSR) attempts to evaluate window-dependent canvas logic, causing hydration mismatches and runtime crashes.

## Detection Logic
Static AST analysis inspects top-level route components (`page.tsx`, `layout.tsx`, primary view heroes) and flags:
1. Static direct imports of `three`, `@react-three/fiber`, `@react-three/drei`, or raw WebGL renderers in main bundle entry points.
2. Canvas JSX elements (`<Canvas>`, `<canvas>`) rendered without code-splitting or dynamic import boundaries (`next/dynamic` or `React.lazy`).

## Remediation Steps
1. Isolate the 3D canvas and all Three.js imports into a dedicated client component (e.g. `SceneCanvas.tsx`).
2. Import the component dynamically using `next/dynamic` with `ssr: false` in Next.js:
   `const DynamicScene = dynamic(() => import('./SceneCanvas'), { ssr: false, loading: () => <StaticPosterFallback /> });`.
3. Ensure the initial DOM paint and primary Largest Contentful Paint (LCP) element render immediately from static HTML before the 3D bundle executes.
4. Render an authentic, high-fidelity static poster fallback component during chunk loading to guarantee visual continuity.

## Verification
Run Lighthouse mobile audit on the target route. Verify that First Contentful Paint is under 1.5 seconds and Largest Contentful Paint is strictly <= 2.5 seconds. Inspect the Next.js production build output or Webpack bundle analyzer to confirm that Three.js is partitioned into an isolated, deferred chunk.
