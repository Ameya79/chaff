import fs from 'node:fs/promises';
import path from 'node:path';
import pc from 'picocolors';
import { RuleLevel } from '@chaff/core';

export async function levelCommand(projectRoot: string, newLevelStr: string) {
  const parsed = parseInt(newLevelStr, 10);
  if (![1, 2, 3].includes(parsed)) {
    console.error(pc.red(`[Error] Invalid level '${newLevelStr}'. Valid levels are 1 (Clean), 2 (Authored), or 3 (Risk).`));
    process.exit(1);
  }

  const level = parsed as RuleLevel;
  const configPath = path.join(projectRoot, '.chaff', 'config.json');

  let config: any = { version: '1.0.0', agents: ['cursor', 'claude', 'windsurf', 'antigravity'] };
  try {
    const raw = await fs.readFile(configPath, 'utf-8');
    config = JSON.parse(raw);
  } catch {
    await fs.mkdir(path.join(projectRoot, '.chaff'), { recursive: true });
  }

  config.level = level;
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');

  const levelNames: Record<RuleLevel, string> = {
    1: 'Clean (Safe tell removal, strict diff budget)',
    2: 'Authored (3 Concept Pitches, signature interaction)',
    3: 'Risk (3D/WebGL experiences with Fallback Contract)',
  };

  console.log(pc.green(`✓ Active Chaff operational level updated to Level ${level}: ${levelNames[level]}`));
}
