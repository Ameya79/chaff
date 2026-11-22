'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import caseStudiesData from '../../data/case-studies.json';

interface CaseStudy {
  id: string;
  name: string;
  category: string;
  beforeScore: number;
  afterScore: number;
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

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<string>('saas-landing');
  const activeStudy = CASE_STUDIES.find(c => c.id === activeTab) || CASE_STUDIES[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      {/* Header */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] px-2.5 py-1 hairline rounded bg-[var(--bg-surface)]">
          <span>Case Studies</span>
          <span>/</span>
          <span>Empirical Proof</span>
        </div>
        <h1 className="tracking-tight text-[var(--text-main)]">
          Audit & Remediation Gallery
        </h1>
        <p className="text-lg text-[var(--text-dim)] max-w-3xl leading-relaxed">
          Inspect how Chaff audits real codebases, winnows synthetic AI tells, preserves intentional brand assets, and protects performance budgets.
        </p>
      </section>

      {/* Case Study Switcher */}
      <div className="flex flex-wrap gap-2 hairline-b pb-4">
        {CASE_STUDIES.map(study => (
          <button
            key={study.id}
            onClick={() => setActiveTab(study.id)}
            className={`btn text-xs font-mono ${activeTab === study.id ? 'primary' : ''}`}
          >
            {study.name} ({study.beforeScore} → {study.afterScore})
          </button>
        ))}
      </div>

      {/* Active Case Study Detail */}
      <div className="space-y-12">
        {/* Score Card Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start hairline p-6 sm:p-8 rounded-lg bg-[var(--bg-surface)]">
          <div className="lg:col-span-8 space-y-3">
            <span className="font-mono text-xs uppercase text-[var(--accent-ember)] font-semibold">
              {activeStudy.category}
            </span>
            <h2 className="text-3xl font-serif text-[var(--text-main)]">
              {activeStudy.name}
            </h2>
            <p className="text-sm text-[var(--text-dim)] leading-relaxed">
              {activeStudy.summary}
            </p>
          </div>

          <div className="lg:col-span-4 flex items-center justify-center gap-4 p-4 rounded hairline bg-[var(--bg-canvas)]">
            <div className="text-center">
              <span className="text-xs font-mono text-[var(--status-warn)] block">Before</span>
              <span className="font-serif text-3xl font-bold text-[var(--status-warn)]">{activeStudy.beforeScore}</span>
            </div>
            <span className="text-lg font-mono text-[var(--text-dim)]">→</span>
            <div className="text-center">
              <span className="text-xs font-mono text-[var(--status-sage)] block">After</span>
              <span className="font-serif text-3xl font-bold text-[var(--status-sage)]">{activeStudy.afterScore}</span>
            </div>
            <div className="text-left pl-3 hairline-l font-mono text-xs text-[var(--status-sage)]">
              +{activeStudy.afterScore - activeStudy.beforeScore} pts
            </div>
          </div>
        </div>

        {/* Tells Eliminated & Tokens Preserved */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="hairline p-6 rounded-lg bg-[var(--bg-surface)] space-y-4">
            <h3 className="text-base font-serif text-[var(--text-main)] flex items-center justify-between">
              <span>Tells Eliminated</span>
              <span className="font-mono text-xs text-[var(--status-sage)] font-normal">{activeStudy.tellsCount} Winnowed</span>
            </h3>
            <ul className="space-y-3">
              {activeStudy.tellsList.map(t => (
                <li key={t.rule} className="p-3 hairline rounded bg-[var(--bg-canvas)] text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[var(--accent-ember)] font-bold">{t.rule}</span>
                    <span className="font-medium text-[var(--text-main)]">{t.name}</span>
                  </div>
                  <p className="text-[var(--text-dim)] leading-normal">{t.impact}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="hairline p-6 rounded-lg bg-[var(--bg-surface)] space-y-4">
            <h3 className="text-base font-serif text-[var(--text-main)] flex items-center justify-between">
              <span>Preserved Brand Tokens</span>
              <span className="font-mono text-xs text-[var(--status-sage)] font-normal">{activeStudy.waivedCount} Locked Waivers</span>
            </h3>
            {activeStudy.preservedTokens.length > 0 ? (
              <ul className="space-y-3">
                {activeStudy.preservedTokens.map((tok, i) => (
                  <li key={i} className="p-3 hairline rounded bg-[var(--bg-canvas)] text-xs space-y-1 border-[var(--status-sage)]">
                    <span className="font-mono text-[var(--status-sage)] font-bold block">{tok.token}</span>
                    <p className="text-[var(--text-dim)] leading-normal">{tok.reason}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center hairline rounded bg-[var(--bg-canvas)] text-xs text-[var(--text-dim)] font-mono">
                No waivers requested. Zero synthetic styling detected post-audit.
              </div>
            )}

            <div className="p-4 rounded hairline bg-[var(--bg-canvas)] text-xs font-mono text-[var(--text-dim)] space-y-1 mt-4">
              <span className="font-bold text-[var(--text-main)] block">Identity Lock Policy</span>
              <p>Chaff automatically records waivers for intentional brand tokens declared in DESIGN.md, preventing false positives from lowering the score.</p>
            </div>
          </div>
        </div>

        {/* Code Diff Comparison */}
        <div className="space-y-4">
          <h3 className="text-xl font-serif text-[var(--text-main)]">
            Code Comparison
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="hairline rounded-lg overflow-hidden bg-[var(--bg-surface)]">
              <div className="p-3 bg-[var(--bg-surface-elevated)] hairline-b font-mono text-xs text-[var(--status-warn)] font-bold flex justify-between">
                <span>{activeStudy.codeDiff.beforeTitle}</span>
                <span>Score: {activeStudy.beforeScore}</span>
              </div>
              <pre className="p-4 text-xs font-mono overflow-x-auto text-[var(--text-main)] leading-relaxed max-h-[480px]">
                {activeStudy.codeDiff.beforeCode}
              </pre>
            </div>

            <div className="hairline rounded-lg overflow-hidden bg-[var(--bg-surface)] border-[var(--status-sage)]">
              <div className="p-3 bg-[var(--status-sage-soft)] hairline-b font-mono text-xs text-[var(--status-sage)] font-bold flex justify-between">
                <span>{activeStudy.codeDiff.afterTitle}</span>
                <span>Score: {activeStudy.afterScore}</span>
              </div>
              <pre className="p-4 text-xs font-mono overflow-x-auto text-[var(--text-main)] leading-relaxed max-h-[480px]">
                {activeStudy.codeDiff.afterCode}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-8 hairline-t flex flex-wrap justify-between items-center gap-4">
        <Link href="/levels" className="btn">
          ← View Creative Levels
        </Link>
        <Link href="/playground" className="btn primary">
          Try Live Playground →
        </Link>
      </div>
    </div>
  );
}
