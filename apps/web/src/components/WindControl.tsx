'use client';

import React, { useEffect, useRef, useState } from 'react';
import { tier, governor, dispose, DeviceTier } from '@chaff/tier';

interface Particle {
  x: number;
  y: number;
  isGrain: boolean;
  size: number;
  length: number;
  angle: number;
  spin: number;
  vy: number;
  vx: number;
  opacity: number;
}

/**
 * Signature Level 3 Moment: The Winnowing Floor Wind Control
 * Physical simulation separating heavy golden grains from lightweight chaff husks.
 * Enforces hardware tiering (@chaff/tier), 1.5 DPR ceiling, offscreen pausing, and safe teardown.
 */
export function WindControl() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [deviceTier, setDeviceTier] = useState<DeviceTier>('poster');
  const [windForce, setWindForce] = useState<number>(62);
  const windForceRef = useRef<number>(62);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    windForceRef.current = windForce;
  }, [windForce]);

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
    const width = 840;
    const height = 380;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Simulation particle pool
    const count = deviceTier === 'full' ? 140 : 60;
    const particles: Particle[] = Array.from({ length: count }, () => {
      const isGrain = Math.random() > 0.45;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        isGrain,
        size: isGrain ? Math.random() * 2.2 + 1.8 : Math.random() * 2.8 + 1.2,
        length: isGrain ? 0 : Math.random() * 5 + 3,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.08,
        vy: isGrain ? Math.random() * 1.8 + 1.6 : Math.random() * 0.7 + 0.3,
        vx: 0,
        opacity: Math.random() * 0.45 + 0.5,
      };
    });

    const controller = gov.attach(canvas, () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // Wind force read from ref without recreation: 0..100 -> breeze to heavy crosswind
      const breeze = (windForceRef.current - 15) * 0.07;

      for (const p of particles) {
        if (p.isGrain) {
          // Grain is dense: drops downward with steady mass, resisting wind
          p.y += p.vy;
          p.x += breeze * 0.35 + Math.sin(p.y * 0.03) * 0.2;
          ctx.fillStyle = '#C49A45'; // Golden ripe kernel
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Husk is lightweight: caught by crosswind, tumbling horizontally
          p.y += p.vy;
          p.x += breeze * 2.4;
          p.angle += p.spin * (breeze + 0.5);

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.fillStyle = '#9E927A'; // Straw chaff husk
          ctx.globalAlpha = p.opacity * 0.85;

          ctx.beginPath();
          ctx.ellipse(0, 0, p.length, p.size, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Boundary wrap
        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) {
          p.x = -20;
          p.y = Math.random() * height;
        }
        if (p.x < -20) {
          p.x = width + 20;
        }
      }

      ctx.restore();
    });

    return () => {
      controller.detach();
      dispose(canvas);
    };
  }, [mounted, deviceTier]);

  if (!mounted || deviceTier === 'poster') {
    // Clause 2 Fallback Contract: High-fidelity static poster
    return (
      <div className="hairline p-6 sm:p-8 bg-[var(--bg-surface)] rounded-md space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent-ember)] font-semibold">
            Winnowing Floor Static Poster (Tier 0 / Poster Mode)
          </span>
          <span className="font-mono text-xs text-[var(--status-sage)] font-semibold">0 GPU Overhead • Fallback Contract</span>
        </div>
        <div className="aspect-[16/7] w-full bg-[var(--bg-canvas)] hairline rounded flex flex-col items-center justify-center p-6 text-center space-y-2">
          <span className="font-serif text-2xl text-[var(--text-main)]">
            The heavy grain settles on stone. The husk is winnowed away.
          </span>
          <p className="text-xs font-mono text-[var(--text-dim)] max-w-md">
            Hardware tiering detected poster profile (or prefers-reduced-motion). 3D physics paused to preserve battery and frame budget.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="hairline p-6 sm:p-8 bg-[var(--bg-surface)] rounded-md space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 hairline-b pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)]">
            <span>LEVEL 3 SIGNATURE INTERACTION</span>
            <span>/</span>
            <span>PHYSICAL WINNOWING</span>
          </div>
          <h3 className="font-serif text-2xl text-[var(--text-main)]">
            The Winnowing Floor Scrubber
          </h3>
          <p className="text-xs text-[var(--text-dim)] font-mono max-w-lg">
            Drag the wind velocity dial. Heavy golden grains plummet downward to the floor; lightweight husk chaff is carried away by the crosswind.
          </p>
        </div>

        {/* Tactile Scrubber Control */}
        <div className="space-y-2 min-w-[260px]">
          <div className="flex justify-between items-baseline font-mono text-xs">
            <label htmlFor="windVelocity" className="text-[var(--text-dim)]">
              Crosswind Velocity:
            </label>
            <strong className="text-[var(--accent-ember)] text-sm tabular-nums">
              {windForce} kt {windForce > 75 ? '(Gale)' : windForce > 40 ? '(Breeze)' : '(Gentle)'}
            </strong>
          </div>
          <input
            id="windVelocity"
            type="range"
            min="0"
            max="100"
            value={windForce}
            onChange={(e) => setWindForce(parseInt(e.target.value, 10))}
            aria-label="Winnowing wind velocity dial"
            className="w-full cursor-pointer min-h-[44px]"
          />
          <div className="flex justify-between text-[10px] font-mono text-[var(--text-dim)]">
            <span>0kt (Calm)</span>
            <span>50kt (Standard)</span>
            <span>100kt (Gale)</span>
          </div>
        </div>
      </div>

      {/* Physics Canvas Surface */}
      <div className="relative aspect-[16/7] w-full bg-[var(--bg-canvas)] hairline rounded overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
        
        {/* Physical Status Badges */}
        <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded hairline bg-[var(--bg-surface)]/90 text-[var(--text-main)] backdrop-blur-xs">
            ● Grain: Heavy (Settling)
          </span>
          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded hairline bg-[var(--bg-surface)]/90 text-[var(--text-dim)] backdrop-blur-xs">
            ○ Chaff: Airborne (Drifting)
          </span>
        </div>
      </div>

      {/* Tier & Performance Telemetry Ledger */}
      <div className="flex flex-wrap justify-between items-center text-xs font-mono text-[var(--text-dim)] pt-2 gap-4">
        <div className="flex items-center gap-4">
          <span>Tier: <strong className="text-[var(--text-main)] uppercase">{deviceTier}</strong></span>
          <span>DPR Cap: <strong className="text-[var(--text-main)]">1.5 Ceiling</strong></span>
        </div>
        <div className="flex items-center gap-4">
          <span>Lifecycle: <strong className="text-[var(--status-sage)]">Pauses Offscreen</strong></span>
          <span>Teardown: <strong className="text-[var(--status-sage)]">Zero Leaks</strong></span>
        </div>
      </div>
    </div>
  );
}
