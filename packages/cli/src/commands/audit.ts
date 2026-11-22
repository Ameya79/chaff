import fs from 'node:fs/promises';
import path from 'node:path';
import pc from 'picocolors';
import {
  loadIdentity,
  buildIdentity,
  generateReportJson,
  generateReportMarkdown,
  RuleLevel,
} from '@chaff/core';
import { runSourceChecks } from '@chaff/checks';

export interface AuditCommandOptions {
  json?: boolean;
  routes?: string;
  level?: string;
  strict?: boolean;
}

export async function auditCommand(projectRoot: string, options: AuditCommandOptions = {}) {
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

  // 2. Load or build identity
  let identity = await loadIdentity(projectRoot);
  if (!identity) {
    identity = await buildIdentity(projectRoot);
  }

  // 3. Run source checks
  const routesList = options.routes ? options.routes.split(',').map((r) => r.trim()) : undefined;
  const findings = await runSourceChecks(projectRoot, identity, { routes: routesList });

  // 4. Generate report
  const report = generateReportJson(projectRoot, findings, identity, level);
  const reportMd = generateReportMarkdown(report);

  // 5. Write reports to disk
  await fs.writeFile(path.join(projectRoot, 'chaff-report.json'), JSON.stringify(report, null, 2), 'utf-8');
  await fs.writeFile(path.join(projectRoot, 'chaff-report.md'), reportMd, 'utf-8');

  // 6. Handle JSON output flag
  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  // 7. Pretty terminal output
  console.log(pc.bold(pc.cyan('\n================= CHAFF DESIGN AUDIT =================')));
  console.log(`Operating Level: ${pc.bold(`Level ${level}`)}  |  Timestamp: ${pc.dim(report.timestamp)}`);
  console.log(`Framework: ${pc.yellow(identity.framework)}  |  Locked Tokens: ${identity.locked.length}  |  Waivers: ${identity.waivers.length}\n`);

  const { totalScore, scores, findingsCount } = report.summary;
  const scoreColor = totalScore >= 80 ? pc.green : totalScore >= 60 ? pc.yellow : pc.red;
  console.log(`Overall Chaff Score: ${scoreColor(pc.bold(`${totalScore} / 100`))}\n`);

  console.log(pc.bold('Category Breakdown:'));
  console.log(`  Visual & Layout:      ${scores.visual >= 80 ? pc.green(`${scores.visual}/100`) : pc.yellow(`${scores.visual}/100`)}`);
  console.log(`  Copy & Voice:         ${scores.copy >= 80 ? pc.green(`${scores.copy}/100`) : pc.yellow(`${scores.copy}/100`)}`);
  console.log(`  Code & Semantics:     ${scores.code >= 80 ? pc.green(`${scores.code}/100`) : pc.yellow(`${scores.code}/100`)}`);
  console.log(`  Performance & Mobile: ${scores.performance >= 80 ? pc.green(`${scores.performance}/100`) : pc.yellow(`${scores.performance}/100`)}\n`);

  console.log(pc.bold(`Findings (${findingsCount.open} Open, ${findingsCount.waived} Waived):`));

  if (findingsCount.open === 0) {
    console.log(pc.green('  ✓ No design tells detected! Your design is clean grain.'));
  } else {
    for (const f of findings.filter((x) => x.status === 'open').slice(0, 15)) {
      const badge = f.severity === 'high' ? pc.red(`[HIGH]`) : f.severity === 'medium' ? pc.yellow(`[MED]`) : pc.dim(`[LOW]`);
      console.log(`  ${badge} ${pc.bold(f.ruleId)}: ${f.message}`);
      console.log(`         ${pc.dim(`${f.file}:${f.line}`)}`);
    }
    if (findingsCount.open > 15) {
      console.log(pc.dim(`  ... and ${findingsCount.open - 15} more findings (see chaff-report.md).`));
    }
  }

  if (findingsCount.waived > 0) {
    console.log(pc.cyan(`\nWaived Findings (${findingsCount.waived}):`));
    for (const f of findings.filter((x) => x.status === 'waived')) {
      console.log(`  ${pc.cyan('[WAIVED]')} ${f.ruleId} (${f.file}:${f.line}) — ${f.waiverReason}`);
    }
  }

  console.log(pc.dim(`\nAudit reports saved to chaff-report.json and chaff-report.md\n`));

  if (options.strict && totalScore < 80) {
    process.exit(1);
  }
}
