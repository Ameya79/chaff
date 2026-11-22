import { Finding, IdentityLock } from '@chaff/core';

export function checkThreePatterns(
  filePath: string,
  content: string,
  _identity: IdentityLock | null
): Finding[] {
  const findings: Finding[] = [];
  const lines = content.split(/\r?\n/);

  // 1. Synchronous Three.js import in route files (THREE-001)
  const isRouteFile =
    filePath.includes('page.tsx') ||
    filePath.includes('page.jsx') ||
    filePath.includes('index.tsx') ||
    filePath.includes('index.jsx');

  if (
    isRouteFile &&
    (content.includes("from 'three'") ||
      content.includes('from "@react-three/fiber"') ||
      content.includes("from '@react-three/fiber'")) &&
    !content.includes('dynamic(') &&
    !content.includes('React.lazy(')
  ) {
    findings.push({
      id: `THREE-001-route`,
      ruleId: 'THREE-001',
      category: 'three',
      severity: 'high',
      message: 'Synchronous Three.js import in top-level route blocks critical paint and LCP; use next/dynamic with ssr: false',
      file: filePath,
      line: 1,
      evidence: 'Direct static import of three/@react-three/fiber in route',
      fixClass: 'lazy_loading',
      status: 'open',
    });
  }

  lines.forEach((line, idx) => {
    // 2. Uncapped pixel ratio (THREE-004)
    if (
      /setPixelRatio\s*\(\s*window\.devicePixelRatio\s*\)/.test(line) &&
      !line.includes('Math.min')
    ) {
      findings.push({
        id: `THREE-004-${idx + 1}`,
        ruleId: 'THREE-004',
        category: 'three',
        severity: 'high',
        message: 'Uncapped device pixel ratio triggers GPU thermal throttling and battery drain; cap at 1.5',
        file: filePath,
        line: idx + 1,
        evidence: line.trim(),
        fixClass: 'pixel_ratio_cap',
        status: 'open',
      });
    }
  });

  return findings;
}
