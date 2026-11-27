import fs from 'node:fs/promises';
import path from 'node:path';
import { Finding, IdentityLock } from '@chaff/core';
import { checkUiPatterns } from './ui.js';
import { checkCopyPatterns } from './copy.js';
import { checkCodePatterns } from './code.js';
import { checkPerfPatterns } from './perf.js';
import { checkMobilePatterns } from './mobile.js';
import { checkA11yPatterns } from './a11y.js';
import { checkMotionPatterns } from './motion.js';
import { checkThreePatterns } from './three.js';

export interface AuditOptions {
  routes?: string[];
  includePatterns?: string[];
  excludePatterns?: string[];
}

const DEFAULT_EXCLUDES = [
  'node_modules',
  '.git',
  '.next',
  '.svelte-kit',
  '.angular',
  '.nuxt',
  '.output',
  '.astro',
  'dist',
  'build',
  'out',
  '.turbo',
  '.cache',
  'coverage',
  '.pytest_cache',
  'chaff-report.md',
  'chaff-report.json',
  '.chaff',
  '.cursor',
  '.claude',
];

const AUDITABLE_EXTENSIONS = [
  '.tsx',
  '.jsx',
  '.ts',
  '.js',
  '.mts',
  '.svelte',
  '.vue',
  '.astro',
  '.mdx',
  '.css',
  '.scss',
  '.html',
];

export async function runSourceChecks(
  projectRoot: string,
  identity: IdentityLock | null,
  options?: AuditOptions
): Promise<Finding[]> {
  const allFindings: Finding[] = [];

  async function walk(currentDir: string): Promise<string[]> {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relPath = path.relative(projectRoot, fullPath);

      if (
        DEFAULT_EXCLUDES.some(
          (ex) =>
            entry.name === ex ||
            relPath === ex ||
            relPath.startsWith(ex) ||
            relPath.includes('/' + ex) ||
            relPath.includes('\\' + ex)
        )
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        files.push(...(await walk(fullPath)));
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (AUDITABLE_EXTENSIONS.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
    return files;
  }

  const targetFiles = await walk(projectRoot);

  for (const filePath of targetFiles) {
    const relPath = path.relative(projectRoot, filePath).replace(/\\/g, '/');
    let content = '';
    try {
      content = await fs.readFile(filePath, 'utf-8');
    } catch {
      continue;
    }

    const fileFindings: Finding[] = [
      ...checkUiPatterns(relPath, content, identity),
      ...checkCopyPatterns(relPath, content, identity),
      ...checkCodePatterns(relPath, content, identity),
      ...checkPerfPatterns(relPath, content, identity),
      ...checkMobilePatterns(relPath, content, identity),
      ...checkA11yPatterns(relPath, content, identity),
      ...checkMotionPatterns(relPath, content, identity),
      ...checkThreePatterns(relPath, content, identity),
    ];

    // Check against identity waivers
    if (identity && identity.waivers && identity.waivers.length > 0) {
      for (const f of fileFindings) {
        const matchingWaiver = identity.waivers.find(
          (w) => w.ruleId === f.ruleId
        );
        if (matchingWaiver) {
          f.status = 'waived';
          f.waiverReason = matchingWaiver.reason;
        }
      }
    }

    allFindings.push(...fileFindings);
  }

  return allFindings;
}
