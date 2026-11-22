'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import mockData from '../data/split-sheet-mock.json';

interface SlopTell {
  id: string;
  rule: string;
  name: string;
  deduction: number;
  description: string;
}

const TELLS: SlopTell[] = mockData.tells;

export function SplitSheetInspection() {
  const [activeTell, setActiveTell] = useState<string | null>('tell-1');
  const [viewMode, setViewMode] = useState<'split' | 'before' | 'after'>('split');

  const selectedTell = TELLS.find((t) => t.id === activeTell) || TELLS[0];
  const { mockSlop } = mockData;

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 hairline-b pb-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)]">
            <span>01.5 / SIGNATURE AUDIT REGISTER</span>
            <span>/</span>
            <span>BEFORE & AFTER SPLIT SHEET</span>
          </div>
          <h2 className="font-serif text-3xl text-[var(--text-main)] mt-1">
            The Split Sheet: Slop vs. Grain
          </h2>
          <p className="text-sm text-[var(--text-dim)] max-w-2xl mt-1">
            Inspect AI fingerprints circled in ember stroke annotations on the left, compared against the human-authored Winnowing Standard on the right.
          </p>
        </div>

        {/* View mode toggle for mobile & deep inspection */}
        <div className="flex items-center gap-1 p-1 rounded hairline bg-[var(--bg-surface)] font-mono text-xs">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded min-h-[44px] transition-colors ${
              viewMode === 'split' ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-semibold' : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'
            }`}
          >
            Split Sheet
          </button>
          <button
            type="button"
            onClick={() => setViewMode('before')}
            className={`px-3 py-1.5 rounded min-h-[44px] transition-colors ${
              viewMode === 'before' ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-semibold' : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'
            }`}
          >
            AI Slop
          </button>
          <button
            type="button"
            onClick={() => setViewMode('after')}
            className={`px-3 py-1.5 rounded min-h-[44px] transition-colors ${
              viewMode === 'after' ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-semibold' : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'
            }`}
          >
            Winnowed
          </button>
        </div>
      </div>

      {/* Main Split Sheet Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Sheet: Before Chaff (AI Slop with Ember Circles) */}
        {(viewMode === 'split' || viewMode === 'before') && (
          <div
            className={`${
              viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'
            } hairline p-6 sm:p-7 rounded-md bg-[#0f172a] text-slate-100 relative overflow-hidden flex flex-col justify-between space-y-6 shadow-sm`}
          >
            {/* Synthetic Glow Backdrop */}
            <div className={mockSlop.glowBackgroundClasses} />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header Tell Register */}
            <div className="flex justify-between items-baseline hairline-b border-slate-800 pb-3 relative z-10">
              <span className="font-mono text-xs text-rose-400 font-semibold tracking-wider uppercase">
                [BEFORE CHAFF] 5 SEVERE AI TELLS DETECTED
              </span>
              <span className="font-mono text-xs text-slate-400">Score: 48 / 100</span>
            </div>

            {/* Live Slop Elements with SVG Ember Callout Rings */}
            <div className="space-y-6 text-center relative z-10 py-2">
              {/* Tell 1 & 2: Purple Glow & Gradient Text Clipping */}
              <button
                type="button"
                className={`w-full block relative p-3 rounded border transition-colors cursor-pointer text-center ${
                  activeTell === 'tell-2' ? 'border-rose-500 bg-rose-950/30' : 'border-transparent hover:border-slate-700'
                }`}
                onClick={() => setActiveTell('tell-2')}
              >
                {/* Ember Annotation SVG Circle */}
                <svg
                  className="absolute -inset-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)] pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 5,20 Q 50,0 95,20 Q 100,50 95,80 Q 50,100 5,80 Q 0,50 5,20 Z"
                    fill="none"
                    stroke="#e11d48"
                    strokeWidth="2.5"
                    strokeDasharray="300"
                    strokeDashoffset="0"
                    opacity="0.85"
                  />
                </svg>
                <div className="absolute -top-3 left-4 font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-600 text-white">
                  {mockSlop.badgeGradient}
                </div>

                <span className={`block ${mockSlop.gradientClasses}`}>
                  {mockSlop.gradientHeadline}
                </span>
              </button>

              {/* Tell 4: Buzzword Salad */}
              <button
                type="button"
                className={`w-full block relative p-3 rounded border transition-colors cursor-pointer text-center ${
                  activeTell === 'tell-4' ? 'border-amber-500 bg-amber-950/30' : 'border-transparent hover:border-slate-700'
                }`}
                onClick={() => setActiveTell('tell-4')}
              >
                <div className="absolute -top-3 left-4 font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-600 text-white">
                  {mockSlop.badgeBuzzwords}
                </div>
                <span className="block text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  {mockSlop.buzzwordParagraph}
                </span>
              </button>

              {/* Tell 3: Centered 3-Card Grid */}
              <button
                type="button"
                className={`w-full block relative p-3 rounded border transition-colors cursor-pointer text-center ${
                  activeTell === 'tell-3' ? 'border-rose-500 bg-rose-950/30' : 'border-transparent hover:border-slate-700'
                }`}
                onClick={() => setActiveTell('tell-3')}
              >
                <div className="absolute -top-3 left-4 font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-600 text-white">
                  {mockSlop.badgeCards}
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
                  {mockSlop.cards.map((cardTitle) => (
                    <span key={cardTitle} className="block p-2.5 rounded bg-slate-800/80 border border-slate-700">
                      {cardTitle}
                    </span>
                  ))}
                </div>
              </button>

              {/* Tell 5: Synthetic Metrics */}
              <button
                type="button"
                className={`w-full block relative p-3 rounded border transition-colors cursor-pointer text-center ${
                  activeTell === 'tell-5' ? 'border-amber-500 bg-amber-950/30' : 'border-transparent hover:border-slate-700'
                }`}
                onClick={() => setActiveTell('tell-5')}
              >
                <div className="absolute -top-3 left-4 font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-600 text-white">
                  {mockSlop.badgeMetrics}
                </div>
                <div className="flex justify-center gap-6 font-mono text-xs text-slate-300">
                  <span>{mockSlop.metricUsers}</span>
                  <span>•</span>
                  <span>{mockSlop.metricUptime}</span>
                </div>
              </button>
            </div>

            {/* Bottom Status Callout */}
            <div className="hairline-t border-slate-800 pt-3 text-xs font-mono text-slate-400 flex justify-between items-center relative z-10">
              <span>Status: <strong className="text-rose-400">Rejected by chaff gate</strong></span>
              <span>-42 Score Penalty</span>
            </div>
          </div>
        )}

        {/* Right Sheet: After Chaff (Keep the Grain) */}
        {(viewMode === 'split' || viewMode === 'after') && (
          <div
            className={`${
              viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'
            } hairline p-6 sm:p-7 rounded-md bg-[var(--bg-surface)] text-[var(--text-main)] flex flex-col justify-between space-y-6 shadow-sm`}
          >
            {/* Header Register */}
            <div className="flex justify-between items-baseline hairline-b pb-3">
              <span className="font-mono text-xs text-[var(--status-sage)] font-semibold tracking-wider uppercase">
                [AFTER CHAFF] WINNOWING STANDARD APPLIED
              </span>
              <span className="font-mono text-xs text-[var(--status-sage)] font-bold">
                Score: 96 / 100 (+48 pts)
              </span>
            </div>

            {/* Authored Composition */}
            <div className="space-y-5 py-2">
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] px-2.5 py-0.5 hairline rounded bg-[var(--bg-canvas)]">
                <span>01</span>
                <span>/</span>
                <span>Execution Router</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif text-[var(--text-main)] tracking-tight">
                Settle multi-venue spot orders in 12 milliseconds.
              </h3>

              <p className="text-sm text-[var(--text-dim)] leading-relaxed max-w-md">
                Direct market gateway with automated smart order routing, pre-trade risk controls, and sub-millisecond execution logs.
              </p>

              {/* Asymmetric Ruled Ledger */}
              <div className="hairline p-4 rounded bg-[var(--bg-canvas)] space-y-3 font-mono text-xs">
                <div className="flex justify-between text-[var(--text-dim)] uppercase text-[10px]">
                  <span>Telemetry Metric</span>
                  <span>Audited Value</span>
                </div>
                <div className="flex justify-between items-baseline hairline-t pt-2">
                  <span className="text-[var(--text-dim)]">Median Latency</span>
                  <span className="text-base font-bold text-[var(--text-main)] tabular-nums">11.8 ms</span>
                </div>
                <div className="flex justify-between items-baseline hairline-t pt-2">
                  <span className="text-[var(--text-dim)]">Order Fill Rate</span>
                  <span className="text-base font-bold text-[var(--status-sage)] tabular-nums">99.98%</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Link href="/gallery" className="btn primary text-xs">
                  Inspect Dossier
                </Link>
                <span className="font-mono text-xs text-[var(--status-sage)]">
                  Brand Violet Waiver Preserved
                </span>
              </div>
            </div>

            {/* Bottom Status Callout */}
            <div className="hairline-t pt-3 text-xs font-mono text-[var(--text-dim)] flex justify-between items-center">
              <span>Status: <strong className="text-[var(--status-sage)]">Passed CI Gate</strong></span>
              <span>Identity Lock: Confirmed</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Tell Inspector Ledger */}
      <div className="hairline p-4 rounded-md bg-[var(--bg-surface)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[var(--accent-ember)] px-2 py-0.5 hairline rounded bg-[var(--bg-canvas)]">
            {selectedTell.rule}
          </span>
          <span className="font-bold text-[var(--text-main)]">{selectedTell.name}</span>
          <span className="text-[var(--text-dim)] hidden md:inline">— {selectedTell.description}</span>
        </div>
        <div className="flex items-center gap-4 text-[var(--accent-ember)]">
          <span>Deduction: -{selectedTell.deduction} pts</span>
          <Link href={`/rules#${selectedTell.rule}`} className="underline text-[var(--text-main)] hover:text-[var(--accent-ember)]">
            View Rule Remediation →
          </Link>
        </div>
      </div>
    </section>
  );
}
