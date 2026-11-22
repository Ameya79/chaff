---
id: THREE-005
title: Cap canvas device pixel ratio at 1.5 on high-DPI displays and mobile viewports
severity: high
levels: [3]
detect: static
fix_class: viewport_governance
bad: "function initRenderer() {\n  const renderer = new THREE.WebGLRenderer({ antialias: true });\n  renderer.setPixelRatio(window.devicePixelRatio);\n  return renderer;\n}"
good: "function initRenderer() {\n  const renderer = new THREE.WebGLRenderer({ antialias: true });\n  const cappedPixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);\n  renderer.setPixelRatio(cappedPixelRatio);\n  return renderer;\n}"
why: "Modern mobile screens feature device pixel ratios of 3x or 4x, requiring the GPU to compute up to 16 times more fragments per pixel. Uncapped pixel ratios trigger thermal throttling, battery drain, and dropped frame rates below 30 fps. Clause 4 of the Fallback Contract enforces a strict 1.5 DPR ceiling."
exceptions: "Client-side export tools that capture high-resolution offline screenshot downloads upon explicit user demand."
---

## Context & Problem
Mobile and retina desktop screens often report `window.devicePixelRatio` values between 3.0 and 4.0. When developers pass `window.devicePixelRatio` directly to `renderer.setPixelRatio()`, Three.js allocates framebuffers matching the native hardware resolution. A canvas spanning 390x844 CSS pixels on an iPhone 14 Pro must evaluate over 3.2 million pixels for every frame. When running complex fragment shaders or multi-sample post-processing passes, this astronomical fill rate overwhelms mobile GPUs within seconds, causing aggressive thermal throttling, hardware downclocking, battery depletion, and stuttering framerates.

## Detection Logic
Static AST analysis searches for WebGL renderer initialization and Canvas element declarations:
1. Calls to `renderer.setPixelRatio(window.devicePixelRatio)` without `Math.min()` capping.
2. React Three Fiber `<Canvas>` elements configured with `dpr={window.devicePixelRatio}` or unconstrained floating-point arrays exceeding `1.5`.
3. CSS canvas backing buffer allocations derived directly from unconstrained screen density.

## Remediation Steps
1. Enforce a hard ceiling of `1.5` on the device pixel ratio when configuring the WebGL renderer:
   ```typescript
   const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5);
   renderer.setPixelRatio(dpr);
   ```
2. In React Three Fiber projects, configure the canvas component with the constrained array:
   ```tsx
   <Canvas dpr={[1, 1.5]}>
   ```
3. For Tier 1 (lite) hardware, further reduce the cap to `1.0` to guarantee high framerates on lower-tier mobile GPUs.

## Verification
1. Inspect the rendered canvas element in Chrome DevTools on a simulated high-DPI display (e.g. 3x device pixel ratio).
2. Verify that `canvas.width` is exactly equal to `Math.round(canvas.clientWidth * Math.min(window.devicePixelRatio, 1.5))`, never scaling to native 3x or 4x dimensions.
3. Validate that GPU draw call rasterization time remains well under the 16.6ms frame budget during continuous interactions.
