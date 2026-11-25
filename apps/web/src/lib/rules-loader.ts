import { cache } from 'react';
import path from 'node:path';
import fs from 'node:fs';
import { loadAllRules, Rule } from '@chaff/core';

function getRulesDir(): string {
  let cur = path.resolve(process.cwd());
  while (cur !== path.dirname(cur)) {
    const candidate = path.join(cur, 'rules');
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    cur = path.dirname(cur);
  }
  return path.resolve(process.cwd(), 'rules');
}

export const getCachedRules = cache(async (): Promise<Rule[]> => {
  return loadAllRules(getRulesDir());
});
