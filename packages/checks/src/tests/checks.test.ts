import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import { buildIdentity } from '@chaff/core';
import { runSourceChecks, checkRenderedBudgets } from '../index.js';

function findRepoRoot(dir = process.cwd()): string {
  let cur = path.resolve(dir);
  while (cur !== path.dirname(cur)) {
    if (fs.existsSync(path.join(cur, 'pnpm-workspace.yaml'))) {
      return cur;
    }
    cur = path.dirname(cur);
  }
  return cur;
}

describe('@chaff/checks', () => {
  const rootDir = findRepoRoot();

  test('detects UI tells in saas-landing fixture', async () => {
    const fixtureDir = path.join(rootDir, 'fixtures', 'saas-landing');
    const identity = await buildIdentity(fixtureDir);
    const findings = await runSourceChecks(fixtureDir, identity);

    // Should detect UI-004 (purple gradient) and UI-008 (min-h-screen)
    const ui004 = findings.find((f) => f.ruleId === 'UI-004');
    const ui008 = findings.find((f) => f.ruleId === 'UI-008');
    assert.ok(ui004, 'Must detect UI-004 purple gradient');
    assert.ok(ui008, 'Must detect UI-008 min-h-screen');
    assert.strictEqual(ui004.status, 'open');
  });

  test('waives intentional purple gradient when waiver present in identity', async () => {
    const fixtureDir = path.join(rootDir, 'fixtures', 'tailwind-v4');
    const identity = await buildIdentity(fixtureDir);
    const findings = await runSourceChecks(fixtureDir, identity);

    const ui004 = findings.find((f) => f.ruleId === 'UI-004');
    assert.ok(ui004, 'UI-004 finding exists in codebase');
    assert.strictEqual(ui004.status, 'waived', 'UI-004 must be marked WAIVED due to DESIGN.md brand waiver');
  });

  test('detects copy tells (buzzwords and synthetic metrics)', async () => {
    const fixtureDir = path.join(rootDir, 'fixtures', 'saas-landing');
    const findings = await runSourceChecks(fixtureDir, null);

    const copy001 = findings.find((f) => f.ruleId === 'COPY-001');
    const copy003 = findings.find((f) => f.ruleId === 'COPY-003');
    assert.ok(copy001, 'Must detect COPY-001 buzzwords (delve/cutting-edge)');
    assert.ok(copy003, 'Must detect COPY-003 synthetic metric (99.9% uptime)');
  });

  test('detects non-semantic div with onClick in dashboard', async () => {
    const fixtureDir = path.join(rootDir, 'fixtures', 'dashboard');
    const findings = await runSourceChecks(fixtureDir, null);

    const code001 = findings.find((f) => f.ruleId === 'CODE-001');
    const code007 = findings.find((f) => f.ruleId === 'CODE-007');
    assert.ok(code001, 'Must detect CODE-001 non-semantic clickable div');
    assert.ok(code007, 'Must detect CODE-007 console.log in component');
  });

  test('detects 320px mobile viewport overflow and user-scalable=no in portfolio', async () => {
    const fixtureDir = path.join(rootDir, 'fixtures', 'portfolio');
    const findings = await runSourceChecks(fixtureDir, null);

    const mob001 = findings.find((f) => f.ruleId === 'MOBILE-001');
    const mob004 = findings.find((f) => f.ruleId === 'MOBILE-004');
    assert.ok(mob001, 'Must detect MOBILE-001 fixed desktop width');
    assert.ok(mob004, 'Must detect MOBILE-004 user-scalable=no');
  });

  test('detects touch targets and unlabeled inputs in ecommerce-shop', async () => {
    const fixtureDir = path.join(rootDir, 'fixtures', 'ecommerce-shop');
    const findings = await runSourceChecks(fixtureDir, null);

    const mob002 = findings.find((f) => f.ruleId === 'MOBILE-002');
    const a11y003 = findings.find((f) => f.ruleId === 'A11Y-003');
    assert.ok(mob002, 'Must detect MOBILE-002 touch target under 44px');
    assert.ok(a11y003, 'Must detect A11Y-003 unlabeled input');
  });

  test('detects three.js synchronous import and uncapped DPR in vite-react', async () => {
    const fixtureDir = path.join(rootDir, 'fixtures', 'vite-react');
    const findings = await runSourceChecks(fixtureDir, null);

    const three004 = findings.find((f) => f.ruleId === 'THREE-004');
    assert.ok(three004, 'Must detect THREE-004 uncapped pixel ratio');
  });

  test('detects tells across SolidJS, Angular, SvelteKit, and Vue/Nuxt workspaces', async () => {
    const tmpRoot = await fsp.mkdtemp(path.join(os.tmpdir(), 'chaff-fw-checks-'));
    try {
      // 1. SolidJS static 3D route + div onClick
      const solidDir = path.join(tmpRoot, 'solid-app');
      await fsp.mkdir(path.join(solidDir, 'src', 'routes'), { recursive: true });
      await fsp.writeFile(
        path.join(solidDir, 'package.json'),
        JSON.stringify({ dependencies: { 'solid-js': '^1.9.0', three: '^0.170.0' } })
      );
      await fsp.writeFile(
        path.join(solidDir, 'src', 'routes', 'index.tsx'),
        `import * as THREE from 'three';\nexport default function Home() {\n  return <div onClick={() => console.log(THREE)}>Open</div>;\n}`
      );
      const solidIdentity = await buildIdentity(solidDir);
      const solidFindings = await runSourceChecks(solidDir, solidIdentity);
      assert.ok(solidFindings.some((f) => f.ruleId === 'CODE-001'), 'SolidJS clickable div caught');
      assert.ok(solidFindings.some((f) => f.ruleId === 'THREE-001'), 'SolidJS static 3D caught');

      // 2. Angular (click) div + ngSrc pass vs raw img fail
      const angularDir = path.join(tmpRoot, 'angular-app');
      await fsp.mkdir(path.join(angularDir, 'src', 'app'), { recursive: true });
      await fsp.writeFile(
        path.join(angularDir, 'package.json'),
        JSON.stringify({ dependencies: { '@angular/core': '^19.0.0' } })
      );
      await fsp.writeFile(
        path.join(angularDir, 'src', 'app', 'hero.component.html'),
        `<div (click)="launch()">Go</div>\n<img ngSrc="/hero.webp" width="600" height="400" alt="Hero" />`
      );
      const angularIdentity = await buildIdentity(angularDir);
      const angularFindings = await runSourceChecks(angularDir, angularIdentity);
      assert.ok(angularFindings.some((f) => f.ruleId === 'CODE-001'), 'Angular (click) div caught');
      assert.ok(!angularFindings.some((f) => f.ruleId === 'CODE-003'), 'Angular ngSrc img allowed');

      // 3. SvelteKit +page.svelte with on:click & static @threlte/core
      const svelteDir = path.join(tmpRoot, 'sveltekit-app');
      await fsp.mkdir(path.join(svelteDir, 'src', 'routes'), { recursive: true });
      await fsp.writeFile(
        path.join(svelteDir, 'package.json'),
        JSON.stringify({ dependencies: { '@sveltejs/kit': '^2.10.0', svelte: '^5.0.0' } })
      );
      await fsp.writeFile(
        path.join(svelteDir, 'src', 'routes', '+page.svelte'),
        `<script>import { Canvas } from '@threlte/core';</script>\n<div on:click={() => {}}>Trigger</div>\n<Canvas />`
      );
      const svelteIdentity = await buildIdentity(svelteDir);
      const svelteFindings = await runSourceChecks(svelteDir, svelteIdentity);
      assert.ok(svelteFindings.some((f) => f.ruleId === 'CODE-001'), 'Svelte on:click div caught');
      assert.ok(svelteFindings.some((f) => f.ruleId === 'THREE-001'), 'Svelte static @threlte/core caught');

      // 4. Vue/Nuxt @click div + rendered Level 3 contract pass using Solid lazy() & tier/governor
      const vueDir = path.join(tmpRoot, 'vue-app');
      await fsp.mkdir(path.join(vueDir, 'src'), { recursive: true });
      await fsp.writeFile(
        path.join(vueDir, 'package.json'),
        JSON.stringify({ dependencies: { nuxt: '^3.14.0', vue: '^3.5.0' } })
      );
      await fsp.writeFile(
        path.join(vueDir, 'src', 'App.vue'),
        `<template><div @click="open">Click</div></template>`
      );
      const vueFindings = await runSourceChecks(vueDir, await buildIdentity(vueDir));
      assert.ok(vueFindings.some((f) => f.ruleId === 'CODE-001'), 'Vue @click div caught');

      // 5. Level 3 checkRenderedBudgets on SolidJS Vite project with lazy() + compiled dist/
      const solidL3Dir = path.join(tmpRoot, 'solid-l3');
      await fsp.mkdir(path.join(solidL3Dir, 'src'), { recursive: true });
      await fsp.mkdir(path.join(solidL3Dir, 'dist', 'assets'), { recursive: true });
      await fsp.writeFile(
        path.join(solidL3Dir, 'src', 'Scene.tsx'),
        `import { lazy } from 'solid-js';\nimport * as THREE from 'three';\nimport { tier, governor } from '@chaff/tier';\nexport const LazyCanvas = lazy(() => import('./Canvas'));\nexport function StagePoster() { return <svg />; }\nconst g = governor(() => {});\nexport function cleanup(r: THREE.WebGLRenderer) { tier(); g.dispose(); r.dispose(); }`
      );
      await fsp.writeFile(
        path.join(solidL3Dir, 'dist', 'index.html'),
        `<!doctype html><html><body><script type="module" src="/assets/index.js"></script></body></html>`
      );
      await fsp.writeFile(path.join(solidL3Dir, 'dist', 'assets', 'index.js'), 'console.log("solid app");');
      await fsp.writeFile(path.join(solidL3Dir, 'dist', 'assets', 'three-stage.js'), 'export const s = 1;');

      const gate = await checkRenderedBudgets(solidL3Dir, 3);
      assert.strictEqual(gate.passed, true, `SolidJS L3 gate failed: ${JSON.stringify(gate.results)}`);
      assert.ok(gate.results.some((r) => r.metric === 'Level 3 Fallback Contract (5 Parts)' && r.status === 'pass'));
    } finally {
      await fsp.rm(tmpRoot, { recursive: true, force: true });
    }
  });
});

