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
  return source
    .replace(/\bmin-h-screen\b/g, 'min-h-dvh')
    .replace(/\bh-screen\b/g, 'min-h-dvh')
    .replace(/['"]100vh['"]/g, "'100dvh'")
    .replace(/['"]100vw['"]/g, "'100%'")
    .replace(/\b(w|min-w)-\[([4-9]\d{2}|\d{4,})px\]/g, 'w-full max-w-5xl')
    .replace(/\boutline-none\b/g, 'focus-visible:outline-2 focus-visible:outline-[var(--accent-ember)]')
    .replace(/\btext-(gray|slate|zinc)-(300|400)\b/g, 'text-[#544B40]')
    .replace(/\bbg-clip-text\s+text-transparent\b/g, 'text-[#16120E]')
    .replace(/\btext-transparent\s+bg-clip-text\b/g, 'text-[#16120E]')
    .replace(/\b(from|via|to)-(purple|indigo|blue|pink)-\d{3}\b/g, '')
    .replace(/\bgrid-cols-1\s+md:grid-cols-3\b/g, 'grid-cols-1 lg:grid-cols-12')
    .replace(/\btext-center\b/g, 'text-left')
    .replace(/\bbackdrop-blur-(xl|2xl|3xl)\b/g, '')
    .replace(/dpr=\{\[\s*1\s*,\s*[2-9]\s*\]\}/g, 'dpr={[1, 1.5]}')
    .replace(/<div([^>]*)\bonClick=/g, '<button type="button"$1 onClick=')
    .replace(/^\s*console\.log\(.*\);\s*$/gm, '');
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

  // Detect visual specimen archetype dynamically from live editor code
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
    <div className="space-y-8">
      {/* Preset & Remediation Toolbar */}
      <div className="hairline bg-[var(--bg-surface)] p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase text-[var(--text-dim)] font-semibold mr-1">
            Specimens:
          </span>
          {PRESETS.map((p) => {
            const active = selectedPresetId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPreset(p)}
                aria-pressed={active}
                className={`px-3 py-1.5 min-h-[44px] font-mono text-xs border transition-colors ${
                  active
                    ? 'bg-[var(--text-main)] text-[var(--bg-surface)] border-[var(--text-main)] font-bold'
                    : 'bg-[var(--bg-canvas)] text-[var(--text-main)] border-[var(--border-line)] hover:bg-[var(--bg-surface-elevated)]'
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
          {fixApplied ? 'Revert to Raw Slop' : 'Apply Chaff Fix'}
        </button>
      </div>

      {/* Split Editor + Live Audit Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Code Editor */}
        <div className="lg:col-span-7 hairline bg-[var(--bg-surface)] p-5 sm:p-6 space-y-4 min-w-0">
          <div className="flex flex-wrap justify-between items-center gap-2 pb-3 hairline-b font-mono text-xs">
            <label
              htmlFor="playground-code"
              className="font-bold uppercase text-[var(--text-main)]"
            >
              Component JSX Source
            </label>
            <span className="text-[var(--text-dim)]">
              Engine: @chaff/checks/browser · {code.length} chars
            </span>
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
            className="w-full p-4 border border-[var(--border-control)] bg-[var(--bg-inset)] text-[var(--text-main)] font-mono text-base leading-relaxed resize-y"
          />

          <div className="flex flex-wrap justify-between items-center gap-3 font-mono text-xs text-[var(--text-dim)]">
            <span>Runs 100% locally in browser</span>
            <button
              type="button"
              onClick={() => {
                setCode('');
                setFixApplied(false);
              }}
              className="btn text-xs font-mono"
            >
              Clear Source
            </button>
          </div>
        </div>

        {/* Right: Live Canonical Audit Score & Findings */}
        <div className="lg:col-span-5 hairline bg-[var(--bg-surface)] p-5 sm:p-6 space-y-5 min-w-0">
          <div className="flex items-baseline justify-between gap-4 pb-4 hairline-b">
            <div>
              <span className="font-mono text-xs uppercase text-[var(--text-dim)] block font-semibold">
                Live Audit Score
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <RollingCounter
                  value={score}
                  className={`font-serif text-5xl font-bold ${
                    isSpecimenClean
                      ? 'text-[var(--status-sage)]'
                      : 'text-[var(--accent-ember)]'
                  }`}
                />
                <span className="font-mono text-xs text-[var(--text-dim)]">/ 100</span>
              </div>
            </div>

            <div className="text-right space-y-1">
              <span
                className={`inline-block font-mono text-xs font-bold px-2.5 py-1 uppercase ${
                  isSpecimenClean
                    ? 'bg-[var(--status-sage-soft)] text-[var(--status-sage)]'
                    : 'bg-[var(--accent-ember-soft)] text-[var(--accent-ember)]'
                }`}
              >
                {isSpecimenClean ? 'Gate Pass' : 'Tells Found'}
              </span>
              <span className="block font-mono text-xs text-[var(--text-dim)]">
                {findings.length} finding(s)
              </span>
            </div>
          </div>

          {findings.length === 0 ? (
            <div className="p-5 bg-[var(--status-sage-soft)] text-[var(--status-sage)] space-y-2">
              <h2 className="font-serif text-lg font-semibold">
                Authentic Grain Standard Verified
              </h2>
              <p className="text-xs font-mono leading-relaxed">
                Zero static AI tells detected across UI, Copy, Code, Mobile, A11y, and Three.js rules.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-line)] max-h-[380px] overflow-y-auto pr-1">
              {findings.map((f, idx) => {
                const canonical = rulesMap[f.canonicalRuleId];
                return (
                  <div key={`${f.id}-${idx}`} className="py-3.5 space-y-1.5">
                    <div className="flex items-center justify-between gap-2 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/rules#${f.canonicalRuleId}`}
                          className="font-bold text-[var(--accent-ember)] underline inline-flex items-center min-h-[44px] min-w-[44px] px-1"
                        >
                          {f.canonicalRuleId}
                        </Link>
                        {f.count > 1 && (
                          <span className="px-1.5 py-0.5 bg-[var(--bg-inset)] text-[var(--text-dim)] text-[10px]">
                            x{f.count}
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-[var(--accent-ember)]">
                        -{f.deduction} pts
                      </span>
                    </div>
                    <h3 className="font-serif text-base text-[var(--text-main)]">
                      {canonical?.title || f.message}
                    </h3>
                    <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                      {f.fixHint}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Live Rendered Specimen Preview */}
      <section className="hairline bg-[var(--bg-surface)] overflow-hidden">
        <div className="px-5 py-3.5 hairline-b bg-[var(--bg-inset)] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <span className="font-bold uppercase text-[var(--text-main)]">
            Live Rendered Specimen Preview ({isSpecimenClean ? 'Winnowed Craft' : 'Raw AI Output'})
          </span>
          <span className={isSpecimenClean ? 'text-[var(--status-sage)] font-semibold' : 'text-[var(--accent-ember)] font-semibold'}>
            {isSpecimenClean ? 'Brand #6D28D9 Preserved · AA Contrast' : 'Fails UI / A11y / Budget Gate'}
          </span>
        </div>

        <div className="p-5 sm:p-8">
          {previewVariant === 'landing' && !isSpecimenClean && (
            <div className="slop-specimen-shell relative p-6 sm:p-8 text-center space-y-4">
              <div className="slop-orb-purple" aria-hidden="true" />
              <div className="slop-headline-gradient font-sans text-2xl sm:text-3xl font-extrabold">
                Generic Gradient Headline
              </div>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Centered template prose paired with three uniform glass cards and fixed 650px overflow container.
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
            <div className="p-6 sm:p-8 bg-[#FBF7EE] text-[#16120E] border border-[#DDD4C3] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#9E3308] font-semibold block">
                  Order Router v2.4
                </span>
                <h3 className="font-serif text-3xl text-[#16120E]">
                  Route multi-venue spot orders in 11.8 ms.
                </h3>
                <p className="text-sm text-[#544B40] leading-relaxed max-w-[56ch]">
                  Deterministic clearing engine with pre-trade margin checks and venue latency telemetry.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center min-h-[44px] px-4 py-2 bg-[#6D28D9] text-white font-mono text-xs font-semibold rounded-sm">
                    Deploy Node (#6D28D9 Locked)
                  </span>
                  <span className="inline-flex items-center min-h-[44px] px-4 py-2 bg-white border border-[#857865] text-[#16120E] font-mono text-xs rounded-sm">
                    API Spec
                  </span>
                </div>
              </div>
              <div className="lg:col-span-5 p-5 bg-white border border-[#DDD4C3] space-y-2">
                <span className="font-mono text-xs uppercase text-[#544B40] block">
                  Audited Telemetry
                </span>
                <div className="font-mono text-3xl font-bold text-[#354A21] tabular-nums">
                  99.94% Fill Rate
                </div>
                <span className="font-mono text-xs text-[#544B40] block">
                  Zero 320px overflow · AA Contrast Pass
                </span>
              </div>
            </div>
          )}

          {previewVariant === 'feed' && (
            <div className="p-5 bg-white text-[#16120E] border border-[#DDD4C3] space-y-3">
              <div className="font-serif text-lg font-semibold">Telemetry Feed</div>
              <div className="divide-y divide-[#DDD4C3]">
                {[
                  { label: 'Order Route #1089', val: '12.4 ms' },
                  { label: 'Order Route #1090', val: '14.1 ms' },
                ].map((row) => (
                  <div
                    key={row.label}
                    className={`flex justify-between items-center py-3 px-2 ${
                      isSpecimenClean ? 'text-[#16120E] min-h-[44px]' : 'text-gray-400'
                    }`}
                  >
                    <span className={isSpecimenClean ? 'font-medium text-sm' : 'text-sm'}>
                      {row.label}
                    </span>
                    <span
                      className={`font-mono text-sm tabular-nums ${
                        isSpecimenClean ? 'font-bold text-[#354A21]' : 'text-gray-300'
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
            <div className="p-6 bg-[#110F0C] text-[#EFE6D2] border border-[#302A22] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="font-mono text-xs uppercase font-bold block" style={{ color: isSpecimenClean ? '#8EB86B' : '#F08048' }}>
                  {isSpecimenClean ? 'Level 3 Fallback Contract Satisfied' : 'Uncapped Synchronous WebGL Canvas'}
                </span>
                <p className="text-sm text-[#B5AA95]">
                  {isSpecimenClean
                    ? 'Lazy-loaded via next/dynamic({ ssr: false }), capped at DPR <= 1.5 via @chaff/tier, pauses offscreen, renders static poster on Tier 0.'
                    : 'Synchronous bundle import blocks LCP; DPR [1, 3] burns mobile GPUs; 100vw/100vh overflows viewport.'}
                </p>
              </div>
              <span className="font-mono text-xs px-3 py-1.5 border border-[#736858] shrink-0">
                {isSpecimenClean ? 'DPR <= 1.5 · Tiered' : 'DPR 3.0 · Blocking'}
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
