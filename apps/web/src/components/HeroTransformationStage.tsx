'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import kestrelData from '../data/kestrel-stage.json';
import { RollingCounter } from './RollingCounter';

type StageViewMode = 'curtain' | 'before' | 'after';

export function HeroTransformationStage() {
  const [viewMode, setViewMode] = useState<StageViewMode>('curtain');
  const [wipePercent, setWipePercent] = useState<number>(43);
  const [activeRegionId, setActiveRegionId] = useState<string>('iad');
  const [activeTellId, setActiveTellId] = useState<string>('tell-gradient');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const sweepFrameRef = useRef<number | null>(null);
  const stageBodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (sweepFrameRef.current) cancelAnimationFrame(sweepFrameRef.current);
    };
  }, []);

  const cancelSweep = () => {
    if (sweepFrameRef.current) {
      cancelAnimationFrame(sweepFrameRef.current);
      sweepFrameRef.current = null;
    }
  };

  const handleModeChange = (mode: StageViewMode) => {
    cancelSweep();
    setViewMode(mode);
    if (mode === 'before') setWipePercent(100);
    else if (mode === 'after') setWipePercent(0);
    else setWipePercent(43);
  };

  const triggerWinnow = () => {
    cancelSweep();
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setViewMode('after');
      setWipePercent(0);
      return;
    }

    setViewMode('curtain');
    setWipePercent(96);

    const duration = 720;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setWipePercent(Math.round(96 * (1 - ease)));
      if (p < 1) {
        sweepFrameRef.current = requestAnimationFrame(step);
      } else {
        sweepFrameRef.current = null;
        setViewMode('after');
        setWipePercent(0);
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
  };

  const activeRegion =
    kestrelData.regions.find((r) => r.id === activeRegionId) ||
    kestrelData.regions[0];

  const activeTell =
    kestrelData.tells.find((t) => t.id === activeTellId) ||
    kestrelData.tells[0];

  const effectiveBeforePct =
    viewMode === 'before' ? 100 : viewMode === 'after' ? 0 : wipePercent;

  const pinClass = (id: string) =>
    `px-2.5 py-1 rounded-full font-mono text-[10px] tracking-wider transition-colors ${
      activeTellId === id
        ? 'bg-[#F2713A] text-[#09090B] font-bold'
        : 'bg-rose-950/90 text-rose-200 border border-rose-400/50 hover:border-[#F2713A]'
    }`;

  const renderBeforeSlop = () => (
    <div className="slop-specimen-shell relative rounded-2xl p-6 sm:p-10 min-h-[430px] flex flex-col justify-between gap-5">
      <div className="slop-orb-purple" aria-hidden="true" />
      <div className="slop-orb-cyan" aria-hidden="true" />

      {/* Top Tag + Left-Anchored Surgical Pin UI-001 (visible in Split Wipe) */}
      <div className="relative z-10 flex items-center justify-start gap-3">
        <span className="font-mono text-xs text-rose-300">
          Before · {kestrelData.beforeScore}/100
        </span>
        <button
          type="button"
          onClick={() => setActiveTellId('tell-glow')}
          aria-label="Inspect UI-001 Glow Orbs violation"
          className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-1"
        >
          <span className={pinClass('tell-glow')}>UI-001</span>
        </button>
      </div>

      {/* Centered Slop Template + Left-Visible Pins UI-002 & UI-009 */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4 my-auto max-w-2xl mx-auto w-full">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="slop-pill-badge px-3 py-1 rounded-full text-[11px] font-mono">
            {kestrelData.slop.pill}
          </span>
        </div>

        <div className="relative w-full">
          <div className="slop-headline-gradient font-sans font-extrabold tracking-tight leading-[1.1] text-2xl sm:text-4xl">
            {kestrelData.slop.headline}
          </div>
          <div className="flex justify-start sm:pl-4 pt-1">
            <button
              type="button"
              onClick={() => setActiveTellId('tell-gradient')}
              aria-label="Inspect UI-002 Gradient Text violation"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-1"
            >
              <span className={pinClass('tell-gradient')}>UI-002</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
          {kestrelData.slop.subhead}
        </p>

        <div className="flex flex-wrap justify-center gap-2.5">
          <span className="slop-cta-gradient px-4 py-2 rounded-full text-white text-xs font-semibold">
            {kestrelData.slop.primaryCta}
          </span>
          <span className="px-4 py-2 rounded-full border border-slate-600 text-slate-200 text-xs font-semibold">
            {kestrelData.slop.secondaryCta}
          </span>
        </div>

        <div className="relative w-full space-y-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
            {kestrelData.slop.cards.map((card) => (
              <div key={card.title} className="slop-glass-tile p-3">
                <span className="block font-sans text-xs font-bold text-white">
                  {card.title}
                </span>
                <span className="block text-[11px] text-slate-300 mt-0.5 leading-snug">
                  {card.body}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => setActiveTellId('tell-grid')}
              aria-label="Inspect UI-009 Centered 3-Card Grid violation"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-1"
            >
              <span className={pinClass('tell-grid')}>UI-009</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex justify-start gap-6 font-mono text-xs text-slate-300">
        <span>5 tells</span>
        <span className="text-rose-300 font-semibold">FAIL</span>
      </div>
    </div>
  );

  const renderAfterCrafted = () => (
    <div className="rounded-2xl bg-[var(--bg-surface)] text-[var(--text-main)] p-6 sm:p-10 min-h-[430px] flex flex-col justify-between gap-7">
      {/* Kestrel Product Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg font-mono text-xs font-bold text-white shrink-0"
            style={{ backgroundColor: '#6D28D9' }}
          >
            K
          </span>
          <div className="flex flex-wrap items-center gap-2.5 min-w-0">
            <span className="font-serif text-xl text-[var(--text-main)]">
              Kestrel
            </span>
            <span
              className="font-mono text-[11px] px-2.5 py-0.5 rounded-full whitespace-nowrap"
              style={{
                backgroundColor: 'var(--brand-violet-soft)',
                color: 'var(--brand-violet)',
              }}
            >
              #6D28D9 Locked
            </span>
          </div>
        </div>

        {/* Borderless Region Pills */}
        <div
          role="group"
          aria-label="Kestrel routing region"
          className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-surface-elevated)] p-1"
        >
          {kestrelData.regions.map((reg) => {
            const selected = reg.id === activeRegion.id;
            const shortCode = reg.id.toUpperCase();
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => setActiveRegionId(reg.id)}
                aria-pressed={selected}
                aria-label={reg.code}
                className={`px-3.5 py-1.5 rounded-full min-h-[44px] min-w-[44px] font-mono text-xs transition-colors ${
                  selected
                    ? 'text-white font-semibold'
                    : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'
                }`}
                style={selected ? { backgroundColor: '#6D28D9' } : undefined}
              >
                {shortCode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Asymmetric Telemetry Stage (Zero Inner Border Cages) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
        <div className="lg:col-span-5 space-y-5 min-w-0">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--status-sage)] block">
              After Chaff · {kestrelData.afterScore}/100
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[var(--text-main)] leading-tight">
              Route spot orders across 14 venues.
            </h3>
          </div>

          <p className="text-sm text-[var(--text-dim)] max-w-[36ch] leading-relaxed">
            Deterministic clearing telemetry in {activeRegion.code}.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={triggerWinnow}
              className="btn violet text-xs"
            >
              Deploy Route
            </button>
            <Link
              href="/gallery?id=saas-landing"
              className="btn ghost text-xs text-[var(--text-dim)] hover:text-[var(--text-main)]"
            >
              Case Study &rarr;
            </Link>
          </div>
        </div>

        {/* Right Half: Monumental Display Metric + Borderless Hairline Waterfall */}
        <div className="lg:col-span-7 lg:pl-14 space-y-5 min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-4 hairline-b pb-4">
            <div className="font-serif text-5xl sm:text-6xl text-[var(--text-main)] tracking-tight tabular-nums leading-none">
              {activeRegion.medianMs}
            </div>
            <div className="font-mono text-xs text-[var(--text-dim)] tabular-nums">
              p99 {activeRegion.p99Ms} ·{' '}
              <span className="text-[var(--status-sage)] font-medium">
                {activeRegion.fillRate} fill
              </span>
            </div>
          </div>

          <div className="space-y-3 min-w-0">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--text-dim)] uppercase tracking-wider">
                Venue Waterfall
              </span>
              <span className="text-[var(--brand-violet)]">
                {activeRegion.code}
              </span>
            </div>

            <div className="space-y-3">
              {activeRegion.venues.map((v) => (
                <div key={v.name} className="space-y-1">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-[var(--text-main)] truncate">
                      {v.name}
                    </span>
                    <span className="text-[var(--text-dim)] tabular-nums shrink-0">
                      {v.ms}
                    </span>
                  </div>
                  <svg
                    viewBox="0 0 360 8"
                    width="360"
                    height="8"
                    className="w-full h-2 block"
                    aria-hidden="true"
                  >
                    <rect
                      x="0"
                      y="1"
                      width="360"
                      height="6"
                      rx="3"
                      fill="var(--bg-surface-elevated)"
                    />
                    <rect
                      x={(v.offsetPct / 100) * 360}
                      y="1"
                      width={Math.max(14, (v.widthPct / 100) * 360)}
                      height="6"
                      rx="3"
                      fill={v.primary ? '#6D28D9' : 'var(--status-sage)'}
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[var(--text-dim)] hairline-t pt-4">
        <span>Identity Lock (#6D28D9)</span>
        <span className="text-[var(--status-sage)] font-medium">
          98 / 100 · PASS
        </span>
      </div>
    </div>
  );

  return (
    <section className="py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
      {/* Header + Floating Mode Selector */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-ember)] block">
            Specimen · kestrel.run
          </span>
          <h2 className="font-serif text-[var(--text-main)]">
            Slop in. Craft out.
          </h2>
          <p className="text-sm text-[var(--text-dim)]">
            42/100 template scrubbed to 98/100 while preserving locked #6D28D9 violet.
          </p>
        </div>

        {/* Borderless Tonal Segmented Mode Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            role="group"
            aria-label="Transformation stage view mode"
            className="inline-flex flex-wrap items-center gap-1 rounded-full bg-[var(--bg-surface)] p-1"
          >
            {[
              { id: 'before', label: 'Before' },
              { id: 'curtain', label: 'Split Wipe' },
              { id: 'after', label: 'After' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleModeChange(m.id as StageViewMode)}
                aria-pressed={viewMode === m.id}
                className={`px-4 py-2 rounded-full min-h-[44px] min-w-[44px] font-mono text-xs transition-colors ${
                  viewMode === m.id
                    ? 'bg-[var(--text-main)] text-[var(--bg-canvas)] font-semibold'
                    : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={triggerWinnow}
            className="btn violet text-xs font-mono"
          >
            Winnow
          </button>
        </div>
      </div>

      {/* Edge-Aligned Comparison Stage (Zero Outer Cage) */}
      <div className="space-y-3">
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
          className={`relative rounded-2xl overflow-hidden select-none ${
            viewMode === 'curtain' ? 'cursor-ew-resize' : ''
          }`}
        >
          <div className="relative grid grid-cols-1">
            <div className="col-start-1 row-start-1 relative z-0">
              {renderAfterCrafted()}
            </div>

            <div
              className="col-start-1 row-start-1 relative z-10"
              style={{
                clipPath: `inset(0 ${100 - effectiveBeforePct}% 0 0)`,
                pointerEvents: effectiveBeforePct > 12 ? 'auto' : 'none',
              }}
            >
              {renderBeforeSlop()}
            </div>

            {viewMode === 'curtain' && (
              <div
                className="pointer-events-none absolute top-0 bottom-0 z-20 w-[2px] bg-[var(--accent-ember)]"
                style={{ left: `${effectiveBeforePct}%` }}
                aria-hidden="true"
              >
                <div className="absolute top-6 -translate-x-1/2 px-2.5 py-1 rounded-full bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                  Wipe
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Clean Single-Line Tell & Delta Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <span className="text-[var(--accent-ember)] font-semibold">
              {activeTell.ruleId}
            </span>
            <span className="text-[var(--text-main)]">{activeTell.label}</span>
            <span className="text-[var(--accent-ember)]">(-{activeTell.deduction} pts)</span>
            <Link
              href={`/rules#${activeTell.ruleId}`}
              className="text-[var(--text-dim)] hover:text-[var(--text-main)] underline inline-flex items-center min-h-[44px] min-w-[44px] px-1"
            >
              Spec &rarr;
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[var(--text-dim)] shrink-0">
            {viewMode === 'curtain' && (
              <label className="inline-flex items-center gap-2.5 cursor-pointer">
                <span className="sr-only">Split wipe position</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={100 - effectiveBeforePct}
                  onChange={(e) => {
                    const grain = parseInt(e.target.value, 10);
                    setWipePercent(100 - grain);
                  }}
                  aria-label="Reveal authored Kestrel craft versus AI slop"
                  className="w-28 min-h-[44px] text-base cursor-pointer"
                />
                <span className="tabular-nums text-[var(--text-main)] w-9 text-right">
                  {100 - effectiveBeforePct}%
                </span>
              </label>
            )}
            <span>
              Delta{' '}
              <strong className="text-[var(--status-sage)]">
                <RollingCounter
                  value={kestrelData.afterScore - kestrelData.beforeScore}
                  prefix="+"
                  suffix=" pts"
                />
              </strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
