'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import caseStudiesData from '../../data/case-studies.json';
import { RollingCounter } from '../../components/RollingCounter';

interface CaseStudy {
  id: string;
  name: string;
  category: string;
  level: string;
  framework: string;
  beforeScore: number;
  afterScore: number;
  lighthouseScore: number;
  lcp: string;
  cls: string;
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

const CASE_STUDIES = caseStudiesData as CaseStudy[];

function GalleryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedLevel = searchParams.get('level') || 'all';
  const selectedFramework = searchParams.get('framework') || 'all';
  const selectedCategory = searchParams.get('category') || 'all';
  const activeParam = searchParams.get('id');

  const filteredStudies = useMemo(() => {
    return CASE_STUDIES.filter((study) => {
      const matchLevel = selectedLevel === 'all' || study.level === selectedLevel;
      const matchFramework =
        selectedFramework === 'all' ||
        study.framework.toLowerCase().includes(selectedFramework.toLowerCase());
      const matchCategory =
        selectedCategory === 'all' ||
        study.category.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchLevel && matchFramework && matchCategory;
    });
  }, [selectedLevel, selectedFramework, selectedCategory]);

  const activeStudy = useMemo(() => {
    if (activeParam) {
      const found = filteredStudies.find((s) => s.id === activeParam);
      if (found) return found;
    }
    return filteredStudies[0] || CASE_STUDIES[0];
  }, [activeParam, filteredStudies]);

  const delta = activeStudy.afterScore - activeStudy.beforeScore;

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/gallery?${params.toString()}`);
  };

  const selectStudy = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('id', id);
    router.push(`/gallery?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-16">
      {/* Header Register */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] px-3 py-1 hairline rounded bg-[var(--bg-surface)]">
          <span>EMPIRICAL AUDIT ARCHIVE</span>
          <span>/</span>
          <span>BEFORE & AFTER CASE STUDIES</span>
        </div>
        <h1 className="tracking-tight text-[var(--text-main)] font-serif">
          Audit & Remediation Gallery
        </h1>
        <p className="text-[var(--text-dim)] text-lg max-w-[68ch]">
          Real fixture repositories audited by Chaff. Inspect how AI tells are identified, how intentional brand tokens are locked and preserved, and the verified score leap. Filter via URL parameters.
        </p>
      </div>

