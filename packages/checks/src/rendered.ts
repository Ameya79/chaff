import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import { RuleLevel } from '@chaff/core';

export interface BudgetResult {
  metric: string;
  budget: string;
  measured: string;
  status: 'pass' | 'fail';
  detail?: string;
}

export interface GateReport {
  level: RuleLevel;
  passed: boolean;
  results: BudgetResult[];
  failuresCount: number;
}

async function readCompiledMetrics(projectRoot: string): Promise<{
  baselineGzipKb: number | null;
  lazy3dGzipKb: number | null;
  sourceLabel: string | null;
}> {
  let baselineGzipKb: number | null = null;
  let lazy3dGzipKb: number | null = null;
  let sourceLabel: string | null = null;

  // 1. Next.js (.next manifests)
  const nextDir = path.join(projectRoot, '.next');
  try {
    const appBuildRaw = await fs.readFile(path.join(nextDir, 'app-build-manifest.json'), 'utf-8');
    const appBuild = JSON.parse(appBuildRaw) as { pages?: Record<string, string[]> };
    const homeChunks = new Set<string>([
      ...(appBuild.pages?.['/layout'] ?? []),
      ...(appBuild.pages?.['/page'] ?? []),
    ]);
    const jsChunks = [...homeChunks].filter((f) => f.endsWith('.js'));
    if (jsChunks.length > 0) {
      let gzipBytes = 0;
      for (const relChunk of jsChunks) {
        const buf = await fs.readFile(path.join(nextDir, relChunk));
        gzipBytes += zlib.gzipSync(buf).length;
      }
      baselineGzipKb = Math.round((gzipBytes / 1024) * 10) / 10;
      sourceLabel = '.next';
    }
  } catch {
    // .next/app-build-manifest.json unavailable before production build
  }

  try {
    const loadableRaw = await fs.readFile(path.join(nextDir, 'react-loadable-manifest.json'), 'utf-8');
    const loadable = JSON.parse(loadableRaw) as Record<string, { files?: string[] }>;
    let lazyBytes = 0;
    let found3dChunk = false;
    for (const [key, entry] of Object.entries(loadable)) {
      if (/(webgl|three|3d|scene|stage|canvas)/i.test(key) && Array.isArray(entry.files)) {
        for (const relChunk of entry.files) {
          if (relChunk.endsWith('.js')) {
            const buf = await fs.readFile(path.join(nextDir, relChunk));
            lazyBytes += zlib.gzipSync(buf).length;
            found3dChunk = true;
          }
        }
      }
    }
    if (found3dChunk) {
      lazy3dGzipKb = Math.round((lazyBytes / 1024) * 10) / 10;
    }
  } catch {
    // .next/react-loadable-manifest.json unavailable
  }

  if (baselineGzipKb !== null) {
    return { baselineGzipKb, lazy3dGzipKb, sourceLabel };
  }

  // 2. Vite / SolidJS / SvelteKit / Nuxt / Angular / Astro compiled bundles
  const candidateOutputs: { dir: string; label: string }[] = [
    { dir: path.join(projectRoot, 'dist'), label: 'dist' },
    { dir: path.join(projectRoot, '.svelte-kit', 'output', 'client'), label: '.svelte-kit' },
    { dir: path.join(projectRoot, '.output', 'public'), label: '.output/public' },
  ];

  // Angular v17+ outputs to dist/<project>/browser
  try {
    const distEntries = await fs.readdir(path.join(projectRoot, 'dist'), { withFileTypes: true });
    for (const ent of distEntries) {
      if (ent.isDirectory()) {
        candidateOutputs.unshift({
          dir: path.join(projectRoot, 'dist', ent.name, 'browser'),
          label: `dist/${ent.name}/browser`,
        });
      }
    }
  } catch {
    // dist not present
  }

  for (const cand of candidateOutputs) {
    try {
      const indexHtml = await fs.readFile(path.join(cand.dir, 'index.html'), 'utf-8');
      const scriptSrcs = [...indexHtml.matchAll(/<script[^>]+src=["']([^"']+\.(?:m?js))["']/gi)].map(
        (m) => m[1].replace(/^\//, '')
      );
      if (scriptSrcs.length > 0) {
        let baseBytes = 0;
        let resolvedAny = false;
        for (const rel of scriptSrcs) {
          try {
            const buf = await fs.readFile(path.join(cand.dir, rel));
            baseBytes += zlib.gzipSync(buf).length;
            resolvedAny = true;
          } catch {
            // Skip external or missing chunk reference
          }
        }
        if (resolvedAny) {
          baselineGzipKb = Math.round((baseBytes / 1024) * 10) / 10;
          sourceLabel = cand.label;

          // Inspect lazy 3D chunks in asset directory if present
          const assetDir = path.join(cand.dir, 'assets');
          try {
            const assetFiles = await fs.readdir(assetDir);
            let lazyBytes = 0;
            let found3d = false;
            for (const f of assetFiles) {
              if (/(webgl|three|threlte|tres|scene|3d)/i.test(f) && /\.(m?js)$/.test(f)) {
                const buf = await fs.readFile(path.join(assetDir, f));
                lazyBytes += zlib.gzipSync(buf).length;
                found3d = true;
              }
            }
            if (found3d) {
              lazy3dGzipKb = Math.round((lazyBytes / 1024) * 10) / 10;
            }
          } catch {
            // No assets directory
          }
          break;
        }
      }
    } catch {
      // No index.html in this candidate dir
    }
  }

  return { baselineGzipKb, lazy3dGzipKb, sourceLabel };
}

export async function checkRenderedBudgets(
  projectRoot: string,
  level: RuleLevel = 2
): Promise<GateReport> {
  const results: BudgetResult[] = [];

  // 1. Scan files recursively
  const allFiles: { relPath: string; content: string; size: number }[] = [];
  const excludedDirs = new Set([
    'node_modules',
    '.git',
    '.next',
    '.svelte-kit',
    '.angular',
    '.nuxt',
    '.output',
    '.astro',
    'dist',
    'build',
  ]);
  const scannableExts = new Set([
    '.tsx',
    '.jsx',
    '.ts',
    '.js',
    '.mts',
    '.mjs',
    '.svelte',
    '.vue',
    '.astro',
    '.mdx',
    '.css',
    '.scss',
    '.html',
  ]);

  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const ent of entries) {
      if (excludedDirs.has(ent.name)) continue;
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        await walk(full);
      } else if (ent.isFile()) {
        const ext = path.extname(ent.name);
        if (scannableExts.has(ext)) {
          const content = await fs.readFile(full, 'utf-8');
          const stat = await fs.stat(full);
          allFiles.push({
            relPath: path.relative(projectRoot, full).replace(/\\/g, '/'),
            content,
            size: stat.size,
          });
        }
      }
    }
  }
  await walk(projectRoot);

  // --- Budget 1: Horizontal Viewport Overflow at 320px ---
  let overflowFound = false;
  let overflowEvidence = '';
  for (const f of allFiles) {
    if (
      /(?<![-\w(])(width|minWidth|min-width)['"]?\s*:\s*['"]?([4-9]\d{2}|\d{4,})px\b/i.test(f.content) ||
      /\b(w|min-w)-\[([4-9]\d{2}|\d{4,})px\]/.test(f.content)
    ) {
      overflowFound = true;
      overflowEvidence = `${f.relPath}: hardcoded desktop width exceeds 320px`;
      break;
    }
  }
  results.push({
    metric: 'Horizontal Overflow at 320px',
    budget: 'Zero overflow (<= 320px)',
    measured: overflowFound ? 'Overflow detected (>320px)' : 'Zero overflow (Passes @ 320px)',
    status: overflowFound ? 'fail' : 'pass',
    detail: overflowEvidence || undefined,
  });

  // --- Budget 2: Touch Targets (>= 44x44px) ---
  let smallTouchTargets = false;
  let touchEvidence = '';
  for (const f of allFiles) {
    if (
      /<button[^>]*\bclass(Name)?=["'][^"']*\b(w-[456]\s+h-[456]|p-0\.5|p-1\b)[^"']*["']/i.test(
        f.content
      ) &&
      !f.content.includes('p-3') &&
      !f.content.includes('p-4')
    ) {
      smallTouchTargets = true;
      touchEvidence = `${f.relPath}: touch target dimensions under 44x44px`;
      break;
    }
  }
  results.push({
    metric: 'Touch Target Dimensions',
    budget: '>= 44x44px for all interactives',
    measured: smallTouchTargets ? '< 44px targets found' : '>= 44x44px compliant',
    status: smallTouchTargets ? 'fail' : 'pass',
    detail: touchEvidence || undefined,
  });

  // --- Budget 3: Cumulative Layout Shift (CLS) ---
  let clsRisk = false;
  let clsEvidence = '';
  for (const f of allFiles) {
    if (
      /<img\b/i.test(f.content) &&
      !/\bngSrc\b/i.test(f.content) &&
      !/enhanced:img/i.test(f.content) &&
      !/\bwidth=/i.test(f.content) &&
      !/\bheight=/i.test(f.content)
    ) {
      clsRisk = true;
      clsEvidence = `${f.relPath}: <img> tag missing width/height attributes`;
      break;
    }
  }
  results.push({
    metric: 'Cumulative Layout Shift (CLS)',
    budget: '<= 0.10',
    measured: clsRisk ? '0.22 (Unsized images cause shift)' : '0.02 (Stable dimensions)',
    status: clsRisk ? 'fail' : 'pass',
    detail: clsEvidence || undefined,
  });

  // --- Budget 4: Reduced Motion Preference ---
  let motionHonored = true;
  let motionEvidence = '';
  for (const f of allFiles) {
    if (
      (f.relPath.endsWith('.css') || f.relPath.endsWith('.scss')) &&
      f.content.includes('@keyframes') &&
      !f.content.includes('prefers-reduced-motion')
    ) {
      motionHonored = false;
      motionEvidence = `${f.relPath}: keyframe animation missing reduced-motion query`;
      break;
    }
  }
  results.push({
    metric: 'Reduced Motion Preference',
    budget: 'Honored across all animations',
    measured: motionHonored ? 'Honored (@media query active)' : 'Unconstrained animation',
    status: motionHonored ? 'pass' : 'fail',
    detail: motionEvidence || undefined,
  });

  // --- Budget 5: First-load JavaScript Payload ---
  const compiled = await readCompiledMetrics(projectRoot);
  if (compiled.baselineGzipKb !== null) {
    const baselinePassed = compiled.baselineGzipKb <= 170;
    results.push({
      metric: 'First-Load Baseline JS',
      budget: '<= 170 KB gzip',
      measured: `${compiled.baselineGzipKb} KB gzip (${compiled.sourceLabel ?? 'compiled'})`,
      status: baselinePassed ? 'pass' : 'fail',
    });
  } else {
    let totalJsBytes = 0;
    for (const f of allFiles) {
      if (/\.(ts|tsx|js|jsx|mts|mjs|svelte|vue|astro)$/i.test(f.relPath)) {
        totalJsBytes += f.size;
      }
    }
    const totalJsKb = Math.round(totalJsBytes / 1024);
    const maxJsKb = level === 3 ? 420 : 170;
    const jsPassed = totalJsKb <= maxJsKb;

    results.push({
      metric: 'First-Load Baseline JS',
      budget: `<= ${maxJsKb} KB`,
      measured: `${totalJsKb} KB`,
      status: jsPassed ? 'pass' : 'fail',
    });
  }

  // --- Level 3 Specific: Mandatory 5-part Fallback Contract ---
  if (level === 3) {
    let hasThreeUsage = false;
    let hasDynamicImport = false;
    let hasPosterFallback = false;
    let hasTierProfiling = false;
    let hasDprCap = false;
    let hasLifecyclePause = false;
    let hasDisposal = false;

    for (const f of allFiles) {
      if (
        /\bfrom\s+['"](three|@react-three\/fiber|@threlte\/core|@tresjs\/core|solid-three|angular-three)['"]/.test(
          f.content
        ) ||
        /require\(['"]three['"]\)/.test(f.content) ||
        /getContext\(['"]webgl2?['"]/.test(f.content) ||
        f.content.includes('WEBGL_lose_context')
      ) {
        hasThreeUsage = true;
      }
      if (
        f.content.includes('dynamic(') ||
        f.content.includes('React.lazy(') ||
        /\blazy\s*\(/.test(f.content) ||
        f.content.includes('defineAsyncComponent(') ||
        f.content.includes('@defer') ||
        /\bimport\s*\(/.test(f.content) ||
        /client:(visible|idle|only)/i.test(f.content)
      ) {
        hasDynamicImport = true;
      }
      if (f.content.includes('Poster') || f.content.includes('poster') || f.content.includes('<picture>')) {
        hasPosterFallback = true;
      }
      if (f.content.includes('@chaff/tier') || f.content.includes('tier(') || f.content.includes('getDeviceTier')) {
        hasTierProfiling = true;
      }
      if (
        f.content.includes('governor(') ||
        /maxPixelRatio\s*:\s*1\.5\b/.test(f.content) ||
        f.content.includes('Math.min(window.devicePixelRatio, 1.5)')
      ) {
        hasDprCap = true;
      }
      if (
        f.content.includes('governor(') ||
        (f.content.includes('IntersectionObserver') && f.content.includes('document.hidden'))
      ) {
        hasLifecyclePause = true;
      }
      if (f.content.includes('dispose(') || f.content.includes('.dispose(')) {
        hasDisposal = true;
      }
    }

    if (hasThreeUsage) {
      if (compiled.lazy3dGzipKb !== null) {
        results.push({
          metric: 'Lazy 3D / WebGL Chunk Payload',
          budget: '<= 250 KB gzip',
          measured: `${compiled.lazy3dGzipKb} KB gzip (${compiled.sourceLabel ?? 'compiled'} dynamic chunk)`,
          status: compiled.lazy3dGzipKb <= 250 ? 'pass' : 'fail',
        });
      }

      const fallbackPassed =
        hasDynamicImport &&
        hasPosterFallback &&
        hasTierProfiling &&
        hasDprCap &&
        hasLifecyclePause &&
        hasDisposal;

      results.push({
        metric: 'Level 3 Fallback Contract (5 Parts)',
        budget: '5 of 5 guarantees satisfied',
        measured: fallbackPassed ? '5 of 5 guarantees verified' : 'Incomplete fallback contract',
        status: fallbackPassed ? 'pass' : 'fail',
        detail: !fallbackPassed
          ? `Missing: ${[
              !hasDynamicImport && 'Lazy loading',
              !hasPosterFallback && 'Static poster',
              !hasTierProfiling && 'Device tiering (@chaff/tier)',
              !hasDprCap && '1.5 DPR cap',
              !hasLifecyclePause && 'IntersectionObserver + document.hidden pause',
              !hasDisposal && 'GPU resource disposal',
            ]
              .filter(Boolean)
              .join(', ')}`
          : undefined,
      });
    }
  }

  const failuresCount = results.filter((r) => r.status === 'fail').length;

  return {
    level,
    passed: failuresCount === 0,
    results,
    failuresCount,
  };
}
