import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';
import pc from 'picocolors';
import { loadIdentity } from '@chaff/core';

export async function doctorCommand(projectRoot: string) {
  console.log(pc.bold(pc.cyan('\n[Chaff Doctor] Diagnosing workspace environment...\n')));

  // 1. Framework detection
  let framework = 'unknown';
  let router = 'unknown';
  try {
    const pkgRaw = await fs.readFile(path.join(projectRoot, 'package.json'), 'utf-8');
    const pkg = JSON.parse(pkgRaw);
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    if (deps.next) {
      framework = `Next.js ${deps.next}`;
      try {
        await fs.access(path.join(projectRoot, 'app'));
        router = 'App Router';
      } catch {
        router = 'Pages Router';
      }
    } else if (deps.vite) framework = 'Vite';
    else if (deps.astro) framework = 'Astro';
    else if (deps.remix) framework = 'Remix';
    else if (deps.react) framework = 'React';
  } catch {
    // no package.json
  }
  console.log(`${pc.bold('Framework:')} ${framework} (${router})`);

  // 2. Git status
  let gitClean = false;
  let gitBranch = 'none';
  try {
    gitBranch = execSync('git branch --show-current', {
      cwd: projectRoot,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const status = execSync('git status --porcelain', {
      cwd: projectRoot,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    gitClean = status.length === 0;
  } catch {
    // not git
  }
  console.log(`${pc.bold('Git:')} branch '${gitBranch}', status: ${gitClean ? pc.green('clean') : pc.yellow('modified')}`);

  // 3. Identity Lock
  const identity = await loadIdentity(projectRoot);
  if (identity) {
    console.log(
      `${pc.bold('Identity Lock:')} ${pc.green('present')} (.chaff/identity.json: ${identity.locked.length} locked tokens, ${identity.waivers.length} waivers)`
    );
  } else {
    console.log(`${pc.bold('Identity Lock:')} ${pc.yellow('missing')} (run 'chaff init' to create)`);
  }

  // 4. Config
  try {
    const configRaw = await fs.readFile(path.join(projectRoot, '.chaff', 'config.json'), 'utf-8');
    const cfg = JSON.parse(configRaw);
    console.log(`${pc.bold('Chaff Level:')} Level ${cfg.level} (agents: ${cfg.agents.join(', ')})`);
  } catch {
    console.log(`${pc.bold('Chaff Config:')} ${pc.yellow('not initialized')}`);
  }

  // 5. Agent Adapters present
  const adaptersChecked = [
    { name: 'Cursor (.cursor/rules/chaff.mdc)', path: '.cursor/rules/chaff.mdc' },
    { name: 'Windsurf (.windsurf/rules/chaff.md)', path: '.windsurf/rules/chaff.md' },
    { name: 'Claude Code (.claude/skills/chaff/SKILL.md)', path: '.claude/skills/chaff/SKILL.md' },
    { name: 'Universal Pointer (AGENTS.md)', path: 'AGENTS.md' },
  ];

  console.log(pc.bold('\nAgent Adapters:'));
  for (const ad of adaptersChecked) {
    try {
      await fs.access(path.join(projectRoot, ad.path));
      console.log(`  ${pc.green('✓')} ${ad.name}`);
    } catch {
      console.log(`  ${pc.dim('○')} ${ad.name} (not installed)`);
    }
  }

  console.log(pc.bold(pc.green('\n[Doctor Check Completed]\n')));
}