test('advertised stacks yield findings in native templates', async () => {
  const cases = [
    ['react', 'react', 'jsx', 'onClick={save}'],
    ['next', 'next', 'tsx', 'onClick={save}'],
    ['solid-js', 'solid', 'tsx', 'onClick={save}'],
    ['vite', 'vite', 'html', 'onclick="save()"'],
    ['@angular/core', 'angular', 'html', '(click)="save()"'],
    ['angular', 'angularjs', 'html', 'ng-click="save()"'],
    ['@sveltejs/kit', 'sveltekit', 'svelte', 'onclick={save}'],
    ['vue', 'vue', 'vue', '@click="save"'],
    ['nuxt', 'nuxt', 'vue', '@click="save"'],
    ['astro', 'astro', 'astro', 'onclick="save()"'],
  ];
  for (const [dependency, expected, extension, binding] of cases) {
    const dir = await fsp.mkdtemp(path.join(os.tmpdir(), 'chaff-stack-'));
    try {
      await fsp.writeFile(path.join(dir, 'package.json'), JSON.stringify({ dependencies: { [dependency]: '*' } }));
      await fsp.writeFile(path.join(dir, 'Screen.' + extension), '<div ' + binding + '>Save</div>');
      const identity = await buildIdentity(dir);
      assert.equal(identity.framework, expected);
      const findings = await runSourceChecks(dir, identity);
      assert.ok(findings.some(f => f.ruleId === 'CODE-001'), dependency);
    } finally {
      await fsp.rm(dir, { recursive: true, force: true });
    }
  }
});
