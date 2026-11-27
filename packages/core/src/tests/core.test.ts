import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import {
  loadAllRules,
  getRuleById,
  filterRulesByLevel,
  buildIdentity,
  calculateSummary,
  generateAdapters,
} from '../index.js';

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

describe('@chaff/core', () => {
  const rootDir = findRepoRoot();

  test('loadAllRules loads all 72 rules', async () => {
    const rulesDir = path.join(rootDir, 'rules');
    const rules = await loadAllRules(rulesDir);
    assert.strictEqual(rules.length, 72, `Expected 72 rules, got ${rules.length}`);

    const ui001 = rules.find((r) => r.id === 'UI-001');
    assert.ok(ui001, 'UI-001 must exist');
    assert.strictEqual(ui001.category, 'ui');
    assert.ok(ui001.contextProblem.length > 15);
  });

  test('getRuleById returns specific rule', async () => {
    const rulesDir = path.join(rootDir, 'rules');
    const rule = await getRuleById('THREE-004', rulesDir);
    assert.ok(rule, 'THREE-004 must exist');
    assert.strictEqual(rule.fix_class, 'frame_governor');
  });

  test('filterRulesByLevel filters correctly', async () => {
    const rulesDir = path.join(rootDir, 'rules');
    const rules = await loadAllRules(rulesDir);

    const l1Rules = filterRulesByLevel(rules, 1);
    const l2Rules = filterRulesByLevel(rules, 2);
    const l3Rules = filterRulesByLevel(rules, 3);

    assert.ok(l1Rules.length > 0);
    assert.ok(l2Rules.length > 0);
    assert.ok(l3Rules.length > 0);
    // Level 3 should include all 9 Three.js rules
    const threeRulesInL3 = l3Rules.filter((r) => r.category === 'three');
    assert.strictEqual(threeRulesInL3.length, 9);
  });

  test('buildIdentity extracts tokens and recognizes waivers', async () => {
    const fixturePath = path.join(rootDir, 'fixtures', 'tailwind-v4');
    const identity = await buildIdentity(fixturePath);

    assert.strictEqual(identity.framework, 'next');
    assert.ok(identity.locked.length > 0);
    // Should have recognized purple brand waiver in DESIGN.md
    assert.strictEqual(identity.waivers.length, 1);
    assert.strictEqual(identity.waivers[0].ruleId, 'UI-004');
  });

  test('calculateSummary properly handles scores and waivers', () => {
    const summary = calculateSummary([
      {
        id: 'f1',
        ruleId: 'UI-004',
        category: 'ui',
        severity: 'high',
        message: 'Purple gradient',
        file: 'test.tsx',
        line: 1,
        evidence: 'bg-purple',
        fixClass: 'color_hygiene',
        status: 'waived',
        waiverReason: 'Intentional brand color',
      },
      {
        id: 'f2',
        ruleId: 'COPY-001',
        category: 'copy',
        severity: 'high',
        message: 'Buzzword',
        file: 'test.tsx',
        line: 2,
        evidence: 'delve',
        fixClass: 'voice',
        status: 'open',
      },
    ]);

    assert.strictEqual(summary.findingsCount.open, 1);
    assert.strictEqual(summary.findingsCount.waived, 1);
    // Visual score should remain 100 because UI-004 was waived!
    assert.strictEqual(summary.scores.visual, 100);
    // Copy score should deduct 8 points for open high-severity finding
    assert.strictEqual(summary.scores.copy, 92);
  });

  test('buildIdentity detects SolidJS, Angular, SvelteKit, Nuxt, and Astro projects cleanly', async () => {
    const tempRoot = await fsp.mkdtemp(path.join(os.tmpdir(), 'chaff-core-fw-'));
    try {
      const frameworks = [
        { name: 'legacy-angular', deps: { angular: '^1.8.0' }, cssRel: 'src/index.css', cssBody: ':root { --ink: #141A15; }', expectedFramework: 'angularjs', expectedRouter: 'unknown' },
        {
          name: 'solid-js-app',
          deps: { 'solid-js': '^1.9.0', vite: '^6.0.0' },
          cssRel: 'src/index.css',
          cssBody: ':root { --brand: #2E6648; } body { font-family: "Inter", sans-serif; }',
          expectedFramework: 'solid',
          expectedRouter: 'vite',
        },
        {
          name: 'solid-start-app',
          deps: { '@solidjs/start': '^1.1.0', 'solid-js': '^1.9.0' },
          cssRel: 'src/app.css',
          cssBody: ':root { --brand: #2E6648; }',
          expectedFramework: 'solid-start',
          expectedRouter: 'solid-start',
        },
        {
          name: 'angular-app',
          deps: { '@angular/core': '^19.0.0', '@angular/router': '^19.0.0' },
          cssRel: 'src/styles.scss',
          cssBody: ':root { --surface: #F1F2EC; }',
          expectedFramework: 'angular',
          expectedRouter: 'angular',
          expectedStyling: 'scss',
        },
        {
          name: 'sveltekit-app',
          deps: { '@sveltejs/kit': '^2.12.0', svelte: '^5.0.0' },
          cssRel: 'src/app.css',
          cssBody: ':root { --ink: #141A15; }',
          expectedFramework: 'sveltekit',
          expectedRouter: 'sveltekit',
        },
        {
          name: 'nuxt-app',
          deps: { nuxt: '^3.14.0', vue: '^3.5.0', '@tailwindcss/vite': '^4.0.0' },
          cssRel: 'assets/css/main.css',
          cssBody: ':root { --accent: #2E6648; }',
          expectedFramework: 'nuxt',
          expectedRouter: 'nuxt',
          expectedStyling: 'tailwind',
        },
        {
          name: 'astro-app',
          deps: { astro: '^5.0.0' },
          cssRel: 'src/styles/global.css',
          cssBody: ':root { --paper: #FBFBF7; }',
          expectedFramework: 'astro',
          expectedRouter: 'astro',
        },
      ];

      for (const fw of frameworks) {
        const dir = path.join(tempRoot, fw.name);
        await fsp.mkdir(path.join(dir, path.dirname(fw.cssRel)), { recursive: true });
        await fsp.writeFile(
          path.join(dir, 'package.json'),
          JSON.stringify({
            name: fw.name,
            dependencies: fw.deps,
          })
        );
        await fsp.writeFile(path.join(dir, fw.cssRel), fw.cssBody);

        const id = await buildIdentity(dir);
        assert.strictEqual(id.framework, fw.expectedFramework, `Expected ${fw.name} framework`);
        assert.strictEqual(id.router, fw.expectedRouter, `Expected ${fw.name} router`);
        if (fw.expectedStyling) {
          assert.strictEqual(id.styling, fw.expectedStyling, `Expected ${fw.name} styling`);
        }
        assert.ok(id.locked.length >= 1, `Expected at least 1 locked token for ${fw.name}`);
      }
    } finally {
      await fsp.rm(tempRoot, { recursive: true, force: true });
    }
  });
});
