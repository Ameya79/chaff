'use client';

import React, { useState } from 'react';

export function GateClientSimulator() {
  const [simLevel, setSimLevel] = useState<2 | 3>(3);
  const [simJsSize, setSimJsSize] = useState<number>(102);
  const [simLazy3dKb, setSimLazy3dKb] = useState<number>(7);
  const [simCls, setSimCls] = useState<number>(0.02);
  const [simTouchTarget, setSimTouchTarget] = useState<number>(44);

  const baselineBudget = 170;
  const isBaselinePass = simJsSize <= baselineBudget;
  const isLazyPass = simLevel === 2 || simLazy3dKb <= 250;
  const isClsPass = simCls <= 0.1;
  const isTouchPass = simTouchTarget >= 44;
  const overallPass = isBaselinePass && isLazyPass && isClsPass && isTouchPass;

  return (
    <section className="scroll-sheet rounded-[10px] bg-[var(--bg-surface)] hairline-box p-6 sm:p-10 space-y-8 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent)] font-medium block">
            Simulator
          </span>
          <h2 className="font-display text-3xl text-[var(--text-main)]">
            PR Budget Check (Level {simLevel})
          </h2>
        </div>

        <div className="inline-flex rounded-[8px] bg-[var(--bg-surface-elevated)] border border-[var(--border-line)] p-1 gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setSimLevel(2)}
            aria-pressed={simLevel === 2}
            className={`px-4 py-2 rounded-[6px] min-h-[44px] min-w-[44px] font-mono text-xs transition-colors duration-200 ${
              simLevel === 2
                ? 'bg-[var(--text-main)] text-[var(--btn-primary-text)] font-medium'
                : 'text-[var(--text-dim)]'
            }`}
          >
            Level 2
          </button>
          <button
            type="button"
            onClick={() => setSimLevel(3)}
            aria-pressed={simLevel === 3}
            className={`px-4 py-2 rounded-[6px] min-h-[44px] min-w-[44px] font-mono text-xs transition-colors duration-200 ${
              simLevel === 3
                ? 'bg-[var(--text-main)] text-[var(--btn-primary-text)] font-medium'
                : 'text-[var(--text-dim)]'
            }`}
          >
            Level 3
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-5 font-mono text-xs min-w-0">
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline gap-2">
              <label htmlFor="simJs" className="text-[var(--text-main)]">
                Baseline JS: {simJsSize} KB
              </label>
              <span className={isBaselinePass ? 'text-[var(--status-pass)]' : 'text-[var(--status-fail)]'}>
                {isBaselinePass ? 'PASS' : 'FAIL > 170 KB'}
              </span>
            </div>
            <input
              id="simJs"
              type="range"
              min="50"
              max="260"
              value={simJsSize}
              onChange={(e) => setSimJsSize(parseInt(e.target.value, 10))}
              className="w-full min-h-[44px] text-base cursor-pointer"
            />
          </div>

          {simLevel === 3 && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline gap-2">
                <label htmlFor="simLazy3d" className="text-[var(--text-main)]">
                  Lazy 3D Chunk: {simLazy3dKb} KB
                </label>
                <span className={isLazyPass ? 'text-[var(--status-pass)]' : 'text-[var(--status-fail)]'}>
                  {isLazyPass ? 'PASS' : 'FAIL > 250 KB'}
                </span>
              </div>
              <input
                id="simLazy3d"
                type="range"
                min="2"
                max="340"
                value={simLazy3dKb}
                onChange={(e) => setSimLazy3dKb(parseInt(e.target.value, 10))}
                className="w-full min-h-[44px] text-base cursor-pointer"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline gap-2">
              <label htmlFor="simCls" className="text-[var(--text-main)]">
                CLS: {simCls.toFixed(2)}
              </label>
              <span className={isClsPass ? 'text-[var(--status-pass)]' : 'text-[var(--status-fail)]'}>
                {isClsPass ? 'PASS' : 'FAIL > 0.10'}
              </span>
            </div>
            <input
              id="simCls"
              type="range"
              min="0"
              max="30"
              value={Math.round(simCls * 100)}
              onChange={(e) => setSimCls(parseInt(e.target.value, 10) / 100)}
              className="w-full min-h-[44px] text-base cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline gap-2">
              <label htmlFor="simTouch" className="text-[var(--text-main)]">
                Touch Target: {simTouchTarget}px
              </label>
              <span className={isTouchPass ? 'text-[var(--status-pass)]' : 'text-[var(--status-fail)]'}>
                {isTouchPass ? 'PASS' : 'FAIL < 44px'}
              </span>
            </div>
            <input
              id="simTouch"
              type="range"
              min="24"
              max="60"
              value={simTouchTarget}
              onChange={(e) => setSimTouchTarget(parseInt(e.target.value, 10))}
              className="w-full min-h-[44px] text-base cursor-pointer"
            />
          </div>
        </div>

        <div className="lg:col-span-5 rounded-[8px] bg-[var(--bg-surface-elevated)] hairline-box p-6 space-y-4 font-mono text-xs min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="uppercase text-[var(--text-dim)]">CI Verdict</span>
            <span
              className={`px-3 py-1 rounded-[4px] uppercase font-semibold ${
                overallPass
                  ? 'bg-[var(--status-pass-soft)] text-[var(--status-pass)]'
                  : 'bg-[var(--status-fail-soft)] text-[var(--status-fail)]'
              }`}
            >
              {overallPass ? 'PASS' : 'BLOCKED'}
            </span>
          </div>

          <p className="font-sans text-sm text-[var(--text-dim)] leading-relaxed">
            {overallPass
              ? 'All budgets satisfied. Ready to merge.'
              : 'Exit code 1. Downgrade effect complexity, never loosen the budget.'}
          </p>
        </div>
      </div>
    </section>
  );
}
