'use client';

import React, { useState } from 'react';

export function GateClientSimulator() {
  const [simLevel, setSimLevel] = useState<2 | 3>(3);
  const [simJsSize, setSimJsSize] = useState<number>(142);
  const [simLazy3dKb, setSimLazy3dKb] = useState<number>(6);
  const [simCls, setSimCls] = useState<number>(0.02);
  const [simTouchTarget, setSimTouchTarget] = useState<number>(44);

  const baselineBudget = 170;
  const isBaselinePass = simJsSize <= baselineBudget;
  const isLazyPass = simLevel === 2 || simLazy3dKb <= 250;
  const isClsPass = simCls <= 0.1;
  const isTouchPass = simTouchTarget >= 44;
  const overallPass = isBaselinePass && isLazyPass && isClsPass && isTouchPass;

  return (
    <section className="hairline bg-[var(--bg-surface)] p-5 sm:p-6 space-y-6 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 hairline-b">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent-ember)] font-bold block">
            Interactive Threshold Simulator
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-main)]">
            Test Pull Request Budgets Against Level {simLevel}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-dim)] max-w-[60ch]">
            Drag metrics to observe how <code className="mono">chaff gate</code> accepts or rejects pull requests in CI.
          </p>
        </div>

        <div className="inline-flex hairline divide-x divide-[var(--border-line)] bg-[var(--bg-canvas)] shrink-0">
          <button
            type="button"
            onClick={() => setSimLevel(2)}
            aria-pressed={simLevel === 2}
            className={`px-3.5 py-2 min-h-[44px] font-mono text-xs ${
              simLevel === 2
                ? 'bg-[var(--text-main)] text-[var(--bg-surface)] font-bold'
                : 'text-[var(--text-main)]'
            }`}
          >
            Level 2 (170 KB)
          </button>
          <button
            type="button"
            onClick={() => setSimLevel(3)}
            aria-pressed={simLevel === 3}
            className={`px-3.5 py-2 min-h-[44px] font-mono text-xs ${
              simLevel === 3
                ? 'bg-[var(--text-main)] text-[var(--bg-surface)] font-bold'
                : 'text-[var(--text-main)]'
            }`}
          >
            Level 3 (+250 KB Lazy)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-5 font-mono text-xs min-w-0">
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline gap-2">
              <label htmlFor="simJs" className="text-[var(--text-main)] font-semibold">
                Baseline JS: {simJsSize} KB
              </label>
              <span className={isBaselinePass ? 'text-[var(--status-sage)] font-bold' : 'text-[var(--accent-ember)] font-bold'}>
                {isBaselinePass ? 'PASS (<= 170 KB)' : 'FAIL (> 170 KB)'}
              </span>
            </div>
            <input
              id="simJs"
              type="range"
              min="50"
              max="260"
              value={simJsSize}
              onChange={(e) => setSimJsSize(parseInt(e.target.value, 10))}
              className="w-full min-h-[44px] cursor-pointer"
            />
          </div>

          {simLevel === 3 && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline gap-2">
                <label htmlFor="simLazy3d" className="text-[var(--text-main)] font-semibold">
                  Lazy 3D / WebGL Chunk: {simLazy3dKb} KB
                </label>
                <span className={isLazyPass ? 'text-[var(--status-sage)] font-bold' : 'text-[var(--accent-ember)] font-bold'}>
                  {isLazyPass ? 'PASS (<= 250 KB)' : 'FAIL (> 250 KB)'}
                </span>
              </div>
              <input
                id="simLazy3d"
                type="range"
                min="2"
                max="340"
                value={simLazy3dKb}
                onChange={(e) => setSimLazy3dKb(parseInt(e.target.value, 10))}
                className="w-full min-h-[44px] cursor-pointer"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline gap-2">
              <label htmlFor="simCls" className="text-[var(--text-main)] font-semibold">
                Cumulative Layout Shift (CLS): {simCls.toFixed(2)}
              </label>
              <span className={isClsPass ? 'text-[var(--status-sage)] font-bold' : 'text-[var(--accent-ember)] font-bold'}>
                {isClsPass ? 'PASS (<= 0.10)' : 'FAIL (> 0.10)'}
              </span>
            </div>
            <input
              id="simCls"
              type="range"
              min="0"
              max="30"
              value={Math.round(simCls * 100)}
              onChange={(e) => setSimCls(parseInt(e.target.value, 10) / 100)}
              className="w-full min-h-[44px] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline gap-2">
              <label htmlFor="simTouch" className="text-[var(--text-main)] font-semibold">
                Minimum Touch Target: {simTouchTarget}px
              </label>
              <span className={isTouchPass ? 'text-[var(--status-sage)] font-bold' : 'text-[var(--accent-ember)] font-bold'}>
                {isTouchPass ? 'PASS (>= 44px)' : 'FAIL (< 44px)'}
              </span>
            </div>
            <input
              id="simTouch"
              type="range"
              min="24"
              max="60"
              value={simTouchTarget}
              onChange={(e) => setSimTouchTarget(parseInt(e.target.value, 10))}
              className="w-full min-h-[44px] cursor-pointer"
            />
          </div>
        </div>

        <div className="lg:col-span-5 p-5 hairline bg-[var(--bg-inset)] space-y-4 font-mono text-xs min-w-0">
          <div className="flex items-center justify-between gap-2 pb-3 hairline-b">
            <span className="uppercase text-[var(--text-dim)] font-semibold">
              Simulated CI Verdict
            </span>
            <span
              className={`px-2.5 py-1 font-bold uppercase ${
                overallPass
                  ? 'bg-[var(--status-sage-soft)] text-[var(--status-sage)]'
                  : 'bg-[var(--accent-ember-soft)] text-[var(--accent-ember)]'
              }`}
            >
              {overallPass ? 'Gate Pass' : 'PR Blocked'}
            </span>
          </div>

          <p className="font-sans text-sm text-[var(--text-dim)] leading-relaxed">
            {overallPass
              ? 'All simulated thresholds satisfy Chaff budgets. Pull request is eligible to merge.'
              : 'Gate violation detected. Chaff exits with code 1 and instructs the agent to downgrade effect complexity, never loosen the budget.'}
          </p>

          <div className="pt-3 hairline-t text-[var(--text-main)] font-semibold">
            Hard Rule: Downgrade effect complexity, never loosen the budget.
          </div>
        </div>
      </div>
    </section>
  );
}
