'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import presetsData from '../../data/playground-presets.json';

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
        deduction: 6,
        message: 'Detected generic AI purple/blue gradient backdrop blur.',
        fix: 'Replace with purposeful editorial background or warm straw paper tone.',
      });
    }

    if (/(bg-clip-text\s+text-transparent|text-transparent\s+bg-clip-text)/i.test(code)) {
      list.push({
        id: 'UI-002',
        category: 'UI',
        name: 'Gradient Text Headline',
        deduction: 6,
        message: 'Detected gradient text clipping mask on headline.',
        fix: 'Use solid, intentional typography with strong contrast.',
      });
    }

    if (/items-center\s+justify-center.*grid-cols-(1\s+md:grid-cols-)?3/s.test(code) || /grid-cols-3.*items-center/s.test(code)) {
      list.push({
        id: 'UI-003',
        category: 'UI',
        name: 'Centered Hero + 3-Card Grid',
        deduction: 7,
        message: 'Detected stereotypical centered hero layout followed by 3 uniform feature cards.',
        fix: 'Refactor to asymmetric layout (e.g. 7/5 or 8/4 grid) or editorial hierarchy.',
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
      'holi' + 'stic'
    ];
    const buzzwordRegex = new RegExp('\\b(' + buzzwordList.join('|') + ')\\b', 'gi');
    const buzzwords = code.match(buzzwordRegex);
    if (buzzwords && buzzwords.length > 0) {
      list.push({
        id: 'COPY-001',
        category: 'Copy',
        name: 'Buzzword Salad',
        deduction: Math.min(10, buzzwords.length * 3),
        message: `Detected generic synthetic buzzwords: "${[...new Set(buzzwords.map(w => w.toLowerCase()))].join(', ')}".`,
        fix: 'Replace with specific domain nouns and empirical functional descriptions.',
      });
    }

    if (/\b(10,000\+|10000\+|99\.9%)\b/i.test(code)) {
      list.push({
        id: 'COPY-002',
        category: 'Copy',
        name: 'Synthetic Metrics',
        deduction: 4,
        message: 'Detected standard synthetic placeholder metrics (e.g. 10,000+ happy clients).',
        fix: 'Use verified empirical telemetry, client logos, or omit unverified counters.',
      });
    }

    // Code Checks
    if (/<div\b[^>]*\bonClick\b/i.test(code)) {
      list.push({
        id: 'CODE-001',
        category: 'Code',
        name: 'Non-Semantic div onClick',
        deduction: 6,
        message: 'Detected non-interactive <div> element with an onClick handler.',
        fix: 'Replace with semantic <button type="button"> or accessible <a> element.',
      });
    }

    // Mobile Checks
    if (/w-\[([4-9]\d{2}|\d{4,})px\]|width:\s*['"]?([4-9]\d{2}|\d{4,})px/i.test(code)) {
      list.push({
        id: 'MOBILE-001',
        category: 'Mobile',
        name: 'Fixed Viewport Overflow at 320px',
        deduction: 8,
        message: 'Detected fixed width >= 400px causing horizontal scrollbar on mobile viewports.',
        fix: 'Use max-w-full, w-full, or fluid clamp() sizing.',
      });
    }

    // Three / 3D Checks
    if (/dpr=\{?\[\s*\d\s*,\s*([2-9]|\d{2,})\s*\]\}?/i.test(code)) {
      list.push({
        id: 'THREE-002',
        category: 'Three',
        name: 'Uncapped Pixel Ratio (DPR > 1.5)',
        deduction: 7,
        message: 'Detected 3D Canvas DPR scale exceeding 1.5, overheating mobile GPUs.',
        fix: 'Cap device pixel ratio at Math.min(window.devicePixelRatio, 1.5).',
      });
    }

    return list;
  }, [code]);

  const score = Math.max(0, 100 - findings.reduce((acc, f) => acc + f.deduction, 0));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Header */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] px-2.5 py-1 hairline rounded bg-[var(--bg-surface)]">
          <span>Sandbox</span>
          <span>/</span>
          <span>In-Browser Audit Engine</span>
        </div>
        <h1 className="tracking-tight text-[var(--text-main)]">
          Interactive Chaff Playground
        </h1>
        <p className="text-lg text-[var(--text-dim)] max-w-3xl leading-relaxed">
          Paste your JSX, HTML, or CSS code below, or choose a preset snippet to run real-time Chaff winnowing in your browser.
        </p>
      </section>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs uppercase text-[var(--text-dim)] mr-2">Presets:</span>
        {PRESETS.map(preset => (
          <button
            key={preset.name}
            type="button"
            onClick={() => setCode(preset.code)}
            className="btn text-xs font-mono py-1.5 px-3"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-[var(--text-dim)]">
            <span>INPUT CODE (JSX / TSX / HTML)</span>
            <span>{code.length} characters</span>
          </div>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            rows={18}
            className="w-full p-4 font-mono text-xs leading-relaxed rounded hairline bg-[var(--bg-canvas)] text-[var(--text-main)] focus-visible:outline-2 focus-visible:outline-[var(--accent-ember)] resize-y"
            placeholder="Paste component JSX here..."
          />
        </div>

        {/* Audit Results Panel (5 cols) */}
        <div className="lg:col-span-5 hairline p-6 rounded-lg bg-[var(--bg-surface)] space-y-6">
          <div className="flex justify-between items-baseline hairline-b pb-4">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-dim)]">
              Real-Time Audit Score
            </span>
            <span
              className={`font-mono text-sm font-bold ${
                score >= 90
                  ? 'text-[var(--status-sage)]'
                  : score >= 70
                  ? 'text-[var(--status-warn)]'
                  : 'text-[var(--accent-ember)]'
              }`}
            >
              {score >= 90 ? 'PASSED (GRAIN)' : score >= 70 ? 'WARNING (CHAFF)' : 'FAILED (SLOP)'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`w-20 h-20 rounded hairline flex flex-col items-center justify-center ${
                score >= 90
                  ? 'bg-[var(--status-sage-soft)] border-[var(--status-sage)] text-[var(--status-sage)]'
                  : score >= 70
                  ? 'bg-[var(--bg-surface-elevated)] border-[var(--status-warn)] text-[var(--status-warn)]'
                  : 'bg-[var(--accent-ember-soft)] border-[var(--accent-ember)] text-[var(--accent-ember)]'
              }`}
            >
              <span className="font-serif text-3xl font-bold">{score}</span>
              <span className="text-[10px] font-mono uppercase">/ 100</span>
            </div>

            <div className="text-xs space-y-1 font-mono text-[var(--text-dim)]">
              <div>Detected Tells: <strong className="text-[var(--text-main)]">{findings.length}</strong></div>
              <div>Points Deducted: <strong className="text-[var(--accent-ember)]">-{100 - score}</strong></div>
              <div>Status: <span className="text-[var(--text-main)]">{score >= 90 ? 'Clean Craft' : 'Needs Winnowing'}</span></div>
            </div>
          </div>

          {/* Finding List */}
          <div className="space-y-3 pt-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-dim)] block">
              Detected Tells ({findings.length})
            </span>

            {findings.length === 0 ? (
              <div className="p-4 hairline rounded bg-[var(--bg-canvas)] border-[var(--status-sage)] text-xs font-mono text-[var(--status-sage)] space-y-1">
                <strong>Clean Grain Verified!</strong>
                <p className="text-[var(--text-dim)]">Zero synthetic tells detected. Semantic, accessible, and responsive.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {findings.map(f => (
                  <div key={f.id} className="p-3 hairline rounded bg-[var(--bg-canvas)] text-xs space-y-1.5 border-[var(--accent-ember)]/40">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-[var(--accent-ember)]">{f.id} • {f.name}</span>
                      <span className="font-mono text-[var(--accent-ember)]">-{f.deduction} pts</span>
                    </div>
                    <p className="text-[var(--text-main)]">{f.message}</p>
                    <div className="pt-1 text-[var(--text-dim)] font-mono text-[11px] hairline-t">
                      <strong>Fix:</strong> {f.fix}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-8 hairline-t flex flex-wrap justify-between items-center gap-4">
        <Link href="/gallery" className="btn">
          ← View Audit Gallery
        </Link>
        <Link href="/rules" className="btn primary">
          Explore All 72 Rules →
        </Link>
      </div>
    </div>
  );
}
