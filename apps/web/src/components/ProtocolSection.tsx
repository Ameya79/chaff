import React from 'react';

const STEPS = [
  { num: '01', name: 'Read', caption: 'Lock tokens in .chaff/identity.json.' },
  { num: '02', name: 'Look', caption: 'Capture 390px and 1440px DOM.' },
  { num: '03', name: 'Audit', caption: 'Score 4 pillars, waive brand.' },
  { num: '04', name: 'Plan', caption: 'Author 3 distinct pitches.' },
  { num: '05', name: 'Approve', caption: 'Pause for human signoff.', isGate: true },
  { num: '06', name: 'Implement', caption: 'Apply small tagged commits.' },
  { num: '07', name: 'Verify', caption: 'Pass tests and chaff gate.' },
];

export function ProtocolSection() {
  return (
    <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-ember)] block">
            Workflow
          </span>
          <h2 className="font-serif text-[var(--text-main)]">
            Seven steps. One human gate.
          </h2>
        </div>
        <span className="font-mono text-xs text-[var(--text-dim)]">
          Deterministic state machine
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-8 hairline-t pt-10">
        {STEPS.map((s) => (
          <div key={s.num} className="space-y-2.5 min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <span
                className={`font-serif text-3xl tabular-nums ${
                  s.isGate ? 'text-[var(--accent-ember)]' : 'text-[var(--text-dim)]'
                }`}
              >
                {s.num}
              </span>
              {s.isGate && (
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-ember)]">
                  Gate
                </span>
              )}
            </div>
            <h3 className="font-serif text-lg text-[var(--text-main)]">
              {s.name}
            </h3>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              {s.caption}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
