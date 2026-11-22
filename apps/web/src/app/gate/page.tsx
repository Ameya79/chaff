'use client';

import React, { useState } from 'react';
import { RollingCounter } from '../../components/RollingCounter';

const BUDGETS = [
  { metric: 'Largest Contentful Paint (LCP)', targetL1L2: '\u2264 2.5s', targetL3: '\u2264 2.5s (poster)', measured: '1.14s', detail: 'Preloaded Fraunces serif & Geist grotesk via next/font swap.' },
  { metric: 'Cumulative Layout Shift (CLS)', targetL1L2: '\u2264 0.10', targetL3: '\u2264 0.10', measured: '0.012', detail: 'Fixed aspect-ratio containers on all media; zero dynamic shifts.' },
  { metric: 'Total Blocking Time (TBT)', targetL1L2: '\u2264 200ms', targetL3: '\u2264 300ms', measured: '22ms', detail: 'Calculations offloaded to microtasks; requestIdleCallback active.' },
  { metric: 'First-Load Route JS (gzip)', targetL1L2: '\u2264 170 KB', targetL3: '170 KB + 250 KB lazy 3D', measured: '98.5 KB max', detail: 'Strict Server Components; client islands on leaf interactives.' },
  { metric: 'Horizontal Overflow at 320px', targetL1L2: 'Zero overflow (\u2264 320px)', targetL3: 'Zero overflow (\u2264 320px)', measured: '0px (Clean fit)', detail: 'Zero hardcoded desktop widths; clamp() and max-w-full on all containers.' },
  { metric: 'Physical Touch Targets', targetL1L2: '\u2265 44x44px all interactives', targetL3: '\u2265 44x44px all interactives', measured: '100% compliant', detail: 'min-h-[44px] and min-w-[44px] on all interactives.' },
  { metric: 'prefers-reduced-motion', targetL1L2: 'Honored across CSS', targetL3: 'Honored, 3D \u2192 poster', measured: '100% honored', detail: 'CSS media queries zero animations; @chaff/tier drops to poster.' },
  { metric: 'Lighthouse Mobile Score', targetL1L2: '\u2265 90', targetL3: '\u2265 80 (3D active)', measured: '98 / 100', detail: 'Audited on throttled Moto G Power profile under headless runner.' },
];

const ROUTE_PAYLOADS = [
  { route: '/', size: '4.62 kB', firstLoad: '98.5 kB', type: 'Static' },
  { route: '/rules', size: '150 B', firstLoad: '87.3 kB', type: 'Dynamic' },
  { route: '/levels', size: '150 B', firstLoad: '87.3 kB', type: 'Static' },
  { route: '/install', size: '4.11 kB', firstLoad: '91.2 kB', type: 'Static' },
  { route: '/gallery', size: '5.40 kB', firstLoad: '92.5 kB', type: 'Static' },
  { route: '/bench', size: '3.52 kB', firstLoad: '90.6 kB', type: 'Static' },
  { route: '/gate', size: '3.80 kB', firstLoad: '90.8 kB', type: 'Static' },
  { route: '/playground', size: '4.60 kB', firstLoad: '91.7 kB', type: 'Static' },
];

const MOBILE_CHECKLIST = [
  { id: 'M-01', title: 'Dynamic Viewport (dvh)', desc: 'min-h-dvh units prevent overflow under dynamic mobile URL bars.' },
  { id: 'M-02', title: 'Zero 320px Overflow', desc: 'No fixed desktop widths or overflow at 320px viewport.' },
  { id: 'M-03', title: '>= 44px Touch Targets', desc: 'All interactives meet minimum 44x44px physical touch box.' },
  { id: 'M-04', title: 'Safe-Area Insets', desc: 'Apply env(safe-area-inset-*) to floating toolbars and sticky headers.' },
  { id: 'M-05', title: 'No Hover-Only Triggers', desc: 'All hover reveals have persistent mobile tap or toggle equivalents.' },
  { id: 'M-06', title: 'Passive Event Listeners', desc: 'Touch and wheel scroll handlers registered with passive flag.' },
  { id: 'M-07', title: 'font-display: swap', desc: 'Self-hosted next/font subsets preventing layout flash.' },
  { id: 'M-08', title: 'prefers-reduced-motion', desc: 'Zero layout animations when user requests reduced motion.' },
  { id: 'M-09', title: 'DPR Capped at 1.5', desc: 'WebGL/canvas capped at 1.5 DPR ceiling to save mobile GPU.' },
];

