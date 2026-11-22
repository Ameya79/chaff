import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs/promises';
import { initCommand } from '../commands/init.js';
import { auditCommand } from '../commands/audit.js';
import { doctorCommand } from '../commands/doctor.js';
import { levelCommand } from '../commands/level.js';

describe('@chaff/cli End-to-End Fixtures Suite', () => {
  const rootDir = path.resolve(process.cwd());
  const fixturesDir = path.join(rootDir, 'fixtures');

  const FIXTURES = [
    'saas-landing',
    'dashboard',
    'portfolio',
    'blog',
    'ecommerce-shop',
    'docs-site',
    'legacy-pages-router',
    'tailwind-v4',
    'vite-react',
    'monorepo',
  ];

  test('chaff init works on all 10 fixtures and generates correct identity on at least 8', async () => {
    let successfulIdentities = 0;

    for (const fx of FIXTURES) {
      const fxPath = path.join(fixturesDir, fx);
      await initCommand(fxPath, { force: true, level: '2', agents: 'cursor,claude,antigravity' });

      // Verify .chaff/identity.json exists
      const identityPath = path.join(fxPath, '.chaff', 'identity.json');
      const identityRaw = await fs.readFile(identityPath, 'utf-8');
      const identity = JSON.parse(identityRaw);
      assert.ok(identity, `identity.json must exist for ${fx}`);

      if (identity.framework !== 'unknown' || identity.tokens.length > 0) {
        successfulIdentities++;
      }

      // Verify .chaff/config.json exists
      const configPath = path.join(fxPath, '.chaff', 'config.json');
      const configRaw = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(configRaw);
      assert.strictEqual(config.level, 2);

      // Verify adapter generated
      const cursorRule = path.join(fxPath, '.cursor', 'rules', 'chaff.mdc');
      const cursorExists = await fs
        .access(cursorRule)
        .then(() => true)
        .catch(() => false);
      assert.ok(cursorExists, `Cursor adapter must be generated for ${fx}`);
    }

    assert.ok(
      successfulIdentities >= 8,
      `Expected at least 8 fixtures with correct framework/identity extraction, got ${successfulIdentities}`
    );
  });

  test('chaff audit runs on all 10 fixtures producing chaff-report.json and chaff-report.md', async () => {
    for (const fx of FIXTURES) {
      const fxPath = path.join(fixturesDir, fx);
      await auditCommand(fxPath, {});

      // Verify chaff-report.json exists
      const reportJsonPath = path.join(fxPath, 'chaff-report.json');
      const reportRaw = await fs.readFile(reportJsonPath, 'utf-8');
      const report = JSON.parse(reportRaw);
      assert.ok(report.summary.totalScore >= 0 && report.summary.totalScore <= 100);
      assert.ok(Array.isArray(report.findings));

      // Verify chaff-report.md exists
      const reportMdPath = path.join(fxPath, 'chaff-report.md');
      const reportMd = await fs.readFile(reportMdPath, 'utf-8');
      assert.ok(reportMd.includes('# Chaff Audit Report'));
      assert.ok(reportMd.includes('Score Breakdown'));
    }
  });

  test('chaff level switches operating level cleanly', async () => {
    const fxPath = path.join(fixturesDir, 'saas-landing');
    await levelCommand(fxPath, '3');

    const configRaw = await fs.readFile(path.join(fxPath, '.chaff', 'config.json'), 'utf-8');
    const config = JSON.parse(configRaw);
    assert.strictEqual(config.level, 3);
  });
});
