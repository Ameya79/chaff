import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'yaml';
import { Rule, RuleCategory, RuleFrontmatter, RuleLevel } from './types.js';

const CATEGORIES: RuleCategory[] = [
  'ui',
  'copy',
  'code',
  'perf',
  'mobile',
  'a11y',
  'motion',
  'three',
];

export async function parseRuleFile(filePath: string): Promise<Rule> {
  const content = await fs.readFile(filePath, 'utf-8');
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!frontmatterMatch) {
    throw new Error(`Rule file ${filePath} missing YAML frontmatter delimiters`);
  }

  const rawFrontmatter = frontmatterMatch[1];
  const body = frontmatterMatch[2];
  const parsedFm = yaml.parse(rawFrontmatter) as RuleFrontmatter;

  const categoryDir = path.basename(path.dirname(filePath)) as RuleCategory;

  const extractSection = (heading: string): string => {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`^${escaped}\\s*\\r?\\n([\\s\\S]*?)(?=^## |$)`, 'm');
    const match = body.match(regex);
    return match ? match[1].trim() : '';
  };

  return {
    ...parsedFm,
    filePath,
    category: categoryDir,
    rawContent: content,
    contextProblem: extractSection('## Context & Problem'),
    detectionLogic: extractSection('## Detection Logic'),
    remediationSteps: extractSection('## Remediation Steps'),
    verification: extractSection('## Verification'),
  };
}

export async function loadAllRules(rulesDir?: string): Promise<Rule[]> {
  const resolvedDir = rulesDir || path.resolve(process.cwd(), 'rules');
  const rules: Rule[] = [];

  for (const cat of CATEGORIES) {
    const catDir = path.join(resolvedDir, cat);
    try {
      const files = await fs.readdir(catDir);
      for (const file of files) {
        if (file.endsWith('.md')) {
          const rulePath = path.join(catDir, file);
          const rule = await parseRuleFile(rulePath);
          rules.push(rule);
        }
      }
    } catch {
      // directory might not exist in some contexts
    }
  }

  return rules.sort((a, b) => a.id.localeCompare(b.id));
}

export async function getRuleById(id: string, rulesDir?: string): Promise<Rule | undefined> {
  const rules = await loadAllRules(rulesDir);
  return rules.find((r) => r.id === id);
}

export function filterRulesByLevel(rules: Rule[], level: RuleLevel): Rule[] {
  return rules.filter((r) => r.levels.includes(level));
}