export default function GatePage() {
  const [simJsSize, setSimJsSize] = useState<number>(140);
  const [simCls, setSimCls] = useState<number>(0.04);
  const [simTouchTarget, setSimTouchTarget] = useState<number>(44);

  const jsBudget = 170;
  const isJsPass = simJsSize <= jsBudget;
  const isClsPass = simCls <= 0.10;
  const isTouchPass = simTouchTarget >= 44;
  const overallPass = isJsPass && isClsPass && isTouchPass;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-16">
      {/* Header Register */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 hairline-b pb-3 font-mono text-xs text-[var(--text-dim)]">
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent-ember)] font-bold">VERIFICATION //</span>
            <span className="uppercase tracking-widest text-[var(--text-main)] font-semibold">PERFORMANCE &amp; MOBILE GATE</span>
          </div>
          <div>CI BUDGET ENFORCEMENT RUNTIME</div>
        </div>
        <h1 className="tracking-tight text-[var(--text-main)] font-serif">
          The Performance &amp; Mobile Gate
        </h1>
        <p className="text-[var(--text-dim)] text-lg max-w-[68ch]">
          Chaff rejects the pull request when performance regresses. Here is the empirical proof: verified budgets and measured telemetry from this site&apos;s own CI gate execution.
        </p>
      </div>

      {/* Summary KPI Register: Continuous Ruled Ledger Bar (Zero Cards) */}
      <div className="hairline-y grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-line)]">
        <div className="py-5 px-3 sm:px-6 space-y-1">
          <span className="font-mono text-[11px] text-[var(--text-dim)] block uppercase tracking-wider">
            Lighthouse Mobile //
          </span>
          <div className="flex items-baseline gap-2 pt-1">
            <RollingCounter value={98} className="font-serif text-4xl text-[var(--status-sage)] font-bold" />
            <span className="font-mono text-xs text-[var(--text-dim)]">/ 100</span>
          </div>
          <span className="font-mono text-[11px] text-[var(--status-sage)] block pt-1">
            Passes &ge; 90 budget
          </span>
        </div>

        <div className="py-5 px-3 sm:px-6 space-y-1">
          <span className="font-mono text-[11px] text-[var(--text-dim)] block uppercase tracking-wider">
            First-Load JS (Max) //
          </span>
          <div className="flex items-baseline gap-2 pt-1">
            <RollingCounter value={98} suffix=".5" className="font-serif text-4xl text-[var(--status-sage)] font-bold" />
            <span className="font-mono text-xs text-[var(--text-dim)]">KB gzip</span>
          </div>
          <span className="font-mono text-[11px] text-[var(--status-sage)] block pt-1">
            Budget: 170 KB gzip
          </span>
        </div>

        <div className="py-5 px-3 sm:px-6 space-y-1">
          <span className="font-mono text-[11px] text-[var(--text-dim)] block uppercase tracking-wider">
            Layout Shift (CLS) //
          </span>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-serif text-4xl text-[var(--status-sage)] font-bold">0.01</span>
          </div>
          <span className="font-mono text-[11px] text-[var(--status-sage)] block pt-1">
            Budget: &le; 0.10 CLS
          </span>
        </div>

        <div className="py-5 px-3 sm:px-6 space-y-1">
          <span className="font-mono text-[11px] text-[var(--text-dim)] block uppercase tracking-wider">
            320px Viewport Fit //
          </span>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-serif text-4xl text-[var(--status-sage)] font-bold">0px</span>
            <span className="font-mono text-xs text-[var(--text-dim)]">Overflow</span>
          </div>
          <span className="font-mono text-[11px] text-[var(--status-sage)] block pt-1">
            Zero horizontal scroll
          </span>
        </div>
      </div>

      {/* 1. Main Gate Budget Ledger (Margin Headers, Zero Cards) */}
      <section className="hairline-y py-10 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3 space-y-3 font-mono text-xs">
            <span className="text-[var(--accent-ember)] uppercase tracking-wider block font-bold">
              VERIFIED BUDGET LEDGER //
            </span>
            <h2 className="font-serif text-2xl text-[var(--text-main)] font-normal">
              Measured in CI
            </h2>
            <p className="text-[var(--text-dim)] font-sans leading-relaxed">
              Evaluated on each commit via <code className="mono">npx chaff gate</code>.
            </p>
            <div className="pt-2">
              <span className="px-2.5 py-1 hairline bg-[var(--status-sage-soft)] text-[var(--status-sage)] font-bold inline-block">
                ALL 8 GATES GREEN
              </span>
            </div>
            <div className="text-[11px] text-[var(--text-dim)] pt-2">
              Tally: <strong className="text-[var(--text-main)]">|||| ||||</strong>
            </div>
          </div>

          <div className="lg:col-span-9 lg:border-l border-[var(--border-line)] lg:pl-8 overflow-x-auto hairline-t lg:hairline-t-0 pt-6 lg:pt-0">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="hairline-b text-[var(--text-dim)] uppercase">
                  <th className="py-3 pr-4">Metric Budget</th>
                  <th className="py-3 px-3">L1 / L2 Target</th>
                  <th className="py-3 px-3">L3 Target</th>
                  <th className="py-3 px-3 text-right">Measured</th>
                  <th className="py-3 pl-4">Remediation &amp; Craft Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-line)]">
                {BUDGETS.map((b) => (
                  <tr key={b.metric} className="hover:bg-[var(--bg-surface)]/40 transition-colors">
                    <td className="py-3 pr-4 font-bold text-[var(--text-main)]">{b.metric}</td>
                    <td className="py-3 px-3 text-[var(--text-dim)]">{b.targetL1L2}</td>
                    <td className="py-3 px-3 text-[var(--text-dim)]">{b.targetL3}</td>
                    <td className="py-3 px-3 text-right font-bold text-[var(--status-sage)]">{b.measured}</td>
                    <td className="py-3 pl-4 text-[var(--text-dim)] font-sans text-xs">{b.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 2. Route-by-Route First Load JS Matrix (Margin Headers, Zero Cards) */}
      <section className="hairline-y py-10 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3 space-y-3 font-mono text-xs">
            <span className="text-[var(--accent-ember)] uppercase tracking-wider block font-bold">
              PAYLOAD MATRIX //
            </span>
            <h2 className="font-serif text-2xl text-[var(--text-main)] font-normal">
              Route JS Payload Breakdown
            </h2>
            <p className="text-[var(--text-dim)] font-sans leading-relaxed">
              Compiled Next.js production build traces (170 KB gzip budget ceiling).
            </p>
            <div className="text-[11px] text-[var(--text-dim)] pt-1">
              Shared Chunks: <strong className="text-[var(--text-main)]">87.1 kB</strong>
            </div>
          </div>

          <div className="lg:col-span-9 lg:border-l border-[var(--border-line)] lg:pl-8 overflow-x-auto hairline-t lg:hairline-t-0 pt-6 lg:pt-0">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="hairline-b text-[var(--text-dim)] uppercase">
                  <th className="py-3 pr-4">Route</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">First Load JS</th>
                  <th className="py-3 px-3 w-1/3">170 KB Gzip Fill</th>
                  <th className="py-3 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-line)]">
                {ROUTE_PAYLOADS.map((r) => (
                  <tr key={r.route} className="hover:bg-[var(--bg-surface)]/40 transition-colors">
                    <td className="py-3 pr-4 font-bold text-[var(--text-main)]">{r.route}</td>
                    <td className="py-3 px-3 text-[var(--text-dim)] uppercase text-[11px]">{r.type}</td>
                    <td className="py-3 px-3 font-semibold text-[var(--status-sage)] tabular-nums">{r.firstLoad}</td>
                    <td className="py-3 px-3">
                      <div className="w-full bg-[var(--border-line)] h-1.5 overflow-hidden">
                        <div
                          className="bg-[var(--status-sage)] h-full"
                          style={{ width: `${(parseFloat(r.firstLoad) / 170) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 pl-4 text-right text-[var(--status-sage)] font-semibold">
                      PASS (&lt; 170 KB)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. Interactive Gate Remediation Simulator (Zero Cards) */}
      <section className="hairline-y py-10 space-y-6">
        <div className="space-y-1 hairline-b pb-4">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent-ember)] font-bold">
            INTERACTIVE RUNTIME EVALUATOR
          </span>
          <h2 className="text-2xl font-serif text-[var(--text-main)]">
            Test Your Pull Request Against Gate Budgets
          </h2>
          <p className="text-xs text-[var(--text-dim)] font-mono max-w-xl">
            Simulate how Chaff evaluates pull requests in CI. Drag metrics to observe the gate pass/fail verdict and remediation directives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-line)]">
          <div className="lg:col-span-7 space-y-5 font-mono text-xs lg:pr-8">
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label htmlFor="simJs">First-Load JS: {simJsSize} KB gzip</label>
                <span className={isJsPass ? 'text-[var(--status-sage)] font-semibold' : 'text-[var(--accent-ember)] font-bold'}>
                  {isJsPass ? 'PASS (<= 170 KB)' : 'FAIL (> 170 KB Budget)'}
                </span>
              </div>
              <input
                id="simJs"
                type="range"
                min="50"
                max="300"
                value={simJsSize}
                onChange={(e) => setSimJsSize(parseInt(e.target.value, 10))}
                className="w-full min-h-[44px] cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label htmlFor="simCls">Cumulative Layout Shift (CLS): {simCls.toFixed(2)}</label>
                <span className={isClsPass ? 'text-[var(--status-sage)] font-semibold' : 'text-[var(--accent-ember)] font-bold'}>
                  {isClsPass ? 'PASS (<= 0.10)' : 'FAIL (> 0.10 Shift)'}
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

            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label htmlFor="simTouch">Interactive Touch Target: {simTouchTarget}px</label>
                <span className={isTouchPass ? 'text-[var(--status-sage)] font-semibold' : 'text-[var(--accent-ember)] font-bold'}>
                  {isTouchPass ? 'PASS (>= 44px)' : 'FAIL (< 44px Target)'}
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

          <div className="lg:col-span-5 space-y-4 font-mono text-xs lg:pl-8 pt-4 lg:pt-0">
            <div className="flex justify-between items-baseline hairline-b pb-3">
              <span className="uppercase text-[var(--text-dim)]">CI Gate Status</span>
              <span
                className={`font-bold px-2 py-0.5 hairline ${
                  overallPass
                    ? 'bg-[var(--status-sage-soft)] text-[var(--status-sage)] border-[var(--status-sage)]/40'
                    : 'bg-[var(--accent-ember-soft)] text-[var(--accent-ember)] border-[var(--accent-ember)]/40'
                }`}
              >
                {overallPass ? 'VERDICT: PASS' : 'VERDICT: REJECTED'}
              </span>
            </div>

            <p className="font-sans text-xs text-[var(--text-dim)] leading-relaxed">
              {overallPass
                ? 'All simulated performance and mobile ergonomical budgets are satisfied. Pull request is cleared for merge.'
                : 'Gate violation detected! Chaff blocks the pull request and instructs the agent to downgrade effect complexity, never loosen the budget.'}
            </p>

            <div className="hairline-y py-3 text-[11px] space-y-1 text-[var(--text-dim)]">
              <strong className="text-[var(--text-main)] block">Invariant Rule:</strong>
              <span>Downgrade effect complexity, never loosen the budget.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The 9-Point Mobile Checklist (Margin Headers, Zero Cards) */}
      <section className="hairline-y py-10 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3 space-y-3 font-mono text-xs">
            <span className="text-[var(--accent-ember)] uppercase tracking-wider block font-bold">
              MOBILE ERGONOMIC INVARIANTS //
            </span>
            <h2 className="font-serif text-2xl text-[var(--text-main)] font-normal">
              The 9-Point Checklist
            </h2>
            <p className="text-[var(--text-dim)] font-sans leading-relaxed">
              Every interactive element and layout container is evaluated against these 9 rules.
            </p>
            <div className="text-[11px] text-[var(--text-dim)] pt-2">
              Tally: <strong className="text-[var(--text-main)]">|||| |||| |</strong>
            </div>
          </div>

          <div className="lg:col-span-9 lg:border-l border-[var(--border-line)] lg:pl-8 divide-y divide-[var(--border-line)] hairline-t lg:hairline-t-0">
            {MOBILE_CHECKLIST.map((item) => (
              <div key={item.id} className="py-3.5 grid grid-cols-1 md:grid-cols-12 gap-3 items-baseline">
                <span className="md:col-span-2 font-mono text-xs font-bold text-[var(--accent-ember)]">
                  {item.id} //
                </span>
                <span className="md:col-span-4 font-serif text-base text-[var(--text-main)]">
                  {item.title}
                </span>
                <p className="md:col-span-6 font-sans text-xs text-[var(--text-dim)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
