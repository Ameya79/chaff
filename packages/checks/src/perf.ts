import { Finding, IdentityLock } from '@chaff/core';

export function checkPerfPatterns(
  filePath: string,
  content: string,
  _identity: IdentityLock | null
): Finding[] {
  const findings: Finding[] = [];
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    // 1. External Google Fonts link without display=swap (PERF-001)
    if (
      /fonts\.googleapis\.com/i.test(line) &&
      !/display=swap/i.test(line) &&
      /<link\b/i.test(line)
    ) {
      findings.push({
        id: `PERF-001-${idx + 1}`,
        ruleId: 'PERF-001',
        category: 'perf',
        severity: 'high',
        message: 'Google Fonts import missing display=swap parameter, blocking initial text render',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'font_display',
        status: 'open',
      });
    }

    // 2. Missing width/height on img elements causing layout shift (PERF-003)
    if (/<img\b/i.test(line) && !/\bwidth=/i.test(line) && !/\bheight=/i.test(line)) {
      findings.push({
        id: `PERF-003-${idx + 1}`,
        ruleId: 'PERF-003',
        category: 'perf',
        severity: 'medium',
        message: 'Image tag missing explicit width/height dimensions, triggering Cumulative Layout Shift (CLS)',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'cls_dimensions',
        status: 'open',
      });
    }
  });

  return findings;
}
