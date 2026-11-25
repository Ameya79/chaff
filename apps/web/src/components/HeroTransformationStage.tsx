'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { tier, DeviceTier } from '@chaff/tier';
import kestrelData from '../data/kestrel-stage.json';
import { KestrelStagePoster } from './KestrelStagePoster';
import { RollingCounter } from './RollingCounter';

const KestrelWebGLStage = dynamic(() => import('./KestrelWebGLStage'), {
  ssr: false,
  loading: () => (
    <KestrelStagePoster
      stageMode="side"
      reason="Hydrating WebGL2 winnowing stage"
    />
  ),
});

type StageViewMode = 'side' | 'curtain' | 'before' | 'after';

export function HeroTransformationStage() {
  const [wipePercent, setWipePercent] = useState<number>(50);
  const [viewMode, setViewMode] = useState<StageViewMode>('side');
  const [activeRegionId, setActiveRegionId] = useState<string>('iad');
  const [activeTellId, setActiveTellId] = useState<string>('tell-gradient');
  const [deviceTier, setDeviceTier] = useState<DeviceTier>('poster');
  const [webglFailed, setWebglFailed] = useState<boolean>(false);
  const [windBoost, setWindBoost] = useState<number>(0.45);
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const sweepFrameRef = useRef<number | null>(null);
  const stageBodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDeviceTier(tier());
    return () => {
      if (sweepFrameRef.current) {
        cancelAnimationFrame(sweepFrameRef.current);
      }
    };
  }, []);

  const cancelActiveSweep = () => {
    if (sweepFrameRef.current) {
      cancelAnimationFrame(sweepFrameRef.current);
      sweepFrameRef.current = null;
    }
  };

  const handleModeChange = (mode: StageViewMode) => {
    cancelActiveSweep();
    setViewMode(mode);
    if (mode === 'before') {
      setWipePercent(100);
      setWindBoost(0.2);
    } else if (mode === 'after') {
      setWipePercent(0);
      setWindBoost(0.75);
    } else {
      setWipePercent(50);
      setWindBoost(0.45);
    }
  };

  const triggerWinnowSweep = () => {
    cancelActiveSweep();
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setViewMode('after');
      setWipePercent(0);
      setWindBoost(0.4);
      return;
    }

    setViewMode('curtain');
    setWipePercent(96);
    setWindBoost(1.0);

    const duration = 760;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const nextWipe = Math.round(96 * (1 - ease));
      setWipePercent(nextWipe);
      setWindBoost(1.0 - ease * 0.55);

      if (progress < 1) {
        sweepFrameRef.current = requestAnimationFrame(step);
      } else {
        sweepFrameRef.current = null;
        setViewMode('after');
        setWipePercent(0);
        setWindBoost(0.45);
      }
    };

    sweepFrameRef.current = requestAnimationFrame(step);
  };

  const updateCurtainFromClientX = (clientX: number) => {
    const el = stageBodyRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width) return;
    const pct = Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)));
    setWipePercent(pct);
    setWindBoost(0.35 + ((100 - pct) / 100) * 0.65);
  };

  const copyInstallCmd = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('npx chaff init --level 3');
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 1800);
    }
  };

  const handleWebGLUnavailable = useCallback(() => {
    setWebglFailed(true);
  }, []);

  const activeRegion =
    kestrelData.regions.find((r) => r.id === activeRegionId) ||
    kestrelData.regions[0];

  const activeTell =
    kestrelData.tells.find((t) => t.id === activeTellId) ||
    kestrelData.tells[0];

  const effectiveBeforePct =
    viewMode === 'before'
      ? 100
      : viewMode === 'after'
      ? 0
      : viewMode === 'side'
      ? 50
      : wipePercent;

  const isPosterMode = deviceTier === 'poster' || webglFailed;

  const renderBeforeSlop = (compact: boolean) => (
    <div
      className={`slop-specimen-shell relative p-4 sm:p-5 flex flex-col justify-between gap-3 h-full ${
        compact ? 'min-h-[385px]' : 'min-h-[410px]'
      }`}
    >
      <div className="slop-orb-purple" aria-hidden="true" />
      <div className="slop-orb-cyan" aria-hidden="true" />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/90 font-mono text-xs">
        <span className="text-rose-300 font-semibold uppercase tracking-wider">
          Before · Raw AI Template · {kestrelData.beforeScore}/100
        </span>
        <button
          type="button"
          onClick={() => setActiveTellId('tell-glow')}
          className={`px-2.5 py-1 min-h-[44px] font-mono text-[11px] border ${
            activeTellId === 'tell-glow'
              ? 'bg-rose-900 border-rose-300 text-white font-bold'
              : 'bg-rose-950/90 border-rose-400 text-rose-200'
          }`}
        >
          UI-001 Glow Orbs
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-2.5 my-auto max-w-xl mx-auto w-full">
        <div className="slop-pill-badge inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-[11px] font-mono">
          {kestrelData.slop.pill}
        </div>

        <button
          type="button"
          onClick={() => setActiveTellId('tell-gradient')}
          className={`relative px-3 py-1.5 min-h-[44px] text-center cursor-pointer border w-full ${
            activeTellId === 'tell-gradient'
              ? 'border-rose-400/90 bg-rose-950/35'
              : 'border-transparent hover:border-slate-700'
          }`}
        >
          {activeTellId === 'tell-gradient' && (
            <svg
              className="pointer-events-none absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)]"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 4,14 Q 50,2 96,14 Q 98,50 96,86 Q 50,98 4,86 Q 2,50 4,14 Z"
                fill="none"
                stroke="#F59260"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
                className="proof-ring-path proof-ring-animate"
              />
            </svg>
          )}
          <span
            className={`slop-headline-gradient block font-sans font-extrabold tracking-tight leading-[1.12] ${
              compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
            }`}
          >
            {kestrelData.slop.headline}
          </span>
          <span className="mt-1 inline-block font-mono text-[10px] uppercase px-2 py-0.5 bg-[#9E3308] text-white">
            UI-002 · Gradient Text Mask
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTellId('tell-copy')}
          className={`relative px-2.5 py-1 min-h-[44px] text-center cursor-pointer border w-full ${
            activeTellId === 'tell-copy'
              ? 'border-amber-400 bg-amber-950/30'
              : 'border-transparent hover:border-slate-700'
          }`}
        >
          <span className="block text-xs text-slate-300 max-w-md mx-auto leading-snug">
            {kestrelData.slop.subhead}
          </span>
          <span className="mt-1 inline-block font-mono text-[10px] uppercase px-2 py-0.5 bg-[#7A3E00] text-white">
            COPY-001 / COPY-002 · Buzzwords + Fake Metrics
          </span>
        </button>

        <div className="flex flex-wrap justify-center gap-2">
          <span className="slop-cta-gradient px-3.5 py-1.5 rounded-full text-white text-xs font-semibold">
            {kestrelData.slop.primaryCta}
          </span>
          <span className="px-3.5 py-1.5 rounded-full border border-slate-600 text-slate-200 text-xs font-semibold">
            {kestrelData.slop.secondaryCta}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setActiveTellId('tell-grid')}
          className={`w-full relative p-1.5 min-h-[44px] cursor-pointer border ${
            activeTellId === 'tell-grid'
              ? 'border-rose-400 bg-rose-950/30'
              : 'border-transparent hover:border-slate-700'
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
            {kestrelData.slop.cards.map((card) => (
              <div key={card.title} className="slop-glass-tile p-2">
                <span className="block font-sans text-xs font-bold text-white">
                  {card.title}
                </span>
                <span className="block text-[11px] text-slate-300 mt-0.5 leading-tight">
                  {card.body}
                </span>
              </div>
            ))}
          </div>
          <span className="mt-1.5 inline-block font-mono text-[10px] uppercase px-2 py-0.5 bg-[#9E3308] text-white">
            UI-009 · Centered 3-Card Template Grid
          </span>
        </button>
      </div>

      <div className="relative z-10 pt-2.5 border-t border-slate-800/90 flex justify-between font-mono text-xs text-slate-300">
        <span>5 Open Tells Flagged</span>
        <span className="text-rose-300 font-semibold">Gate: FAIL</span>
      </div>
    </div>
  );

  const renderAfterCrafted = (compact: boolean) => (
    <div
      className={`p-4 sm:p-5 bg-[var(--bg-surface)] text-[var(--text-main)] flex flex-col justify-between gap-3 h-full ${
        compact ? 'min-h-[385px]' : 'min-h-[410px]'
      }`}
    >
      {/* Kestrel Product Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 hairline-b">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="inline-flex items-center justify-center w-8 h-8 rounded font-mono text-xs font-bold text-white shrink-0"
            style={{ backgroundColor: '#6D28D9' }}
          >
            K
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-serif text-base font-bold text-[var(--text-main)]">
                Kestrel
              </span>
              <span
                className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-sm whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--brand-violet-soft)',
                  color: 'var(--brand-violet)',
                }}
              >
                #6D28D9 Waived
              </span>
            </div>
            <span className="font-mono text-[11px] text-[var(--text-dim)] block truncate">
              Multi-Region Spot Order Router · v2.4
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {kestrelData.regions.map((reg) => {
            const selected = reg.id === activeRegion.id;
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => setActiveRegionId(reg.id)}
                aria-pressed={selected}
                className={`px-2 py-1 min-h-[44px] min-w-[44px] font-mono text-[11px] border ${
                  selected
                    ? 'text-white font-semibold border-transparent'
                    : 'bg-[var(--bg-inset)] text-[var(--text-main)] border-[var(--border-line)] hover:bg-[var(--bg-surface-elevated)]'
                }`}
                style={selected ? { backgroundColor: '#6D28D9' } : undefined}
              >
                {reg.code}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content + Execution Waterfall visible above the fold */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-center my-auto">
        <div className={`${compact ? 'xl:col-span-7' : 'lg:col-span-6 xl:col-span-6'} space-y-2.5 min-w-0`}>
          <div className="font-mono text-[11px] uppercase tracking-widest text-[var(--status-sage)] font-semibold">
            After Chaff · {kestrelData.afterScore}/100 · Brand Preserved
          </div>

          <h2
            className={`font-serif text-[var(--text-main)] tracking-tight leading-[1.06] ${
              compact ? 'text-2xl sm:text-[1.65rem]' : 'text-3xl sm:text-4xl'
            }`}
          >
            Route spot orders across 14 venues in {activeRegion.medianMs}.
          </h2>

          <p className="text-xs sm:text-sm text-[var(--text-dim)] leading-snug max-w-[52ch]">
            Deterministic smart order routing with pre-trade margin checks, venue latency waterfalls, and verifiable clearing logs in {activeRegion.code}.
          </p>

          <div className="grid grid-cols-3 gap-2.5 py-2 hairline-y font-mono">
            <div>
              <span className="text-[10px] uppercase text-[var(--text-dim)] block">
                Median Hop
              </span>
              <span className="text-sm sm:text-base font-bold text-[var(--text-main)] tabular-nums">
                {activeRegion.medianMs}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[var(--text-dim)] block">
                p99 Tail
              </span>
              <span className="text-sm sm:text-base font-bold text-[var(--text-main)] tabular-nums">
                {activeRegion.p99Ms}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[var(--text-dim)] block">
                Fill Rate
              </span>
              <span className="text-sm sm:text-base font-bold text-[var(--status-sage)] tabular-nums">
                {activeRegion.fillRate}
              </span>
            </div>
          </div>

          {!compact && (
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={triggerWinnowSweep}
                className="btn violet text-xs font-semibold"
              >
                Replay Winnow Sweep
              </button>
              <Link href="/gallery?id=saas-landing" className="btn text-xs">
                Inspect Code Diff
              </Link>
            </div>
          )}
        </div>

        {/* Custom SVG Telemetry Waterfall */}
        <div
          className={`${
            compact ? 'xl:col-span-5' : 'lg:col-span-6 xl:col-span-6'
          } p-3.5 hairline bg-[var(--bg-inset)] space-y-2 min-w-0`}
        >
          <div className="flex items-center justify-between gap-2 hairline-b pb-1.5 font-mono text-[11px]">
            <span className="font-bold text-[var(--text-main)] uppercase">
              Execution Waterfall
            </span>
            <span className="text-[var(--brand-violet)] font-semibold">
              {activeRegion.code}
            </span>
          </div>

          <div className="space-y-2">
            {activeRegion.venues.map((v) => (
              <div key={v.name} className="space-y-0.5">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[var(--text-main)] font-medium truncate">
                    {v.name}
                  </span>
                  <span className="text-[var(--text-dim)] tabular-nums shrink-0">
                    {v.ms}
                  </span>
                </div>
                <svg
                  viewBox="0 0 360 12"
                  width="360"
                  height="12"
                  className="w-full h-2.5 block"
                  aria-hidden="true"
                >
                  <rect
                    x="0"
                    y="1"
                    width="360"
                    height="10"
                    rx="2"
                    fill="var(--bg-surface)"
                    stroke="var(--border-line)"
                    strokeWidth="1"
                  />
                  <rect
                    x={(v.offsetPct / 100) * 360}
                    y="2"
                    width={Math.max(12, (v.widthPct / 100) * 360)}
                    height="8"
                    rx="2"
                    fill={v.primary ? '#6D28D9' : 'var(--status-sage)'}
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2.5 hairline-t flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[var(--text-dim)]">
        <span>Identity Lock Confirmed (#6D28D9)</span>
        <span className="text-[var(--status-sage)] font-semibold">
          Authored Score: 98 / 100 · Gate PASS
        </span>
      </div>
    </div>
  );

  return (
    <section className="pt-1 sm:pt-2 space-y-4">
      {/* Compact Editorial Masthead Above the Fold */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end pb-3.5 hairline-b">
        <div className="lg:col-span-8 space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs text-[var(--accent-ember)] uppercase tracking-[0.14em] font-semibold">
            <span>Archival Proof Sheet</span>
            <span aria-hidden="true">·</span>
            <span className="text-[var(--status-sage)]">Level 3 Runtime Active</span>
          </div>

          <h1 className="font-serif text-[var(--text-main)] leading-[1.03]">
            Keep the grain. Winnow the slop.
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-dim)] measure leading-snug">
            Chaff inspects rendered UI against 72 rules, locks your brand identity, and blocks slow pull requests. Compare raw AI output against the authored <strong className="text-[var(--text-main)] font-semibold">Kestrel</strong> specimen below.
          </p>
        </div>

        <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-end gap-2.5 min-w-0">
          <div className="w-full lg:w-auto flex items-center justify-between gap-3 px-3 py-1.5 hairline bg-[var(--bg-surface)] font-mono text-xs">
            <code className="text-[var(--text-main)] font-semibold truncate">
              $ npx chaff init --level 3
            </code>
            <button
              type="button"
              onClick={copyInstallCmd}
              className="btn px-2.5 py-1 text-xs font-mono min-h-[44px] shrink-0"
              aria-label="Copy CLI init command"
            >
              {copiedCmd ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/playground" className="btn primary text-sm">
              Try Live Playground
            </Link>
            <Link href="/rules" className="btn text-sm">
              Explore 72 Rules
            </Link>
          </div>
        </div>
      </div>

      {/* Live Interactive Kestrel Transformation Stage */}
      <div className="hairline bg-[var(--bg-surface)] shadow-sm">
        {/* Stage Control Ribbon */}
        <div className="px-4 py-2.5 hairline-b bg-[var(--bg-inset)] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mr-1">
              Specimen: kestrel.run
            </span>
            <div
              role="group"
              aria-label="Transformation stage view mode"
              className="grid grid-cols-2 sm:inline-flex gap-1.5 sm:gap-0 sm:hairline sm:divide-x sm:divide-[var(--border-line)]"
            >
              {[
                { id: 'side', label: 'Side-by-Side' },
                { id: 'curtain', label: 'Curtain Wipe' },
                { id: 'before', label: `Before (${kestrelData.beforeScore})` },
                { id: 'after', label: `After (${kestrelData.afterScore})` },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleModeChange(m.id as StageViewMode)}
                  aria-pressed={viewMode === m.id}
                  className={`px-3 py-1.5 min-h-[44px] font-mono text-xs border sm:border-0 ${
                    viewMode === m.id
                      ? 'bg-[var(--text-main)] text-[var(--bg-surface)] border-[var(--text-main)] font-bold'
                      : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-line)] hover:bg-[var(--bg-surface-elevated)]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 min-w-0">
            {viewMode === 'curtain' && (
              <div className="flex items-center gap-3 flex-1 sm:flex-initial min-w-[200px]">
                <label
                  htmlFor="winnow-curtain-range"
                  className="font-mono text-xs text-[var(--text-dim)] whitespace-nowrap"
                >
                  Reveal Grain:
                </label>
                <input
                  id="winnow-curtain-range"
                  type="range"
                  min="0"
                  max="100"
                  value={100 - effectiveBeforePct}
                  onChange={(e) => {
                    const grainPct = parseInt(e.target.value, 10);
                    setWipePercent(100 - grainPct);
                    setWindBoost(0.35 + (grainPct / 100) * 0.65);
                  }}
                  aria-label="Reveal authored Kestrel grain versus AI slop"
                  className="w-full sm:w-32 min-h-[44px] cursor-pointer"
                />
                <span className="font-mono text-xs font-bold tabular-nums text-[var(--text-main)] w-10 text-right">
                  {100 - effectiveBeforePct}%
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={triggerWinnowSweep}
              className="btn violet text-xs font-mono"
            >
              Winnow Slop
            </button>
          </div>
        </div>

        {/* Stage Body */}
        <div
          ref={stageBodyRef}
          onPointerDown={(e) => {
            if (viewMode !== 'curtain') return;
            if ((e.target as HTMLElement).closest('button, a, input')) return;
            setIsDragging(true);
            updateCurtainFromClientX(e.clientX);
          }}
          onPointerMove={(e) => {
            if (viewMode === 'curtain' && isDragging) {
              updateCurtainFromClientX(e.clientX);
            }
          }}
          onPointerUp={() => setIsDragging(false)}
          onPointerLeave={() => setIsDragging(false)}
          className={`relative overflow-hidden select-none ${
            viewMode === 'curtain' ? 'cursor-ew-resize' : ''
          }`}
        >
          {viewMode === 'side' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-line)]">
              <div className="min-w-0">{renderBeforeSlop(true)}</div>
              <div className="min-w-0">{renderAfterCrafted(true)}</div>
            </div>
          ) : (
            <div className="relative grid grid-cols-1">
              {/* Layer A: Full Authored UI */}
              <div className="col-start-1 row-start-1 relative z-0">{renderAfterCrafted(false)}</div>

              {/* Layer B: Clipped Before Slop Overlay */}
              <div
                className="col-start-1 row-start-1 relative z-10"
                style={{
                  clipPath: `inset(0 ${100 - effectiveBeforePct}% 0 0)`,
                  pointerEvents: effectiveBeforePct > 12 ? 'auto' : 'none',
                }}
              >
                {renderBeforeSlop(false)}
              </div>

              {viewMode === 'curtain' && (
                <div
                  className="pointer-events-none absolute top-0 bottom-0 z-30 w-0.5 bg-[var(--accent-ember)]"
                  style={{ left: `${effectiveBeforePct}%` }}
                  aria-hidden="true"
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 px-2 py-1 bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shadow">
                    Drag · Winnow
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Layer C: Lazy WebGL2 Wind Shader Overlay or Tier 0 Poster Fallback */}
          {isPosterMode ? (
            <KestrelStagePoster
              wipePercent={effectiveBeforePct}
              stageMode={viewMode}
              reason="Tier 0 / Reduced Motion static SVG poster fallback"
            />
          ) : (
            <KestrelWebGLStage
              deviceTier={deviceTier}
              wipePercent={effectiveBeforePct}
              windBoost={windBoost}
              stageMode={viewMode}
              onWebGLUnavailable={handleWebGLUnavailable}
            />
          )}
        </div>

        {/* Bottom Tell Inspector & Level 3 Runtime Telemetry Strip */}
        <div className="hairline-t bg-[var(--bg-inset)] px-4 py-2.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs min-w-0">
            <span className="px-2 py-0.5 bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-bold">
              {activeTell.ruleId}
            </span>
            <span className="font-bold text-[var(--text-main)]">
              {activeTell.label}
            </span>
            <span className="text-[var(--text-dim)]">
              {activeTell.summary}
            </span>
            <span className="text-[var(--accent-ember)] font-bold">
              (-{activeTell.deduction} pts)
            </span>
            <Link
              href={`/rules#${activeTell.ruleId}`}
              className="underline font-semibold text-[var(--text-main)] hover:text-[var(--accent-ember)] inline-flex items-center min-h-[44px] min-w-[44px] px-1"
            >
              Read {activeTell.ruleId} Spec
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-[var(--text-dim)] shrink-0">
            <span>
              Score Delta:{' '}
              <strong className="text-[var(--status-sage)]">
                <RollingCounter value={kestrelData.afterScore - kestrelData.beforeScore} prefix="+" suffix=" pts" />
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Tier: <strong className="text-[var(--text-main)] uppercase">{isPosterMode ? 'poster' : deviceTier}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>DPR Cap: 1.5</span>
          </div>
        </div>
      </div>
    </section>
  );
}
