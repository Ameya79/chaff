import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import {
  loadAllRules,
  getRuleById,
  filterRulesByLevel,
  buildIdentity,
  calculateSummary,
  generateAdapters,
} from '../index.js';

describe('@chaff/core', () => {
  const rootDir = path.resolve(process.cwd());

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
});
