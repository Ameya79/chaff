# Level 3 Contract: Risk (Ultra Creative & 3D Experiences)

For a link-only session, follow the [autonomous runbook](../docs/link-run.md). Approval and pitching steps here apply to guided sessions. All budgets and identity locks apply in both modes.

## 1. Philosophy & Purpose
Level 3 is the experimental frontier contract in Chaff. Its goal is to create **unforgettable, tactile web experiences** utilizing WebGL, Three.js, GLSL shaders, and spatial interaction design.

Level 3 operates under a strict iron rule: **Risk is allowed, harm is not.** Creative daring and visual spectacle are celebrated, but user harm—crashing low-tier mobile devices, freezing scrolling responsiveness, draining batteries, or consuming mobile data allocations—is strictly prohibited.

If a visual effect causes performance or accessibility degradation, the effect must yield to the user's device constraints.

---

## 2. Mandatory Pre-Implementation Gate: 3 Creative Pitches
Prior to writing production code in Level 3, the agent must generate three distinct creative concepts documented in `.chaff/pitches/`:

1. **Direction A (`.chaff/pitches/pitch-1.md`)**:
   - Focus: Subtle spatial geometry and ambient depth (e.g., interactive wireframe particles linked to cursor movement).
2. **Direction B (`.chaff/pitches/pitch-2.md`)**:
   - Focus: Scroll-driven GLSL shader distortion (e.g., fluid displacement shader on hero typography with post-processing pass).
3. **Direction C (`.chaff/pitches/pitch-3.md`)**:
   - Focus: Tactile physical simulation (e.g., interactive physics canvas with constrained rigid bodies reacting to drag gestures).

The agent must pause and receive human confirmation on the chosen direction before proceeding with implementation.

---

## 3. Allowed Actions
Agents executing Level 3 are permitted to implement high-craft interactive graphics:

1. **All Level 1 & Level 2 Enhancements**:
   - Complete typographic hygiene, accessibility fixes, editorial layouts, and tactile micro-interactions.
2. **3D Graphics & Canvas Engines**:
   - Three.js, `@react-three/fiber`, `@react-three/drei`, OGL, raw WebGL 2.0, and WebGPU pipelines.
3. **Custom GLSL Shaders**:
   - Hand-authored vertex and fragment shaders for ripple effects, chromatic aberration, raymarching, or organic noise displacement.
4. **Scroll Choreography**:
   - Smooth 3D camera transitions interpolated against page scroll progress.
5. **Experimental Typography**:
   - Kinetic type, oversized display lettering, and variable-font optical weight transitions tied to interaction.

---

## 4. Forbidden Actions
Agents executing Level 3 are strictly prohibited from the following:

1. **Shipping Without the Fallback Contract**:
   - Delivering any WebGL canvas, 3D model, or shader effect without fulfilling all five clauses of the Mandatory Fallback Contract is an immediate gate failure.
2. **Blocking the Critical Rendering Path**:
   - 3D bundles, geometries, and shader compilation must never block First Contentful Paint (FCP) or Largest Contentful Paint (LCP).
3. **Downgrading Performance Budgets**:
   - When automated checks (`chaff gate`) fail, the agent is strictly forbidden from increasing latency budgets or loosening constraints. **The agent downgrades the effect, never the budget.**
4. **Memory Leaks & Zombie Contexts**:
   - Rendering loops that continue executing offscreen or unmanaged WebGL resources that fail to dispose of GPU memory upon unmount are strictly forbidden.

---

## 5. The Mandatory 5-Part Fallback Contract
Every 3D scene, canvas hero, or WebGL element authored under Level 3 must implement all five of the following fallback guarantees:

### Part 1: Lazy Loading of 3D Canvas and Assets
- **Hydration Independence**: The 3D canvas and supporting rendering packages must be dynamically imported after the primary DOM has mounted and hydrated (e.g., using `next/dynamic` with `ssr: false`).
- **LCP Protection**: The 3D scene must never participate in or delay Largest Contentful Paint. First paint must occur from standard HTML/CSS.

