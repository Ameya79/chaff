import { recordTasteDecision, loadTasteMemory } from '@chaff/core';

export async function revertCommand(
  workspaceRoot: string,
  ruleId: string,
  options?: { reason?: string }
): Promise<void> {
  const normalizedRuleId = ruleId.toUpperCase().trim();
  console.log(`\n================= CHAFF REVERT =================`);
  console.log(`Reverting fix for rule [${normalizedRuleId}] and updating Taste Memory...\n`);

  // Record rejection into .chaff/taste.json
  await recordTasteDecision(workspaceRoot, normalizedRuleId, 'rejected');
  const memory = await loadTasteMemory(workspaceRoot);

  console.log(`✓ Rule [${normalizedRuleId}] added to Taste Memory rejection list.`);
  console.log(`   Autonomous agents will no longer suggest changes matching this pattern.`);
  console.log(`   Taste Memory updated at .chaff/taste.json`);
  console.log(`   Total rejected patterns: ${memory.rejectedRules.length}`);
  console.log(`   Total accepted patterns: ${memory.acceptedRules.length}\n`);

  console.log(`Git instruction:`);
  console.log(`  To rollback the corresponding commit, run:`);
  console.log(`  git log --grep="${normalizedRuleId}" -n 1 --oneline`);
  console.log(`  git revert <commit-hash>\n`);
}
