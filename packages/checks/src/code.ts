import { Finding, IdentityLock } from '@chaff/core';

export function checkCodePatterns(
  filePath: string,
  content: string,
  identity: IdentityLock | null
): Finding[] {
  const findings: Finding[] = [];
  const lines = content.split(/\r?\n/);
  const framework = identity?.framework ?? 'unknown';

  // 1. Non-semantic div with click handler across React, SolidJS, Svelte, Angular, Vue, Qwik, Astro (CODE-001)
  const divOnClickMatches = content.matchAll(
    /<div\b([^>]*(?:\bonClick\$?\b|\bon:click\b|\bv-on:click\b|\(click\)|@click)[^>]*)>/gis
  );
  for (const m of divOnClickMatches) {
    const matchContent = m[1];
    if (!/\brole\s*=\s*["']button["']/i.test(matchContent)) {
      const lineNo = content.substring(0, m.index).split(/\r?\n/).length;
      findings.push({
        id: `CODE-001-${lineNo}`,
        ruleId: 'CODE-001',
        category: 'code',
        severity: 'high',
        message: 'Non-semantic <div> used as interactive trigger; use <button type="button"> or add role="button" + keyboard handling',
        file: filePath,
        line: lineNo,
        evidence: m[0].substring(0, 80).replace(/\s+/g, ' '),
        fixClass: 'semantic_html',
        status: 'open',
      });
    }
  }

  const isTemplateFile = /\.(tsx|jsx|svelte|vue|astro|html)$/i.test(filePath);

  lines.forEach((line, idx) => {
    // 2. console.log in UI components (CODE-007)
    if (/\bconsole\.log\(/.test(line) && !filePath.includes('test') && !filePath.includes('scripts')) {
      findings.push({
        id: `CODE-007-${idx + 1}`,
        ruleId: 'CODE-007',
        category: 'code',
        severity: 'low',
        message: 'Residual console.log detected in component code',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'code_hygiene',
        status: 'open',
      });
    }

    // 3. Raw <img> without framework optimization or explicit dimensions (CODE-003)
    if (/<img\b/i.test(line) && isTemplateFile) {
      const hasAngularNgSrc = /\bngSrc\b/i.test(line);
      const hasEnhancedImg = /enhanced:img/i.test(line);
      const hasExplicitDims = /\bwidth\s*=/i.test(line) && /\bheight\s*=/i.test(line);
      const isJsxComponent = filePath.endsWith('.tsx') || filePath.endsWith('.jsx');

      if (!hasAngularNgSrc && !hasEnhancedImg && (isJsxComponent || !hasExplicitDims)) {
        const hint =
          framework === 'angular'
            ? 'Raw <img> missing ngSrc or explicit width/height; prefer NgOptimizedImage (ngSrc)'
            : framework === 'sveltekit' || framework === 'svelte'
              ? 'Raw <img> missing explicit width/height; prefer @sveltejs/enhanced-img or <picture>'
              : framework === 'nuxt' || framework === 'vue'
                ? 'Raw <img> missing explicit dimensions; prefer <NuxtImg> or <picture> with width/height'
                : framework === 'astro'
                  ? 'Raw <img> missing explicit dimensions; prefer astro:assets <Image />'
                  : 'Raw <img> tag used in component; prefer next/image, explicit width/height, or responsive <picture>';

        findings.push({
          id: `CODE-003-${idx + 1}`,
          ruleId: 'CODE-003',
          category: 'code',
          severity: 'medium',
          message: hint,
          file: filePath,
          line: idx + 1,
          evidence: line.trim(),
          fixClass: 'image_component',
          status: 'open',
        });
      }
    }

    // 4. Unmanaged client-side data fetching inside effect/mount hooks (CODE-005)
    if (/\b(useEffect|createEffect|onMount)\s*\(\s*\(\)\s*=>\s*\{[^}]*\bfetch\(/.test(line)) {
      findings.push({
        id: `CODE-005-${idx + 1}`,
        ruleId: 'CODE-005',
        category: 'code',
        severity: 'high',
        message: 'Direct fetch inside client effect/mount hook; prefer route loaders, Server Components, createResource, or TanStack Query',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'data_fetching',
        status: 'open',
      });
    }
  });

  return findings;
}
