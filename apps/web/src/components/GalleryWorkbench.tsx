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
        <div className="slop-specimen-shell relative p-5 text-center space-y-3 min-h-[250px] flex flex-col justify-center">
          <div className="slop-orb-purple" aria-hidden="true" />
          <div className="slop-headline-gradient font-sans text-xl font-extrabold">
            {'Empower Your AI Platform'}
          </div>
          <p className="text-xs text-slate-300 max-w-xs mx-auto">
            {'Synthetic SLA and round team counts inside uniform glass cards.'}
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
      <div className="p-5 bg-[#FBF7EE] text-[#16120E] space-y-4 min-h-[250px] flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-[#DDD4C3] pb-2">
          <span className="font-serif text-base font-bold">Kestrel Router</span>
          <span className="font-mono text-[10px] px-2 py-0.5 bg-[#EDE9FE] text-[#6D28D9] font-semibold">
            #6D28D9 Locked
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-7 space-y-2">
            <h4 className="font-serif text-xl leading-tight text-[#16120E]">
              Route spot orders in 11.8 ms.
            </h4>
            <span className="inline-block px-3 py-1.5 bg-[#6D28D9] text-white font-mono text-xs font-semibold">
              Deploy Route
            </span>
          </div>
          <div className="sm:col-span-5 p-3 bg-white border border-[#DDD4C3] font-mono text-xs space-y-1">
            <div className="flex justify-between"><span>Hop</span><strong>11.8 ms</strong></div>
            <div className="flex justify-between"><span>Fill</span><strong className="text-[#354A21]">99.94%</strong></div>
          </div>
        </div>
      </div>
    );
  }

  if (studyId === 'dashboard') {
    return (
      <div className="p-5 bg-white text-[#16120E] min-h-[250px] space-y-3">
        <div className="flex items-center justify-between border-b border-[#DDD4C3] pb-2">
          <span className="font-serif text-base font-bold">Analytics Summary</span>
          <span
            className={`font-mono text-xs px-3 py-1.5 ${
              mode === 'before'
                ? 'bg-blue-500 text-white'
                : 'bg-[#9E3308] text-[#FBF7EE] font-semibold'
            }`}
          >
            {mode === 'before' ? 'div.onClick (No A11y)' : 'button.export'}
          </span>
        </div>
        <div className="divide-y divide-[#DDD4C3] font-mono text-xs">
          <div className="py-2.5 flex justify-between">
            <span className={mode === 'before' ? 'text-gray-400' : 'text-[#16120E]'}>Q1 Settlement</span>
            <span className={mode === 'before' ? 'text-gray-300' : 'font-bold text-[#354A21] tabular-nums'}>$1,234,567.89</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className={mode === 'before' ? 'text-gray-400' : 'text-[#16120E]'}>Q2 Settlement</span>
            <span className={mode === 'before' ? 'text-gray-300' : 'font-bold text-[#354A21] tabular-nums'}>$1,482,110.40</span>
          </div>
        </div>
      </div>
    );
  }

  if (studyId === 'portfolio') {
    if (mode === 'before') {
      return (
        <div className="p-4 bg-[#191612] text-[#EFE6D2] min-h-[250px] overflow-x-auto space-y-3">
          <span className="font-mono text-[11px] text-[#F08048] block">
            Fixed wide child forces horizontal scroll clipping at 390px
          </span>
          <div className="w-[165%] p-4 border border-[#F08048] bg-[#24201A]">
            <h4 className="font-serif text-lg">Creative Showcase</h4>
            <p className="text-xs text-[#B5AA95] mt-1">
              Hardcoded desktop container overflows narrow screens + user-scalable=no blocks pinch zoom.
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="p-5 bg-[#FBF7EE] text-[#16120E] min-h-[250px] space-y-3">
        <div className="border-b border-[#DDD4C3] pb-2 flex justify-between items-baseline">
          <h4 className="font-serif text-lg">Monograph Showcase</h4>
          <span className="font-mono text-[11px] text-[#354A21] font-semibold">0px Overflow</span>
        </div>
        <p className="text-xs text-[#544B40] leading-relaxed">
          Fluid max-w-full layout wraps cleanly at both 320px and 1440px with pinch-to-zoom enabled.
        </p>
        <div className="h-20 bg-[#F2ECE0] border border-[#DDD4C3] flex items-center justify-center font-mono text-xs text-[#544B40]">
          Fluid 16:9 Architectural Frame
        </div>
      </div>
    );
  }

  if (studyId === 'blog') {
    if (mode === 'before') {
      return (
        <div className="p-5 bg-white text-slate-900 min-h-[250px] space-y-3">
          <h4 className="font-sans text-lg font-bold">Understanding Modern Web Typography</h4>
          <p className="text-xs text-slate-400">Placeholder Latin dummy body text left unresolved in article prose.</p>
          <div className="h-20 border border-dashed border-rose-500 bg-rose-50 flex items-center justify-center font-mono text-[11px] text-rose-700">
            Unsized &lt;img&gt; missing alt (Triggers CLS)
          </div>
        </div>
      );
    }
    return (
      <div className="p-5 bg-[#FBF7EE] text-[#16120E] min-h-[250px] space-y-3">
        <h4 className="font-serif text-xl leading-tight">Understanding Modern Web Typography</h4>
        <div className="h-20 bg-[#FFFFFF] border border-[#DDD4C3] flex items-center justify-between px-4 font-mono text-xs">
          <span className="text-[#544B40]">next/image · 16:9 · alt set</span>
          <span className="text-[#354A21] font-bold">CLS 0.00</span>
        </div>
        <p className="text-xs text-[#544B40] leading-relaxed">
          Optical sizing adjusts stroke contrast and tracking across display and reading scales.
        </p>
      </div>
    );
  }

  // vite-react
  return (
    <div className="p-5 bg-[#110F0C] text-[#EFE6D2] min-h-[250px] flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-[#302A22] pb-2 font-mono text-xs">
        <span className="font-bold">WebGL Scene Island</span>
        <span style={{ color: mode === 'before' ? '#F08048' : '#8EB86B' }}>
          {mode === 'before' ? 'DPR 3.0 Uncapped' : 'DPR <= 1.5 · @chaff/tier'}
        </span>
      </div>
      <svg viewBox="0 0 300 110" width="300" height="110" className="w-full h-24 my-2" aria-hidden="true">
        <polygon
          points="150,12 210,45 210,88 150,104 90,88 90,45"
          fill="none"
          stroke={mode === 'before' ? '#F08048' : '#C49A45'}
          strokeWidth="2"
        />
        <circle cx="150" cy="58" r="18" fill={mode === 'before' ? '#6D28D9' : '#8EB86B'} opacity="0.45" />
      </svg>
      <div className="font-mono text-[11px] text-[#B5AA95]">
        {mode === 'before'
          ? 'Synchronous THREE import blocks initial FCP/LCP.'
          : 'Lazy dynamic boundary + IntersectionObserver pause + .dispose().'}
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
    <div className="space-y-8">
      {/* Level Filter & Fixture Switcher */}
      <div className="hairline bg-[var(--bg-surface)] p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-xs uppercase text-[var(--text-dim)] font-semibold mr-2">
              Level:
            </span>
            {['all', '1', '2', '3'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => updateParam('level', lvl)}
                aria-pressed={selectedLevel === lvl}
                className={`px-3 py-1.5 min-h-[44px] font-mono text-xs border transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] border-[var(--accent-ember)] font-bold'
                    : 'bg-[var(--bg-canvas)] text-[var(--text-main)] border-[var(--border-line)] hover:bg-[var(--bg-surface-elevated)]'
                }`}
              >
                {lvl === 'all' ? 'All Levels' : `Level ${lvl}`}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex hairline divide-x divide-[var(--border-line)] bg-[var(--bg-canvas)]">
              <button
                type="button"
                onClick={() => setInspectTab('visual')}
                aria-pressed={inspectTab === 'visual'}
                className={`px-3 py-1.5 min-h-[44px] font-mono text-xs ${
                  inspectTab === 'visual'
                    ? 'bg-[var(--text-main)] text-[var(--bg-surface)] font-bold'
                    : 'text-[var(--text-main)]'
                }`}
              >
                Rendered Frames
              </button>
              <button
                type="button"
                onClick={() => setInspectTab('code')}
                aria-pressed={inspectTab === 'code'}
                className={`px-3 py-1.5 min-h-[44px] font-mono text-xs ${
                  inspectTab === 'code'
                    ? 'bg-[var(--text-main)] text-[var(--bg-surface)] font-bold'
                    : 'text-[var(--text-main)]'
                }`}
              >
                Code Diff
              </button>
            </div>

            {inspectTab === 'visual' && (
              <div className="inline-flex hairline divide-x divide-[var(--border-line)] bg-[var(--bg-canvas)]">
                <button
                  type="button"
                  onClick={() => setViewportMode('desktop')}
                  aria-pressed={viewportMode === 'desktop'}
                  className={`px-3 py-1.5 min-h-[44px] font-mono text-xs ${
                    viewportMode === 'desktop'
                      ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-bold'
                      : 'text-[var(--text-main)]'
                  }`}
                >
                  1440px
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode('mobile')}
                  aria-pressed={viewportMode === 'mobile'}
                  className={`px-3 py-1.5 min-h-[44px] font-mono text-xs ${
                    viewportMode === 'mobile'
                      ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-bold'
                      : 'text-[var(--text-main)]'
                  }`}
                >
                  390px
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-3 hairline-t">
          {filteredStudies.map((study) => {
            const isActive = activeStudy.id === study.id;
            return (
              <button
                key={study.id}
                type="button"
                onClick={() => updateParam('id', study.id)}
                aria-pressed={isActive}
                className={`px-3.5 py-2 min-h-[44px] font-mono text-xs border transition-colors ${
                  isActive
                    ? 'bg-[var(--text-main)] text-[var(--bg-surface)] border-[var(--text-main)] font-bold'
                    : 'bg-[var(--bg-canvas)] text-[var(--text-main)] border-[var(--border-line)] hover:bg-[var(--bg-surface-elevated)]'
                }`}
              >
                <span>{study.name}</span>
                <span className="ml-2 opacity-80 tabular-nums">
                  ({study.beforeScore} &rarr; {study.afterScore})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reconciled Telemetry Summary */}
      <div className="hairline bg-[var(--bg-surface)] p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--text-dim)]">
            <span className="text-[var(--accent-ember)] font-bold">{activeStudy.fixturePath}</span>
            <span aria-hidden="true">·</span>
            <span>Level {activeStudy.level}</span>
            <span aria-hidden="true">·</span>
            <span>{activeStudy.framework}</span>
          </div>
          <h2 className="font-serif text-3xl text-[var(--text-main)]">
            {activeStudy.name}
          </h2>
          <p className="text-sm text-[var(--text-dim)] leading-relaxed max-w-[62ch]">
            {activeStudy.summary}
          </p>
        </div>

        <div className="lg:col-span-5 grid grid-cols-3 gap-4 pt-4 lg:pt-0 lg:pl-6 lg:border-l border-[var(--border-line)] font-mono">
          <div>
            <span className="text-[11px] uppercase text-[var(--text-dim)] block">Static Audit</span>
            <RollingCounter value={activeStudy.beforeScore} className="font-serif text-3xl text-[var(--status-warn)]" />
            <span className="block text-[11px] text-[var(--text-dim)]">Slop {activeStudy.slopIndex}/100</span>
          </div>
          <div>
            <span className="text-[11px] uppercase text-[var(--text-dim)] block">After Fix</span>
            <RollingCounter value={activeStudy.afterScore} className="font-serif text-3xl text-[var(--status-sage)]" />
            <span className="block text-[11px] text-[var(--status-sage)]">+{delta} pts</span>
          </div>
          <div>
            <span className="text-[11px] uppercase text-[var(--text-dim)] block">Gate CI</span>
            <span className="font-serif text-2xl font-bold text-[var(--status-sage)] block mt-1">
              {activeStudy.gateAfter}
            </span>
            <span className="block text-[11px] text-[var(--text-dim)]">
              Was: {activeStudy.gateBefore}
            </span>
          </div>
        </div>
      </div>

      {/* Rendered Visual Frames OR Code Diff */}
      {inspectTab === 'visual' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="hairline bg-[var(--bg-surface)] p-4 sm:p-5 space-y-3 min-w-0">
            <div className="flex items-center justify-between font-mono text-xs pb-2 hairline-b">
              <span className="font-bold text-[var(--accent-ember)] uppercase">
                Before Chaff ({activeStudy.tellsCount} Tells · Gate {activeStudy.gateBefore})
              </span>
              <span className="text-[var(--text-dim)]">
                {viewportMode === 'mobile' ? '390px Frame' : '1440px Desktop'}
              </span>
            </div>
            <div
              className={`hairline overflow-hidden ${
                viewportMode === 'mobile' ? 'w-full max-w-[390px] mx-auto' : 'w-full'
              }`}
            >
              <VisualSpecimenFrame studyId={activeStudy.id} mode="before" />
            </div>
          </div>

          <div className="hairline bg-[var(--bg-surface)] p-4 sm:p-5 space-y-3 min-w-0">
            <div className="flex items-center justify-between font-mono text-xs pb-2 hairline-b">
              <span className="font-bold text-[var(--status-sage)] uppercase">
                After Chaff (Score {activeStudy.afterScore} · Gate {activeStudy.gateAfter})
              </span>
              <span className="text-[var(--text-dim)]">
                {viewportMode === 'mobile' ? '390px Frame' : '1440px Desktop'}
              </span>
            </div>
            <div
              className={`hairline overflow-hidden ${
                viewportMode === 'mobile' ? 'w-full max-w-[390px] mx-auto' : 'w-full'
              }`}
            >
              <VisualSpecimenFrame studyId={activeStudy.id} mode="after" />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="hairline bg-[var(--bg-surface)] p-5 space-y-3 min-w-0">
            <span className="font-mono text-xs font-bold text-[var(--accent-ember)] block">
              {activeStudy.codeDiff.beforeTitle}
            </span>
            <pre className="p-4 bg-[var(--bg-inset)] hairline font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
              <code>{activeStudy.codeDiff.beforeCode}</code>
            </pre>
          </div>

          <div className="hairline bg-[var(--bg-surface)] p-5 space-y-3 min-w-0">
            <span className="font-mono text-xs font-bold text-[var(--status-sage)] block">
              {activeStudy.codeDiff.afterTitle}
            </span>
            <pre className="p-4 bg-[var(--bg-inset)] hairline font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
              <code>{activeStudy.codeDiff.afterCode}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tells Remediated & Preserved Waivers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="hairline bg-[var(--bg-surface)] p-5 space-y-3 min-w-0">
          <h3 className="font-serif text-xl text-[var(--text-main)] pb-2 hairline-b">
            Tells Remediated ({activeStudy.tellsCount})
          </h3>
          <div className="divide-y divide-[var(--border-line)]">
            {activeStudy.tellsList.map((t, i) => (
              <div key={i} className="py-3 space-y-1">
                <div className="flex items-center justify-between gap-2 font-mono text-xs">
                  <Link
                    href={`/rules#${t.rule}`}
                    className="font-bold text-[var(--accent-ember)] underline inline-flex items-center min-h-[44px] min-w-[44px] px-1"
                  >
                    {t.rule}
                  </Link>
                  <span className="text-[var(--text-dim)]">{t.name}</span>
                </div>
                <p className="text-xs text-[var(--text-dim)] leading-relaxed">{t.impact}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hairline bg-[var(--bg-surface)] p-5 space-y-3 min-w-0">
          <h3 className="font-serif text-xl text-[var(--text-main)] pb-2 hairline-b">
            Preserved Brand Identity ({activeStudy.waivedCount})
          </h3>
          {activeStudy.preservedTokens.length === 0 ? (
            <p className="text-xs font-mono text-[var(--text-dim)] py-2">
              No custom brand waivers needed; standard archival craft tokens applied.
            </p>
          ) : (
            <div className="divide-y divide-[var(--border-line)]">
              {activeStudy.preservedTokens.map((tok, i) => (
                <div key={i} className="py-3 space-y-1 font-mono text-xs">
                  <span className="font-bold text-[var(--status-sage)] block">{tok.token}</span>
                  <p className="font-sans text-xs text-[var(--text-dim)] leading-relaxed">{tok.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
