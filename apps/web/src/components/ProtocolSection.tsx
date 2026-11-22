import React from 'react';

const STEPS = [
  {
    num: '01',
    name: 'Read',
    role: 'Identity Lock',
    summary: 'Inspect framework, styling, and fonts. Write .chaff/identity.json with high-confidence brand tokens. Modify zero working files.',
  },
  {
    num: '02',
    name: 'Look',
    role: 'Dual Viewport Capture',
    summary: 'Spin up dev server; evaluate rendered page geometry at 390px (mobile) and 1440px (desktop) across light and dark themes.',
  },
  {
    num: '03',
    name: 'Audit',
    role: 'Scoring Engine',
    summary: 'Score codebase out of 100 across 4 areas. Flag severe tells (UI-001..009). Waive verified brand tokens with explicit rationale.',
  },
  {
    num: '04',
    name: 'Plan',
    role: 'Concept Pitches',
    summary: 'L1: Ordered fix plan. L2/L3: Generate 3 distinct Concept Pitches in .chaff/pitches/. Pause execution for human signoff.',
  },
  {
    num: '05',
    name: 'Approve',
    role: 'Human-in-the-Loop',
    summary: 'Wait for explicit developer confirmation on chosen direction. No autonomous agent moves forward without human consent.',
  },
  {
    num: '06',
    name: 'Implement',
    role: 'Atomic Commits',
    summary: 'Execute remediation with small commits tagged with rule IDs (e.g. fix: [UI-004] warm paper tokens). Never rewrite working files.',
  },
  {
    num: '07',
    name: 'Verify & Gate',
    role: 'Budget Enforcement',
    summary: 'Run typecheck, lint, test, and chaff gate. Check 320px overflow, >=44px touch targets, CLS <=0.10, and lazy 3D island.',
  },
];

export function ProtocolSection() {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)]">
          03 / AUTONOMOUS WORKFLOW CONTRACT
        </span>
        <div className="flex-1 hairline-b" />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="font-serif text-3xl text-[var(--text-main)]">
            The Invariant 7-Step Protocol
          </h2>
          <p className="text-[var(--text-dim)] max-w-[65ch]">
            Every AI agent configured with Chaff follows a linear state machine. It is strictly forbidden from rewriting files without auditing and human plan approval.
          </p>
        </div>
        <div className="font-mono text-xs text-[var(--text-dim)] p-3 hairline rounded bg-[var(--bg-surface)]">
          Protocol Invariant: <strong className="text-[var(--text-main)]">Pause before commit</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {STEPS.map((s, idx) => (
          <div
            key={s.num}
            className={`hairline p-5 bg-[var(--bg-surface)] rounded-md space-y-3 transition-colors hover:bg-[var(--bg-surface-elevated)] ${
              idx === 4 ? 'border-[var(--accent-ember)] lg:col-span-2 xl:col-span-1' : ''
            }`}
          >
            <div className="flex justify-between items-baseline hairline-b pb-2">
              <span className="font-mono text-sm font-bold text-[var(--accent-ember)]">
                {s.num}
              </span>
              <span className="font-mono text-[10px] uppercase text-[var(--text-dim)]">
                {s.role}
              </span>
            </div>
            <h3 className="font-serif text-lg text-[var(--text-main)]">{s.name}</h3>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              {s.summary}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
