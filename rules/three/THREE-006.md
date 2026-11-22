---
id: THREE-006
title: Explicitly dispose geometries, textures, materials, and render targets upon component unmount
severity: high
levels: [3]
detect: static
fix_class: gpu_memory_management
bad: "useEffect(() => {\n  const renderer = new THREE.WebGLRenderer();\n  containerRef.current.appendChild(renderer.domElement);\n  return () => {\n    containerRef.current.removeChild(renderer.domElement);\n  };\n}, []);"
good: "useEffect(() => {\n  const renderer = new THREE.WebGLRenderer();\n  containerRef.current.appendChild(renderer.domElement);\n  return () => {\n    scene.traverse((obj) => {\n      if (obj.geometry) obj.geometry.dispose();\n      if (obj.material) {\n        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());\n        else obj.material.dispose();\n      }\n    });\n    renderer.dispose();\n    containerRef.current.removeChild(renderer.domElement);\n  };\n}, []);"
why: "WebGL memory allocations (textures, buffer geometries, shaders, and render targets) reside in GPU VRAM and are not reclaimed by JavaScript garbage collection. Failing to explicitly dispose resources leads to memory leaks and WebGL context loss."
exceptions: "Root-level single-page applications where the 3D scene canvas persists permanently across the entire application session."
---

## Context & Problem
Unlike standard JavaScript objects that are automatically collected by the browser garbage collector when references are removed, WebGL textures, geometries, vertex buffer objects (VBOs), and framebuffers are allocated directly in GPU memory (VRAM). When a Next.js or React route changes and unmounts a 3D component, removing the `<canvas>` DOM node leaves GPU memory completely allocated. After multiple route transitions, cumulative VRAM exhaustion causes the browser to terminate the WebGL context with a `webglcontextlost` event, crashing graphics across the entire browser tab.

## Detection Logic
Static source analysis evaluates component lifecycle cleanup routines in client components:
1. `useEffect` or unmount hooks that instantiate Three.js objects without corresponding `.dispose()` invocations.
2. Missing traversal routines for geometries (`geometry.dispose()`), materials (`material.dispose()`), textures (`texture.dispose()`), or renderers (`renderer.dispose()`).
3. React Three Fiber custom resources allocated outside managed declarative JSX tags without proper lifecycle disposal cleanup.

## Remediation Steps
1. Implement a recursive scene graph traversal in the unmount cleanup function:
   ```typescript
   scene.traverse((object) => {
     if (object.geometry) object.geometry.dispose();
     if (object.material) {
       const materials = Array.isArray(object.material) ? object.material : [object.material];
       materials.forEach((mat) => {
         Object.keys(mat).forEach((prop) => {
           if (mat[prop] && typeof mat[prop].dispose === 'function') mat[prop].dispose();
         });
         mat.dispose();
       });
     }
   });
   renderer.dispose();
   ```
2. Cancel all pending animation frames and detach resize listeners prior to removing the DOM node.
3. Explicitly invoke `renderer.forceContextLoss()` if the renderer instance will never be reused in subsequent viewports.

## Verification
1. Execute automated browser navigation tests mounting and unmounting the 3D route 20 consecutive times.
2. Monitor memory consumption using `performance.memory.usedJSHeapSize` and Chrome DevTools GPU memory metrics.
3. Confirm that GPU memory returns to baseline levels without unhandled context loss errors or leaking vertex buffer allocations.
