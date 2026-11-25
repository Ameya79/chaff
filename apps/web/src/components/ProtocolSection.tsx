import React from 'react';

const STEPS = [
  {
    num: '01',
    name: 'Read',
    role: 'Identity Lock',
    summary:
      'Inspects framework, styling, and fonts; locks high-confidence tokens into .chaff/identity.json while modifying zero working source files.',
  },
  {
    num: '02',
    name: 'Look',
    role: 'Dual Viewport Capture',
    summary:
      'Boots the running app and measures computed DOM geometry, fonts, contrast, and overflow at 390px and 1440px in light and dark mode.',
  },
  {
    num: '03',
    name: 'Audit',
    role: '4-Pillar Scoring',
    summary:
      'Scores Visual, Copy, Code, and Performance out of 100. Waives intentional brand tokens cleanly so your identity is never penalized.',
  },
  {
    num: '04',
    name: 'Plan',
    role: '3 Concept Pitches',
    summary:
      'Orders small cleanups at Level 1, or authors 3 structurally distinct Concept Pitches in .chaff/pitches/ at Levels 2 and 3.',
  },
  {
    num: '05',
    name: 'Approve',
    role: 'Mandatory Pause',
    summary:
      'Halts before editing product code so an engineer selects the creative direction and confirms any brand waivers explicitly.',
    isGate: true,
  },
  {
    num: '06',
    name: 'Implement',
    role: 'Atomic Commits',
    summary:
      'Applies scoped, revertible commits tagged with rule IDs. Never rewrites working business logic purely to restyle UI.',
  },
  {
    num: '07',
    name: 'Verify',
    role: 'Budget Gate',
    summary:
      'Runs typecheck, lint, tests, and chaff gate. Enforces 320px overflow, 44px touch targets, and the 5-part Level 3 Fallback Contract.',
  },
];

export function ProtocolSection() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 hairline-b">
        <div className="space-y-1.5">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent-ember)] font-semibold block">
            Autonomous Protocol
          </span>
          <h2 className="font-serif text-[var(--text-main)]">
            Seven steps before a single line ships
          </h2>
        </div>
        <p className="text-sm text-[var(--text-dim)] max-w-[46ch]">
          Every agent configured with Chaff executes this deterministic state machine and pauses at Step 05 for human signoff.
        </p>
      </div>

      {/* Horizontal Stepped Index on Desktop, Ruled Rows on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 hairline-y bg-[var(--bg-surface)]">
        {STEPS.map((s) => (
          <div
            key={s.num}
            className={`p-4 sm:p-5 flex flex-col justify-between gap-3 min-w-0 border-b border-[var(--border-line)] last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0 ${
              s.isGate ? 'bg-[var(--accent-ember-soft)]' : 'bg-[var(--bg-surface)]'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-serif text-2xl font-bold text-[var(--accent-ember)] tabular-nums">
                  {s.num}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-dim)]">
                  {s.role}
                </span>
              </div>
              <h3 className="font-serif text-lg text-[var(--text-main)]">
                {s.name}
              </h3>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                {s.summary}
              </p>
            </div>

            {s.isGate && (
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--accent-ember)]">
                Human Signoff Gate
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
