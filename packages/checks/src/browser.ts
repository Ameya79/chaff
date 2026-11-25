import { Finding, IdentityLock } from '@chaff/core';
import { checkUiPatterns } from './ui.js';
import { checkCopyPatterns } from './copy.js';
import { checkCodePatterns } from './code.js';
import { checkPerfPatterns } from './perf.js';
import { checkMobilePatterns } from './mobile.js';
import { checkA11yPatterns } from './a11y.js';
import { checkMotionPatterns } from './motion.js';
import { checkThreePatterns } from './three.js';

export {
  checkUiPatterns,
  checkCopyPatterns,
  checkCodePatterns,
  checkPerfPatterns,
  checkMobilePatterns,
  checkA11yPatterns,
  checkMotionPatterns,
  checkThreePatterns,
};

export interface CanonicalFinding extends Finding {
  canonicalRuleId: string;
  engineRuleId: string;
  deduction: number;
  fixHint: string;
}

const ENGINE_TO_CANONICAL: Record<string, { canonical: string; fixHint: string; deduction: number }> = {
  'UI-004': {
    canonical: 'UI-001',
    fixHint: 'Replace synthetic purple/indigo glow backdrops with purposeful tinted archival surfaces.',
    deduction: 8,
  },
  'UI-001': {
    canonical: 'UI-009',
    fixHint: 'Refactor centered hero + uniform 3-card grid into an asymmetric layout with domain hierarchy.',
    deduction: 10,
  },
  'UI-008': {
    canonical: 'MOBILE-001',
    fixHint: 'Replace static viewport height classes with dynamic viewport units (min-h-dvh).',
    deduction: 6,
  },
  'COPY-001': {
    canonical: 'COPY-001',
    fixHint: 'Replace LLM buzzwords with specific domain nouns and concrete technical capabilities.',
    deduction: 8,
  },
  'COPY-003': {
    canonical: 'COPY-002',
    fixHint: 'Replace unattributed round statistics with measured, verifiable product telemetry.',
    deduction: 6,
  },
  'COPY-004': {
    canonical: 'COPY-003',
    fixHint: 'Replace placeholder entity names with realistic domain entities.',
    deduction: 4,
  },
  'COPY-007': {
    canonical: 'COPY-004',
    fixHint: 'Replace placeholder dummy copy with genuine product prose.',
    deduction: 8,
  },
  'CODE-001': {
    canonical: 'CODE-007',
    fixHint: 'Use semantic <button type="button"> or <Link> instead of clickable <div> containers.',
    deduction: 8,
  },
  'CODE-003': {
    canonical: 'CODE-001',
    fixHint: 'Prefer next/image with explicit dimensions and sizes instead of raw <img> tags.',
    deduction: 4,
  },
  'CODE-005': {
    canonical: 'CODE-003',
    fixHint: 'Move data fetching to Server Components instead of useEffect fetch calls.',
    deduction: 8,
  },
  'CODE-007': {
    canonical: 'CODE-004',
    fixHint: 'Remove development console.log statements before shipping to production.',
    deduction: 4,
  },
  'MOBILE-001': {
    canonical: 'MOBILE-003',
    fixHint: 'Replace hardcoded desktop pixel widths (>320px) with fluid max-w-full or clamp().',
    deduction: 8,
  },
  'MOBILE-002': {
    canonical: 'MOBILE-002',
    fixHint: 'Ensure all interactive touch targets measure at least 44x44px.',
    deduction: 6,
  },
  'MOBILE-004': {
    canonical: 'MOBILE-004',
    fixHint: 'Never disable user pinch-to-zoom with user-scalable=no or maximum-scale=1.',
    deduction: 8,
  },
  'A11Y-001': {
    canonical: 'A11Y-006',
    fixHint: 'Provide descriptive alt attributes (or alt="" for decorative images).',
    deduction: 6,
  },
  'A11Y-002': {
    canonical: 'A11Y-003',
    fixHint: 'Add an explicit aria-label or accessible text name to icon-only buttons.',
    deduction: 6,
  },
  'A11Y-003': {
    canonical: 'A11Y-009',
    fixHint: 'Associate form controls with a visible <label htmlFor="..."> or aria-label.',
    deduction: 6,
  },
  'PERF-001': {
    canonical: 'PERF-001',
    fixHint: 'Load fonts via next/font with display: "swap".',
    deduction: 6,
  },
  'PERF-003': {
    canonical: 'PERF-002',
    fixHint: 'Provide explicit width/height or aspect ratio containers to prevent CLS.',
    deduction: 6,
  },
  'MOTION-001': {
    canonical: 'MOTION-001',
    fixHint: 'Add @media (prefers-reduced-motion: reduce) fallbacks for animations.',
    deduction: 6,
  },
  'MOTION-002': {
    canonical: 'MOTION-002',
    fixHint: 'Animate only compositor-friendly transform and opacity properties.',
    deduction: 4,
  },
  'THREE-001': {
    canonical: 'THREE-001',
    fixHint: 'Lazy-load 3D/WebGL scenes with next/dynamic({ ssr: false }) and render a static SVG poster fallback.',
    deduction: 10,
  },
  'THREE-004': {
    canonical: 'THREE-005',
    fixHint: 'Clamp canvas DPR at <= 1.5 and attach @chaff/tier governor with offscreen pausing.',
    deduction: 8,
  },
};

