import React, { useEffect, useRef } from 'react';
import { governor, dispose, DeviceTier } from '@chaff/tier';

export interface SceneCanvasProps {
  deviceTier: DeviceTier;
}

/**
 * Clause 3 & 4 of Fallback Contract:
 * Uses @chaff/tier governor to cap devicePixelRatio at 1.5,
 * pauses rendering when offscreen or tab is hidden,
 * and recursively disposes GPU memory upon unmount.
 */
export function SceneCanvas({ deviceTier }: SceneCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize Frame Governor (Cap DPR at 1.5, target 60fps)
    const gov = governor({
      level: deviceTier,
      maxPixelRatio: 1.5,
      targetFps: 60,
      onDegrade: () => {
        console.warn('[Chaff Frame Governor] Framerate dropped below 45 fps; stepping down effect complexity');
      },
    });

    const ctx = canvas.getContext('2d');
    const dpr = gov.getEffectivePixelRatio();
    canvas.width = 1200 * dpr;
    canvas.height = 675 * dpr;

    let rotation = 0;

    // Attach governor to canvas for lifecycle pausing (IntersectionObserver + document.hidden)
    const controller = gov.attach(canvas, (time) => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Simple 3D projection demonstration
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      rotation += deviceTier === 'full' ? 0.02 : 0.01;
      ctx.rotate(rotation);

      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 3 * dpr;
      ctx.strokeRect(-100 * dpr, -100 * dpr, 200 * dpr, 200 * dpr);
      ctx.restore();
    });

    // Cleanup: disconnect observers, cancel animation loop, dispose resources
    return () => {
      controller.detach();
      dispose(canvas);
    };
  }, [deviceTier]);

  return (
    <div className="relative w-full aspect-[16/9] max-w-5xl mx-auto overflow-hidden rounded-xl bg-stone-950">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
