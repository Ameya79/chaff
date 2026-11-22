import { ChaffReport, RuleLevel } from '@chaff/core';
import { GateReport } from '@chaff/checks';

export const CHAFF_COMMENT_HEADER = '<!-- chaff-pr-comment -->';

export interface PrCommentData {
  report: ChaffReport;
  gateReport: GateReport;
  previousScore?: number;
}

export function formatPrComment(data: PrCommentData): string {
  const { report, gateReport, previousScore } = data;
  const currentScore = report.summary.totalScore;
  const scoreDiff = previousScore !== undefined ? currentScore - previousScore : 0;
  const scoreDiffStr =
    previousScore !== undefined
      ? scoreDiff > 0
        ? `(+${scoreDiff})`
        : scoreDiff < 0
        ? `(${scoreDiff})`
        : `(±0)`
      : '';

  let comment = `${CHAFF_COMMENT_HEADER}\n`;
  comment += `## 🌾 Chaff Design & Performance Audit\n\n`;
  comment += `**Operating Level:** Level ${report.summary.levelUsed}  \n`;
  comment += `**Overall Chaff Score:** **${currentScore} / 100** ${scoreDiffStr}\n\n`;

  comment += `### Category Scores\n\n`;
  comment += `| Area | Score | Status |\n`;
  comment += `|---|:---:|:---:|\n`;
  comment += `| **Visual & Layout** | ${report.summary.scores.visual}/100 | ${report.summary.scores.visual >= 80 ? '✅ Pass' : '⚠️ Warn'} |\n`;
  comment += `| **Copy & Voice** | ${report.summary.scores.copy}/100 | ${report.summary.scores.copy >= 80 ? '✅ Pass' : '⚠️ Warn'} |\n`;
  comment += `| **Code & Semantics** | ${report.summary.scores.code}/100 | ${report.summary.scores.code >= 80 ? '✅ Pass' : '⚠️ Warn'} |\n`;
  comment += `| **Performance & Mobile** | ${report.summary.scores.performance}/100 | ${report.summary.scores.performance >= 80 ? '✅ Pass' : '⚠️ Warn'} |\n\n`;

  comment += `### Performance & Mobile Budgets\n\n`;
  comment += `| Metric | Target Budget | Measured | Status |\n`;
  comment += `|---|---|---|:---:|\n`;
  for (const r of gateReport.results) {
    const statusIcon = r.status === 'pass' ? '✅ PASS' : '❌ FAIL';
    comment += `| **${r.metric}** | ${r.budget} | ${r.measured} | ${statusIcon} |\n`;
  }
  comment += `\n`;

  const openFindings = report.findings.filter((f) => f.status === 'open');
  comment += `### Findings (${openFindings.length} Open, ${report.summary.findingsCount.waived} Waived)\n\n`;

  if (openFindings.length === 0) {
    comment += `> ✨ **Clean Grain:** Zero AI tells or design anti-patterns detected on this branch.\n`;
  } else {
    for (const f of openFindings.slice(0, 5)) {
      comment += `- **[${f.severity.toUpperCase()}] \`${f.ruleId}\`:** ${f.message} (\`${f.file}:${f.line}\`)\n`;
    }
    if (openFindings.length > 5) {
      comment += `\n*...and ${openFindings.length - 5} additional findings in report.*`;
    }
  }

  comment += `\n\n---\n*Preserve what is deliberate. Fail the PR when the page gets slow.*`;

  return comment;
}

export async function runPrAction(projectRoot: string = '.', level: RuleLevel = 2) {
  const { loadIdentity, buildIdentity, generateReportJson } = await import('@chaff/core');
  const { runSourceChecks, checkRenderedBudgets } = await import('@chaff/checks');

  let identity = await loadIdentity(projectRoot);
  if (!identity) identity = await buildIdentity(projectRoot);

  const findings = await runSourceChecks(projectRoot, identity);
  const report = generateReportJson(projectRoot, findings, identity, level);
  const gateReport = await checkRenderedBudgets(projectRoot, level);

  const commentMarkdown = formatPrComment({
    report,
    gateReport,
  });

  return {
    report,
    gateReport,
    commentMarkdown,
    passed: gateReport.passed,
  };
}
