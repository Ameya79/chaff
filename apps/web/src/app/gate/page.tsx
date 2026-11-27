import React from 'react';
import type { Metadata } from 'next';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { checkRenderedBudgets } from '@chaff/checks';
import { GateClientSimulator } from '../../components/GateClientSimulator';
import { PageHeader } from '../../components/PageHeader';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gate',
  description:
    'Live chaff gate --level 3 budgets, .next bundle telemetry, and threshold simulator.',
};

function resolveWebRoot(): string {
  const cwd = path.resolve(process.cwd());
  if (fsSync.existsSync(path.join(cwd, 'src', 'app'))) {
    return cwd;
  }
  const monorepoWeb = path.join(cwd, 'apps', 'web');
  if (fsSync.existsSync(path.join(monorepoWeb, 'src', 'app'))) {
    return monorepoWeb;
  }
  return cwd;
}

async function readCompiledBundleTelemetry(webRoot: string): Promise<{
  baselineGzipKb: number | null;
  webglGzipKb: number;
  webglSourceLabel: string;
}> {
  const nextDir = path.join(webRoot, '.next');
  let baselineGzipKb: number | null = null;
  let webglGzipKb: number | null = null;
  let webglSourceLabel = '.next lazy WebGL2 chunk';

  try {
    const appBuildRaw = await fs.readFile(path.join(nextDir, 'app-build-manifest.json'), 'utf-8');
    const appBuild = JSON.parse(appBuildRaw) as { pages?: Record<string, string[]> };
    const homeChunks = new Set<string>([
      ...(appBuild.pages?.['/layout'] ?? []),
      ...(appBuild.pages?.['/page'] ?? []),
    ]);
    const jsChunks = [...homeChunks].filter((f) => f.endsWith('.js'));
    if (jsChunks.length > 0) {
      let gz = 0;
      for (const rel of jsChunks) {
        const buf = await fs.readFile(path.join(nextDir, rel));
        gz += zlib.gzipSync(buf).length;
      }
      baselineGzipKb = Math.round((gz / 1024) * 10) / 10;
    }
  } catch {
    // .next/app-build-manifest.json unavailable prior to build
  }

  try {
    const loadableRaw = await fs.readFile(path.join(nextDir, 'react-loadable-manifest.json'), 'utf-8');
    const loadable = JSON.parse(loadableRaw) as Record<string, { files?: string[] }>;
    let gz = 0;
    let found = false;
    for (const [key, entry] of Object.entries(loadable)) {
      if (/(WinnowThreeScene|webgl|three|3d|scene|stage|canvas)/i.test(key) && Array.isArray(entry.files)) {
        for (const rel of entry.files) {
          if (rel.endsWith('.js')) {
            const buf = await fs.readFile(path.join(nextDir, rel));
            gz += zlib.gzipSync(buf).length;
            found = true;
          }
        }
      }
    }
    if (found) {
      webglGzipKb = Math.round((gz / 1024) * 10) / 10;
    }
  } catch {
    // fallback below
  }

  if (webglGzipKb === null) {
    try {
      const stageSrc = await fs.readFile(
        path.join(webRoot, 'src', 'components', 'WinnowThreeScene.tsx')
      );
      webglGzipKb = Math.round((zlib.gzipSync(stageSrc).length / 1024) * 10) / 10;
      webglSourceLabel = 'WinnowThreeScene.tsx source';
    } catch {
      webglGzipKb = 0;
    }
  }

  return { baselineGzipKb, webglGzipKb, webglSourceLabel };
}

