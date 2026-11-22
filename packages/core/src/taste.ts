import fs from 'node:fs/promises';
import path from 'node:path';

export interface TasteMemory {
  rejectedRules: string[];
  acceptedRules: string[];
  preferences: {
    fontFamily?: string;
    colorPalette?: string[];
    motionAllowed?: boolean;
    customNotes?: string[];
  };
  updatedAt: string;
}

export const DEFAULT_TASTE_MEMORY: TasteMemory = {
  rejectedRules: [],
  acceptedRules: [],
  preferences: {},
  updatedAt: new Date().toISOString(),
};

export async function loadTasteMemory(workspaceRoot: string): Promise<TasteMemory> {
  const tastePath = path.join(workspaceRoot, '.chaff', 'taste.json');
  try {
    const data = await fs.readFile(tastePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { ...DEFAULT_TASTE_MEMORY };
  }
}

export async function saveTasteMemory(workspaceRoot: string, memory: TasteMemory): Promise<void> {
  const chaffDir = path.join(workspaceRoot, '.chaff');
  await fs.mkdir(chaffDir, { recursive: true });
  memory.updatedAt = new Date().toISOString();
  await fs.writeFile(
    path.join(chaffDir, 'taste.json'),
    JSON.stringify(memory, null, 2),
    'utf-8'
  );
}

export async function recordTasteDecision(
  workspaceRoot: string,
  ruleId: string,
  decision: 'accepted' | 'rejected'
): Promise<void> {
  const memory = await loadTasteMemory(workspaceRoot);
  const normalizedId = ruleId.toUpperCase().trim();

  if (decision === 'rejected') {
    if (!memory.rejectedRules.includes(normalizedId)) {
      memory.rejectedRules.push(normalizedId);
    }
    memory.acceptedRules = memory.acceptedRules.filter((id) => id !== normalizedId);
  } else {
    if (!memory.acceptedRules.includes(normalizedId)) {
      memory.acceptedRules.push(normalizedId);
    }
    memory.rejectedRules = memory.rejectedRules.filter((id) => id !== normalizedId);
  }

  await saveTasteMemory(workspaceRoot, memory);
}
