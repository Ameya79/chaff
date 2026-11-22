import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';
import pc from 'picocolors';
import { buildIdentity, saveIdentity, generateAdapters, RuleLevel } from '@chaff/core';

export interface InitOptions {
  agents?: string;
  level?: string;
  force?: boolean;
}

export async function initCommand(projectRoot: string, options: InitOptions = {}) {
  console.log(pc.bold(pc.cyan('\n[Chaff Init] Initializing Chaff in workspace...')));

  // 1. Check git cleanliness unless --force
  if (!options.force) {
    try {
      const gitStatus = execSync('git status --porcelain', {
        cwd: projectRoot,
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();

      if (gitStatus.length > 0) {
        console.warn(
          pc.yellow(
            '[Warning] Git working tree has uncommitted modifications.\n' +
              'Chaff recommends initializing in a clean git working tree.\n' +
              'Use --force to initialize anyway.\n'
          )
        );
      }
    } catch {
      // Git not initialized or failed
    }
  }

  const levelNum = options.level ? (parseInt(options.level, 10) as RuleLevel) : 2;
  const level: RuleLevel = [1, 2, 3].includes(levelNum) ? levelNum : 2;

  // 2. Build Identity Lock
  console.log(pc.dim('-> Extracting deliberate design tokens into .chaff/identity.json...'));
  const identity = await buildIdentity(projectRoot);
  const idPath = await saveIdentity(projectRoot, identity);
  console.log(pc.green(`✓ Identity Lock written to ${path.relative(projectRoot, idPath)}`));
  console.log(
    pc.dim(
      `   Framework: ${identity.framework} (${identity.router} router), Styling: ${identity.styling}, Locked tokens: ${identity.locked.length}`
    )
  );

  // 3. Determine agents to configure
  const agentsList = options.agents
    ? options.agents.split(',').map((s) => s.trim().toLowerCase())
    : ['cursor', 'windsurf', 'claude', 'copilot', 'antigravity'];

  console.log(pc.dim(`-> Generating native agent adapters for: ${agentsList.join(', ')}...`));
  const adapterResults = await generateAdapters(projectRoot, agentsList, level);
  for (const res of adapterResults) {
    console.log(pc.green(`✓ Configured adapter for ${res.agent} at ${path.relative(projectRoot, res.targetPath)}`));
  }

  // 4. Save .chaff/config.json
  const config = {
    version: '1.0.0',
    level,
    agents: agentsList,
    thresholds: {
      visual: 80,
      copy: 80,
      code: 80,
      performance: 80,
    },
  };
  const configPath = path.join(projectRoot, '.chaff', 'config.json');
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
  console.log(pc.green(`✓ Chaff config saved to .chaff/config.json (Operating Level: ${level})`));

  console.log(pc.bold(pc.green('\n[Success] Chaff initialized! Next step: run `npx chaff audit` to check design.\n')));
}
