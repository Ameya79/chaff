import { ChaffReport, Finding, IdentityLock, ReportSummary, RuleLevel } from './types.js';

export function calculateSummary(
  findings: Finding[],
  levelUsed: RuleLevel = 2
): ReportSummary {
  const openFindings = findings.filter((f) => f.status === 'open');
  const waivedFindings = findings.filter((f) => f.status === 'waived');
  const fixedFindings = findings.filter((f) => f.status === 'fixed');

  // Starting scores out of 100
  let visualScore = 100;
  let copyScore = 100;
  let codeScore = 100;
  let perfScore = 100;

  for (const f of openFindings) {
    const deduction = f.severity === 'high' ? 8 : f.severity === 'medium' ? 4 : 2;
    if (f.category === 'ui' || f.category === 'motion' || f.category === 'three') {
      visualScore = Math.max(0, visualScore - deduction);
    } else if (f.category === 'copy') {
      copyScore = Math.max(0, copyScore - deduction);
    } else if (f.category === 'code' || f.category === 'a11y') {
      codeScore = Math.max(0, codeScore - deduction);
    } else if (f.category === 'perf' || f.category === 'mobile') {
      perfScore = Math.max(0, perfScore - deduction);
    }
  }

  const totalScore = Math.round(
    (visualScore + copyScore + codeScore + perfScore) / 4
  );

  return {
    totalScore,
    scores: {
      visual: visualScore,
      copy: copyScore,
      code: codeScore,
      performance: perfScore,
    },
    findingsCount: {
      open: openFindings.length,
      waived: waivedFindings.length,
      fixed: fixedFindings.length,
      total: findings.length,
    },
    levelUsed,
  };
}

export function generateReportJson(
  projectRoot: string,
  findings: Finding[],
  identity: IdentityLock | null,
  level: RuleLevel = 2
): ChaffReport {
  const summary = calculateSummary(findings, level);

  return {
    schemaVersion: '1.0.0',
    timestamp: new Date().toISOString(),
    projectRoot,
    summary,
    findings,
    identitySummary: {
      framework: identity?.framework || 'unknown',
      lockedCount: identity?.locked.length || 0,
      waiversCount: identity?.waivers.length || 0,
    },
  };
}

export function generateReportMarkdown(report: ChaffReport): string {
  const { summary, findings, identitySummary } = report;

  let md = `# Chaff Audit Report\n\n`;
  md += `**Timestamp:** ${report.timestamp}  \n`;
  md += `**Operating Level:** Level ${summary.levelUsed}  \n`;
  md += `**Overall Chaff Score:** **${summary.totalScore} / 100**\n\n`;

  md += `## Score Breakdown\n\n`;
  md += `| Category | Score | Status |\n`;
  md += `|---|:---:|:---:|\n`;
  md += `| **Visual & Layout** | ${summary.scores.visual} / 100 | ${summary.scores.visual >= 80 ? 'PASS' : 'WARN'} |\n`;
  md += `| **Copy & Voice** | ${summary.scores.copy} / 100 | ${summary.scores.copy >= 80 ? 'PASS' : 'WARN'} |\n`;
  md += `| **Code & Semantics** | ${summary.scores.code} / 100 | ${summary.scores.code >= 80 ? 'PASS' : 'WARN'} |\n`;
  md += `| **Performance & Mobile** | ${summary.scores.performance} / 100 | ${summary.scores.performance >= 80 ? 'PASS' : 'WARN'} |\n\n`;

  md += `## Identity Lock Summary\n\n`;
  md += `- **Detected Framework:** ${identitySummary.framework}\n`;
  md += `- **Locked Design Tokens:** ${identitySummary.lockedCount}\n`;
  md += `- **Approved Waivers:** ${identitySummary.waiversCount}\n\n`;

  md += `## Findings (${summary.findingsCount.open} Open, ${summary.findingsCount.waived} Waived)\n\n`;

  if (findings.length === 0) {
    md += `Zero AI tells or protocol violations detected. Clean grain!\n`;
  } else {
    for (const f of findings) {
      const statusBadge = f.status === 'waived' ? `[WAIVED - ${f.waiverReason || 'Intentional identity'}]` : `[${f.severity.toUpperCase()}]`;
      md += `### ${statusBadge} ${f.ruleId}: ${f.message}\n\n`;
      md += `- **Location:** \`${f.file}:${f.line}\`\n`;
      md += `- **Fix Class:** \`${f.fixClass}\`\n`;
      md += `- **Evidence:**\n\`\`\`\n${f.evidence}\n\`\`\`\n\n`;
    }
  }

  return md;
}
