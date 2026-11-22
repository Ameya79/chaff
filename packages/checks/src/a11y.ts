import { Finding, IdentityLock } from '@chaff/core';

export function checkA11yPatterns(
  filePath: string,
  content: string,
  _identity: IdentityLock | null
): Finding[] {
  const findings: Finding[] = [];
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    // 1. Missing img alt (A11Y-001)
    if (/<img\b/i.test(line) && !/\balt=/i.test(line)) {
      findings.push({
        id: `A11Y-001-${idx + 1}`,
        ruleId: 'A11Y-001',
        category: 'a11y',
        severity: 'high',
        message: '<img> element missing required alt attribute for screen readers',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'accessible_alt',
        status: 'open',
      });
    }

    // 2. Icon button without accessible label (A11Y-002)
    if (
      /<button\b[^>]*>[^<]*<(svg|Icon|Lucide)[^>]*\/?>\s*<\/button>/i.test(line) &&
      !line.includes('aria-label') &&
      !line.includes('aria-labelledby')
    ) {
      findings.push({
        id: `A11Y-002-${idx + 1}`,
        ruleId: 'A11Y-002',
        category: 'a11y',
        severity: 'high',
        message: 'Icon button lacks accessible name (missing aria-label)',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'aria_label',
        status: 'open',
      });
    }

    // 3. Unlabeled form input (A11Y-003)
    if (
      /<input\b[^>]*type=["'](text|email|password|tel|search)["']/i.test(line) &&
      !line.includes('aria-label') &&
      !line.includes('aria-labelledby') &&
      !line.includes('id=')
    ) {
      findings.push({
        id: `A11Y-003-${idx + 1}`,
        ruleId: 'A11Y-003',
        category: 'a11y',
        severity: 'medium',
        message: 'Form input missing associated label or aria-label',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'form_label',
        status: 'open',
      });
    }
  });

  return findings;
}
