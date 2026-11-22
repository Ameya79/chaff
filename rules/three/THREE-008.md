---
id: THREE-008
title: Handle WebGL context loss and restoration gracefully without unhandled runtime exceptions
severity: high
levels: [3]
detect: static
fix_class: context_resilience
bad: "function setupCanvas(canvas) {\n  const gl = canvas.getContext('webgl2');\n  const renderer = new THREE.WebGLRenderer({ canvas });\n  // No context loss or restoration listeners registered\n  return renderer;\n}"
good: "function setupCanvas(canvas) {\n  const renderer = new THREE.WebGLRenderer({ canvas });\n  canvas.addEventListener('webglcontextlost', (event) => {\n    event.preventDefault();\n    cancelAnimationFrame(animationFrameId);\n    pauseAudioAndInteractions();\n  }, false);\n  canvas.addEventListener('webglcontextrestored', () => {\n    reinitializeSceneGraph(renderer);\n    resumeAnimation();\n  }, false);\n  return renderer;\n}"
why: "Mobile operating systems and background processes aggressively revoke WebGL contexts under GPU memory contention. Lacking context loss handlers causes frozen execution loops, uncaught JavaScript exceptions, and permanent blank viewports until manual page refresh."
exceptions: "Ephemeral offscreen canvas contexts instantiated for one-shot deterministic image rasterization or server-side software rendering."
---

## Context & Problem
WebGL contexts operate under the direct discretion of the client operating system and browser GPU process. When a mobile device receives an incoming phone call, transitions between native applications, wakes from system sleep, or encounters VRAM exhaustion from another application, the browser forcibly revokes the WebGL rendering context. By default, when a context is lost, Three.js and raw WebGL pipelines fail silently or flood the browser console with unhandled exceptions (`GL_INVALID_OPERATION`, `INVALID_VALUE`, or null pointer dereferences). Without explicit listeners for `webglcontextlost` and `webglcontextrestored`, the canvas freezes on screen as a blank white or black rectangle and can never recover without a hard browser reload.

## Detection Logic
Static source analysis evaluates canvas initialization and lifecycle logic:
1. Registration of `WebGLRenderer` or raw WebGL canvas instantiation without accompanying `webglcontextlost` event listeners on the canvas DOM element.
2. Absence of `event.preventDefault()` inside context loss callbacks, which prevents the browser from ever generating the subsequent `webglcontextrestored` event.
3. Animation loops that continue invoking `renderer.render()` after context loss without checking `gl.isContextLost()`.

## Remediation Steps
1. Register a listener for `webglcontextlost` on the canvas DOM element and immediately invoke `event.preventDefault()`:
   ```typescript
   canvas.addEventListener('webglcontextlost', (event: Event) => {
     event.preventDefault();
     cancelAnimationFrame(rafId);
     isContextActive = false;
     showPosterFallback();
   }, false);
   ```
2. Register a listener for `webglcontextrestored` to reconstruct geometries, re-upload textures, recompile shader programs, and resume the render loop:
   ```typescript
   canvas.addEventListener('webglcontextrestored', () => {
     isContextActive = true;
     rebuildSceneResources();
     rafId = requestAnimationFrame(renderLoop);
   }, false);
   ```
3. Alternatively, if full asset recreation is impractical, transition gracefully to the static poster fallback image (Clause 2 of the Fallback Contract) without displaying visual errors to the user.
4. For React Three Fiber applications, hook into the canvas context loss events via `<Canvas onCreated={({ gl }) => { ... }}>` or ensure the canvas parent component mounts an error boundary.

## Verification
1. Open the application in Chrome and trigger synthetic context loss via the `WEBGL_lose_context` debug extension:
   ```javascript
   const ext = canvas.getContext('webgl2').getExtension('WEBGL_lose_context');
   ext.loseContext();
   ```
2. Assert that zero uncaught exceptions are thrown, the animation frame loop halts cleanly, and the interface displays the poster fallback.
3. Trigger context restoration (`ext.restoreContext()`) and verify that the scene re-renders correctly without graphical corruption.
