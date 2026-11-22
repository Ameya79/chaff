import fs from 'node:fs/promises';
import path from 'node:path';
import pc from 'picocolors';
import { RuleLevel } from '@chaff/core';
import { checkRenderedBudgets } from '@chaff/checks';

export interface GateOptions {
  level?: string;
  strict?: boolean;
}

export async function gateCommand(projectRoot: string, options: GateOptions = {}): Promise<boolean> {
  // 1. Determine level
  let level: RuleLevel = 2;
  if (options.level) {
    const parsed = parseInt(options.level, 10);
    if ([1, 2, 3].includes(parsed)) level = parsed as RuleLevel;
  } else {
    try {
      const cfgRaw = await fs.readFile(path.join(projectRoot, '.chaff', 'config.json'), 'utf-8');
      const cfg = JSON.parse(cfgRaw);
      if (cfg.level) level = cfg.level;
    } catch {
      // default 2
    }
  }

  console.log(pc.bold(pc.cyan('\n================= CHAFF PERFORMANCE & MOBILE GATE =================')));
  console.log(`Operating Level: ${pc.bold(`Level ${level}`)}  |  Target: ${pc.yellow(projectRoot)}\n`);

  // 2. Evaluate budgets
  const report = await checkRenderedBudgets(projectRoot, level);

  // 3. Print budget results table
  console.log(pc.bold('Performance & Mobile Budget Evaluation:'));
  console.log('-------------------------------------------------------------------------------------');
  console.log(
    `${'Metric'.padEnd(35)} | ${'Target Budget'.padEnd(25)} | ${'Measured'.padEnd(20)} | Status`
  );
  console.log('-------------------------------------------------------------------------------------');

  for (const r of report.results) {
    const statusText = r.status === 'pass' ? pc.green('PASS') : pc.red('FAIL');
    console.log(
      `${r.metric.padEnd(35)} | ${r.budget.padEnd(25)} | ${r.measured.padEnd(20)} | ${statusText}`
    );
    if (r.detail) {
      console.log(`   ${pc.dim(`↳ ${r.detail}`)}`);
    }
  }
  console.log('-------------------------------------------------------------------------------------\n');

  if (report.passed) {
    console.log(pc.bold(pc.green(`✓ GATE PASSED: All ${report.results.length} performance & mobile budgets satisfied.\n`)));
    return true;
  } else {
    console.error(pc.bold(pc.red(`✗ GATE FAILED: ${report.failuresCount} budget violation(s) detected.\n`)));
    console.error(pc.yellow('Remediation Rule: Downgrade effect complexity, never loosen the budget.\n'));
    if (options.strict !== false) {
      process.exitCode = 1;
    }
    return false;
  }
}
