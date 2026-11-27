import fs from 'node:fs/promises';
import path from 'node:path';
import { IdentityLock, IdentityToken, WaiverEntry } from './types.js';

export async function buildIdentity(projectRoot: string): Promise<IdentityLock> {
  const tokens: IdentityToken[] = [];
  const locked: string[] = [];
  const waivers: WaiverEntry[] = [];
  const colors: Record<string, string> = {};
  const fonts: string[] = [];
  const spacingRhythm: string[] = ['4px', '8px'];

  let framework = 'unknown';
  let router: IdentityLock['router'] = 'unknown';
  let styling = 'css';

  // 1. Inspect package.json across major frontend ecosystems
  const pkgPath = path.join(projectRoot, 'package.json');
  try {
    const pkgRaw = await fs.readFile(pkgPath, 'utf-8');
    const pkg = JSON.parse(pkgRaw);
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

    if (deps.next) {
      framework = 'next';
      try {
        await fs.access(path.join(projectRoot, 'app'));
        router = 'app';
      } catch {
        try {
          await fs.access(path.join(projectRoot, 'src', 'app'));
          router = 'app';
        } catch {
          router = 'pages';
        }
      }
    } else if (deps['@solidjs/start']) {
      framework = 'solid-start';
      router = 'solid-start';
    } else if (deps['solid-js']) {
      framework = 'solid';
      router = deps.vite ? 'vite' : 'solid-start';
    } else if (deps['@angular/core']) {
      framework = 'angular';
      router = 'angular';
    } else if (deps['@sveltejs/kit']) {
      framework = 'sveltekit';
      router = 'sveltekit';
    } else if (deps.svelte) {
      framework = 'svelte';
      router = deps.vite ? 'vite' : 'unknown';
    } else if (deps.nuxt) {
      framework = 'nuxt';
      router = 'nuxt';
    } else if (deps.vue) {
      framework = 'vue';
      router = deps.vite ? 'vite' : 'vue';
    } else if (deps['@builder.io/qwik']) {
      framework = 'qwik';
      router = 'qwik';
    } else if (deps.astro) {
      framework = 'astro';
      router = 'astro';
    } else if (deps.remix || deps['@remix-run/react']) {
      framework = 'remix';
      router = 'remix';
    } else if (deps.preact) {
      framework = 'preact';
      router = deps.vite ? 'vite' : 'unknown';
    } else if (deps.vite) {
      framework = 'vite';
      router = 'vite';
    } else if (deps.react) {
      framework = 'react';
    }

    if (deps.tailwindcss || deps['@tailwindcss/vite'] || deps['@tailwindcss/postcss']) {
      styling = 'tailwind';
    } else if (deps['styled-components']) {
      styling = 'styled-components';
    } else if (deps['@emotion/react']) {
      styling = 'emotion';
    } else if (deps.sass || deps['sass-embedded']) {
      styling = 'scss';
    }
  } catch {
    // No package.json found
  }

  // 2. Scan Tailwind configs
  const twConfigs = [
    'tailwind.config.js',
    'tailwind.config.ts',
    'tailwind.config.mjs',
    'tailwind.config.cjs',
  ];
  for (const cfg of twConfigs) {
    try {
      const content = await fs.readFile(path.join(projectRoot, cfg), 'utf-8');
      tokens.push({
        name: `tailwind-config`,
        value: cfg,
        confidence: 0.95,
        locked: true,
        source: cfg,
      });

      const colorMatches = content.matchAll(
        /(['"][a-zA-Z0-9_-]+['"])\s*:\s*(['"]#[0-9a-fA-F]{3,8}['"])/g
      );
      for (const m of colorMatches) {
        const key = m[1].replace(/['"]/g, '');
        const val = m[2].replace(/['"]/g, '');
        colors[key] = val;
        tokens.push({
          name: `color-${key}`,
          value: val,
          confidence: 0.9,
          locked: true,
          source: cfg,
        });
      }
      break;
    } catch {
      // not found
    }
  }

  // 3. Scan CSS/SCSS entrypoints (Next, Vite, Solid, SvelteKit, Angular, Vue/Nuxt, Astro)
  const cssCandidates = [
    'app/globals.css',
    'src/app/globals.css',
    'styles/globals.css',
    'src/index.css',
    'src/app.css',
    'src/styles.css',
    'src/styles.scss',
    'src/styles/global.css',
    'src/routes/styles.css',
    'src/assets/main.css',
    'assets/css/main.css',
    'app/assets/css/main.css',
    'app/app.css',
  ];
  for (const cand of cssCandidates) {
    try {
      const cssContent = await fs.readFile(path.join(projectRoot, cand), 'utf-8');
      if (cand.endsWith('.scss') && styling === 'css') {
        styling = 'scss';
      }
      const varMatches = cssContent.matchAll(/--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g);
      for (const vm of varMatches) {
        const varName = vm[1];
        const varVal = vm[2].trim();
        const isColorValue = /^(#[0-9a-fA-F]{3,8}|(?:rgb|hsl|oklch|oklab)\()/i.test(varVal);
        const isSemanticName =
          /(color|primary|secondary|accent|brand|bg|surface|ink|paper|canvas|text)/i.test(varName);
        if (isColorValue || isSemanticName) {
          colors[varName] = varVal;
          tokens.push({
            name: `--${varName}`,
            value: varVal,
            confidence: 0.88,
            locked: true,
            source: cand,
          });
        }
      }
      const fontMatch = cssContent.match(/font-family\s*:\s*['"]?([a-zA-Z0-9\s-]+?)['"]?(?:,|\s*;)/i);
      if (fontMatch && !fonts.includes(fontMatch[1].trim())) {
        fonts.push(fontMatch[1].trim());
      }
      break;
    } catch {
      // not found
    }
  }

  // 4. Scan DESIGN.md or brand guide
  const docCandidates = ['DESIGN.md', 'docs/DESIGN.md', 'BRAND.md'];
  for (const doc of docCandidates) {
    try {
      const docContent = await fs.readFile(path.join(projectRoot, doc), 'utf-8');
      tokens.push({
        name: 'brand-guide',
        value: doc,
        confidence: 0.99,
        locked: true,
        source: doc,
      });
      if (
        /deliberately\s+use\s+purple/i.test(docContent) ||
        /brand\s+color\s+is\s+purple/i.test(docContent)
      ) {
        waivers.push({
          ruleId: 'UI-004',
          token: 'color-purple',
          reason: 'Brand guideline explicitly specifies purple as primary brand color in ' + doc,
        });
      }
      break;
    } catch {
      // not found
    }
  }

  // 5. Build locked list from high confidence tokens (confidence > 0.80)
  for (const t of tokens) {
    if (t.confidence > 0.8) {
      t.locked = true;
      if (!locked.includes(t.name)) {
        locked.push(t.name);
      }
    }
  }

  const identity: IdentityLock = {
    $schema: 'https://chaff.dev/schemas/identity.v1.json',
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    framework,
    router,
    styling,
    fonts,
    colors,
    spacingRhythm,
    tokens,
    locked,
    waivers,
  };

  return identity;
}

export async function saveIdentity(projectRoot: string, identity: IdentityLock): Promise<string> {
  const chaffDir = path.join(projectRoot, '.chaff');
  await fs.mkdir(chaffDir, { recursive: true });
  const targetPath = path.join(chaffDir, 'identity.json');
  await fs.writeFile(targetPath, JSON.stringify(identity, null, 2), 'utf-8');
  return targetPath;
}

export async function loadIdentity(projectRoot: string): Promise<IdentityLock | null> {
  const targetPath = path.join(projectRoot, '.chaff', 'identity.json');
  try {
    const raw = await fs.readFile(targetPath, 'utf-8');
    return JSON.parse(raw) as IdentityLock;
  } catch {
    return null;
  }
}
