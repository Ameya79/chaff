import fs from 'node:fs/promises';
import path from 'node:path';
import { RuleLevel } from './types.js';

export interface AdapterResult {
  agent: string;
  targetPath: string;
  created: boolean;
}

export async function generateAdapters(
  projectRoot: string,
  agents: string[],
  level: RuleLevel = 2
): Promise<AdapterResult[]> {
  const results: AdapterResult[] = [];

  const agentsLower = agents.map((a) => a.toLowerCase());

  // Cursor adapter
  if (agentsLower.includes('cursor') || agentsLower.includes('all')) {
    const cursorDir = path.join(projectRoot, '.cursor', 'rules');
    await fs.mkdir(cursorDir, { recursive: true });
    const target = path.join(cursorDir, 'chaff.mdc');
    const content = `---
description: Chaff design audit and level enforcement
globs: ["**/*.{tsx,jsx,ts,js,svelte,vue,astro,html,css,scss}"]
alwaysApply: true
---

# Chaff Protocol (Level ${level})
Inspect .chaff/identity.json before modifying styles.
Locked tokens must never be overridden.
Follow the 7-step autonomous protocol in CHAFF.md.
Rules available on demand from rules/.
`;
    await fs.writeFile(target, content, 'utf-8');
    results.push({ agent: 'cursor', targetPath: target, created: true });
  }

  // Windsurf adapter
  if (agentsLower.includes('windsurf') || agentsLower.includes('all')) {
    const windsurfDir = path.join(projectRoot, '.windsurf', 'rules');
    await fs.mkdir(windsurfDir, { recursive: true });
    const target = path.join(windsurfDir, 'chaff.md');
    const content = `# Chaff Protocol (Windsurf)
Operating Level: ${level}
Protocol: see CHAFF.md
Identity Lock: see .chaff/identity.json
Do not modify locked tokens. Use 'chaff gate' to verify changes.
`;
    await fs.writeFile(target, content, 'utf-8');
    results.push({ agent: 'windsurf', targetPath: target, created: true });
  }

  // Claude Code adapter
  if (agentsLower.includes('claude') || agentsLower.includes('all')) {
    const skillDir = path.join(projectRoot, '.claude', 'skills', 'chaff');
    await fs.mkdir(skillDir, { recursive: true });
    const target = path.join(skillDir, 'SKILL.md');
    const content = `---
name: chaff
description: Run Chaff design audit and enforcement protocol
---

## Chaff Protocol
See CHAFF.md for full protocol.
Run \`npx chaff audit\` to inspect for AI design tells.
Inspect .chaff/identity.json before modifying tokens.
`;
    await fs.writeFile(target, content, 'utf-8');
    results.push({ agent: 'claude', targetPath: target, created: true });
  }

  // GitHub Copilot adapter
  if (agentsLower.includes('copilot') || agentsLower.includes('all')) {
    const ghDir = path.join(projectRoot, '.github');
    await fs.mkdir(ghDir, { recursive: true });
    const target = path.join(ghDir, 'copilot-instructions.md');
    const content = `# GitHub Copilot Chaff Instructions
Follow Chaff design standards at Level ${level}.
Protocol: CHAFF.md. Identity Lock: .chaff/identity.json.
`;
    await fs.writeFile(target, content, 'utf-8');
    results.push({ agent: 'copilot', targetPath: target, created: true });
  }

  // Cline adapter
  if (agentsLower.includes('cline') || agentsLower.includes('all')) {
    const clineDir = path.join(projectRoot, '.clinerules');
    await fs.mkdir(clineDir, { recursive: true });
    const target = path.join(clineDir, 'chaff');
    const content = `# Cline Rules - Chaff Protocol
Protocol: CHAFF.md
Identity Lock: .chaff/identity.json
Active Level: ${level}
`;
    await fs.writeFile(target, content, 'utf-8');
    results.push({ agent: 'cline', targetPath: target, created: true });
  }

  // Antigravity universal pointer (AGENTS.md)
  if (agentsLower.includes('antigravity') || agentsLower.includes('all')) {
    const target = path.join(projectRoot, 'AGENTS.md');
    try {
      await fs.access(target);
      results.push({ agent: 'antigravity', targetPath: target, created: false });
    } catch {
      // generate if missing
      const content = `# AGENTS.md — Universal Chaff Protocol Pointer
Master protocol: see CHAFF.md.
Levels: see levels/level-[1-3].md.
Identity Lock: .chaff/identity.json.
`;
      await fs.writeFile(target, content, 'utf-8');
      results.push({ agent: 'antigravity', targetPath: target, created: true });
    }
  }

  return results;
}
