import React from 'react';

const STEPS = [
  {
    num: '01',
    name: 'Read',
    role: 'Identity Lock',
    summary: 'Inspect framework, styling, and fonts. Record locked brand tokens in .chaff/identity.json. Modify zero working files.',
  },
  {
    num: '02',
    name: 'Look',
    role: 'Dual Viewport Capture',
    summary: 'Spin up dev server; evaluate rendered geometry at 390px (mobile) and 1440px (desktop) across light/dark themes.',
  },
  {
    num: '03',
    name: 'Audit',
    role: 'Scoring Engine',
    summary: 'Score codebase out of 100 across 4 areas. Flag severe tells (UI-001..009). Waive verified brand tokens with rationale.',
  },
  {
    num: '04',
    name: 'Plan',
    role: 'Concept Pitches',
    summary: 'L1: Ordered fix plan. L2/L3: Generate 3 distinct Concept Pitches in .chaff/pitches/. Pause execution for signoff.',
  },
  {
    num: '05',
    name: 'Approve',
    role: 'Human-in-the-Loop',
    summary: 'Wait for explicit developer confirmation on chosen direction. Autonomous agents never proceed without human consent.',
  },
  {
    num: '06',
    name: 'Implement',
    role: 'Atomic Commits',
    summary: 'Remediate in small commits tagged with rule IDs (e.g. fix: [UI-004] warm paper tokens). Never rewrite working files.',
  },
  {
    num: '07',
    name: 'Verify & Gate',
    role: 'Budget Enforcement',
    summary: 'Run typecheck, lint, test, and chaff gate. Enforce 320px overflow, >=44px touch targets, CLS <=0.10, and 3D budget.',
  },
];

export function ProtocolSection() {
  return (
    <section className="space-y-6">
      {/* Broadsheet Masthead Header */}
      <div className="flex items-center justify-between gap-4 hairline-b pb-3 font-mono text-xs text-[var(--text-dim)]">
        <div className="flex items-center gap-2">
          <span className="text-[var(--accent-ember)] font-bold">03 //</span>
          <span className="uppercase tracking-widest text-[var(--text-main)] font-semibold">AUTONOMOUS WORKFLOW CONTRACT</span>
        </div>
        <div className="hidden sm:block">
          STATE MACHINE // 7 SEQUENTIAL PHASES
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
        <div className="space-y-2">
          <h2 className="font-serif text-3xl text-[var(--text-main)]">
            The Invariant 7-Step Protocol
          </h2>
          <p className="text-[var(--text-dim)] max-w-[65ch]">
            Every AI agent configured with Chaff follows a linear state machine. It is strictly forbidden from rewriting files without auditing and human plan approval.
          </p>
        </div>
        <div className="font-mono text-xs text-[var(--text-dim)] py-2 px-3 hairline-y sm:hairline bg-[var(--bg-surface)]">
          Protocol Invariant: <strong className="text-[var(--text-main)]">Pause before commit</strong>
        </div>
      </div>

      {/* Continuous Ruled Broadsheet Ledger for 7 Steps (Zero Cards) */}
      <div className="hairline-y divide-y divide-[var(--border-line)]">
        {STEPS.map((s, idx) => {
          const isApprovalStep = idx === 4;
          return (
            <div
              key={s.num}
              className={`py-5 px-3 sm:px-4 transition-colors hover:bg-[var(--bg-surface)]/60 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline ${
                isApprovalStep ? 'bg-[var(--accent-ember-soft)]/20' : ''
              }`}
            >
              {/* Left Marginalia: Number & Role */}
              <div className="md:col-span-3 flex items-baseline gap-3">
                <span className="font-serif text-2xl font-bold text-[var(--accent-ember)] tabular-nums">
                  {s.num}
                </span>
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-dim)] block">
                    Phase {s.num} //
                  </span>
                  <span className={`font-mono text-xs font-semibold ${isApprovalStep ? 'text-[var(--accent-ember)] font-bold' : 'text-[var(--text-main)]'}`}>
                    {s.role}
                  </span>
                </div>
              </div>

              {/* Title Column */}
              <div className="md:col-span-3">
                <h3 className="font-serif text-xl text-[var(--text-main)]">
                  {s.name}
                </h3>
                {isApprovalStep && (
                  <span className="font-mono text-[10px] text-[var(--accent-ember)] uppercase font-bold tracking-wider">
                    [Mandatory Pause Point]
                  </span>
                )}
              </div>

              {/* Specification Summary Column */}
              <div className="md:col-span-6">
                <p className="text-sm text-[var(--text-dim)] leading-relaxed">
                  {s.summary}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
