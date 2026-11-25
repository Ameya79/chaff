'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { tier, DeviceTier } from '@chaff/tier';
import { WinnowScenePoster } from './WinnowScenePoster';

const WinnowThreeScene = dynamic(() => import('./WinnowThreeScene'), {
  ssr: false,
  loading: () => (
    <WinnowScenePoster reason="Hydrating Three.js winnowing sculpture" />
  ),
});

export function WinnowThreeHero() {
  const [deviceTier, setDeviceTier] = useState<DeviceTier>('poster');
  const [webglFailed, setWebglFailed] = useState<boolean>(false);
  const [windKnots, setWindKnots] = useState<number>(42);
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    setDeviceTier(tier());

    const readTheme = () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'light' ? 'light' : 'dark');
    };
    readTheme();

    const observer = new MutationObserver(readTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = () => setDeviceTier(tier());
    mq.addEventListener?.('change', onMotionChange);

    return () => {
      observer.disconnect();
      mq.removeEventListener?.('change', onMotionChange);
    };
  }, []);

  const handleWebGLUnavailable = useCallback(() => {
    setWebglFailed(true);
  }, []);

  const copyCommand = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('npx chaff init --level 3');
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 1800);
    }
  };

  const isPosterMode = deviceTier === 'poster' || webglFailed;
  const activeTierLabel = isPosterMode ? 'poster' : deviceTier;

  return (
    <section className="relative min-h-[calc(100dvh-4rem)] w-full flex flex-col justify-between overflow-hidden">
      {/* Layer 0: Full-Bleed Three.js Sculpture OR SSR Static SVG Poster */}
      {isPosterMode ? (
        <WinnowScenePoster
          theme={theme}
          reason="Tier 0 / Reduced Motion static SVG sculpture poster"
        />
      ) : (
        <WinnowThreeScene
          deviceTier={deviceTier}
          windKnots={windKnots}
          theme={theme}
          onWebGLUnavailable={handleWebGLUnavailable}
        />
      )}

      {/* Subtle typography contrast scrim (desktop left edge, mobile lower half) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            'linear-gradient(90deg, var(--bg-canvas) 28%, transparent 58%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 lg:hidden"
        style={{
          background:
            'linear-gradient(to top, var(--bg-canvas) 44%, transparent 82%)',
        }}
      />

      {/* Foreground Monumental Typography */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-10 my-auto">
        <div className="max-w-3xl space-y-7">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent-ember)] block">
            Level 3 Design Enforcement
          </span>

          <h1
            className="font-serif text-[var(--text-main)] leading-[0.96] tracking-[-0.04em]"
            style={{ fontSize: 'clamp(3.25rem, 7.5vw, 6.75rem)' }}
          >
            Winnow the slop.
            <span className="block italic text-[var(--status-warn)]">
              Keep the grain.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-[var(--text-dim)] max-w-[42ch] leading-relaxed">
            72 rules, locked brand identity, and hard WebGL budgets enforced before merge.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/playground" className="btn primary text-sm">
              Open Playground
            </Link>
            <Link href="/rules" className="btn text-sm">
              72 Rules
            </Link>
            <button
              type="button"
              onClick={copyCommand}
              aria-label="Copy npx chaff init --level 3 command"
              className="btn bg-[var(--bg-pill-glass)] hover:bg-[var(--bg-surface)] font-mono text-xs text-[var(--text-dim)] hover:text-[var(--text-main)] px-4"
            >
              <code>$ npx chaff init --level 3</code>
              <span className="text-[var(--accent-ember)]">
                {copiedCmd ? 'Copied' : 'Copy'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Kinetic Wind Force & Tier Telemetry */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 pb-8 pt-4">
        <div className="hairline-t pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <label
              htmlFor="hero-wind-range"
              className="font-mono text-xs uppercase tracking-wider text-[var(--text-dim)] whitespace-nowrap"
            >
              Wind Force
            </label>
            <input
              id="hero-wind-range"
              type="range"
              min="0"
              max="100"
              value={windKnots}
              onChange={(e) => setWindKnots(parseInt(e.target.value, 10))}
              aria-label="Adjust curl-wind force separating chaff shards from grain kernels"
              className="w-36 sm:w-52 min-h-[44px] text-base cursor-pointer"
            />
            <span className="font-mono text-xs text-[var(--text-main)] tabular-nums w-12">
              {windKnots} kt
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-[var(--text-dim)]">
            <span>
              Tier <strong className="text-[var(--text-main)] uppercase">{activeTierLabel}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>DPR &le; 1.5</span>
            <span aria-hidden="true">·</span>
            <span>
              {isPosterMode
                ? 'Static SVG Poster'
                : deviceTier === 'full'
                ? '140 Grain / 220 Husk'
                : '35 Grain / 55 Husk'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
