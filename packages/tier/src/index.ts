export type DeviceTier = 'full' | 'lite' | 'poster';

export interface TierOptions {
  forceTier?: DeviceTier;
  overrideMemory?: number;
  overrideConcurrency?: number;
  overrideReducedMotion?: boolean;
  overrideSaveData?: boolean;
  overrideHasWebGL?: boolean;
}

/**
 * Determine deterministic hardware capability tier.
 * Tier 2 ('full'): high-performance desktop or mobile GPU (>=8GB RAM, >=8 CPU cores)
 * Tier 1 ('lite'): mid-tier hardware (4GB-6GB RAM, 4-6 CPU cores)
 * Tier 0 ('poster'): constrained devices (<4GB RAM, <4 CPU cores, saveData, reduced motion, or no WebGL)
 */
export function tier(options: TierOptions = {}): DeviceTier {
  if (options.forceTier) return options.forceTier;

  // 1. Check URL parameters in browser environments
  if (typeof window !== 'undefined' && window.location?.search) {
    const params = new URLSearchParams(window.location.search);
    const force = params.get('chaff_force_tier') as DeviceTier | null;
    if (force && ['full', 'lite', 'poster'].includes(force)) {
      return force;
    }
  }

  // 2. Reduced Motion check -> must downgrade to poster
  const prefersReducedMotion =
    options.overrideReducedMotion !== undefined
      ? options.overrideReducedMotion
      : typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) return 'poster';

  // 3. Data Saver check -> must downgrade to poster
  const nav = typeof navigator !== 'undefined' ? (navigator as any) : null;
  const saveData =
    options.overrideSaveData !== undefined
      ? options.overrideSaveData
      : nav?.connection?.saveData === true;

  if (saveData) return 'poster';

  // 4. WebGL context availability check
  const hasWebGL =
    options.overrideHasWebGL !== undefined
      ? options.overrideHasWebGL
      : typeof document !== 'undefined'
      ? (() => {
          try {
            const canvas = document.createElement('canvas');
            return !!(
              window.WebGLRenderingContext &&
              (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
            );
          } catch {
            return false;
          }
        })()
      : true;

  if (!hasWebGL) return 'poster';

  // 5. Hardware profiling: Memory and Concurrency
  const memory =
    options.overrideMemory !== undefined
      ? options.overrideMemory
      : nav?.deviceMemory ?? 8;

  const concurrency =
    options.overrideConcurrency !== undefined
      ? options.overrideConcurrency
      : nav?.hardwareConcurrency ?? 8;

  if (memory < 4 || concurrency < 4) {
    return 'poster';
  }

  if (memory <= 6 || concurrency <= 6) {
    return 'lite';
  }

  return 'full';
}

export interface GovernorOptions {
  level?: DeviceTier;
  maxPixelRatio?: number;
  targetFps?: number;
  onDegrade?: () => void;
}

export interface GovernorInstance {
  effectivePixelRatio: number;
  attach: (
    canvas: any,
    renderFrame?: (time: number) => void
  ) => { detach: () => void; isPaused: () => boolean; getFps: () => number };
  getEffectivePixelRatio: (devicePixelRatio?: number) => number;
}

/**
 * Frame Governor enforcing DPR ceilings and lifecycle pausing.
 */
export function governor(options: GovernorOptions = {}): GovernorInstance {
  const maxDpr = options.maxPixelRatio ?? 1.5;

  const getEffectivePixelRatio = (dpr?: number): number => {
    const raw =
      dpr ?? (typeof window !== 'undefined' ? window.devicePixelRatio ?? 1 : 1);
    return Math.min(raw, maxDpr);
  };

  const effectivePixelRatio = getEffectivePixelRatio();

  const attach = (canvas: any, renderFrame?: (time: number) => void) => {
    let paused = false;
    let animId: any = null;
    let lastTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    let frameCount = 0;
    let currentFps = 60;
    let degraded = false;

    // Visibility Observer
    let observer: any = null;
    if (typeof IntersectionObserver !== 'undefined' && canvas?.nodeType === 1) {
      observer = new IntersectionObserver(([entry]) => {
        paused = !entry.isIntersecting;
      });
      observer.observe(canvas);
    }

    // Document Visibility
    const onVisibilityChange = () => {
      if (typeof document !== 'undefined') {
        paused = document.hidden;
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVisibilityChange);
    }

    // Loop
    const loop = (now: number) => {
      if (!paused && renderFrame) {
        frameCount++;
        if (now - lastTime >= 1000) {
          currentFps = (frameCount * 1000) / (now - lastTime);
          frameCount = 0;
          lastTime = now;

          // Downgrade effect if fps drops below 45 fps
          if (currentFps < 45 && !degraded && options.onDegrade) {
            degraded = true;
            options.onDegrade();
          }
        }
        renderFrame(now);
      }

      if (typeof requestAnimationFrame !== 'undefined') {
        animId = requestAnimationFrame(loop);
      }
    };

    if (typeof requestAnimationFrame !== 'undefined' && renderFrame) {
      animId = requestAnimationFrame(loop);
    }

    const detach = () => {
      if (observer) observer.disconnect();
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisibilityChange);
      }
      if (typeof cancelAnimationFrame !== 'undefined' && animId) {
        cancelAnimationFrame(animId);
      }
    };

    return {
      detach,
      isPaused: () => paused,
      getFps: () => currentFps,
    };
  };

  return {
    effectivePixelRatio,
    attach,
    getEffectivePixelRatio,
  };
}

/**
 * Explicit recursive GPU memory cleanup helper for Three.js, React Three Fiber, or OGL.
 */
export function dispose(target: any): void {
  if (!target) return;

  // Single resource with dispose
  if (typeof target.dispose === 'function') {
    target.dispose();
  }

  // Scene traversal
  if (typeof target.traverse === 'function') {
    target.traverse((object: any) => {
      if (object.geometry && typeof object.geometry.dispose === 'function') {
        object.geometry.dispose();
      }
      if (object.material) {
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        for (const mat of materials) {
          // Dispose textures on material
          for (const key of Object.keys(mat)) {
            const val = mat[key];
            if (val && typeof val.dispose === 'function') {
              val.dispose();
            }
          }
          if (typeof mat.dispose === 'function') {
            mat.dispose();
          }
        }
      }
    });
  }

  // Renderer context force loss
  if (typeof target.forceContextLoss === 'function') {
    target.forceContextLoss();
  }
}
