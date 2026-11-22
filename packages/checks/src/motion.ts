import { Finding, IdentityLock } from '@chaff/core';

export function checkMotionPatterns(
  filePath: string,
  content: string,
  _identity: IdentityLock | null
): Finding[] {
  const findings: Finding[] = [];
  const lines = content.split(/\r?\n/);

  // 1. Missing prefers-reduced-motion in CSS animation files (MOTION-001)
  if (
    (filePath.endsWith('.css') || filePath.endsWith('.scss')) &&
    (content.includes('@keyframes') || content.includes('animation:')) &&
    !content.includes('prefers-reduced-motion')
  ) {
    findings.push({
      id: `MOTION-001-css`,
      ruleId: 'MOTION-001',
      category: 'motion',
      severity: 'high',
      message: 'CSS keyframe animations declared without @media (prefers-reduced-motion: reduce) fallback',
      file: filePath,
      line: 1,
      evidence: 'CSS keyframes present without prefers-reduced-motion query',
      fixClass: 'reduced_motion_query',
      status: 'open',
    });
  }

  // 2. Animating layout properties (MOTION-002)
  lines.forEach((line, idx) => {
    if (
      /\btransition:\s*[^;]*(width|height|top|left|right|bottom|margin|padding)\b/i.test(line) ||
      /\btransition-(all|width|height)\b/.test(line)
    ) {
      findings.push({
        id: `MOTION-002-${idx + 1}`,
        ruleId: 'MOTION-002',
        category: 'motion',
        severity: 'medium',
        message: 'CSS transition animates layout properties triggering recalculate style and layout; use transform and opacity',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'composited_transforms',
        status: 'open',
      });
    }
  });

  return findings;
}
