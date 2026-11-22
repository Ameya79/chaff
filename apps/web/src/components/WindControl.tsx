'use client';

import React, { useEffect, useRef, useState } from 'react';
import { tier, governor, dispose, DeviceTier } from '@chaff/tier';

/**
 * Signature Level 3 Moment: The Wind Control
 * Scrubbable winnowing force dial simulating the physical separation of grain from chaff.
 * Capped at 1.5 DPR, pauses offscreen and on hidden tab, disposes on unmount.
 */
export function WindControl() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [deviceTier, setDeviceTier] = useState<DeviceTier>('poster');
  const [windForce, setWindForce] = useState<number>(45);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const detected = tier();
    setDeviceTier(detected);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || deviceTier === 'poster') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gov = governor({
      level: deviceTier,
      maxPixelRatio: 1.5,
      targetFps: 60,
    });

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = gov.getEffectivePixelRatio();
    const width = 800;
    const height = 400;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Particle system: heavy grains vs lightweight chaff husks
    const particleCount = deviceTier === 'full' ? 120 : 50;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      isGrain: Math.random() > 0.45,
      size: Math.random() * 2.5 + 1.5,
      vy: Math.random() * 1.5 + 0.8,
      vx: 0,
      opacity: Math.random() * 0.6 + 0.4,
    }));

    const controller = gov.attach(canvas, () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const normalizedWind = (windForce - 50) * 0.08;

      for (const p of particles) {
        // Grains are dense and drop downward; chaff husks catch the winnowing breeze and blow away
        if (p.isGrain) {
          p.y += p.vy;
          p.x += normalizedWind * 0.25;
          ctx.fillStyle = '#b45309'; // Golden wheat/grain
        } else {
          p.y += p.vy * 0.4;
          p.x += normalizedWind * 1.8;
          ctx.fillStyle = '#9e948a'; // Husk chaff
        }

        // Wrap around boundaries
        if (p.y > height) {
          p.y = 0;
          p.x = Math.random() * width;
        }
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;

        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    return () => {
      controller.detach();
      dispose(canvas);
    };
  }, [mounted, deviceTier, windForce]);

  if (!mounted || deviceTier === 'poster') {
    // Clause 2 Fallback Contract: High-fidelity static poster
    return (
      <div className="hairline p-6 bg-[var(--bg-surface)] rounded-md">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent-ember)]">
            Winnowing Floor Static Poster (Tier 0 / Poster Mode)
          </span>
          <span className="font-mono text-xs text-[var(--text-dim)]">0 GPU Overhead</span>
        </div>
        <svg viewBox="0 0 800 240" className="w-full h-auto aspect-[16/6] bg-[var(--bg-canvas)] hairline rounded">
          <text x="400" y="125" textAnchor="middle" fill="var(--text-main)" fontFamily="var(--font-serif)" fontSize="20">
            The grain settles on the stone. The chaff is winnowed away.
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className="hairline p-6 bg-[var(--bg-surface)] rounded-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent-ember)] block">
            Level 3 Interactive Moment • Winnowing Wind Control
          </span>
          <h3 className="text-lg font-serif mt-1">Separate the Husk from the Grain</h3>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="windRange" className="font-mono text-xs text-[var(--text-dim)]">
            Winnowing Force: <strong className="text-[var(--text-main)]">{windForce}kt</strong>
          </label>
          <input
            id="windRange"
            type="range"
            min="0"
            max="100"
            value={windForce}
            onChange={(e) => setWindForce(parseInt(e.target.value, 10))}
            className="cursor-pointer accent-[var(--accent-ember)]"
          />
        </div>
      </div>

      <div className="relative aspect-[16/7] w-full bg-[var(--bg-canvas)] hairline rounded overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
      </div>

      <div className="flex justify-between items-center text-xs font-mono text-[var(--text-dim)] mt-3">
        <span>Hardware Tier: <strong className="text-[var(--text-main)] uppercase">{deviceTier}</strong></span>
        <span>Device Pixel Ratio Cap: <strong>1.5 DPR</strong></span>
        <span>Lifecycle: <strong>Pauses offscreen</strong></span>
      </div>
    </div>
  );
}