export function runBrowserStaticAudit(
  content: string,
  filePath = 'src/app/page.tsx',
  identity: IdentityLock | null = null
): CanonicalFinding[] {
  const raw: Finding[] = [
    ...checkUiPatterns(filePath, content, identity),
    ...checkCopyPatterns(filePath, content, identity),
    ...checkCodePatterns(filePath, content, identity),
    ...checkPerfPatterns(filePath, content, identity),
    ...checkMobilePatterns(filePath, content, identity),
    ...checkA11yPatterns(filePath, content, identity),
    ...checkMotionPatterns(filePath, content, identity),
    ...checkThreePatterns(filePath, content, identity),
  ];

  const mapped: CanonicalFinding[] = raw
    // Exclude non-4px spacing heuristic from shadowing UI-002 (Gradient text clipping)
    .filter((f) => f.ruleId !== 'UI-002')
    .map((f) => {
      const meta = ENGINE_TO_CANONICAL[f.ruleId];
      return {
        ...f,
        engineRuleId: f.ruleId,
        canonicalRuleId: meta?.canonical ?? f.ruleId,
        deduction: meta?.deduction ?? (f.severity === 'high' ? 8 : f.severity === 'medium' ? 4 : 2),
        fixHint: meta?.fixHint ?? f.message,
      };
    });

  // Additional static checks aligned 1:1 with canonical rules directory
  const lines = content.split(/\r?\n/);
  lines.forEach((line, idx) => {
    // UI-002: Gradient text clipping on headings
    if (/(bg-clip-text[^"']*text-transparent|text-transparent[^"']*bg-clip-text)/i.test(line)) {
      mapped.push({
        id: `UI-002-clip-${idx + 1}`,
        ruleId: 'UI-002',
        engineRuleId: 'UI-002',
        canonicalRuleId: 'UI-002',
        category: 'ui',
        severity: 'high',
        message: 'Gradient text clipping masks headline contrast and signals synthetic template generation',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'color_hygiene',
        status: 'open',
        deduction: 6,
        fixHint: 'Render headings in solid high-contrast ink (--text-main) using display serif typography.',
      });
    }

    // UI-003: Centered multi-line prose paragraphs
    if (/<p\b[^>]*\btext-center\b/i.test(line) && !mapped.some((f) => f.canonicalRuleId === 'UI-003')) {
      mapped.push({
        id: `UI-003-center-${idx + 1}`,
        ruleId: 'UI-003',
        engineRuleId: 'UI-003',
        canonicalRuleId: 'UI-003',
        category: 'ui',
        severity: 'medium',
        message: 'Centered multi-line prose breaks left-margin reading rhythm; use left-aligned editorial measure',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'typography',
        status: 'open',
        deduction: 4,
        fixHint: 'Left-align multi-line body paragraphs with a 55-68ch reading measure.',
      });
    }

    // COPY-002: Additional unattributed synthetic round claims
    if (
      (/\b(10,?000\+|99\.99?%|5x\s+faster|100\+\s+integrations)\b/i.test(line)) &&
      !mapped.some((f) => f.canonicalRuleId === 'COPY-002' && f.line === idx + 1)
    ) {
      mapped.push({
        id: `COPY-002-metric-${idx + 1}`,
        ruleId: 'COPY-003',
        engineRuleId: 'COPY-003',
        canonicalRuleId: 'COPY-002',
        category: 'copy',
        severity: 'medium',
        message: 'Unattributed round marketing statistic detected without verifiable telemetry source',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'grounded_metrics',
        status: 'open',
        deduction: 6,
        fixHint: 'Replace fabricated round claims with measured domain metrics and units.',
      });
    }

    // A11Y-001: Low-contrast gray text on light surfaces
    if (/(bg-white|bg-slate-50|bg-gray-50)/.test(content) && /\btext-(gray|slate|zinc)-(300|400)\b/.test(line)) {
      mapped.push({
        id: `A11Y-001-contrast-${idx + 1}`,
        ruleId: 'A11Y-001',
        engineRuleId: 'A11Y-001',
        canonicalRuleId: 'A11Y-001',
        category: 'a11y',
        severity: 'high',
        message: 'Low-contrast muted gray text (text-gray-300/400) fails WCAG AA 4.5:1 threshold on light surface',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'contrast',
        status: 'open',
        deduction: 8,
        fixHint: 'Use high-contrast neutral tokens (>= 4.5:1, e.g. #544B40 or text-stone-700) on light grounds.',
      });
    }

    // A11Y-002: outline-none without visible focus-visible fallback
    if (/\boutline-none\b/.test(line) && !/\bfocus-visible:/i.test(line)) {
      mapped.push({
        id: `A11Y-002-focus-${idx + 1}`,
        ruleId: 'A11Y-002',
        engineRuleId: 'A11Y-002',
        canonicalRuleId: 'A11Y-002',
        category: 'a11y',
        severity: 'high',
        message: 'Stripped keyboard focus outline without focus-visible ring',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'focus_ring',
        status: 'open',
        deduction: 6,
        fixHint: 'Keep visible focus-visible:outline-2 focus-visible:outline-[var(--accent-ember)] styling.',
      });
    }

    // THREE-005: React Three Fiber uncapped dpr={[1, 3]} or high dpr
    if (/dpr=\{\[\s*1\s*,\s*[2-9]/.test(line) && !/1\.5/.test(line)) {
      mapped.push({
        id: `THREE-005-dpr-${idx + 1}`,
        ruleId: 'THREE-005',
        engineRuleId: 'THREE-005',
        canonicalRuleId: 'THREE-005',
        category: 'three',
        severity: 'high',
        message: 'Canvas DPR exceeds 1.5 ceiling, draining mobile battery and overheating GPUs',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'pixel_ratio_cap',
        status: 'open',
        deduction: 8,
        fixHint: 'Clamp dpr to Math.min(window.devicePixelRatio, 1.5) via @chaff/tier governor.',
      });
    }

    // UI-008: Glassmorphism backdrop-blur-xl
    if (/\bbackdrop-blur-(xl|2xl|3xl)\b/.test(line)) {
      mapped.push({
        id: `UI-008-blur-${idx + 1}`,
        ruleId: 'UI-008',
        engineRuleId: 'UI-008',
        canonicalRuleId: 'UI-008',
        category: 'ui',
        severity: 'medium',
        message: 'Heavy backdrop blur card reduces text legibility and GPU compositing efficiency',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'surface_clarity',
        status: 'open',
        deduction: 4,
        fixHint: 'Use crisp solid or tinted archival surfaces with hairline rules.',
      });
    }

    // MOBILE-001: Static 100vh inline styles or h-screen classes
    if ((/100vh/.test(line) || /\bh-screen\b/.test(line)) && !/dvh/.test(line)) {
      mapped.push({
        id: `MOBILE-001-vh-${idx + 1}`,
        ruleId: 'UI-008',
        engineRuleId: 'UI-008',
        canonicalRuleId: 'MOBILE-001',
        category: 'mobile',
        severity: 'high',
        message: 'Static 100vh / h-screen clips interactive elements under mobile browser chrome; use 100dvh',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'viewport_units',
        status: 'open',
        deduction: 6,
        fixHint: 'Use min-h-dvh or 100dvh instead of static 100vh.',
      });
    }

    // MOBILE-003: 100vw inline width causing scrollbar overflow on desktop/Windows
    if (/['"]100vw['"]/.test(line)) {
      mapped.push({
        id: `MOBILE-003-vw-${idx + 1}`,
        ruleId: 'MOBILE-001',
        engineRuleId: 'MOBILE-001',
        canonicalRuleId: 'MOBILE-003',
        category: 'mobile',
        severity: 'medium',
        message: '100vw width ignores scrollbar track and triggers horizontal overflow; use width: 100%',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'responsive_width',
        status: 'open',
        deduction: 6,
        fixHint: 'Replace width: 100vw with w-full / width: 100%.',
      });
    }
  });

  // Catch UI-009 centered 3-card grid even when 'hero' keyword is absent
  const hasThreeGrid = /grid-cols-(1\s+md:grid-cols-)?3/.test(content);
  const hasCenteredHero = /text-center|items-center\s+justify-center/.test(content);
  if (hasThreeGrid && hasCenteredHero && !mapped.some((f) => f.canonicalRuleId === 'UI-009')) {
    mapped.push({
      id: 'UI-009-pattern',
      ruleId: 'UI-001',
      engineRuleId: 'UI-001',
      canonicalRuleId: 'UI-009',
      category: 'ui',
      severity: 'high',
      message: 'Centered hero layout paired with three uniform feature cards detected',
      file: filePath,
      line: 1,
      evidence: 'Centered alignment + 3-column equal card grid',
      fixClass: 'editorial_layout',
      status: 'open',
      deduction: 10,
      fixHint: 'Refactor to asymmetric 7/5 layout with a bespoke visual or live telemetry ledger.',
    });
  }

  // Catch UI-001 purple gradient backdrops using Tailwind radial/from-purple/from-blue
  if (
    /(from-purple|to-purple|via-purple|from-blue|to-pink)/i.test(content) &&
    !mapped.some((f) => f.canonicalRuleId === 'UI-001')
  ) {
    mapped.push({
      id: 'UI-001-glow',
      ruleId: 'UI-004',
      engineRuleId: 'UI-004',
      canonicalRuleId: 'UI-001',
      category: 'ui',
      severity: 'high',
      message: 'Synthetic purple/blue/pink gradient glow detected',
      file: filePath,
      line: 1,
      evidence: 'Gradient utility classes (from-purple / from-blue / to-pink)',
      fixClass: 'color_hygiene',
      status: 'open',
      deduction: 8,
      fixHint: 'Replace synthetic purple/blue glows with intentional solid surface tokens or locked brand colors.',
    });
  }

  // Catch THREE-001 static 3D import without dynamic() / @chaff/tier
  if (
    (/from\s+['"](three|@react-three\/fiber)['"]/i.test(content)) &&
    !content.includes('dynamic(') &&
    !content.includes('React.lazy(') &&
    !mapped.some((f) => f.canonicalRuleId === 'THREE-001')
  ) {
    mapped.push({
      id: 'THREE-001-static',
      ruleId: 'THREE-001',
      engineRuleId: 'THREE-001',
      canonicalRuleId: 'THREE-001',
      category: 'three',
      severity: 'high',
      message: 'Synchronous 3D import blocks LCP; must use next/dynamic({ ssr: false }) and @chaff/tier poster fallback',
      file: filePath,
      line: 1,
      evidence: 'Direct static import of Three.js / React Three Fiber',
      fixClass: 'lazy_loading',
      status: 'open',
      deduction: 10,
      fixHint: 'Lazy-load canvas via next/dynamic(..., { ssr: false }), add SVG poster fallback, and check tier().',
    });
  }

  // Catch THREE-002 missing static poster fallback for WebGL/3D components
  if (
    (/<Canvas\b|from\s+['"](three|@react-three\/fiber)['"]/i.test(content)) &&
    !/(Poster|poster|<picture>)/i.test(content) &&
    !mapped.some((f) => f.canonicalRuleId === 'THREE-002')
  ) {
    mapped.push({
      id: 'THREE-002-poster',
      ruleId: 'THREE-002',
      engineRuleId: 'THREE-002',
      canonicalRuleId: 'THREE-002',
      category: 'three',
      severity: 'medium',
      message: '3D canvas lacks a static SVG/image poster fallback for SSR, Tier 0, and reduced-motion users',
      file: filePath,
      line: 1,
      evidence: 'WebGL/Canvas rendered without Poster fallback component',
      fixClass: 'static_fallback',
      status: 'open',
      deduction: 6,
      fixHint: 'Provide an SSR-ready static SVG/image Poster fallback and check @chaff/tier before mounting WebGL.',
    });
  }

  return mapped;
}
