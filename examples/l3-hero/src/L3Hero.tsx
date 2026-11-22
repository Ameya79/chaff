import React, { useState, useEffect } from 'react';
import { tier, DeviceTier } from '@chaff/tier';
import { PosterFallback } from './PosterFallback.js';
import { SceneCanvas } from './SceneCanvas.js';

/**
 * Reference Level 3 Hero Component satisfying all 5 clauses of the Fallback Contract:
 * 1. Lazy load 3D assets post-hydration
 * 2. Static poster fallback during SSR, reduced-motion, or low capability
 * 3. Deterministic device tier check via @chaff/tier
 * 4. Frame governor & DPR cap <= 1.5 with lifecycle pausing and unmount disposal
 * 5. Asset payload under 250 KB
 */
export function L3Hero() {
  const [mounted, setMounted] = useState(false);
  const [deviceTier, setDeviceTier] = useState<DeviceTier>('poster');

  useEffect(() => {
    // Client-side evaluation via @chaff/tier
    const evaluatedTier = tier();
    setDeviceTier(evaluatedTier);
    setMounted(true);
  }, []);

  // During SSR or prior to client hydration, render high-fidelity static poster
  if (!mounted) {
    return <PosterFallback />;
  }

  // Clause 2 & 3: Constrained devices (<4GB RAM, saveData, reduced-motion) stay on static poster
  if (deviceTier === 'poster') {
    return <PosterFallback />;
  }

  // Tier 1 (lite) or Tier 2 (full): Render interactive scene canvas
  return <SceneCanvas deviceTier={deviceTier} />;
}
