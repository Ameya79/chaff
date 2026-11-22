---
id: THREE-009
title: Enforce Mandatory Fallback Contract compliance for all Level 3 3D and WebGL implementations
severity: high
levels: [3]
detect: heuristic
fix_class: contract_enforcement
bad: "export default function HeroScene() {\n  return (\n    <div className=\"hero-canvas\">\n      <Canvas camera={{ position: [0, 0, 5] }}>\n        <ambientLight />\n        <pointLight position={[10, 10, 10]} />\n        <HeavyMeshModel />\n      </Canvas>\n    </div>\n  );\n}"
good: "import dynamic from 'next/dynamic';\nimport HeroPoster from './HeroPoster';\n\nconst DynamicScene = dynamic(() => import('./SceneViewport'), {\n  ssr: false,\n  loading: () => <HeroPoster />\n});\n\nexport default function HeroScene() {\n  return (\n    <div className=\"hero-canvas\">\n      <DynamicScene />\n    </div>\n  );\n}"
why: "Level 3 allows experimental 3D and WebGL experiences only under the strict condition that all 5 clauses of the Fallback Contract are fulfilled: lazy loading, static poster fallback, device tier check, frame governor/DPR cap 1.5, and payload under 250 KB gzip."
exceptions: "None. All 3D experiences operating under Level 3 risk tier must satisfy the Mandatory Fallback Contract in its entirety."
---

## Context & Problem
Level 3 is the experimental frontier contract in Chaff designed to enable unforgettable, tactile web experiences utilizing Three.js, WebGL, and custom GLSL shaders. However, Level 3 enforces an unyielding core philosophy: risk is allowed, harm is not. AI agents and creative developers frequently introduce standalone WebGL canvas viewports without safety mechanisms, resulting in massive initial bundle payloads, SSR hydration crashes, unresponsive mobile viewports, unmanaged GPU memory consumption, and complete visual breakage for users with low-end hardware or vestibular sensitivities. Raw, unmediated WebGL without comprehensive fallback protection violates the foundational guarantee of Level 3.

## Detection Logic
Heuristic evaluation cross-checks the 3D implementation against the 5 mandatory Fallback Contract clauses:
1. Clause 1 (Lazy Loading): Verify that the 3D canvas and engine imports are isolated in dynamically imported client chunks (`next/dynamic` with `ssr: false`).
2. Clause 2 (Static Poster): Verify that a static image or lightweight SVG renders during SSR and displays during loading, reduced motion, or WebGL absence.
3. Clause 3 (Device Tier Check): Verify that hardware profiling (`@chaff/tier`) runs prior to WebGL instantiation, routing Tier 0 hardware to the static poster.
4. Clause 4 (Frame Governor & DPR Cap): Verify that `devicePixelRatio` is capped at 1.5, and rendering loops pause when offscreen or in background tabs.
5. Clause 5 (Asset Budget): Verify that initial 3D JavaScript plus geometry transfers remain strictly under 250 KB gzipped.

## Remediation Steps
1. Wrap all 3D canvas components behind a dynamic boundary with a static poster fallback:
   ```typescript
   const DynamicHeroCanvas = dynamic(() => import('./HeroCanvas'), {
     ssr: false,
     loading: () => <StaticPosterFallback />
   });
   ```
2. In the client canvas loader, evaluate device capability using `@chaff/tier`:
   ```typescript
   import { getDeviceTier } from '@chaff/tier';

   export default function HeroCanvas() {
     const tier = getDeviceTier();
     if (tier === 'poster') return <StaticPosterFallback />;
     return <InteractiveScene tier={tier} />;
   }
   ```
3. Inside the 3D scene, constrain canvas DPR to `Math.min(window.devicePixelRatio, 1.5)` and attach an `IntersectionObserver` to pause rAF loops when scrolled away.
4. Compress all geometry with Draco/Meshopt and verify that total initial assets do not exceed 250 KB gzipped.
5. Explicitly dispose of all geometries, materials, and textures when the canvas component unmounts.

## Verification
1. Run `chaff gate` or execute the Phase 1 test suite to ensure full compliance across all 5 fallback clauses.
2. Disable WebGL in browser flags and confirm that the site renders a complete, high-fidelity visual poster with zero layout shifts or JavaScript errors.
3. Profile memory and framerate on low-tier mobile emulation to ensure steady 60 fps without thermal throttling or memory leakage.
