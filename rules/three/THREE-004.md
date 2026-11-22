---
id: THREE-004
title: Throttle requestAnimationFrame and pause rendering when canvas is offscreen or tab is hidden
severity: high
levels: [3]
detect: rendered
fix_class: frame_governor
bad: "function animate() {\n  requestAnimationFrame(animate);\n  mesh.rotation.y += 0.01;\n  renderer.render(scene, camera);\n}\nanimate();"
good: "let isVisible = true;\nlet animationId: number | null = null;\n\nconst observer = new IntersectionObserver(([entry]) => {\n  isVisible = entry.isIntersecting && !document.hidden;\n  if (isVisible && !animationId) render();\n});\nobserver.observe(renderer.domElement);\n\ndocument.addEventListener('visibilitychange', () => {\n  isVisible = !document.hidden;\n  if (isVisible && !animationId) render();\n});\n\nfunction render() {\n  if (!isVisible) {\n    animationId = null;\n    return;\n  }\n  mesh.rotation.y += 0.01;\n  renderer.render(scene, camera);\n  animationId = requestAnimationFrame(render);\n}"
why: "Continuous requestAnimationFrame loops running on offscreen or background canvases drain device battery, elevate GPU thermals, and induce main-thread stutter. Clause 4 of the Fallback Contract dictates that rendering must pause immediately when the canvas leaves the viewport or the document tab is hidden."
exceptions: "Continuous rendering pipelines powering active Web Audio visualizations during background audio playback, or headless export workers capturing frames."
---

## Context & Problem
In standard Three.js and WebGL implementations, animation loops are driven by unconditional `requestAnimationFrame` recursion. When a user scrolls past a 3D hero component, navigates down a long landing page, or switches browser tabs, an unthrottled render loop continues to execute 60 to 120 draw calls per second. This sustained GPU workload drains battery on mobile devices, causes thermal throttling, degrades scroll smoothness across the rest of the application, and degrades battery life. Clause 4 of the Chaff Mandatory Fallback Contract requires all Level 3 interactive 3D viewports to implement an active frame governor that suspends animation whenever the canvas is not actively visible.

## Detection Logic
Automated headless browser evaluation observes canvas frame dispatch while manipulating viewport position and page visibility:
1. The page is scrolled so that the 3D canvas is positioned outside the viewport. The test harness intercepts `requestAnimationFrame` and measures draw calls over a 2000ms window. If the canvas issues draw calls while scrolled offscreen, a violation is recorded.
2. The page visibility state is toggled to `hidden` via `document.dispatchEvent(new Event('visibilitychange'))`. If the render loop continues to trigger WebGL draw calls during the hidden state, a violation is recorded.
3. Static AST analysis inspects animation loops to ensure integration with `IntersectionObserver`, Page Visibility API (`document.hidden`), or React Three Fiber's frameloop governor (`frameloop="demand"` or viewport-gated rendering).

## Remediation Steps
1. Attach an `IntersectionObserver` to the canvas container element with a threshold of `0.0` or `0.05` to detect when the canvas enters or leaves the visible viewport.
2. Register a listener for the `visibilitychange` event on `document` to detect when the user minimizes the browser window or switches tabs.
3. Manage a running flag or cancel the active `requestAnimationFrame` token immediately when visibility is lost:
   ```typescript
   let isIntersecting = false;
   let rafHandle: number | null = null;

   function tick() {
     if (!isIntersecting || document.hidden) {
       rafHandle = null;
       return;
     }
     updateScene();
     renderer.render(scene, camera);
     rafHandle = requestAnimationFrame(tick);
   }

   const observer = new IntersectionObserver(([entry]) => {
     isIntersecting = entry.isIntersecting;
     if (isIntersecting && !document.hidden && rafHandle === null) {
       rafHandle = requestAnimationFrame(tick);
     }
   });
   observer.observe(canvasElement);
   ```
4. For React Three Fiber applications, configure `<Canvas frameloop="demand">` and trigger `invalidate()` only upon user interaction, state change, or use an intersection observer hook to toggle `frameloop={inView ? 'always' : 'never'}`.

## Verification
1. Run automated headless test scrolling the canvas out of view and assert that WebGL draw call counter remains unchanged after scrolling.
2. Toggle `document.hidden = true` and confirm that CPU usage drops to baseline idle and no subsequent `requestAnimationFrame` callbacks fire for the scene.
3. Scroll canvas back into viewport and verify that the animation loop resumes seamlessly without visual glitching or dropped frames.