      {/* URL Filter Bar (Level, Framework, Category) */}
      <div className="hairline p-4 rounded-md bg-[var(--bg-surface)] space-y-3 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-6 justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[var(--text-dim)] uppercase font-semibold">Level Filter:</span>
            {['all', '1', '2', '3'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => updateParam('level', lvl)}
                className={`px-3 py-1.5 rounded hairline min-h-[44px] transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-bold'
                    : 'bg-[var(--bg-canvas)] text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]'
                }`}
              >
                {lvl === 'all' ? 'All Levels' : `Level ${lvl}`}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[var(--text-dim)] uppercase font-semibold">Framework:</span>
            {['all', 'Next.js', 'Vite'].map((fw) => (
              <button
                key={fw}
                type="button"
                onClick={() => updateParam('framework', fw === 'Next.js' ? 'next' : fw === 'Vite' ? 'vite' : 'all')}
                className={`px-3 py-1.5 rounded hairline min-h-[44px] transition-colors ${
                  (selectedFramework === 'all' && fw === 'all') ||
                  (selectedFramework === 'next' && fw === 'Next.js') ||
                  (selectedFramework === 'vite' && fw === 'Vite')
                    ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-bold'
                    : 'bg-[var(--bg-canvas)] text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]'
                }`}
              >
                {fw}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Case Study Switcher Tabs */}
      <div className="flex flex-wrap gap-2 hairline-b pb-4">
        {filteredStudies.map((study) => {
          const isActive = activeStudy.id === study.id;
          return (
            <button
              key={study.id}
              onClick={() => selectStudy(study.id)}
              className={`btn text-xs font-mono min-h-[44px] px-3.5 py-2 ${
                isActive ? 'primary' : 'bg-[var(--bg-surface)]'
              }`}
            >
              <span>{study.name}</span>
              <span className="opacity-80">
                ({study.beforeScore} &rarr; {study.afterScore})
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Case Study Dossier */}
      <div className="space-y-8">
        {/* Score Transformation Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start hairline p-6 sm:p-8 rounded-md bg-[var(--bg-surface)]">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase text-[var(--accent-ember)] font-semibold">
                {activeStudy.category} • Level {activeStudy.level} • {activeStudy.framework}
              </span>
            </div>
            <h2 className="text-3xl font-serif text-[var(--text-main)]">
              {activeStudy.name}
            </h2>
            <p className="text-sm text-[var(--text-dim)] leading-relaxed max-w-[65ch]">
              {activeStudy.summary}
            </p>

            {/* Performance Telemetry Registers */}
            <div className="grid grid-cols-3 gap-3 pt-3 font-mono text-xs max-w-md">
              <div className="hairline p-2.5 rounded bg-[var(--bg-canvas)] text-center">
                <span className="text-[10px] text-[var(--text-dim)] uppercase block">Lighthouse</span>
                <strong className="text-[var(--status-sage)] text-sm">{activeStudy.lighthouseScore} / 100</strong>
              </div>
              <div className="hairline p-2.5 rounded bg-[var(--bg-canvas)] text-center">
                <span className="text-[10px] text-[var(--text-dim)] uppercase block">Mobile LCP</span>
                <strong className="text-[var(--text-main)] text-sm">{activeStudy.lcp}</strong>
              </div>
              <div className="hairline p-2.5 rounded bg-[var(--bg-canvas)] text-center">
                <span className="text-[10px] text-[var(--text-dim)] uppercase block">CLS</span>
                <strong className="text-[var(--status-sage)] text-sm">{activeStudy.cls}</strong>
              </div>
            </div>
          </div>

          {/* Live Odometer Registers */}
          <div className="lg:col-span-4 flex items-center justify-center gap-4 p-5 rounded hairline bg-[var(--bg-canvas)]">
            <div className="text-center">
              <span className="text-[11px] font-mono text-[var(--status-warn)] block uppercase">
                Before
              </span>
              <RollingCounter
                value={activeStudy.beforeScore}
                className="font-serif text-3xl text-[var(--status-warn)]"
              />
            </div>
            <span className="text-lg font-mono text-[var(--text-dim)]">&rarr;</span>
            <div className="text-center">
              <span className="text-[11px] font-mono text-[var(--status-sage)] block uppercase">
                After
              </span>
              <RollingCounter
                value={activeStudy.afterScore}
                className="font-serif text-3xl text-[var(--status-sage)]"
              />
            </div>
            <div className="text-left pl-3 hairline-l font-mono text-xs text-[var(--status-sage)] font-bold">
              +{delta} pts
            </div>
          </div>
        </div>

        {/* Tells Winnowed vs Preserved Brand Tokens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tells Eliminated */}
          <div className="hairline p-6 rounded-md bg-[var(--bg-surface)] space-y-4">
            <div className="flex justify-between items-baseline hairline-b pb-3">
              <h3 className="text-base font-serif text-[var(--text-main)]">
                Tells Winnowed & Remediated
              </h3>
              <span className="font-mono text-xs text-[var(--accent-ember)] font-semibold">
                {activeStudy.tellsCount} Eliminated
              </span>
            </div>
            <div className="space-y-3 font-mono text-xs">
              {activeStudy.tellsList.map((tell, i) => (
                <div key={i} className="p-3 rounded hairline bg-[var(--bg-canvas)] space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-[var(--accent-ember)]">{tell.rule}</span>
                    <span className="text-[10px] uppercase text-[var(--text-dim)]">{tell.name}</span>
                  </div>
                  <p className="text-[var(--text-dim)] font-sans text-xs">{tell.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tokens Preserved */}
          <div className="hairline p-6 rounded-md bg-[var(--bg-surface)] space-y-4">
            <div className="flex justify-between items-baseline hairline-b pb-3">
              <h3 className="text-base font-serif text-[var(--text-main)]">
                Intentional Identity Preserved
              </h3>
              <span className="font-mono text-xs text-[var(--status-sage)] font-semibold">
                {activeStudy.waivedCount} Locked Waiver(s)
              </span>
            </div>
            <div className="space-y-3 font-mono text-xs">
              {activeStudy.preservedTokens.length === 0 ? (
                <div className="p-3 rounded hairline bg-[var(--bg-canvas)] text-[11px] text-[var(--text-dim)]">
                  Zero identity waivers declared for this fixture. Pure baseline winnowing standard applied.
                </div>
              ) : (
                activeStudy.preservedTokens.map((token, i) => (
                  <div key={i} className="p-3 rounded hairline bg-[var(--bg-canvas)] space-y-1 border-[var(--status-sage)]/40">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-[var(--status-sage)]">CONFIRMED WAIVER</span>
                      <span className="text-[10px] text-[var(--text-main)]">{token.token}</span>
                    </div>
                    <p className="text-[var(--text-dim)] font-sans text-xs">{token.reason}</p>
                  </div>
                ))
              )}
              <div className="p-3 rounded hairline bg-[var(--bg-canvas)] text-[11px] text-[var(--text-dim)]">
                <strong className="text-[var(--text-main)] block mb-1">Identity Lock Principle:</strong>
                Chaff never overwrites brand colors, fonts, or bespoke design tokens. If a token has confidence &gt; 0.80 or exists in DESIGN.md, it is locked and never scored as slop.
              </div>
            </div>
          </div>
        </div>

        {/* Code Diff Ledger */}
        <div className="hairline p-6 sm:p-8 rounded-md bg-[var(--bg-surface)] space-y-4">
          <div className="flex justify-between items-baseline hairline-b pb-3">
            <h3 className="text-xl font-serif text-[var(--text-main)]">
              Before & After Code Comparison
            </h3>
            <span className="font-mono text-xs text-[var(--text-dim)]">Source Diff</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="font-mono text-xs text-[var(--accent-ember)] font-semibold block">
                [CHAFF] {activeStudy.codeDiff.beforeTitle}
              </span>
              <pre className="text-xs font-mono text-[var(--text-main)] overflow-x-auto p-4 bg-[var(--bg-canvas)] rounded hairline border-[var(--accent-ember)]/30 max-h-[380px] leading-relaxed">
                <code>{activeStudy.codeDiff.beforeCode}</code>
              </pre>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs text-[var(--status-sage)] font-semibold block">
                [GRAIN] {activeStudy.codeDiff.afterTitle}
              </span>
              <pre className="text-xs font-mono text-[var(--text-main)] overflow-x-auto p-4 bg-[var(--bg-canvas)] rounded hairline border-[var(--status-sage)]/40 max-h-[380px] leading-relaxed">
                <code>{activeStudy.codeDiff.afterCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-mono text-xs">Loading case study dossiers...</div>}>
      <GalleryContent />
    </Suspense>
  );
}