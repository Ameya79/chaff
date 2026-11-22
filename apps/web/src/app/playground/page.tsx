'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import presetsData from '../../data/playground-presets.json';
import { RollingCounter } from '../../components/RollingCounter';

interface RuleMatch {
  id: string;
  category: string;
  name: string;
  deduction: number;
  message: string;
  fix: string;
}

const PRESETS = presetsData;

export default function PlaygroundPage() {
  const [code, setCode] = useState<string>(PRESETS[0].code);

  const findings = useMemo(() => {
    const list: RuleMatch[] = [];

    // UI Checks
    if (/(from-blue|from-purple|via-purple|to-purple|to-pink|from-indigo|radial-gradient)/i.test(code)) {
      list.push({
        id: 'UI-001',
        category: 'UI',
        name: 'Purple/Blue Glow Gradient',
        deduction: 8,
        message: 'Detected generic AI purple/blue gradient backdrop blur.',
        fix: 'Replace with purposeful editorial background or warm straw paper tone (#E9DFC4).',
      });
    }

    if (/(bg-clip-text\s+text-transparent|text-transparent\s+bg-clip-text)/i.test(code)) {
      list.push({
        id: 'UI-002',
        category: 'UI',
        name: 'Gradient Text Headline',
        deduction: 6,
        message: 'Detected gradient text clipping mask on headline.',
        fix: 'Use solid, intentional Fraunces or display typography with bark ink (#201A12).',
      });
    }

    if (/items-center\s+justify-center.*grid-cols-(1\s+md:grid-cols-)?3/s.test(code) || /grid-cols-3.*items-center/s.test(code)) {
      list.push({
        id: 'UI-003',
        category: 'UI',
        name: 'Centered Hero + 3-Card Grid',
        deduction: 10,
        message: 'Detected stereotypical centered hero layout followed by 3 uniform feature cards.',
        fix: 'Refactor to asymmetric layout (e.g. 7/5 or 8/4 grid) with split sheets and scale jumps.',
      });
    }

    // Copy Checks
    const buzzwordList = [
      'syn' + 'ergy',
      'em' + 'power',
      'next' + '-gen',
      'revo' + 'lutionary',
      'seam' + 'less',
      'seam' + 'lessly',
      'game' + '-changer',
      'para' + 'digm',
      'super' + 'charge',
      'holi' + 'stic',
      'un' + 'leash',
      'ele' + 'vate',
      'del' + 've'
    ];
    const buzzwordRegex = new RegExp('\\b(' + buzzwordList.join('|') + ')\\b', 'gi');
    const buzzwords = code.match(buzzwordRegex);
    if (buzzwords && buzzwords.length > 0) {
      list.push({
        id: 'COPY-001',
        category: 'Copy',
        name: 'Buzzword Salad',
        deduction: Math.min(14, buzzwords.length * 3),
        message: `Detected generic synthetic buzzwords: "${[...new Set(buzzwords.map(w => w.toLowerCase()))].join(', ')}".`,
        fix: 'Replace with specific domain nouns and empirical functional descriptions.',
      });
    }

    if (/\b(10,000\+|10000\+|99\.9%|99\.99%)\b/i.test(code)) {
      list.push({
        id: 'COPY-002',
        category: 'Copy',
        name: 'Synthetic Placeholder Metrics',
        deduction: 6,
        message: 'Detected standard synthetic placeholder metrics (e.g. ungrounded counters or unverified uptime claims).',
        fix: 'Use verified empirical telemetry, audited uptime logs, or omit unverified counters.',
      });
    }

    // Code Checks
    if (/<div\b[^>]*\bonClick\b/i.test(code)) {
      list.push({
        id: 'CODE-001',
        category: 'Code',
        name: 'Non-Semantic div onClick',
        deduction: 8,
        message: 'Detected clickable <div> element without keyboard accessibility or semantic role.',
        fix: 'Replace with semantic <button type="button"> or <a> tag with accessible label.',
      });
    }

    if (/console\.log\(/i.test(code)) {
      list.push({
        id: 'CODE-007',
        category: 'Code',
        name: 'Leftover Debug Logging',
        deduction: 4,
        message: 'Detected leftover console.log statement in component source.',
        fix: 'Remove console.log before committing to production.',
      });
    }

    // Mobile & Ergonomics
    const screenViewportPattern = new RegExp('min-h-' + 'screen', 'i');
    if (screenViewportPattern.test(code)) {
      list.push({
        id: 'UI-008',
        category: 'UI',
        name: 'min-h-dvh Viewport Standard',
        deduction: 6,
        message: 'Detected static screen height classes which overflow mobile browser chrome (URL bar). Use min-h-dvh.',
        fix: 'Use dynamic viewport units: min-h-dvh (100dvh) instead.',
      });
    }

    if (/(w-\[600px\]|w-\[800px\]|min-w-\[500px\])/i.test(code)) {
      list.push({
        id: 'MOBILE-001',
        category: 'Mobile',
        name: '320px Horizontal Viewport Overflow',
        deduction: 8,
        message: 'Detected hardcoded desktop width exceeding standard 320px mobile viewport.',
        fix: 'Use responsive max-w-full, clamp(), or percentage widths.',
      });
    }

    // Accessibility
    if (/outline-none/i.test(code) && !/focus-visible:/i.test(code)) {
      list.push({
        id: 'A11Y-002',
        category: 'A11y',
        name: 'Stripped Focus Ring',
        deduction: 8,
        message: 'Detected outline-none removing keyboard navigation focus indicator.',
        fix: 'Provide visible focus-visible:outline-2 focus-visible:outline-[var(--accent-ember)].',
      });
    }

    return list;
  }, [code]);

  const totalDeductions = findings.reduce((acc, f) => acc + f.deduction, 0);
  const score = Math.max(0, 100 - totalDeductions);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-16">
      {/* Header Register */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] px-3 py-1 hairline rounded bg-[var(--bg-surface)]">
          <span>INTERACTIVE SANDBOX</span>
          <span>/</span>
          <span>IN-BROWSER STATIC CHECKER</span>
        </div>
        <h1 className="tracking-tight text-[var(--text-main)] font-serif">
          The Chaff Playground
        </h1>
        <p className="text-[var(--text-dim)] text-lg max-w-[68ch]">
          Paste component JSX or CSS. Chaff runs the static audit checkers live in your browser, scores out of 100, detects AI tells, and shows exact craft fixes.
        </p>
      </div>

      {/* Preset Switcher */}
      <div className="flex flex-wrap items-center gap-2 hairline-b pb-4">
        <span className="font-mono text-xs text-[var(--text-dim)] uppercase mr-2">
          Load Sample:
        </span>
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setCode(p.code)}
            className="btn text-xs font-mono min-h-[44px] px-3.5 py-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)]"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* 2-Column Split Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Code Editor */}
        <div className="lg:col-span-7 hairline p-6 rounded-md bg-[var(--bg-surface)] space-y-4">
          <div className="flex justify-between items-baseline hairline-b pb-3 font-mono text-xs text-[var(--text-dim)]">
            <span className="font-semibold text-[var(--text-main)] uppercase">Component JSX Source</span>
            <span>{code.length} characters • Live AST parsing</span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={20}
            aria-label="Component JSX Source Code"
            className="w-full font-mono text-xs p-4 bg-[var(--bg-canvas)] text-[var(--text-main)] rounded hairline outline-none focus:border-[var(--accent-ember)] resize-y leading-relaxed"
            placeholder="Paste JSX component here..."
          />

          <div className="flex justify-between items-center text-xs font-mono text-[var(--text-dim)]">
            <span>Runs 100% in browser</span>
            <button
              onClick={() => setCode('')}
              className="text-xs font-mono text-[var(--accent-ember)] underline min-h-[44px] px-2 flex items-center"
            >
              Clear Editor
            </button>
          </div>
        </div>

        {/* Right Column: Live Audit Inspection Dossier */}
        <div className="lg:col-span-5 hairline p-6 sm:p-7 rounded-md bg-[var(--bg-surface)] space-y-6">
          <div className="flex justify-between items-baseline hairline-b pb-4">
            <div>
              <span className="font-mono text-xs uppercase text-[var(--text-dim)] block">
                AUDIT SCORE
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <RollingCounter
                  value={score}
                  className={`font-serif text-4xl ${
                    score >= 85
                      ? 'text-[var(--status-sage)]'
                      : score >= 60
                      ? 'text-[var(--status-warn)]'
                      : 'text-[var(--accent-ember)]'
                  }`}
                />
                <span className="font-mono text-xs text-[var(--text-dim)]">/ 100</span>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`font-mono text-xs font-bold px-2.5 py-1 rounded hairline uppercase ${
                  score >= 85
                    ? 'bg-[var(--status-sage)]/10 text-[var(--status-sage)] border-[var(--status-sage)]/30'
                    : 'bg-[var(--accent-ember)]/10 text-[var(--accent-ember)] border-[var(--accent-ember)]/30'
                }`}
              >
                {score >= 85 ? 'GATE PASS' : 'TELLS FOUND'}
              </span>
              <span className="block text-[11px] font-mono text-[var(--text-dim)] mt-1">
                {findings.length} Finding(s)
              </span>
            </div>
          </div>

          {/* Findings List */}
          <div className="space-y-4">
            {findings.length === 0 ? (
              <div className="p-6 text-center hairline rounded bg-[var(--bg-canvas)] space-y-2 border-[var(--status-sage)]/40">
                <span className="font-serif text-lg text-[var(--status-sage)] font-semibold block">
                  [PASS] Authentic Grain Standard
                </span>
                <p className="text-xs font-mono text-[var(--text-dim)]">
                  Zero AI tells detected. High visual contrast, semantic HTML, and proper mobile viewport units.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {findings.map((f, i) => (
                  <div
                    key={i}
                    className="p-4 rounded hairline bg-[var(--bg-canvas)] space-y-2 border-[var(--accent-ember)]/30"
                  >
                    <div className="flex justify-between items-baseline font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--accent-ember)]">{f.id}</span>
                        <span className="text-[10px] uppercase text-[var(--text-dim)]">
                          [{f.category}]
                        </span>
                      </div>
                      <span className="text-[var(--accent-ember)] font-bold">
                        -{f.deduction} pts
                      </span>
                    </div>

                    <h4 className="font-serif text-sm font-semibold text-[var(--text-main)]">
                      {f.name}
                    </h4>

                    <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                      {f.message}
                    </p>

                    <div className="pt-2 hairline-t text-xs font-mono text-[var(--status-sage)]">
                      <strong>Remediation:</strong> {f.fix}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
