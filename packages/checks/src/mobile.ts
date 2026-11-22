import { Finding, IdentityLock } from '@chaff/core';

export function checkMobilePatterns(
  filePath: string,
  content: string,
  _identity: IdentityLock | null
): Finding[] {
  const findings: Finding[] = [];
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    // 1. Hardcoded desktop pixel widths exceeding 320px (MOBILE-001) - matches CSS & JSX styles
    const fixedWidthMatch = line.match(/\b(width|minWidth|min-width)['"]?\s*:\s*['"]?([4-9]\d{2}|\d{4,})px\b/i);
    const twFixedMatch = line.match(/\b(w|min-w)-\[([4-9]\d{2}|\d{4,})px\]/);
    if (fixedWidthMatch || twFixedMatch) {
      findings.push({
        id: `MOBILE-001-${idx + 1}`,
        ruleId: 'MOBILE-001',
        category: 'mobile',
        severity: 'high',
        message: 'Fixed layout width >320px causes horizontal overflow on small mobile viewports',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'responsive_width',
        status: 'open',
      });
    }

    // 2. Viewport zoom disabled (MOBILE-004)
    if (
      /content=["'][^"']*\b(user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?)\b[^"']*["']/i.test(
        line
      )
    ) {
      findings.push({
        id: `MOBILE-004-${idx + 1}`,
        ruleId: 'MOBILE-004',
        category: 'mobile',
        severity: 'high',
        message: 'Disabling viewport zoom (user-scalable=no) violates mobile accessibility guidelines',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'viewport_accessibility',
        status: 'open',
      });
    }

    // 3. Touch targets under 44px (MOBILE-002)
    if (
      /<button[^>]*\bclass(Name)?=["'][^"']*\b(w-[456]\s+h-[456]|p-0\.5|p-1\b)[^"']*["']/i.test(
        line
      ) &&
      !line.includes('p-3') &&
      !line.includes('p-4')
    ) {
      findings.push({
        id: `MOBILE-002-${idx + 1}`,
        ruleId: 'MOBILE-002',
        category: 'mobile',
        severity: 'medium',
        message: 'Interactive touch target under 44x44px mobile touch threshold',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'touch_target_dimensions',
        status: 'open',
      });
    }
  });

  return findings;
}
