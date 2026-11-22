import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { formatPrComment, CHAFF_COMMENT_HEADER, runPrAction } from '../index.js';

describe('GitHub Action PR Comment Generator', () => {
  const rootDir = path.resolve(process.cwd());

  test('formats sticky PR comment with header and budget matrix', () => {
    const comment = formatPrComment({
      report: {
        schemaVersion: '1.0.0',
        timestamp: new Date().toISOString(),
        projectRoot: '.',
        summary: {
          totalScore: 92,
          scores: { visual: 90, copy: 95, code: 90, performance: 93 },
          findingsCount: { open: 1, waived: 1, fixed: 0, total: 2 },
          levelUsed: 2,
        },
        findings: [
          {
            id: 'f1',
            ruleId: 'UI-004',
            category: 'ui',
            severity: 'high',
            message: 'Purple gradient',
            file: 'app/page.tsx',
            line: 10,
            evidence: 'bg-purple',
            fixClass: 'color',
            status: 'open',
          },
        ],
        identitySummary: { framework: 'next', lockedCount: 2, waiversCount: 1 },
      },
      gateReport: {
        level: 2,
        passed: true,
        failuresCount: 0,
        results: [
          {
            metric: 'Horizontal Overflow at 320px',
            budget: 'Zero overflow',
            measured: 'Zero overflow',
            status: 'pass',
          },
        ],
      },
      previousScore: 85,
    });

    assert.ok(comment.startsWith(CHAFF_COMMENT_HEADER), 'Must include sticky comment header');
    assert.ok(comment.includes('**Overall Chaff Score:** **92 / 100** (+7)'));
    assert.ok(comment.includes('Category Scores'));
    assert.ok(comment.includes('Performance & Mobile Budgets'));
    assert.ok(comment.includes('UI-004'));
  });

  test('runPrAction executes audit and gate against a directory', async () => {
    const heroDir = path.join(rootDir, 'examples', 'l3-hero');
    const result = await runPrAction(heroDir, 3);
    assert.strictEqual(result.passed, true);
    assert.ok(result.commentMarkdown.includes('Chaff Design & Performance Audit'));
  });
});
