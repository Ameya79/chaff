import { Finding, IdentityLock } from '@chaff/core';

const BANNED_BUZZWORDS = [
  'delve',
  'streamline',
  'seamless',
  'seamlessly',
  'cutting-edge',
  'game-changer',
  'revolutionary',
  'supercharge',
  'unleash',
  'elevate your',
  'transformative',
  'next-generation',
  'harness the power',
];

const SYNTHETIC_METRICS = [
  '99\\.9%\\s+uptime',
  '10,?000\\+\\s+(happy\\s+)?(teams|users|customers)',
  '5x\\s+faster',
  '100\\+\\s+integrations',
  '#1\\s+(platform|tool|solution)',
];

export function checkCopyPatterns(
  filePath: string,
  content: string,
  _identity: IdentityLock | null
): Finding[] {
  const findings: Finding[] = [];
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    // 1. AI Buzzwords (COPY-001)
    for (const bw of BANNED_BUZZWORDS) {
      const regex = new RegExp(`\\b${bw}\\b`, 'i');
      if (regex.test(line)) {
        findings.push({
          id: `COPY-001-${idx + 1}`,
          ruleId: 'COPY-001',
          category: 'copy',
          severity: 'high',
          message: `AI buzzword '${bw}' detected; replace with plain, specific copy`,
          file: filePath,
          line: idx + 1,
          evidence: line.trim(),
          fixClass: 'authentic_voice',
          status: 'open',
        });
        break;
      }
    }

    // 2. Synthetic Metrics (COPY-003)
    for (const sm of SYNTHETIC_METRICS) {
      const regex = new RegExp(`\\b${sm}\\b`, 'i');
      if (regex.test(line)) {
        findings.push({
          id: `COPY-003-${idx + 1}`,
          ruleId: 'COPY-003',
          category: 'copy',
          severity: 'medium',
          message: 'Round synthetic statistic detected without attribution',
          file: filePath,
          line: idx + 1,
          evidence: line.trim(),
          fixClass: 'grounded_metrics',
          status: 'open',
        });
        break;
      }
    }

    // 3. Lorem Ipsum (COPY-007)
    if (/\blorem\s+ipsum\b/i.test(line)) {
      findings.push({
        id: `COPY-007-${idx + 1}`,
        ruleId: 'COPY-007',
        category: 'copy',
        severity: 'high',
        message: 'Lorem ipsum placeholder copy detected',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'real_content',
        status: 'open',
      });
    }

    // 4. Dummy company names (COPY-004)
    if (/\b(Acme\s+Corp|Example\s+Inc|FooBar\s+LLC)\b/i.test(line)) {
      findings.push({
        id: `COPY-004-${idx + 1}`,
        ruleId: 'COPY-004',
        category: 'copy',
        severity: 'medium',
        message: 'Synthetic dummy company name detected',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'authentic_examples',
        status: 'open',
      });
    }
  });

  return findings;
}
