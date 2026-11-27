import { Finding, IdentityLock } from '@chaff/core';

export function checkThreePatterns(
  filePath: string,
  content: string,
  _identity: IdentityLock | null
): Finding[] {
  const findings: Finding[] = [];
  const lines = content.split(/\r?\n/);

  // 1. Synchronous Three.js import in route files across Next, Solid, SvelteKit, Nuxt/Vue, Angular, Astro (THREE-001)
  const normalizedPath = filePath.replace(/\\/g, '/').toLowerCase();
  const isRouteFile =
    normalizedPath.includes('page.tsx') ||
    normalizedPath.includes('page.jsx') ||
    normalizedPath.includes('+page.svelte') ||
    normalizedPath.includes('+page.ts') ||
    normalizedPath.includes('index.tsx') ||
    normalizedPath.includes('index.jsx') ||
    normalizedPath.includes('index.vue') ||
    normalizedPath.includes('app.vue') ||
    normalizedPath.endsWith('.astro') ||
    normalizedPath.includes('.component.ts') ||
    /\/routes\/[^/]+\.(tsx|jsx|svelte|vue)$/.test(normalizedPath) ||
    /\/pages\/[^/]+\.(tsx|jsx|vue|astro)$/.test(normalizedPath);

  const hasStaticThreeImport =
    /\bfrom\s+['"](three|@react-three\/fiber|@threlte\/core|@tresjs\/core|solid-three|angular-three)['"]/i.test(
      content
    );
  const hasLazyBoundary =
    content.includes('dynamic(') ||
    content.includes('React.lazy(') ||
    /\blazy\s*\(/.test(content) ||
    content.includes('defineAsyncComponent(') ||
    content.includes('@defer') ||
    /\bimport\s*\(/.test(content) ||
    /client:(visible|idle|only)/i.test(content);

  if (isRouteFile && hasStaticThreeImport && !hasLazyBoundary) {
    findings.push({
      id: `THREE-001-route`,
      ruleId: 'THREE-001',
      category: 'three',
      severity: 'high',
      message:
        'Synchronous 3D import in top-level route blocks critical paint and LCP; lazy-load with dynamic()/lazy()/defineAsyncComponent/@defer/import()',
      file: filePath,
      line: 1,
      evidence: 'Direct static import of Three.js/WebGL engine in route entry',
      fixClass: 'lazy_loading',
      status: 'open',
    });
  }

  lines.forEach((line, idx) => {
    // 2. Uncapped pixel ratio (THREE-004)
    if (
      /setPixelRatio\s*\(\s*window\.devicePixelRatio\s*\)/.test(line) &&
      !line.includes('Math.min')
    ) {
      findings.push({
        id: `THREE-004-${idx + 1}`,
        ruleId: 'THREE-004',
        category: 'three',
        severity: 'high',
        message: 'Uncapped device pixel ratio triggers GPU thermal throttling and battery drain; cap at 1.5',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'pixel_ratio_cap',
        status: 'open',
      });
    }
  });

  return findings;
}
