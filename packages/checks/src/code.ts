import { Finding, IdentityLock } from '@chaff/core';

export function checkCodePatterns(
  filePath: string,
  content: string,
  _identity: IdentityLock | null
): Finding[] {
  const findings: Finding[] = [];
  const lines = content.split(/\r?\n/);

  // 1. Non-semantic div with onClick (CODE-001) - supports multiline JSX tags
  const divOnClickMatches = content.matchAll(/<div\b([^>]*\bonClick\b[^>]*)>/gis);
  for (const m of divOnClickMatches) {
    const matchContent = m[1];
    if (!matchContent.includes('role="button"')) {
      const lineNo = content.substring(0, m.index).split(/\r?\n/).length;
      findings.push({
        id: `CODE-001-${lineNo}`,
        ruleId: 'CODE-001',
        category: 'code',
        severity: 'high',
        message: 'Non-semantic <div> used as button with onClick; use <button> or add role="button"',
        file: filePath,
        line: lineNo,
        evidence: m[0].substring(0, 80).replace(/\s+/g, ' '),
        fixClass: 'semantic_html',
        status: 'open',
      });
    }
  }

  lines.forEach((line, idx) => {
    // 2. console.log in UI components (CODE-007)
    if (/\bconsole\.log\(/.test(line) && !filePath.includes('test') && !filePath.includes('scripts')) {
      findings.push({
        id: `CODE-007-${idx + 1}`,
        ruleId: 'CODE-007',
        category: 'code',
        severity: 'low',
        message: 'Residual console.log detected in component code',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'code_hygiene',
        status: 'open',
      });
    }

    // 3. Raw <img> in Next.js projects (CODE-003)
    if (/<img\b/i.test(line) && (filePath.endsWith('.tsx') || filePath.endsWith('.jsx'))) {
      findings.push({
        id: `CODE-003-${idx + 1}`,
        ruleId: 'CODE-003',
        category: 'code',
        severity: 'medium',
        message: 'Raw <img> tag used in React component; prefer next/image or responsive <picture>',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'image_component',
        status: 'open',
      });
    }

    // 4. Client-side data fetching in useEffect (CODE-005)
    if (/\buseEffect\s*\(\s*\(\)\s*=>\s*\{[^}]*\bfetch\(/.test(line)) {
      findings.push({
        id: `CODE-005-${idx + 1}`,
        ruleId: 'CODE-005',
        category: 'code',
        severity: 'high',
        message: 'Direct fetch in useEffect anti-pattern; use Server Components or React Query/SWR',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'data_fetching',
        status: 'open',
      });
    }
  });

  return findings;
}
