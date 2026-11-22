'use client';

import React, { useMemo, Suspense } from 'react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-16">
      {/* Header Register */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 hairline-b pb-3 font-mono text-xs text-[var(--text-dim)]">
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent-ember)] font-bold">ARCHIVE //</span>
            <span className="uppercase tracking-widest text-[var(--text-main)] font-semibold">EMPIRICAL CASE STUDIES</span>
          </div>
          <div>BEFORE &amp; AFTER AUDIT DOSSIERS</div>
        </div>
        <h1 className="tracking-tight text-[var(--text-main)] font-serif">
          Audit &amp; Remediation Gallery
        </h1>
        <p className="text-[var(--text-dim)] text-lg max-w-[68ch]">
          Real fixture repositories audited by Chaff. Inspect how AI tells are identified, how intentional brand tokens are locked and preserved, and the verified score leap. Filter via URL parameters.
        </p>
      </div>

      {/* URL Filter & Switcher Bar (Continuous Ruled Toolbar, Zero Cards) */}
      <div className="hairline-y py-4 px-2 sm:px-4 space-y-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-6 justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[var(--text-dim)] uppercase font-semibold mr-2">Level Filter:</span>
            {['all', '1', '2', '3'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => updateParam('level', lvl)}
                className={`px-3 py-1.5 min-h-[44px] transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-bold'
                    : 'bg-[var(--bg-canvas)] text-[var(--text-main)] hairline hover:bg-[var(--bg-surface-elevated)]'
                }`}
              >
                {lvl === 'all' ? 'All Levels' : `Level ${lvl}`}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[var(--text-dim)] uppercase font-semibold mr-2">Framework:</span>
            {['all', 'Next.js', 'Vite'].map((fw) => (
              <button
                key={fw}
                type="button"
                onClick={() => updateParam('framework', fw === 'Next.js' ? 'next' : fw === 'Vite' ? 'vite' : 'all')}
                className={`px-3 py-1.5 min-h-[44px] transition-colors ${
                  (selectedFramework === 'all' && fw === 'all') ||
                  (selectedFramework === 'next' && fw === 'Next.js') ||
                  (selectedFramework === 'vite' && fw === 'Vite')
                    ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-bold'
                    : 'bg-[var(--bg-canvas)] text-[var(--text-main)] hairline hover:bg-[var(--bg-surface-elevated)]'
                }`}
              >
                {fw}
              </button>
            ))}
          </div>
        </div>

        {/* Case Study Switcher Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-2 hairline-t border-[var(--border-line)]">
          {filteredStudies.map((study) => {
            const isActive = activeStudy.id === study.id;
            return (
              <button
                key={study.id}
                onClick={() => selectStudy(study.id)}
                className={`text-xs font-mono min-h-[44px] px-3.5 py-2 transition-colors ${
                  isActive
                    ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-bold'
                    : 'bg-[var(--bg-canvas)] text-[var(--text-main)] hairline hover:bg-[var(--bg-surface-elevated)]'
                }`}
              >
                <span>{study.name}</span>
                <span className="opacity-80 ml-1.5 tabular-nums">
                  ({study.beforeScore} &rarr; {study.afterScore})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Case Study Documentation Sheet (Margin Headers, Zero Cards) */}
      <div className="space-y-12">
        {/* Score Transformation Header Sheet with Margin Header */}
        <div className="hairline-y py-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Margin Header */}
            <div className="lg:col-span-3 space-y-3 font-mono text-xs">
              <span className="font-mono text-xs uppercase text-[var(--accent-ember)] font-bold block">
                STUDY DOSSIER //
              </span>
              <div className="space-y-1 text-[var(--text-dim)]">
                <div>Domain: <strong className="text-[var(--text-main)] uppercase">{activeStudy.category}</strong></div>
                <div>Level: <strong className="text-[var(--text-main)]">Level {activeStudy.level}</strong></div>
                <div>Framework: <strong className="text-[var(--text-main)]">{activeStudy.framework}</strong></div>
              </div>

              {/* Ruled Telemetry Metric List */}
              <div className="hairline-y py-3 space-y-2 text-[11px] pt-3">
                <div className="flex justify-between">
                  <span className="text-[var(--text-dim)] uppercase">Lighthouse</span>
                  <strong className="text-[var(--status-sage)] font-bold">{activeStudy.lighthouseScore} / 100</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-dim)] uppercase">Mobile LCP</span>
                  <strong className="text-[var(--text-main)] font-bold">{activeStudy.lcp}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-dim)] uppercase">CLS</span>
                  <strong className="text-[var(--status-sage)] font-bold">{activeStudy.cls}</strong>
                </div>
              </div>
              <div className="text-[11px] text-[var(--text-dim)]">
                Tally: <strong className="text-[var(--text-main)]">|||| ||||</strong>
              </div>
            </div>

            {/* Right Main Stream */}
            <div className="lg:col-span-9 lg:border-l border-[var(--border-line)] lg:pl-8 space-y-5">
              <h2 className="text-3xl sm:text-4xl font-serif text-[var(--text-main)]">
                {activeStudy.name}
              </h2>
              <p className="text-sm text-[var(--text-dim)] leading-relaxed max-w-[65ch]">
                {activeStudy.summary}
              </p>

              {/* Score Leap Register */}
              <div className="hairline-y py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                <div className="flex items-baseline gap-6">
                  <div>
                    <span className="text-[10px] text-[var(--status-warn)] uppercase block font-bold">Before Chaff</span>
                    <RollingCounter
                      value={activeStudy.beforeScore}
                      className="font-serif text-4xl text-[var(--status-warn)] font-bold"
                    />
                  </div>
                  <span className="text-2xl text-[var(--text-dim)] font-serif">&rarr;</span>
                  <div>
                    <span className="text-[10px] text-[var(--status-sage)] uppercase block font-bold">Winnowed Grain</span>
                    <RollingCounter
                      value={activeStudy.afterScore}
                      className="font-serif text-4xl text-[var(--status-sage)] font-bold"
                    />
                  </div>
                </div>

                <div className="text-sm text-[var(--status-sage)] font-bold sm:text-right">
                  +{delta} Net Point Improvement
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tells Winnowed vs Preserved Brand Tokens (Continuous Ruled Comparative Columns) */}
        <div className="hairline-y py-8 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border-line)]">
          {/* Tells Eliminated */}
          <div className="py-4 px-2 sm:px-6 space-y-4">
            <div className="flex justify-between items-baseline hairline-b pb-3">
              <div>
                <span className="font-mono text-[10px] text-[var(--accent-ember)] uppercase font-bold block">
                  DEFECT REMEDIATION
                </span>
                <h3 className="text-xl font-serif text-[var(--text-main)] mt-0.5">
                  Tells Winnowed &amp; Remediated
                </h3>
              </div>
              <span className="font-mono text-xs text-[var(--accent-ember)] font-semibold">
                {activeStudy.tellsCount} Eliminated
              </span>
            </div>

            <div className="hairline-y divide-y divide-[var(--border-line)] font-mono text-xs">
              {activeStudy.tellsList.map((tell, i) => (
                <div key={i} className="py-3 space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-[var(--accent-ember)]">{tell.rule} //</span>
                    <span className="text-[10px] uppercase text-[var(--text-dim)]">{tell.name}</span>
                  </div>
                  <p className="text-[var(--text-dim)] font-sans text-xs">{tell.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tokens Preserved */}
          <div className="py-4 px-2 sm:px-6 space-y-4">
            <div className="flex justify-between items-baseline hairline-b pb-3">
              <div>
                <span className="font-mono text-[10px] text-[var(--status-sage)] uppercase font-bold block">
                  IDENTITY LOCK ARCHITECTURE
                </span>
                <h3 className="text-xl font-serif text-[var(--text-main)] mt-0.5">
                  Intentional Identity Preserved
                </h3>
              </div>
              <span className="font-mono text-xs text-[var(--status-sage)] font-semibold">
                {activeStudy.waivedCount} Locked Waiver(s)
              </span>
            </div>

            <div className="hairline-y divide-y divide-[var(--border-line)] font-mono text-xs">
              {activeStudy.preservedTokens.length === 0 ? (
                <div className="py-4 text-[11px] text-[var(--text-dim)]">
                  Zero identity waivers declared for this fixture. Pure baseline winnowing standard applied.
                </div>
              ) : (
                activeStudy.preservedTokens.map((token, i) => (
                  <div key={i} className="py-3 space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-[var(--status-sage)]">CONFIRMED WAIVER //</span>
                      <span className="text-[11px] text-[var(--text-main)] font-semibold">{token.token}</span>
                    </div>
                    <p className="text-[var(--text-dim)] font-sans text-xs">{token.reason}</p>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 text-[11px] font-mono text-[var(--text-dim)]">
              <strong className="text-[var(--text-main)] block mb-1">Identity Lock Invariant:</strong>
              Tokens with confidence &gt; 0.80 or in DESIGN.md are locked and never scored as slop.
            </div>
          </div>
        </div>

        {/* Code Diff Continuous Ruled Ledger (Zero Cards) */}
        <div className="hairline-y py-8 space-y-4">
          <div className="flex justify-between items-baseline hairline-b pb-3">
            <div>
              <span className="font-mono text-[10px] text-[var(--accent-ember)] uppercase font-bold block">
                SOURCE TRANSFORMATION
              </span>
              <h3 className="text-2xl font-serif text-[var(--text-main)] mt-0.5">
                Before &amp; After Code Comparison
              </h3>
            </div>
            <span className="font-mono text-xs text-[var(--text-dim)]">AST &amp; Syntax Verification</span>
          </div>

          <div className="hairline-y divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-line)] grid grid-cols-1 lg:grid-cols-2">
            <div className="py-4 sm:px-4 space-y-2">
              <span className="font-mono text-xs text-[var(--accent-ember)] font-semibold block">
                [CHAFF] {activeStudy.codeDiff.beforeTitle}
              </span>
              <pre className="text-xs font-mono text-[var(--text-main)] overflow-x-auto p-4 bg-[var(--bg-canvas)] hairline max-h-[380px] leading-relaxed">
                <code>{activeStudy.codeDiff.beforeCode}</code>
              </pre>
            </div>

            <div className="py-4 sm:px-4 space-y-2">
              <span className="font-mono text-xs text-[var(--status-sage)] font-semibold block">
                [GRAIN] {activeStudy.codeDiff.afterTitle}
              </span>
              <pre className="text-xs font-mono text-[var(--text-main)] overflow-x-auto p-4 bg-[var(--bg-canvas)] hairline max-h-[380px] leading-relaxed">
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