### Part 2: Static Poster Image / SVG Fallback
- **SSR-Ready Fallback**: A high-fidelity static image (WebP/AVIF) or lightweight vector SVG representing the initial state of the 3D scene must render during Server-Side Rendering (SSR).
- **Graceful Activation**: The static poster serves as the immediate visual presentation while assets stream.
- **Preference Respect**: The static poster replaces the 3D canvas permanently when:
  - The client operating system requests reduced motion (`@media (prefers-reduced-motion: reduce)`).
  - The client network requests data savings (`navigator.connection.saveData === true`).
  - The client hardware environment lacks WebGL support or fails context creation.

### Part 3: Device Tier Check via `@chaff/tier`
Hardware capabilities must be evaluated using the `@chaff/tier` runtime module (inspecting `navigator.hardwareConcurrency`, `navigator.deviceMemory`, network conditions, and GPU vendor strings) into three deterministic tiers:

- **Tier 2 (`full`)**: High-performance desktop and mobile GPUs.
  - Action: Execute full 3D scene, enable post-processing passes, run interactive simulation.
- **Tier 1 (`lite`)**: Mid-tier devices, tablets, and mobile hardware.
  - Action: Execute simplified scene. Disable post-processing passes, reduce particle count by 75%, simplify fragment shaders.
- **Tier 0 (`poster`)**: Low-end mobile devices, low memory (< 4GB), or devices with battery-saving mode enabled.
  - Action: Do not initialize WebGL context. Render only the static poster image. Zero GPU overhead.

### Part 4: Frame Governor & Pixel Ratio Cap
- **Device Pixel Ratio Cap**: The rendering canvas must cap `devicePixelRatio` at a maximum of `1.5`:
  ```javascript
  const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
  renderer.setPixelRatio(pixelRatio);
  ```
  Rendering at native 3x or 4x mobile display resolutions is strictly banned due to thermal throttling and battery drain.
- **Frame Rate Target**: Target a steady 60 frames per second. If consecutive frame drops occur below 45 fps, the runtime must dynamically step down shader complexity.
- **Lifecycle Pausing**:
  - Automatically pause the rendering `requestAnimationFrame` loop when the canvas element is not visible in the viewport using `IntersectionObserver`.
  - Automatically pause rendering when the browser tab is inactive (`document.hidden === true`).
- **Resource Disposal**:
  - The component must traverse and explicitly call `.dispose()` on all geometries, textures, render targets, materials, and WebGL renderer contexts upon component unmount.

### Part 5: 3D Asset Payload Budget
- **Initial Payload Limit**: The total initial payload for the 3D JavaScript bundle chunk plus 3D model geometry (GLTF/GLB) must remain strictly **under 250 KB gzipped**.
- **Compression**: All 3D assets must utilize Draco or Meshopt geometry compression.
- **Deferred Streaming**: Secondary texture maps, environment HDRI files, and auxiliary animations must be deferred and streamed only after user interaction.

---

## 6. Performance & Quality Budgets
All Level 3 experiences must pass automated performance verification gates:

| Metric | Target Budget | Enforcement Level |
|---|---|---|
| **Lighthouse Mobile Performance** | >= 80 (with 3D running) / >= 85 showcase | Hard Gate (`chaff gate`) |
| **Largest Contentful Paint (LCP)** | <= 2.5s on mobile (static poster counts) | Hard Gate |
| **Interaction to Next Paint (INP)** | <= 200ms | Hard Gate |
| **Cumulative Layout Shift (CLS)** | <= 0.10 | Hard Gate |
| **Total Blocking Time (TBT)** | <= 300ms | Hard Gate |
| **First-Load Baseline JavaScript** | <= 170 KB gzipped | Hard Gate |
| **Lazy 3D Chunk & Geometry Payload** | <= 250 KB gzipped | Hard Gate |
| **Horizontal Viewport Overflow** | Zero overflow at 320px width | Hard Gate |
| **Touch Target Dimensions** | Minimum 44x44px for all targets | Hard Gate |
| **Fallback Contract Compliance** | 5 out of 5 guarantees satisfied | Hard Gate |
| **Gate Failure Remediation** | Downgrade effect complexity, never budget | Hard Rule |
