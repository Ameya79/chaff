import React from 'react';

const STEPS = [
  { num: '01', name: 'Read', detail: 'Reads your codebase, fonts, tokens, and live structure into .chaff/identity.json.' },
  { num: '02', name: 'Look', detail: 'Inspects rendered UI at 390px and 1440px in active themes for clipping or overflow.' },
  { num: '03', name: 'Audit', detail: 'Evaluates tells across 72 rules and waives intentionally locked brand choices.' },
  { num: '04', name: 'Plan', detail: 'Chooses a design direction grounded in the primary task and existing identity.' },
  { num: '05', name: 'Check scope', detail: 'Keeps locked brand choices and working product behavior intact.', isGate: true },
  { num: '06', name: 'Implement', detail: 'Applies clean, rule-tagged commits without breaking existing logic.' },
  { num: '07', name: 'Verify', detail: 'Checks types, lint, builds, budgets, and live screenshots before finishing.' },
];

export function ProtocolSection() {
  return (
    <section className="protocol-index py-10 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8 hairline-t">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-12 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-3 scroll-sheet">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent)] font-medium block">
            7-Step Workflow
          </span>
          <h2 className="font-display text-[var(--text-main)]">
            From GitHub link to working interface.
          </h2>
          <p className="text-sm text-[var(--text-dim)] leading-relaxed max-w-[36ch]">
            Every agent run starts by learning what belongs to your brand before changing pixels.
          </p>
        </div>

        <div className="lg:col-span-8 divide-y divide-[var(--border-line)] hairline-y min-w-0">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className={`scroll-sheet py-4 grid grid-cols-12 gap-x-3 gap-y-1 sm:gap-4 items-baseline ${
                s.isGate ? 'bg-[var(--accent-soft)] px-3 -mx-3 rounded-[4px]' : ''
              }`}
            >
              <span
                className={`col-span-2 font-mono text-xs font-medium tabular-nums ${
                  s.isGate ? 'text-[var(--accent)]' : 'text-[var(--text-dim)]'
                }`}
              >
                {s.num}
              </span>
              <div className="col-span-10 sm:col-span-3 flex items-center gap-2">
                <h3 className="text-base font-medium text-[var(--text-main)]">
                  {s.name}
                </h3>
                {s.isGate && (
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] font-medium">
                    Gate
                  </span>
                )}
              </div>
              <p className="col-start-3 col-span-10 sm:col-start-auto sm:col-span-7 text-sm text-[var(--text-dim)] leading-relaxed">
                {s.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