export default async function GatePage() {
  const webRoot = resolveWebRoot();
  const gateReport = await checkRenderedBudgets(webRoot, 3);
  const bundleTelemetry = await readCompiledBundleTelemetry(webRoot);

  let auditScore = 100;
  let openCount = 0;
  let waivedCount = 0;

  try {
    const raw = await fs.readFile(path.join(webRoot, 'chaff-report.json'), 'utf-8');
    const parsed = JSON.parse(raw);
    auditScore = parsed?.summary?.totalScore ?? 100;
    openCount = parsed?.summary?.findingsCount?.open ?? 0;
    waivedCount = parsed?.summary?.findingsCount?.waived ?? 0;
  } catch {
    // Use defaults if report has not been generated yet
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20 space-y-16">
      <PageHeader
        eyebrow="chaff gate --level 3"
        title="Performance Gate"
        lead={
          <>
            Live <code className="mono">.next</code> bundle chunks and Level 3 budget telemetry.
          </>
        }
      />

      {/* Open Monumental KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-8 hairline-y">
        <div className="space-y-1 min-w-0 sheet-in" style={{ '--d': '120ms' } as React.CSSProperties}>
          <span className="font-mono text-xs text-[var(--text-dim)] block">
            Gate (L3)
          </span>
          <div className="font-display text-4xl sm:text-5xl text-[var(--status-pass)] tracking-tight">
            {gateReport.passed ? 'PASS' : 'FAIL'}
          </div>
          <span className="font-mono text-xs text-[var(--text-dim)] block">
            {gateReport.results.length - gateReport.failuresCount}/{gateReport.results.length} green
          </span>
        </div>

        <div className="space-y-1 min-w-0 sheet-in" style={{ '--d': '175ms' } as React.CSSProperties}>
          <span className="font-mono text-xs text-[var(--text-dim)] block">
            Audit Score
          </span>
          <div className="font-display text-4xl sm:text-5xl text-[var(--status-pass)] tabular-nums tracking-tight">
            {auditScore}
          </div>
          <span className="font-mono text-xs text-[var(--text-dim)] block">
            {openCount} open · {waivedCount} waived
          </span>
        </div>

        <div className="space-y-1 min-w-0 sheet-in" style={{ '--d': '230ms' } as React.CSSProperties}>
          <span className="font-mono text-xs text-[var(--text-dim)] block">
            Lazy 3D Chunk
          </span>
          <div className="font-display text-4xl sm:text-5xl text-[var(--status-pass)] tabular-nums tracking-tight">
            {bundleTelemetry.webglGzipKb} KB
          </div>
          <span className="font-mono text-xs text-[var(--text-dim)] block">
            {bundleTelemetry.webglSourceLabel} (&le; 250 KB)
          </span>
        </div>

        <div className="space-y-1 min-w-0 sheet-in" style={{ '--d': '285ms' } as React.CSSProperties}>
          <span className="font-mono text-xs text-[var(--text-dim)] block">
            Home Baseline JS
          </span>
          <div className="font-display text-4xl sm:text-5xl text-[var(--status-pass)] tabular-nums tracking-tight">
            {bundleTelemetry.baselineGzipKb !== null ? `${bundleTelemetry.baselineGzipKb} KB` : '0px'}
          </div>
          <span className="font-mono text-xs text-[var(--text-dim)] block">
            {bundleTelemetry.baselineGzipKb !== null ? 'gzip <= 170 KB' : '320px overflow'}
          </span>
        </div>
      </div>

      {/* Live Gate Table */}
      <section className="space-y-6 min-w-0 sheet-in" style={{ '--d': '240ms' } as React.CSSProperties}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-3xl text-[var(--text-main)]">
            Measured Budgets
          </h2>
          <span className="font-mono text-xs text-[var(--status-pass)]">
            {gateReport.passed ? 'All Passing' : `${gateReport.failuresCount} Failed`}
          </span>
        </div>

        <div className="w-full max-w-full overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="hairline-b text-[var(--text-dim)] uppercase">
                <th className="py-3 pr-4 whitespace-nowrap">Metric</th>
                <th className="py-3 px-3 whitespace-nowrap">Target</th>
                <th className="py-3 px-3 whitespace-nowrap">Measured</th>
                <th className="py-3 pl-3 text-right whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-line)]">
              {gateReport.results.map((r) => (
                <tr key={r.metric} className="hover:bg-[var(--bg-surface-hover)] transition-colors duration-200">
                  <td className="py-4 pr-4 font-medium text-[var(--text-main)] whitespace-nowrap">
                    {r.metric}
                  </td>
                  <td className="py-4 px-3 text-[var(--text-dim)] whitespace-nowrap">
                    {r.budget}
                  </td>
                  <td className="py-4 px-3 text-[var(--text-main)] whitespace-nowrap">
                    {r.measured}
                  </td>
                  <td className="py-4 pl-3 text-right whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-[4px] uppercase ${
                        r.status === 'pass'
                          ? 'bg-[var(--status-pass-soft)] text-[var(--status-pass)]'
                          : 'bg-[var(--status-fail-soft)] text-[var(--status-fail)]'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <GateClientSimulator />
    </div>
  );
}
