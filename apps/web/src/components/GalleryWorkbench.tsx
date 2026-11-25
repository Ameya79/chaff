'use client';

import React, { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { RollingCounter } from './RollingCounter';

export interface CaseStudyDto {
  id: string;
  name: string;
  fixturePath: string;
  category: string;
  level: string;
  framework: string;
  beforeScore: number;
  afterScore: number;
  slopIndex: number;
  gateBefore: string;
  gateAfter: string;
  tellsCount: number;
  waivedCount: number;
  summary: string;
  tellsList: { rule: string; name: string; impact: string }[];
  preservedTokens: { token: string; reason: string }[];
  codeDiff: {
    beforeTitle: string;
    beforeCode: string;
    afterTitle: string;
    afterCode: string;
  };
}

interface GalleryWorkbenchProps {
  studies: CaseStudyDto[];
}

function VisualSpecimenFrame({
  studyId,
  mode,
}: {
  studyId: string;
  mode: 'before' | 'after';
}) {
  if (studyId === 'saas-landing') {
    if (mode === 'before') {
      return (
        <div className="slop-specimen-shell relative rounded-2xl p-6 text-center space-y-4 min-h-[260px] flex flex-col justify-center">
          <div className="slop-orb-purple" aria-hidden="true" />
          <div className="slop-headline-gradient font-sans text-xl font-extrabold">
            Empower Your AI Platform
          </div>
          <p className="text-xs text-slate-300 max-w-xs mx-auto">
            Synthetic SLA and round team counts inside uniform glass cards.
          </p>
          <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
            <div className="slop-glass-tile p-2 text-slate-200">Card 1</div>
            <div className="slop-glass-tile p-2 text-slate-200">Card 2</div>
            <div className="slop-glass-tile p-2 text-slate-200">Card 3</div>
          </div>
        </div>
      );
    }
    return (
      <div className="rounded-2xl p-6 bg-[var(--bg-surface)] text-[var(--text-main)] space-y-5 min-h-[260px] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-serif text-lg">Kestrel Router</span>
          <span
            className="font-mono text-[11px] px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: 'var(--brand-violet-soft)',
              color: 'var(--brand-violet)',
            }}
          >
            #6D28D9 Locked
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center hairline-t pt-4">
          <div className="sm:col-span-7 space-y-3">
            <h4 className="font-serif text-2xl leading-tight text-[var(--text-main)]">
              11.8 ms median hop.
            </h4>
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#6D28D9] text-white font-mono text-xs">
              Deploy Route
            </span>
          </div>
          <div className="sm:col-span-5 font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[var(--text-dim)]">Hop</span>
              <strong>11.8 ms</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-dim)]">Fill</span>
              <strong className="text-[var(--status-sage)]">99.94%</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (studyId === 'dashboard') {
    return (
      <div
        className={`rounded-2xl p-6 min-h-[260px] space-y-4 ${
          mode === 'before'
            ? 'bg-white text-slate-900'
            : 'bg-[var(--bg-surface)] text-[var(--text-main)]'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-serif text-lg">Analytics Summary</span>
          <span
            className={`font-mono text-xs px-3 py-1 rounded-full ${
              mode === 'before'
                ? 'bg-blue-500 text-white'
                : 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-semibold'
            }`}
          >
            {mode === 'before' ? 'div.onClick' : 'button.export'}
          </span>
        </div>
        <div
          className={`divide-y font-mono text-xs ${
            mode === 'before' ? 'divide-slate-200' : 'divide-[var(--border-line)]'
          }`}
        >
          <div className="py-3 flex justify-between">
            <span className={mode === 'before' ? 'text-gray-400' : 'text-[var(--text-main)]'}>
              Q1 Settlement
            </span>
            <span
              className={
                mode === 'before'
                  ? 'text-gray-300'
                  : 'font-semibold text-[var(--status-sage)] tabular-nums'
              }
            >
              $1,234,567.89
            </span>
          </div>
          <div className="py-3 flex justify-between">
            <span className={mode === 'before' ? 'text-gray-400' : 'text-[var(--text-main)]'}>
              Q2 Settlement
            </span>
            <span
              className={
                mode === 'before'
                  ? 'text-gray-300'
                  : 'font-semibold text-[var(--status-sage)] tabular-nums'
              }
            >
              $1,482,110.40
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (studyId === 'portfolio') {
    if (mode === 'before') {
      return (
        <div className="rounded-2xl p-5 bg-[#121216] text-[#F4F1EA] min-h-[260px] overflow-x-auto space-y-3">
          <span className="font-mono text-xs text-[#F2713A] block">
            Fixed width overflows 390px viewport + zoom disabled
          </span>
          <div className="w-[165%] p-5 rounded-xl bg-[#18181D]">
            <h4 className="font-serif text-lg">Creative Showcase</h4>
            <p className="text-xs text-[#9D968B] mt-1">
              Hardcoded container forces horizontal scroll clipping.
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="rounded-2xl p-6 bg-[var(--bg-surface)] text-[var(--text-main)] min-h-[260px] space-y-4">
        <div className="flex justify-between items-baseline">
          <h4 className="font-serif text-lg">Monograph Showcase</h4>
          <span className="font-mono text-xs text-[var(--status-sage)]">0px Overflow</span>
        </div>
        <p className="text-xs text-[var(--text-dim)] leading-relaxed">
          Fluid max-w-full layout wraps cleanly at 320px and 1440px.
        </p>
        <div className="h-24 rounded-xl bg-[var(--bg-surface-elevated)] flex items-center justify-center font-mono text-xs text-[var(--text-dim)]">
          Fluid 16:9 Architectural Frame
        </div>
      </div>
    );
  }

  if (studyId === 'blog') {
    if (mode === 'before') {
      return (
        <div className="rounded-2xl p-6 bg-white text-slate-900 min-h-[260px] space-y-3">
          <h4 className="font-sans text-lg font-bold">Understanding Web Typography</h4>
          <p className="text-xs text-slate-400">
            Dummy placeholder body text left unresolved in prose.
          </p>
          <div className="h-24 rounded-xl bg-rose-50 flex items-center justify-center font-mono text-xs text-rose-700">
            Unsized &lt;img&gt; missing alt (CLS)
          </div>
        </div>
      );
    }
    return (
      <div className="rounded-2xl p-6 bg-[var(--bg-surface)] text-[var(--text-main)] min-h-[260px] space-y-4">
        <h4 className="font-serif text-xl leading-tight">Understanding Web Typography</h4>
        <div className="h-20 rounded-xl bg-[var(--bg-surface-elevated)] flex items-center justify-between px-4 font-mono text-xs">
          <span className="text-[var(--text-dim)]">next/image · 16:9 · alt set</span>
          <span className="text-[var(--status-sage)] font-semibold">CLS 0.00</span>
        </div>
        <p className="text-xs text-[var(--text-dim)] leading-relaxed">
          Optical sizing balances stroke contrast across display and reading scales.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-6 bg-[#111114] text-[#F4F1EA] min-h-[260px] flex flex-col justify-between">
      <div className="flex items-center justify-between font-mono text-xs">
        <span>WebGL Scene Island</span>
        <span style={{ color: mode === 'before' ? '#F2713A' : '#7DC885' }}>
          {mode === 'before' ? 'DPR 3.0 Uncapped' : 'DPR <= 1.5 · @chaff/tier'}
        </span>
      </div>
      <svg viewBox="0 0 300 110" width="300" height="110" className="w-full h-24 my-2" aria-hidden="true">
        <polygon
          points="150,12 210,45 210,88 150,104 90,88 90,45"
          fill="none"
          stroke={mode === 'before' ? '#F2713A' : '#F2B84B'}
          strokeWidth="1.6"
        />
        <circle cx="150" cy="58" r="18" fill={mode === 'before' ? '#6D28D9' : '#7DC885'} opacity="0.45" />
      </svg>
      <div className="font-mono text-xs text-[#9D968B]">
        {mode === 'before'
          ? 'Synchronous THREE import blocks FCP/LCP.'
          : 'Dynamic lazy boundary + offscreen pause + .dispose().'}
      </div>
    </div>
  );
}

export function GalleryWorkbench({ studies }: GalleryWorkbenchProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedLevel = searchParams.get('level') || 'all';
  const activeParam = searchParams.get('id');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [inspectTab, setInspectTab] = useState<'visual' | 'code'>('visual');

  const filteredStudies = useMemo(() => {
    return studies.filter((s) => selectedLevel === 'all' || s.level === selectedLevel);
  }, [studies, selectedLevel]);

  const activeStudy = useMemo(() => {
    if (activeParam) {
      const found = filteredStudies.find((s) => s.id === activeParam);
      if (found) return found;
    }
    return filteredStudies[0] || studies[0];
  }, [activeParam, filteredStudies, studies]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(`/gallery?${params.toString()}`, { scroll: false });
  };

  const delta = activeStudy.afterScore - activeStudy.beforeScore;

  return (
    <div className="space-y-10">
      {/* Borderless Level & Fixture Controls */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {['all', '1', '2', '3'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => updateParam('level', lvl)}
                aria-pressed={selectedLevel === lvl}
                className={`px-3.5 py-2 rounded-full min-h-[44px] min-w-[44px] font-mono text-xs transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-semibold'
                    : 'bg-[var(--bg-surface)] text-[var(--text-dim)] hover:text-[var(--text-main)]'
                }`}
              >
                {lvl === 'all' ? 'All' : `L${lvl}`}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-full bg-[var(--bg-surface)] p-1 gap-1">
              <button
                type="button"
                onClick={() => setInspectTab('visual')}
                aria-pressed={inspectTab === 'visual'}
                className={`px-3.5 py-1.5 rounded-full min-h-[44px] min-w-[44px] font-mono text-xs transition-colors ${
                  inspectTab === 'visual'
                    ? 'bg-[var(--text-main)] text-[var(--bg-canvas)] font-semibold'
                    : 'text-[var(--text-dim)]'
                }`}
              >
                Frames
              </button>
              <button
                type="button"
                onClick={() => setInspectTab('code')}
                aria-pressed={inspectTab === 'code'}
                className={`px-3.5 py-1.5 rounded-full min-h-[44px] min-w-[44px] font-mono text-xs transition-colors ${
                  inspectTab === 'code'
                    ? 'bg-[var(--text-main)] text-[var(--bg-canvas)] font-semibold'
                    : 'text-[var(--text-dim)]'
                }`}
              >
                Diff
              </button>
            </div>

            {inspectTab === 'visual' && (
              <div className="inline-flex rounded-full bg-[var(--bg-surface)] p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setViewportMode('desktop')}
                  aria-pressed={viewportMode === 'desktop'}
                  className={`px-3.5 py-1.5 rounded-full min-h-[44px] min-w-[44px] font-mono text-xs transition-colors ${
                    viewportMode === 'desktop'
                      ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-semibold'
                      : 'text-[var(--text-dim)]'
                  }`}
                >
                  1440px
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode('mobile')}
                  aria-pressed={viewportMode === 'mobile'}
                  className={`px-3.5 py-1.5 rounded-full min-h-[44px] min-w-[44px] font-mono text-xs transition-colors ${
                    viewportMode === 'mobile'
                      ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-semibold'
                      : 'text-[var(--text-dim)]'
                  }`}
                >
                  390px
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {filteredStudies.map((study) => {
            const isActive = activeStudy.id === study.id;
            return (
              <button
                key={study.id}
                type="button"
                onClick={() => updateParam('id', study.id)}
                aria-pressed={isActive}
                className={`px-4 py-2 rounded-full min-h-[44px] min-w-[44px] font-mono text-xs transition-colors ${
                  isActive
                    ? 'bg-[var(--text-main)] text-[var(--bg-canvas)] font-semibold'
                    : 'bg-[var(--bg-surface)] text-[var(--text-dim)] hover:text-[var(--text-main)]'
                }`}
              >
                <span>{study.name}</span>
                <span className="ml-2 opacity-75 tabular-nums">
                  {study.beforeScore}&rarr;{study.afterScore}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Open Score Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center hairline-y py-8">
        <div className="lg:col-span-7 space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--text-dim)]">
            <span className="text-[var(--accent-ember)]">{activeStudy.fixturePath}</span>
            <span aria-hidden="true">·</span>
            <span>Level {activeStudy.level}</span>
            <span aria-hidden="true">·</span>
            <span>{activeStudy.framework}</span>
          </div>
          <h2 className="font-serif text-3xl text-[var(--text-main)]">
            {activeStudy.name}
          </h2>
          <p className="text-sm text-[var(--text-dim)] max-w-[56ch]">
            {activeStudy.summary}
          </p>
        </div>

        <div className="lg:col-span-5 grid grid-cols-3 gap-6 font-mono">
          <div>
            <span className="text-xs text-[var(--text-dim)] block">Before</span>
            <RollingCounter value={activeStudy.beforeScore} className="font-serif text-3xl text-[var(--status-warn)]" />
          </div>
          <div>
            <span className="text-xs text-[var(--text-dim)] block">After</span>
            <RollingCounter value={activeStudy.afterScore} className="font-serif text-3xl text-[var(--status-sage)]" />
            <span className="block text-[11px] text-[var(--status-sage)]">+{delta} pts</span>
          </div>
          <div>
            <span className="text-xs text-[var(--text-dim)] block">Gate</span>
            <span className="font-serif text-3xl text-[var(--status-sage)] block">
              {activeStudy.gateAfter}
            </span>
          </div>
        </div>
      </div>

      {/* Rendered Frames OR Diff */}
      {inspectTab === 'visual' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3 min-w-0">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--accent-ember)]">
                Before ({activeStudy.tellsCount} tells)
              </span>
              <span className="text-[var(--text-dim)]">
                {viewportMode === 'mobile' ? '390px' : '1440px'}
              </span>
            </div>
            <div className={viewportMode === 'mobile' ? 'w-full max-w-[390px] mx-auto' : 'w-full'}>
              <VisualSpecimenFrame studyId={activeStudy.id} mode="before" />
            </div>
          </div>

          <div className="space-y-3 min-w-0">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--status-sage)]">
                After ({activeStudy.afterScore}/100)
              </span>
              <span className="text-[var(--text-dim)]">
                {viewportMode === 'mobile' ? '390px' : '1440px'}
              </span>
            </div>
            <div className={viewportMode === 'mobile' ? 'w-full max-w-[390px] mx-auto' : 'w-full'}>
              <VisualSpecimenFrame studyId={activeStudy.id} mode="after" />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-2 min-w-0">
            <span className="font-mono text-xs text-[var(--accent-ember)] block">
              {activeStudy.codeDiff.beforeTitle}
            </span>
            <pre className="p-5 rounded-2xl bg-[var(--bg-surface)] font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
              <code>{activeStudy.codeDiff.beforeCode}</code>
            </pre>
          </div>

          <div className="space-y-2 min-w-0">
            <span className="font-mono text-xs text-[var(--status-sage)] block">
              {activeStudy.codeDiff.afterTitle}
            </span>
            <pre className="p-5 rounded-2xl bg-[var(--bg-surface)] font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
              <code>{activeStudy.codeDiff.afterCode}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tells & Preserved Tokens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
        <div className="space-y-3 min-w-0">
          <h3 className="font-serif text-xl text-[var(--text-main)]">
            Tells Fixed ({activeStudy.tellsCount})
          </h3>
          <div className="divide-y divide-[var(--border-line)]">
            {activeStudy.tellsList.map((t, i) => (
              <div key={i} className="py-3 space-y-1">
                <div className="flex items-center justify-between gap-2 font-mono text-xs">
                  <Link
                    href={`/rules#${t.rule}`}
                    className="text-[var(--accent-ember)] underline inline-flex items-center min-h-[44px] min-w-[44px]"
                  >
                    {t.rule}
                  </Link>
                  <span className="text-[var(--text-dim)]">{t.name}</span>
                </div>
                <p className="text-xs text-[var(--text-dim)]">{t.impact}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 min-w-0">
          <h3 className="font-serif text-xl text-[var(--text-main)]">
            Identity Kept ({activeStudy.waivedCount})
          </h3>
          {activeStudy.preservedTokens.length === 0 ? (
            <p className="text-xs font-mono text-[var(--text-dim)] py-3">
              Standard craft tokens applied.
            </p>
          ) : (
            <div className="divide-y divide-[var(--border-line)]">
              {activeStudy.preservedTokens.map((tok, i) => (
                <div key={i} className="py-3 space-y-1 font-mono text-xs">
                  <span className="text-[var(--status-sage)] block">{tok.token}</span>
                  <p className="font-sans text-xs text-[var(--text-dim)]">{tok.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
