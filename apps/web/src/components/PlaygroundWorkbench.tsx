'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { runBrowserStaticAudit } from '@chaff/checks/browser';
import presetsData from '../data/playground-presets.json';
import { RollingCounter } from './RollingCounter';

export interface CanonicalRuleSummary {
  id: string;
  title: string;
  severity: string;
}

interface PresetItem {
  id: string;
  name: string;
  code: string;
  fixedCode: string;
}

interface PlaygroundWorkbenchProps {
  rulesMap: Record<string, CanonicalRuleSummary>;
}

const PRESETS = presetsData as PresetItem[];

function applyHeuristicRemediations(source: string): string {
  let out = source
    .replace(/\bmin-h-screen\b/g, 'min-h-dvh')
    .replace(/\bh-screen\b/g, 'min-h-dvh')
    .replace(/['"]100vh['"]/g, "'100dvh'")
    .replace(/['"]100vw['"]/g, "'100%'")
    .replace(/\b(w|min-w)-\[([4-9]\d{2}|\d{4,})px\]/g, 'w-full max-w-5xl')
    .replace(/\boutline-none\b/g, 'focus-visible:outline-2 focus-visible:outline-[var(--accent)]')
    .replace(/\btext-(gray|slate|zinc)-(300|400)\b/g, 'text-[#52525B]')
    .replace(/\bbg-clip-text\s+text-transparent\b/g, 'text-[#111113]')
    .replace(/\btext-transparent\s+bg-clip-text\b/g, 'text-[#111113]')
    .replace(/\b(from|via|to)-(purple|indigo|blue|pink)-\d{3}\b/g, '')
    .replace(/\bbg-gradient-to-[a-z]+\b/g, '')
    .replace(/\bgrid-cols-1\s+md:grid-cols-3\b/g, 'grid-cols-1 lg:grid-cols-12')
    .replace(/\btext-center\b/g, 'text-left')
    .replace(/\bbackdrop-blur-(xl|2xl|3xl)\b/g, '')
    .replace(/\bblur-(2xl|3xl)\b/g, '')
    .replace(/dpr=\{\[\s*1\s*,\s*[2-9]\s*\]\}/g, 'dpr={[1, 1.5]}')
    .replace(/^\s*console\.log\(.*\);\s*$/gm, '');

  const divOnClickOpen = /<div\b([^>]*\bonClick\b[^>]*)>/gi;
  let match: RegExpExecArray | null;
  const openOffsets: number[] = [];
  while ((match = divOnClickOpen.exec(out)) !== null) {
    openOffsets.push(match.index);
  }
  for (let k = openOffsets.length - 1; k >= 0; k--) {
    const start = openOffsets[k];
    let depth = 0;
    let pos = start;
    const tagRe = /<\/?div\b[^>]*>/gi;
    tagRe.lastIndex = start;
    let t: RegExpExecArray | null;
    while ((t = tagRe.exec(out)) !== null) {
      if (t[0].startsWith('</')) {
        depth--;
        if (depth === 0) {
          out = out.slice(0, t.index) + '</button>' + out.slice(t.index + t[0].length);
          break;
        }
      } else if (!t[0].endsWith('/>')) {
        depth++;
      }
      pos = tagRe.lastIndex;
      if (pos <= start) break;
    }
    out = out.slice(0, start) + out.slice(start).replace(/^<div\b([^>]*\bonClick\b[^>]*)>/i, '<button type="button"$1>');
  }

  return out;
}

export function PlaygroundWorkbench({ rulesMap }: PlaygroundWorkbenchProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESETS[0].id);
  const [code, setCode] = useState<string>(PRESETS[0].code);
  const [fixApplied, setFixApplied] = useState<boolean>(false);

  const activePreset = useMemo(
    () => PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0],
    [selectedPresetId]
  );

  const rawFindings = useMemo(() => {
    return runBrowserStaticAudit(code, 'src/app/page.tsx');
  }, [code]);

  const findings = useMemo(() => {
    const grouped = new Map<string, (typeof rawFindings)[number] & { count: number }>();
    for (const f of rawFindings) {
      const existing = grouped.get(f.canonicalRuleId);
      if (existing) {
        existing.count += 1;
      } else {
        grouped.set(f.canonicalRuleId, { ...f, count: 1 });
      }
    }
    return Array.from(grouped.values());
  }, [rawFindings]);

  const totalDeduction = findings.reduce((sum, f) => sum + f.deduction, 0);
  const score = Math.max(0, 100 - totalDeduction);

  const selectPreset = (preset: PresetItem) => {
    setSelectedPresetId(preset.id);
    setCode(preset.code);
    setFixApplied(false);
  };

  const toggleChaffFix = () => {
    if (!fixApplied) {
      if (code.trim() === activePreset.code.trim()) {
        setCode(activePreset.fixedCode);
      } else {
        setCode(applyHeuristicRemediations(code));
      }
      setFixApplied(true);
    } else {
      setCode(activePreset.code);
      setFixApplied(false);
    }
  };

  const previewVariant = useMemo(() => {
    if (/Canvas|@react-three|THREE|WebGL|StageWebGL|StagePoster/i.test(code)) {
      return 'webgl';
    }
    if (/Telemetry Feed|Order Route/i.test(code)) {
      return 'feed';
    }
    return 'landing';
  }, [code]);

  const isSpecimenClean = score >= 85;

  return (
    <div className="space-y-10 sheet-in" style={{ '--d': '120ms' } as React.CSSProperties}>
      {/* Rectilinear Preset & Fix Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 hairline-b pb-3">
        <div className="flex flex-wrap items-center gap-1">
          {PRESETS.map((p) => {
            const active = selectedPresetId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPreset(p)}
                aria-pressed={active}
                className={`px-3.5 py-2 rounded-[6px] border-b-2 min-h-[44px] min-w-[44px] font-mono text-xs transition-colors duration-200 ${
                  active
                    ? 'border-[var(--accent)] bg-[var(--bg-surface)] text-[var(--text-main)] font-medium'
                    : 'border-transparent text-[var(--text-dim)] hover:text-[var(--text-main)]'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={toggleChaffFix}
          aria-pressed={fixApplied}
          className={`btn text-xs font-mono shrink-0 ${
            fixApplied ? 'primary' : 'violet'
          }`}
        >
          {fixApplied ? 'Revert' : 'Apply Chaff Fix'}
        </button>
      </div>

      {/* Split Editor + Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-3 min-w-0">
          <div className="flex justify-between items-center font-mono text-xs text-[var(--text-dim)]">
            <label htmlFor="playground-code" className="text-[var(--text-main)]">
              JSX Source
            </label>
            <span>{code.length} chars</span>
          </div>

          <textarea
            id="playground-code"
            name="source"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setFixApplied(false);
            }}
            rows={13}
            spellCheck={false}
            className="w-full p-5 rounded-[2px] bg-[var(--bg-surface)] hairline-box text-[var(--text-main)] font-mono text-base leading-relaxed resize-y"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setCode('');
                setFixApplied(false);
              }}
              className="btn ghost text-xs font-mono"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-[2px] bg-[var(--bg-surface)] hairline-box p-6 sm:p-7 space-y-6 min-w-0">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <span className="font-mono text-xs text-[var(--text-dim)] block">
                Audit Score
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <RollingCounter
                  value={score}
                  className={`font-display text-5xl font-normal ${
                    isSpecimenClean
                      ? 'text-[var(--status-pass)]'
                      : 'text-[var(--status-fail)]'
                  }`}
                />
                <span className="font-mono text-xs text-[var(--text-dim)]">/ 100</span>
              </div>
            </div>

            <span
              className={`font-mono text-xs px-3 py-1 rounded-[4px] ${
                isSpecimenClean
                  ? 'bg-[var(--status-pass-soft)] text-[var(--status-pass)]'
                  : 'bg-[var(--status-fail-soft)] text-[var(--status-fail)]'
              }`}
            >
              {isSpecimenClean ? 'PASS' : `${findings.length} Tells`}
            </span>
          </div>

          {findings.length === 0 ? (
            <p className="text-sm text-[var(--status-pass)] font-mono leading-relaxed panel-enter">
              Zero tells detected. Clean craft verified.
            </p>
          ) : (
            <div className="divide-y divide-[var(--border-line)] max-h-[380px] overflow-y-auto pr-1">
              {findings.map((f, idx) => {
                const canonical = rulesMap[f.canonicalRuleId];
                return (
                  <div key={`${f.id}-${idx}`} className="py-3.5 space-y-1">
                    <div className="flex items-center justify-between gap-2 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/rules#${f.canonicalRuleId}`}
                          className="text-[var(--accent)] underline inline-flex items-center min-h-[44px] min-w-[44px]"
                        >
                          {f.canonicalRuleId}
                        </Link>
                        {f.count > 1 && (
                          <span className="text-[var(--text-dim)]">x{f.count}</span>
                        )}
                      </div>
                      <span className="text-[var(--status-fail)]">-{f.deduction}</span>
                    </div>
                    <h3 className="font-medium text-sm text-[var(--text-main)]">
                      {canonical?.title || f.message}
                    </h3>
                    <p className="text-xs text-[var(--text-dim)]">{f.fixHint}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Rendered Specimen Preview */}
      <div className="scroll-sheet space-y-4">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-[var(--text-dim)]">
            Preview · {isSpecimenClean ? 'Craft' : 'Raw Slop'}
          </span>
          <span className={isSpecimenClean ? 'text-[var(--status-pass)]' : 'text-[var(--status-fail)]'}>
            {isSpecimenClean ? 'PASS' : 'FAIL'}
          </span>
        </div>

        <div key={`${previewVariant}-${isSpecimenClean ? 'clean' : 'slop'}`} className="panel-enter">
          {previewVariant === 'landing' && !isSpecimenClean && (
            <div className="slop-specimen-shell relative rounded-[8px] p-8 text-center space-y-4">
              <div className="slop-orb-purple" aria-hidden="true" />
              <div className="slop-headline-gradient font-sans text-2xl sm:text-3xl font-extrabold">
                Generic Gradient Headline
              </div>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Centered template prose paired with three uniform glass cards and fixed overflow width.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                {['Fast Automation', 'Cloud Platform', 'Global Scale'].map((label) => (
                  <div key={label} className="slop-glass-tile p-3 text-xs font-semibold text-white">
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {previewVariant === 'landing' && isSpecimenClean && (
            <div className="rounded-[8px] p-8 bg-[var(--bg-surface)] hairline-box text-[var(--text-main)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="font-mono text-xs text-[var(--accent)] block">
                  Order Router v2.4
                </span>
                <h3 className="font-display text-3xl text-[var(--text-main)] font-normal">
                  Route multi-venue spot orders in 11.8 ms.
                </h3>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center min-h-[44px] px-5 py-2 rounded-[6px] bg-[#6D28D9] text-white font-mono text-xs">
                    Deploy (#6D28D9 Locked)
                  </span>
                </div>
              </div>
              <div className="lg:col-span-5 lg:pl-6 border-t border-[var(--border-line)] lg:border-t-0 lg:border-l pt-4 lg:pt-0 space-y-1">
                <span className="font-mono text-xs text-[var(--text-dim)] block">Fill Rate</span>
                <div className="font-display text-4xl text-[var(--status-pass)] tabular-nums">
                  99.94%
                </div>
              </div>
            </div>
          )}

          {previewVariant === 'feed' && (
            <div
              className={`rounded-[8px] p-6 space-y-3 ${
                isSpecimenClean
                  ? 'bg-[var(--bg-surface)] hairline-box text-[var(--text-main)]'
                  : 'bg-white border border-slate-200 text-slate-900'
              }`}
            >
              <div className="font-semibold text-lg">Telemetry Feed</div>
              <div className="divide-y divide-[var(--border-line)]">
                {[
                  { label: 'Order Route #1089', val: '12.4 ms' },
                  { label: 'Order Route #1090', val: '14.1 ms' },
                ].map((row) => (
                  <div
                    key={row.label}
                    className={`flex justify-between items-center py-3 min-h-[44px] ${
                      isSpecimenClean ? 'text-[var(--text-main)]' : 'text-gray-400'
                    }`}
                  >
                    <span className="text-sm">{row.label}</span>
                    <span
                      className={`font-mono text-sm tabular-nums ${
                        isSpecimenClean ? 'font-semibold text-[var(--status-pass)]' : 'text-gray-300'
                      }`}
                    >
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {previewVariant === 'webgl' && (
            <div className="rounded-[8px] p-6 bg-[var(--bg-surface)] hairline-box text-[var(--text-main)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span
                  className="font-mono text-xs block"
                  style={{ color: isSpecimenClean ? 'var(--status-pass)' : 'var(--status-fail)' }}
                >
                  {isSpecimenClean ? 'Level 3 Fallback Contract Verified' : 'Uncapped Synchronous WebGL'}
                </span>
                <p className="text-sm text-[var(--text-dim)]">
                  {isSpecimenClean
                    ? 'Lazy dynamic import, DPR <= 1.5, offscreen pause, static poster.'
                    : 'Blocking import, DPR 3.0, 100vw overflow.'}
                </p>
              </div>
              <span className="font-mono text-xs px-3.5 py-1.5 rounded-[2px] bg-[var(--bg-surface-elevated)] shrink-0">
                {isSpecimenClean ? 'DPR <= 1.5' : 'DPR 3.0'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
