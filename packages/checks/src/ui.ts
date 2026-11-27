import { Finding, IdentityLock } from '@chaff/core';

export function checkUiPatterns(
  filePath: string,
  content: string,
  identity: IdentityLock | null
): Finding[] {
  const findings: Finding[] = [];
  const lines = content.split(/\r?\n/);

  // 1. Purple to blue gradient tell (UI-004)
  const isPurpleWaived = identity?.waivers.some((w) => w.ruleId === 'UI-004');
  lines.forEach((line, idx) => {
    if (
      /(from-purple-\d+|to-purple-\d+|from-indigo-\d+|bg-gradient-to-[a-z]+.*purple)/i.test(
        line
      )
    ) {
      findings.push({
        id: `UI-004-${idx + 1}`,
        ruleId: 'UI-004',
        category: 'ui',
        severity: 'high',
        message: 'Purple/indigo AI glow gradient detected',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'color_hygiene',
        status: isPurpleWaived ? 'waived' : 'open',
        waiverReason: isPurpleWaived
          ? identity?.waivers.find((w) => w.ruleId === 'UI-004')?.reason
          : undefined,
      });
    }

    // 2. min-h-screen anti-pattern on mobile (UI-008)
    if (/\bmin-h-screen\b/.test(line)) {
      findings.push({
        id: `UI-008-${idx + 1}`,
        ruleId: 'UI-008',
        category: 'ui',
        severity: 'medium',
        message: 'min-h-screen causes mobile viewport jumping; use min-h-dvh',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'viewport_units',
        status: 'open',
      });
    }

    // 3. Arbitrary non-rhythm spacing values (UI-002)
    const arbitraryMatch = line.match(/\b(p|m|px|py|gap)-\[(\d+)px\]/);
    if (arbitraryMatch) {
      const pxVal = parseInt(arbitraryMatch[2], 10);
      if (pxVal % 4 !== 0) {
        findings.push({
          id: `UI-002-${idx + 1}`,
          ruleId: 'UI-002',
          category: 'ui',
          severity: 'medium',
          message: `Arbitrary spacing [${pxVal}px] violates 4/8px spatial rhythm`,
          file: filePath,
          line: idx + 1,
          evidence: line.trim(),
          fixClass: 'spacing_hygiene',
          status: 'open',
        });
      }
    }
  });

  // 4. Centered hero + 3-card grid anti-pattern (UI-001)
  if (
    content.includes('grid-cols-1 md:grid-cols-3') &&
    (content.includes('text-center') || content.includes('items-center')) &&
    content.includes('hero')
  ) {
    findings.push({
      id: `UI-001-layout`,
      ruleId: 'UI-001',
      category: 'ui',
      severity: 'high',
      message: 'Review the three equally weighted cards below the centered hero. Give the primary task more space and group supporting actions beneath it. Check that reading order on mobile still leads with the primary task.',
      file: filePath,
      line: lines.findIndex((line) => line.includes('grid-cols-1 md:grid-cols-3')) + 1,
      evidence: 'Centered hero followed by md:grid-cols-3 cards block',
      fixClass: 'editorial_layout',
      status: 'open',
    });
  }

  return findings;
}
